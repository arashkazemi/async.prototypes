`AsyncPrototypes` is a generic solution for the problematic behavior of some 
JavaScript callbacks that can not be executed asynchronously. An example is `Array.map` 
function. 

	const foo = [1,2,3,4];

	foo.map( x => x*x ); 

	// -> [ 1, 4, 9, 16 ]


But adding an `async` will lead to

	foo.map( async(x) => x*x );

	// -> [ Promise, Promise, Promise, Promise ]


This happens because any async function will return a `Promise` and not a value. This
problem can produce hard to find errors in case of `filter` function, as any 
Promise is a truthy value and so the filter will accept all array members.

`AsyncPrototypes` replaces the prototype functions with some elegant hooks 
that have a very small footprint. These hooks run the original prototypes when dealing
with synchronous functions. But dealing with an async one, the prototype will call
an async substitute that when called with `await` directive, its result will contain 
the final resolved results instead of the promises. 

So, after applying AsyncPrototypes, the previous example will result correctly with only 
adding an `await` :

	await foo.map( async(x) => x*x ); 

	// -> [ 1, 4, 9, 16 ]


Currently, AsyncPrototypes supports 

- map
- every
- some
- flatMap
- find
- filter
- reduce
- reduceRight

methods and fixes them in 

- Array
- Int8Array
- Uint8Array
- Uint8ClampedArray
- Int16Array
- Uint16Array
- Int32Array
- Uint32Array
- BigInt64Array
- BigUint64Array
- Float32Array
- Float64Array

objects.



# Usage

AsyncPrototypes can be installed from npm repository:
	
	npm install async.prototypes

You can also import the distribution version from the unpkg repository:

    <script src="https://unpkg.com/async.prototypes/dist/async.prototypes.min.js"></script>

In node environment you may import it with

	const AsyncPrototypes = require('async.prototype');




AsyncPrototypes has four methods:

### AsyncPrototypes.register()

For using the async prototypes, the most natural way is to call the `register` 
method once somewhere. It can be done at the beginning for convenience. It 
affects all existing objects and objects that will be created after.

	AsyncPrototypes.register();


### AsyncPrototypes.unregister()

If in some place in your code you think the registered methods would get in the way
or cause any problems, you can simply `unregister` them.

	AsyncPrototypes.unregister();

You can call register and unregister any number of times. But in case you deal with
specific objects, you may instead use `hook` and `unhook`.


### AsyncPrototypes.hook(obj)

The `hook` method is used when we only need an specific object incorporate the async
prototype methods, so instead of registering for all, you hook it:

	const foo = AsyncPrototypes.hook( new Array(1000) );


### AsyncPrototypes.unhook(obj)

Similar to the `unregister` method, but works for the hooked objects back to their
original ones:

	AsyncPrototypes.unhook( foo );



# License

Copyright (C) 2024 Arash Kazemi <contact.arash.kazemi@gmail.com>. All rights reserved.

`AsyncPrototypes` project is subject to the terms of BSD-2-Clause License. See the `LICENSE` file for more details.
