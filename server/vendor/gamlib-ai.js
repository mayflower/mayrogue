/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamlib
 *
 * Description:
 *
 * gamlib.AI is a game oriented collection of AI classes in JavaScript
 *
 * Current Modules are:
 *
 * <gamlib.AStarArray> A easy to use 2 x 2 path finding array using the A* algorithm
 *
 * <gamlib.AStarMap> A more complex path finding class for 2D and 3D path finding using the A* algorithm
 *
 * Each gamlib module also includes gamlib.Utilities a collection of general utility classes:
 *
 * <gamlib.Class> For class inheritance
 *
 * <gamlib.Vector> For 2D and 3D vector math
 */
gamlib = {
};
/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamlib.AI
 *
 * gamlib.AI specific defines, variables and functions
 */
gamlib.AI = {
    /*
     * Define: gamlib.AI.STRATEGY_AVOID_STEPS
     *
     * Avoid height steps in a <gamlib.AStarArray>
     *
     * Description:
     *
     * The AI tries to avoid height differences when finding a path in <gamlib.AStarArray>.
     * If it is walking through a valley, it avoids mountains until it has no other chance,
     * once it 'climbed' a mountain, it will try to stay on that mountain, until it is forced
     * to continue in the valleys... and so on...
     */
    STRATEGY_AVOID_STEPS: 0,

    /*
     * Define: gamlib.AI.STRATEGY_IGNORE_STEPS
     *
     * Ignore height steps in a <gamlib.AStarArray>
     *
     * Description:
     *
     * The AI ignores height differences in a <gamlib.AStarArray> pathfinding
     * map and just walks over height differences as if they weren't there.
     */
    STRATEGY_IGNORE_STEPS: 1
};
/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamlib.Class
 *
 * Description:
 *
 * The basic class for inheritance
 *
 * Use this to make objects that can be extended
 *
 * Example:
 *
 * > myExtendableObject = gamlib.Class.extend({
 * >    create: function(param) {
 * >        // call super constructor
 * >        this._super(param);
 * >        // do our constructor stuff
 * >        this._par = param;
 * >    },
 * >    debug: function() {
 * >        console.log(this._par);
 * >    }
 * > });
 * > var obj = new myExtendableObject('test');
 * > obj.debug();
 */
(function() {
    var objCounter = 1;
    var creating = false;
    gamlib.Class = function(){};
    gamlib.Class.prototype.objectID = function() {
        if (typeof this.__oid == 'undefined') {
            this.__oid = objCounter++;
        }
        return this.__oid;
    };
    gamlib.Class.extend = function(prop) {
        var _super = this.prototype;
        creating = true;
        var p = new this();
        creating = false;
        for (var name in prop) {
            if ( (typeof _super[name] == 'function') && (typeof prop[name] == 'function') ) {
                p[name] = (function(name, fn){
                    return function() {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);       
                    this._super = tmp;
                   
                    return ret;
                };})(name, prop[name]);
            } else {
                p[name] = prop[name];
            }
        }
        ret = function() {
            if ( (!creating) && (typeof this.create == 'function') ) {
                this.create.apply(this, arguments);
            }
        };
        ret.prototype = p;
        ret.prototype.constructor = gamlib.Class;
        ret.extend = this.extend;
        return ret;
    };
})();
/*
 * Function: extend
 *
 * Description:
 *
 * Exend a class
 *
 * Parameters:
 *
 * A object defining the extending class
 *
 * Returns:
 *
 * A new class to be used for instancing
 *
 * Note:
 *
 * The special function 'create' is used as constructor. If you overwriting 'create'
 * you always should call 'this._super(params)' as first command in 'create'
 */
/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamlib.Vector
 *
 * Description:
 *
 * A vector class providing common operations on 3D vectors.
 *
 * Constructur:
 *
 * new gamlib.Vector(x, y, z);
 *
 * Parameters:
 *
 * x - The x part of the vector (optional)
 * y - The y part of the vector (optional)
 * z - The z part of the vector (optional)
 *
 * Extends:
 *
 * <gamlib.Class>
 *
 * Example:
 *
 * > var vec = new gamlib.Vector(1, 2, 3);
 * > console.log("Vector length: "+vec.length());
 *
 */
