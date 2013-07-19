"use strict";

var _ = require('underscore'),
    Util = require('./shared/util');

var DomainMap = Util.extend(Util.Base, {
    properties: [
        {field: '_map', getter: true},
        {field: '_domains', getter: true}
    ],

    /**
     * A hashtable which maintains the relations between identified domains.
     */
    _domainMappings: null,
    /**
     * All identified domains. Domains are identified by an integer.
     */
    _domains: null,
    /**
     * The actial domain map. Note that different integers do not necessarily imply disconnected domains as we have
     * potential mappings between domains.
     */
    _domainMap: null,

    create: function(config) {
        var me = this;

        me.getConfig(config, ['map']);

        me._domains = [];
        me._domainMappings = {};
        me._buildDomainMap();
    },

    /**
     * Build the domain map.
     *
     * @private
     */
    _buildDomainMap: function() {
        var me = this,
            domain,
            otherDomain,
            idx = 1;

        me._domainMap = [];
        me._domainMappings[-1] = -1;

        for (var x = 0; x < me._map.getWidth(); x++) {
            me._domainMap[x] = [];
            for (var y = 0; y < me._map.getHeight(); y++) {
                domain = -1;

                // Nothing to do if the field is not accessible
                if (me._map.fieldAccessible(x, y)) {

                    // Has the field left of us a domain assigned?
                    if (x > 0 && (otherDomain = me.getDomain(x - 1, y)) > 0) {

                        // -> Inherit the domain
                        domain = otherDomain;
                    }

                    // Has the field above us a domain assigned?
                    if (y > 0 && (otherDomain = me.getDomain(x, y - 1)) > 0) {

                        // We still have no domain -> inherit from above
                        if (domain < 0) {
                            domain = otherDomain;

                        // We have a domain -> conflict?
                        } else if (domain != otherDomain) {

                            // Conflict! -> identify the two domains
                            me._identifyDomains(domain, otherDomain);
                        }
                    }
                    // Still no domain? Start a new one
                    if (domain < 0) {
                        domain = idx++;
                        me._addDomain(domain);
                    }
                }
                me._domainMap[x][y] = domain;
            }
        }
    },

    /**
     * Get the domain of a given position. Recursively resolves all mapping relations and stores the result
     * back in the map --- this improves lookup speed.
     *
     * @param x
     * @param y
     * @returns {*}
     */
    getDomain: function(x, y) {
        var me = this,
            domain = me._domainMap[x][y];

        while (me._domainMappings[domain] != domain) domain = me._domainMappings[domain];
        me._domainMap[x][y] = domain;

        return domain;
    },

    /**
     * Add a new domain.
     *
     * @param domain
     * @private
     */
    _addDomain: function(domain) {
        var me = this;

        me._domains.push(domain);
        me._domainMappings[domain] = domain;
    },

    /**
     * Identify two domains by removing domain2 from the domain list and setting up a mapping between the two.
     *
     * @param domain1
     * @param domain2
     * @private
     */
    _identifyDomains: function(domain1, domain2) {
        var me = this;

        me._domains = _.without(me._domains, domain2);
        me._domainMappings[domain2] = domain1;
    },

    /**
     * Find a field in a given domain.
     *
     * @param domain
     * @returns {*}
     */
    findFieldInDomain: function(domain) {
        var me = this;

        for (var x = 0; x < me._map.getWidth(); x++) {
            for (var y = 0; y < me._map.getHeight(); y++) {
                if (me.getDomain(x, y) == domain) {
                    return {x: x, y: y};
                }
            }
        }

        return null;
    }
});

module.exports = DomainMap;