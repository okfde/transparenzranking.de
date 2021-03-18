export default class DefaultObj extends Object {
  constructor(getDefaultValue, ...objectConstructorArgs) {
    super(objectConstructorArgs);

    if (typeof getDefaultValue !== 'function') {
      const returnValue = getDefaultValue;
      getDefaultValue = () => returnValue;
    }

    return new Proxy(this, {
      get: function (target, key) {
        if (!Reflect.has(target, key)) {
          Reflect.set(target, key, getDefaultValue(key));
        }

        return Reflect.get(target, key);
      }
    });
  }
}
