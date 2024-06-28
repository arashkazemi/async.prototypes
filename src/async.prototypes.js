/* 
  Async Prototypes
  Copyright (C) 2024 Arash Kazemi <contact.arash.kazemi@gmail.com>
  All rights reserved.

  Distributed under BSD-2-Clause License:

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL ARASH KAZEMI BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



class AsyncPrototypes 
{

    native_prototypes = null;


    static indexed_collections = [
        Array,
        Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        BigInt64Array,
        BigUint64Array,
        Float32Array,
        Float64Array
    ];



    //// api


    static init()
    {
        AsyncPrototypes.native_prototypes = {};

        for(const c of AsyncPrototypes.indexed_collections) {

            try {
                AsyncPrototypes.native_prototypes[c.name] = {
                    map: c.prototype.map,
                    every: c.prototype.every,
                    some: c.prototype.some,
                    flatMap: c.prototype.flatMap,
                    find: c.prototype.find,
                    filter: c.prototype.filter,
                    reduce: c.prototype.reduce,
                    reduceRight: c.prototype.reduceRight,
                };
            }
            catch(e) {}
        }
    }


    static registerAll()
    {
        if(AsyncPrototypes.native_prototypes===null) {
            AsyncPrototypes.init();
        }

        for(const c of AsyncPrototypes.indexed_collections) {

            try {
                c.prototype.map = AsyncPrototypes.map;
                c.prototype.every = AsyncPrototypes.every;
                c.prototype.some = AsyncPrototypes.some;
                c.prototype.find = AsyncPrototypes.find;
                c.prototype.filter = AsyncPrototypes.filter;
                c.prototype.reduce = AsyncPrototypes.reduce;
                c.prototype.reduceRight = AsyncPrototypes.reduceRight;

                if(c.name==='Array') {
                    c.prototype.flatMap = AsyncPrototypes.flatMap;
                }
            }
            catch(e) {}

        }
    }


    static unregisterAll()
    {
        for(const c of AsyncPrototypes.indexed_collections) {

            try {
                const np = AsyncPrototypes.native_prototypes[c.name];
                
                c.prototype.map = np.map;
                c.prototype.every = np.every;
                c.prototype.some = np.some;
                c.prototype.flatMap = np.flatMap;
                c.prototype.find = np.find;
                c.prototype.filter = np.filter;
                c.prototype.reduce = np.reduce;
                c.prototype.reduceRight = np.reduceRight;
            }
            catch(e) {}

        }
    }


    static hook(obj)
    {
        if(AsyncPrototypes.native_prototypes===null) {
            AsyncPrototypes.init();
        }

        const np = AsyncPrototypes.native_prototypes[obj.constructor.name];

        if(np) {
            obj.map = AsyncPrototypes.asyncMap.bind(obj);
            obj.every = AsyncPrototypes.asyncEvery.bind(obj);
            obj.some = AsyncPrototypes.asyncSome.bind(obj);
            obj.find = AsyncPrototypes.asyncFind.bind(obj);
            obj.filter = AsyncPrototypes.asyncFilter.bind(obj);
            obj.reduce = AsyncPrototypes.asyncReduce.bind(obj);
            obj.reduceRight = AsyncPrototypes.asyncReduceRight.bind(obj);

            if(obj.constructor.name==='Array') {
                obj.flatMap = AsyncPrototypes.asyncFlatMap;
            }
        }

        return obj;
    }


    static unhook(obj)
    {
        const np = AsyncPrototypes.native_prototypes[obj.constructor.name];

        if(np) {
            delete obj.map;
            delete obj.every;
            delete obj.some;
            delete obj.find;
            delete obj.filter;
            delete obj.reduce;
            delete obj.reduceRight;

            if(obj.constructor.name==='Array') {
                delete obj.flatMap;
            }
        }

        return obj;
    }




    //// internal wrappers and async functions:


    //// every

    static async asyncEvery(callback, this_arg=undefined)
    {
        // https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/

        for (let i=0; i<this.length; i++) {
            if (! (await callback.call(this_arg,this[i])))  return false;
        }
        return true;

    }

    static every(callback, this_arg=undefined)
    {
        if(callback.constructor.name==='Function') {
            return AsyncPrototypes.native_prototypes[this.constructor.name].every.call(this, callback, this_arg);
        }
        else if(callback.constructor.name==='AsyncFunction') {
            return AsyncPrototypes.asyncEvery.call(this, callback, this_arg);
        }
        else {
            throw "something is wrong with this function!";
        }
    }




    //// some

    static async asyncSome(callback, this_arg=undefined)
    {
        // https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/

        for (let i=0; i<this.length; i++) {
            if ( await callback.call(this_arg,this[i]) )  return true;
        }
        return false;
    }

    static some(callback, this_arg=undefined)
    {
        if(callback.constructor.name==='Function') {
            return AsyncPrototypes.native_prototypes[this.constructor.name].some.call(this, callback, this_arg);
        }
        else if(callback.constructor.name==='AsyncFunction') {
            return AsyncPrototypes.asyncSome.call(this, callback, this_arg);
        }
        else {
            throw "something is wrong with this function!";
        }
    }




    //// find

    static async asyncFind(callback, this_arg=undefined)
    {
        for (let i=0; i<this.length; i++) {
            if( await callback.call(this_arg, this[i]) )
                return this[i];
        }

        return undefined;
    }

    static find(callback, this_arg=undefined)
    {
        if(callback.constructor.name==='Function') {
            return AsyncPrototypes.native_prototypes[this.constructor.name].find.call(this, callback, this_arg);
        }
        else if(callback.constructor.name==='AsyncFunction') {
            return AsyncPrototypes.asyncFind.call(this, callback, this_arg);
        }
        else {
            throw "something is wrong with this function!";
        }
    }




    //// filter

    static async asyncFilter(callback, this_arg=undefined)
    {
        // https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/

        const results = await Promise.all(AsyncPrototypes.native_prototypes[this.constructor.name].map.call(this,callback));

        return this.filter((_v, index) => results[index]);
    }

    static filter(callback, this_arg=undefined)
    {
        if(callback.constructor.name==='Function') {
            return AsyncPrototypes.native_prototypes[this.constructor.name].filter.call(this, callback, this_arg);
        }
        else if(callback.constructor.name==='AsyncFunction') {
            return AsyncPrototypes.asyncFilter.call(this, callback, this_arg);
        }
        else {
            throw "something is wrong with this function!";
        }
    }




    //// map

    static async asyncMap(callback, this_arg=undefined)
    {
        const mp = AsyncPrototypes.native_prototypes[this.constructor.name].map.call(this, callback, this_arg);

        for(const i in mp) {
            mp[i] = await mp[i];
        }

        return mp;
    }

    static map(callback, this_arg=undefined)
    {
        if(callback.constructor.name==='Function') {
            return AsyncPrototypes.native_prototypes[this.constructor.name].map.call(this, callback, this_arg);
        }
        else if(callback.constructor.name==='AsyncFunction') {
            return AsyncPrototypes.asyncMap.call(this, callback, this_arg);
        }
        else {
            throw "something is wrong with this function!";
        }
    }




    //// flatMap

    static async asyncFlatMap(callback, this_arg=undefined)
    {
        const mp = AsyncPrototypes.native_prototypes[this.constructor.name].map.call(this, callback, this_arg);

        for(const i in mp) {
            mp[i] = await mp[i];
        }

        return mp.flat();
    }

    static flatMap(callback, this_arg=undefined)
    {
        if(callback.constructor.name==='Function') {
            return AsyncPrototypes.native_prototypes[this.constructor.name].flatMap.call(this, callback, this_arg);
        }
        else if(callback.constructor.name==='AsyncFunction') {
            return AsyncPrototypes.asyncFlatMap.call(this, callback, this_arg);
        }
        else {
            throw "something is wrong with this function!";
        }
    }




    //// reduce

    static async asyncReduce(callback, initial_value)
    {

        if(!this.length) {
            throw TypeError("an array with no elements cannot be reduced.");
        }

        for (let i=0; i<this.length; i++) {

            if(i===0 && arguments.length===1) {
                initial_value = this[0];
                continue;
            }

            // (accumulator, currentValue, index, array)
            initial_value = await callback.call(undefined, initial_value, this[i], i, this);
        }

        return initial_value;        
    }

    static reduce(callback, initial_value)
    {
        if(callback.constructor.name==='Function') {
            if(arguments.length===1) {
                return AsyncPrototypes.native_prototypes[this.constructor.name].reduce.call(this, callback);
            }

            return AsyncPrototypes.native_prototypes[this.constructor.name].reduce.call(this, callback, initial_value);
        }
        else if(callback.constructor.name==='AsyncFunction') {
            if(arguments.length===1) {
                return AsyncPrototypes.asyncReduce.call(this, callback);
            }
            return AsyncPrototypes.asyncReduce.call(this, callback, initial_value);
        }
        else {
            throw "something is wrong with this function!";
        }
    }




    //// reduceRight

    static async asyncReduceRight(callback, initial_value)
    {
        if(!this.length) {
            throw TypeError("an array with no elements cannot be reduced.");
        }
        
        const l = this.length-1;

        for (let i=l; i>=0; i--) {

            if(i===l && arguments.length===1) {
                initial_value = this[l];
                continue;
            }

            // (accumulator, currentValue, index, array)
            initial_value = await callback.call(undefined, initial_value, this[i], i, this);
        }

        return initial_value;        
    }

    static reduceRight(callback, initial_value)
    {
        if(callback.constructor.name==='Function') {
            if(arguments.length===1) {
                return AsyncPrototypes.native_prototypes[this.constructor.name].reduceRight.call(this, callback);
            }

            return AsyncPrototypes.native_prototypes[this.constructor.name].reduceRight.call(this, callback, initial_value);
        }
        else if(callback.constructor.name==='AsyncFunction') {
            if(arguments.length===1) {
                return AsyncPrototypes.asyncReduceRight.call(this, callback);
            }
            return AsyncPrototypes.asyncReduceRight.call(this, callback, initial_value);
        }
        else {
            throw "something is wrong with this function!";
        }
    }



}

module.exports = AsyncPrototypes;