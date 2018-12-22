var simplePresenterMakeHTMLFunction = slideContent => slideContent;

class SimplePresenter {
    constructor(root) {
        this.root = root;
        this.root.onkeydown = ev => this.handleKeyPress(ev);
        this.root.onclick = ev => this.handleClick(ev);
        const content = document.getElementsByTagName('slides')[0];
        const decoded = this.unescapeHTML(content.innerHTML);
        this.slides = decoded.split('\n--\n');
        this.initState();
    }

    unescapeHTML(html) {
        // Without this, the contents of the slides get escaped.
        // i.e. an `&` character will get returned as `&amp;`
        // This breaks showdown. The `&amp` gets converted to `&amp;amp`
        const elem = document.createElement('textarea');
        elem.innerHTML = html;
        return elem.value;
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

    initState() {
        const pageNumber = window.location.href.split('#')[1] || '0';
        this.state = {page: parseInt(pageNumber)};
        window.history.replaceState(this.state, '', `#${this.state.page}`);
        window.onpopstate = ev => {
            this.state = ev.state;
            this.render();
        };
    }

    setState(state) {
        for (const key in state) {
            this.state[key] = state[key];
        }
        window.history.pushState(this.state, '', `#${this.state.page}`);
        this.render();
    }

    nextPage() {
        if (this.state.page < this.slides.length - 1) {
            this.setState({
                page: this.state.page + 1,
            });
        }
    }

    prevPage() {
        if (this.state.page > 0) {
            this.setState({
                page: this.state.page - 1,
            });
        }
    }

    handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowRight':
                this.nextPage();
                return;
            case 'ArrowLeft':
                this.prevPage();
                return;
            case 'f':
                this.toggleFullScreen(this.root);
        }
    }

    handleClick(ev) {
        if (ev.offsetX > this.root.offsetWidth / 3) {
            this.nextPage();
        } else {
            this.prevPage();
        }
    }

    makeSlideHtml(slideContent) {
        const html = simplePresenterMakeHTMLFunction(slideContent);
        return `<div id="slide">${html}</div>`;
    }

    render() {
        this.root.innerHTML = this.makeSlideHtml(this.slides[this.state.page]);
    }

    static registerMakeHTMLFunction(fn) {
        simplePresenterMakeHTMLFunction = fn;
    }

    static run() {
        const root = document.getElementById('simple-presenter-root');
        const presenter = new SimplePresenter(root);
        root.focus();
        presenter.render();
    }
}
