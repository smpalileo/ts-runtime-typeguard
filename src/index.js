"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeGuard = require("io-ts");
const ThrowReporter_1 = require("io-ts/lib/ThrowReporter");
const _ = require("lodash");
const Web3 = require("web3");
const web3 = new Web3();
class Typeguard {
    constructor() {
        this.optionals = {};
    }
    /***************** GENERICS *************************/
    toAscii(str){
        try {
            return JSON.parse(web3._extend.utils.toAscii(str))
        }
        catch (err) {
            console.log('Hex string invalid');
        }
    }
    toHex(str){
        try {
            return web3._extend.utils.toHex(JSON.stringify(str));
        }
        catch (err) {
            console.log('JSON input invalid');
        }
    }
    checkType(guard, data, option) {
        let typecheck = this.typeguard(guard, option);
        const result = typecheck.decode(data);
        try {
            ThrowReporter_1.ThrowReporter.report(result);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    typeguard(json, option) {
        let build, required, data, guard, formModel, partial;
        if (option === 'schema') {
            try{
                build = this.clone(json.schema.properties);
                required = this.clone(json.schema.required);
                build = this.removeButtons(build);
                formModel = typeGuard.type(this.createLiveInterface(build, true, required));
                partial = typeGuard.partial(this.optionals);
            }
            catch (error){
                console.log(error);
            }
        }
        else {
            data = this.clone(json);
        }
        (option == 'schema') ? guard = typeGuard.exact(typeGuard.intersection([formModel, partial])) : guard = typeGuard.type(this.raiseTypes(data));
        return guard;
    }
    removeButtons(build) {
        let omit = [];
        let newBuild;
        for (let key of Object.keys(build)) {
            if (build[key].type === 'button')
                omit.push(key);
        }
        newBuild = _.omit(build, omit);
        return newBuild;
    }
    clone(obj) {
        if (obj == null || typeof (obj) != 'object') {
            return obj;
        }
        var temp = new obj.constructor();
        for (var key in obj)
            temp[key] = this.clone(obj[key]);
        return temp;
    }
    /****************************************************/
    /*************** GUARDING FORM MODEL ****************/
    getTypes(obj) {
        let temp = this.clone(obj);
        for (let key of Object.keys(obj)) {
            (obj[key].enum) ? temp[key] = 'enum' : temp[key] = temp[key].type;
        }
        return temp;
    }
    guardSubmittedData(obj, clone) {
        for (let key of Object.keys(obj)) {
            switch (true) {
                case (obj[key] == "array"):
                    obj[key] = this.handleArray(key, clone[key].items);
                    break;
                case (obj[key] == "object"):
                    obj[key] = typeGuard.type(this.createLiveInterface(clone[key].properties, false, []));
                    break;
                case (obj[key] == "string" || "hidden"):
                    obj[key] = typeGuard.string;
                    break;
                case (obj[key] == "number"):
                    obj[key] = typeGuard.number;
                    break;
                case (obj[key] == "boolean"):
                    obj[key] = typeGuard.boolean;
                    break;
                case (obj[key] == "null"):
                    obj[key] = typeGuard.null;
                    break;
                case (obj[key] == "integer"):
                    obj[key] = typeGuard.Integer;
                    break;
                case (obj[key] == "enum"):
                    obj[key] = typeGuard.union(this.handleEnum(clone[key].enum));
                    break;
                default:
                    obj[key] = typeGuard.any;
                    break;
            }
        }
        return obj;
    }
    handleArray(key, arr) {
        let handle;
        for (let value of Object.values(this.guardSubmittedData(this.getTypes({ [key]: arr }), { [key]: arr }))) {
            handle = value;
        }
        return typeGuard.array(handle);
    }
    handleEnum(arr) {
        let union = [];
        for (let key in arr) {
            union[key] = typeGuard.literal(arr[key]);
        }
        return union;
    }
    createLiveInterface(build, flag, required) {
        let liveInterface = this.getTypes(build);
        let liveClone = this.clone(build);
        let omit = [];
        liveInterface = this.guardSubmittedData(liveInterface, liveClone);
        for (let key of Object.keys(liveInterface)) {
            if (required.findIndex(r => r === key) === -1 && flag == true) {
                omit.push(key);
                _.set(this.optionals, [key], liveInterface[key]);
            }
        }
        return _.omit(liveInterface, omit);
    }
    /**********************************************************************/
    /*************** GUARDING DATA MODEL **********************************/
    switchToTypeGuards(obj) {
        for (let value of Object.values(obj)) {
            switch (true) {
                case (_.isString(value)):
                    return typeGuard.string;
                case (_.isInteger(value)):
                    return typeGuard.Integer;
                case (_.isNumber(value)):
                    return typeGuard.number;
                case (_.isBoolean(value)):
                    return typeGuard.boolean;
                case (_.isNull(value)):
                    return typeGuard.null;
                case (_.isObject(value)):
                    return typeGuard.type(this.raiseTypes(value));
                default:
                    return typeGuard.any;
            }
        }
    }
    raiseTypes(obj) {
        let dataGuard = this.clone(obj);
        for (let key of Object.keys(dataGuard)) {
            if (_.isArray(dataGuard[key])) {
                (dataGuard[key].length > 0) ? dataGuard[key] = typeGuard.array(this.switchToTypeGuards({ [key]: dataGuard[key][0] })) : dataGuard[key] = typeGuard.array(typeGuard.any);
            }
            else {
                dataGuard[key] = this.switchToTypeGuards({ [key]: dataGuard[key] });
            }
        }
        return dataGuard;
    }
}
module.exports = Typeguard;
/*********************************************************************/
/* NOTES */
/**********
 * Data model guarding may cause problems with Number Types and Integer Types
 *
 * Arrays of objects not fully tested
 *
 *
**********/