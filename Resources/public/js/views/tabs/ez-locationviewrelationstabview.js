/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('ez-locationviewrelationstabview', function (Y) {
    "use strict";
    /**
     * Provides the Location View View Tab view class.
     *
     * @module ez-locationviewrelationsstabview
     */
    Y.namespace('eZ');

    /**
     * The Location View View Details tab class.
     *
     * @namespace eZ
     * @class LocationViewRelationsTabView
     * @constructor
     * @extends eZ.LocationViewTabView
     */
    Y.eZ.LocationViewRelationsTabView = Y.Base.create('locationViewRelationsTabView', Y.eZ.LocationViewTabView, [Y.eZ.AsynchronousView], {
        initializer: function () {
            this._fireMethod = this._fireLoadObjectRelations;
            this._watchAttribute = 'relatedContents';

            //TODO when adding the second list (reverse relation) remove the watch attribute
            //this.after(['creatorChange', 'ownerChange'], function (e) {
            //    this.render();
            //});
        },

        render: function () {
            var container = this.get('container'),
                content = this.get('content'),
                currentVersion = content.get('currentVersion'),
                relatedContents = this._loadRelationListItems(this.get('relatedContents'));

            //TODO cleanup attributes
            container.setHTML(this.template({
                //"content": content.toJSON(),
                //"location": this.get('location').toJSON(),
                //"currentVersion": currentVersion.toJSON(),
                "relatedContents": relatedContents,
                "loadingError": this.get('loadingError'),
            }));

            return this;
        },

        //TODO comment
        _lookupRelationInfo: function(contentId) {
            return Y.Array.filter(this.get('content').get('relations'), function (relation) {
                return contentId === relation.destination;
            });
        },

        //TODO comment
        _loadRelationListItems: function (relationList) {
            var relationListToJSON = [],
                that = this;

            if (relationList){
                Y.Array.each(relationList, function (value) {
                    relationListToJSON.push({
                        content: value.toJSON(),
                        relationInfo: that._lookupRelationInfo(value.get('id'))
                    });
                });
            }

            return relationListToJSON;
        },

        /**
         * Fire the `loadObjectRelations` event to retrieve the related contents
         *
         * @method _fireLoadObjectRelations
         * @protected
         */
        _fireLoadObjectRelations: function () {
            this.fire('loadObjectRelations', {});
        },
    }, {
        ATTRS: {
            /**
             * The title of the tab
             *
             * @attribute title
             * @type {String}
             * @default "Related content"
             * @readOnly
             */
            title: {
                value: "Related content",
                readOnly: true,
            },

            /**
             * The identifier of the tab
             *
             * @attribute identifier
             * @type {String}
             * @default "relations"
             * @readOnly
             */
            identifier: {
                value: "relations",
                readOnly: true,
            },

            /**
             * The related contents of the content
             *
             * @attribute relatedContents
             * @type Array
             */
            relatedContents: {
                value: null,
            },

            /**
             * The content being displayed
             *
             * @attribute content
             * @type {eZ.Content}
             * @writeOnce
             */
            content: {
                writeOnce: 'initOnly',
            },

            /**
             * The location being displayed
             *
             * @attribute location
             * @type {eZ.Location}
             * @writeOnce
             */
            location: {
                writeOnce: 'initOnly',
            },

            /**
             * The config
             *
             * @attribute config
             * @type mixed
             * @writeOnce
             */
            config: {
                writeOnce: "initOnly",
            },
        }
    });
});
