//#region node_modules/lenis/dist/lenis.mjs
var version = "1.3.17";
function clamp(min, input, max) {
	return Math.max(min, Math.min(input, max));
}
function lerp(x, y, t) {
	return (1 - t) * x + t * y;
}
function damp(x, y, lambda, deltaTime) {
	return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
}
function modulo(n$1, d) {
	return (n$1 % d + d) % d;
}
var Animate = class {
	isRunning = false;
	value = 0;
	from = 0;
	to = 0;
	currentTime = 0;
	lerp;
	duration;
	easing;
	onUpdate;
	/**
	* Advance the animation by the given delta time
	*
	* @param deltaTime - The time in seconds to advance the animation
	*/
	advance(deltaTime) {
		if (!this.isRunning) return;
		let completed = false;
		if (this.duration && this.easing) {
			this.currentTime += deltaTime;
			const linearProgress = clamp(0, this.currentTime / this.duration, 1);
			completed = linearProgress >= 1;
			const easedProgress = completed ? 1 : this.easing(linearProgress);
			this.value = this.from + (this.to - this.from) * easedProgress;
		} else if (this.lerp) {
			this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
			if (Math.round(this.value) === this.to) {
				this.value = this.to;
				completed = true;
			}
		} else {
			this.value = this.to;
			completed = true;
		}
		if (completed) this.stop();
		this.onUpdate?.(this.value, completed);
	}
	/** Stop the animation */
	stop() {
		this.isRunning = false;
	}
	/**
	* Set up the animation from a starting value to an ending value
	* with optional parameters for lerping, duration, easing, and onUpdate callback
	*
	* @param from - The starting value
	* @param to - The ending value
	* @param options - Options for the animation
	*/
	fromTo(from, to, { lerp: lerp2, duration, easing, onStart, onUpdate }) {
		this.from = this.value = from;
		this.to = to;
		this.lerp = lerp2;
		this.duration = duration;
		this.easing = easing;
		this.currentTime = 0;
		this.isRunning = true;
		onStart?.();
		this.onUpdate = onUpdate;
	}
};
function debounce(callback, delay) {
	let timer;
	return function(...args) {
		let context = this;
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = void 0;
			callback.apply(context, args);
		}, delay);
	};
}
var Dimensions = class {
	constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
		this.wrapper = wrapper;
		this.content = content;
		if (autoResize) {
			this.debouncedResize = debounce(this.resize, debounceValue);
			if (this.wrapper instanceof Window) window.addEventListener("resize", this.debouncedResize, false);
			else {
				this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
				this.wrapperResizeObserver.observe(this.wrapper);
			}
			this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
			this.contentResizeObserver.observe(this.content);
		}
		this.resize();
	}
	width = 0;
	height = 0;
	scrollHeight = 0;
	scrollWidth = 0;
	debouncedResize;
	wrapperResizeObserver;
	contentResizeObserver;
	destroy() {
		this.wrapperResizeObserver?.disconnect();
		this.contentResizeObserver?.disconnect();
		if (this.wrapper === window && this.debouncedResize) window.removeEventListener("resize", this.debouncedResize, false);
	}
	resize = () => {
		this.onWrapperResize();
		this.onContentResize();
	};
	onWrapperResize = () => {
		if (this.wrapper instanceof Window) {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		} else {
			this.width = this.wrapper.clientWidth;
			this.height = this.wrapper.clientHeight;
		}
	};
	onContentResize = () => {
		if (this.wrapper instanceof Window) {
			this.scrollHeight = this.content.scrollHeight;
			this.scrollWidth = this.content.scrollWidth;
		} else {
			this.scrollHeight = this.wrapper.scrollHeight;
			this.scrollWidth = this.wrapper.scrollWidth;
		}
	};
	get limit() {
		return {
			x: this.scrollWidth - this.width,
			y: this.scrollHeight - this.height
		};
	}
};
var Emitter = class {
	events = {};
	/**
	* Emit an event with the given data
	* @param event Event name
	* @param args Data to pass to the event handlers
	*/
	emit(event, ...args) {
		let callbacks = this.events[event] || [];
		for (let i$1 = 0, length = callbacks.length; i$1 < length; i$1++) callbacks[i$1]?.(...args);
	}
	/**
	* Add a callback to the event
	* @param event Event name
	* @param cb Callback function
	* @returns Unsubscribe function
	*/
	on(event, cb) {
		this.events[event]?.push(cb) || (this.events[event] = [cb]);
		return () => {
			this.events[event] = this.events[event]?.filter((i$1) => cb !== i$1);
		};
	}
	/**
	* Remove a callback from the event
	* @param event Event name
	* @param callback Callback function
	*/
	off(event, callback) {
		this.events[event] = this.events[event]?.filter((i$1) => callback !== i$1);
	}
	/**
	* Remove all event listeners and clean up
	*/
	destroy() {
		this.events = {};
	}
};
var LINE_HEIGHT = 100 / 6;
var listenerOptions = { passive: false };
var VirtualScroll = class {
	constructor(element, options = {
		wheelMultiplier: 1,
		touchMultiplier: 1
	}) {
		this.element = element;
		this.options = options;
		window.addEventListener("resize", this.onWindowResize, false);
		this.onWindowResize();
		this.element.addEventListener("wheel", this.onWheel, listenerOptions);
		this.element.addEventListener("touchstart", this.onTouchStart, listenerOptions);
		this.element.addEventListener("touchmove", this.onTouchMove, listenerOptions);
		this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
	}
	touchStart = {
		x: 0,
		y: 0
	};
	lastDelta = {
		x: 0,
		y: 0
	};
	window = {
		width: 0,
		height: 0
	};
	emitter = new Emitter();
	/**
	* Add an event listener for the given event and callback
	*
	* @param event Event name
	* @param callback Callback function
	*/
	on(event, callback) {
		return this.emitter.on(event, callback);
	}
	/** Remove all event listeners and clean up */
	destroy() {
		this.emitter.destroy();
		window.removeEventListener("resize", this.onWindowResize, false);
		this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
		this.element.removeEventListener("touchstart", this.onTouchStart, listenerOptions);
		this.element.removeEventListener("touchmove", this.onTouchMove, listenerOptions);
		this.element.removeEventListener("touchend", this.onTouchEnd, listenerOptions);
	}
	/**
	* Event handler for 'touchstart' event
	*
	* @param event Touch event
	*/
	onTouchStart = (event) => {
		const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
		this.touchStart.x = clientX;
		this.touchStart.y = clientY;
		this.lastDelta = {
			x: 0,
			y: 0
		};
		this.emitter.emit("scroll", {
			deltaX: 0,
			deltaY: 0,
			event
		});
	};
	/** Event handler for 'touchmove' event */
	onTouchMove = (event) => {
		const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
		const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
		const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
		this.touchStart.x = clientX;
		this.touchStart.y = clientY;
		this.lastDelta = {
			x: deltaX,
			y: deltaY
		};
		this.emitter.emit("scroll", {
			deltaX,
			deltaY,
			event
		});
	};
	onTouchEnd = (event) => {
		this.emitter.emit("scroll", {
			deltaX: this.lastDelta.x,
			deltaY: this.lastDelta.y,
			event
		});
	};
	/** Event handler for 'wheel' event */
	onWheel = (event) => {
		let { deltaX, deltaY, deltaMode } = event;
		const multiplierX = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.width : 1;
		const multiplierY = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.height : 1;
		deltaX *= multiplierX;
		deltaY *= multiplierY;
		deltaX *= this.options.wheelMultiplier;
		deltaY *= this.options.wheelMultiplier;
		this.emitter.emit("scroll", {
			deltaX,
			deltaY,
			event
		});
	};
	onWindowResize = () => {
		this.window = {
			width: window.innerWidth,
			height: window.innerHeight
		};
	};
};
var defaultEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
var Lenis = class {
	_isScrolling = false;
	_isStopped = false;
	_isLocked = false;
	_preventNextNativeScrollEvent = false;
	_resetVelocityTimeout = null;
	_rafId = null;
	/**
	* Whether or not the user is touching the screen
	*/
	isTouching;
	/**
	* The time in ms since the lenis instance was created
	*/
	time = 0;
	/**
	* User data that will be forwarded through the scroll event
	*
	* @example
	* lenis.scrollTo(100, {
	*   userData: {
	*     foo: 'bar'
	*   }
	* })
	*/
	userData = {};
	/**
	* The last velocity of the scroll
	*/
	lastVelocity = 0;
	/**
	* The current velocity of the scroll
	*/
	velocity = 0;
	/**
	* The direction of the scroll
	*/
	direction = 0;
	/**
	* The options passed to the lenis instance
	*/
	options;
	/**
	* The target scroll value
	*/
	targetScroll;
	/**
	* The animated scroll value
	*/
	animatedScroll;
	animate = new Animate();
	emitter = new Emitter();
	dimensions;
	virtualScroll;
	constructor({ wrapper = window, content = document.documentElement, eventsTarget = wrapper, smoothWheel = true, syncTouch = false, syncTouchLerp = .075, touchInertiaExponent = 1.7, duration, easing, lerp: lerp2 = .1, infinite = false, orientation = "vertical", gestureOrientation = orientation === "horizontal" ? "both" : "vertical", touchMultiplier = 1, wheelMultiplier = 1, autoResize = true, prevent, virtualScroll, overscroll = true, autoRaf = false, anchors = false, autoToggle = false, allowNestedScroll = false, __experimental__naiveDimensions = false, naiveDimensions = __experimental__naiveDimensions, stopInertiaOnNavigate = false } = {}) {
		window.lenisVersion = version;
		if (!wrapper || wrapper === document.documentElement) wrapper = window;
		if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
		else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
		this.options = {
			wrapper,
			content,
			eventsTarget,
			smoothWheel,
			syncTouch,
			syncTouchLerp,
			touchInertiaExponent,
			duration,
			easing,
			lerp: lerp2,
			infinite,
			gestureOrientation,
			orientation,
			touchMultiplier,
			wheelMultiplier,
			autoResize,
			prevent,
			virtualScroll,
			overscroll,
			autoRaf,
			anchors,
			autoToggle,
			allowNestedScroll,
			naiveDimensions,
			stopInertiaOnNavigate
		};
		this.dimensions = new Dimensions(wrapper, content, { autoResize });
		this.updateClassName();
		this.targetScroll = this.animatedScroll = this.actualScroll;
		this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false);
		this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true });
		if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.addEventListener("click", this.onClick, false);
		this.options.wrapper.addEventListener("pointerdown", this.onPointerDown, false);
		this.virtualScroll = new VirtualScroll(eventsTarget, {
			touchMultiplier,
			wheelMultiplier
		});
		this.virtualScroll.on("scroll", this.onVirtualScroll);
		if (this.options.autoToggle) {
			this.checkOverflow();
			this.rootElement.addEventListener("transitionend", this.onTransitionEnd, { passive: true });
		}
		if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
	}
	/**
	* Destroy the lenis instance, remove all event listeners and clean up the class name
	*/
	destroy() {
		this.emitter.destroy();
		this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, false);
		this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true });
		this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown, false);
		if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.removeEventListener("click", this.onClick, false);
		this.virtualScroll.destroy();
		this.dimensions.destroy();
		this.cleanUpClassName();
		if (this._rafId) cancelAnimationFrame(this._rafId);
	}
	on(event, callback) {
		return this.emitter.on(event, callback);
	}
	off(event, callback) {
		return this.emitter.off(event, callback);
	}
	onScrollEnd = (e$1) => {
		if (!(e$1 instanceof CustomEvent)) {
			if (this.isScrolling === "smooth" || this.isScrolling === false) e$1.stopPropagation();
		}
	};
	dispatchScrollendEvent = () => {
		this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
			bubbles: this.options.wrapper === window,
			detail: { lenisScrollEnd: true }
		}));
	};
	get overflow() {
		const property = this.isHorizontal ? "overflow-x" : "overflow-y";
		return getComputedStyle(this.rootElement)[property];
	}
	checkOverflow() {
		if (["hidden", "clip"].includes(this.overflow)) this.internalStop();
		else this.internalStart();
	}
	onTransitionEnd = (event) => {
		if (event.propertyName.includes("overflow")) this.checkOverflow();
	};
	setScroll(scroll) {
		if (this.isHorizontal) this.options.wrapper.scrollTo({
			left: scroll,
			behavior: "instant"
		});
		else this.options.wrapper.scrollTo({
			top: scroll,
			behavior: "instant"
		});
	}
	onClick = (event) => {
		const anchorElements = event.composedPath().filter((node) => node instanceof HTMLAnchorElement && node.getAttribute("href"));
		if (this.options.anchors) {
			const anchor = anchorElements.find((node) => node.getAttribute("href")?.includes("#"));
			if (anchor) {
				const href = anchor.getAttribute("href");
				if (href) {
					const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
					const target = `#${href.split("#")[1]}`;
					this.scrollTo(target, options);
				}
			}
		}
		if (this.options.stopInertiaOnNavigate) {
			if (anchorElements.find((node) => node.host === window.location.host)) this.reset();
		}
	};
	onPointerDown = (event) => {
		if (event.button === 1) this.reset();
	};
	onVirtualScroll = (data) => {
		if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false) return;
		const { deltaX, deltaY, event } = data;
		this.emitter.emit("virtual-scroll", {
			deltaX,
			deltaY,
			event
		});
		if (event.ctrlKey) return;
		if (event.lenisStopPropagation) return;
		const isTouch = event.type.includes("touch");
		const isWheel = event.type.includes("wheel");
		this.isTouching = event.type === "touchstart" || event.type === "touchmove";
		const isClickOrTap = deltaX === 0 && deltaY === 0;
		if (this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked) {
			this.reset();
			return;
		}
		const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
		if (isClickOrTap || isUnknownGesture) return;
		let composedPath = event.composedPath();
		composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
		const prevent = this.options.prevent;
		if (!!composedPath.find((node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.checkNestedScroll(node, {
			deltaX,
			deltaY
		})))) return;
		if (this.isStopped || this.isLocked) {
			if (event.cancelable) event.preventDefault();
			return;
		}
		if (!(this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel)) {
			this.isScrolling = "native";
			this.animate.stop();
			event.lenisStopPropagation = true;
			return;
		}
		let delta = deltaY;
		if (this.options.gestureOrientation === "both") delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
		else if (this.options.gestureOrientation === "horizontal") delta = deltaX;
		if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) event.lenisStopPropagation = true;
		if (event.cancelable) event.preventDefault();
		const isSyncTouch = isTouch && this.options.syncTouch;
		const hasTouchInertia = isTouch && event.type === "touchend";
		if (hasTouchInertia) delta = Math.sign(this.velocity) * Math.pow(Math.abs(this.velocity), this.options.touchInertiaExponent);
		this.scrollTo(this.targetScroll + delta, {
			programmatic: false,
			...isSyncTouch ? { lerp: hasTouchInertia ? this.options.syncTouchLerp : 1 } : {
				lerp: this.options.lerp,
				duration: this.options.duration,
				easing: this.options.easing
			}
		});
	};
	/**
	* Force lenis to recalculate the dimensions
	*/
	resize() {
		this.dimensions.resize();
		this.animatedScroll = this.targetScroll = this.actualScroll;
		this.emit();
	}
	emit() {
		this.emitter.emit("scroll", this);
	}
	onNativeScroll = () => {
		if (this._resetVelocityTimeout !== null) {
			clearTimeout(this._resetVelocityTimeout);
			this._resetVelocityTimeout = null;
		}
		if (this._preventNextNativeScrollEvent) {
			this._preventNextNativeScrollEvent = false;
			return;
		}
		if (this.isScrolling === false || this.isScrolling === "native") {
			const lastScroll = this.animatedScroll;
			this.animatedScroll = this.targetScroll = this.actualScroll;
			this.lastVelocity = this.velocity;
			this.velocity = this.animatedScroll - lastScroll;
			this.direction = Math.sign(this.animatedScroll - lastScroll);
			if (!this.isStopped) this.isScrolling = "native";
			this.emit();
			if (this.velocity !== 0) this._resetVelocityTimeout = setTimeout(() => {
				this.lastVelocity = this.velocity;
				this.velocity = 0;
				this.isScrolling = false;
				this.emit();
			}, 400);
		}
	};
	reset() {
		this.isLocked = false;
		this.isScrolling = false;
		this.animatedScroll = this.targetScroll = this.actualScroll;
		this.lastVelocity = this.velocity = 0;
		this.animate.stop();
	}
	/**
	* Start lenis scroll after it has been stopped
	*/
	start() {
		if (!this.isStopped) return;
		if (this.options.autoToggle) {
			this.rootElement.style.removeProperty("overflow");
			return;
		}
		this.internalStart();
	}
	internalStart() {
		if (!this.isStopped) return;
		this.reset();
		this.isStopped = false;
		this.emit();
	}
	/**
	* Stop lenis scroll
	*/
	stop() {
		if (this.isStopped) return;
		if (this.options.autoToggle) {
			this.rootElement.style.setProperty("overflow", "clip");
			return;
		}
		this.internalStop();
	}
	internalStop() {
		if (this.isStopped) return;
		this.reset();
		this.isStopped = true;
		this.emit();
	}
	/**
	* RequestAnimationFrame for lenis
	*
	* @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
	*/
	raf = (time) => {
		const deltaTime = time - (this.time || time);
		this.time = time;
		this.animate.advance(deltaTime * .001);
		if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
	};
	/**
	* Scroll to a target value
	*
	* @param target The target value to scroll to
	* @param options The options for the scroll
	*
	* @example
	* lenis.scrollTo(100, {
	*   offset: 100,
	*   duration: 1,
	*   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
	*   lerp: 0.1,
	*   onStart: () => {
	*     console.log('onStart')
	*   },
	*   onComplete: () => {
	*     console.log('onComplete')
	*   },
	* })
	*/
	scrollTo(target, { offset = 0, immediate = false, lock = false, programmatic = true, lerp: lerp2 = programmatic ? this.options.lerp : void 0, duration = programmatic ? this.options.duration : void 0, easing = programmatic ? this.options.easing : void 0, onStart, onComplete, force = false, userData } = {}) {
		if ((this.isStopped || this.isLocked) && !force) return;
		if (typeof target === "string" && [
			"top",
			"left",
			"start",
			"#"
		].includes(target)) target = 0;
		else if (typeof target === "string" && [
			"bottom",
			"right",
			"end"
		].includes(target)) target = this.limit;
		else {
			let node;
			if (typeof target === "string") {
				node = document.querySelector(target);
				if (!node) if (target === "#top") target = 0;
				else console.warn("Lenis: Target not found", target);
			} else if (target instanceof HTMLElement && target?.nodeType) node = target;
			if (node) {
				if (this.options.wrapper !== window) {
					const wrapperRect = this.rootElement.getBoundingClientRect();
					offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
				}
				const rect = node.getBoundingClientRect();
				target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
			}
		}
		if (typeof target !== "number") return;
		target += offset;
		target = Math.round(target);
		if (this.options.infinite) {
			if (programmatic) {
				this.targetScroll = this.animatedScroll = this.scroll;
				const distance = target - this.animatedScroll;
				if (distance > this.limit / 2) target = target - this.limit;
				else if (distance < -this.limit / 2) target = target + this.limit;
			}
		} else target = clamp(0, target, this.limit);
		if (target === this.targetScroll) {
			onStart?.(this);
			onComplete?.(this);
			return;
		}
		this.userData = userData ?? {};
		if (immediate) {
			this.animatedScroll = this.targetScroll = target;
			this.setScroll(this.scroll);
			this.reset();
			this.preventNextNativeScrollEvent();
			this.emit();
			onComplete?.(this);
			this.userData = {};
			requestAnimationFrame(() => {
				this.dispatchScrollendEvent();
			});
			return;
		}
		if (!programmatic) this.targetScroll = target;
		if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
		else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
		this.animate.fromTo(this.animatedScroll, target, {
			duration,
			easing,
			lerp: lerp2,
			onStart: () => {
				if (lock) this.isLocked = true;
				this.isScrolling = "smooth";
				onStart?.(this);
			},
			onUpdate: (value, completed) => {
				this.isScrolling = "smooth";
				this.lastVelocity = this.velocity;
				this.velocity = value - this.animatedScroll;
				this.direction = Math.sign(this.velocity);
				this.animatedScroll = value;
				this.setScroll(this.scroll);
				if (programmatic) this.targetScroll = value;
				if (!completed) this.emit();
				if (completed) {
					this.reset();
					this.emit();
					onComplete?.(this);
					this.userData = {};
					requestAnimationFrame(() => {
						this.dispatchScrollendEvent();
					});
					this.preventNextNativeScrollEvent();
				}
			}
		});
	}
	preventNextNativeScrollEvent() {
		this._preventNextNativeScrollEvent = true;
		requestAnimationFrame(() => {
			this._preventNextNativeScrollEvent = false;
		});
	}
	checkNestedScroll(node, { deltaX, deltaY }) {
		const time = Date.now();
		const cache = node._lenis ??= {};
		let hasOverflowX, hasOverflowY, isScrollableX, isScrollableY, scrollWidth, scrollHeight, clientWidth, clientHeight;
		const gestureOrientation = this.options.gestureOrientation;
		if (time - (cache.time ?? 0) > 2e3) {
			cache.time = Date.now();
			const computedStyle = window.getComputedStyle(node);
			cache.computedStyle = computedStyle;
			const overflowXString = computedStyle.overflowX;
			const overflowYString = computedStyle.overflowY;
			hasOverflowX = [
				"auto",
				"overlay",
				"scroll"
			].includes(overflowXString);
			hasOverflowY = [
				"auto",
				"overlay",
				"scroll"
			].includes(overflowYString);
			cache.hasOverflowX = hasOverflowX;
			cache.hasOverflowY = hasOverflowY;
			if (!hasOverflowX && !hasOverflowY) return false;
			if (gestureOrientation === "vertical" && !hasOverflowY) return false;
			if (gestureOrientation === "horizontal" && !hasOverflowX) return false;
			scrollWidth = node.scrollWidth;
			scrollHeight = node.scrollHeight;
			clientWidth = node.clientWidth;
			clientHeight = node.clientHeight;
			isScrollableX = scrollWidth > clientWidth;
			isScrollableY = scrollHeight > clientHeight;
			cache.isScrollableX = isScrollableX;
			cache.isScrollableY = isScrollableY;
			cache.scrollWidth = scrollWidth;
			cache.scrollHeight = scrollHeight;
			cache.clientWidth = clientWidth;
			cache.clientHeight = clientHeight;
		} else {
			isScrollableX = cache.isScrollableX;
			isScrollableY = cache.isScrollableY;
			hasOverflowX = cache.hasOverflowX;
			hasOverflowY = cache.hasOverflowY;
			scrollWidth = cache.scrollWidth;
			scrollHeight = cache.scrollHeight;
			clientWidth = cache.clientWidth;
			clientHeight = cache.clientHeight;
		}
		if (!hasOverflowX && !hasOverflowY || !isScrollableX && !isScrollableY) return false;
		if (gestureOrientation === "vertical" && (!hasOverflowY || !isScrollableY)) return false;
		if (gestureOrientation === "horizontal" && (!hasOverflowX || !isScrollableX)) return false;
		let orientation;
		if (gestureOrientation === "horizontal") orientation = "x";
		else if (gestureOrientation === "vertical") orientation = "y";
		else {
			const isScrollingX = deltaX !== 0;
			const isScrollingY = deltaY !== 0;
			if (isScrollingX && hasOverflowX && isScrollableX) orientation = "x";
			if (isScrollingY && hasOverflowY && isScrollableY) orientation = "y";
		}
		if (!orientation) return false;
		let scroll, maxScroll, delta, hasOverflow, isScrollable;
		if (orientation === "x") {
			scroll = node.scrollLeft;
			maxScroll = scrollWidth - clientWidth;
			delta = deltaX;
			hasOverflow = hasOverflowX;
			isScrollable = isScrollableX;
		} else if (orientation === "y") {
			scroll = node.scrollTop;
			maxScroll = scrollHeight - clientHeight;
			delta = deltaY;
			hasOverflow = hasOverflowY;
			isScrollable = isScrollableY;
		} else return false;
		return (delta > 0 ? scroll < maxScroll : scroll > 0) && hasOverflow && isScrollable;
	}
	/**
	* The root element on which lenis is instanced
	*/
	get rootElement() {
		return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
	}
	/**
	* The limit which is the maximum scroll value
	*/
	get limit() {
		if (this.options.naiveDimensions) if (this.isHorizontal) return this.rootElement.scrollWidth - this.rootElement.clientWidth;
		else return this.rootElement.scrollHeight - this.rootElement.clientHeight;
		else return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
	}
	/**
	* Whether or not the scroll is horizontal
	*/
	get isHorizontal() {
		return this.options.orientation === "horizontal";
	}
	/**
	* The actual scroll value
	*/
	get actualScroll() {
		const wrapper = this.options.wrapper;
		return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
	}
	/**
	* The current scroll value
	*/
	get scroll() {
		return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
	}
	/**
	* The progress of the scroll relative to the limit
	*/
	get progress() {
		return this.limit === 0 ? 1 : this.scroll / this.limit;
	}
	/**
	* Current scroll state
	*/
	get isScrolling() {
		return this._isScrolling;
	}
	set isScrolling(value) {
		if (this._isScrolling !== value) {
			this._isScrolling = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is stopped
	*/
	get isStopped() {
		return this._isStopped;
	}
	set isStopped(value) {
		if (this._isStopped !== value) {
			this._isStopped = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is locked
	*/
	get isLocked() {
		return this._isLocked;
	}
	set isLocked(value) {
		if (this._isLocked !== value) {
			this._isLocked = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is smooth scrolling
	*/
	get isSmooth() {
		return this.isScrolling === "smooth";
	}
	/**
	* The class name applied to the wrapper element
	*/
	get className() {
		let className = "lenis";
		if (this.options.autoToggle) className += " lenis-autoToggle";
		if (this.isStopped) className += " lenis-stopped";
		if (this.isLocked) className += " lenis-locked";
		if (this.isScrolling) className += " lenis-scrolling";
		if (this.isScrolling === "smooth") className += " lenis-smooth";
		return className;
	}
	updateClassName() {
		this.cleanUpClassName();
		this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
	}
	cleanUpClassName() {
		this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
	}
};

//#endregion
//#region node_modules/locomotive-scroll/dist/locomotive-scroll.modern.mjs
function s() {
	return s = Object.assign ? Object.assign.bind() : function(t) {
		for (var s$1 = 1; s$1 < arguments.length; s$1++) {
			var e$1 = arguments[s$1];
			for (var i$1 in e$1) ({}).hasOwnProperty.call(e$1, i$1) && (t[i$1] = e$1[i$1]);
		}
		return t;
	}, s.apply(null, arguments);
}
var e = class {
	constructor({ scrollElements: t, rootMargin: s$1 = "-1px -1px -1px -1px", root: e$1 = null, IORaf: i$1 }) {
		this.scrollElements = void 0, this.rootMargin = void 0, this.root = void 0, this.IORaf = void 0, this.observer = void 0, this.scrollElements = t, this.rootMargin = s$1, this.root = e$1, this.IORaf = i$1, this._init();
	}
	_init() {
		this.observer = new IntersectionObserver((t) => {
			t.forEach((t$1) => {
				const s$1 = this.scrollElements.find((s$2) => s$2.$el === t$1.target);
				t$1.isIntersecting ? (s$1 && (s$1.isAlreadyIntersected = !0), this._setInview(t$1)) : s$1 && s$1.isAlreadyIntersected && this._setOutOfView(t$1);
			});
		}, {
			root: this.root,
			rootMargin: this.rootMargin
		});
		for (const t of this.scrollElements) this.observe(t.$el);
	}
	destroy() {
		this.observer.disconnect();
	}
	observe(t) {
		t && this.observer.observe(t);
	}
	unobserve(t) {
		t && this.observer.unobserve(t);
	}
	_setInview(t) {
		const s$1 = this.scrollElements.find((s$2) => s$2.$el === t.target);
		this.IORaf && s$1?.setInteractivityOn(), !this.IORaf && s$1?.setInview();
	}
	_setOutOfView(t) {
		const s$1 = this.scrollElements.find((s$2) => s$2.$el === t.target);
		this.IORaf && s$1?.setInteractivityOff(), !this.IORaf && s$1?.setOutOfView(), null != s$1 && s$1.attributes.scrollRepeat || this.IORaf || this.unobserve(t.target);
	}
};
function i(t, s$1, e$1, i$1, n$1) {
	return e$1 + ((n$1 - t) / (s$1 - t) * (i$1 - e$1) || 0);
}
function n(t, s$1) {
	return t.reduce((t$1, e$1) => Math.abs(e$1 - s$1) < Math.abs(t$1 - s$1) ? e$1 : t$1);
}
var r = "--progress";
var l = class {
	constructor({ $el: t, id: s$1, subscribeElementUpdateFn: e$1, unsubscribeElementUpdateFn: i$1, needRaf: n$1, scrollOrientation: r$1, lenisInstance: l$1 }) {
		var o$1, a$1, c$1, h, d;
		this.$el = void 0, this.id = void 0, this.needRaf = void 0, this.attributes = void 0, this.scrollOrientation = void 0, this.isAlreadyIntersected = void 0, this.intersection = void 0, this.metrics = void 0, this.currentScroll = void 0, this.translateValue = void 0, this.progress = void 0, this.lastProgress = void 0, this.isInview = void 0, this.isInteractive = void 0, this.isInFold = void 0, this.isFirstResize = void 0, this.subscribeElementUpdateFn = void 0, this.unsubscribeElementUpdateFn = void 0, this.lenisInstance = void 0, this.getWindowSize = void 0, this.getMetricsStart = void 0, this.getMetricsSize = void 0, this.startPositionHandlers = {
			start: (t$1, s$2, e$2) => t$1 - s$2 + e$2,
			middle: (t$1, s$2, e$2, i$2) => t$1 - s$2 + e$2 + .5 * i$2,
			end: (t$1, s$2, e$2, i$2) => t$1 - s$2 + e$2 + i$2,
			fold: () => 0
		}, this.endPositionHandlers = {
			start: (t$1, s$2) => t$1 - s$2,
			middle: (t$1, s$2, e$2) => t$1 - s$2 + .5 * e$2,
			end: (t$1, s$2, e$2) => t$1 - s$2 + e$2
		}, this.$el = t, this.id = s$1, this.needRaf = n$1, this.scrollOrientation = r$1, this.lenisInstance = l$1, this.subscribeElementUpdateFn = e$1, this.unsubscribeElementUpdateFn = i$1, this.attributes = {
			scrollClass: null != (o$1 = this.$el.dataset.scrollClass) ? o$1 : "is-inview",
			scrollOffset: null != (a$1 = this.$el.dataset.scrollOffset) ? a$1 : "0,0",
			scrollPosition: null != (c$1 = this.$el.dataset.scrollPosition) ? c$1 : "start,end",
			scrollCssProgress: void 0 !== this.$el.dataset.scrollCssProgress,
			scrollEventProgress: null != (h = this.$el.dataset.scrollEventProgress) ? h : null,
			scrollSpeed: void 0 !== this.$el.dataset.scrollSpeed ? parseFloat(this.$el.dataset.scrollSpeed) : null,
			scrollRepeat: void 0 !== this.$el.dataset.scrollRepeat,
			scrollCall: null != (d = this.$el.dataset.scrollCall) ? d : null,
			scrollIgnoreFold: void 0 !== this.$el.dataset.scrollIgnoreFold,
			scrollEnableTouchSpeed: void 0 !== this.$el.dataset.scrollEnableTouchSpeed
		}, this.intersection = {
			start: 0,
			end: 0
		}, this.metrics = {
			offsetStart: 0,
			offsetEnd: 0,
			bcr: {}
		}, this.currentScroll = this.lenisInstance.scroll, this.translateValue = 0, this.progress = 0, this.lastProgress = null, this.isInview = !1, this.isInteractive = !1, this.isAlreadyIntersected = !1, this.isInFold = !1, this.isFirstResize = !0, this.getWindowSize = "vertical" === this.scrollOrientation ? () => this.lenisInstance.dimensions.height : () => this.lenisInstance.dimensions.width, this.getMetricsStart = "vertical" === this.scrollOrientation ? (t$1) => t$1.top : (t$1) => t$1.left, this.getMetricsSize = "vertical" === this.scrollOrientation ? (t$1) => t$1.height : (t$1) => t$1.width, this._init();
	}
	_init() {
		this.needRaf && this._resize();
	}
	onResize({ currentScroll: t }) {
		this.currentScroll = t, this._resize();
	}
	onRender({ currentScroll: t, smooth: s$1 }) {
		const e$1 = this.getWindowSize();
		if (this.currentScroll = t, this._computeProgress(), this.attributes.scrollSpeed && !isNaN(this.attributes.scrollSpeed)) if (this.attributes.scrollEnableTouchSpeed || s$1) {
			if (this.isInFold) this.translateValue = Math.max(0, this.progress) * e$1 * this.attributes.scrollSpeed * -1;
			else this.translateValue = i(0, 1, -1, 1, this.progress) * e$1 * this.attributes.scrollSpeed * -1;
			this.$el.style.transform = "vertical" === this.scrollOrientation ? `translate3d(0, ${this.translateValue}px, 0)` : `translate3d(${this.translateValue}px, 0, 0)`;
		} else this.translateValue && (this.$el.style.transform = "translate3d(0, 0, 0)"), this.translateValue = 0;
	}
	setInview() {
		if (this.isInview) return;
		this.isInview = !0, this.$el.classList.add(this.attributes.scrollClass);
		const t = this._getScrollCallFrom();
		this.attributes.scrollCall && this._dispatchCall("enter", t);
	}
	setOutOfView() {
		if (!this.isInview || !this.attributes.scrollRepeat) return;
		this.isInview = !1, this.$el.classList.remove(this.attributes.scrollClass);
		const t = this._getScrollCallFrom();
		this.attributes.scrollCall && this._dispatchCall("leave", t);
	}
	setInteractivityOn() {
		this.isInteractive || (this.isInteractive = !0, this.subscribeElementUpdateFn(this));
	}
	setInteractivityOff() {
		this.isInteractive && (this.isInteractive = !1, this.unsubscribeElementUpdateFn(this), null !== this.lastProgress && this._computeProgress(n([0, 1], this.lastProgress)));
	}
	_resize() {
		this.metrics.bcr = this.$el.getBoundingClientRect(), this._computeMetrics(), this._computeIntersection(), this.isFirstResize && (this.isFirstResize = !1, this.isInFold && this.setInview());
	}
	_computeMetrics() {
		const t = this.getWindowSize(), s$1 = this.getMetricsStart(this.metrics.bcr), e$1 = this.getMetricsSize(this.metrics.bcr);
		this.metrics.offsetStart = this.currentScroll + s$1 - this.translateValue, this.metrics.offsetEnd = this.metrics.offsetStart + e$1, this.isInFold = this.metrics.offsetStart < t && !this.attributes.scrollIgnoreFold;
	}
	_computeIntersection() {
		var t, s$1, e$1, i$1, n$1, r$1, l$1, o$1;
		const a$1 = this.getWindowSize(), c$1 = this.getMetricsSize(this.metrics.bcr), h = this.attributes.scrollOffset.split(","), d = null != (t = null == (s$1 = h[0]) ? void 0 : s$1.trim()) ? t : "0", u = null != (e$1 = null == (i$1 = h[1]) ? void 0 : i$1.trim()) ? e$1 : "0", m = this.attributes.scrollPosition.split(",");
		let v = null != (n$1 = null == (r$1 = m[0]) ? void 0 : r$1.trim()) ? n$1 : "start";
		const f = null != (l$1 = null == (o$1 = m[1]) ? void 0 : o$1.trim()) ? l$1 : "end", g = d.includes("%") ? a$1 * parseInt(d.replace("%", "").trim()) * .01 : parseInt(d), p = u.includes("%") ? a$1 * parseInt(u.replace("%", "").trim()) * .01 : parseInt(u);
		this.isInFold && (v = "fold");
		const I = this.startPositionHandlers[v];
		this.intersection.start = I ? I(this.metrics.offsetStart, a$1, g, c$1) : this.metrics.offsetStart - a$1 + g;
		const b = this.endPositionHandlers[f];
		if (this.intersection.end = b ? b(this.metrics.offsetStart, p, c$1) : this.metrics.offsetStart - p + c$1, this.intersection.end <= this.intersection.start) switch (f) {
			case "start":
			default:
				this.intersection.end = this.intersection.start + 1;
				break;
			case "middle":
				this.intersection.end = this.intersection.start + .5 * c$1;
				break;
			case "end": this.intersection.end = this.intersection.start + c$1;
		}
	}
	_computeProgress(t) {
		const s$1 = null != t ? t : (e$1 = i(this.intersection.start, this.intersection.end, 0, 1, this.currentScroll)) < 0 ? 0 : e$1 > 1 ? 1 : e$1;
		var e$1;
		this.progress = s$1, s$1 !== this.lastProgress && (this.lastProgress = s$1, this.attributes.scrollCssProgress && this._setCssProgress(s$1), this.attributes.scrollEventProgress && this._setCustomEventProgress(s$1), s$1 > 0 && s$1 < 1 && this.setInview(), 0 === s$1 && this.setOutOfView(), 1 === s$1 && this.setOutOfView());
	}
	_setCssProgress(t = 0) {
		this.$el.style.setProperty(r, t.toString());
	}
	_setCustomEventProgress(t = 0) {
		const s$1 = this.attributes.scrollEventProgress;
		if (!s$1) return;
		const e$1 = new CustomEvent(s$1, { detail: {
			target: this.$el,
			progress: t
		} });
		window.dispatchEvent(e$1);
	}
	_getScrollCallFrom() {
		const t = n([this.intersection.start, this.intersection.end], this.currentScroll);
		return this.intersection.start === t ? "start" : "end";
	}
	destroy() {
		this.attributes.scrollCssProgress && this.$el.style.removeProperty(r), this.attributes.scrollSpeed && this.$el.style.removeProperty("transform"), this.isInview && this.attributes.scrollClass && this.$el.classList.remove(this.attributes.scrollClass);
	}
	_dispatchCall(t, s$1) {
		const e$1 = this.attributes.scrollCall;
		if (!e$1) return;
		const i$1 = new CustomEvent(e$1, { detail: {
			target: this.$el,
			way: t,
			from: s$1
		} });
		window.dispatchEvent(i$1);
	}
};
var o = [
	"scrollOffset",
	"scrollPosition",
	"scrollCssProgress",
	"scrollEventProgress",
	"scrollSpeed"
];
var a = class {
	constructor({ $el: t, triggerRootMargin: s$1, rafRootMargin: e$1, scrollOrientation: i$1, lenisInstance: n$1 }) {
		this.$scrollContainer = void 0, this.triggerRootMargin = void 0, this.rafRootMargin = void 0, this.scrollElements = void 0, this.triggeredScrollElements = void 0, this.RAFScrollElements = void 0, this.scrollElementsToUpdate = void 0, this.IOTriggerInstance = void 0, this.IORafInstance = void 0, this.scrollOrientation = void 0, this.lenisInstance = void 0, t ? (this.$scrollContainer = t, this.lenisInstance = n$1, this.scrollOrientation = i$1, this.triggerRootMargin = null != s$1 ? s$1 : "-1px -1px -1px -1px", this.rafRootMargin = null != e$1 ? e$1 : "100% 100% 100% 100%", this.scrollElements = [], this.triggeredScrollElements = [], this.RAFScrollElements = [], this.scrollElementsToUpdate = [], this._init()) : console.error("Please provide a DOM Element as scrollContainer");
	}
	_init() {
		const t = this.$scrollContainer.querySelectorAll("[data-scroll]"), s$1 = this.toElementArray(t);
		this._subscribeScrollElements(s$1);
		const i$1 = this.lenisInstance.options.wrapper === window ? null : this.lenisInstance.options.wrapper;
		this.IOTriggerInstance = new e({
			scrollElements: [...this.triggeredScrollElements],
			root: i$1,
			rootMargin: this.triggerRootMargin,
			IORaf: !1
		}), this.IORafInstance = new e({
			scrollElements: [...this.RAFScrollElements],
			root: i$1,
			rootMargin: this.rafRootMargin,
			IORaf: !0
		});
	}
	destroy() {
		this.IOTriggerInstance.destroy(), this.IORafInstance.destroy(), this._unsubscribeAllScrollElements();
	}
	onResize({ currentScroll: t }) {
		for (const s$1 of this.RAFScrollElements) s$1.onResize({ currentScroll: t });
	}
	onRender({ currentScroll: t, smooth: s$1 }) {
		for (const e$1 of this.scrollElementsToUpdate) e$1.onRender({
			currentScroll: t,
			smooth: s$1
		});
	}
	removeScrollElements(t) {
		const s$1 = t.querySelectorAll("[data-scroll]");
		if (!s$1.length) return;
		const e$1 = new Set(Array.from(s$1));
		for (let t$1 = 0; t$1 < this.triggeredScrollElements.length; t$1++) {
			const s$2 = this.triggeredScrollElements[t$1];
			e$1.has(s$2.$el) && (this.IOTriggerInstance.unobserve(s$2.$el), this.triggeredScrollElements.splice(t$1, 1));
		}
		for (let t$1 = 0; t$1 < this.RAFScrollElements.length; t$1++) {
			const s$2 = this.RAFScrollElements[t$1];
			e$1.has(s$2.$el) && (this.IORafInstance.unobserve(s$2.$el), this.RAFScrollElements.splice(t$1, 1));
		}
		s$1.forEach((t$1) => {
			const s$2 = this.scrollElementsToUpdate.find((s$3) => s$3.$el === t$1), e$2 = this.scrollElements.find((s$3) => s$3.$el === t$1);
			s$2 && this._unsubscribeElementUpdate(s$2), e$2 && (this.scrollElements = this.scrollElements.filter((t$2) => t$2.id != e$2.id));
		});
	}
	addScrollElements(t) {
		const s$1 = t.querySelectorAll("[data-scroll]"), e$1 = [];
		this.scrollElements.forEach((t$1) => {
			e$1.push(t$1.id);
		});
		const i$1 = Math.max(...e$1, 0) + 1, n$1 = this.toElementArray(s$1);
		this._subscribeScrollElements(n$1, i$1, !0);
	}
	_subscribeScrollElements(t, s$1 = 0, e$1 = !1) {
		for (let i$1 = 0; i$1 < t.length; i$1++) {
			const n$1 = t[i$1], r$1 = this._checkRafNeeded(n$1), o$1 = new l({
				$el: n$1,
				id: s$1 + i$1,
				scrollOrientation: this.scrollOrientation,
				lenisInstance: this.lenisInstance,
				subscribeElementUpdateFn: this._subscribeElementUpdate.bind(this),
				unsubscribeElementUpdateFn: this._unsubscribeElementUpdate.bind(this),
				needRaf: r$1
			});
			this.scrollElements.push(o$1), r$1 ? (this.RAFScrollElements.push(o$1), e$1 && (this.IORafInstance.scrollElements.push(o$1), this.IORafInstance.observe(o$1.$el))) : (this.triggeredScrollElements.push(o$1), e$1 && (this.IOTriggerInstance.scrollElements.push(o$1), this.IOTriggerInstance.observe(o$1.$el)));
		}
	}
	_unsubscribeAllScrollElements() {
		for (const t of this.scrollElements) t.destroy();
		this.scrollElements = [], this.RAFScrollElements = [], this.triggeredScrollElements = [], this.scrollElementsToUpdate = [];
	}
	_subscribeElementUpdate(t) {
		this.scrollElementsToUpdate.push(t);
	}
	_unsubscribeElementUpdate(t) {
		this.scrollElementsToUpdate = this.scrollElementsToUpdate.filter((s$1) => s$1.id != t.id);
	}
	toElementArray(t) {
		return Array.from(t);
	}
	_checkRafNeeded(t) {
		let s$1 = [...o];
		const e$1 = (t$1) => {
			s$1 = s$1.filter((s$2) => s$2 !== t$1);
		};
		if (t.dataset.scrollOffset) {
			if ("0,0" !== t.dataset.scrollOffset.split(",").map((t$1) => t$1.replace("%", "").trim()).join(",")) return !0;
			e$1("scrollOffset");
		} else e$1("scrollOffset");
		if (t.dataset.scrollPosition) {
			if ("top,bottom" !== t.dataset.scrollPosition.trim()) return !0;
			e$1("scrollPosition");
		} else e$1("scrollPosition");
		if (t.dataset.scrollSpeed && !isNaN(parseFloat(t.dataset.scrollSpeed))) return !0;
		e$1("scrollSpeed");
		for (const e$2 of s$1) if (e$2 in t.dataset) return !0;
		return !1;
	}
};
var c = class {
	constructor({ lenisOptions: t = {}, triggerRootMargin: s$1, rafRootMargin: e$1, autoStart: i$1 = !0, scrollCallback: n$1 = () => {}, initCustomTicker: r$1, destroyCustomTicker: l$1 } = {}) {
		this.rafPlaying = void 0, this.lenisInstance = null, this.coreInstance = null, this.lenisOptions = void 0, this.triggerRootMargin = void 0, this.rafRootMargin = void 0, this.rafInstance = void 0, this.autoStart = void 0, this.isTouchDevice = void 0, this.initCustomTicker = void 0, this.destroyCustomTicker = void 0, this._onRenderBind = void 0, this._onResizeBind = void 0, this._onScrollToBind = void 0, this._originalOnContentResize = void 0, this._originalOnWrapperResize = void 0, window.locomotiveScrollVersion = "5.0.0", Object.assign(this, {
			lenisOptions: t,
			triggerRootMargin: s$1,
			rafRootMargin: e$1,
			autoStart: i$1,
			scrollCallback: n$1,
			initCustomTicker: r$1,
			destroyCustomTicker: l$1
		}), this._onRenderBind = this._onRender.bind(this), this._onScrollToBind = this._onScrollTo.bind(this), this._onResizeBind = this._onResize.bind(this), this.rafPlaying = !1, this.isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0, this._init();
	}
	_init() {
		this.lenisInstance = new Lenis(s({}, this.lenisOptions)), this.scrollCallback && this.lenisInstance.on("scroll", this.scrollCallback), document.documentElement.setAttribute("data-scroll-orientation", this.lenisInstance.options.orientation), requestAnimationFrame(() => {
			this.coreInstance = new a({
				$el: this.lenisInstance.rootElement,
				triggerRootMargin: this.triggerRootMargin,
				rafRootMargin: this.rafRootMargin,
				scrollOrientation: this.lenisInstance.options.orientation,
				lenisInstance: this.lenisInstance
			}), this._bindEvents(), this.initCustomTicker && !this.destroyCustomTicker ? console.warn("initCustomTicker callback is declared, but destroyCustomTicker is not. Please pay attention. It could cause trouble.") : !this.initCustomTicker && this.destroyCustomTicker && console.warn("destroyCustomTicker callback is declared, but initCustomTicker is not. Please pay attention. It could cause trouble."), this.autoStart && this.start();
		});
	}
	destroy() {
		var t;
		this.stop(), this._unbindEvents(), null == (t = this.lenisInstance) || t.destroy(), requestAnimationFrame(() => {
			var t$1;
			null == (t$1 = this.coreInstance) || t$1.destroy();
		});
	}
	_bindEvents() {
		this._bindScrollToEvents(), this.lenisInstance && (this._originalOnContentResize = this.lenisInstance.dimensions.onContentResize.bind(this.lenisInstance.dimensions), this._originalOnWrapperResize = this.lenisInstance.dimensions.onWrapperResize.bind(this.lenisInstance.dimensions), this.lenisInstance.dimensions.onContentResize = () => {
			var t;
			null == (t = this._originalOnContentResize) || t.call(this), this._onResizeBind();
		}, this.lenisInstance.dimensions.onWrapperResize = () => {
			var t;
			null == (t = this._originalOnWrapperResize) || t.call(this), this._onResizeBind();
		});
	}
	_unbindEvents() {
		this._unbindScrollToEvents(), this.lenisInstance && (this._originalOnContentResize && (this.lenisInstance.dimensions.onContentResize = this._originalOnContentResize), this._originalOnWrapperResize && (this.lenisInstance.dimensions.onWrapperResize = this._originalOnWrapperResize));
	}
	_bindScrollToEvents(t) {
		var s$1;
		const e$1 = t || (null == (s$1 = this.lenisInstance) ? void 0 : s$1.rootElement), i$1 = null == e$1 ? void 0 : e$1.querySelectorAll("[data-scroll-to]");
		null != i$1 && i$1.length && i$1.forEach((t$1) => {
			t$1.addEventListener("click", this._onScrollToBind, !1);
		});
	}
	_unbindScrollToEvents(t) {
		var s$1;
		const e$1 = t || (null == (s$1 = this.lenisInstance) ? void 0 : s$1.rootElement), i$1 = null == e$1 ? void 0 : e$1.querySelectorAll("[data-scroll-to]");
		null != i$1 && i$1.length && i$1.forEach((t$1) => {
			t$1.removeEventListener("click", this._onScrollToBind, !1);
		});
	}
	_onResize() {
		var t, s$1, e$1;
		null == (t = this.coreInstance) || t.onResize({
			currentScroll: null != (s$1 = null == (e$1 = this.lenisInstance) ? void 0 : e$1.scroll) ? s$1 : 0,
			smooth: !this.isTouchDevice
		});
	}
	_onRender() {
		var t, s$1, e$1, i$1;
		null == (t = this.lenisInstance) || t.raf(Date.now()), null == (s$1 = this.coreInstance) || s$1.onRender({
			currentScroll: null != (e$1 = null == (i$1 = this.lenisInstance) ? void 0 : i$1.scroll) ? e$1 : 0,
			smooth: !this.isTouchDevice
		});
	}
	_onScrollTo(t) {
		var s$1, e$1;
		t.preventDefault();
		const i$1 = null != (s$1 = t.currentTarget) ? s$1 : null;
		if (!i$1) return;
		const n$1 = i$1.getAttribute("data-scroll-to-href") || i$1.getAttribute("href"), r$1 = i$1.getAttribute("data-scroll-to-offset") || 0, l$1 = i$1.getAttribute("data-scroll-to-duration") || (null == (e$1 = this.lenisInstance) ? void 0 : e$1.options.duration);
		n$1 && this.scrollTo(n$1, {
			offset: "string" == typeof r$1 ? parseInt(r$1) : r$1,
			duration: "string" == typeof l$1 ? parseInt(l$1) : l$1
		});
	}
	start() {
		var t;
		this.rafPlaying || (null == (t = this.lenisInstance) || t.start(), this.rafPlaying = !0, this.initCustomTicker ? this.initCustomTicker(this._onRenderBind) : this._raf());
	}
	stop() {
		var t;
		this.rafPlaying && (null == (t = this.lenisInstance) || t.stop(), this.rafPlaying = !1, this.destroyCustomTicker ? this.destroyCustomTicker(this._onRenderBind) : this.rafInstance && cancelAnimationFrame(this.rafInstance));
	}
	removeScrollElements(t) {
		var s$1;
		t ? (this._unbindScrollToEvents(t), null == (s$1 = this.coreInstance) || s$1.removeScrollElements(t)) : console.error("Please provide a DOM Element as $oldContainer");
	}
	addScrollElements(t) {
		var s$1;
		t ? (null == (s$1 = this.coreInstance) || s$1.addScrollElements(t), requestAnimationFrame(() => {
			this._bindScrollToEvents(t);
		})) : console.error("Please provide a DOM Element as $newContainer");
	}
	resize() {
		this._onResizeBind();
	}
	scrollTo(t, s$1) {
		var e$1;
		null == (e$1 = this.lenisInstance) || e$1.scrollTo(t, {
			offset: null == s$1 ? void 0 : s$1.offset,
			lerp: null == s$1 ? void 0 : s$1.lerp,
			duration: null == s$1 ? void 0 : s$1.duration,
			immediate: null == s$1 ? void 0 : s$1.immediate,
			lock: null == s$1 ? void 0 : s$1.lock,
			force: null == s$1 ? void 0 : s$1.force,
			easing: null == s$1 ? void 0 : s$1.easing,
			onComplete: null == s$1 ? void 0 : s$1.onComplete
		});
	}
	_raf() {
		this._onRenderBind(), this.rafInstance = requestAnimationFrame(() => this._raf());
	}
};

//#endregion
export { c as default };
//# sourceMappingURL=locomotive-scroll.js.map