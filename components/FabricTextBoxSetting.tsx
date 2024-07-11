"use client";

import { ChangeEvent, useState } from "react";
import IconSetting from "./icons/IconSetting";
import { fabric } from "fabric";

type Props = {
  attrs: FabricTextboxProperty;
  canvas: fabric.Canvas;
  removeTextbox: any;
};

export default function FabricTextBoxSetting({
  attrs,
  canvas,
  removeTextbox,
}: Props) {
  const [property, setProperty] = useState<FabricTextboxProperty>({ ...attrs });

  const activeObject = () => {
    const canvasTextbox = canvas
      ?.getObjects()
      .find((obj) => obj.name === property.name);

    if (canvasTextbox) {
      canvas.setActiveObject(canvasTextbox);
      canvas.requestRenderAll();
    }
  };

  const removeObject = () => {
    if (confirm("Are you sure to remove this text?")) {
      const canvasTextbox = canvas
        ?.getObjects()
        .find((obj) => obj.name === property.name);

      if (canvasTextbox) {
        canvas.remove(canvasTextbox);
        canvas.requestRenderAll();
        removeTextbox(property.name);
      }
    }
  };

  const setText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        text: value,
      };
    });

    const text = property.capitalize ? value.toUpperCase() : value;

    updateCanvas("text", text);
  };

  const setCapitalize = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        capitalize: checked,
      };
    });

    const text = checked ? property.text?.toUpperCase() : property.text;

    updateCanvas("text", text);
  };

  const setFontWeight = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    const value = checked ? "900" : "400";

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        fontWeight: value,
      };
    });

    updateCanvas("fontWeight", value);
  };

  const setUnderline = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        underline: checked,
      };
    });

    updateCanvas("underline", checked);
  };

  const setFontFamily = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        fontFamily: value,
      };
    });

    updateCanvas("fontFamily", value);
  };

  const setFontStyle = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    const value = checked ? "italic" : "normal";

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        fontStyle: value,
      };
    });

    updateCanvas("fontStyle", value);
  };

  const setFontSize = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        fontSize: +value,
      };
    });

    updateCanvas("fontSize", value);
  };

  const setTextAlign = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        textAlign: value,
      };
    });

    updateCanvas("textAlign", value);
  };

  const setFill = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        fill: value,
      };
    });

    updateCanvas("fill", value);
  };

  const setStroke = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        stroke: value,
      };
    });

    updateCanvas("stroke", value);
    if (property.isShadow) {
      const shadow = new fabric.Shadow({
        color: property.stroke,
        blur: 2,
        affectStroke: false
    });
    updateCanvas("shadow", shadow);
    }
  };

  const setStrokeWidth = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setProperty((prevProperty) => {
      return {
        ...prevProperty,
        strokeWidth: +value,
      };
    });

    updateCanvas("strokeWidth", +value);
  };

  const setTextEffect = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'shadown') {
      setProperty((prevProperty) => {
        return {
          ...prevProperty,
          strokeWidth: 0,
          isShadow: true,
        };
      });
      updateCanvas("strokeWidth", 0);
        const shadow = new fabric.Shadow({
          color: property.stroke,
          blur: 2,
          affectStroke: false
      });
      updateCanvas("shadow", shadow);
    } else if (value === 'stroke') {
      setProperty((prevProperty) => {
        return {
          ...prevProperty,
          strokeWidth: 1,
          isShadow: false,
        };
      });
      updateCanvas("strokeWidth", 1);
      updateCanvas("shadow", undefined);
    } else if (value === 'none') {
      setProperty((prevProperty) => {
        return {
          ...prevProperty,
          strokeWidth: 0,
          isShadow: false,
        };
      });
      updateCanvas("strokeWidth", 0);
      updateCanvas("shadow", undefined);
    }
  }

  const updateCanvas = (key: string, value: any) => {
    const canvasTextbox = canvas
      ?.getObjects()
      .find((obj) => obj.name === property.name);

    if (canvasTextbox) {
      canvas.setActiveObject(canvasTextbox);
      // @ts-ignore
      canvasTextbox.set(key, value);
      canvas.requestRenderAll();
    }
  };

  const close = () => {
    if (document?.activeElement instanceof HTMLElement) {
      document?.activeElement?.blur();
    }
  };

  return (
    <>
      <div className="flex flex-row gap-0 items-center bg-base-200 relative">
        <div className="w-full">
          <textarea
            defaultValue={property.text ?? ""}
            rows={2}
            className="text-sm w-full block border-2 border-base-200 outline-none p-1 focus:border-primary"
            onChange={(e) => setText(e)}
            onFocus={() => activeObject()}
          ></textarea>
        </div>
        <div className="flex-none">
          <div className="flex gap-2 px-2">
            <label
              className="size-6 block"
              style={{ backgroundColor: property.fill }}
            >
              <input
                type="color"
                className="size-1 opacity-0"
                value={property.fill}
                onChange={(e) => setFill(e)}
              />
            </label>
            <label
              className="size-6 block"
              style={{ backgroundColor: property.stroke }}
            >
              <input
                type="color"
                className="size-1 opacity-0"
                value={property.stroke}
                onChange={(e) => setStroke(e)}
              />
            </label>
            <div>
              <div className="dropdown dropdown-top lg:dropdown-bottom xl:dropdown-top dropdown-end ">
                <div tabIndex={1} role="button" className="hover:text-primary">
                  <IconSetting className="size-6" />
                </div>
                <div
                  tabIndex={1}
                  className="dropdown-content menu bg-base-100 z-[1] w-[350px] mt-1 shadow border border-base-300 rounded-box p-4"
                >
                  <div>
                    <div className="flex flex-wrap justify-between">
                      <label className="cursor-pointer label">
                        <input
                          type="checkbox"
                          checked={property.capitalize}
                          onChange={(e) => setCapitalize(e)}
                          className="checkbox"
                        />
                        <span className="label-text ml-2 font-bold">Caps</span>
                      </label>
                      <label className="cursor-pointer label">
                        <input
                          type="checkbox"
                          checked={
                            property.fontWeight === '900' ? true : false
                          }
                          onChange={(e) => setFontWeight(e)}
                          className="checkbox"
                        />
                        <span className="label-text ml-2 font-bold">B</span>
                      </label>
                      <label className="cursor-pointer label">
                        <input
                          type="checkbox"
                          checked={
                            property.fontStyle === "italic" ? true : false
                          }
                          onChange={(e) => setFontStyle(e)}
                          className="checkbox"
                        />
                        <span className="label-text ml-2 font-bold">I</span>
                      </label>
                      <label className="cursor-pointer label">
                        <input
                          type="checkbox"
                          checked={!!property.underline}
                          onChange={(e) => setUnderline(e)}
                          className="checkbox"
                        />
                        <span className="label-text ml-2 font-bold">U</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <div className="font-semibold text-sm mb-1">
                        Text size (<span>{property.fontSize}</span>)
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={property.fontSize}
                        step={1}
                        onChange={(e) => setFontSize(e)}
                        className="range range-xs range-secondary"
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <div className="font-semibold text-sm mb-1">Font family</div>
                        <select className="w-full select select-bordered !outline-none select-sm" value={property.fontFamily} onChange={(e) => setFontFamily(e)}>
                          <option value="Kanit">Kanit</option>
                          <option value="Bitter">Bitter</option>
                          <option value="Grenze">Grenze</option>
                          <option value="Labrada">Labrada</option>
                          <option value="Noto Sans">Noto Sans</option>
                          <option value="Petrona">Petrona</option>
                          <option value="Rokkitt">Rokkitt</option>
                          <option value="Saira">Saira</option>
                          <option value="Tourney">Tourney</option>
                          <option value="Vollkorn">Vollkorn</option>
                          <option value="Genos">Genos</option>
                        </select>
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">Text align</div>
                        <select className="w-full select select-bordered !outline-none select-sm" value={property.textAlign} onChange={(e) => setTextAlign(e)}>
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="font-semibold text-sm mb-1">Text effect</div>
                      <div className="flex items-center gap-5">
                        <label className="flex items-center gap-2">
                          <input type="radio" name={`effect_${property.name}`} className="radio" checked={property.isShadow} value={'shadown'} onChange={(e) => setTextEffect(e)}/>
                          Shadown
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name={`effect_${property.name}`} className="radio" checked={(property?.strokeWidth ?? 0) > 0}  value={'stroke'} onChange={(e) => setTextEffect(e)}/>
                          Stroke
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name={`effect_${property.name}`} className="radio" checked={!property.isShadow && !property?.strokeWidth} value={'none'} onChange={(e) => setTextEffect(e)}/>
                          None
                        </label>
                      </div>
                    </div>

                    <div className="hidden mt-4">
                      <div className="font-semibold text-sm mb-1">
                        Stroke width (<span>{property.strokeWidth}</span>)
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        value={property.strokeWidth}
                        step={0.1}
                        onChange={(e) => setStrokeWidth(e)}
                        className="range range-xs range-secondary"
                      />
                    </div>

                    <div className="mt-4 flex w-full justify-center gap-4">
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => removeObject()}
                      >
                        Remove
                      </button>
                      <button className="btn btn-secondary btn-sm min-w-32" onClick={() => close()}>OK</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
