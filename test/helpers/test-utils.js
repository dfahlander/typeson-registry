/**
 *
 */
class Person {
    /**
     * @param {string} [name]
     * @param {number} [age]
     * @param {Date} [dob]
     * @param {boolean} [isMarried]
     */
    constructor (name, age, dob, isMarried) {
        if (name) {
            this.name = name;
        }
        if (age) {
            this.age = age;
        }
        if (dob) {
            this.dob = dob;
        }
        if (isMarried) {
            this.isMarried = isMarried;
        }
    }
}
Person.prototype.name = '';
Person.prototype.age = 0;
Person.prototype.dob = new Date(1900, 0, 1);

// TS Bug requiring this cast??
Person.prototype.isMarried = /** @type {true} */ (false);

/**
 *
 */
class SimulatedNonBuiltIn {
    aaa = 5;

    [Symbol.toStringTag] = 'SimulatedNonBuiltIn';
}
SimulatedNonBuiltIn.prototype.bbb = 8;

/**
 * @typedef {any} ArbitraryObject
 */

/**
 *
 */
class MyCloneable {
    /**
     * @param {ArbitraryObject} obj
     */
    constructor (obj) {
        this.obj = obj;
        // eslint-disable-next-line sonarjs/pseudo-random -- Ok
        this.nonpersistentStateInfo = Math.random();
    }

    /**
     * @returns {{obj: string}}
     */
    // @ts-ignore How to fix?
    [Symbol.for('cloneEncapsulate')] = function () {
        return {obj: JSON.stringify(
            // @ts-ignore How to fix?
            this.obj
        )};
    };

    /* eslint-disable class-methods-use-this -- Testing */
    /**
     * @param {ArbitraryObject} encapsulatedMyCloneable
     * @returns {MyCloneable}
     */
    // @ts-ignore How to fix?
    [Symbol.for('cloneRevive')] = function (
        encapsulatedMyCloneable
    ) {
        return new MyCloneable(JSON.parse(encapsulatedMyCloneable.obj));
    };
    /* eslint-enable class-methods-use-this -- Testing */
}
MyCloneable.prototype.prototypeProperty = 10;

/**
 *
 */
class MyResurrectable {
    // Empty
}

export {
    Person,
    SimulatedNonBuiltIn,
    MyCloneable,
    MyResurrectable
};
