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
        },

        render: function () {
            var container = this.get('container'),
                relatedContents = this._lookupRelationListItems(this.get('relatedContents'));

            container.setHTML(this.template({
                "relatedContents": relatedContents,
                "loadingError": this.get('loadingError'),
            }));

            return this;
        },

        /**
         * Provides the name of the relation type based on its Id
         *
         * @method _lookupRelationTypeName
         * @protected
         * @param {String} relationTypeId
         * @return {String}
         */
        _lookupRelationTypeName: function(relationTypeId) {
            if (relationTypeId === "ATTRIBUTE") {
                return "Attribute";
            }else if (relationTypeId === "EMBED") {
                return "Embed";
            }else if (relationTypeId === "COMMON") {
                return "Content level relation";
            }else {
                return "Unknown relation type";
            }
        },

        /**
         * Provides the relation information for a given content
         *
         * @method _lookupRelationInfo
         * @protected
         * @param {eZ.Content} content
         * @return {Array} of Relations struct:
         *              struct.relationTypeName: Ready to be displayed name of the relation type
         *              struct.fieldDefinitionName: Name of the field definition if any ("" if none)
         */
        _lookupRelationInfo: function(content) {
            var relationInfo = [],
                that = this,
                contentType = this.get('contentType'),
                fieldDefinitions = contentType.get('fieldDefinitions'),
                fieldDefinitionName;

            Y.Array.each(this.get('content').get('relations'), function (relation) {
                if (content.get('id') === relation.destination) {
                    fieldDefinitionName = "";

                    if (relation.type === 'ATTRIBUTE') {
                        fieldDefinitionName = fieldDefinitions[relation.fieldDefinitionIdentifier].names[content.get('mainLanguageCode')];
                    }

                    relationInfo.push({
                        relationTypeName: that._lookupRelationTypeName(relation.type),
                        fieldDefinitionName: fieldDefinitionName,
                    });
                }
            });

            return relationInfo;
        },

        /**
         * Provides items for the relation list
         *
         * @method _lookupRelationListItems
         * @protected
         * @param {ez.Content[]} relationList List of related content
         * @return {Array} of RelationsListItems struct:
         *              struct.content: JSONified related content
         *              struct.relationInfo.relationTypeName: Ready to be displayed name of the relation type
         *              struct.relationInfo.fieldDefinitionName: Name of the field definition if any ("" if none)
         */
        _lookupRelationListItems: function (relationList) {
            var relationListToJSON = [],
                that = this;

            if (relationList){
                Y.Array.each(relationList, function (content) {
                    relationListToJSON.push({
                        content: content.toJSON(),
                        relationInfo: that._lookupRelationInfo(content),
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
             * The content type of the content being displayed
             *
             * @attribute contentType
             * @type {eZ.ContentType}
             * @writeOnce
             */
            contentType: {
                writeOnce: "initOnly",
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
