export class ImageComponent {
  private element: HTMLElement;
  constructor(title: string, url: string) {
    const template = document.createElement("template");
    template.innerHTML = `<section class="image">
    <div class="image__holder"><img class="image__thumbnail"></div>
    <h2 class="page-item__title image__title"></h2>
    </section>`;
    // template은 innerHTML해서 안에 markup쓸수있음!

    this.element = template.content.firstElementChild! as HTMLElement;

    // template안에 테그들안의 속성 추가!
    const imageElement = this.element.querySelector(
      ".image__thumbnail"
    )! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;

    const titleElement = this.element.querySelector(
      ".image__title"
    )! as HTMLParagraphElement;
    titleElement.textContent = title;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
    // parent어딘가에 붙여넣을수있음!
  }
}
