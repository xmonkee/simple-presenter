var simplePresenterMakeHTMLFunction = slideContent => slideContent;

class SimplePresenter {
    constructor(root, slides) {
        this.root = root;
        this.slides = slides;
        this.root.addEventListener('keydown', ev => this.handleKeyPress(ev));
        this.root.addEventListener('click', ev => this.handleClick(ev));
        this.root.addEventListener('touchstart', ev => this.swipeStart(ev));
        this.root.addEventListener('touchmove', ev => ev.preventDefault());
        this.root.addEventListener('touchend', ev => this.swipeEnd(ev));
        this.initState();
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
        if (ev.pageX > (4 * window.innerWidth) / 5) {
            this.nextPage();
        } else if (ev.pageX < window.innerWidth / 5) {
            this.prevPage();
        }
    }

    swipeStart(ev) {
        this.touchDown = ev.touches[0];
    }

    swipeEnd(ev) {
        if (!this.touchDown) {
            return;
        }
        const touchUp = ev.changedTouches[0];
        const travelX = touchUp.pageX - this.touchDown.pageX;
        const travelY = touchUp.pageY - this.touchDown.pageY;
        const primaryTravel =
            Math.abs(travelX) > Math.abs(travelY) ? travelX : travelY;
        if (primaryTravel > 0) {
            prevPage();
        } else {
            nextPage();
        }
        this.touchDownX = null;
    }

    makeSlideHtml(slide) {
        return `<div id="slide">${slide}</div>`;
    }

    render() {
        this.root.innerHTML = this.makeSlideHtml(this.slides[this.state.page]);
    }

    static run(slides) {
        const root = document.getElementById('simple-presenter-root');
        const presenter = new SimplePresenter(root, slides);
        root.focus();
        presenter.render();
    }
}
