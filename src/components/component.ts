export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
  attach(component: Component, position?: InsertPosition): void;
}

// 그냥 T면 안됨 왜냐하면 T가 HTML에서만 상속받을수있게 해야하기 떄문
export class BaseComponent<T extends HTMLElement> implements Component {
  protected readonly element: T;
  constructor(htmlString: string) {
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    // template은 innerHTML해서 안에 markup쓸수있음!

    this.element = template.content.firstElementChild! as T;
  }

  // position기본값은 afterbegin
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
    //this.element 는 attachTo에 들어오는곳의 위치가 될것임!
    // parent어딘가에 붙여넣을수있음!
  }

  removeFrom(parent: HTMLElement) {
    if (parent !== this.element.parentElement) {
      // 내가 지울려는 상위 컴포넌트가 아니라면..
      throw new Error("Parent Mismatch");
    }
    parent.removeChild(this.element);
  }

  attach(component: Component, position: InsertPosition = "afterbegin") {
    component.attachTo(this.element, position);
  }
}