gamlib.Vector = gamlib.Class.extend({
        /*
         * Variable: x
         *
         * The x part of the vector
         */
        /*
         * Variable: y
         *
         * The y part of the vector
         */
        /*
         * Variable: z
         *
         * The z part of the vector
         */
        create: function(x, y, z) {
            (x) ? this.x = x : this.x = 0;
            (y) ? this.y = y : this.y = 0;
            (z) ? this.z = z : this.z = 0;
        },
        /*
         * Function: length
         *
         * Get the length of the vector
         *
         * Description
         *
         * Returns the length of the vector. Uses sqrt() to determine the correct
         * length, this may be slow. If you only need the length for comparison
         * with other vector lengths, use <gamlib.Vector.quickLength> instead.
         */
        length: function() {
            return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
        },
        /*
         * Function: quickLength
         *
         * Get a value for length comparision between two vectors
         *
         * Description
         *
         * Returns a length value for the vector that does not show the actual
         * length of the vector but can be used for comparison with other quickLength()
         * values. Is faster then <gamlib.Vector.length> but does not represent the
         * actual length of the vector.
         *
         * Example:
         *
         * > if (vec1.quickLength() > vec2.quickLength()) {
         * >    console.log('vector 1 is longer');
         * > } else {
         * >    console.log('vector 2 is longer');
         * > }
         */
        quickLength: function() {
            return this.x*this.x+this.y*this.y+this.z*this.z;
        },
        /*
         * Function: normalized
         *
         * Returns a normalized copy of the vector
         *
         * Description
         *
         * It takes a vector with any length, and calculates the x/y/z values
         * so it has a length of 1
         */
        normalized: function() {
            var ret = new gamlib.Vector();
            var l = this.length();
            ret.x = this.x/l;
            ret.y = this.y/l;
            ret.z = this.z/l;
            return ret;
        },
        /*
         * Function: substract
         *
         * Returns a new vector subtracting vector v from current vector
         *
         * Example:
         *
         * > var vec1 = new gamlib.Vector(1, 1, 1);
         * > var vec2 = new gamlib.Vector(2, 2, 2);
         * > var subtracted = vec1.subtract(vec2);
         */
        subtract: function(v) {
            var ret = new gamlib.Vector(this.x, this.y, this.z);
            ret.x -= v.x;
            ret.y -= v.y;
            ret.z -= v.z;
            return ret;
        },
        /*
         * Function: add
         *
         * Returns a new vector adding vector v to the current vector
         *
         * Example:
         *
         * > var vec1 = new gamlib.Vector(1, 1, 1);
         * > var vec2 = new gamlib.Vector(2, 2, 2);
         * > var added = vec1.add(vec2);
         */
        add: function(v) {
            var ret = new gamlib.Vector(this.x, this.y, this.z);
            ret.x += v.x;
            ret.y += v.y;
            ret.z += v.z;
            return ret;
        },
        /*
         * Function: difference
         *
         * Returns a new vector holding the difference between vector v and the current vector
         *
         * Example:
         *
         * > var vec1 = new gamlib.Vector(1, 1, 1);
         * > var vec2 = new gamlib.Vector(2, 2, 2);
         * > var diff = vec1.difference(vec2);
         */
        difference: function(v) {
            return new gamlib.Vector(v.x-this.x, v.y-this.y, v.z-this.z);
        },
        /*
         * Function: copy
         *
         * Returns a copy of the vector
         *
         * Example:
         *
         * > var vec1 = new gamlib.Vector(1, 1, 1);
         * > var vec2 = vec1.copy();
         * > vec2.x += 1;
         * > console.log(vec1.x); // will be 1
         * > console.log(vec2.x); // will be 2
         */
        copy: function() {
            return new gamlib.Vector(this.x, this.y, this.z);
        },
        /*
         * Function: distance
         *
         * Returns the distance between the current vector and vector v
         *
         * Description:
         *
         * This uses the sqrt() function which might be too slow, if you
         * just need to compare several distances, see <gamlib.Vector.quickDistance>
         * for a faster version
         *
         * Example:
         *
         * > var vec1 = new gamlib.Vector(1, 1, 1);
         * > var vec2 = new gamlib.Vector(2, 3, 4);
         * > console.log('The vectors are '+vec1.distance(vec2)+' units away');
         */
        distance: function(v) {
            var d = this.difference(v);
            return d.length();
        },
        /*
         * Function: quickDistance
         *
         * Returns a comparable distance between the current vector and vector v
         *
         * Description:
         *
         * This is faster then testing the distance with <gamlib.Vector.distance>
         * but does not give the actual distance, only a comparable value
         *
         * Example:
         *
         * > var vec1 = new gamlib.Vector(1, 1, 1);
         * > var vec2 = new gamlib.Vector(2, 3, 4);
         * > var vec3 = new gamlib.Vector(3, 4, 5);
         * > var distv1v2 = vec1.quickDistance(vec2);
         * > var distv1v3 = vec1.quickDistance(vec3);
         * > if (distv1v2 > distv1v3) {
         * >    console.log('vector 1 is closer to vector 2');
         * > } else {
         * >    console.log('vector 1 is closer to vector 3');
         * > }
         */
        quickDistance: function(v) {
            var d = this.difference(v);
            return d.quickLength();
        }

        // TODO: 3d rotate
});
/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamlib.AStarNode
 *
 * Description:
 *
 * A base class for pathfinding nodes. You can override it with your own
 * g() and h() functions
 *
 * Constructor:
 *
 * new gamlib.AStarNode(x, y, z, id);
 *
 * Parameters:
 *
 * x, y, z - The position of the way point
 * id - A unique id for this node within the pathfinding system (optional, default: autogenerated)
 */
