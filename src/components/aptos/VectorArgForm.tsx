import React, { ChangeEvent, useState } from 'react';
import { parseArgVal, extractVectorElementTypeTag } from './aptos-helper';

interface Props {
  typeName: string;
  vectorElType: string;
  parentIdx: number;
  updateParam: (value: any, idx: number, parameterType: string) => void;
}

type Arg = string | Arg[];

const VectorArgForm: React.FunctionComponent<Props> = ({
  typeName,
  vectorElType,
  parentIdx,
  updateParam,
}) => {
  const [args, setArgs] = useState<any[]>([]);
  // const [args, setArgs] = useState<Arg[]>([[['a', 'b'], []], [], [['c']]]);
  // const [args, setArgs] = useState<Arg[]>(["a", "b", "c"]);
  const indexMemo: number[] = [];

  const toIndices = (id: string) => {
    if (id.startsWith('vec-arg-input-bool')) {
      // "vec-arg-input-bool-0-true-0"
      return id
        .split('-')
        .filter((str) => str.trim() !== '')
        .filter((str, idx) => idx > 5)
        .map((i) => Number(i));
    }
    return id
      .slice('vec-arg-input-'.length)
      .split('-')
      .filter((str) => str.trim() !== '')
      .map((i) => Number(i));
  };

  const counterBoolElementId = (id: string) => {
    if (id.includes('true')) {
      return id.replace('true', 'false');
    } else {
      return id.replace('false', 'true');
    }
  };
  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const depth = wordCount(typeName, 'vector');
    const id = event.target.id;

    const indices = toIndices(id);
    console.log('depth', depth);
    console.log('indices', indices);

    const data = [...args];
    if (indices.length === 1) {
      if (id.includes('bool')) {
        const el: any = document.getElementById(counterBoolElementId(id));
        el.checked = !el.checked;
        data[indices[0]] = parseArgVal(id.includes('true'), extractVectorElementTypeTag(typeName));
      } else {
        data[indices[0]] = parseArgVal(event.target.value, extractVectorElementTypeTag(typeName));
      }

      setArgs(data);
      updateParam(data, parentIdx, typeName);
      return;
    }

    let el: any;
    for (let i = 0; i < indices.length - 1; i++) {
      const idx = indices[i];
      if (!el) {
        el = data[idx];
      } else if (Array.isArray(el)) {
        el = el[idx];
      }
    }

    el[indices[indices.length - 1]] = parseArgVal(
      event.target.value,
      extractVectorElementTypeTag(typeName),
    );
    setArgs([...data]);
    updateParam(data, parentIdx, typeName);
  };

  function wordCount(str: string, word: string): number {
    let depth = 0;
    let curIdx = -1;
    while (curIdx < str.length) {
      curIdx = str.indexOf(word, curIdx);
      if (curIdx === -1) {
        break;
      }
      depth++;
      curIdx = curIdx + word.length;
    }
    return depth;
  }

  const addRow = (event: any, vectorElType: string) => {
    const depth = wordCount(typeName, 'vector');
    const id = event.target.id as string;
    console.log(`id`, id);

    const indices = id
      .slice('vec-arg-add-'.length)
      .split('-')
      .filter((str) => str.trim() !== '')
      .map((i) => Number(i));
    console.log('depth', depth);
    console.log('indices', indices);

    const data = [...args];
    console.log(`data_1`, data);
    if (depth === 1) {
      if (vectorElType === 'bool') {
        data.push(true);
      } else {
        data.push('');
      }
      setArgs([...data]);
      updateParam(data, parentIdx, typeName);
      console.log(`data_2`, data);
      return;
    }

    if (indices.length === 0) {
      data.push([]);
      setArgs([...data]);
      updateParam(data, parentIdx, typeName);
      return;
    }

    let el = data as any[];
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      el = el[idx];
    }
    console.log(`el`, el);

    if (indices.length === depth - 1) {
      if (vectorElType === 'bool') {
        el.push(true);
      } else {
        el.push('');
      }
    } else {
      el.push([]);
    }

    console.log(`data_2`, data);
    setArgs(data);
    updateParam(data, parentIdx, typeName);
  };

  const removeRow = (event: any) => {
    const id = event.target.id as string;
    const indices = id
      .slice('vec-arg-remove-'.length)
      .split('-')
      .filter((str) => str.trim() !== '')
      .map((i) => Number(i));

    const data = [...args];
    let el;
    if (indices.length === 1) {
      data.splice(indices[0], 1);
      setArgs(data);
      updateParam(data, parentIdx, typeName);
      console.log(`data_2`, data);
      return;
    }

    for (let i = 0; i < indices.length - 1; i++) {
      const idx = indices[i];
      if (!el) {
        el = data[idx];
      } else if (Array.isArray(el)) {
        el = el[idx];
      }
    }
    (el as string[]).splice(indices[indices.length - 1], 1);
    console.log(`data_2`, data);
    setArgs([...data]);
    updateParam(data, parentIdx, typeName);
  };

  const render: (val: any, i: number) => any = (val: any, i: number) => {
    console.log(`@@@ val=${val}`);
    if (!Array.isArray(val)) {
      if (vectorElType === 'bool' && val === '') {
        val = true;
      }
      return vectorElType === 'bool' ? (
        <div id={`vec-arg-input-bool-${i}`}>
          <input
            id={`vec-arg-input-bool-${i}-true-${indexMemo.join('-')}`}
            type="radio"
            name={`vec-arg-input-bool-${i}-true-${indexMemo.join('-')}`}
            placeholder={vectorElType}
            defaultChecked={true}
            onChange={(event) => handleFormChange(event)}
            style={{}}
          />
          <label>true</label>
          <input
            id={`vec-arg-input-bool-${i}-false-${indexMemo.join('-')}`}
            type="radio"
            name={`vec-arg-input-bool-${i}-false-${indexMemo.join('-')}`}
            placeholder={vectorElType}
            onChange={(event) => handleFormChange(event)}
            style={{}}
          />
          <label>false</label>
          <br></br>
        </div>
      ) : (
        <div>
          <input
            id={`vec-arg-input-${indexMemo.join('-')}`}
            name="val"
            placeholder={vectorElType}
            value={val}
            onChange={(event) => handleFormChange(event)}
            style={{}}
          />
          <br></br>
        </div>
      );
    }

    return val.map((v, i) => {
      indexMemo.push(i);
      // console.log(indexMemo);
      const b = (
        <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '2em' }}>[{i}]</div>
            <div
              key={i}
              style={
                Array.isArray(v)
                  ? {
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid',
                      padding: '0.5em',
                    }
                  : {}
              }
            >
              {render(v, i)}
              {Array.isArray(v) ? (
                <button
                  key={`button-${i}`}
                  id={`vec-arg-add-${indexMemo.join('-')}`}
                  onClick={(e: any) => addRow(e, vectorElType)}
                  // style={{ width: '2em' }}
                >
                  +
                </button>
              ) : (
                <></>
              )}
            </div>
            <button id={`vec-arg-remove-${indexMemo.join('-')}`} onClick={(e) => removeRow(e)}>
              -
            </button>
          </div>
          {Array.isArray(v) ? (
            <div style={{ height: '0.5em', backgroundColor: 'white' }}></div>
          ) : (
            <></>
          )}
          {indexMemo.length === 0 ? (
            <button
              key={`button-${i}`}
              id={`vec-arg-add-${indexMemo.join('-')}`}
              onClick={(e) => addRow(e, vectorElType)}
              // style={{ width: '2em' }}
            >
              +
            </button>
          ) : (
            <></>
          )}
        </div>
      );
      indexMemo.pop();
      return b;
    });
  };

  return (
    <div>
      <div>{typeName}</div>
      <div style={{ border: '2px solid', padding: '0.5em' }}>
        {args.length === 0 ? (
          <button
            key={`button-${0}`}
            id={`add-btn-${0}`}
            onClick={(e) => addRow(e, vectorElType)}
            // style={{ width: '2em' }}
          >
            +
          </button>
        ) : (
          <div>
            {render(args, -1)}
            <button
              id={`vec-arg-add-${indexMemo.join('-')}`}
              onClick={(e) => addRow(e, vectorElType)}
              // style={{ width: '2em' }}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VectorArgForm;
