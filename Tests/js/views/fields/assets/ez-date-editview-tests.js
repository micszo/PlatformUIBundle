/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('ez-date-editview-tests', function (Y) {
    var viewTest, registerTest, getFieldTest, getEmptyFieldTest,
        rerenderTest, dateSyncTest, calendarTest,
        Mock = Y.Mock, Assert = Y.Assert;

    viewTest = new Y.Test.Case({
        name: "eZ date editView test",

        _getFieldDefinition: function (required) {
            return {
                isRequired: required
            };
        },

        setUp: function () {
            this.field = {fieldValue: {timestamp: 465644555}};
            this.jsonContent = {};
            this.jsonContentType = {};
            this.jsonVersion = {};
            this.content = new Y.Mock();
            this.version = new Y.Mock();
            this.contentType = new Y.Mock();
            Y.Mock.expect(this.content, {
                method: 'toJSON',
                returns: this.jsonContent
            });
            Y.Mock.expect(this.version, {
                method: 'toJSON',
                returns: this.jsonVersion
            });
            Y.Mock.expect(this.contentType, {
                method: 'toJSON',
                returns: this.jsonContentType
            });

            this.view = new Y.eZ.DateEditView({
                container: '.container',
                field: this.field,
                content: this.content,
                version: this.version,
                contentType: this.contentType
            });
        },

        tearDown: function () {
            this.view.destroy();
        },

        _testAvailableVariables: function (required, expectRequired) {
            var fieldDefinition = this._getFieldDefinition(required),
                that = this;

            this.view.set('fieldDefinition', fieldDefinition);

            this.view.template = function (variables) {
                Y.Assert.isObject(variables, "The template should receive some variables");
                Y.Assert.areEqual(8, Y.Object.keys(variables).length, "The template should receive 8 variables");

                Y.Assert.areSame(
                    that.jsonContent, variables.content,
                    "The content should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    that.jsonVersion, variables.version,
                    "The version should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    that.jsonContentType, variables.contentType,
                    "The contentType should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    fieldDefinition, variables.fieldDefinition,
                    "The fieldDefinition should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    that.field, variables.field,
                    "The field should be available in the field edit view template"
                );

                Y.Assert.areSame(
                    expectRequired, variables.isRequired,
                    "the variable for the template isRequired should have the same value that the isRequired field of the fieldDefinition"
                );

                return '';
            };
            this.view.render();
        },

        "Test not required field": function () {
            this._testAvailableVariables(false, false);
        },

        "Test required field": function () {
            this._testAvailableVariables(true, true);
        },

        "Test validate no constraints new browsers": function () {
            var fieldDefinition = this._getFieldDefinition(false),
                input;

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', true);
            this.view.render();
            this.view.set('active', true);

            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "An empty input is valid"
            );

            input = Y.one('.container input');
            input.set('value', '');
            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "A empty input is valid"
            );

            input.set('value', '1986-09-08');
            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "A non empty input is valid"
            );
            /*
             This test can't be done because browser is making a
             pre-validation and is considering a bad input as empty
             input.set('value', 'blbllbl');
             Y.Assert.isFalse(
             this.view.isValid(),
             "the value should be detected as invalid"
             );
             */
        },

        "Test validate no constraints old browsers": function () {
            var fieldDefinition = this._getFieldDefinition(false),
                input;

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.set('active', true);

            input = this.view.get('container').one('input');
            input.set('value', '');

            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "A empty input is valid"
            );

            input.set('value', '1986-09-18');
            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "A non empty input is valid"
            );
            /*
             This test can't be done because browser is making a
             pre-validation and is considering a bad input as empty
             input.set('value', 'blbllbl');
             Y.Assert.isFalse(
             this.view.isValid(),
             "the value should be detected as invalid"
             );
             */
        },

        "Test validate no constraint old browsers with empty fieldValue": function () {
            var fieldDefinition = this._getFieldDefinition(false),
                input;

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.set('field', null);
            this.view.set('active', true);

            input = this.view.get('container').one('input');
            input.set('value', '');

            this.view.validate();
            Y.Assert.isNull(
                this.view.get('field'),
                "A empty input is valid"
            );

            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "A empty input is valid"
            );

            input.set('value', '1986-09-18');
            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "A non empty input is valid"
            );
        },

        "Test validate required new browsers": function () {
            var fieldDefinition = this._getFieldDefinition(true),
                input;

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', true);
            this.view.render();
            this.view.set('active', true);
            this.view.validate();

            input = Y.one('.container input');

            input.set('value', '');
            this.view.validate();
            Y.Assert.isFalse(
                this.view.isValid(),
                "A empty input is invalid"
            );

            input.set('value', '1992-09-08');
            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "A non empty input is valid"
            );
        },

        "Test validate required old browsers": function () {
            var fieldDefinition = this._getFieldDefinition(true),
                input;

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.set('active', true);

            input = Y.one('.container input');
            input.set('value', '');
            this.view.validate();

            Y.Assert.isFalse(
                this.view.isValid(),
                "A empty input is invalid"
            );

            input.set('value', '1986-08-09');
            this.view.validate();
            Y.Assert.isTrue(
                this.view.isValid(),
                "A non empty input is valid"
            );
        },

        "Test calendar update old browsers": function () {
            var fieldDefinition = this._getFieldDefinition(false),
                input,
                date = new Date();

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.set('active', true);

            input = Y.one('.container input');
            input.set('value', '1975-09-08');
            input.simulate('blur');

            Y.Assert.areSame(
                '1975-09-08',
                this.view.get('date'),
                "date attribute and input should be the same"
            );

            Y.Assert.areSame(
                Y.Date.format(Y.Date.parse(this.view.get('date')), {format: "%F"}),
                Y.Date.format(Y.Date.parse(this.view.get('calendar').get('selectedDates')), {format: "%F"}),
                "Calendar date and input should be the same"
            );

            input = Y.one('.container input');
            this.view._set('date', '');

            Y.Assert.isNull(Y.Date.parse(this.view.get('calendar').get('selectedDates')),
                'Calendar should NOT have a selected date if date is empty');

            Y.Assert.areSame(Y.Date.format(new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0), {format: "%F"}),
                Y.Date.format(Y.Date.parse(this.view.get('calendar').get('date')), {format: "%F"}),
                'The month and year shown in the calendar should be the currents one when input is empty');
        },

        "Test calendar button when calendar opened for old browsers": function () {
            var fieldDefinition = this._getFieldDefinition(false),
                that = this;

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.get('container').addClass('is-calendar-visible');

            Y.Assert.isTrue(
                this.view.get('container').hasClass('is-calendar-visible'),
                'calendar should be shown'
            );

            this.view.get('container').one('.ez-date-calendar-button').simulateGesture("tap", function () {
                that.resume(function () {

                    Y.Assert.isFalse(
                        this.view.get('container').hasClass('is-calendar-visible'),
                        'if calendar was closed, the button should have shown it'
                    );
                });
            });
            this.wait();
        },

        "Test calendar button when calendar closed for old browsers": function () {
            var fieldDefinition = this._getFieldDefinition(false),
                that = this;

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.set('active', true);

            this.view.get('container').removeClass('is-calendar-visible');

            Y.Assert.isFalse(
                this.view.get('container').hasClass('is-calendar-visible'),
                'calendar should NOT be shown'
            );

            this.view.get('container').one('.ez-date-calendar-button').simulateGesture("tap", function () {
                that.resume(function () {
                    Y.Assert.isTrue(
                        this.view.get('container').hasClass('is-calendar-visible'),
                        'if calendar was closed, the button should have shown it'
                    );
                });
            });
            this.wait();
        },

        "Test cancel button for old browsers": function () {
            var fieldDefinition = this._getFieldDefinition(false),
                that = this,
                input;

            this.view.set('fieldDefinition', fieldDefinition);
            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.set('active', true);

            input = Y.one('.container input');
            input.set('value', '1976-09-08');

            this.view.validate();
            this.view.get('container').one('.ez-date-cancel-button').simulateGesture("tap", function () {
                that.resume(function () {

                    Y.Assert.areSame(input.get('value'), '', 'input should be empty after click on cancel button');
                    Y.Assert.isNull(Y.Date.parse(this.view.get('calendar').get('selectedDates')),
                        'No date should be selected after tap on the cancel button');
                    Y.Assert.isFalse(
                        this.view.get('container').hasClass('is-calendar-visible'),
                        'Calendar should NOT be shown after tap on the cancel button'
                    );
                });
            });
            this.wait();
        },
    });

    rerenderTest = new Y.Test.Case({
        name: "eZ Date Edit View rerender test",

        _getModelMock: function () {
            var mock = new Mock();

            Mock.expect(mock, {
                method: 'toJSON',
                returns: {},
            });
            return mock;
        },

        setUp: function () {
            this.field = {fieldValue: {timestamp: 465644555}};
            this.content = this._getModelMock();
            this.version = this._getModelMock();
            this.contentType = this._getModelMock();

            this.view = new Y.eZ.DateEditView({
                container: '.container',
                field: this.field,
                content: this.content,
                version: this.version,
                contentType: this.contentType,
                fieldDefinition: {required: false},
            });
        },

        tearDown: function () {
            this.view.destroy();
        },

        "Should move the calendar to the newly generated container": function () {
            var container = this.view.get('container'),
                calendar;

            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.set('active', true);
            calendar = this.view.get('calendar');
            this.view.render();

            Assert.isTrue(
                container.one('.ez-yui-calendar-container').contains(
                    calendar.get('boundingBox')
                ),
                "The calendar should have been moved to the newly created container"
            );
        },

        "Should not do anything": function () {
            this.view.render();
            this.view.set('active', true);
            this.view.render();

            Assert.isUndefined(
                this.view.get('calendar'),
                "The calendar should not be created"
            );
        },
    });

    dateSyncTest = new Y.Test.Case({
        name: "eZ Date Edit View date attribute sync test",

        _getModelMock: function () {
            var mock = new Mock();

            Mock.expect(mock, {
                method: 'toJSON',
                returns: {},
            });
            return mock;
        },

        setUp: function () {
            this.field = {fieldValue: null};
            this.view = new Y.eZ.DateEditView({
                field: this.field,
                content: this._getModelMock(),
                version: this._getModelMock(),
                contentType: this._getModelMock(),
                fieldDefinition: {required: false},
            });
            this.view.render();
        },

        tearDown: function () {
            this.view.destroy();
        },

        "Should ignore a null field": function () {
            this.view.set('field', null);

            Assert.isUndefined(
                this.view.get('date'),
                "The `date` attribute should be undefined"
            );
        },

        "Should ignore a null fieldValue": function () {
            this.view.set('field', {fieldValue: null});

            Assert.isUndefined(
                this.view.get('date'),
                "The `date` attribute should be undefined"
            );
        },

        "Should ignore a null timetamp": function () {
            this.view.set('field', {fieldValue: {timestamp: null}});

            Assert.isUndefined(
                this.view.get('date'),
                "The `date` attribute should be undefined"
            );
        },

        "Should convert a 0 timestamp": function () {
            this.view.set('field', {fieldValue: {timestamp: 0}});

            Assert.areEqual(
                "1970-01-01", this.view.get('date'),
				"The 0 timestamp should have been converted"
            );
        },

        "Should convert a non zero timestamp": function () {
            this.view.set('field', {fieldValue: {timestamp: 86401}});

            Assert.areEqual(
                "1970-01-02", this.view.get('date'),
				"The timestamp should have been converted"
            );
        },
    });

    calendarTest = new Y.Test.Case({
        name: "eZ Date Edit View calendar test",

        _getModelMock: function () {
            var mock = new Mock();

            Mock.expect(mock, {
                method: 'toJSON',
                returns: {},
            });
            return mock;
        },

        setUp: function () {
        },

        tearDown: function () {
            this.view.destroy();
        },

        _initRenderView: function (field) {
            this.view = new Y.eZ.DateEditView({
                field: field,
                content: this._getModelMock(),
                version: this._getModelMock(),
                contentType: this._getModelMock(),
                fieldDefinition: {required: false},
            });
            this.view._set('supportsDateInput', false);
            this.view.render();
            this.view.set('active', true);
        },

        "Should ignore a null timetamp": function () {
            var date = new Date();

            this._initRenderView({fieldValue: {timestamp: null}});

            Assert.areEqual(
                Y.Date.format(date),
                Y.Date.format(this.view.get('calendar').get('selectedDates')[0]),
                "The calendar should be initialized with the current date"
            );
        },

        "Should convert a 0 timestamp": function () {
            this._initRenderView({fieldValue: {timestamp: 0}});

            Assert.areEqual(
                "1970-01-01",
                Y.Date.format(this.view.get('calendar').get('selectedDates')[0]),
                "The calendar should be initialized with the epoch date"
            );
        },

        "Should convert a non zero timestamp": function () {
            this._initRenderView({fieldValue: {timestamp: 86401}});

            Assert.areEqual(
                "1970-01-02",
                Y.Date.format(this.view.get('calendar').get('selectedDates')[0]),
                "The calendar should be initialized with the date corresponding to the timestamp"
            );
        },
    });

    Y.Test.Runner.setName("eZ Date Edit View tests");
    Y.Test.Runner.add(viewTest);
    Y.Test.Runner.add(rerenderTest);
    Y.Test.Runner.add(dateSyncTest);
    Y.Test.Runner.add(calendarTest);

    getFieldTest = new Y.Test.Case(
        Y.merge(Y.eZ.Test.GetFieldTests, {
            fieldDefinition: {isRequired: false},
            ViewConstructor: Y.eZ.DateEditView,
            filledValue: '1986-09-08',
            convertedValue: 526521600,

            _setNewValue: function () {
                this.view._set('supportsDateInput', true);
                this.view._set('date', this.filledValue);
            },

            _assertCorrectFieldValue: function (fieldValue, msg) {
                Y.Assert.isObject(fieldValue, 'the fieldValue should be an object');
                Y.Assert.areSame(this.convertedValue, fieldValue.timestamp, 'the converted date should match the fieldValue timestamp');
            },
        })
    );
    Y.Test.Runner.add(getFieldTest);

    getEmptyFieldTest = new Y.Test.Case(
        Y.merge(Y.eZ.Test.GetFieldTests, {
            fieldDefinition: {isRequired: false},
            ViewConstructor: Y.eZ.DateEditView,
            filledValue: null,

            _setNewValue: function () {
                this.view._set('supportsDateInput', true);
                this.view.get('container').one('input').set('value', this.filledValue);
            },

            _assertCorrectFieldValue: function (fieldValue, msg) {
                Y.Assert.isNull(fieldValue, 'the fieldValue should be Null');
            },
        })
    );
    Y.Test.Runner.add(getEmptyFieldTest);

    registerTest = new Y.Test.Case(Y.eZ.EditViewRegisterTest);
    registerTest.name = "Date Edit View registration test";
    registerTest.viewType = Y.eZ.DateEditView;
    registerTest.viewKey = "ezdate";
    Y.Test.Runner.add(registerTest);

}, '', {requires: ['test', 'datatype-date-format', 'getfield-tests', 'editviewregister-tests', 'ez-date-editview']});