gamlib.AStarNode = gamlib.Class.extend({
    /*
     * Variable: connected
     *
     * A array holding the connected <gamlib.AStarNode> elements
     */
    /* Variable: position
     *
     * A <gamlib.Vector> holding the position of the node
     */
    create: function(x, y, z, id) {
        this.connected = new Array();
        this.position = new gamlib.Vector(x, y, z);
        (id) ? this.id = id : this.id = this.position.x+'_'+this.position.y+'_'+this.position.z;
    },
    /* Function: g
     *
     * The path cost function, should return a value that represents
     * how hard it is to reach the current node
     *
     * Parameters:
     *
     * n - The node we are coming from
     *
     * Returns:
     *
     * Negative values - Current node can not be reached from node n
     * Positive values - Representing the costs reaching the current node from node n
     *
     * Example:
     *
     * > gamlib.AStarArrayNode = gamlib.AStarNode.extend({
     * >    create: function(x, y, z, id) {
     * >       this._super(x, y, z, id);
     * >    },
     * >    g: function(n) {
     * >       // get height difference
     * >       var diff = Math.abs(this.position.y-n.position.y);
     * >       if (diff > 10) {
     * >          return -1; // we can not step over 10 in height
     * >       }
     * >       // give it some weight so the higher the differnce, the more unlikely it is, the path will walk over it
     * >       return diff * diff;
     * >    }
     * > });
     */
    g: function(n) {
        return 1;
    },
    /* Function: h
     *
     * The heuristic estimate
     *
     * Parameters:
     *
     * n - The node we are coming from
     * t - The target of the current path find
     *
     * Returns:
     *
     * The estimated cost to the path target
     *
     * Example:
     *
     * This is the standard implementation, which returns the distance
     * to the target.
     *
     * If you have more information, like for example number of opponents
     * between target and current position, you could return a higher value
     * if too many opponants are between target and current position, so
     * the algorithm will try to avoid running directly through hordes of
     * monsters.
     *
     * > gamlib.AStarArrayNode = gamlib.AStarNode.extend({
     * >    create: function(x, y, z, id) {
     * >       this._super(x, y, z, id);
     * >    },
     * >    h: function(n, t) {
     * >       var dif = this.position.difference(t.position);
     * >       return dif.length();
     * >    }
     * > });
     */
    h: function(n, t) {
        var dif = this.position.difference(t.position);
        return dif.length();
    },
    /*
     * Function: connect
     *
     * Connect two nodes
     *
     * Parameters:
     *
     * n - The node to connect to
     * auto - true/false if automatically set up a bidirectional connection (optional, default: true)
     */
    connect: function(n, auto) {
        this.connected.push(n);
        if ( (auto) || (typeof auto == 'undefined') ) {
            n.connect(this, false);
        }
    }
});

