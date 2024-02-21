export class HtmlUtil {
    public static createElementWithContent(tag: string, content?: string, value?: string): HTMLElement {
        const element = document.createElement(tag);
        if (content)
            element.innerHTML = content;
        if (value) {
            const valueElement = document.createElement('p');
            valueElement.innerHTML = value;
            element.appendChild(valueElement);
        }
        return element;
    }
}