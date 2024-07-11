"use client";

import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { fabric } from "fabric";
import FabricTextBoxSetting from "./FabricTextBoxSetting";
import MemeGeneratorList from "./MemeGeneratorList";
import { scrollToDiv } from "@/utils";
import "@/assets/css/fonts.css";
import IconDownload from "./icons/IconDownload";
import IconDelete from "./icons/IconDelete";

interface Props {}

export type MemeGeneratorRef = {
  getMeme: () => Promise<string | null | undefined>;
};

// eslint-disable-next-line react/display-name
const MemeGenerator = forwardRef<MemeGeneratorRef, Props>((props, ref) => {
  const t = useTranslations("");
  const [imagesSelected, setImagesSelected] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [textboxes, setTextboxes] = useState<FabricTextboxProperty[]>([]);
  const [loading, setLoading] = useState(false);

  const addMemeImageToCanvas = (canvas: fabric.Canvas, meme: Model.Meme) => {
    const topPosition = canvasHeight;
    const maxWidth = getCanvasMaxWith();
    fabric.Image.fromURL(
      `${meme.url}?v=1.0.0`,
      (img) => {
        const canvasWith = canvas.getWidth() ?? maxWidth;
        const canvasHeight = canvas.getHeight() ?? maxWidth;
        const width = meme.width ?? img.width ?? maxWidth;
        const height = meme.height ?? img.height ?? maxWidth;
        const rate = canvasWith / width;

        img.scaleToWidth(canvasWith);
        img.scaleToHeight(Math.floor(height * rate));
        canvas.setDimensions({
          width: canvasWith,
          height: topPosition + Math.floor(height * rate),
        });
        setCanvasHeight(topPosition + Math.floor(height * rate));
        canvas.add(img);
        canvas.renderAll();
        setLoading(false);
      },
      {
        crossOrigin: "Anonymous",
        left: 0,
        top: topPosition,
        selectable: false,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        evented: false,
      }
    );
  };

  const addImageToCanvas = (canvas: fabric.Canvas, fileUrl: string) => {
    const topPosition = canvasHeight;
    const maxWidth = getCanvasMaxWith();
    fabric.Image.fromURL(fileUrl, (img) => {
      const canvasWith = canvas.getWidth() ?? maxWidth;
      const canvasHeight = canvas.getHeight() ?? maxWidth;
      const width = img.width ?? maxWidth;
      const height = img.height ?? maxWidth;
      const rate = canvasWith / width;

      img.scaleToWidth(canvasWith);
      img.scaleToHeight(Math.floor(height * rate));
      img.set({
        left: 0,
        top: topPosition,
        selectable: false,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        evented: false,
      });

      canvas.setDimensions({
        width: canvasWith,
        height: topPosition + Math.floor(height * rate),
      });

      setCanvasHeight(topPosition + Math.floor(height * rate));

      canvas.add(img);
      canvas.renderAll();
      setLoading(false);
    });
  };

  const initCanvas = () => {
    if (!canvas) {
      const c = new fabric.Canvas("memecanvas", {
        width: getCanvasMaxWith(),
        backgroundColor: "#000000",
      });
      setCanvas(c);
      return c;
    } else {
      return canvas;
    }
  };

  const getCanvasMaxWith = (): number => {
    return window.innerWidth >= 600 ? 500 : 300;
  };

  const showMemeList = () => {
    const modal = document.getElementById("modalMemeList");
    // @ts-ignore
    if (modal && modal?.show) {
      // @ts-ignore
      modal?.show();
    }
  };

  const selectMeme = async (meme: Model.Meme) => {
    setLoading(true);
    const c = await initCanvas();
    setImagesSelected(value => value + 1);
    addMemeImageToCanvas(c, meme);
  };

  const uploadImage = async (fileUrl: string) => {
    setLoading(true);
    const c = await initCanvas();
    setImagesSelected(value => value + 1);
    addImageToCanvas(c, fileUrl);
  };

  const resetCanvas = () => {
    if (confirm(t("Are you sure to reset your meme?"))) {
      canvas?.clear();
      setTextboxes([]);
      setImagesSelected(0);
      setCanvasHeight(0);
      scrollToDiv("elPostType", 0, 0);
    }
  };

  const addTextbox = (
    textValue: string,
    option: FabricTextboxProperty = {}
  ) => {
    const id = `${Date.now().toString()}-${Math.random()}`;
    const textboxProperty: FabricTextboxProperty = {
      text: textValue,
      // @ts-ignore
      name: id,
      width: 200,
      originX: "center",
      //
      fontFamily: "Kanit",
      textAlign: "center",
      fontSize: 25,
      fill: "#ffffff",
      fontWeight: "900",
      stroke: "#000000",
      strokeWidth: 0,
      opacity: 1,
      underline: false,
      fontStyle: "normal",
      capitalize: true,
      lineHeight: 1,
      isShadow: true,
      ...option,
    };

    const textbox = new fabric.Textbox("", {
      fontFamily: "Kanit",
      lockScalingY: true,
      editable: false,
      splitByGrapheme: false,
      hasRotatingPoint: true,
      rotatingPointOffset: 0.1,
      shadow: textboxProperty.isShadow
        ? new fabric.Shadow({
            color: textboxProperty.stroke ?? "#000000",
            blur: 2,
            affectStroke: false,
          })
        : undefined,
      ...textboxProperty,
      text: textboxProperty.capitalize
        ? textboxProperty.text?.toUpperCase()
        : textboxProperty.text,
    });

    const canvasCenter = canvas?.getCenter();
    textbox.set({
      left: canvasCenter?.left ?? 0 - (textbox.width ?? 0 / 2),
      top: canvasCenter?.top ?? 0 - (textbox.height ?? 0 / 2),
    });

    textbox.controls.mtr.offsetY = -25;

    canvas?.add(textbox);
    canvas?.setActiveObject(textbox);
    canvas?.renderAll();

    setTextboxes((prevTextboxes) => [...prevTextboxes, textboxProperty]);
  };

  const removeTextbox = (name: string) => {
    const filter = textboxes.filter((item) => item.name !== name);

    setTextboxes(filter);
  };

  const downloadCanvas = (canvas?: fabric.Canvas) => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1.0,
      });

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "your-meme.png";

      // Simulate a click on the link to trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    return false;
  };

  useImperativeHandle(ref, () => ({
    getMeme: async () => {
      if (!imagesSelected) {
        return null;
      }
      const dataURL = await canvas?.toDataURL({
        format: "png",
        quality: 1.0,
      });
      return dataURL;
    },
  }));

  useEffect(() => {
    return () => {
      canvas?.dispose();
    };
  }, []);

  return (
    <>
      <div className={`${imagesSelected > 0 ? "block" : "hidden"}`}>
        <div className="flex justify-center w-full gap-4 flex-wrap lg:flex-nowrap xl:flex-wrap">
          <div className="w-fit relative mx-auto flex-none">
            <canvas id="memecanvas" className="mx-auto border" />
            {loading && (
              <div className="absolute top-0 left-0 w-full h-full bg-base-100 bg-opacity-50 flex items-center justify-center">
                <span className="loading loading-ring loading-lg"></span>
              </div>
            )}
          </div>
          <div className="w-full relative z-[1]">
            <div className="sticky top-[60px] z-10">
              <div className="grid grid-cols-1 gap-4">
                {imagesSelected > 0 &&
                  canvas &&
                  textboxes.map((item) => (
                    <FabricTextBoxSetting
                      key={item.name}
                      attrs={item}
                      canvas={canvas}
                      removeTextbox={removeTextbox}
                    />
                  ))}
                <div className="flex flex-wrap w-full gap-3 sm:gap-5 items-center justify-center lg:justify-end xl:justify-center">
                  <div className="tooltip tooltip-right sm:tooltip-top" data-tip={t("Reset all and do it again")}>
                    <button
                      disabled={loading}
                      className="btn btn-error btn-sm"
                      onClick={() => resetCanvas()}
                    >
                      <IconDelete />
                    </button>
                  </div>
                  <div
                    className="tooltip tooltip-right sm:tooltip-top"
                    data-tip={t('Download meme to your device')}
                  >
                    <button
                      disabled={loading}
                      className="btn btn-info btn-sm"
                      onClick={() => downloadCanvas(canvas)}
                    >
                      <IconDownload />
                    </button>
                  </div>
                  <button
                    disabled={loading || imagesSelected >= 5}
                    className="btn btn-outline btn-sm"
                    onClick={() => showMemeList()}
                  >
                    {t('Add image')}
                  </button>
                  <button
                    disabled={loading || textboxes.length >= 15}
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                      addTextbox(t('Text number', {number: textboxes.length + 1}))
                    }
                  >
                    {t('Add text')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${!imagesSelected ? "block" : "hidden"} text-center`}>
        <button
          className="btn btn-outline btn-lg w-full"
          onClick={() => showMemeList()}
        >
          {t('Select or upload image')}
        </button>
        <p className="text-sm italic text-info mt-1">
          {t('Please select or upload an image and then create a meme')}
        </p>
      </div>
      <MemeGeneratorList
        onSelectMeme={selectMeme}
        onUploadImage={uploadImage}
      />
      <div className="overflow-hidden w-0 h-0">
        <div className="fontKanit text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontBitter text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontGrenze text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontLabrada text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontNotoSans text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontPetrona text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontRokkitt text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontSaira text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontTourney text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontVollkorn text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontGenos text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontKanit400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontBitter400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontGrenze400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontLabrada400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontNotoSans400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontPetrona400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontRokkitt400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontSaira400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontTourney400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontVollkorn400 text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontGenos400 text-2xl">소개 Nguyễn Văn Dũng</div>

        <div className="fontKanitItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontBitterItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontGrenzeItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontLabradaItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontNotoSansItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontPetronaItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontRokkittItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontSairaItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontTourneyItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontVollkornItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontGenosItalic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontKanit400Italic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontBitter400Italic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontGrenze400Italic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontLabrada400Italic text-2xl">
          소개 Nguyễn Văn Dũng
        </div>
        <div className="fontNotoSans400Italic text-2xl">
          소개 Nguyễn Văn Dũng
        </div>
        <div className="fontPetrona400Italic text-2xl">
          소개 Nguyễn Văn Dũng
        </div>
        <div className="fontRokkitt400Italic text-2xl">
          소개 Nguyễn Văn Dũng
        </div>
        <div className="fontSaira400Italic text-2xl">소개 Nguyễn Văn Dũng</div>
        <div className="fontTourney400Italic text-2xl">
          소개 Nguyễn Văn Dũng
        </div>
        <div className="fontVollkorn400Italic text-2xl">
          소개 Nguyễn Văn Dũng
        </div>
        <div className="fontGenos400Italic text-2xl">소개 Nguyễn Văn Dũng</div>
      </div>
    </>
  );
});

export default MemeGenerator;
