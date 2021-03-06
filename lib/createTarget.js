"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTarget;
function find(selection, selector) {
  var result = [];

  selection.forEach(function (item) {
    var match = void 0;

    recurseChildren(item, function (childItem) {
      if (!match && testSelector(childItem, selector)) {
        match = childItem;
      }
    });

    if (match) {
      result.push(match);
    }
  });

  return convertToTarget(result);
}

function findAll(selection, selector) {
  var result = [];

  selection.forEach(function (item) {
    return recurseChildren(item, function (childItem) {
      if (testSelector(childItem, selector)) {
        result.push(childItem);
      }
    });
  });
  return convertToTarget(result);
}

function findInChildren(selection, selector) {
  var result = [];

  selection.forEach(function (item) {
    var match = void 0;
    iterateChildren(item, function (childItem) {
      if (!match && testSelector(childItem, selector)) {
        match = childItem;
      }
    });

    if (match) {
      result.push(match);
    }
  });

  return convertToTarget(result);
}

function findAllInChildren(selection, selector) {
  var result = [];

  selection.forEach(function (item) {
    return iterateChildren(item, function (childItem) {
      if (testSelector(childItem, selector)) {
        result.push(childItem);
      }
    });
  });
  return convertToTarget(result);
}

function findWithCommands(target, commands) {
  commands.forEach(function (command) {
    if (!target[command.type]) {
      throw Error("[react-gsap-enhancer] unknown command type \"" + target[command.type] + "\"");
    }
    target = target[command.type](command.selector);
  });
  return target;
}

function isMounted(item) {
  return !!item.node;
}

function testSelector(childItem) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return Object.keys(selector).every(function (selectorKey) {
    return selector[selectorKey] === childItem.props[selectorKey];
  });
}

function iterateChildren(item, callback) {
  item.children.forEach(function (childItem) {
    if (isMounted(childItem)) {
      callback(childItem);
    }
  });
}

function recurseChildren(item, callback) {
  iterateChildren(item, function (childItem) {
    callback(childItem);
    recurseChildren(childItem, callback);
  });
}

function convertToTarget(selection) {
  var target = selection.map(function (item) {
    return item.node;
  }).filter(function (node) {
    return !!node;
  });

  target.find = function (selector) {
    return find(selection, selector);
  };
  target.findAll = function (selector) {
    return findAll(selection, selector);
  };
  target.findInChildren = function (selector) {
    return findInChildren(selection, selector);
  };
  target.findAllInChildren = function (selector) {
    return findAllInChildren(selection, selector);
  };
  target.findWithCommands = function (commands) {
    return findWithCommands(target, commands);
  };

  return target;
}

function createTarget(itemTree) {
  var target = convertToTarget([{ children: itemTree }]);
  //call find so target will refer to the first node which should be the root
  return target.find();
}
//# sourceMappingURL=createTarget.js.map