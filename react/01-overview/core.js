const effectStack = [];

function subscribe(effect, subs) {
  // 订阅关系建立
  subs.add(effect);
  // 依赖关系建立
  effect.deps.add(subs);
}

// 解除依赖关系
function cleanup(effect) {
  for (const subs of effect.deps) {
    subs.delete(effect);
  }
  effect.deps.clear();
}

function useState(value) {
  const subs = new Set();

  const getter = () => {
    const effect = effectStack[effectStack.length - 1];

    if (effect) {
      subscribe(effect, subs);
    }

    return value;
  };

  const setter = (newValue) => {
    value = newValue;
    for (const effect of [...subs]) {
      effect.execute();
    }
  };

  return [getter, setter];
}

function useEffect(callback) {
  const execute = () => {
    cleanup(effect);

    effectStack.push(effect);

    try {
      callback();
    } finally {
      effectStack.pop();
    }
  };

  const effect = {
    execute,
    deps: new Set(),
  };

  // 建立依赖关系
  execute();
}

function useMemo(callback) {
  const [v, setV] = useState();

  useEffect(() => setV(callback()));

  return v;
}

module.exports = {
  useState,
  useMemo,
  useEffect,
};
