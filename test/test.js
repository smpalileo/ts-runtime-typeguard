const assert = require('assert');
const typeguard = require('../src/index');

var tg = new typeguard.Typeguard();
const testSchema = {
    'schema': {
        'type': 'object',
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
    },
    'data': {
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
};

var check = tg.checkType(testSchema, testSchema.data, 'schema');
assert(check == true, 'form does not match schema');

var mockData = {
    'yadayada': 'blabla'
}

var check = tg.checkType(testSchema, mockData, 'schema');
assert(check == false, 'form does not match schema');