/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamlib.AStarMap
 *
 * Description:
 *
 * A flexible 3D node based A* pathfinding system
 *
 * For a simpler to use 2D grid based system, have a look at <gamlib.AStarArray>
 *
 * Constructor:
 *
 * new gamlib.AStarMap(withFirst);
 *
 * Parameters:
 *
 * withFirst - include the first element of a path when searching (optional, default: true)
 * Example:
 *
 * Create a new path finding system and add to nodes in 3D space that are
 * connected to each other.
 *
 * > var pathFind = new gamlib.AStarMap();
 * > // create nodes in 3d space
 * > var n1 = new AStarNode(10, 2, 3);
 * > var n2 = new AStarNode(100, 50, 8);
 * > // set connection between nodes
 * > n1.connect(n2);
 * > // add the nodes to the system
 * > pathFind.add(n1);
 * > pathFind.add(n2);
 * > // find the path between two points in space
 * > var path = pathFind.find(5, 1, 2, 120, 40, 7);
 */
gamlib.AStarInfo = function(n, sW, tW, pI) {
    this.node = n;
    this.sw = sW;
    this.tw = tW;
    this.pi = pI;
};

gamlib.AStarMap = gamlib.Class.extend({
    create: function(withFirst) {
        this.nodes = new Array();
        this.returnFirst = true;

        if (typeof withFirst != 'undefined') {
            this.returnFirst = withFirst;
        }
    },
    includeFirstNode: function(withFirst) {
        this.returnFirst = withFirst;
    },

    /*
     * Function: add
     *
     * Add a <gamlib.AStarNode> to the node system
     *
     * Note:
     *
     * Keep in mind, that by just adding it, it is not connected
     * to anything. See <gamlib.AStarNode.connect>
     */
    add: function(n) {
        if (n instanceof gamlib.AStarNode) {
            this.nodes.push(n);
        }
    },

    /*
     * Function: find
     *
     * Find a path between two points in 3d space, or two <gamlib.AStarNode> elements
     *
     * Example:
     *
     * > var pathFind = new gamlib.AStarMap();
     * > // create nodes in 3d space
     * > var n1 = new AStarNode(10, 2, 3);
     * > var n2 = new AStarNode(100, 50, 8);
     * > var n3 = new AStarNode(250, 25, 8);
     * > // set connection between nodes
     * > n1.connect(n2);
     * > n2.connect(n3);
     * > // add the nodes to the system
     * > pathFind.add(n1);
     * > pathFind.add(n2);
     * > pathFind.add(n3);
     * > // find the path using the nodes instead of using 3d coordinates
     * > var path = pathFind.find(n1, n3);
     */
    find: function(nxs, nys, zs, xe, ye, ze) {
        var ret = [];
        var sn = null;
        var en = null;
        if ( (nxs instanceof gamlib.AStarNode) && (nys instanceof gamlib.AStarNode) ) {
            sn = nxs;
            en = nys;
        } else {
            sn = this.getNearest(nxs, nys, zs);
            en = this.getNearest(xe, ye, ze);
            if ( (!(sn instanceof gamlib.AStarNode)) || (!(en instanceof gamlib.AStarNode)) ) {
                return [];
            }
        }
        var ol = [new gamlib.AStarInfo(sn, 0, 0, null)];
        var yol = [];
        var cl = [];
        var found = false;

        var curr = null;
        while ( (!found) && (ol.length) ) {
            curr = ol.shift();
            if (curr.node === en) {
                found = true;
                continue;
            }
            for (var c = 0; c < curr.node.connected.length; c++) {
                var tn = curr.node.connected[c];
                var tnoid = tn.objectID();
                if ( (!yol[tnoid]) && (!cl[tnoid]) ) {
                    var gv = curr.node.g(tn);
                    if (gv < 0) {
                        continue;
                    }
                    var hv = curr.node.h(tn, en);
                    var nWeight = curr.sw+gv+hv;
                    var ins = false;
                    for (var oi = 0; oi < ol.length && ins === false; oi++) {
                        if (ol[oi].sw+ol[oi].tw > nWeight) {
                            ol.splice(oi, 0, new gamlib.AStarInfo(tn, curr.nWeight + nWeight /*curr.sw+gv */, hv, curr));
                            yol[tnoid] = true;
                            ins = true;
                        }
                    }
                    if (!ins) {
                        ol.push(new gamlib.AStarInfo(tn, curr.nWeight + nWeight /* curr.sw+gv */, hv, curr));
                        yol[tnoid] = true;
                    }
                }
            }
            cl[curr.node.objectID()] = true;
        }

        if (found) {
            while (curr.pi !== null) {
                ret.unshift(curr.node);
                curr = curr.pi;
            }
            if (this.returnFirst) {
                ret.unshift(curr.node);
            }
        }

        return ret;
    },

    getNearest: function(nx, y, z) {
        var pos = null;
        if (nx instanceof gamlib.AStarNode) {
            pos = new gamlib.AStarNode(nx.position.x, nx.position.y, nx.position.z);
        } else {
            pos = new gamlib.AStarNode(nx, y, z);
        }
        var nearestID = -1;
        var maxDist = Infinity;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id != pos.id) {
                var d = pos.position.quickDistance(this.nodes[i].position);
                if (d < maxDist) {
                    maxDist = d;
                    nearestID = i;
                }
            }
        }
        if (nearestID >= 0) {
            return this.nodes[nearestID];
        }
        return null;
    }
});
/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamlib.AStarArrayNode
 *
 * Description:
 *
 * The node information of a <gamlib.AStarArray> map
 */
