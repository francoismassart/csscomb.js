module.exports = {
    name: 'rule-delimiter',

    runBefore: 'strip-spaces',

    syntax: ['css', 'less', 'scss'],

    accepts: {
        string: /^[\r\n]*$/
    },

    /**
     * Processes tree node.
     * @param {String} nodeType
     * @param {node} node
     */
    process: function(nodeType, node) {
        var value  = this.getValue('rule-delimiter');
        var maxLen = node.length - 2;

        var updateNode = function(n) {
            n[1] = value + n[1].replace(/[\r\n]+/, '');
        };

        /**
         * Array of nodes we work with - rulesets and @media
         * @type {Array}
         */
        var NODES = ['ruleset', 'atruleb', 'atruler', 'atrulerq', 'atrulers',
                    'loop', 'mixin', 'unknown'];

        /**
         * Comments and spaces
         * @type {Array}
         */
        var CS = ['commentML', 'commentSL', 's'];

        for (var i = 0; i < node.length; ++i) {
            var curNode   = node[i];
            var nextNode  = node[i + 1];
            var prevNode  = node[i - 1];
            var pPrevNode = node[i - 2];

            var isAccepted = (NODES.indexOf(curNode[0]) !== -1);

            if (!isAccepted) {
                continue;
            }

            if ((i > 1) &&
                prevNode &&
                (CS.indexOf(prevNode[0]) !== -1) &&
                (!pPrevNode || (CS.indexOf(pPrevNode[0]) === -1))
            ) {
                updateNode(prevNode);
            }

            // rules for nodes coming after current
            if ((i >= maxLen) ||
                !nextNode ||
                (CS.indexOf(nextNode[0]) === -1)
            ) {
                continue;
            }

            updateNode(nextNode);
        }
    }
};