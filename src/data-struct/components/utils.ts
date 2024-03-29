function scrollbarVisible(element: Element) {
  return element.scrollHeight > element.clientHeight;
}

function isAlreadyInView(el: Element, container: Element) {
    const { bottom, height, top } = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return top <= containerRect.top ? containerRect.top - top <= height : bottom - containerRect.bottom <= height;
}

export function scrollIntoViewAndWait(scrollElement: Element, element: Element) {
	return new Promise<void>(resolve => {
		if(!scrollbarVisible(scrollElement) || isAlreadyInView(element, scrollElement)) {
			resolve();
		}

		if("onscrollend" in window) {
			scrollElement.addEventListener("scrollend", resolve as any, { once: true });
			element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
		} else {
			element.scrollIntoView({ block: "center", inline: "center" });
			resolve()
		}
	});
}

export function createDebouncer(fn: Function, delay: number) {
	let timeout: number;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(fn, delay);
	}
}

