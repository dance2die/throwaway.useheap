import React from "react";

// const log = console.log;

type Value = number;
const enum ActionType {
  Add = "ADD",
  Remove = "REMOVE"
}

type Action = { type: ActionType.Add; payload: { value: Value } };

// In-line swap: https://stackoverflow.com/a/16201730/4035
function swap(values: Value[], i1: number, i2: number) {
  // log(`       swap Before => ${values}, i1=${i1}, i2=${i2}`);
  values[i2] = [values[i1], (values[i1] = values[i2])][0];
  // log(`       swap AFTER => ${values}, i1=${i1}, i2=${i2}`);
}

const getParentIndex = (childIndex: number): number => ~~((childIndex - 1) / 2);
const hasParent = (childIndex: number): boolean =>
  getParentIndex(childIndex) >= 0;
const getParent = (values: Value[], childIndex: number): Value =>
  values[getParentIndex(childIndex)];

function heapifyUp(values: Value[]) {
  const heapedValues = [...values];
  let index = heapedValues.length - 1;
  // log(
  //   `index=${index},
  //   getParentIndex(index)=${getParentIndex(index)},
  //   hasParent(index)=${hasParent(index)},
  //   getParent(heapedValues, index)=${getParent(heapedValues, index)},
  //   heapedValues[index]=${heapedValues[index]}`,
  //   heapedValues
  // );

  while (
    hasParent(index) &&
    getParent(heapedValues, index) > heapedValues[index]
  ) {
    // log(`while curr=${heapedValues[index]} index=${index}`);
    const parentIndex = getParentIndex(index);
    swap(heapedValues, parentIndex, index);
    index = parentIndex;
  }

  // log(`   heapifyup result ===>`, heapedValues);
  return heapedValues;
}

function addValue(values: Value[], value: Value) {
  return heapifyUp([...values, value]);
}

function reducer(state: Value[], action: Action): Value[] {
  switch (action.type) {
    case ActionType.Add:
      const newValues = addValue(state, action.payload.value);
      return [...newValues];
    default:
      throw new Error("No");
  }
}

function useMinHeap(initialValues: Value[] = []) {
  const [values, dispatch] = React.useReducer(
    reducer,
    initialValues,
    initializer
  );
  const freshValues = React.useRef(values);
  freshValues.current = values;

  function initializer(values: Value[]): Value[] {
    return values.reduce((acc, value) => addValue(acc, value), [] as Value[]);
  }

  function dump() {
    return freshValues.current;
  }

  function add(value: Value) {
    dispatch({ type: ActionType.Add, payload: { value } });
  }

  return { dump, add };
}

export { useMinHeap };
