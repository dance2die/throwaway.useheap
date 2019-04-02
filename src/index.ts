import React from "react";

// const log = console.log;

type Value = number;
const enum ActionType {
  Add = "ADD",
  Remove = "REMOVE"
}

type Action = { type: ActionType.Add; payload: { value: Value } };

// In-line swap: https://stackoverflow.com/a/16201730/4035
function swap(values: Value[], i1: number, i2: number): Value[] {
  // log(`       swap Before => ${values}, i1=${i1}, i2=${i2}`);
  // values[i2] = [values[i1], (values[i1] = values[i2])][0];
  // log(`       swap AFTER => ${values}, i1=${i1}, i2=${i2}`);
  //          0, 1, 2, 3, 4, 5, 6
  // values=[10,20,30,40,50,60,70], i1=1 (20), i2=4(50) then
  // [10], [?], [30, 40], [?], [60, 70]

  const left = values.slice(0, i1);
  const middle = values.slice(i1 + 1, i2);
  const right = values.slice(i2 + 1);

  // log(
  //   `values=${values}, i1=${i1}, i2=${i2}, left, values[i2], middle, values[i1], right`,
  //   left,
  //   values[i2],
  //   middle,
  //   values[i1],
  //   right
  // );

  return [...left, values[i2], ...middle, values[i1], ...right];
}

const getParentIndex = (childIndex: number): number => ~~((childIndex - 1) / 2);
const hasParent = (childIndex: number): boolean =>
  getParentIndex(childIndex) >= 0;
const getParent = (values: Value[], childIndex: number): Value =>
  values[getParentIndex(childIndex)];

function heapifyUp(values: Value[]) {
  let heapedValues = [...values];
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
    heapedValues = swap(heapedValues, parentIndex, index);
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
