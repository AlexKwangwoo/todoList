import { Component } from "./components/component.js";
import { VideoComponent } from "./components/page/item/videos.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { NoteComponent } from "./components/page/item/note.js";
import { ImageComponent } from "./components/page/item/image.js";
import {
  Composable,
  PageComponent,
  PageItemComponent,
} from "./components/page/page.js";
import {
  InputDialog,
  MediaData,
  TextData,
} from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new (): T;
};

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, public dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    console.log("??");
    //최상위 위치는 appRoot로 정해짐!

    // const image = new ImageComponent(
    //   "Image Title",
    //   "https://picsum.photos/600/300"
    // );
    // this.page.addChild(image);
    // // image.attachTo(appRoot, "beforeend");

    // const video = new VideoComponent(
    //   "Video Title",
    //   "https://youtu.be/iXiVDeN44c4"
    // );
    // this.page.addChild(video);
    // // video.attachTo(appRoot, "beforeend");

    // const note = new NoteComponent("Note Title", "Note Body");
    // this.page.addChild(note);
    // // note.attachTo(appRoot, "beforeend");

    // const todo = new TodoComponent("Todo Title", "Todo Item");
    // this.page.addChild(todo);
    // // todo.attachTo(appRoot, "beforeend");

    this.bindElementToDialog<MediaSectionInput>(
      "#new-image",
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );

    // const imageBtn = document.querySelector("#new-image")! as HTMLButtonElement;
    // // class 는 . id 는 #
    // imageBtn.addEventListener("click", () => {
    //   const dialog = new InputDialog();
    //   const inputSection = new MediaSectionInput();
    //   dialog.addChild(inputSection);
    //   dialog.attachTo(dialogRoot);

    //   dialog.setOnCloseListenr(() => {
    //     dialog.removeFrom(dialogRoot);
    //   });
    //   dialog.setOnSubmitListenr(() => {
    //     // 섹션을 만들어서 페이지에 추가한다
    //     const image = new ImageComponent(inputSection.title, inputSection.url);
    //     this.page.addChild(image);
    //     dialog.removeFrom(dialogRoot);
    //   });
    // });

    this.bindElementToDialog<MediaSectionInput>(
      "#new-video",
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );

    // const videoBtn = document.querySelector("#new-video")! as HTMLButtonElement;
    // // class 는 . id 는 #
    // videoBtn.addEventListener("click", () => {
    //   const dialog = new InputDialog();
    //   const inputSection = new MediaSectionInput();
    //   dialog.addChild(inputSection);
    //   dialog.attachTo(dialogRoot);

    //   dialog.setOnCloseListenr(() => {
    //     dialog.removeFrom(dialogRoot);
    //   });
    //   dialog.setOnSubmitListenr(() => {
    //     // 섹션을 만들어서 페이지에 추가한다
    //     const image = new VideoComponent(inputSection.title, inputSection.url);
    //     this.page.addChild(image);
    //     dialog.removeFrom(dialogRoot);
    //   });
    // });

    this.bindElementToDialog<TextSectionInput>(
      "#new-video",
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    // const noteBtn = document.querySelector("#new-note")! as HTMLButtonElement;
    // // class 는 . id 는 #
    // noteBtn.addEventListener("click", () => {
    //   const dialog = new InputDialog();
    //   const inputSection = new TextSectionInput();
    //   dialog.addChild(inputSection);
    //   dialog.attachTo(dialogRoot);

    //   dialog.setOnCloseListenr(() => {
    //     dialog.removeFrom(dialogRoot);
    //   });
    //   dialog.setOnSubmitListenr(() => {
    //     // 섹션을 만들어서 페이지에 추가한다
    //     const image = new NoteComponent(inputSection.title, inputSection.body);
    //     this.page.addChild(image);
    //     dialog.removeFrom(dialogRoot);
    //   });
    // });

    this.bindElementToDialog<TextSectionInput>(
      "#new-todo",
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );

    // const todoBtn = document.querySelector("#new-todo")! as HTMLButtonElement;
    // // class 는 . id 는 #
    // todoBtn.addEventListener("click", () => {
    //   const dialog = new InputDialog();
    //   const inputSection = new TextSectionInput();
    //   dialog.addChild(inputSection);
    //   dialog.attachTo(dialogRoot);

    //   dialog.setOnCloseListenr(() => {
    //     dialog.removeFrom(dialogRoot);
    //   });
    //   dialog.setOnSubmitListenr(() => {
    //     // 섹션을 만들어서 페이지에 추가한다
    //     const image = new TodoComponent(inputSection.title, inputSection.body);
    //     this.page.addChild(image);
    //     dialog.removeFrom(dialogRoot);
    //   });
    // });

    this.page.addChild(
      new ImageComponent("Image Title", "https://picsum.photos/800/400")
    );
    this.page.addChild(
      new VideoComponent("Video Title", "https://youtu.be/D7cwvvA7cP0")
    );
    this.page.addChild(new NoteComponent("Note Title", "Don't forget"));
    this.page.addChild(new TodoComponent("Todo Title", "TypeScript"));
    this.page.addChild(
      new ImageComponent("Image Title", "https://picsum.photos/800/400")
    );
    this.page.addChild(
      new VideoComponent("Video Title", "https://youtu.be/D7cwvvA7cP0")
    );
    this.page.addChild(new NoteComponent("Note Title", "Don't forget"));
    this.page.addChild(new TodoComponent("Todo Title", "TypeScript"));
  }

  private bindElementToDialog<T extends (MediaData | TextData) & Component>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector)! as HTMLButtonElement;
    // class 는 . id 는 #
    element.addEventListener("click", () => {
      const dialog = new InputDialog();
      const input = new InputComponent();
      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        // 섹션을 만들어서 페이지에 추가한다
        const image = makeSection(input);
        this.page.addChild(image);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector(".document")! as HTMLElement, document.body);