gamlib.AStarArrayNode = gamlib.AStarNode.extend({
        /*
         * Variable: position
         *
         * The position information in the grid as <gamlib.Vector>
         *
         * Note:
         *
         * Only x and y fields are used in position information, z is always 0
         *
         * Example:
         *
         * > var path = myAStarArray.find(0, 0, 10, 15);
         * > if (path.length) {
         * >    console.log('First position: '+path[0].position.x+', '+path[0].position.y);
         * > }
         *
         */
        create: function(st, v, x, y, z, id) {
            this._super(x, y, z, id);
            this.strategy = st;
            this.value = v;
        },

        setValue: function(v) {
            this.value = v;
        },

        g: function(n) {
            if (this.value < 0) {
                return this.value;
            }

            var dx = (n.position.x-this.position.x);
            var dy = (n.position.y-this.position.y);
            if (this.strategy == 1) { // IgnoreSteps
                if (n.value < 0) {
                    return dx*dx+dy*dy;
                }
                return 0;
            }

            if (n.value < 0) {
                return n.value;
            }
            var dz = Math.abs(this.value-n.value);
            return dx*dx+dy*dy+dz*dz;
        }
});
/**
 * Copyright (C) 2013 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamlib.AStarArray
 *
 * Description:
 *
 * A class to simplify A* pathfinding on a 2x2 grid with a optional height field
 *
 * The single fields can have any value where negative values mean 'not walkable'
 * and positive values are interpreted debending on the path finding strategy used
 *
 * Constructor:
 *
 * new gamlib.AStarArray(w, h, diag, withFirst, strt, dflt);
 *
 * Parameters:
 *
 * w - The width of the grid
 * h - The height of the grid
 * diag - Allow diagonal steps (optional, default: false)
 * withFirst - Include the first node of the path in the result (optional, default: true)
 * strt - The path finding strategy (see below) (optional)
 * dflt - The default value for the grid fields (optional, default: 0)
 *
 * Extends:
 *
 * <gamlib.AStarMap>
 *
 * Strategy:
 *
 * There are several strategies, how the values are interpreted.
 * They only give minor differnce in the result, but in certain
 * situations it might be necessary to use a different strategy
 *
 * gamlib.AI.STRATEGY_AVOID_STEPS - (default) The algorithm tries to avoid height differences, so if you start in a valley, it will try to stay in the valley and run around mountains, until there is nothing left other then stepping on a mountain, once on the moutain, it tries to stay on it, until it has to go down to the valley again.
 *
 * gamlib.AI.STRATEGY_IGNORE_STEPS - The algorithm completely ignores height information and always tries to go straight to the target
 *
 * Example:
 *
 * The following would create a grid with 50 by 50 fields.
 * As we do not set any field values, default is 0, which means
 * perfect ground to walk on, this example would result in
 * a path that represents a straight line from upper left to
 * lower right corner of the grid.
 *
 * > var pathMap = new gamlib.AStarArray(50, 50);
 * > var result = pathMap.find(0, 0, 49, 49);
 * > for (var i = 0; i < result.length; i++) {
 * >    console.log('Step '+i+' is at 'result[i].position.x+','+result[i].position.y);
 * > }
 *
 * See:
 *
 * <gamlib.AI>
 *
 */
