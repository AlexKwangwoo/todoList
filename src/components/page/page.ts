import { BaseComponent, Component } from "./../component.js";

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;
type DragState = "start" | "stop" | "enter" | "leave";

type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

type SectionContainerConstructor = {
  new (): SectionContainer;
  // 아무런것도 전달받지않는 생성자가 있고
};

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: "mute" | "unmute"): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}
// 여기는 밑의 pageComponent에 들어갈 자실 li요소!
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  //SectionContainer에서 Component는 baseComponent에서 구현, Composable과 setoncloseListener은
  //여기자체에서 구현해서 에러 안뜸!
  public closeListener?: OnCloseListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;

  // 처음에는 undefined없다가.. pageComponent가 생성되면서 만들어질것임
  // 중요!! 바로 함수를 등록하지않고 콜백을 통해 쓰는이유는
  // 우리가 유동성있게 콜백을 통해 함수 기능을 바꿀수도 있기 때문!!
  constructor() {
    super(`<li draggable="true" class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    // console.log("this.closeListener", this.closeListener);
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
      //closeListener 있으면 closeListener함수를 실행할것임!
    };

    this.element.addEventListener("dragstart", (event: DragEvent) => {
      this.onDragStart(event);
    });
    this.element.addEventListener("dragend", (event: DragEvent) => {
      this.onDragEnd(event);
    });

    this.element.addEventListener("dragenter", (event: DragEvent) => {
      this.onDragEnter(event);
    });
    this.element.addEventListener("dragleave", (event: DragEvent) => {
      this.onDragLeave(event);
    });
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObservers("start");
    this.element.classList.add("lifted");
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers("stop");
    this.element.classList.remove("lifted");
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers("enter");
    this.element.classList.add("drop-area");
  }

  onDragLeave(_: DragEvent) {
    this.notifyDragObservers("leave");
    this.element.classList.remove("drop-area");
  }

  onDropped() {
    this.element.classList.remove("drop-area");
  }

  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }

  setOnCloseListener(listener: OnCloseListener) {
    // listener는 !콜백함수를 받을꺼임!
    this.closeListener = listener;
  }

  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }

  muteChildren(state: "mute" | "unmute") {
    if (state === "mute") {
      this.element.classList.add("mute-children");
    } else {
      this.element.classList.remove("mute-children");
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      ".page-item__body"
    )! as HTMLElement;
    child.attachTo(container);
    // li안의 section에 값으로 받아오는 요소를 붙이고
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  private children = new Set<SectionContainer>();
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');

    this.element.addEventListener("dragover", (event: DragEvent) => {
      this.onDragOver(event);
    });
    this.element.addEventListener("drop", (event: DragEvent) => {
      this.onDrop(event);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    // 방지안해주면.. touch나 pointer 이벤트가 발생할수있음!
    console.log("onDragOver");
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log("onDrop", this.dropTarget);

    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();

      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? "beforebegin" : "afterend"
      );
    }
    this.dropTarget.onDropped();
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    //li의 <section>에 인자 section을 먼저 넣고!
    item.attachTo(this.element, "beforeend");
    //this.element 는 appRoot가 될것임! app.ts에서 정해줌!
    // 위에서 만들어진 li 를 ul에 붙임!
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);

    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        switch (state) {
          case "start":
            this.dragTarget = target;
            this.updateSections("mute");
            break;
          case "stop":
            this.dragTarget = undefined;
            this.updateSections("unmute");
            break;
          case "enter":
            console.log("enter", target);

            this.dropTarget = target;
            break;
          case "leave":
            console.log("leave", target);
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
      }
    );
    // console.log("체크closeListener", item.closeListener);
    // 여기서 지우는 함수가 만들어짐!
  }

  private updateSections(state: "mute" | "unmute") {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
  // private element: HTMLUListElement;
  // constructor() {
  //   this.element = document.createElement("ul");
  //   this.element.setAttribute("class", "page");
  //   this.element.textContent = "This is PageComponent";
  //   // 안에 택스트를 쓴것임!
  // }

  // // position기본값은 afterbegin
  // attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
  //   parent.insertAdjacentElement(position, this.element);
  //   // parent어딘가에 붙여넣을수있음!
  // }
}
