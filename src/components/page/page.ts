import { BaseComponent, Component } from "./../component.js";

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

type SectionContainerConstructor = {
  new (): SectionContainer;
  // 아무런것도 전달받지않는 생성자가 있고
};

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
}
// 여기는 밑의 pageComponent에 들어갈 자실 li요소!
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  //SectionContainer에서 Component는 baseComponent에서 구현, Composable과 setoncloseListener은
  //여기자체에서 구현해서 에러 안뜸!
  public closeListener?: OnCloseListener;
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
  }
  setOnCloseListener(listener: OnCloseListener) {
    // listener는 !콜백함수를 받을꺼임!
    this.closeListener = listener;
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
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
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
    });
    // console.log("체크closeListener", item.closeListener);
    // 여기서 지우는 함수가 만들어짐!
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