gamlib.AStarArray = gamlib.AStarMap.extend({
        create: function(w, h, diag, withFirst, strt, dflt) {
            this._super(withFirst);
            if (typeof strt == 'undefined') {
                this.strategy = 0;
            } else {
                this.strategy = strt;
            }

            this.width = w;
            this.height = h;
            this.setDefault(dflt);
            if (typeof diag != 'undefined') {
                this.useDiagonal = diag;
            } else {
                this.useDiagonal = false;
            }

            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    this.add(new gamlib.AStarArrayNode(this.strategy, this.defaultValue, x, y));
                }
            }
            for (var yy = 0; yy < h; yy++) {
                for (var xx = 0; xx < w; xx++) {
                    var other = null;
                    var n = this.nodes[yy*w+xx];
                    if (xx > 0) {
                        other = this.nodes[(yy)*w+(xx-1)];
                        n.connect(other, false);
                        if (this.useDiagonal) {
                            if (yy > 0) {
                                other = this.nodes[(yy-1)*w+(xx-1)];
                                n.connect(other, false);
                            }
                            if (yy < h-1) {
                                other = this.nodes[(yy+1)*w+(xx-1)];
                                n.connect(other, false);
                            }
                        }
                    }
                    if (yy > 0) {
                        other = this.nodes[(yy-1)*w+(xx)];
                        n.connect(other, false);
                    }
                    if (yy < this.height-1) {
                        other = this.nodes[(yy+1)*w+(xx)];
                        n.connect(other, false);
                    }
                    if (xx < this.width-1) {
                        other = this.nodes[(yy)*w+(xx+1)];
                        n.connect(other, false);
                        if (this.useDiagonal) {
                            if (yy > 0) {
                                other = this.nodes[(yy-1)*w+(xx+1)];
                                n.connect(other, false);
                            }
                            if (yy < h-1) {
                                other = this.nodes[(yy+1)*w+(xx+1)];
                                n.connect(other, false);
                            }
                        }
                    }
                }
            }
        },
        setDefault: function(dflt) {
                if (dflt) {
                    this.defaultValue = dflt;
                } else {
                    this.defaultValue = 0;
                }
        },
        /*
         * Function: setValue
         *
         * Set a value val in the grid on position x, y
         *
         * Description:
         *
         * Negative values are 'not walkable' while values
         * of 0 or higher are 'walkable' where depending on the
         * strategy the positive values may be interpreted as
         * height map
         *
         * Parameters:
         *
         * x - The x position in the grid
         * y - The y position in the grid
         * val - The value, where < 0 means 'not walkable' and >= 0 means 'walkable'
         */
        setValue: function(x, y, val) {
            if ( (x < this.width) && (y < this.height) ) {
                this.nodes[y*this.width+x].setValue(val);
            }
        },
        /*
         * Function: getValue
         *
         * Get the field value of position x,y in the grid
         *
         * Parameters:
         *
         * x - The x position in the grid
         * y - The y position in the grid
         */
        getValue: function(x, y) {
            if ( (x < this.width) && (y < this.height) ) {
                return this.nodes[y*this.width+x].value;
            }
            return -1;
        },
        /*
         * Function: find
         *
         * Find a path between two positions in the grid
         *
         * Parameters:
         *
         * xs - The x position of the start field
         * ys - The y position of the start field
         * xe - The x position of the end field (aka target)
         * ye - The y position of the end field (aka target)
         *
         * Returns:
         *
         * An array of <gamlib.AStarArrayNode>. If no path is
         * possible, the array has a length of 0
         */
        find: function(xs, ys, xe, ye) {
            if ( (xs instanceof gamlib.AStarNode) && (ys instanceof gamlib.AStarNode) ) {
                return this._super(xs, ys);
            }
            if ( (xs < this.width) && (ys < this.height) && (xe < this.width) && (ye < this.width) ) {
                var sn = this.nodes[ys*this.width+xs];
                var en = this.nodes[ye*this.width+xe];
                return this._super(sn, en);
            }
        }
});

module.exports = gamlib;