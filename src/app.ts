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
import { InputDialog } from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);
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

    const imageBtn = document.querySelector("#new-image")! as HTMLButtonElement;
    // class 는 . id 는 #
    imageBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        // 섹션을 만들어서 페이지에 추가한다
        const image = new ImageComponent(inputSection.title, inputSection.url);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const videoBtn = document.querySelector("#new-video")! as HTMLButtonElement;
    // class 는 . id 는 #
    videoBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        // 섹션을 만들어서 페이지에 추가한다
        const image = new VideoComponent(inputSection.title, inputSection.url);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const noteBtn = document.querySelector("#new-note")! as HTMLButtonElement;
    // class 는 . id 는 #
    noteBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new TextSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        // 섹션을 만들어서 페이지에 추가한다
        const image = new NoteComponent(inputSection.title, inputSection.body);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const todoBtn = document.querySelector("#new-todo")! as HTMLButtonElement;
    // class 는 . id 는 #
    todoBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new TextSectionInput();
      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListenr(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListenr(() => {
        // 섹션을 만들어서 페이지에 추가한다
        const image = new TodoComponent(inputSection.title, inputSection.body);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });
  }
}

new App(document.querySelector(".document")! as HTMLElement, document.body);
