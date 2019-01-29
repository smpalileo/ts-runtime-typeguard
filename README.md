# ts-runtime-typeguard

This package is primarily intended for use with the Angular6-json-schema-form package (npmjs.com/package/angular6-json-schema-form)

Using gcanti's io-ts dependency (github.com/gcanti/io-ts), this module runs through a json form schema and builds
a runtime interface by wrapping the properties in classes that act as runtime types

It can also be used for data-to-data comparison.

*This dependency cannot use typescript interfaces, it can only use json/objects.*

# Usage 

const typeguard = require('../src/index');

var tg = new typeguard.Typeguard();

var schema = {
    'properties': {
            'first_name': { 'type': 'string' },
            'last_name': { 'type': 'string' },
            'address': {
                'type': 'object',
                'properties': {
                    'street_1': { 'type': 'string' },
                    'city': { 'type': 'string' },
                    'state': {
                        'type': 'string',
                        'enum': ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE',
                            'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA',
                            'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS',
                            'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
                            'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD',
                            'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']
                    },
                    'zip_code': { 'type': 'string' }
                }
            },
            'birthday': { 'type': 'string' },
            'phone_numbers': { 'type': 'string' },
            'notes': { 'type': 'string' }
        },
    'required': ['last_name']
}

var data = {
        'first_name': 'Jane',
        'last_name': 'Doe',
        'address': {
            'street_1': '123 Main St.',
            'city': 'Las Vegas',
            'state': 'NV',
            'zip_code': '89123'
        },
        'birthday': '1999-09-09',
        'phone_numbers': '702-123-4567',
        'notes': '(This is an example of an uninteresting note.)'
    }

var check = tg.checkType(schema, data, 'schema');

check will either be true or false

For data-to-data matching:

var data1 = {
        'first_name': 'Jane',
        'last_name': 'Doe',
        'address': {
            'street_1': '123 Main St.',
            'city': 'Las Vegas',
            'state': 'NV',
            'zip_code': '89123'
        },
        'birthday': '1999-09-09',
        'phone_numbers': '702-123-4567',
        'notes': '(This is an example of an uninteresting note.)'
    }

var data2 = {
        'first_name': 'Jane',
        'last_name': 'Doe',
        'birthday': '1999-09-09',
        'phone_numbers': '702-123-4567',
        'notes': '(This is an example of an uninteresting note.)'
    }

var check = tg.checkType(data1, data2, 'data');