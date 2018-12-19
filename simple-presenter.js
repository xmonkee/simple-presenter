var simplePresenterMakeHTMLFunction = (slideContent) => slideContent;

class SimplePresenter {
    constructor(root) {
        this.state = {page: 0};
        this.root = root;
        this.root.onkeydown = (ev => this.handleKeyPress(ev));
        const content = document.getElementsByTagName('slides')[0];
        this.slides = content.innerText.split('\n--\n')
    }

    toggleFullScreen(element) {

        if (
            !document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement
        ) {
            // current working methods
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    setState(obj) {
        for (var key in obj) {
            this.state[key] = obj[key]
        }
        this.render()
    }


    handleKeyPress(e) {
        switch (e.key) {
            case "ArrowRight":
                this.setState({
                    page: Math.min(this.slides.length - 1, this.state.page + 1),
                });
                return;
            case "ArrowLeft":
                this.setState({ page: Math.max(0, this.state.page - 1) });
                return;
            case "f":
                this.toggleFullScreen(this.root);
        }
    }

    makeSlideHtml(slideContent) {
        const html = simplePresenterMakeHTMLFunction(slideContent)
        return `<div id="slide">${html}</div>`;
    }

    render() {
        this.root.innerHTML = this.makeSlideHtml(this.slides[this.state.page])
    }

    static registerMakeHTMLFunction(fn) {
        simplePresenterMakeHTMLFunction = fn;
    }

    static run() {
        const root = document.getElementById("simple-presenter-root")
        const presenter = new SimplePresenter(root);
        root.focus()
        presenter.render()
    }
}
