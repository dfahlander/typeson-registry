/* eslint-disable jsdoc/require-jsdoc, chai-friendly/no-unused-expressions */

function Person (name, age, dob, isMarried) {
    name && (this.name = name);
    age && (this.age = age);
    dob && (this.dob = dob);
    isMarried && (this.isMarried = isMarried);
}
Person.prototype.name = '';
Person.prototype.age = 0;
Person.prototype.dob = new Date(1900, 0, 1);
Person.prototype.isMarried = false;

function SimulatedNonBuiltIn () { this.aaa = 5; }
SimulatedNonBuiltIn.prototype.bbb = 8;
SimulatedNonBuiltIn.prototype[Symbol.toStringTag] = 'SimulatedNonBuiltIn';

function MyCloneable (obj) {
    this.obj = obj;
    this.nonpersistentStateInfo = Math.random();
}
MyCloneable.prototype[Symbol.for('cloneEncapsulate')] = function () {
    return {obj: JSON.stringify(this.obj)};
};
MyCloneable.prototype[Symbol.for('cloneRevive')] = function (
    encapsulatedMyCloneable
) {
    return new MyCloneable(JSON.parse(encapsulatedMyCloneable.obj));
};
MyCloneable.prototype.prototypeProperty = 10;

function MyResurrectable () {
    // Empty
}

const util = {
    Person,
    SimulatedNonBuiltIn,
    MyCloneable,
    MyResurrectable
};
export default util;
