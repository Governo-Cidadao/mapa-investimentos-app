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

    public static moveElement(from: string | HTMLElement, to: string | HTMLElement): void {
        const source = (typeof from === 'string') ? document.querySelector<HTMLElement>(`.${from}`) : from;
        const destination = (typeof to === 'string') ? document.querySelector<HTMLElement>(`.${to}`) : to;

        if (!source)
            throw new Error("Source element not found: " + source);

        if (!destination)
            throw new Error("Destination element not found: " + destination);

        destination.appendChild(source);
    }

}