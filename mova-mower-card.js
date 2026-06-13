/* ── mova-mower-card v12.772 (mini-stats auto-tonte: interrupteur) ── */
(function() {
  const style = document.createElement('style');
  style.textContent = ".header{padding:1.25rem 1.25rem .625rem;text-align:center}.header__top{display:flex;justify-content:space-between;align-items:flex-start}.header__title-wrapper{flex:1;text-align:center;padding-left:2rem}.header__settings-btn{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;padding:0;background:none;border:none;color:var(--text-secondary, #666);cursor:pointer;border-radius:.5rem;transition:all .2s ease}.header__settings-btn svg{width:1.25rem;height:1.25rem}.header__settings-btn:hover{background:var(--hover-bg, rgba(0, 0, 0, .05));color:var(--text-primary, #1a1a1a)}.header__settings-btn:active{background:var(--active-bg, rgba(0, 0, 0, .1))}.header__title{margin:0;font-size:1rem;font-weight:600;color:var(--text-primary, #1a1a1a)}.header__status{margin:0;font-size:.875rem;color:var(--text-secondary, #666)}.header__progress{margin:0 auto;max-width:12.5rem}.header__progress-bar{width:100%;height:.25rem;background-color:var(--surface-tertiary, #e8e8e8);border-radius:.25rem;overflow:hidden}.header__progress-fill{height:100%;background-color:var(--accent-color, #007aff);transition:width .3s ease}.header__progress-text{margin:.25rem 0 0;font-size:.75rem;color:var(--text-tertiary, #999)}.header__stats{display:flex;justify-content:center;gap:1.25rem;font-size:1rem;color:var(--text-primary, #1a1a1a);margin-top:.875rem;align-items:center}.header__stat{display:flex;align-items:center;gap:.25rem}.header__stat-icon,.header__stat-icon--cleaning-time,.header__stat-icon--area{display:flex}.header__stat-icon--cleaning-time svg,.header__stat-icon--area svg{scale:.8}.header__stat-value{display:flex;font-weight:500}.cleaning-mode-button-wrapper{margin:.625rem 1.25rem;width:calc(100% - 2.5rem);display:flex;align-items:center;gap:.5rem}.cleaning-mode-button-wrapper__shortcuts{background:var(--accent-color, #007aff);color:#fff;border:none;border-radius:50%;width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;flex-shrink:0;transition:transform .2s,opacity .2s;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-button-wrapper__shortcuts svg{scale:.8}.cleaning-mode-button-wrapper__shortcuts:hover:not(:disabled){transform:scale(1.1);opacity:.9;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button-wrapper__shortcuts:active:not(:disabled){transform:scale(.95)}.cleaning-mode-button-wrapper__shortcuts:disabled{opacity:.5;cursor:not-allowed}.cleaning-mode-button{flex:1;background:var(--surface-bg, #fff);border:none;border-radius:.75rem;padding:.75rem 1rem;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08));color:var(--text-primary, #1a1a1a);font-weight:400;font-size:.9375rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:transform .1s ease}.cleaning-mode-button:hover:not(:disabled){box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button:active:not(:disabled){transform:scale(.98)}.cleaning-mode-button--disabled,.cleaning-mode-button:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.cleaning-mode-button__content{display:flex;align-items:center}.cleaning-mode-button__icon{scale:.7;display:flex}.cleaning-mode-button__text{font-weight:400;font-size:.8rem}.cleaning-mode-button__arrow{font-size:1.25rem;color:var(--text-tertiary, #999)}.vacuum-map{position:relative;margin:0 1.25rem;border-radius:.9375rem;overflow:hidden;background:var(--surface-bg, #fff);display:flex;align-items:center;justify-content:center;box-shadow:0 .25rem .9375rem var(--card-shadow, rgba(0, 0, 0, .1));min-height:18.75rem}.vacuum-map__image{width:100%;height:100%;object-fit:contain;border-radius:.9375rem}.dreame-vacuum-card--dark .vacuum-map .vacuum-map__image{filter:brightness(.8) contrast(.9) saturate(.85)}.vacuum-map__placeholder{color:#666;text-align:center;font-size:.875rem}.vacuum-map__placeholder small{font-size:.75rem;color:#999}.vacuum-map__overlay{position:absolute;inset:0;background:#0000000d;border-radius:.9375rem;display:flex;align-items:center;justify-content:center;font-size:.875rem;color:#666;pointer-events:none}.vacuum-map__cycles{position:absolute;right:1rem;bottom:1rem;width:2.5rem;height:2.5rem;border-radius:25%;border-radius:.375rem}.vacuum-map__zone{position:absolute;border:.1875rem solid #007aff;background:repeating-linear-gradient(45deg,#007aff1a,#007aff1a .625rem,#007aff0d .625rem 1.25rem);pointer-events:auto;border-radius:.5rem;box-shadow:0 .125rem .75rem #007aff4d}.vacuum-map__zone-handle{position:absolute;width:1.5rem;height:1.5rem;background:#007aff;border:.125rem solid white;border-radius:50%;cursor:pointer;pointer-events:auto;box-shadow:0 .125rem .25rem #0003;transition:all .2s ease;z-index:10;touch-action:none}.vacuum-map__zone-handle:before{content:\"\";position:absolute;inset:-.5rem}.vacuum-map__zone-handle:hover{background:#0051d5;transform:scale(1.2)}.vacuum-map__zone-handle:active{transform:scale(.9)}.vacuum-map__zone-handle--tl{top:-.75rem;left:-.75rem;cursor:nwse-resize}.vacuum-map__zone-handle--tr{top:-.75rem;right:-.75rem;cursor:nesw-resize}.vacuum-map__zone-handle--bl{bottom:-.75rem;left:-.75rem;cursor:nesw-resize}.vacuum-map__zone-handle--br{bottom:-.75rem;right:-.75rem;cursor:nwse-resize}.vacuum-map__zone-clear{position:absolute;top:-.75rem;right:-.75rem;width:1.5rem;height:1.5rem;border-radius:50%;background:#ff3b30;color:#fff;border:.125rem solid white;font-size:1.125rem;font-weight:700;cursor:pointer;pointer-events:auto;display:flex;align-items:center;justify-content:center;box-shadow:0 .125rem .5rem #ff3b3066;transition:all .2s ease;line-height:1;padding:0}.vacuum-map__zone-clear:hover{background:#ff1f0f;transform:scale(1.1)}.vacuum-map__zone-clear:active{transform:scale(.95)}.vacuum-map__room-segments{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto}.vacuum-map__room-segment{cursor:pointer;transition:all .2s ease}.vacuum-map__room-segment:hover{fill:var(--accent-bg-transparent, rgba(212, 175, 55, .2));stroke:var(--accent-color, #d4af37);stroke-width:3}.vacuum-map__room-segment--selected{fill:var(--accent-bg-transparent, rgba(212, 175, 55, .3));stroke:var(--accent-color, #d4af37);stroke-width:3}.vacuum-map__room-segment--selected:hover{fill:var(--accent-bg-transparent, rgba(212, 175, 55, .4))}.vacuum-map__rooms{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.vacuum-map__room{position:absolute;transform:translate(-50%,-50%);width:2rem;height:2rem;border-radius:50%;background:#ffffffe6;border:.125rem solid var(--border-color, #e0e0e0);display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:600;color:var(--text-primary, #1a1a1a);cursor:pointer;pointer-events:auto;transition:all .2s ease;box-shadow:0 .125rem .25rem #0000001a;z-index:2}.vacuum-map__room:hover{transform:translate(-50%,-50%) scale(1.1);background:#fff;box-shadow:0 .25rem .5rem #00000026}.vacuum-map__room--selected{background:var(--accent-color, #d4af37);color:#fff;border-color:var(--accent-color, #d4af37);box-shadow:0 .125rem .5rem var(--accent-color-shadow-color, rgba(212, 175, 55, .4))}.vacuum-map__room--selected:hover{transform:translate(-50%,-50%) scale(1.1);box-shadow:0 .25rem .75rem var(--accent-color-shadow-color, rgba(212, 175, 55, .5))}.mode-tabs{display:flex;gap:.25rem;background:var(--surface-tertiary, #e8e8e8);border-radius:.9375rem;padding:.25rem;margin-bottom:.9375rem}.mode-tabs--disabled{opacity:.5;pointer-events:none}.mode-tabs__button{flex:1;display:flex;align-items:center;justify-content:center;border:none;border-radius:.6875rem;padding:.625rem;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .2s;background-color:transparent;color:var(--text-secondary, #666)}.mode-tabs__button-icon svg{scale:.5;color:var(--text-secondary, #666)}.mode-tabs__button--active{background-color:var(--surface-bg, white);color:var(--text-primary, #000);box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .1))}.mode-tabs__button:hover:not(.mode-tabs__button--active):not(:disabled){background-color:var(--surface-bg-hover, rgba(255, 255, 255, .5))}.mode-tabs__button:disabled{cursor:not-allowed}.action-buttons{display:flex;gap:.75rem;margin-top:.9375rem}.action-buttons__clean,.action-buttons__dock,.action-buttons__pause,.action-buttons__resume,.action-buttons__stop{flex:1;background:var(--accent-bg);border:.0625rem solid var(--accent-bg);border-radius:.875rem;padding:.875rem;font-size:.9375rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;transition:all .3s cubic-bezier(.16,1,.3,1);color:var(--text-primary)}.action-buttons__clean--selected,.action-buttons__dock--selected,.action-buttons__pause--selected,.action-buttons__resume--selected,.action-buttons__stop--selected{transform:translateY(-.125rem);border:.0625rem solid var(--toggle-active-border);box-shadow:0 .625rem 1.25rem #0006,0 0 .75rem #5865f240,inset 0 .0625rem .0625rem #ffffff1a!important}.action-buttons__clean{color:var(--text-primary-invert);background:var(--accent-color)}.action-buttons__pause{color:var(--accent-color);border-color:var(--accent-color-hover)}.action-buttons__resume{color:#32d74b;border-color:#32d74b80}.action-buttons__stop{color:#ff453a;border-color:#ff453a80}.action-buttons__dock{background:var(--surface-secondary);color:var(--text-secondary)}.accordion{border-radius:.75rem;background:var(--card-bg, rgba(255, 255, 255, .8));overflow:hidden;margin-bottom:.5rem}.accordion__header{display:flex;align-items:center;justify-content:space-between;width:100%;padding:.875rem 1rem;background:none;border:none;cursor:pointer;color:var(--text-primary, #000);font-size:.9375rem;font-weight:500;text-align:left;transition:background-color .2s ease}.accordion__header:hover{background:var(--hover-bg, rgba(0, 0, 0, .03))}.accordion__header:active{background:var(--active-bg, rgba(0, 0, 0, .06))}.accordion__title-wrapper{display:flex;align-items:center;gap:.625rem}.accordion__icon{display:flex;align-items:center;justify-content:center;color:var(--accent-color, #007aff)}.accordion__icon svg{width:1.25rem;height:1.25rem}.accordion__title{font-weight:500}.accordion__chevron{width:1.25rem;height:1.25rem;color:var(--text-secondary, #666);transition:transform .3s ease}.accordion__content{max-height:0;overflow:hidden;transition:max-height .3s ease}.accordion__content-inner{padding:0 1rem 1rem}.accordion--open .accordion__chevron{transform:rotate(180deg)}.accordion--open .accordion__content{max-height:600px}.toggle{position:relative;display:inline-block;width:3.1875rem;height:1.9375rem}.toggle__input{opacity:0;width:0;height:0}.toggle__slider{position:absolute;cursor:pointer;inset:0;background-color:var(--surface-tertiary, #e0e0e0);transition:.4s;border-radius:1.9375rem}.toggle__knob{position:absolute;height:1.6875rem;width:1.6875rem;left:.125rem;bottom:.125rem;background-color:var(--surface-bg, white);transition:.4s;border-radius:50%;box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .2))}.toggle__input:checked+.toggle__slider{background-color:var(--toggle-active);border:.125rem solid var(--toggle-active-border);box-shadow:0 0 0 .25rem var(--toggle-active-shadow-color)}.toggle__input:checked+.toggle__slider .toggle__knob{transform:translate(1.25rem)}.toggle--disabled{opacity:.5;pointer-events:none}.circular-button{display:flex;flex-direction:column;align-items:center;gap:.5rem}.circular-button:hover{transform:translateY(-.125rem)}.circular-button__circle{border-radius:50%;background:var(--surface-secondary, #f5f5f5);display:flex;align-items:center;justify-content:center;cursor:pointer;border:.0625rem solid var(--text-primary, black);transition:all .2s ease;color:var(--text-primary)}.circular-button__circle--small{width:3.5rem;height:3.5rem;font-size:1.5rem}.circular-button__circle--medium{width:4.5rem;height:4.5rem;font-size:1.75rem}.circular-button__circle--large{width:5.5rem;height:5.5rem;font-size:2rem}.circular-button__circle--selected{background:var(--toggle-active);border:.1875rem solid var(--toggle-active-border);box-shadow:0 0 0 .25rem var(--toggle-active-shadow-color);color:var(--text-primary)}.circular-button__circle:hover:not(.circular-button__circle--selected){background:var(--surface-tertiary, #ebebeb)}.circular-button__circle:active{transform:scale(.95)}.circular-button__icon{display:flex;align-items:center;justify-content:center}.circular-button__icon--svg{width:100%;height:100%;color:var(--text-primary, #1a1a1a)}.circular-button__icon--svg svg{width:100%;height:100%;display:block}.circular-button__circle--selected .circular-button__icon--svg{color:#fff}.circular-button__label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center;line-height:1.2}.modal{position:absolute;inset:20% 0 0;background:var(--surface-bg, #f5f5f7);border-radius:1.25rem 1.25rem 0 0;padding:0 1.25rem 1.25rem;z-index:1000;max-height:80vh;overflow-y:hiddedn;color:var(--text-primary, black)}.modal::-webkit-scrollbar{display:none}.modal__backdrop{position:absolute;inset:0;background:var(--backdrop-bg, rgba(0, 0, 0, .4));z-index:999;border-radius:1.25rem}.modal__handle{width:2.25rem;height:.3125rem;background:var(--handle-bg, rgba(0, 0, 0, .15));border-radius:.1875rem;margin:.75rem auto 1.25rem}.segmented-control{display:flex;gap:.5rem;background:var(--surface-tertiary, #e8e8e8);border-radius:.75rem;padding:.25rem}.segmented-control__button{flex:1;border:none;border-radius:.625rem;padding:.75rem;font-size:.9375rem;font-weight:500;cursor:pointer;background-color:transparent;color:var(--text-primary, #1a1a1a);transition:all .2s}.segmented-control__button--active{background-color:var(--surface-bg, white);box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .08))}.segmented-control__button:hover:not(.segmented-control__button--active){background-color:var(--surface-bg-hover, rgba(255, 255, 255, .5))}.toast{position:fixed;bottom:1.25rem;left:50%;transform:translate(-50%);background:var(--surface-bg, #ffffff);border:.0625rem solid var(--border-color, #e0e0e0);border-radius:.5rem;padding:.75rem 1rem;display:flex;align-items:center;gap:.75rem;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12));animation:toast-slide-up .3s ease-out;z-index:1000;max-width:90%}@keyframes toast-slide-up{0%{transform:translate(-50%) translateY(1.25rem);opacity:0}to{transform:translate(-50%) translateY(0);opacity:1}}.toast__message{color:var(--text-primary, #1a1a1a);font-size:.875rem}.toast__close{background:none;border:none;color:var(--text-secondary, #666666);font-size:1.5rem;cursor:pointer;padding:0;width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;line-height:1;transition:color .2s}.toast__close:hover{color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__header{margin-bottom:1.5rem}.cleaning-mode-modal__content-wrapper{max-height:38rem;overflow-y:auto;width:100%;overflow-x:hidden}.cleaning-mode-modal__content-wrapper::-webkit-scrollbar{display:none}.cleaning-mode-modal__section{margin-bottom:1.5rem}.cleaning-mode-modal__section-title{font-size:.9375rem;color:var(--text-primary, #1a1a1a);font-weight:500;margin:0 0 .75rem}.cleaning-mode-modal__section-header{display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem}.cleaning-mode-modal__help-icon{display:inline-flex;align-items:center;justify-content:center;width:1rem;height:1rem;border-radius:50%;border:.09375rem solid var(--text-tertiary, #999);font-size:.6875rem;color:var(--text-tertiary, #999);font-weight:600}.cleaning-mode-modal__room-map{background:var(--surface-bg, white);border-radius:.75rem;padding:1rem;display:flex;align-items:center;justify-content:center;min-height:7.5rem}.cleaning-mode-modal__placeholder{font-size:.8125rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.cleaning-mode-modal__mode-card{position:relative;border:.125rem solid var(--border-color, #e0e0e0);border-radius:1rem;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-bg, white);padding:1.5rem 1rem;transition:all .2s ease}.cleaning-mode-modal__mode-card:hover{transform:translateY(-.125rem);box-shadow:0 .25rem .75rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-modal__mode-card--selected{border:.1875rem solid var(--accent-color, #d4af37);box-shadow:0 0 0 .25rem var(--accent-color-shadow-color, rgba(212, 175, 55, .15))}.cleaning-mode-modal__mode-card--selected:hover{transform:translateY(-.125rem);box-shadow:0 0 0 .25rem var(--accent-color-shadow-color, rgba(88, 101, 242, .25)),0 .25rem .75rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-modal__mode-icon{border-radius:50%;margin-bottom:.75rem;display:flex;align-items:center;justify-content:center;font-size:1.75rem}.cleaning-mode-modal__mode-label{font-size:.875rem;font-weight:500;color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__mode-checkmark{position:absolute;top:.75rem;right:.75rem;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--accent-color, #d4af37);display:flex;align-items:center;justify-content:center;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .15));color:#fff;font-size:.875rem}.cleaning-mode-modal__horizontal-scroll{display:flex;gap:4rem;overflow-x:auto;padding-bottom:.5rem;padding-top:.5rem;padding-left:1.5rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar{height:.25rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-track{background:var(--surface-secondary, #f1f1f1);border-radius:.125rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-thumb{background:var(--surface-tertiary, #ccc);border-radius:.125rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-thumb:hover{background:var(--border-color, #bbb)}.cleaning-mode-modal__mode-option{min-width:4.375rem;display:flex;flex-direction:column;align-items:center;gap:.375rem}.cleaning-mode-modal__mode-option-label{font-size:.75rem;color:var(--text-secondary, #666);text-align:center;line-height:1.2}.cleaning-mode-modal__power-grid{display:grid;grid-template-columns:repeat(4,1fr);margin-bottom:1rem}.cleaning-mode-modal__power-option{display:flex;flex-direction:column;align-items:center;gap:.5rem}.cleaning-mode-modal__power-label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center}.cleaning-mode-modal__max-plus{background:var(--surface-bg, white);border-radius:.75rem;padding:1rem}.cleaning-mode-modal__max-plus-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}.cleaning-mode-modal__max-plus-title{font-size:.9375rem;color:var(--text-primary, #1a1a1a);font-weight:500}.cleaning-mode-modal__max-plus-description{font-size:.8125rem;color:var(--text-tertiary, #999);margin:0;line-height:1.4}.cleaning-mode-modal__slider-container{position:relative;padding:0 .5rem;margin-bottom:.75rem}.cleaning-mode-modal__slider-wrapper{position:relative;padding-top:2rem}.cleaning-mode-modal__slider{width:100%;height:.375rem;border-radius:.1875rem;outline:none;-webkit-appearance:none;appearance:none;cursor:pointer}.cleaning-mode-modal__slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:1.25rem;height:1.25rem;border-radius:50%;background:var(--accent-color, #d4af37);cursor:pointer;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider::-moz-range-thumb{width:1.25rem;height:1.25rem;border-radius:50%;background:var(--accent-color, #d4af37);cursor:pointer;border:none;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider-tooltip{position:absolute;top:-.5rem;left:0;transform:translate(-50%);background:var(--accent-color, #d4af37);color:#fff;padding:.25rem .5rem;border-radius:.375rem;font-size:.85rem;font-weight:600;white-space:nowrap;pointer-events:none;box-shadow:0 .125rem .375rem var(--accent-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider-tooltip:after{content:\"\";position:absolute;top:100%;left:50%;transform:translate(-50%);width:0;height:0;border-left:.3125rem solid transparent;border-right:.3125rem solid transparent;border-top:.3125rem solid var(--accent-color, #d4af37)}.cleaning-mode-modal__slider-value{position:absolute;top:-2rem;transform:translate(-50%);background:var(--accent-color, #d4af37);border-radius:50%;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:600;color:#fff;box-shadow:0 .125rem .5rem var(--accent-color-shadow-color, rgba(88, 101, 242, .25));pointer-events:none}.cleaning-mode-modal__slider-labels{display:flex;justify-content:space-between;padding:0 .5rem;margin-top:1.5rem}.cleaning-mode-modal__slider-label{font-size:.8125rem}.cleaning-mode-modal__slider-label--inactive{color:var(--text-tertiary, #999)}.cleaning-mode-modal__slider-label--active{color:var(--text-primary, #1a1a1a);font-weight:500}.cleaning-mode-modal__setting{display:flex;align-items:center;justify-content:space-between;padding:1rem;background:var(--surface-bg, white);border-radius:.75rem;margin-bottom:1rem}.cleaning-mode-modal__setting--clickable{cursor:pointer;transition:background .2s ease}.cleaning-mode-modal__setting--clickable:hover{background:var(--surface-secondary, #f8f8f8)}.cleaning-mode-modal__setting--clickable:active{background:var(--surface-tertiary, #f0f0f0)}.cleaning-mode-modal__setting-label{font-size:.9375rem;color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__setting-value{display:flex;align-items:center;gap:.5rem;font-size:.875rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__setting-arrow{font-size:1.125rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__route-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem}.cleaning-mode-modal__route-option{display:flex;flex-direction:column;align-items:center;gap:.5rem}.cleaning-mode-modal__route-label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center}.shortcuts-modal{padding:0}.shortcuts-modal__title{font-size:1.3rem;font-weight:600;margin:0 0 1rem;padding:1.5rem 1.5rem 0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__empty{padding:2rem 1.5rem;text-align:center;color:var(--text-secondary, #666)}.shortcuts-modal__empty p{margin:.5rem 0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__empty-hint{font-size:.9rem;color:var(--text-tertiary, #888)}.shortcuts-modal__list{max-height:35rem;overflow-y:auto;padding:.5rem 0;gap:.5rem;display:flex;flex-direction:column}.shortcuts-modal__item{display:flex;align-items:center;gap:1rem;padding:.75rem 1.5rem;margin:.25rem 1rem;background:var(--surface-bg, #fff);border:2px solid var(--accent-color);border-radius:.75rem;box-shadow:0 .125rem .5rem var(--accent-shadow);transition:all .2s;width:90%}.shortcuts-modal__item:hover{box-shadow:0 .25rem .75rem var(--accent-shadow);transform:translateY(-.0625rem)}.shortcuts-modal__item-info{flex:1;min-width:0;display:flex;align-items:center;gap:.75rem}.shortcuts-modal__item-icon{display:flex;font-size:1.3rem;flex-shrink:0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__item-icon svg{scale:.8}.shortcuts-modal__item-name{font-size:1rem;font-weight:500;color:var(--text-primary, #1a1a1a)}.ai-detection-section{display:flex;flex-direction:column;gap:.75rem}.ai-detection-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.ai-detection-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.ai-detection-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.ai-detection-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.carpet-settings-section{display:flex;flex-direction:column;gap:.75rem}.carpet-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.carpet-settings-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.carpet-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.carpet-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.carpet-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.carpet-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.carpet-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.carpet-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.consumables-section{display:flex;flex-direction:column;gap:1rem}.consumables-section__item{display:flex;flex-direction:column;gap:.375rem}.consumables-section__info{display:flex;justify-content:space-between;align-items:center}.consumables-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #000)}.consumables-section__stats{font-size:.75rem;color:var(--text-secondary, #666)}.consumables-section__progress{height:.375rem;background:var(--progress-bg, rgba(0, 0, 0, .1));border-radius:.1875rem;overflow:hidden}.consumables-section__progress-bar{height:100%;border-radius:.1875rem;transition:width .3s ease}.consumables-section__reset{align-self:flex-end;padding:.25rem .75rem;font-size:.75rem;font-weight:500;color:var(--accent-color, #007aff);background:none;border:1px solid var(--accent-color, #007aff);border-radius:.375rem;cursor:pointer;transition:all .2s ease}.consumables-section__reset:hover{background:var(--accent-color, #007aff);color:#fff}.consumables-section__reset:active{opacity:.8}.device-info-section{display:flex;flex-direction:column;gap:.75rem}.device-info-section__item{display:flex;justify-content:space-between;align-items:center;padding:.25rem 0;border-bottom:1px solid var(--divider-color, rgba(0, 0, 0, .06))}.device-info-section__item:last-child{border-bottom:none}.device-info-section__label{font-size:.875rem;color:var(--text-secondary, #666)}.device-info-section__value{font-size:.875rem;font-weight:500;color:var(--text-primary, #000)}.map-management-section__description{font-size:.8125rem;color:var(--text-secondary, #666);margin:0 0 .75rem;line-height:1.4}.map-management-section__empty{font-size:.875rem;color:var(--text-secondary, #666);text-align:center;padding:1rem 0;margin:0}.map-management-section__maps{display:flex;flex-wrap:wrap;gap:.5rem}.map-management-section__map{padding:.5rem 1rem;font-size:.875rem;font-weight:500;color:var(--text-primary, #000);background:var(--button-bg, rgba(0, 0, 0, .05));border:2px solid transparent;border-radius:.5rem;cursor:pointer;transition:all .2s ease}.map-management-section__map:hover{background:var(--button-hover-bg, rgba(0, 0, 0, .08))}.map-management-section__map--active{border-color:var(--accent-color, #007aff);background:var(--accent-bg, rgba(0, 122, 255, .1));color:var(--accent-color, #007aff)}.quick-settings-section{display:flex;flex-direction:column;gap:1rem}.quick-settings-section__item{display:flex;justify-content:space-between;align-items:center;gap:1rem}.quick-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.quick-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #000)}.quick-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.volume-section{display:flex;flex-direction:row;gap:1rem}.volume-section__control{display:flex;align-items:center;gap:.75rem;flex:1}.volume-section__icon{display:flex;align-items:center;justify-content:center;color:var(--text-secondary, #666);flex-shrink:0}.volume-section__slider-container{flex:1;padding-top:1.5rem}.volume-section__slider-wrapper{position:relative;width:100%}.volume-section__slider{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;outline:none;cursor:pointer}.volume-section__slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer;box-shadow:0 2px 4px #0003;transition:transform .1s ease}.volume-section__slider::-webkit-slider-thumb:hover{transform:scale(1.1)}.volume-section__slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer;border:none;box-shadow:0 2px 4px #0003;transition:transform .1s ease}.volume-section__slider::-moz-range-thumb:hover{transform:scale(1.1)}.volume-section__tooltip{position:absolute;top:-1.75rem;transform:translate(-50%);background:var(--accent-color, #007aff);color:#fff;padding:.25rem .5rem;border-radius:4px;font-size:.75rem;font-weight:500;white-space:nowrap;pointer-events:none}.volume-section__tooltip:after{content:\"\";position:absolute;top:100%;left:50%;transform:translate(-50%);border:4px solid transparent;border-top-color:var(--accent-color, #007aff)}.volume-section__test-button{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.625rem 1rem;background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;color:var(--text-primary, #333);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.volume-section__test-button:hover{background:var(--surface-tertiary, #eee)}.volume-section__test-button:active{transform:scale(.98)}.volume-section__test-button svg{color:var(--accent-color, #007aff)}.settings-panel__title{font-size:1.25rem;font-weight:600;margin:0 0 1rem;text-align:center;color:var(--text-primary, #000)}.settings-panel__scroll-wrapper{max-height:45vh;overflow-y:auto}.settings-panel__sections{display:flex;flex-direction:column;gap:.25rem;padding-right:.25rem}.settings-panel__sections::-webkit-scrollbar{width:4px}.settings-panel__sections::-webkit-scrollbar-track{background:transparent}.settings-panel__sections::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb, rgba(0, 0, 0, .2));border-radius:2px}.room-selection-display{padding:.75rem 1rem;background:var(--accent-bg, #e3f2fd);border-radius:.5rem;margin-bottom:.75rem;font-size:.875rem;color:var(--text-primary, #1a1a1a)}.room-selection-display__label{font-weight:600;margin-right:.5rem;color:var(--accent-color, #007aff)}.room-selection-display__rooms{color:var(--text-secondary, #666666)}.dreame-vacuum-card{position:relative;background:var(--card-bg, #f5f5f7);border-radius:1.25rem;overflow:hidden;box-shadow:0 .125rem 1.25rem var(--card-shadow, rgba(0, 0, 0, .08));font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.dreame-vacuum-card__error{padding:1.25rem;color:var(--error-color, #ff3b30);text-align:center}.dreame-vacuum-card__container{display:flex;flex-direction:column;gap:1rem}.dreame-vacuum-card__controls{padding:0 1.25rem 1.25rem}.dreame-vacuum-card__error{padding:1.25rem;text-align:center;color:var(--error-color, #ff3b30);font-size:.875rem}\n";
  document.head.appendChild(style);
})();
function dm(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
var jo = { exports: {} }, Bn = {};
var Wd;
function Q0() {
  if (Wd) return Bn;
  Wd = 1;
  var u = /* @__PURE__ */ Symbol.for("react.transitional.element"), f = /* @__PURE__ */ Symbol.for("react.fragment");
  function d(r, p, b) {
    var M = null;
    if (b !== void 0 && (M = "" + b), p.key !== void 0 && (M = "" + p.key), "key" in p) {
      b = {};
      for (var C in p)
        C !== "key" && (b[C] = p[C]);
    } else b = p;
    return p = b.ref, {
      $$typeof: u,
      type: r,
      key: M,
      ref: p !== void 0 ? p : null,
      props: b
    };
  }
  return Bn.Fragment = f, Bn.jsx = d, Bn.jsxs = d, Bn;
}
var Fd;
function X0() {
  return Fd || (Fd = 1, jo.exports = Q0()), jo.exports;
}
var s = X0(), Uo = { exports: {} }, J = {};
var Id;
function K0() {
  if (Id) return J;
  Id = 1;
  var u = /* @__PURE__ */ Symbol.for("react.transitional.element"), f = /* @__PURE__ */ Symbol.for("react.portal"), d = /* @__PURE__ */ Symbol.for("react.fragment"), r = /* @__PURE__ */ Symbol.for("react.strict_mode"), p = /* @__PURE__ */ Symbol.for("react.profiler"), b = /* @__PURE__ */ Symbol.for("react.consumer"), M = /* @__PURE__ */ Symbol.for("react.context"), C = /* @__PURE__ */ Symbol.for("react.forward_ref"), y = /* @__PURE__ */ Symbol.for("react.suspense"), h = /* @__PURE__ */ Symbol.for("react.memo"), N = /* @__PURE__ */ Symbol.for("react.lazy"), U = /* @__PURE__ */ Symbol.for("react.activity"), L = Symbol.iterator;
  function B(_) {
    return _ === null || typeof _ != "object" ? null : (_ = L && _[L] || _["@@iterator"], typeof _ == "function" ? _ : null);
  }
  var R = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, X = Object.assign, oe = {};
  function ee(_, j, G) {
    this.props = _, this.context = j, this.refs = oe, this.updater = G || R;
  }
  ee.prototype.isReactComponent = {}, ee.prototype.setState = function(_, j) {
    if (typeof _ != "object" && typeof _ != "function" && _ != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, _, j, "setState");
  }, ee.prototype.forceUpdate = function(_) {
    this.updater.enqueueForceUpdate(this, _, "forceUpdate");
  };
  function ve() {
  }
  ve.prototype = ee.prototype;
  function te(_, j, G) {
    this.props = _, this.context = j, this.refs = oe, this.updater = G || R;
  }
  var de = te.prototype = new ve();
  de.constructor = te, X(de, ee.prototype), de.isPureReactComponent = !0;
  var Ae = Array.isArray;
  function $() {
  }
  var H = { H: null, A: null, T: null, S: null }, me = Object.prototype.hasOwnProperty;
  function Ce(_, j, G) {
    var Y = G.ref;
    return {
      $$typeof: u,
      type: _,
      key: j,
      ref: Y !== void 0 ? Y : null,
      props: G
    };
  }
  function Xe(_, j) {
    return Ce(_.type, j, _.props);
  }
  function Ie(_) {
    return typeof _ == "object" && _ !== null && _.$$typeof === u;
  }
  function Oe(_) {
    var j = { "=": "=0", ":": "=2" };
    return "$" + _.replace(/[=:]/g, function(G) {
      return j[G];
    });
  }
  var nt = /\/+/g;
  function Pe(_, j) {
    return typeof _ == "object" && _ !== null && _.key != null ? Oe("" + _.key) : j.toString(36);
  }
  function Ke(_) {
    switch (_.status) {
      case "fulfilled":
        return _.value;
      case "rejected":
        throw _.reason;
      default:
        switch (typeof _.status == "string" ? _.then($, $) : (_.status = "pending", _.then(
          function(j) {
            _.status === "pending" && (_.status = "fulfilled", _.value = j);
          },
          function(j) {
            _.status === "pending" && (_.status = "rejected", _.reason = j);
          }
        )), _.status) {
          case "fulfilled":
            return _.value;
          case "rejected":
            throw _.reason;
        }
    }
    throw _;
  }
  function z(_, j, G, Y, W) {
    var le = typeof _;
    (le === "undefined" || le === "boolean") && (_ = null);
    var ye = !1;
    if (_ === null) ye = !0;
    else
      switch (le) {
        case "bigint":
        case "string":
        case "number":
          ye = !0;
          break;
        case "object":
          switch (_.$$typeof) {
            case u:
            case f:
              ye = !0;
              break;
            case N:
              return ye = _._init, z(
                ye(_._payload),
                j,
                G,
                Y,
                W
              );
          }
      }
    if (ye)
      return W = W(_), ye = Y === "" ? "." + Pe(_, 0) : Y, Ae(W) ? (G = "", ye != null && (G = ye.replace(nt, "$&/") + "/"), z(W, j, G, "", function(Vl) {
        return Vl;
      })) : W != null && (Ie(W) && (W = Xe(
        W,
        G + (W.key == null || _ && _.key === W.key ? "" : ("" + W.key).replace(
          nt,
          "$&/"
        ) + "/") + ye
      )), j.push(W)), 1;
    ye = 0;
    var tt = Y === "" ? "." : Y + ":";
    if (Ae(_))
      for (var we = 0; we < _.length; we++)
        Y = _[we], le = tt + Pe(Y, we), ye += z(
          Y,
          j,
          G,
          le,
          W
        );
    else if (we = B(_), typeof we == "function")
      for (_ = we.call(_), we = 0; !(Y = _.next()).done; )
        Y = Y.value, le = tt + Pe(Y, we++), ye += z(
          Y,
          j,
          G,
          le,
          W
        );
    else if (le === "object") {
      if (typeof _.then == "function")
        return z(
          Ke(_),
          j,
          G,
          Y,
          W
        );
      throw j = String(_), Error(
        "Objects are not valid as a React child (found: " + (j === "[object Object]" ? "object with keys {" + Object.keys(_).join(", ") + "}" : j) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ye;
  }
  function w(_, j, G) {
    if (_ == null) return _;
    var Y = [], W = 0;
    return z(_, Y, "", "", function(le) {
      return j.call(G, le, W++);
    }), Y;
  }
  function K(_) {
    if (_._status === -1) {
      var j = _._result;
      j = j(), j.then(
        function(G) {
          (_._status === 0 || _._status === -1) && (_._status = 1, _._result = G);
        },
        function(G) {
          (_._status === 0 || _._status === -1) && (_._status = 2, _._result = G);
        }
      ), _._status === -1 && (_._status = 0, _._result = j);
    }
    if (_._status === 1) return _._result.default;
    throw _._result;
  }
  var fe = typeof reportError == "function" ? reportError : function(_) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var j = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof _ == "object" && _ !== null && typeof _.message == "string" ? String(_.message) : String(_),
        error: _
      });
      if (!window.dispatchEvent(j)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", _);
      return;
    }
    console.error(_);
  }, se = {
    map: w,
    forEach: function(_, j, G) {
      w(
        _,
        function() {
          j.apply(this, arguments);
        },
        G
      );
    },
    count: function(_) {
      var j = 0;
      return w(_, function() {
        j++;
      }), j;
    },
    toArray: function(_) {
      return w(_, function(j) {
        return j;
      }) || [];
    },
    only: function(_) {
      if (!Ie(_))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return _;
    }
  };
  return J.Activity = U, J.Children = se, J.Component = ee, J.Fragment = d, J.Profiler = p, J.PureComponent = te, J.StrictMode = r, J.Suspense = y, J.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = H, J.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(_) {
      return H.H.useMemoCache(_);
    }
  }, J.cache = function(_) {
    return function() {
      return _.apply(null, arguments);
    };
  }, J.cacheSignal = function() {
    return null;
  }, J.cloneElement = function(_, j, G) {
    if (_ == null)
      throw Error(
        "The argument must be a React element, but you passed " + _ + "."
      );
    var Y = X({}, _.props), W = _.key;
    if (j != null)
      for (le in j.key !== void 0 && (W = "" + j.key), j)
        !me.call(j, le) || le === "key" || le === "__self" || le === "__source" || le === "ref" && j.ref === void 0 || (Y[le] = j[le]);
    var le = arguments.length - 2;
    if (le === 1) Y.children = G;
    else if (1 < le) {
      for (var ye = Array(le), tt = 0; tt < le; tt++)
        ye[tt] = arguments[tt + 2];
      Y.children = ye;
    }
    return Ce(_.type, W, Y);
  }, J.createContext = function(_) {
    return _ = {
      $$typeof: M,
      _currentValue: _,
      _currentValue2: _,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, _.Provider = _, _.Consumer = {
      $$typeof: b,
      _context: _
    }, _;
  }, J.createElement = function(_, j, G) {
    var Y, W = {}, le = null;
    if (j != null)
      for (Y in j.key !== void 0 && (le = "" + j.key), j)
        me.call(j, Y) && Y !== "key" && Y !== "__self" && Y !== "__source" && (W[Y] = j[Y]);
    var ye = arguments.length - 2;
    if (ye === 1) W.children = G;
    else if (1 < ye) {
      for (var tt = Array(ye), we = 0; we < ye; we++)
        tt[we] = arguments[we + 2];
      W.children = tt;
    }
    if (_ && _.defaultProps)
      for (Y in ye = _.defaultProps, ye)
        W[Y] === void 0 && (W[Y] = ye[Y]);
    return Ce(_, le, W);
  }, J.createRef = function() {
    return { current: null };
  }, J.forwardRef = function(_) {
    return { $$typeof: C, render: _ };
  }, J.isValidElement = Ie, J.lazy = function(_) {
    return {
      $$typeof: N,
      _payload: { _status: -1, _result: _ },
      _init: K
    };
  }, J.memo = function(_, j) {
    return {
      $$typeof: h,
      type: _,
      compare: j === void 0 ? null : j
    };
  }, J.startTransition = function(_) {
    var j = H.T, G = {};
    H.T = G;
    try {
      var Y = _(), W = H.S;
      W !== null && W(G, Y), typeof Y == "object" && Y !== null && typeof Y.then == "function" && Y.then($, fe);
    } catch (le) {
      fe(le);
    } finally {
      j !== null && G.types !== null && (j.types = G.types), H.T = j;
    }
  }, J.unstable_useCacheRefresh = function() {
    return H.H.useCacheRefresh();
  }, J.use = function(_) {
    return H.H.use(_);
  }, J.useActionState = function(_, j, G) {
    return H.H.useActionState(_, j, G);
  }, J.useCallback = function(_, j) {
    return H.H.useCallback(_, j);
  }, J.useContext = function(_) {
    return H.H.useContext(_);
  }, J.useDebugValue = function() {
  }, J.useDeferredValue = function(_, j) {
    return H.H.useDeferredValue(_, j);
  }, J.useEffect = function(_, j) {
    return H.H.useEffect(_, j);
  }, J.useEffectEvent = function(_) {
    return H.H.useEffectEvent(_);
  }, J.useId = function() {
    return H.H.useId();
  }, J.useImperativeHandle = function(_, j, G) {
    return H.H.useImperativeHandle(_, j, G);
  }, J.useInsertionEffect = function(_, j) {
    return H.H.useInsertionEffect(_, j);
  }, J.useLayoutEffect = function(_, j) {
    return H.H.useLayoutEffect(_, j);
  }, J.useMemo = function(_, j) {
    return H.H.useMemo(_, j);
  }, J.useOptimistic = function(_, j) {
    return H.H.useOptimistic(_, j);
  }, J.useReducer = function(_, j, G) {
    return H.H.useReducer(_, j, G);
  }, J.useRef = function(_) {
    return H.H.useRef(_);
  }, J.useState = function(_) {
    return H.H.useState(_);
  }, J.useSyncExternalStore = function(_, j, G) {
    return H.H.useSyncExternalStore(
      _,
      j,
      G
    );
  }, J.useTransition = function() {
    return H.H.useTransition();
  }, J.version = "19.2.3", J;
}
var Pd;
function qo() {
  return Pd || (Pd = 1, Uo.exports = K0()), Uo.exports;
}
var V = qo();
const Z0 = /* @__PURE__ */ dm(V);
var Do = { exports: {} }, Hn = {}, Ro = { exports: {} }, wo = {};
var em;
function J0() {
  return em || (em = 1, (function(u) {
    function f(z, w) {
      var K = z.length;
      z.push(w);
      e: for (; 0 < K; ) {
        var fe = K - 1 >>> 1, se = z[fe];
        if (0 < p(se, w))
          z[fe] = w, z[K] = se, K = fe;
        else break e;
      }
    }
    function d(z) {
      return z.length === 0 ? null : z[0];
    }
    function r(z) {
      if (z.length === 0) return null;
      var w = z[0], K = z.pop();
      if (K !== w) {
        z[0] = K;
        e: for (var fe = 0, se = z.length, _ = se >>> 1; fe < _; ) {
          var j = 2 * (fe + 1) - 1, G = z[j], Y = j + 1, W = z[Y];
          if (0 > p(G, K))
            Y < se && 0 > p(W, G) ? (z[fe] = W, z[Y] = K, fe = Y) : (z[fe] = G, z[j] = K, fe = j);
          else if (Y < se && 0 > p(W, K))
            z[fe] = W, z[Y] = K, fe = Y;
          else break e;
        }
      }
      return w;
    }
    function p(z, w) {
      var K = z.sortIndex - w.sortIndex;
      return K !== 0 ? K : z.id - w.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var b = performance;
      u.unstable_now = function() {
        return b.now();
      };
    } else {
      var M = Date, C = M.now();
      u.unstable_now = function() {
        return M.now() - C;
      };
    }
    var y = [], h = [], N = 1, U = null, L = 3, B = !1, R = !1, X = !1, oe = !1, ee = typeof setTimeout == "function" ? setTimeout : null, ve = typeof clearTimeout == "function" ? clearTimeout : null, te = typeof setImmediate < "u" ? setImmediate : null;
    function de(z) {
      for (var w = d(h); w !== null; ) {
        if (w.callback === null) r(h);
        else if (w.startTime <= z)
          r(h), w.sortIndex = w.expirationTime, f(y, w);
        else break;
        w = d(h);
      }
    }
    function Ae(z) {
      if (X = !1, de(z), !R)
        if (d(y) !== null)
          R = !0, $ || ($ = !0, Oe());
        else {
          var w = d(h);
          w !== null && Ke(Ae, w.startTime - z);
        }
    }
    var $ = !1, H = -1, me = 5, Ce = -1;
    function Xe() {
      return oe ? !0 : !(u.unstable_now() - Ce < me);
    }
    function Ie() {
      if (oe = !1, $) {
        var z = u.unstable_now();
        Ce = z;
        var w = !0;
        try {
          e: {
            R = !1, X && (X = !1, ve(H), H = -1), B = !0;
            var K = L;
            try {
              t: {
                for (de(z), U = d(y); U !== null && !(U.expirationTime > z && Xe()); ) {
                  var fe = U.callback;
                  if (typeof fe == "function") {
                    U.callback = null, L = U.priorityLevel;
                    var se = fe(
                      U.expirationTime <= z
                    );
                    if (z = u.unstable_now(), typeof se == "function") {
                      U.callback = se, de(z), w = !0;
                      break t;
                    }
                    U === d(y) && r(y), de(z);
                  } else r(y);
                  U = d(y);
                }
                if (U !== null) w = !0;
                else {
                  var _ = d(h);
                  _ !== null && Ke(
                    Ae,
                    _.startTime - z
                  ), w = !1;
                }
              }
              break e;
            } finally {
              U = null, L = K, B = !1;
            }
            w = void 0;
          }
        } finally {
          w ? Oe() : $ = !1;
        }
      }
    }
    var Oe;
    if (typeof te == "function")
      Oe = function() {
        te(Ie);
      };
    else if (typeof MessageChannel < "u") {
      var nt = new MessageChannel(), Pe = nt.port2;
      nt.port1.onmessage = Ie, Oe = function() {
        Pe.postMessage(null);
      };
    } else
      Oe = function() {
        ee(Ie, 0);
      };
    function Ke(z, w) {
      H = ee(function() {
        z(u.unstable_now());
      }, w);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(z) {
      z.callback = null;
    }, u.unstable_forceFrameRate = function(z) {
      0 > z || 125 < z ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : me = 0 < z ? Math.floor(1e3 / z) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return L;
    }, u.unstable_next = function(z) {
      switch (L) {
        case 1:
        case 2:
        case 3:
          var w = 3;
          break;
        default:
          w = L;
      }
      var K = L;
      L = w;
      try {
        return z();
      } finally {
        L = K;
      }
    }, u.unstable_requestPaint = function() {
      oe = !0;
    }, u.unstable_runWithPriority = function(z, w) {
      switch (z) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          z = 3;
      }
      var K = L;
      L = z;
      try {
        return w();
      } finally {
        L = K;
      }
    }, u.unstable_scheduleCallback = function(z, w, K) {
      var fe = u.unstable_now();
      switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? fe + K : fe) : K = fe, z) {
        case 1:
          var se = -1;
          break;
        case 2:
          se = 250;
          break;
        case 5:
          se = 1073741823;
          break;
        case 4:
          se = 1e4;
          break;
        default:
          se = 5e3;
      }
      return se = K + se, z = {
        id: N++,
        callback: w,
        priorityLevel: z,
        startTime: K,
        expirationTime: se,
        sortIndex: -1
      }, K > fe ? (z.sortIndex = K, f(h, z), d(y) === null && z === d(h) && (X ? (ve(H), H = -1) : X = !0, Ke(Ae, K - fe))) : (z.sortIndex = se, f(y, z), R || B || (R = !0, $ || ($ = !0, Oe()))), z;
    }, u.unstable_shouldYield = Xe, u.unstable_wrapCallback = function(z) {
      var w = L;
      return function() {
        var K = L;
        L = w;
        try {
          return z.apply(this, arguments);
        } finally {
          L = K;
        }
      };
    };
  })(wo)), wo;
}
var tm;
function $0() {
  return tm || (tm = 1, Ro.exports = J0()), Ro.exports;
}
var Go = { exports: {} }, et = {};
var am;
function W0() {
  if (am) return et;
  am = 1;
  var u = qo();
  function f(y) {
    var h = "https://react.dev/errors/" + y;
    if (1 < arguments.length) {
      h += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var N = 2; N < arguments.length; N++)
        h += "&args[]=" + encodeURIComponent(arguments[N]);
    }
    return "Minified React error #" + y + "; visit " + h + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d() {
  }
  var r = {
    d: {
      f: d,
      r: function() {
        throw Error(f(522));
      },
      D: d,
      C: d,
      L: d,
      m: d,
      X: d,
      S: d,
      M: d
    },
    p: 0,
    findDOMNode: null
  }, p = /* @__PURE__ */ Symbol.for("react.portal");
  function b(y, h, N) {
    var U = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: p,
      key: U == null ? null : "" + U,
      children: y,
      containerInfo: h,
      implementation: N
    };
  }
  var M = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function C(y, h) {
    if (y === "font") return "";
    if (typeof h == "string")
      return h === "use-credentials" ? h : "";
  }
  return et.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, et.createPortal = function(y, h) {
    var N = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!h || h.nodeType !== 1 && h.nodeType !== 9 && h.nodeType !== 11)
      throw Error(f(299));
    return b(y, h, null, N);
  }, et.flushSync = function(y) {
    var h = M.T, N = r.p;
    try {
      if (M.T = null, r.p = 2, y) return y();
    } finally {
      M.T = h, r.p = N, r.d.f();
    }
  }, et.preconnect = function(y, h) {
    typeof y == "string" && (h ? (h = h.crossOrigin, h = typeof h == "string" ? h === "use-credentials" ? h : "" : void 0) : h = null, r.d.C(y, h));
  }, et.prefetchDNS = function(y) {
    typeof y == "string" && r.d.D(y);
  }, et.preinit = function(y, h) {
    if (typeof y == "string" && h && typeof h.as == "string") {
      var N = h.as, U = C(N, h.crossOrigin), L = typeof h.integrity == "string" ? h.integrity : void 0, B = typeof h.fetchPriority == "string" ? h.fetchPriority : void 0;
      N === "style" ? r.d.S(
        y,
        typeof h.precedence == "string" ? h.precedence : void 0,
        {
          crossOrigin: U,
          integrity: L,
          fetchPriority: B
        }
      ) : N === "script" && r.d.X(y, {
        crossOrigin: U,
        integrity: L,
        fetchPriority: B,
        nonce: typeof h.nonce == "string" ? h.nonce : void 0
      });
    }
  }, et.preinitModule = function(y, h) {
    if (typeof y == "string")
      if (typeof h == "object" && h !== null) {
        if (h.as == null || h.as === "script") {
          var N = C(
            h.as,
            h.crossOrigin
          );
          r.d.M(y, {
            crossOrigin: N,
            integrity: typeof h.integrity == "string" ? h.integrity : void 0,
            nonce: typeof h.nonce == "string" ? h.nonce : void 0
          });
        }
      } else h == null && r.d.M(y);
  }, et.preload = function(y, h) {
    if (typeof y == "string" && typeof h == "object" && h !== null && typeof h.as == "string") {
      var N = h.as, U = C(N, h.crossOrigin);
      r.d.L(y, N, {
        crossOrigin: U,
        integrity: typeof h.integrity == "string" ? h.integrity : void 0,
        nonce: typeof h.nonce == "string" ? h.nonce : void 0,
        type: typeof h.type == "string" ? h.type : void 0,
        fetchPriority: typeof h.fetchPriority == "string" ? h.fetchPriority : void 0,
        referrerPolicy: typeof h.referrerPolicy == "string" ? h.referrerPolicy : void 0,
        imageSrcSet: typeof h.imageSrcSet == "string" ? h.imageSrcSet : void 0,
        imageSizes: typeof h.imageSizes == "string" ? h.imageSizes : void 0,
        media: typeof h.media == "string" ? h.media : void 0
      });
    }
  }, et.preloadModule = function(y, h) {
    if (typeof y == "string")
      if (h) {
        var N = C(h.as, h.crossOrigin);
        r.d.m(y, {
          as: typeof h.as == "string" && h.as !== "script" ? h.as : void 0,
          crossOrigin: N,
          integrity: typeof h.integrity == "string" ? h.integrity : void 0
        });
      } else r.d.m(y);
  }, et.requestFormReset = function(y) {
    r.d.r(y);
  }, et.unstable_batchedUpdates = function(y, h) {
    return y(h);
  }, et.useFormState = function(y, h, N) {
    return M.H.useFormState(y, h, N);
  }, et.useFormStatus = function() {
    return M.H.useHostTransitionStatus();
  }, et.version = "19.2.3", et;
}
var lm;
function F0() {
  if (lm) return Go.exports;
  lm = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (f) {
        console.error(f);
      }
  }
  return u(), Go.exports = W0(), Go.exports;
}
var nm;
function I0() {
  if (nm) return Hn;
  nm = 1;
  var u = $0(), f = qo(), d = F0();
  function r(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function p(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function b(e) {
    var t = e, a = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (a = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? a : null;
  }
  function M(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function C(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function y(e) {
    if (b(e) !== e)
      throw Error(r(188));
  }
  function h(e) {
    var t = e.alternate;
    if (!t) {
      if (t = b(e), t === null) throw Error(r(188));
      return t !== e ? null : e;
    }
    for (var a = e, l = t; ; ) {
      var n = a.return;
      if (n === null) break;
      var i = n.alternate;
      if (i === null) {
        if (l = n.return, l !== null) {
          a = l;
          continue;
        }
        break;
      }
      if (n.child === i.child) {
        for (i = n.child; i; ) {
          if (i === a) return y(n), e;
          if (i === l) return y(n), t;
          i = i.sibling;
        }
        throw Error(r(188));
      }
      if (a.return !== l.return) a = n, l = i;
      else {
        for (var c = !1, o = n.child; o; ) {
          if (o === a) {
            c = !0, a = n, l = i;
            break;
          }
          if (o === l) {
            c = !0, l = n, a = i;
            break;
          }
          o = o.sibling;
        }
        if (!c) {
          for (o = i.child; o; ) {
            if (o === a) {
              c = !0, a = i, l = n;
              break;
            }
            if (o === l) {
              c = !0, l = i, a = n;
              break;
            }
            o = o.sibling;
          }
          if (!c) throw Error(r(189));
        }
      }
      if (a.alternate !== l) throw Error(r(190));
    }
    if (a.tag !== 3) throw Error(r(188));
    return a.stateNode.current === a ? e : t;
  }
  function N(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = N(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var U = Object.assign, L = /* @__PURE__ */ Symbol.for("react.element"), B = /* @__PURE__ */ Symbol.for("react.transitional.element"), R = /* @__PURE__ */ Symbol.for("react.portal"), X = /* @__PURE__ */ Symbol.for("react.fragment"), oe = /* @__PURE__ */ Symbol.for("react.strict_mode"), ee = /* @__PURE__ */ Symbol.for("react.profiler"), ve = /* @__PURE__ */ Symbol.for("react.consumer"), te = /* @__PURE__ */ Symbol.for("react.context"), de = /* @__PURE__ */ Symbol.for("react.forward_ref"), Ae = /* @__PURE__ */ Symbol.for("react.suspense"), $ = /* @__PURE__ */ Symbol.for("react.suspense_list"), H = /* @__PURE__ */ Symbol.for("react.memo"), me = /* @__PURE__ */ Symbol.for("react.lazy"), Ce = /* @__PURE__ */ Symbol.for("react.activity"), Xe = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), Ie = Symbol.iterator;
  function Oe(e) {
    return e === null || typeof e != "object" ? null : (e = Ie && e[Ie] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var nt = /* @__PURE__ */ Symbol.for("react.client.reference");
  function Pe(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === nt ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case X:
        return "Fragment";
      case ee:
        return "Profiler";
      case oe:
        return "StrictMode";
      case Ae:
        return "Suspense";
      case $:
        return "SuspenseList";
      case Ce:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case R:
          return "Portal";
        case te:
          return e.displayName || "Context";
        case ve:
          return (e._context.displayName || "Context") + ".Consumer";
        case de:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case H:
          return t = e.displayName || null, t !== null ? t : Pe(e.type) || "Memo";
        case me:
          t = e._payload, e = e._init;
          try {
            return Pe(e(t));
          } catch {
          }
      }
    return null;
  }
  var Ke = Array.isArray, z = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, w = d.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, fe = [], se = -1;
  function _(e) {
    return { current: e };
  }
  function j(e) {
    0 > se || (e.current = fe[se], fe[se] = null, se--);
  }
  function G(e, t) {
    se++, fe[se] = e.current, e.current = t;
  }
  var Y = _(null), W = _(null), le = _(null), ye = _(null);
  function tt(e, t) {
    switch (G(le, t), G(W, e), G(Y, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? pd(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = pd(t), e = bd(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    j(Y), G(Y, e);
  }
  function we() {
    j(Y), j(W), j(le);
  }
  function Vl(e) {
    e.memoizedState !== null && G(ye, e);
    var t = Y.current, a = bd(t, e.type);
    t !== a && (G(W, e), G(Y, a));
  }
  function kn(e) {
    W.current === e && (j(Y), j(W)), ye.current === e && (j(ye), Dn._currentValue = K);
  }
  var dc, Jo;
  function Ra(e) {
    if (dc === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        dc = t && t[1] || "", Jo = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + dc + e + Jo;
  }
  var mc = !1;
  function _c(e, t) {
    if (!e || mc) return "";
    mc = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var D = function() {
                throw Error();
              };
              if (Object.defineProperty(D.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(D, []);
                } catch (A) {
                  var x = A;
                }
                Reflect.construct(e, [], D);
              } else {
                try {
                  D.call();
                } catch (A) {
                  x = A;
                }
                e.call(D.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (A) {
                x = A;
              }
              (D = e()) && typeof D.catch == "function" && D.catch(function() {
              });
            }
          } catch (A) {
            if (A && x && typeof A.stack == "string")
              return [A.stack, x.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var i = l.DetermineComponentFrameRoot(), c = i[0], o = i[1];
      if (c && o) {
        var m = c.split(`
`), E = o.split(`
`);
        for (n = l = 0; l < m.length && !m[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; n < E.length && !E[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (l === m.length || n === E.length)
          for (l = m.length - 1, n = E.length - 1; 1 <= l && 0 <= n && m[l] !== E[n]; )
            n--;
        for (; 1 <= l && 0 <= n; l--, n--)
          if (m[l] !== E[n]) {
            if (l !== 1 || n !== 1)
              do
                if (l--, n--, 0 > n || m[l] !== E[n]) {
                  var T = `
` + m[l].replace(" at new ", " at ");
                  return e.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", e.displayName)), T;
                }
              while (1 <= l && 0 <= n);
            break;
          }
      }
    } finally {
      mc = !1, Error.prepareStackTrace = a;
    }
    return (a = e ? e.displayName || e.name : "") ? Ra(a) : "";
  }
  function Sm(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Ra(e.type);
      case 16:
        return Ra("Lazy");
      case 13:
        return e.child !== t && t !== null ? Ra("Suspense Fallback") : Ra("Suspense");
      case 19:
        return Ra("SuspenseList");
      case 0:
      case 15:
        return _c(e.type, !1);
      case 11:
        return _c(e.type.render, !1);
      case 1:
        return _c(e.type, !0);
      case 31:
        return Ra("Activity");
      default:
        return "";
    }
  }
  function $o(e) {
    try {
      var t = "", a = null;
      do
        t += Sm(e, a), a = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var gc = Object.prototype.hasOwnProperty, hc = u.unstable_scheduleCallback, vc = u.unstable_cancelCallback, Em = u.unstable_shouldYield, xm = u.unstable_requestPaint, dt = u.unstable_now, Nm = u.unstable_getCurrentPriorityLevel, Wo = u.unstable_ImmediatePriority, Fo = u.unstable_UserBlockingPriority, Vn = u.unstable_NormalPriority, Am = u.unstable_LowPriority, Io = u.unstable_IdlePriority, Mm = u.log, zm = u.unstable_setDisableYieldValue, Ql = null, mt = null;
  function oa(e) {
    if (typeof Mm == "function" && zm(e), mt && typeof mt.setStrictMode == "function")
      try {
        mt.setStrictMode(Ql, e);
      } catch {
      }
  }
  var _t = Math.clz32 ? Math.clz32 : Om, Tm = Math.log, Cm = Math.LN2;
  function Om(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Tm(e) / Cm | 0) | 0;
  }
  var Qn = 256, Xn = 262144, Kn = 4194304;
  function wa(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Zn(e, t, a) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var n = 0, i = e.suspendedLanes, c = e.pingedLanes;
    e = e.warmLanes;
    var o = l & 134217727;
    return o !== 0 ? (l = o & ~i, l !== 0 ? n = wa(l) : (c &= o, c !== 0 ? n = wa(c) : a || (a = o & ~e, a !== 0 && (n = wa(a))))) : (o = l & ~i, o !== 0 ? n = wa(o) : c !== 0 ? n = wa(c) : a || (a = l & ~e, a !== 0 && (n = wa(a)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, a = t & -t, i >= a || i === 32 && (a & 4194048) !== 0) ? t : n;
  }
  function Xl(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function jm(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Po() {
    var e = Kn;
    return Kn <<= 1, (Kn & 62914560) === 0 && (Kn = 4194304), e;
  }
  function yc(e) {
    for (var t = [], a = 0; 31 > a; a++) t.push(e);
    return t;
  }
  function Kl(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Um(e, t, a, l, n, i) {
    var c = e.pendingLanes;
    e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
    var o = e.entanglements, m = e.expirationTimes, E = e.hiddenUpdates;
    for (a = c & ~a; 0 < a; ) {
      var T = 31 - _t(a), D = 1 << T;
      o[T] = 0, m[T] = -1;
      var x = E[T];
      if (x !== null)
        for (E[T] = null, T = 0; T < x.length; T++) {
          var A = x[T];
          A !== null && (A.lane &= -536870913);
        }
      a &= ~D;
    }
    l !== 0 && es(e, l, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(c & ~t));
  }
  function es(e, t, a) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - _t(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | a & 261930;
  }
  function ts(e, t) {
    var a = e.entangledLanes |= t;
    for (e = e.entanglements; a; ) {
      var l = 31 - _t(a), n = 1 << l;
      n & t | e[l] & t && (e[l] |= t), a &= ~n;
    }
  }
  function as(e, t) {
    var a = t & -t;
    return a = (a & 42) !== 0 ? 1 : pc(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
  }
  function pc(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function bc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function ls() {
    var e = w.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Vd(e.type));
  }
  function ns(e, t) {
    var a = w.p;
    try {
      return w.p = e, t();
    } finally {
      w.p = a;
    }
  }
  var sa = Math.random().toString(36).slice(2), Ze = "__reactFiber$" + sa, it = "__reactProps$" + sa, ll = "__reactContainer$" + sa, Sc = "__reactEvents$" + sa, Dm = "__reactListeners$" + sa, Rm = "__reactHandles$" + sa, is = "__reactResources$" + sa, Zl = "__reactMarker$" + sa;
  function Ec(e) {
    delete e[Ze], delete e[it], delete e[Sc], delete e[Dm], delete e[Rm];
  }
  function nl(e) {
    var t = e[Ze];
    if (t) return t;
    for (var a = e.parentNode; a; ) {
      if (t = a[ll] || a[Ze]) {
        if (a = t.alternate, t.child !== null || a !== null && a.child !== null)
          for (e = zd(e); e !== null; ) {
            if (a = e[Ze]) return a;
            e = zd(e);
          }
        return t;
      }
      e = a, a = e.parentNode;
    }
    return null;
  }
  function il(e) {
    if (e = e[Ze] || e[ll]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Jl(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(r(33));
  }
  function cl(e) {
    var t = e[is];
    return t || (t = e[is] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Ve(e) {
    e[Zl] = !0;
  }
  var cs = /* @__PURE__ */ new Set(), us = {};
  function Ga(e, t) {
    ul(e, t), ul(e + "Capture", t);
  }
  function ul(e, t) {
    for (us[e] = t, e = 0; e < t.length; e++)
      cs.add(t[e]);
  }
  var wm = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), os = {}, ss = {};
  function Gm(e) {
    return gc.call(ss, e) ? !0 : gc.call(os, e) ? !1 : wm.test(e) ? ss[e] = !0 : (os[e] = !0, !1);
  }
  function Jn(e, t, a) {
    if (Gm(t))
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var l = t.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + a);
      }
  }
  function $n(e, t, a) {
    if (a === null) e.removeAttribute(t);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + a);
    }
  }
  function Vt(e, t, a, l) {
    if (l === null) e.removeAttribute(a);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(a);
          return;
      }
      e.setAttributeNS(t, a, "" + l);
    }
  }
  function Et(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function rs(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Bm(e, t, a) {
    var l = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var n = l.get, i = l.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(c) {
          a = "" + c, i.call(this, c);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(c) {
          a = "" + c;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function xc(e) {
    if (!e._valueTracker) {
      var t = rs(e) ? "checked" : "value";
      e._valueTracker = Bm(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function fs(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var a = t.getValue(), l = "";
    return e && (l = rs(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== a ? (t.setValue(e), !0) : !1;
  }
  function Wn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Hm = /[\n"\\]/g;
  function xt(e) {
    return e.replace(
      Hm,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Nc(e, t, a, l, n, i, c, o) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Et(t)) : e.value !== "" + Et(t) && (e.value = "" + Et(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? Ac(e, c, Et(t)) : a != null ? Ac(e, c, Et(a)) : l != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.name = "" + Et(o) : e.removeAttribute("name");
  }
  function ds(e, t, a, l, n, i, c, o) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || a != null) {
      if (!(i !== "submit" && i !== "reset" || t != null)) {
        xc(e);
        return;
      }
      a = a != null ? "" + Et(a) : "", t = t != null ? "" + Et(t) : a, o || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? n, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = o ? e.checked : !!l, e.defaultChecked = !!l, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c), xc(e);
  }
  function Ac(e, t, a) {
    t === "number" && Wn(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
  }
  function ol(e, t, a, l) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < a.length; n++)
        t["$" + a[n]] = !0;
      for (a = 0; a < e.length; a++)
        n = t.hasOwnProperty("$" + e[a].value), e[a].selected !== n && (e[a].selected = n), n && l && (e[a].defaultSelected = !0);
    } else {
      for (a = "" + Et(a), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === a) {
          e[n].selected = !0, l && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function ms(e, t, a) {
    if (t != null && (t = "" + Et(t), t !== e.value && (e.value = t), a == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = a != null ? "" + Et(a) : "";
  }
  function _s(e, t, a, l) {
    if (t == null) {
      if (l != null) {
        if (a != null) throw Error(r(92));
        if (Ke(l)) {
          if (1 < l.length) throw Error(r(93));
          l = l[0];
        }
        a = l;
      }
      a == null && (a = ""), t = a;
    }
    a = Et(t), e.defaultValue = a, l = e.textContent, l === a && l !== "" && l !== null && (e.value = l), xc(e);
  }
  function sl(e, t) {
    if (t) {
      var a = e.firstChild;
      if (a && a === e.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Lm = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function gs(e, t, a) {
    var l = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, a) : typeof a != "number" || a === 0 || Lm.has(t) ? t === "float" ? e.cssFloat = a : e[t] = ("" + a).trim() : e[t] = a + "px";
  }
  function hs(e, t, a) {
    if (t != null && typeof t != "object")
      throw Error(r(62));
    if (e = e.style, a != null) {
      for (var l in a)
        !a.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var n in t)
        l = t[n], t.hasOwnProperty(n) && a[n] !== l && gs(e, n, l);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && gs(e, i, t[i]);
  }
  function Mc(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var qm = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Ym = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Fn(e) {
    return Ym.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Qt() {
  }
  var zc = null;
  function Tc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var rl = null, fl = null;
  function vs(e) {
    var t = il(e);
    if (t && (e = t.stateNode)) {
      var a = e[it] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Nc(
            e,
            a.value,
            a.defaultValue,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name
          ), t = a.name, a.type === "radio" && t != null) {
            for (a = e; a.parentNode; ) a = a.parentNode;
            for (a = a.querySelectorAll(
              'input[name="' + xt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < a.length; t++) {
              var l = a[t];
              if (l !== e && l.form === e.form) {
                var n = l[it] || null;
                if (!n) throw Error(r(90));
                Nc(
                  l,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (t = 0; t < a.length; t++)
              l = a[t], l.form === e.form && fs(l);
          }
          break e;
        case "textarea":
          ms(e, a.value, a.defaultValue);
          break e;
        case "select":
          t = a.value, t != null && ol(e, !!a.multiple, t, !1);
      }
    }
  }
  var Cc = !1;
  function ys(e, t, a) {
    if (Cc) return e(t, a);
    Cc = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (Cc = !1, (rl !== null || fl !== null) && (Hi(), rl && (t = rl, e = fl, fl = rl = null, vs(t), e)))
        for (t = 0; t < e.length; t++) vs(e[t]);
    }
  }
  function $l(e, t) {
    var a = e.stateNode;
    if (a === null) return null;
    var l = a[it] || null;
    if (l === null) return null;
    a = l[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (l = !l.disabled) || (e = e.type, l = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !l;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (a && typeof a != "function")
      throw Error(
        r(231, t, typeof a)
      );
    return a;
  }
  var Xt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Oc = !1;
  if (Xt)
    try {
      var Wl = {};
      Object.defineProperty(Wl, "passive", {
        get: function() {
          Oc = !0;
        }
      }), window.addEventListener("test", Wl, Wl), window.removeEventListener("test", Wl, Wl);
    } catch {
      Oc = !1;
    }
  var ra = null, jc = null, In = null;
  function ps() {
    if (In) return In;
    var e, t = jc, a = t.length, l, n = "value" in ra ? ra.value : ra.textContent, i = n.length;
    for (e = 0; e < a && t[e] === n[e]; e++) ;
    var c = a - e;
    for (l = 1; l <= c && t[a - l] === n[i - l]; l++) ;
    return In = n.slice(e, 1 < l ? 1 - l : void 0);
  }
  function Pn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function ei() {
    return !0;
  }
  function bs() {
    return !1;
  }
  function ct(e) {
    function t(a, l, n, i, c) {
      this._reactName = a, this._targetInst = n, this.type = l, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var o in e)
        e.hasOwnProperty(o) && (a = e[o], this[o] = a ? a(i) : i[o]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? ei : bs, this.isPropagationStopped = bs, this;
    }
    return U(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = ei);
      },
      stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = ei);
      },
      persist: function() {
      },
      isPersistent: ei
    }), t;
  }
  var Ba = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, ti = ct(Ba), Fl = U({}, Ba, { view: 0, detail: 0 }), km = ct(Fl), Uc, Dc, Il, ai = U({}, Fl, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: wc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Il && (Il && e.type === "mousemove" ? (Uc = e.screenX - Il.screenX, Dc = e.screenY - Il.screenY) : Dc = Uc = 0, Il = e), Uc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Dc;
    }
  }), Ss = ct(ai), Vm = U({}, ai, { dataTransfer: 0 }), Qm = ct(Vm), Xm = U({}, Fl, { relatedTarget: 0 }), Rc = ct(Xm), Km = U({}, Ba, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Zm = ct(Km), Jm = U({}, Ba, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), $m = ct(Jm), Wm = U({}, Ba, { data: 0 }), Es = ct(Wm), Fm = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Im = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Pm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function e_(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Pm[e]) ? !!t[e] : !1;
  }
  function wc() {
    return e_;
  }
  var t_ = U({}, Fl, {
    key: function(e) {
      if (e.key) {
        var t = Fm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Pn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Im[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: wc,
    charCode: function(e) {
      return e.type === "keypress" ? Pn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Pn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), a_ = ct(t_), l_ = U({}, ai, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), xs = ct(l_), n_ = U({}, Fl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: wc
  }), i_ = ct(n_), c_ = U({}, Ba, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), u_ = ct(c_), o_ = U({}, ai, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), s_ = ct(o_), r_ = U({}, Ba, {
    newState: 0,
    oldState: 0
  }), f_ = ct(r_), d_ = [9, 13, 27, 32], Gc = Xt && "CompositionEvent" in window, Pl = null;
  Xt && "documentMode" in document && (Pl = document.documentMode);
  var m_ = Xt && "TextEvent" in window && !Pl, Ns = Xt && (!Gc || Pl && 8 < Pl && 11 >= Pl), As = " ", Ms = !1;
  function zs(e, t) {
    switch (e) {
      case "keyup":
        return d_.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Ts(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var dl = !1;
  function __(e, t) {
    switch (e) {
      case "compositionend":
        return Ts(t);
      case "keypress":
        return t.which !== 32 ? null : (Ms = !0, As);
      case "textInput":
        return e = t.data, e === As && Ms ? null : e;
      default:
        return null;
    }
  }
  function g_(e, t) {
    if (dl)
      return e === "compositionend" || !Gc && zs(e, t) ? (e = ps(), In = jc = ra = null, dl = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Ns && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var h_ = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Cs(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!h_[e.type] : t === "textarea";
  }
  function Os(e, t, a, l) {
    rl ? fl ? fl.push(l) : fl = [l] : rl = l, t = Xi(t, "onChange"), 0 < t.length && (a = new ti(
      "onChange",
      "change",
      null,
      a,
      l
    ), e.push({ event: a, listeners: t }));
  }
  var en = null, tn = null;
  function v_(e) {
    md(e, 0);
  }
  function li(e) {
    var t = Jl(e);
    if (fs(t)) return e;
  }
  function js(e, t) {
    if (e === "change") return t;
  }
  var Us = !1;
  if (Xt) {
    var Bc;
    if (Xt) {
      var Hc = "oninput" in document;
      if (!Hc) {
        var Ds = document.createElement("div");
        Ds.setAttribute("oninput", "return;"), Hc = typeof Ds.oninput == "function";
      }
      Bc = Hc;
    } else Bc = !1;
    Us = Bc && (!document.documentMode || 9 < document.documentMode);
  }
  function Rs() {
    en && (en.detachEvent("onpropertychange", ws), tn = en = null);
  }
  function ws(e) {
    if (e.propertyName === "value" && li(tn)) {
      var t = [];
      Os(
        t,
        tn,
        e,
        Tc(e)
      ), ys(v_, t);
    }
  }
  function y_(e, t, a) {
    e === "focusin" ? (Rs(), en = t, tn = a, en.attachEvent("onpropertychange", ws)) : e === "focusout" && Rs();
  }
  function p_(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return li(tn);
  }
  function b_(e, t) {
    if (e === "click") return li(t);
  }
  function S_(e, t) {
    if (e === "input" || e === "change")
      return li(t);
  }
  function E_(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var gt = typeof Object.is == "function" ? Object.is : E_;
  function an(e, t) {
    if (gt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var a = Object.keys(e), l = Object.keys(t);
    if (a.length !== l.length) return !1;
    for (l = 0; l < a.length; l++) {
      var n = a[l];
      if (!gc.call(t, n) || !gt(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function Gs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Bs(e, t) {
    var a = Gs(e);
    e = 0;
    for (var l; a; ) {
      if (a.nodeType === 3) {
        if (l = e + a.textContent.length, e <= t && l >= t)
          return { node: a, offset: t - e };
        e = l;
      }
      e: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = Gs(a);
    }
  }
  function Hs(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Hs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ls(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Wn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var a = typeof t.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) e = t.contentWindow;
      else break;
      t = Wn(e.document);
    }
    return t;
  }
  function Lc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var x_ = Xt && "documentMode" in document && 11 >= document.documentMode, ml = null, qc = null, ln = null, Yc = !1;
  function qs(e, t, a) {
    var l = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    Yc || ml == null || ml !== Wn(l) || (l = ml, "selectionStart" in l && Lc(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), ln && an(ln, l) || (ln = l, l = Xi(qc, "onSelect"), 0 < l.length && (t = new ti(
      "onSelect",
      "select",
      null,
      t,
      a
    ), e.push({ event: t, listeners: l }), t.target = ml)));
  }
  function Ha(e, t) {
    var a = {};
    return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
  }
  var _l = {
    animationend: Ha("Animation", "AnimationEnd"),
    animationiteration: Ha("Animation", "AnimationIteration"),
    animationstart: Ha("Animation", "AnimationStart"),
    transitionrun: Ha("Transition", "TransitionRun"),
    transitionstart: Ha("Transition", "TransitionStart"),
    transitioncancel: Ha("Transition", "TransitionCancel"),
    transitionend: Ha("Transition", "TransitionEnd")
  }, kc = {}, Ys = {};
  Xt && (Ys = document.createElement("div").style, "AnimationEvent" in window || (delete _l.animationend.animation, delete _l.animationiteration.animation, delete _l.animationstart.animation), "TransitionEvent" in window || delete _l.transitionend.transition);
  function La(e) {
    if (kc[e]) return kc[e];
    if (!_l[e]) return e;
    var t = _l[e], a;
    for (a in t)
      if (t.hasOwnProperty(a) && a in Ys)
        return kc[e] = t[a];
    return e;
  }
  var ks = La("animationend"), Vs = La("animationiteration"), Qs = La("animationstart"), N_ = La("transitionrun"), A_ = La("transitionstart"), M_ = La("transitioncancel"), Xs = La("transitionend"), Ks = /* @__PURE__ */ new Map(), Vc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Vc.push("scrollEnd");
  function Dt(e, t) {
    Ks.set(e, t), Ga(t, [e]);
  }
  var ni = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, Nt = [], gl = 0, Qc = 0;
  function ii() {
    for (var e = gl, t = Qc = gl = 0; t < e; ) {
      var a = Nt[t];
      Nt[t++] = null;
      var l = Nt[t];
      Nt[t++] = null;
      var n = Nt[t];
      Nt[t++] = null;
      var i = Nt[t];
      if (Nt[t++] = null, l !== null && n !== null) {
        var c = l.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), l.pending = n;
      }
      i !== 0 && Zs(a, n, i);
    }
  }
  function ci(e, t, a, l) {
    Nt[gl++] = e, Nt[gl++] = t, Nt[gl++] = a, Nt[gl++] = l, Qc |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Xc(e, t, a, l) {
    return ci(e, t, a, l), ui(e);
  }
  function qa(e, t) {
    return ci(e, null, null, t), ui(e);
  }
  function Zs(e, t, a) {
    e.lanes |= a;
    var l = e.alternate;
    l !== null && (l.lanes |= a);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= a, l = i.alternate, l !== null && (l.childLanes |= a), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - _t(a), e = i.hiddenUpdates, l = e[n], l === null ? e[n] = [t] : l.push(t), t.lane = a | 536870912), i) : null;
  }
  function ui(e) {
    if (50 < Mn)
      throw Mn = 0, eo = null, Error(r(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var hl = {};
  function z_(e, t, a, l) {
    this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ht(e, t, a, l) {
    return new z_(e, t, a, l);
  }
  function Kc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Kt(e, t) {
    var a = e.alternate;
    return a === null ? (a = ht(
      e.tag,
      t,
      e.key,
      e.mode
    ), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = e.flags & 65011712, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue, t = e.dependencies, a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.refCleanup = e.refCleanup, a;
  }
  function Js(e, t) {
    e.flags &= 65011714;
    var a = e.alternate;
    return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function oi(e, t, a, l, n, i) {
    var c = 0;
    if (l = e, typeof e == "function") Kc(e) && (c = 1);
    else if (typeof e == "string")
      c = U0(
        e,
        a,
        Y.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case Ce:
          return e = ht(31, a, t, n), e.elementType = Ce, e.lanes = i, e;
        case X:
          return Ya(a.children, n, i, t);
        case oe:
          c = 8, n |= 24;
          break;
        case ee:
          return e = ht(12, a, t, n | 2), e.elementType = ee, e.lanes = i, e;
        case Ae:
          return e = ht(13, a, t, n), e.elementType = Ae, e.lanes = i, e;
        case $:
          return e = ht(19, a, t, n), e.elementType = $, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case te:
                c = 10;
                break e;
              case ve:
                c = 9;
                break e;
              case de:
                c = 11;
                break e;
              case H:
                c = 14;
                break e;
              case me:
                c = 16, l = null;
                break e;
            }
          c = 29, a = Error(
            r(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = ht(c, a, t, n), t.elementType = e, t.type = l, t.lanes = i, t;
  }
  function Ya(e, t, a, l) {
    return e = ht(7, e, l, t), e.lanes = a, e;
  }
  function Zc(e, t, a) {
    return e = ht(6, e, null, t), e.lanes = a, e;
  }
  function $s(e) {
    var t = ht(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Jc(e, t, a) {
    return t = ht(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = a, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Ws = /* @__PURE__ */ new WeakMap();
  function At(e, t) {
    if (typeof e == "object" && e !== null) {
      var a = Ws.get(e);
      return a !== void 0 ? a : (t = {
        value: e,
        source: t,
        stack: $o(t)
      }, Ws.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: $o(t)
    };
  }
  var vl = [], yl = 0, si = null, nn = 0, Mt = [], zt = 0, fa = null, Ht = 1, Lt = "";
  function Zt(e, t) {
    vl[yl++] = nn, vl[yl++] = si, si = e, nn = t;
  }
  function Fs(e, t, a) {
    Mt[zt++] = Ht, Mt[zt++] = Lt, Mt[zt++] = fa, fa = e;
    var l = Ht;
    e = Lt;
    var n = 32 - _t(l) - 1;
    l &= ~(1 << n), a += 1;
    var i = 32 - _t(t) + n;
    if (30 < i) {
      var c = n - n % 5;
      i = (l & (1 << c) - 1).toString(32), l >>= c, n -= c, Ht = 1 << 32 - _t(t) + n | a << n | l, Lt = i + e;
    } else
      Ht = 1 << i | a << n | l, Lt = e;
  }
  function $c(e) {
    e.return !== null && (Zt(e, 1), Fs(e, 1, 0));
  }
  function Wc(e) {
    for (; e === si; )
      si = vl[--yl], vl[yl] = null, nn = vl[--yl], vl[yl] = null;
    for (; e === fa; )
      fa = Mt[--zt], Mt[zt] = null, Lt = Mt[--zt], Mt[zt] = null, Ht = Mt[--zt], Mt[zt] = null;
  }
  function Is(e, t) {
    Mt[zt++] = Ht, Mt[zt++] = Lt, Mt[zt++] = fa, Ht = t.id, Lt = t.overflow, fa = e;
  }
  var Je = null, Me = null, re = !1, da = null, Tt = !1, Fc = Error(r(519));
  function ma(e) {
    var t = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw cn(At(t, e)), Fc;
  }
  function Ps(e) {
    var t = e.stateNode, a = e.type, l = e.memoizedProps;
    switch (t[Ze] = e, t[it] = l, a) {
      case "dialog":
        ie("cancel", t), ie("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ie("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Tn.length; a++)
          ie(Tn[a], t);
        break;
      case "source":
        ie("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ie("error", t), ie("load", t);
        break;
      case "details":
        ie("toggle", t);
        break;
      case "input":
        ie("invalid", t), ds(
          t,
          l.value,
          l.defaultValue,
          l.checked,
          l.defaultChecked,
          l.type,
          l.name,
          !0
        );
        break;
      case "select":
        ie("invalid", t);
        break;
      case "textarea":
        ie("invalid", t), _s(t, l.value, l.defaultValue, l.children);
    }
    a = l.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || l.suppressHydrationWarning === !0 || vd(t.textContent, a) ? (l.popover != null && (ie("beforetoggle", t), ie("toggle", t)), l.onScroll != null && ie("scroll", t), l.onScrollEnd != null && ie("scrollend", t), l.onClick != null && (t.onclick = Qt), t = !0) : t = !1, t || ma(e, !0);
  }
  function er(e) {
    for (Je = e.return; Je; )
      switch (Je.tag) {
        case 5:
        case 31:
        case 13:
          Tt = !1;
          return;
        case 27:
        case 3:
          Tt = !0;
          return;
        default:
          Je = Je.return;
      }
  }
  function pl(e) {
    if (e !== Je) return !1;
    if (!re) return er(e), re = !0, !1;
    var t = e.tag, a;
    if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || ho(e.type, e.memoizedProps)), a = !a), a && Me && ma(e), er(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      Me = Md(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      Me = Md(e);
    } else
      t === 27 ? (t = Me, za(e.type) ? (e = So, So = null, Me = e) : Me = t) : Me = Je ? Ot(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ka() {
    Me = Je = null, re = !1;
  }
  function Ic() {
    var e = da;
    return e !== null && (rt === null ? rt = e : rt.push.apply(
      rt,
      e
    ), da = null), e;
  }
  function cn(e) {
    da === null ? da = [e] : da.push(e);
  }
  var Pc = _(null), Va = null, Jt = null;
  function _a(e, t, a) {
    G(Pc, t._currentValue), t._currentValue = a;
  }
  function $t(e) {
    e._currentValue = Pc.current, j(Pc);
  }
  function eu(e, t, a) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === a) break;
      e = e.return;
    }
  }
  function tu(e, t, a, l) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var c = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var o = i;
          i = n;
          for (var m = 0; m < t.length; m++)
            if (o.context === t[m]) {
              i.lanes |= a, o = i.alternate, o !== null && (o.lanes |= a), eu(
                i.return,
                a,
                e
              ), l || (c = null);
              break e;
            }
          i = o.next;
        }
      } else if (n.tag === 18) {
        if (c = n.return, c === null) throw Error(r(341));
        c.lanes |= a, i = c.alternate, i !== null && (i.lanes |= a), eu(c, a, e), c = null;
      } else c = n.child;
      if (c !== null) c.return = n;
      else
        for (c = n; c !== null; ) {
          if (c === e) {
            c = null;
            break;
          }
          if (n = c.sibling, n !== null) {
            n.return = c.return, c = n;
            break;
          }
          c = c.return;
        }
      n = c;
    }
  }
  function bl(e, t, a, l) {
    e = null;
    for (var n = t, i = !1; n !== null; ) {
      if (!i) {
        if ((n.flags & 524288) !== 0) i = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(r(387));
        if (c = c.memoizedProps, c !== null) {
          var o = n.type;
          gt(n.pendingProps.value, c.value) || (e !== null ? e.push(o) : e = [o]);
        }
      } else if (n === ye.current) {
        if (c = n.alternate, c === null) throw Error(r(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Dn) : e = [Dn]);
      }
      n = n.return;
    }
    e !== null && tu(
      t,
      e,
      a,
      l
    ), t.flags |= 262144;
  }
  function ri(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!gt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Qa(e) {
    Va = e, Jt = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function $e(e) {
    return tr(Va, e);
  }
  function fi(e, t) {
    return Va === null && Qa(e), tr(e, t);
  }
  function tr(e, t) {
    var a = t._currentValue;
    if (t = { context: t, memoizedValue: a, next: null }, Jt === null) {
      if (e === null) throw Error(r(308));
      Jt = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Jt = Jt.next = t;
    return a;
  }
  var T_ = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(a, l) {
        e.push(l);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(a) {
        return a();
      });
    };
  }, C_ = u.unstable_scheduleCallback, O_ = u.unstable_NormalPriority, He = {
    $$typeof: te,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function au() {
    return {
      controller: new T_(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function un(e) {
    e.refCount--, e.refCount === 0 && C_(O_, function() {
      e.controller.abort();
    });
  }
  var on = null, lu = 0, Sl = 0, El = null;
  function j_(e, t) {
    if (on === null) {
      var a = on = [];
      lu = 0, Sl = co(), El = {
        status: "pending",
        value: void 0,
        then: function(l) {
          a.push(l);
        }
      };
    }
    return lu++, t.then(ar, ar), t;
  }
  function ar() {
    if (--lu === 0 && on !== null) {
      El !== null && (El.status = "fulfilled");
      var e = on;
      on = null, Sl = 0, El = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function U_(e, t) {
    var a = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        a.push(n);
      }
    };
    return e.then(
      function() {
        l.status = "fulfilled", l.value = t;
        for (var n = 0; n < a.length; n++) (0, a[n])(t);
      },
      function(n) {
        for (l.status = "rejected", l.reason = n, n = 0; n < a.length; n++)
          (0, a[n])(void 0);
      }
    ), l;
  }
  var lr = z.S;
  z.S = function(e, t) {
    Yf = dt(), typeof t == "object" && t !== null && typeof t.then == "function" && j_(e, t), lr !== null && lr(e, t);
  };
  var Xa = _(null);
  function nu() {
    var e = Xa.current;
    return e !== null ? e : Ne.pooledCache;
  }
  function di(e, t) {
    t === null ? G(Xa, Xa.current) : G(Xa, t.pool);
  }
  function nr() {
    var e = nu();
    return e === null ? null : { parent: He._currentValue, pool: e };
  }
  var xl = Error(r(460)), iu = Error(r(474)), mi = Error(r(542)), _i = { then: function() {
  } };
  function ir(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function cr(e, t, a) {
    switch (a = e[a], a === void 0 ? e.push(t) : a !== t && (t.then(Qt, Qt), t = a), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, or(e), e;
      default:
        if (typeof t.status == "string") t.then(Qt, Qt);
        else {
          if (e = Ne, e !== null && 100 < e.shellSuspendCounter)
            throw Error(r(482));
          e = t, e.status = "pending", e.then(
            function(l) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = l;
              }
            },
            function(l) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = l;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, or(e), e;
        }
        throw Za = t, xl;
    }
  }
  function Ka(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (a) {
      throw a !== null && typeof a == "object" && typeof a.then == "function" ? (Za = a, xl) : a;
    }
  }
  var Za = null;
  function ur() {
    if (Za === null) throw Error(r(459));
    var e = Za;
    return Za = null, e;
  }
  function or(e) {
    if (e === xl || e === mi)
      throw Error(r(483));
  }
  var Nl = null, sn = 0;
  function gi(e) {
    var t = sn;
    return sn += 1, Nl === null && (Nl = []), cr(Nl, e, t);
  }
  function rn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function hi(e, t) {
    throw t.$$typeof === L ? Error(r(525)) : (e = Object.prototype.toString.call(t), Error(
      r(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function sr(e) {
    function t(v, g) {
      if (e) {
        var S = v.deletions;
        S === null ? (v.deletions = [g], v.flags |= 16) : S.push(g);
      }
    }
    function a(v, g) {
      if (!e) return null;
      for (; g !== null; )
        t(v, g), g = g.sibling;
      return null;
    }
    function l(v) {
      for (var g = /* @__PURE__ */ new Map(); v !== null; )
        v.key !== null ? g.set(v.key, v) : g.set(v.index, v), v = v.sibling;
      return g;
    }
    function n(v, g) {
      return v = Kt(v, g), v.index = 0, v.sibling = null, v;
    }
    function i(v, g, S) {
      return v.index = S, e ? (S = v.alternate, S !== null ? (S = S.index, S < g ? (v.flags |= 67108866, g) : S) : (v.flags |= 67108866, g)) : (v.flags |= 1048576, g);
    }
    function c(v) {
      return e && v.alternate === null && (v.flags |= 67108866), v;
    }
    function o(v, g, S, O) {
      return g === null || g.tag !== 6 ? (g = Zc(S, v.mode, O), g.return = v, g) : (g = n(g, S), g.return = v, g);
    }
    function m(v, g, S, O) {
      var Q = S.type;
      return Q === X ? T(
        v,
        g,
        S.props.children,
        O,
        S.key
      ) : g !== null && (g.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === me && Ka(Q) === g.type) ? (g = n(g, S.props), rn(g, S), g.return = v, g) : (g = oi(
        S.type,
        S.key,
        S.props,
        null,
        v.mode,
        O
      ), rn(g, S), g.return = v, g);
    }
    function E(v, g, S, O) {
      return g === null || g.tag !== 4 || g.stateNode.containerInfo !== S.containerInfo || g.stateNode.implementation !== S.implementation ? (g = Jc(S, v.mode, O), g.return = v, g) : (g = n(g, S.children || []), g.return = v, g);
    }
    function T(v, g, S, O, Q) {
      return g === null || g.tag !== 7 ? (g = Ya(
        S,
        v.mode,
        O,
        Q
      ), g.return = v, g) : (g = n(g, S), g.return = v, g);
    }
    function D(v, g, S) {
      if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint")
        return g = Zc(
          "" + g,
          v.mode,
          S
        ), g.return = v, g;
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case B:
            return S = oi(
              g.type,
              g.key,
              g.props,
              null,
              v.mode,
              S
            ), rn(S, g), S.return = v, S;
          case R:
            return g = Jc(
              g,
              v.mode,
              S
            ), g.return = v, g;
          case me:
            return g = Ka(g), D(v, g, S);
        }
        if (Ke(g) || Oe(g))
          return g = Ya(
            g,
            v.mode,
            S,
            null
          ), g.return = v, g;
        if (typeof g.then == "function")
          return D(v, gi(g), S);
        if (g.$$typeof === te)
          return D(
            v,
            fi(v, g),
            S
          );
        hi(v, g);
      }
      return null;
    }
    function x(v, g, S, O) {
      var Q = g !== null ? g.key : null;
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return Q !== null ? null : o(v, g, "" + S, O);
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case B:
            return S.key === Q ? m(v, g, S, O) : null;
          case R:
            return S.key === Q ? E(v, g, S, O) : null;
          case me:
            return S = Ka(S), x(v, g, S, O);
        }
        if (Ke(S) || Oe(S))
          return Q !== null ? null : T(v, g, S, O, null);
        if (typeof S.then == "function")
          return x(
            v,
            g,
            gi(S),
            O
          );
        if (S.$$typeof === te)
          return x(
            v,
            g,
            fi(v, S),
            O
          );
        hi(v, S);
      }
      return null;
    }
    function A(v, g, S, O, Q) {
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return v = v.get(S) || null, o(g, v, "" + O, Q);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case B:
            return v = v.get(
              O.key === null ? S : O.key
            ) || null, m(g, v, O, Q);
          case R:
            return v = v.get(
              O.key === null ? S : O.key
            ) || null, E(g, v, O, Q);
          case me:
            return O = Ka(O), A(
              v,
              g,
              S,
              O,
              Q
            );
        }
        if (Ke(O) || Oe(O))
          return v = v.get(S) || null, T(g, v, O, Q, null);
        if (typeof O.then == "function")
          return A(
            v,
            g,
            S,
            gi(O),
            Q
          );
        if (O.$$typeof === te)
          return A(
            v,
            g,
            S,
            fi(g, O),
            Q
          );
        hi(g, O);
      }
      return null;
    }
    function q(v, g, S, O) {
      for (var Q = null, _e = null, k = g, I = g = 0, ue = null; k !== null && I < S.length; I++) {
        k.index > I ? (ue = k, k = null) : ue = k.sibling;
        var ge = x(
          v,
          k,
          S[I],
          O
        );
        if (ge === null) {
          k === null && (k = ue);
          break;
        }
        e && k && ge.alternate === null && t(v, k), g = i(ge, g, I), _e === null ? Q = ge : _e.sibling = ge, _e = ge, k = ue;
      }
      if (I === S.length)
        return a(v, k), re && Zt(v, I), Q;
      if (k === null) {
        for (; I < S.length; I++)
          k = D(v, S[I], O), k !== null && (g = i(
            k,
            g,
            I
          ), _e === null ? Q = k : _e.sibling = k, _e = k);
        return re && Zt(v, I), Q;
      }
      for (k = l(k); I < S.length; I++)
        ue = A(
          k,
          v,
          I,
          S[I],
          O
        ), ue !== null && (e && ue.alternate !== null && k.delete(
          ue.key === null ? I : ue.key
        ), g = i(
          ue,
          g,
          I
        ), _e === null ? Q = ue : _e.sibling = ue, _e = ue);
      return e && k.forEach(function(Ua) {
        return t(v, Ua);
      }), re && Zt(v, I), Q;
    }
    function Z(v, g, S, O) {
      if (S == null) throw Error(r(151));
      for (var Q = null, _e = null, k = g, I = g = 0, ue = null, ge = S.next(); k !== null && !ge.done; I++, ge = S.next()) {
        k.index > I ? (ue = k, k = null) : ue = k.sibling;
        var Ua = x(v, k, ge.value, O);
        if (Ua === null) {
          k === null && (k = ue);
          break;
        }
        e && k && Ua.alternate === null && t(v, k), g = i(Ua, g, I), _e === null ? Q = Ua : _e.sibling = Ua, _e = Ua, k = ue;
      }
      if (ge.done)
        return a(v, k), re && Zt(v, I), Q;
      if (k === null) {
        for (; !ge.done; I++, ge = S.next())
          ge = D(v, ge.value, O), ge !== null && (g = i(ge, g, I), _e === null ? Q = ge : _e.sibling = ge, _e = ge);
        return re && Zt(v, I), Q;
      }
      for (k = l(k); !ge.done; I++, ge = S.next())
        ge = A(k, v, I, ge.value, O), ge !== null && (e && ge.alternate !== null && k.delete(ge.key === null ? I : ge.key), g = i(ge, g, I), _e === null ? Q = ge : _e.sibling = ge, _e = ge);
      return e && k.forEach(function(V0) {
        return t(v, V0);
      }), re && Zt(v, I), Q;
    }
    function xe(v, g, S, O) {
      if (typeof S == "object" && S !== null && S.type === X && S.key === null && (S = S.props.children), typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case B:
            e: {
              for (var Q = S.key; g !== null; ) {
                if (g.key === Q) {
                  if (Q = S.type, Q === X) {
                    if (g.tag === 7) {
                      a(
                        v,
                        g.sibling
                      ), O = n(
                        g,
                        S.props.children
                      ), O.return = v, v = O;
                      break e;
                    }
                  } else if (g.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === me && Ka(Q) === g.type) {
                    a(
                      v,
                      g.sibling
                    ), O = n(g, S.props), rn(O, S), O.return = v, v = O;
                    break e;
                  }
                  a(v, g);
                  break;
                } else t(v, g);
                g = g.sibling;
              }
              S.type === X ? (O = Ya(
                S.props.children,
                v.mode,
                O,
                S.key
              ), O.return = v, v = O) : (O = oi(
                S.type,
                S.key,
                S.props,
                null,
                v.mode,
                O
              ), rn(O, S), O.return = v, v = O);
            }
            return c(v);
          case R:
            e: {
              for (Q = S.key; g !== null; ) {
                if (g.key === Q)
                  if (g.tag === 4 && g.stateNode.containerInfo === S.containerInfo && g.stateNode.implementation === S.implementation) {
                    a(
                      v,
                      g.sibling
                    ), O = n(g, S.children || []), O.return = v, v = O;
                    break e;
                  } else {
                    a(v, g);
                    break;
                  }
                else t(v, g);
                g = g.sibling;
              }
              O = Jc(S, v.mode, O), O.return = v, v = O;
            }
            return c(v);
          case me:
            return S = Ka(S), xe(
              v,
              g,
              S,
              O
            );
        }
        if (Ke(S))
          return q(
            v,
            g,
            S,
            O
          );
        if (Oe(S)) {
          if (Q = Oe(S), typeof Q != "function") throw Error(r(150));
          return S = Q.call(S), Z(
            v,
            g,
            S,
            O
          );
        }
        if (typeof S.then == "function")
          return xe(
            v,
            g,
            gi(S),
            O
          );
        if (S.$$typeof === te)
          return xe(
            v,
            g,
            fi(v, S),
            O
          );
        hi(v, S);
      }
      return typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint" ? (S = "" + S, g !== null && g.tag === 6 ? (a(v, g.sibling), O = n(g, S), O.return = v, v = O) : (a(v, g), O = Zc(S, v.mode, O), O.return = v, v = O), c(v)) : a(v, g);
    }
    return function(v, g, S, O) {
      try {
        sn = 0;
        var Q = xe(
          v,
          g,
          S,
          O
        );
        return Nl = null, Q;
      } catch (k) {
        if (k === xl || k === mi) throw k;
        var _e = ht(29, k, null, v.mode);
        return _e.lanes = O, _e.return = v, _e;
      }
    };
  }
  var Ja = sr(!0), rr = sr(!1), ga = !1;
  function cu(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function uu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ha(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function va(e, t, a) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (he & 2) !== 0) {
      var n = l.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), l.pending = t, t = ui(e), Zs(e, null, a), t;
    }
    return ci(e, l, t, a), ui(e);
  }
  function fn(e, t, a) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, a |= l, t.lanes = a, ts(e, a);
    }
  }
  function ou(e, t) {
    var a = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, a === l)) {
      var n = null, i = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var c = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          i === null ? n = i = c : i = i.next = c, a = a.next;
        } while (a !== null);
        i === null ? n = i = t : i = i.next = t;
      } else n = i = t;
      a = {
        baseState: l.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: i,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = a;
      return;
    }
    e = a.lastBaseUpdate, e === null ? a.firstBaseUpdate = t : e.next = t, a.lastBaseUpdate = t;
  }
  var su = !1;
  function dn() {
    if (su) {
      var e = El;
      if (e !== null) throw e;
    }
  }
  function mn(e, t, a, l) {
    su = !1;
    var n = e.updateQueue;
    ga = !1;
    var i = n.firstBaseUpdate, c = n.lastBaseUpdate, o = n.shared.pending;
    if (o !== null) {
      n.shared.pending = null;
      var m = o, E = m.next;
      m.next = null, c === null ? i = E : c.next = E, c = m;
      var T = e.alternate;
      T !== null && (T = T.updateQueue, o = T.lastBaseUpdate, o !== c && (o === null ? T.firstBaseUpdate = E : o.next = E, T.lastBaseUpdate = m));
    }
    if (i !== null) {
      var D = n.baseState;
      c = 0, T = E = m = null, o = i;
      do {
        var x = o.lane & -536870913, A = x !== o.lane;
        if (A ? (ce & x) === x : (l & x) === x) {
          x !== 0 && x === Sl && (su = !0), T !== null && (T = T.next = {
            lane: 0,
            tag: o.tag,
            payload: o.payload,
            callback: null,
            next: null
          });
          e: {
            var q = e, Z = o;
            x = t;
            var xe = a;
            switch (Z.tag) {
              case 1:
                if (q = Z.payload, typeof q == "function") {
                  D = q.call(xe, D, x);
                  break e;
                }
                D = q;
                break e;
              case 3:
                q.flags = q.flags & -65537 | 128;
              case 0:
                if (q = Z.payload, x = typeof q == "function" ? q.call(xe, D, x) : q, x == null) break e;
                D = U({}, D, x);
                break e;
              case 2:
                ga = !0;
            }
          }
          x = o.callback, x !== null && (e.flags |= 64, A && (e.flags |= 8192), A = n.callbacks, A === null ? n.callbacks = [x] : A.push(x));
        } else
          A = {
            lane: x,
            tag: o.tag,
            payload: o.payload,
            callback: o.callback,
            next: null
          }, T === null ? (E = T = A, m = D) : T = T.next = A, c |= x;
        if (o = o.next, o === null) {
          if (o = n.shared.pending, o === null)
            break;
          A = o, o = A.next, A.next = null, n.lastBaseUpdate = A, n.shared.pending = null;
        }
      } while (!0);
      T === null && (m = D), n.baseState = m, n.firstBaseUpdate = E, n.lastBaseUpdate = T, i === null && (n.shared.lanes = 0), Ea |= c, e.lanes = c, e.memoizedState = D;
    }
  }
  function fr(e, t) {
    if (typeof e != "function")
      throw Error(r(191, e));
    e.call(t);
  }
  function dr(e, t) {
    var a = e.callbacks;
    if (a !== null)
      for (e.callbacks = null, e = 0; e < a.length; e++)
        fr(a[e], t);
  }
  var Al = _(null), vi = _(0);
  function mr(e, t) {
    e = na, G(vi, e), G(Al, t), na = e | t.baseLanes;
  }
  function ru() {
    G(vi, na), G(Al, Al.current);
  }
  function fu() {
    na = vi.current, j(Al), j(vi);
  }
  var vt = _(null), Ct = null;
  function ya(e) {
    var t = e.alternate;
    G(Ge, Ge.current & 1), G(vt, e), Ct === null && (t === null || Al.current !== null || t.memoizedState !== null) && (Ct = e);
  }
  function du(e) {
    G(Ge, Ge.current), G(vt, e), Ct === null && (Ct = e);
  }
  function _r(e) {
    e.tag === 22 ? (G(Ge, Ge.current), G(vt, e), Ct === null && (Ct = e)) : pa();
  }
  function pa() {
    G(Ge, Ge.current), G(vt, vt.current);
  }
  function yt(e) {
    j(vt), Ct === e && (Ct = null), j(Ge);
  }
  var Ge = _(0);
  function yi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || po(a) || bo(a)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Wt = 0, F = null, Se = null, Le = null, pi = !1, Ml = !1, $a = !1, bi = 0, _n = 0, zl = null, D_ = 0;
  function Ue() {
    throw Error(r(321));
  }
  function mu(e, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < e.length; a++)
      if (!gt(e[a], t[a])) return !1;
    return !0;
  }
  function _u(e, t, a, l, n, i) {
    return Wt = i, F = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, z.H = e === null || e.memoizedState === null ? Fr : Cu, $a = !1, i = a(l, n), $a = !1, Ml && (i = hr(
      t,
      a,
      l,
      n
    )), gr(e), i;
  }
  function gr(e) {
    z.H = vn;
    var t = Se !== null && Se.next !== null;
    if (Wt = 0, Le = Se = F = null, pi = !1, _n = 0, zl = null, t) throw Error(r(300));
    e === null || qe || (e = e.dependencies, e !== null && ri(e) && (qe = !0));
  }
  function hr(e, t, a, l) {
    F = e;
    var n = 0;
    do {
      if (Ml && (zl = null), _n = 0, Ml = !1, 25 <= n) throw Error(r(301));
      if (n += 1, Le = Se = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      z.H = Ir, i = t(a, l);
    } while (Ml);
    return i;
  }
  function R_() {
    var e = z.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? gn(t) : t, e = e.useState()[0], (Se !== null ? Se.memoizedState : null) !== e && (F.flags |= 1024), t;
  }
  function gu() {
    var e = bi !== 0;
    return bi = 0, e;
  }
  function hu(e, t, a) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a;
  }
  function vu(e) {
    if (pi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      pi = !1;
    }
    Wt = 0, Le = Se = F = null, Ml = !1, _n = bi = 0, zl = null;
  }
  function at() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Le === null ? F.memoizedState = Le = e : Le = Le.next = e, Le;
  }
  function Be() {
    if (Se === null) {
      var e = F.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Se.next;
    var t = Le === null ? F.memoizedState : Le.next;
    if (t !== null)
      Le = t, Se = e;
    else {
      if (e === null)
        throw F.alternate === null ? Error(r(467)) : Error(r(310));
      Se = e, e = {
        memoizedState: Se.memoizedState,
        baseState: Se.baseState,
        baseQueue: Se.baseQueue,
        queue: Se.queue,
        next: null
      }, Le === null ? F.memoizedState = Le = e : Le = Le.next = e;
    }
    return Le;
  }
  function Si() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function gn(e) {
    var t = _n;
    return _n += 1, zl === null && (zl = []), e = cr(zl, e, t), t = F, (Le === null ? t.memoizedState : Le.next) === null && (t = t.alternate, z.H = t === null || t.memoizedState === null ? Fr : Cu), e;
  }
  function Ei(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return gn(e);
      if (e.$$typeof === te) return $e(e);
    }
    throw Error(r(438, String(e)));
  }
  function yu(e) {
    var t = null, a = F.updateQueue;
    if (a !== null && (t = a.memoCache), t == null) {
      var l = F.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), a === null && (a = Si(), F.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0)
      for (a = t.data[t.index] = Array(e), l = 0; l < e; l++)
        a[l] = Xe;
    return t.index++, a;
  }
  function Ft(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function xi(e) {
    var t = Be();
    return pu(t, Se, e);
  }
  function pu(e, t, a) {
    var l = e.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = a;
    var n = e.baseQueue, i = l.pending;
    if (i !== null) {
      if (n !== null) {
        var c = n.next;
        n.next = i.next, i.next = c;
      }
      t.baseQueue = n = i, l.pending = null;
    }
    if (i = e.baseState, n === null) e.memoizedState = i;
    else {
      t = n.next;
      var o = c = null, m = null, E = t, T = !1;
      do {
        var D = E.lane & -536870913;
        if (D !== E.lane ? (ce & D) === D : (Wt & D) === D) {
          var x = E.revertLane;
          if (x === 0)
            m !== null && (m = m.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: E.action,
              hasEagerState: E.hasEagerState,
              eagerState: E.eagerState,
              next: null
            }), D === Sl && (T = !0);
          else if ((Wt & x) === x) {
            E = E.next, x === Sl && (T = !0);
            continue;
          } else
            D = {
              lane: 0,
              revertLane: E.revertLane,
              gesture: null,
              action: E.action,
              hasEagerState: E.hasEagerState,
              eagerState: E.eagerState,
              next: null
            }, m === null ? (o = m = D, c = i) : m = m.next = D, F.lanes |= x, Ea |= x;
          D = E.action, $a && a(i, D), i = E.hasEagerState ? E.eagerState : a(i, D);
        } else
          x = {
            lane: D,
            revertLane: E.revertLane,
            gesture: E.gesture,
            action: E.action,
            hasEagerState: E.hasEagerState,
            eagerState: E.eagerState,
            next: null
          }, m === null ? (o = m = x, c = i) : m = m.next = x, F.lanes |= D, Ea |= D;
        E = E.next;
      } while (E !== null && E !== t);
      if (m === null ? c = i : m.next = o, !gt(i, e.memoizedState) && (qe = !0, T && (a = El, a !== null)))
        throw a;
      e.memoizedState = i, e.baseState = c, e.baseQueue = m, l.lastRenderedState = i;
    }
    return n === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function bu(e) {
    var t = Be(), a = t.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = e;
    var l = a.dispatch, n = a.pending, i = t.memoizedState;
    if (n !== null) {
      a.pending = null;
      var c = n = n.next;
      do
        i = e(i, c.action), c = c.next;
      while (c !== n);
      gt(i, t.memoizedState) || (qe = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), a.lastRenderedState = i;
    }
    return [i, l];
  }
  function vr(e, t, a) {
    var l = F, n = Be(), i = re;
    if (i) {
      if (a === void 0) throw Error(r(407));
      a = a();
    } else a = t();
    var c = !gt(
      (Se || n).memoizedState,
      a
    );
    if (c && (n.memoizedState = a, qe = !0), n = n.queue, xu(br.bind(null, l, n, e), [
      e
    ]), n.getSnapshot !== t || c || Le !== null && Le.memoizedState.tag & 1) {
      if (l.flags |= 2048, Tl(
        9,
        { destroy: void 0 },
        pr.bind(
          null,
          l,
          n,
          a,
          t
        ),
        null
      ), Ne === null) throw Error(r(349));
      i || (Wt & 127) !== 0 || yr(l, t, a);
    }
    return a;
  }
  function yr(e, t, a) {
    e.flags |= 16384, e = { getSnapshot: t, value: a }, t = F.updateQueue, t === null ? (t = Si(), F.updateQueue = t, t.stores = [e]) : (a = t.stores, a === null ? t.stores = [e] : a.push(e));
  }
  function pr(e, t, a, l) {
    t.value = a, t.getSnapshot = l, Sr(t) && Er(e);
  }
  function br(e, t, a) {
    return a(function() {
      Sr(t) && Er(e);
    });
  }
  function Sr(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var a = t();
      return !gt(e, a);
    } catch {
      return !0;
    }
  }
  function Er(e) {
    var t = qa(e, 2);
    t !== null && ft(t, e, 2);
  }
  function Su(e) {
    var t = at();
    if (typeof e == "function") {
      var a = e;
      if (e = a(), $a) {
        oa(!0);
        try {
          a();
        } finally {
          oa(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ft,
      lastRenderedState: e
    }, t;
  }
  function xr(e, t, a, l) {
    return e.baseState = a, pu(
      e,
      Se,
      typeof l == "function" ? l : Ft
    );
  }
  function w_(e, t, a, l, n) {
    if (Mi(e)) throw Error(r(485));
    if (e = t.action, e !== null) {
      var i = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(c) {
          i.listeners.push(c);
        }
      };
      z.T !== null ? a(!0) : i.isTransition = !1, l(i), a = t.pending, a === null ? (i.next = t.pending = i, Nr(t, i)) : (i.next = a.next, t.pending = a.next = i);
    }
  }
  function Nr(e, t) {
    var a = t.action, l = t.payload, n = e.state;
    if (t.isTransition) {
      var i = z.T, c = {};
      z.T = c;
      try {
        var o = a(n, l), m = z.S;
        m !== null && m(c, o), Ar(e, t, o);
      } catch (E) {
        Eu(e, t, E);
      } finally {
        i !== null && c.types !== null && (i.types = c.types), z.T = i;
      }
    } else
      try {
        i = a(n, l), Ar(e, t, i);
      } catch (E) {
        Eu(e, t, E);
      }
  }
  function Ar(e, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(
      function(l) {
        Mr(e, t, l);
      },
      function(l) {
        return Eu(e, t, l);
      }
    ) : Mr(e, t, a);
  }
  function Mr(e, t, a) {
    t.status = "fulfilled", t.value = a, zr(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, Nr(e, a)));
  }
  function Eu(e, t, a) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = a, zr(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function zr(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Tr(e, t) {
    return t;
  }
  function Cr(e, t) {
    if (re) {
      var a = Ne.formState;
      if (a !== null) {
        e: {
          var l = F;
          if (re) {
            if (Me) {
              t: {
                for (var n = Me, i = Tt; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = Ot(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Me = Ot(
                  n.nextSibling
                ), l = n.data === "F!";
                break e;
              }
            }
            ma(l);
          }
          l = !1;
        }
        l && (t = a[0]);
      }
    }
    return a = at(), a.memoizedState = a.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Tr,
      lastRenderedState: t
    }, a.queue = l, a = Jr.bind(
      null,
      F,
      l
    ), l.dispatch = a, l = Su(!1), i = Tu.bind(
      null,
      F,
      !1,
      l.queue
    ), l = at(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = n, a = w_.bind(
      null,
      F,
      n,
      i,
      a
    ), n.dispatch = a, l.memoizedState = e, [t, a, !1];
  }
  function Or(e) {
    var t = Be();
    return jr(t, Se, e);
  }
  function jr(e, t, a) {
    if (t = pu(
      e,
      t,
      Tr
    )[0], e = xi(Ft)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = gn(t);
      } catch (c) {
        throw c === xl ? mi : c;
      }
    else l = t;
    t = Be();
    var n = t.queue, i = n.dispatch;
    return a !== t.memoizedState && (F.flags |= 2048, Tl(
      9,
      { destroy: void 0 },
      G_.bind(null, n, a),
      null
    )), [l, i, e];
  }
  function G_(e, t) {
    e.action = t;
  }
  function Ur(e) {
    var t = Be(), a = Se;
    if (a !== null)
      return jr(t, a, e);
    Be(), t = t.memoizedState, a = Be();
    var l = a.queue.dispatch;
    return a.memoizedState = e, [t, l, !1];
  }
  function Tl(e, t, a, l) {
    return e = { tag: e, create: a, deps: l, inst: t, next: null }, t = F.updateQueue, t === null && (t = Si(), F.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (l = a.next, a.next = e, e.next = l, t.lastEffect = e), e;
  }
  function Dr() {
    return Be().memoizedState;
  }
  function Ni(e, t, a, l) {
    var n = at();
    F.flags |= e, n.memoizedState = Tl(
      1 | t,
      { destroy: void 0 },
      a,
      l === void 0 ? null : l
    );
  }
  function Ai(e, t, a, l) {
    var n = Be();
    l = l === void 0 ? null : l;
    var i = n.memoizedState.inst;
    Se !== null && l !== null && mu(l, Se.memoizedState.deps) ? n.memoizedState = Tl(t, i, a, l) : (F.flags |= e, n.memoizedState = Tl(
      1 | t,
      i,
      a,
      l
    ));
  }
  function Rr(e, t) {
    Ni(8390656, 8, e, t);
  }
  function xu(e, t) {
    Ai(2048, 8, e, t);
  }
  function B_(e) {
    F.flags |= 4;
    var t = F.updateQueue;
    if (t === null)
      t = Si(), F.updateQueue = t, t.events = [e];
    else {
      var a = t.events;
      a === null ? t.events = [e] : a.push(e);
    }
  }
  function wr(e) {
    var t = Be().memoizedState;
    return B_({ ref: t, nextImpl: e }), function() {
      if ((he & 2) !== 0) throw Error(r(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Gr(e, t) {
    return Ai(4, 2, e, t);
  }
  function Br(e, t) {
    return Ai(4, 4, e, t);
  }
  function Hr(e, t) {
    if (typeof t == "function") {
      e = e();
      var a = t(e);
      return function() {
        typeof a == "function" ? a() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Lr(e, t, a) {
    a = a != null ? a.concat([e]) : null, Ai(4, 4, Hr.bind(null, t, e), a);
  }
  function Nu() {
  }
  function qr(e, t) {
    var a = Be();
    t = t === void 0 ? null : t;
    var l = a.memoizedState;
    return t !== null && mu(t, l[1]) ? l[0] : (a.memoizedState = [e, t], e);
  }
  function Yr(e, t) {
    var a = Be();
    t = t === void 0 ? null : t;
    var l = a.memoizedState;
    if (t !== null && mu(t, l[1]))
      return l[0];
    if (l = e(), $a) {
      oa(!0);
      try {
        e();
      } finally {
        oa(!1);
      }
    }
    return a.memoizedState = [l, t], l;
  }
  function Au(e, t, a) {
    return a === void 0 || (Wt & 1073741824) !== 0 && (ce & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = Vf(), F.lanes |= e, Ea |= e, a);
  }
  function kr(e, t, a, l) {
    return gt(a, t) ? a : Al.current !== null ? (e = Au(e, a, l), gt(e, t) || (qe = !0), e) : (Wt & 42) === 0 || (Wt & 1073741824) !== 0 && (ce & 261930) === 0 ? (qe = !0, e.memoizedState = a) : (e = Vf(), F.lanes |= e, Ea |= e, t);
  }
  function Vr(e, t, a, l, n) {
    var i = w.p;
    w.p = i !== 0 && 8 > i ? i : 8;
    var c = z.T, o = {};
    z.T = o, Tu(e, !1, t, a);
    try {
      var m = n(), E = z.S;
      if (E !== null && E(o, m), m !== null && typeof m == "object" && typeof m.then == "function") {
        var T = U_(
          m,
          l
        );
        hn(
          e,
          t,
          T,
          St(e)
        );
      } else
        hn(
          e,
          t,
          l,
          St(e)
        );
    } catch (D) {
      hn(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: D },
        St()
      );
    } finally {
      w.p = i, c !== null && o.types !== null && (c.types = o.types), z.T = c;
    }
  }
  function H_() {
  }
  function Mu(e, t, a, l) {
    if (e.tag !== 5) throw Error(r(476));
    var n = Qr(e).queue;
    Vr(
      e,
      n,
      t,
      K,
      a === null ? H_ : function() {
        return Xr(e), a(l);
      }
    );
  }
  function Qr(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: K,
      baseState: K,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ft,
        lastRenderedState: K
      },
      next: null
    };
    var a = {};
    return t.next = {
      memoizedState: a,
      baseState: a,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ft,
        lastRenderedState: a
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Xr(e) {
    var t = Qr(e);
    t.next === null && (t = e.alternate.memoizedState), hn(
      e,
      t.next.queue,
      {},
      St()
    );
  }
  function zu() {
    return $e(Dn);
  }
  function Kr() {
    return Be().memoizedState;
  }
  function Zr() {
    return Be().memoizedState;
  }
  function L_(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = St();
          e = ha(a);
          var l = va(t, e, a);
          l !== null && (ft(l, t, a), fn(l, t, a)), t = { cache: au() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function q_(e, t, a) {
    var l = St();
    a = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Mi(e) ? $r(t, a) : (a = Xc(e, t, a, l), a !== null && (ft(a, e, l), Wr(a, t, l)));
  }
  function Jr(e, t, a) {
    var l = St();
    hn(e, t, a, l);
  }
  function hn(e, t, a, l) {
    var n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Mi(e)) $r(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var c = t.lastRenderedState, o = i(c, a);
          if (n.hasEagerState = !0, n.eagerState = o, gt(o, c))
            return ci(e, t, n, 0), Ne === null && ii(), !1;
        } catch {
        }
      if (a = Xc(e, t, n, l), a !== null)
        return ft(a, e, l), Wr(a, t, l), !0;
    }
    return !1;
  }
  function Tu(e, t, a, l) {
    if (l = {
      lane: 2,
      revertLane: co(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Mi(e)) {
      if (t) throw Error(r(479));
    } else
      t = Xc(
        e,
        a,
        l,
        2
      ), t !== null && ft(t, e, 2);
  }
  function Mi(e) {
    var t = e.alternate;
    return e === F || t !== null && t === F;
  }
  function $r(e, t) {
    Ml = pi = !0;
    var a = e.pending;
    a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
  }
  function Wr(e, t, a) {
    if ((a & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, a |= l, t.lanes = a, ts(e, a);
    }
  }
  var vn = {
    readContext: $e,
    use: Ei,
    useCallback: Ue,
    useContext: Ue,
    useEffect: Ue,
    useImperativeHandle: Ue,
    useLayoutEffect: Ue,
    useInsertionEffect: Ue,
    useMemo: Ue,
    useReducer: Ue,
    useRef: Ue,
    useState: Ue,
    useDebugValue: Ue,
    useDeferredValue: Ue,
    useTransition: Ue,
    useSyncExternalStore: Ue,
    useId: Ue,
    useHostTransitionStatus: Ue,
    useFormState: Ue,
    useActionState: Ue,
    useOptimistic: Ue,
    useMemoCache: Ue,
    useCacheRefresh: Ue
  };
  vn.useEffectEvent = Ue;
  var Fr = {
    readContext: $e,
    use: Ei,
    useCallback: function(e, t) {
      return at().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: $e,
    useEffect: Rr,
    useImperativeHandle: function(e, t, a) {
      a = a != null ? a.concat([e]) : null, Ni(
        4194308,
        4,
        Hr.bind(null, t, e),
        a
      );
    },
    useLayoutEffect: function(e, t) {
      return Ni(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Ni(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var a = at();
      t = t === void 0 ? null : t;
      var l = e();
      if ($a) {
        oa(!0);
        try {
          e();
        } finally {
          oa(!1);
        }
      }
      return a.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, a) {
      var l = at();
      if (a !== void 0) {
        var n = a(t);
        if ($a) {
          oa(!0);
          try {
            a(t);
          } finally {
            oa(!1);
          }
        }
      } else n = t;
      return l.memoizedState = l.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, l.queue = e, e = e.dispatch = q_.bind(
        null,
        F,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = at();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Su(e);
      var t = e.queue, a = Jr.bind(null, F, t);
      return t.dispatch = a, [e.memoizedState, a];
    },
    useDebugValue: Nu,
    useDeferredValue: function(e, t) {
      var a = at();
      return Au(a, e, t);
    },
    useTransition: function() {
      var e = Su(!1);
      return e = Vr.bind(
        null,
        F,
        e.queue,
        !0,
        !1
      ), at().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, a) {
      var l = F, n = at();
      if (re) {
        if (a === void 0)
          throw Error(r(407));
        a = a();
      } else {
        if (a = t(), Ne === null)
          throw Error(r(349));
        (ce & 127) !== 0 || yr(l, t, a);
      }
      n.memoizedState = a;
      var i = { value: a, getSnapshot: t };
      return n.queue = i, Rr(br.bind(null, l, i, e), [
        e
      ]), l.flags |= 2048, Tl(
        9,
        { destroy: void 0 },
        pr.bind(
          null,
          l,
          i,
          a,
          t
        ),
        null
      ), a;
    },
    useId: function() {
      var e = at(), t = Ne.identifierPrefix;
      if (re) {
        var a = Lt, l = Ht;
        a = (l & ~(1 << 32 - _t(l) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = bi++, 0 < a && (t += "H" + a.toString(32)), t += "_";
      } else
        a = D_++, t = "_" + t + "r_" + a.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: zu,
    useFormState: Cr,
    useActionState: Cr,
    useOptimistic: function(e) {
      var t = at();
      t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = a, t = Tu.bind(
        null,
        F,
        !0,
        a
      ), a.dispatch = t, [e, t];
    },
    useMemoCache: yu,
    useCacheRefresh: function() {
      return at().memoizedState = L_.bind(
        null,
        F
      );
    },
    useEffectEvent: function(e) {
      var t = at(), a = { impl: e };
      return t.memoizedState = a, function() {
        if ((he & 2) !== 0)
          throw Error(r(440));
        return a.impl.apply(void 0, arguments);
      };
    }
  }, Cu = {
    readContext: $e,
    use: Ei,
    useCallback: qr,
    useContext: $e,
    useEffect: xu,
    useImperativeHandle: Lr,
    useInsertionEffect: Gr,
    useLayoutEffect: Br,
    useMemo: Yr,
    useReducer: xi,
    useRef: Dr,
    useState: function() {
      return xi(Ft);
    },
    useDebugValue: Nu,
    useDeferredValue: function(e, t) {
      var a = Be();
      return kr(
        a,
        Se.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = xi(Ft)[0], t = Be().memoizedState;
      return [
        typeof e == "boolean" ? e : gn(e),
        t
      ];
    },
    useSyncExternalStore: vr,
    useId: Kr,
    useHostTransitionStatus: zu,
    useFormState: Or,
    useActionState: Or,
    useOptimistic: function(e, t) {
      var a = Be();
      return xr(a, Se, e, t);
    },
    useMemoCache: yu,
    useCacheRefresh: Zr
  };
  Cu.useEffectEvent = wr;
  var Ir = {
    readContext: $e,
    use: Ei,
    useCallback: qr,
    useContext: $e,
    useEffect: xu,
    useImperativeHandle: Lr,
    useInsertionEffect: Gr,
    useLayoutEffect: Br,
    useMemo: Yr,
    useReducer: bu,
    useRef: Dr,
    useState: function() {
      return bu(Ft);
    },
    useDebugValue: Nu,
    useDeferredValue: function(e, t) {
      var a = Be();
      return Se === null ? Au(a, e, t) : kr(
        a,
        Se.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = bu(Ft)[0], t = Be().memoizedState;
      return [
        typeof e == "boolean" ? e : gn(e),
        t
      ];
    },
    useSyncExternalStore: vr,
    useId: Kr,
    useHostTransitionStatus: zu,
    useFormState: Ur,
    useActionState: Ur,
    useOptimistic: function(e, t) {
      var a = Be();
      return Se !== null ? xr(a, Se, e, t) : (a.baseState = e, [e, a.queue.dispatch]);
    },
    useMemoCache: yu,
    useCacheRefresh: Zr
  };
  Ir.useEffectEvent = wr;
  function Ou(e, t, a, l) {
    t = e.memoizedState, a = a(l, t), a = a == null ? t : U({}, t, a), e.memoizedState = a, e.lanes === 0 && (e.updateQueue.baseState = a);
  }
  var ju = {
    enqueueSetState: function(e, t, a) {
      e = e._reactInternals;
      var l = St(), n = ha(l);
      n.payload = t, a != null && (n.callback = a), t = va(e, n, l), t !== null && (ft(t, e, l), fn(t, e, l));
    },
    enqueueReplaceState: function(e, t, a) {
      e = e._reactInternals;
      var l = St(), n = ha(l);
      n.tag = 1, n.payload = t, a != null && (n.callback = a), t = va(e, n, l), t !== null && (ft(t, e, l), fn(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var a = St(), l = ha(a);
      l.tag = 2, t != null && (l.callback = t), t = va(e, l, a), t !== null && (ft(t, e, a), fn(t, e, a));
    }
  };
  function Pr(e, t, a, l, n, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, i, c) : t.prototype && t.prototype.isPureReactComponent ? !an(a, l) || !an(n, i) : !0;
  }
  function ef(e, t, a, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, l), t.state !== e && ju.enqueueReplaceState(t, t.state, null);
  }
  function Wa(e, t) {
    var a = t;
    if ("ref" in t) {
      a = {};
      for (var l in t)
        l !== "ref" && (a[l] = t[l]);
    }
    if (e = e.defaultProps) {
      a === t && (a = U({}, a));
      for (var n in e)
        a[n] === void 0 && (a[n] = e[n]);
    }
    return a;
  }
  function tf(e) {
    ni(e);
  }
  function af(e) {
    console.error(e);
  }
  function lf(e) {
    ni(e);
  }
  function zi(e, t) {
    try {
      var a = e.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function nf(e, t, a) {
    try {
      var l = e.onCaughtError;
      l(a.value, {
        componentStack: a.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function Uu(e, t, a) {
    return a = ha(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
      zi(e, t);
    }, a;
  }
  function cf(e) {
    return e = ha(e), e.tag = 3, e;
  }
  function uf(e, t, a, l) {
    var n = a.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = l.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        nf(t, a, l);
      };
    }
    var c = a.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (e.callback = function() {
      nf(t, a, l), typeof n != "function" && (xa === null ? xa = /* @__PURE__ */ new Set([this]) : xa.add(this));
      var o = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: o !== null ? o : ""
      });
    });
  }
  function Y_(e, t, a, l, n) {
    if (a.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = a.alternate, t !== null && bl(
        t,
        a,
        n,
        !0
      ), a = vt.current, a !== null) {
        switch (a.tag) {
          case 31:
          case 13:
            return Ct === null ? Li() : a.alternate === null && De === 0 && (De = 3), a.flags &= -257, a.flags |= 65536, a.lanes = n, l === _i ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), lo(e, l, n)), !1;
          case 22:
            return a.flags |= 65536, l === _i ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : a.add(l)), lo(e, l, n)), !1;
        }
        throw Error(r(435, a.tag));
      }
      return lo(e, l, n), Li(), !1;
    }
    if (re)
      return t = vt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, l !== Fc && (e = Error(r(422), { cause: l }), cn(At(e, a)))) : (l !== Fc && (t = Error(r(423), {
        cause: l
      }), cn(
        At(t, a)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, l = At(l, a), n = Uu(
        e.stateNode,
        l,
        n
      ), ou(e, n), De !== 4 && (De = 2)), !1;
    var i = Error(r(520), { cause: l });
    if (i = At(i, a), An === null ? An = [i] : An.push(i), De !== 4 && (De = 2), t === null) return !0;
    l = At(l, a), a = t;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, e = n & -n, a.lanes |= e, e = Uu(a.stateNode, l, e), ou(a, e), !1;
        case 1:
          if (t = a.type, i = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (xa === null || !xa.has(i))))
            return a.flags |= 65536, n &= -n, a.lanes |= n, n = cf(n), uf(
              n,
              e,
              a,
              l
            ), ou(a, n), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var Du = Error(r(461)), qe = !1;
  function We(e, t, a, l) {
    t.child = e === null ? rr(t, null, a, l) : Ja(
      t,
      e.child,
      a,
      l
    );
  }
  function of(e, t, a, l, n) {
    a = a.render;
    var i = t.ref;
    if ("ref" in l) {
      var c = {};
      for (var o in l)
        o !== "ref" && (c[o] = l[o]);
    } else c = l;
    return Qa(t), l = _u(
      e,
      t,
      a,
      c,
      i,
      n
    ), o = gu(), e !== null && !qe ? (hu(e, t, n), It(e, t, n)) : (re && o && $c(t), t.flags |= 1, We(e, t, l, n), t.child);
  }
  function sf(e, t, a, l, n) {
    if (e === null) {
      var i = a.type;
      return typeof i == "function" && !Kc(i) && i.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = i, rf(
        e,
        t,
        i,
        l,
        n
      )) : (e = oi(
        a.type,
        null,
        l,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !Yu(e, n)) {
      var c = i.memoizedProps;
      if (a = a.compare, a = a !== null ? a : an, a(c, l) && e.ref === t.ref)
        return It(e, t, n);
    }
    return t.flags |= 1, e = Kt(i, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function rf(e, t, a, l, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (an(i, l) && e.ref === t.ref)
        if (qe = !1, t.pendingProps = l = i, Yu(e, n))
          (e.flags & 131072) !== 0 && (qe = !0);
        else
          return t.lanes = e.lanes, It(e, t, n);
    }
    return Ru(
      e,
      t,
      a,
      l,
      n
    );
  }
  function ff(e, t, a, l) {
    var n = l.children, i = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (i = i !== null ? i.baseLanes | a : a, e !== null) {
          for (l = t.child = e.child, n = 0; l !== null; )
            n = n | l.lanes | l.childLanes, l = l.sibling;
          l = n & ~i;
        } else l = 0, t.child = null;
        return df(
          e,
          t,
          i,
          a,
          l
        );
      }
      if ((a & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && di(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? mr(t, i) : ru(), _r(t);
      else
        return l = t.lanes = 536870912, df(
          e,
          t,
          i !== null ? i.baseLanes | a : a,
          a,
          l
        );
    } else
      i !== null ? (di(t, i.cachePool), mr(t, i), pa(), t.memoizedState = null) : (e !== null && di(t, null), ru(), pa());
    return We(e, t, n, a), t.child;
  }
  function yn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function df(e, t, a, l, n) {
    var i = nu();
    return i = i === null ? null : { parent: He._currentValue, pool: i }, t.memoizedState = {
      baseLanes: a,
      cachePool: i
    }, e !== null && di(t, null), ru(), _r(t), e !== null && bl(e, t, l, !0), t.childLanes = n, null;
  }
  function Ti(e, t) {
    return t = Oi(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function mf(e, t, a) {
    return Ja(t, e.child, null, a), e = Ti(t, t.pendingProps), e.flags |= 2, yt(t), t.memoizedState = null, e;
  }
  function k_(e, t, a) {
    var l = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (re) {
        if (l.mode === "hidden")
          return e = Ti(t, l), t.lanes = 536870912, yn(null, e);
        if (du(t), (e = Me) ? (e = Ad(
          e,
          Tt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: fa !== null ? { id: Ht, overflow: Lt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = $s(e), a.return = t, t.child = a, Je = t, Me = null)) : e = null, e === null) throw ma(t);
        return t.lanes = 536870912, null;
      }
      return Ti(t, l);
    }
    var i = e.memoizedState;
    if (i !== null) {
      var c = i.dehydrated;
      if (du(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = mf(
            e,
            t,
            a
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(r(558));
      else if (qe || bl(e, t, a, !1), n = (a & e.childLanes) !== 0, qe || n) {
        if (l = Ne, l !== null && (c = as(l, a), c !== 0 && c !== i.retryLane))
          throw i.retryLane = c, qa(e, c), ft(l, e, c), Du;
        Li(), t = mf(
          e,
          t,
          a
        );
      } else
        e = i.treeContext, Me = Ot(c.nextSibling), Je = t, re = !0, da = null, Tt = !1, e !== null && Is(t, e), t = Ti(t, l), t.flags |= 4096;
      return t;
    }
    return e = Kt(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Ci(e, t) {
    var a = t.ref;
    if (a === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != "function" && typeof a != "object")
        throw Error(r(284));
      (e === null || e.ref !== a) && (t.flags |= 4194816);
    }
  }
  function Ru(e, t, a, l, n) {
    return Qa(t), a = _u(
      e,
      t,
      a,
      l,
      void 0,
      n
    ), l = gu(), e !== null && !qe ? (hu(e, t, n), It(e, t, n)) : (re && l && $c(t), t.flags |= 1, We(e, t, a, n), t.child);
  }
  function _f(e, t, a, l, n, i) {
    return Qa(t), t.updateQueue = null, a = hr(
      t,
      l,
      a,
      n
    ), gr(e), l = gu(), e !== null && !qe ? (hu(e, t, i), It(e, t, i)) : (re && l && $c(t), t.flags |= 1, We(e, t, a, i), t.child);
  }
  function gf(e, t, a, l, n) {
    if (Qa(t), t.stateNode === null) {
      var i = hl, c = a.contextType;
      typeof c == "object" && c !== null && (i = $e(c)), i = new a(l, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = ju, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = l, i.state = t.memoizedState, i.refs = {}, cu(t), c = a.contextType, i.context = typeof c == "object" && c !== null ? $e(c) : hl, i.state = t.memoizedState, c = a.getDerivedStateFromProps, typeof c == "function" && (Ou(
        t,
        a,
        c,
        l
      ), i.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (c = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), c !== i.state && ju.enqueueReplaceState(i, i.state, null), mn(t, l, i, n), dn(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      i = t.stateNode;
      var o = t.memoizedProps, m = Wa(a, o);
      i.props = m;
      var E = i.context, T = a.contextType;
      c = hl, typeof T == "object" && T !== null && (c = $e(T));
      var D = a.getDerivedStateFromProps;
      T = typeof D == "function" || typeof i.getSnapshotBeforeUpdate == "function", o = t.pendingProps !== o, T || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (o || E !== c) && ef(
        t,
        i,
        l,
        c
      ), ga = !1;
      var x = t.memoizedState;
      i.state = x, mn(t, l, i, n), dn(), E = t.memoizedState, o || x !== E || ga ? (typeof D == "function" && (Ou(
        t,
        a,
        D,
        l
      ), E = t.memoizedState), (m = ga || Pr(
        t,
        a,
        m,
        l,
        x,
        E,
        c
      )) ? (T || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = E), i.props = l, i.state = E, i.context = c, l = m) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      i = t.stateNode, uu(e, t), c = t.memoizedProps, T = Wa(a, c), i.props = T, D = t.pendingProps, x = i.context, E = a.contextType, m = hl, typeof E == "object" && E !== null && (m = $e(E)), o = a.getDerivedStateFromProps, (E = typeof o == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== D || x !== m) && ef(
        t,
        i,
        l,
        m
      ), ga = !1, x = t.memoizedState, i.state = x, mn(t, l, i, n), dn();
      var A = t.memoizedState;
      c !== D || x !== A || ga || e !== null && e.dependencies !== null && ri(e.dependencies) ? (typeof o == "function" && (Ou(
        t,
        a,
        o,
        l
      ), A = t.memoizedState), (T = ga || Pr(
        t,
        a,
        T,
        l,
        x,
        A,
        m
      ) || e !== null && e.dependencies !== null && ri(e.dependencies)) ? (E || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(l, A, m), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        l,
        A,
        m
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && x === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && x === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = A), i.props = l, i.state = A, i.context = m, l = T) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && x === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && x === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return i = l, Ci(e, t), l = (t.flags & 128) !== 0, i || l ? (i = t.stateNode, a = l && typeof a.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && l ? (t.child = Ja(
      t,
      e.child,
      null,
      n
    ), t.child = Ja(
      t,
      null,
      a,
      n
    )) : We(e, t, a, n), t.memoizedState = i.state, e = t.child) : e = It(
      e,
      t,
      n
    ), e;
  }
  function hf(e, t, a, l) {
    return ka(), t.flags |= 256, We(e, t, a, l), t.child;
  }
  var wu = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Gu(e) {
    return { baseLanes: e, cachePool: nr() };
  }
  function Bu(e, t, a) {
    return e = e !== null ? e.childLanes & ~a : 0, t && (e |= bt), e;
  }
  function vf(e, t, a) {
    var l = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : (Ge.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (re) {
        if (n ? ya(t) : pa(), (e = Me) ? (e = Ad(
          e,
          Tt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: fa !== null ? { id: Ht, overflow: Lt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = $s(e), a.return = t, t.child = a, Je = t, Me = null)) : e = null, e === null) throw ma(t);
        return bo(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var o = l.children;
      return l = l.fallback, n ? (pa(), n = t.mode, o = Oi(
        { mode: "hidden", children: o },
        n
      ), l = Ya(
        l,
        n,
        a,
        null
      ), o.return = t, l.return = t, o.sibling = l, t.child = o, l = t.child, l.memoizedState = Gu(a), l.childLanes = Bu(
        e,
        c,
        a
      ), t.memoizedState = wu, yn(null, l)) : (ya(t), Hu(t, o));
    }
    var m = e.memoizedState;
    if (m !== null && (o = m.dehydrated, o !== null)) {
      if (i)
        t.flags & 256 ? (ya(t), t.flags &= -257, t = Lu(
          e,
          t,
          a
        )) : t.memoizedState !== null ? (pa(), t.child = e.child, t.flags |= 128, t = null) : (pa(), o = l.fallback, n = t.mode, l = Oi(
          { mode: "visible", children: l.children },
          n
        ), o = Ya(
          o,
          n,
          a,
          null
        ), o.flags |= 2, l.return = t, o.return = t, l.sibling = o, t.child = l, Ja(
          t,
          e.child,
          null,
          a
        ), l = t.child, l.memoizedState = Gu(a), l.childLanes = Bu(
          e,
          c,
          a
        ), t.memoizedState = wu, t = yn(null, l));
      else if (ya(t), bo(o)) {
        if (c = o.nextSibling && o.nextSibling.dataset, c) var E = c.dgst;
        c = E, l = Error(r(419)), l.stack = "", l.digest = c, cn({ value: l, source: null, stack: null }), t = Lu(
          e,
          t,
          a
        );
      } else if (qe || bl(e, t, a, !1), c = (a & e.childLanes) !== 0, qe || c) {
        if (c = Ne, c !== null && (l = as(c, a), l !== 0 && l !== m.retryLane))
          throw m.retryLane = l, qa(e, l), ft(c, e, l), Du;
        po(o) || Li(), t = Lu(
          e,
          t,
          a
        );
      } else
        po(o) ? (t.flags |= 192, t.child = e.child, t = null) : (e = m.treeContext, Me = Ot(
          o.nextSibling
        ), Je = t, re = !0, da = null, Tt = !1, e !== null && Is(t, e), t = Hu(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (pa(), o = l.fallback, n = t.mode, m = e.child, E = m.sibling, l = Kt(m, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = m.subtreeFlags & 65011712, E !== null ? o = Kt(
      E,
      o
    ) : (o = Ya(
      o,
      n,
      a,
      null
    ), o.flags |= 2), o.return = t, l.return = t, l.sibling = o, t.child = l, yn(null, l), l = t.child, o = e.child.memoizedState, o === null ? o = Gu(a) : (n = o.cachePool, n !== null ? (m = He._currentValue, n = n.parent !== m ? { parent: m, pool: m } : n) : n = nr(), o = {
      baseLanes: o.baseLanes | a,
      cachePool: n
    }), l.memoizedState = o, l.childLanes = Bu(
      e,
      c,
      a
    ), t.memoizedState = wu, yn(e.child, l)) : (ya(t), a = e.child, e = a.sibling, a = Kt(a, {
      mode: "visible",
      children: l.children
    }), a.return = t, a.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = a, t.memoizedState = null, a);
  }
  function Hu(e, t) {
    return t = Oi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Oi(e, t) {
    return e = ht(22, e, null, t), e.lanes = 0, e;
  }
  function Lu(e, t, a) {
    return Ja(t, e.child, null, a), e = Hu(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function yf(e, t, a) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), eu(e.return, t, a);
  }
  function qu(e, t, a, l, n, i) {
    var c = e.memoizedState;
    c === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: a,
      tailMode: n,
      treeForkCount: i
    } : (c.isBackwards = t, c.rendering = null, c.renderingStartTime = 0, c.last = l, c.tail = a, c.tailMode = n, c.treeForkCount = i);
  }
  function pf(e, t, a) {
    var l = t.pendingProps, n = l.revealOrder, i = l.tail;
    l = l.children;
    var c = Ge.current, o = (c & 2) !== 0;
    if (o ? (c = c & 1 | 2, t.flags |= 128) : c &= 1, G(Ge, c), We(e, t, l, a), l = re ? nn : 0, !o && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && yf(e, a, t);
        else if (e.tag === 19)
          yf(e, a, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (n) {
      case "forwards":
        for (a = t.child, n = null; a !== null; )
          e = a.alternate, e !== null && yi(e) === null && (n = a), a = a.sibling;
        a = n, a === null ? (n = t.child, t.child = null) : (n = a.sibling, a.sibling = null), qu(
          t,
          !1,
          n,
          a,
          i,
          l
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (a = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && yi(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = a, a = n, n = e;
        }
        qu(
          t,
          !0,
          a,
          null,
          i,
          l
        );
        break;
      case "together":
        qu(
          t,
          !1,
          null,
          null,
          void 0,
          l
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function It(e, t, a) {
    if (e !== null && (t.dependencies = e.dependencies), Ea |= t.lanes, (a & t.childLanes) === 0)
      if (e !== null) {
        if (bl(
          e,
          t,
          a,
          !1
        ), (a & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(r(153));
    if (t.child !== null) {
      for (e = t.child, a = Kt(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null; )
        e = e.sibling, a = a.sibling = Kt(e, e.pendingProps), a.return = t;
      a.sibling = null;
    }
    return t.child;
  }
  function Yu(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && ri(e)));
  }
  function V_(e, t, a) {
    switch (t.tag) {
      case 3:
        tt(t, t.stateNode.containerInfo), _a(t, He, e.memoizedState.cache), ka();
        break;
      case 27:
      case 5:
        Vl(t);
        break;
      case 4:
        tt(t, t.stateNode.containerInfo);
        break;
      case 10:
        _a(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, du(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (ya(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? vf(e, t, a) : (ya(t), e = It(
            e,
            t,
            a
          ), e !== null ? e.sibling : null);
        ya(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (l = (a & t.childLanes) !== 0, l || (bl(
          e,
          t,
          a,
          !1
        ), l = (a & t.childLanes) !== 0), n) {
          if (l)
            return pf(
              e,
              t,
              a
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), G(Ge, Ge.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, ff(
          e,
          t,
          a,
          t.pendingProps
        );
      case 24:
        _a(t, He, e.memoizedState.cache);
    }
    return It(e, t, a);
  }
  function bf(e, t, a) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        qe = !0;
      else {
        if (!Yu(e, a) && (t.flags & 128) === 0)
          return qe = !1, V_(
            e,
            t,
            a
          );
        qe = (e.flags & 131072) !== 0;
      }
    else
      qe = !1, re && (t.flags & 1048576) !== 0 && Fs(t, nn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = Ka(t.elementType), t.type = e, typeof e == "function")
            Kc(e) ? (l = Wa(e, l), t.tag = 1, t = gf(
              null,
              t,
              e,
              l,
              a
            )) : (t.tag = 0, t = Ru(
              null,
              t,
              e,
              l,
              a
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === de) {
                t.tag = 11, t = of(
                  null,
                  t,
                  e,
                  l,
                  a
                );
                break e;
              } else if (n === H) {
                t.tag = 14, t = sf(
                  null,
                  t,
                  e,
                  l,
                  a
                );
                break e;
              }
            }
            throw t = Pe(e) || e, Error(r(306, t, ""));
          }
        }
        return t;
      case 0:
        return Ru(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 1:
        return l = t.type, n = Wa(
          l,
          t.pendingProps
        ), gf(
          e,
          t,
          l,
          n,
          a
        );
      case 3:
        e: {
          if (tt(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(r(387));
          l = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, uu(e, t), mn(t, l, null, a);
          var c = t.memoizedState;
          if (l = c.cache, _a(t, He, l), l !== i.cache && tu(
            t,
            [He],
            a,
            !0
          ), dn(), l = c.element, i.isDehydrated)
            if (i = {
              element: l,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = hf(
                e,
                t,
                l,
                a
              );
              break e;
            } else if (l !== n) {
              n = At(
                Error(r(424)),
                t
              ), cn(n), t = hf(
                e,
                t,
                l,
                a
              );
              break e;
            } else
              for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, Me = Ot(e.firstChild), Je = t, re = !0, da = null, Tt = !0, a = rr(
                t,
                null,
                l,
                a
              ), t.child = a; a; )
                a.flags = a.flags & -3 | 4096, a = a.sibling;
          else {
            if (ka(), l === n) {
              t = It(
                e,
                t,
                a
              );
              break e;
            }
            We(e, t, l, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Ci(e, t), e === null ? (a = jd(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = a : re || (a = t.type, e = t.pendingProps, l = Ki(
          le.current
        ).createElement(a), l[Ze] = t, l[it] = e, Fe(l, a, e), Ve(l), t.stateNode = l) : t.memoizedState = jd(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Vl(t), e === null && re && (l = t.stateNode = Td(
          t.type,
          t.pendingProps,
          le.current
        ), Je = t, Tt = !0, n = Me, za(t.type) ? (So = n, Me = Ot(l.firstChild)) : Me = n), We(
          e,
          t,
          t.pendingProps.children,
          a
        ), Ci(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && re && ((n = l = Me) && (l = p0(
          l,
          t.type,
          t.pendingProps,
          Tt
        ), l !== null ? (t.stateNode = l, Je = t, Me = Ot(l.firstChild), Tt = !1, n = !0) : n = !1), n || ma(t)), Vl(t), n = t.type, i = t.pendingProps, c = e !== null ? e.memoizedProps : null, l = i.children, ho(n, i) ? l = null : c !== null && ho(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = _u(
          e,
          t,
          R_,
          null,
          null,
          a
        ), Dn._currentValue = n), Ci(e, t), We(e, t, l, a), t.child;
      case 6:
        return e === null && re && ((e = a = Me) && (a = b0(
          a,
          t.pendingProps,
          Tt
        ), a !== null ? (t.stateNode = a, Je = t, Me = null, e = !0) : e = !1), e || ma(t)), null;
      case 13:
        return vf(e, t, a);
      case 4:
        return tt(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = Ja(
          t,
          null,
          l,
          a
        ) : We(e, t, l, a), t.child;
      case 11:
        return of(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 7:
        return We(
          e,
          t,
          t.pendingProps,
          a
        ), t.child;
      case 8:
        return We(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 12:
        return We(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 10:
        return l = t.pendingProps, _a(t, t.type, l.value), We(e, t, l.children, a), t.child;
      case 9:
        return n = t.type._context, l = t.pendingProps.children, Qa(t), n = $e(n), l = l(n), t.flags |= 1, We(e, t, l, a), t.child;
      case 14:
        return sf(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 15:
        return rf(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 19:
        return pf(e, t, a);
      case 31:
        return k_(e, t, a);
      case 22:
        return ff(
          e,
          t,
          a,
          t.pendingProps
        );
      case 24:
        return Qa(t), l = $e(He), e === null ? (n = nu(), n === null && (n = Ne, i = au(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= a), n = i), t.memoizedState = { parent: l, cache: n }, cu(t), _a(t, He, n)) : ((e.lanes & a) !== 0 && (uu(e, t), mn(t, null, null, a), dn()), n = e.memoizedState, i = t.memoizedState, n.parent !== l ? (n = { parent: l, cache: l }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), _a(t, He, l)) : (l = i.cache, _a(t, He, l), l !== n.cache && tu(
          t,
          [He],
          a,
          !0
        ))), We(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function Pt(e) {
    e.flags |= 4;
  }
  function ku(e, t, a, l, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Zf()) e.flags |= 8192;
        else
          throw Za = _i, iu;
    } else e.flags &= -16777217;
  }
  function Sf(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Gd(t))
      if (Zf()) e.flags |= 8192;
      else
        throw Za = _i, iu;
  }
  function ji(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Po() : 536870912, e.lanes |= t, Ul |= t);
  }
  function pn(e, t) {
    if (!re)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var a = null; t !== null; )
            t.alternate !== null && (a = t), t = t.sibling;
          a === null ? e.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = e.tail;
          for (var l = null; a !== null; )
            a.alternate !== null && (l = a), a = a.sibling;
          l === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null;
      }
  }
  function ze(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, a = 0, l = 0;
    if (t)
      for (var n = e.child; n !== null; )
        a |= n.lanes | n.childLanes, l |= n.subtreeFlags & 65011712, l |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        a |= n.lanes | n.childLanes, l |= n.subtreeFlags, l |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= l, e.childLanes = a, t;
  }
  function Q_(e, t, a) {
    var l = t.pendingProps;
    switch (Wc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return ze(t), null;
      case 1:
        return ze(t), null;
      case 3:
        return a = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), $t(He), we(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && (pl(t) ? Pt(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ic())), ze(t), null;
      case 26:
        var n = t.type, i = t.memoizedState;
        return e === null ? (Pt(t), i !== null ? (ze(t), Sf(t, i)) : (ze(t), ku(
          t,
          n,
          null,
          l,
          a
        ))) : i ? i !== e.memoizedState ? (Pt(t), ze(t), Sf(t, i)) : (ze(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && Pt(t), ze(t), ku(
          t,
          n,
          e,
          l,
          a
        )), null;
      case 27:
        if (kn(t), a = le.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Pt(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(r(166));
            return ze(t), null;
          }
          e = Y.current, pl(t) ? Ps(t) : (e = Td(n, l, a), t.stateNode = e, Pt(t));
        }
        return ze(t), null;
      case 5:
        if (kn(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Pt(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(r(166));
            return ze(t), null;
          }
          if (i = Y.current, pl(t))
            Ps(t);
          else {
            var c = Ki(
              le.current
            );
            switch (i) {
              case 1:
                i = c.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                i = c.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    i = c.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    i = c.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    i = c.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(
                      i.firstChild
                    );
                    break;
                  case "select":
                    i = typeof l.is == "string" ? c.createElement("select", {
                      is: l.is
                    }) : c.createElement("select"), l.multiple ? i.multiple = !0 : l.size && (i.size = l.size);
                    break;
                  default:
                    i = typeof l.is == "string" ? c.createElement(n, { is: l.is }) : c.createElement(n);
                }
            }
            i[Ze] = t, i[it] = l;
            e: for (c = t.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6)
                i.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                c.child.return = c, c = c.child;
                continue;
              }
              if (c === t) break e;
              for (; c.sibling === null; ) {
                if (c.return === null || c.return === t)
                  break e;
                c = c.return;
              }
              c.sibling.return = c.return, c = c.sibling;
            }
            t.stateNode = i;
            e: switch (Fe(i, n, l), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break e;
              case "img":
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && Pt(t);
          }
        }
        return ze(t), ku(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          a
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && Pt(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(r(166));
          if (e = le.current, pl(t)) {
            if (e = t.stateNode, a = t.memoizedProps, l = null, n = Je, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  l = n.memoizedProps;
              }
            e[Ze] = t, e = !!(e.nodeValue === a || l !== null && l.suppressHydrationWarning === !0 || vd(e.nodeValue, a)), e || ma(t, !0);
          } else
            e = Ki(e).createTextNode(
              l
            ), e[Ze] = t, t.stateNode = e;
        }
        return ze(t), null;
      case 31:
        if (a = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = pl(t), a !== null) {
            if (e === null) {
              if (!l) throw Error(r(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(557));
              e[Ze] = t;
            } else
              ka(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            ze(t), e = !1;
          } else
            a = Ic(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = !0;
          if (!e)
            return t.flags & 256 ? (yt(t), t) : (yt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(r(558));
        }
        return ze(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = pl(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(r(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(r(317));
              n[Ze] = t;
            } else
              ka(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            ze(t), n = !1;
          } else
            n = Ic(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (yt(t), t) : (yt(t), null);
        }
        return yt(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = l !== null, e = e !== null && e.memoizedState !== null, a && (l = t.child, n = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (n = l.alternate.memoizedState.cachePool.pool), i = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (i = l.memoizedState.cachePool.pool), i !== n && (l.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), ji(t, t.updateQueue), ze(t), null);
      case 4:
        return we(), e === null && ro(t.stateNode.containerInfo), ze(t), null;
      case 10:
        return $t(t.type), ze(t), null;
      case 19:
        if (j(Ge), l = t.memoizedState, l === null) return ze(t), null;
        if (n = (t.flags & 128) !== 0, i = l.rendering, i === null)
          if (n) pn(l, !1);
          else {
            if (De !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = yi(e), i !== null) {
                  for (t.flags |= 128, pn(l, !1), e = i.updateQueue, t.updateQueue = e, ji(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null; )
                    Js(a, e), a = a.sibling;
                  return G(
                    Ge,
                    Ge.current & 1 | 2
                  ), re && Zt(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && dt() > Gi && (t.flags |= 128, n = !0, pn(l, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = yi(i), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, ji(t, e), pn(l, !0), l.tail === null && l.tailMode === "hidden" && !i.alternate && !re)
                return ze(t), null;
            } else
              2 * dt() - l.renderingStartTime > Gi && a !== 536870912 && (t.flags |= 128, n = !0, pn(l, !1), t.lanes = 4194304);
          l.isBackwards ? (i.sibling = t.child, t.child = i) : (e = l.last, e !== null ? e.sibling = i : t.child = i, l.last = i);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = dt(), e.sibling = null, a = Ge.current, G(
          Ge,
          n ? a & 1 | 2 : a & 1
        ), re && Zt(t, l.treeForkCount), e) : (ze(t), null);
      case 22:
      case 23:
        return yt(t), fu(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (ze(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ze(t), a = t.updateQueue, a !== null && ji(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== a && (t.flags |= 2048), e !== null && j(Xa), null;
      case 24:
        return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), $t(He), ze(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, t.tag));
  }
  function X_(e, t) {
    switch (Wc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return $t(He), we(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return kn(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (yt(t), t.alternate === null)
            throw Error(r(340));
          ka();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (yt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(r(340));
          ka();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return j(Ge), null;
      case 4:
        return we(), null;
      case 10:
        return $t(t.type), null;
      case 22:
      case 23:
        return yt(t), fu(), e !== null && j(Xa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return $t(He), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Ef(e, t) {
    switch (Wc(t), t.tag) {
      case 3:
        $t(He), we();
        break;
      case 26:
      case 27:
      case 5:
        kn(t);
        break;
      case 4:
        we();
        break;
      case 31:
        t.memoizedState !== null && yt(t);
        break;
      case 13:
        yt(t);
        break;
      case 19:
        j(Ge);
        break;
      case 10:
        $t(t.type);
        break;
      case 22:
      case 23:
        yt(t), fu(), e !== null && j(Xa);
        break;
      case 24:
        $t(He);
    }
  }
  function bn(e, t) {
    try {
      var a = t.updateQueue, l = a !== null ? a.lastEffect : null;
      if (l !== null) {
        var n = l.next;
        a = n;
        do {
          if ((a.tag & e) === e) {
            l = void 0;
            var i = a.create, c = a.inst;
            l = i(), c.destroy = l;
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (o) {
      be(t, t.return, o);
    }
  }
  function ba(e, t, a) {
    try {
      var l = t.updateQueue, n = l !== null ? l.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        l = i;
        do {
          if ((l.tag & e) === e) {
            var c = l.inst, o = c.destroy;
            if (o !== void 0) {
              c.destroy = void 0, n = t;
              var m = a, E = o;
              try {
                E();
              } catch (T) {
                be(
                  n,
                  m,
                  T
                );
              }
            }
          }
          l = l.next;
        } while (l !== i);
      }
    } catch (T) {
      be(t, t.return, T);
    }
  }
  function xf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var a = e.stateNode;
      try {
        dr(t, a);
      } catch (l) {
        be(e, e.return, l);
      }
    }
  }
  function Nf(e, t, a) {
    a.props = Wa(
      e.type,
      e.memoizedProps
    ), a.state = e.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (l) {
      be(e, t, l);
    }
  }
  function Sn(e, t) {
    try {
      var a = e.ref;
      if (a !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof a == "function" ? e.refCleanup = a(l) : a.current = l;
      }
    } catch (n) {
      be(e, t, n);
    }
  }
  function qt(e, t) {
    var a = e.ref, l = e.refCleanup;
    if (a !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (n) {
          be(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (n) {
          be(e, t, n);
        }
      else a.current = null;
  }
  function Af(e) {
    var t = e.type, a = e.memoizedProps, l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && l.focus();
          break e;
        case "img":
          a.src ? l.src = a.src : a.srcSet && (l.srcset = a.srcSet);
      }
    } catch (n) {
      be(e, e.return, n);
    }
  }
  function Vu(e, t, a) {
    try {
      var l = e.stateNode;
      m0(l, e.type, a, t), l[it] = t;
    } catch (n) {
      be(e, e.return, n);
    }
  }
  function Mf(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && za(e.type) || e.tag === 4;
  }
  function Qu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Mf(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && za(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Xu(e, t, a) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(e, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(e), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = Qt));
    else if (l !== 4 && (l === 27 && za(e.type) && (a = e.stateNode, t = null), e = e.child, e !== null))
      for (Xu(e, t, a), e = e.sibling; e !== null; )
        Xu(e, t, a), e = e.sibling;
  }
  function Ui(e, t, a) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);
    else if (l !== 4 && (l === 27 && za(e.type) && (a = e.stateNode), e = e.child, e !== null))
      for (Ui(e, t, a), e = e.sibling; e !== null; )
        Ui(e, t, a), e = e.sibling;
  }
  function zf(e) {
    var t = e.stateNode, a = e.memoizedProps;
    try {
      for (var l = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      Fe(t, l, a), t[Ze] = e, t[it] = a;
    } catch (i) {
      be(e, e.return, i);
    }
  }
  var ea = !1, Ye = !1, Ku = !1, Tf = typeof WeakSet == "function" ? WeakSet : Set, Qe = null;
  function K_(e, t) {
    if (e = e.containerInfo, _o = Pi, e = Ls(e), Lc(e)) {
      if ("selectionStart" in e)
        var a = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var l = a.getSelection && a.getSelection();
          if (l && l.rangeCount !== 0) {
            a = l.anchorNode;
            var n = l.anchorOffset, i = l.focusNode;
            l = l.focusOffset;
            try {
              a.nodeType, i.nodeType;
            } catch {
              a = null;
              break e;
            }
            var c = 0, o = -1, m = -1, E = 0, T = 0, D = e, x = null;
            t: for (; ; ) {
              for (var A; D !== a || n !== 0 && D.nodeType !== 3 || (o = c + n), D !== i || l !== 0 && D.nodeType !== 3 || (m = c + l), D.nodeType === 3 && (c += D.nodeValue.length), (A = D.firstChild) !== null; )
                x = D, D = A;
              for (; ; ) {
                if (D === e) break t;
                if (x === a && ++E === n && (o = c), x === i && ++T === l && (m = c), (A = D.nextSibling) !== null) break;
                D = x, x = D.parentNode;
              }
              D = A;
            }
            a = o === -1 || m === -1 ? null : { start: o, end: m };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (go = { focusedElem: e, selectionRange: a }, Pi = !1, Qe = t; Qe !== null; )
      if (t = Qe, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, Qe = e;
      else
        for (; Qe !== null; ) {
          switch (t = Qe, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (a = 0; a < e.length; a++)
                  n = e[a], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, a = t, n = i.memoizedProps, i = i.memoizedState, l = a.stateNode;
                try {
                  var q = Wa(
                    a.type,
                    n
                  );
                  e = l.getSnapshotBeforeUpdate(
                    q,
                    i
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Z) {
                  be(
                    a,
                    a.return,
                    Z
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, a = e.nodeType, a === 9)
                  yo(e);
                else if (a === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      yo(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(r(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Qe = e;
            break;
          }
          Qe = t.return;
        }
  }
  function Cf(e, t, a) {
    var l = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        aa(e, a), l & 4 && bn(5, a);
        break;
      case 1:
        if (aa(e, a), l & 4)
          if (e = a.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (c) {
              be(a, a.return, c);
            }
          else {
            var n = Wa(
              a.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                n,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (c) {
              be(
                a,
                a.return,
                c
              );
            }
          }
        l & 64 && xf(a), l & 512 && Sn(a, a.return);
        break;
      case 3:
        if (aa(e, a), l & 64 && (e = a.updateQueue, e !== null)) {
          if (t = null, a.child !== null)
            switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
          try {
            dr(e, t);
          } catch (c) {
            be(a, a.return, c);
          }
        }
        break;
      case 27:
        t === null && l & 4 && zf(a);
      case 26:
      case 5:
        aa(e, a), t === null && l & 4 && Af(a), l & 512 && Sn(a, a.return);
        break;
      case 12:
        aa(e, a);
        break;
      case 31:
        aa(e, a), l & 4 && Uf(e, a);
        break;
      case 13:
        aa(e, a), l & 4 && Df(e, a), l & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (a = t0.bind(
          null,
          a
        ), S0(e, a))));
        break;
      case 22:
        if (l = a.memoizedState !== null || ea, !l) {
          t = t !== null && t.memoizedState !== null || Ye, n = ea;
          var i = Ye;
          ea = l, (Ye = t) && !i ? la(
            e,
            a,
            (a.subtreeFlags & 8772) !== 0
          ) : aa(e, a), ea = n, Ye = i;
        }
        break;
      case 30:
        break;
      default:
        aa(e, a);
    }
  }
  function Of(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Of(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ec(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Te = null, ut = !1;
  function ta(e, t, a) {
    for (a = a.child; a !== null; )
      jf(e, t, a), a = a.sibling;
  }
  function jf(e, t, a) {
    if (mt && typeof mt.onCommitFiberUnmount == "function")
      try {
        mt.onCommitFiberUnmount(Ql, a);
      } catch {
      }
    switch (a.tag) {
      case 26:
        Ye || qt(a, t), ta(
          e,
          t,
          a
        ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        Ye || qt(a, t);
        var l = Te, n = ut;
        za(a.type) && (Te = a.stateNode, ut = !1), ta(
          e,
          t,
          a
        ), On(a.stateNode), Te = l, ut = n;
        break;
      case 5:
        Ye || qt(a, t);
      case 6:
        if (l = Te, n = ut, Te = null, ta(
          e,
          t,
          a
        ), Te = l, ut = n, Te !== null)
          if (ut)
            try {
              (Te.nodeType === 9 ? Te.body : Te.nodeName === "HTML" ? Te.ownerDocument.body : Te).removeChild(a.stateNode);
            } catch (i) {
              be(
                a,
                t,
                i
              );
            }
          else
            try {
              Te.removeChild(a.stateNode);
            } catch (i) {
              be(
                a,
                t,
                i
              );
            }
        break;
      case 18:
        Te !== null && (ut ? (e = Te, xd(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          a.stateNode
        ), ql(e)) : xd(Te, a.stateNode));
        break;
      case 4:
        l = Te, n = ut, Te = a.stateNode.containerInfo, ut = !0, ta(
          e,
          t,
          a
        ), Te = l, ut = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ba(2, a, t), Ye || ba(4, a, t), ta(
          e,
          t,
          a
        );
        break;
      case 1:
        Ye || (qt(a, t), l = a.stateNode, typeof l.componentWillUnmount == "function" && Nf(
          a,
          t,
          l
        )), ta(
          e,
          t,
          a
        );
        break;
      case 21:
        ta(
          e,
          t,
          a
        );
        break;
      case 22:
        Ye = (l = Ye) || a.memoizedState !== null, ta(
          e,
          t,
          a
        ), Ye = l;
        break;
      default:
        ta(
          e,
          t,
          a
        );
    }
  }
  function Uf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        ql(e);
      } catch (a) {
        be(t, t.return, a);
      }
    }
  }
  function Df(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        ql(e);
      } catch (a) {
        be(t, t.return, a);
      }
  }
  function Z_(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Tf()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Tf()), t;
      default:
        throw Error(r(435, e.tag));
    }
  }
  function Di(e, t) {
    var a = Z_(e);
    t.forEach(function(l) {
      if (!a.has(l)) {
        a.add(l);
        var n = a0.bind(null, e, l);
        l.then(n, n);
      }
    });
  }
  function ot(e, t) {
    var a = t.deletions;
    if (a !== null)
      for (var l = 0; l < a.length; l++) {
        var n = a[l], i = e, c = t, o = c;
        e: for (; o !== null; ) {
          switch (o.tag) {
            case 27:
              if (za(o.type)) {
                Te = o.stateNode, ut = !1;
                break e;
              }
              break;
            case 5:
              Te = o.stateNode, ut = !1;
              break e;
            case 3:
            case 4:
              Te = o.stateNode.containerInfo, ut = !0;
              break e;
          }
          o = o.return;
        }
        if (Te === null) throw Error(r(160));
        jf(i, c, n), Te = null, ut = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Rf(t, e), t = t.sibling;
  }
  var Rt = null;
  function Rf(e, t) {
    var a = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ot(t, e), st(e), l & 4 && (ba(3, e, e.return), bn(3, e), ba(5, e, e.return));
        break;
      case 1:
        ot(t, e), st(e), l & 512 && (Ye || a === null || qt(a, a.return)), l & 64 && ea && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (a = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = a === null ? l : a.concat(l))));
        break;
      case 26:
        var n = Rt;
        if (ot(t, e), st(e), l & 512 && (Ye || a === null || qt(a, a.return)), l & 4) {
          var i = a !== null ? a.memoizedState : null;
          if (l = e.memoizedState, a === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, a = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (l) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[Zl] || i[Ze] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(l), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), Fe(i, l, a), i[Ze] = e, Ve(i), l = i;
                      break e;
                    case "link":
                      var c = Rd(
                        "link",
                        "href",
                        n
                      ).get(l + (a.href || ""));
                      if (c) {
                        for (var o = 0; o < c.length; o++)
                          if (i = c[o], i.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && i.getAttribute("rel") === (a.rel == null ? null : a.rel) && i.getAttribute("title") === (a.title == null ? null : a.title) && i.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                            c.splice(o, 1);
                            break t;
                          }
                      }
                      i = n.createElement(l), Fe(i, l, a), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (c = Rd(
                        "meta",
                        "content",
                        n
                      ).get(l + (a.content || ""))) {
                        for (o = 0; o < c.length; o++)
                          if (i = c[o], i.getAttribute("content") === (a.content == null ? null : "" + a.content) && i.getAttribute("name") === (a.name == null ? null : a.name) && i.getAttribute("property") === (a.property == null ? null : a.property) && i.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && i.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                            c.splice(o, 1);
                            break t;
                          }
                      }
                      i = n.createElement(l), Fe(i, l, a), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(r(468, l));
                  }
                  i[Ze] = e, Ve(i), l = i;
                }
                e.stateNode = l;
              } else
                wd(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Dd(
                n,
                l,
                e.memoizedProps
              );
          else
            i !== l ? (i === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : i.count--, l === null ? wd(
              n,
              e.type,
              e.stateNode
            ) : Dd(
              n,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && Vu(
              e,
              e.memoizedProps,
              a.memoizedProps
            );
        }
        break;
      case 27:
        ot(t, e), st(e), l & 512 && (Ye || a === null || qt(a, a.return)), a !== null && l & 4 && Vu(
          e,
          e.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (ot(t, e), st(e), l & 512 && (Ye || a === null || qt(a, a.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            sl(n, "");
          } catch (q) {
            be(e, e.return, q);
          }
        }
        l & 4 && e.stateNode != null && (n = e.memoizedProps, Vu(
          e,
          n,
          a !== null ? a.memoizedProps : n
        )), l & 1024 && (Ku = !0);
        break;
      case 6:
        if (ot(t, e), st(e), l & 4) {
          if (e.stateNode === null)
            throw Error(r(162));
          l = e.memoizedProps, a = e.stateNode;
          try {
            a.nodeValue = l;
          } catch (q) {
            be(e, e.return, q);
          }
        }
        break;
      case 3:
        if ($i = null, n = Rt, Rt = Zi(t.containerInfo), ot(t, e), Rt = n, st(e), l & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            ql(t.containerInfo);
          } catch (q) {
            be(e, e.return, q);
          }
        Ku && (Ku = !1, wf(e));
        break;
      case 4:
        l = Rt, Rt = Zi(
          e.stateNode.containerInfo
        ), ot(t, e), st(e), Rt = l;
        break;
      case 12:
        ot(t, e), st(e);
        break;
      case 31:
        ot(t, e), st(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, Di(e, l)));
        break;
      case 13:
        ot(t, e), st(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (wi = dt()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, Di(e, l)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var m = a !== null && a.memoizedState !== null, E = ea, T = Ye;
        if (ea = E || n, Ye = T || m, ot(t, e), Ye = T, ea = E, st(e), l & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (a === null || m || ea || Ye || Fa(e)), a = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                m = a = t;
                try {
                  if (i = m.stateNode, n)
                    c = i.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    o = m.stateNode;
                    var D = m.memoizedProps.style, x = D != null && D.hasOwnProperty("display") ? D.display : null;
                    o.style.display = x == null || typeof x == "boolean" ? "" : ("" + x).trim();
                  }
                } catch (q) {
                  be(m, m.return, q);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                m = t;
                try {
                  m.stateNode.nodeValue = n ? "" : m.memoizedProps;
                } catch (q) {
                  be(m, m.return, q);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                m = t;
                try {
                  var A = m.stateNode;
                  n ? Nd(A, !0) : Nd(m.stateNode, !1);
                } catch (q) {
                  be(m, m.return, q);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              a === t && (a = null), t = t.return;
            }
            a === t && (a = null), t.sibling.return = t.return, t = t.sibling;
          }
        l & 4 && (l = e.updateQueue, l !== null && (a = l.retryQueue, a !== null && (l.retryQueue = null, Di(e, a))));
        break;
      case 19:
        ot(t, e), st(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, Di(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ot(t, e), st(e);
    }
  }
  function st(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var a, l = e.return; l !== null; ) {
          if (Mf(l)) {
            a = l;
            break;
          }
          l = l.return;
        }
        if (a == null) throw Error(r(160));
        switch (a.tag) {
          case 27:
            var n = a.stateNode, i = Qu(e);
            Ui(e, i, n);
            break;
          case 5:
            var c = a.stateNode;
            a.flags & 32 && (sl(c, ""), a.flags &= -33);
            var o = Qu(e);
            Ui(e, o, c);
            break;
          case 3:
          case 4:
            var m = a.stateNode.containerInfo, E = Qu(e);
            Xu(
              e,
              E,
              m
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (T) {
        be(e, e.return, T);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function wf(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        wf(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function aa(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Cf(e, t.alternate, t), t = t.sibling;
  }
  function Fa(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ba(4, t, t.return), Fa(t);
          break;
        case 1:
          qt(t, t.return);
          var a = t.stateNode;
          typeof a.componentWillUnmount == "function" && Nf(
            t,
            t.return,
            a
          ), Fa(t);
          break;
        case 27:
          On(t.stateNode);
        case 26:
        case 5:
          qt(t, t.return), Fa(t);
          break;
        case 22:
          t.memoizedState === null && Fa(t);
          break;
        case 30:
          Fa(t);
          break;
        default:
          Fa(t);
      }
      e = e.sibling;
    }
  }
  function la(e, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, n = e, i = t, c = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          la(
            n,
            i,
            a
          ), bn(4, i);
          break;
        case 1:
          if (la(
            n,
            i,
            a
          ), l = i, n = l.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (E) {
              be(l, l.return, E);
            }
          if (l = i, n = l.updateQueue, n !== null) {
            var o = l.stateNode;
            try {
              var m = n.shared.hiddenCallbacks;
              if (m !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < m.length; n++)
                  fr(m[n], o);
            } catch (E) {
              be(l, l.return, E);
            }
          }
          a && c & 64 && xf(i), Sn(i, i.return);
          break;
        case 27:
          zf(i);
        case 26:
        case 5:
          la(
            n,
            i,
            a
          ), a && l === null && c & 4 && Af(i), Sn(i, i.return);
          break;
        case 12:
          la(
            n,
            i,
            a
          );
          break;
        case 31:
          la(
            n,
            i,
            a
          ), a && c & 4 && Uf(n, i);
          break;
        case 13:
          la(
            n,
            i,
            a
          ), a && c & 4 && Df(n, i);
          break;
        case 22:
          i.memoizedState === null && la(
            n,
            i,
            a
          ), Sn(i, i.return);
          break;
        case 30:
          break;
        default:
          la(
            n,
            i,
            a
          );
      }
      t = t.sibling;
    }
  }
  function Zu(e, t) {
    var a = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && e.refCount++, a != null && un(a));
  }
  function Ju(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && un(e));
  }
  function wt(e, t, a, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Gf(
          e,
          t,
          a,
          l
        ), t = t.sibling;
  }
  function Gf(e, t, a, l) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        wt(
          e,
          t,
          a,
          l
        ), n & 2048 && bn(9, t);
        break;
      case 1:
        wt(
          e,
          t,
          a,
          l
        );
        break;
      case 3:
        wt(
          e,
          t,
          a,
          l
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && un(e)));
        break;
      case 12:
        if (n & 2048) {
          wt(
            e,
            t,
            a,
            l
          ), e = t.stateNode;
          try {
            var i = t.memoizedProps, c = i.id, o = i.onPostCommit;
            typeof o == "function" && o(
              c,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (m) {
            be(t, t.return, m);
          }
        } else
          wt(
            e,
            t,
            a,
            l
          );
        break;
      case 31:
        wt(
          e,
          t,
          a,
          l
        );
        break;
      case 13:
        wt(
          e,
          t,
          a,
          l
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, c = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? wt(
          e,
          t,
          a,
          l
        ) : En(e, t) : i._visibility & 2 ? wt(
          e,
          t,
          a,
          l
        ) : (i._visibility |= 2, Cl(
          e,
          t,
          a,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && Zu(c, t);
        break;
      case 24:
        wt(
          e,
          t,
          a,
          l
        ), n & 2048 && Ju(t.alternate, t);
        break;
      default:
        wt(
          e,
          t,
          a,
          l
        );
    }
  }
  function Cl(e, t, a, l, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var i = e, c = t, o = a, m = l, E = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          Cl(
            i,
            c,
            o,
            m,
            n
          ), bn(8, c);
          break;
        case 23:
          break;
        case 22:
          var T = c.stateNode;
          c.memoizedState !== null ? T._visibility & 2 ? Cl(
            i,
            c,
            o,
            m,
            n
          ) : En(
            i,
            c
          ) : (T._visibility |= 2, Cl(
            i,
            c,
            o,
            m,
            n
          )), n && E & 2048 && Zu(
            c.alternate,
            c
          );
          break;
        case 24:
          Cl(
            i,
            c,
            o,
            m,
            n
          ), n && E & 2048 && Ju(c.alternate, c);
          break;
        default:
          Cl(
            i,
            c,
            o,
            m,
            n
          );
      }
      t = t.sibling;
    }
  }
  function En(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var a = e, l = t, n = l.flags;
        switch (l.tag) {
          case 22:
            En(a, l), n & 2048 && Zu(
              l.alternate,
              l
            );
            break;
          case 24:
            En(a, l), n & 2048 && Ju(l.alternate, l);
            break;
          default:
            En(a, l);
        }
        t = t.sibling;
      }
  }
  var xn = 8192;
  function Ol(e, t, a) {
    if (e.subtreeFlags & xn)
      for (e = e.child; e !== null; )
        Bf(
          e,
          t,
          a
        ), e = e.sibling;
  }
  function Bf(e, t, a) {
    switch (e.tag) {
      case 26:
        Ol(
          e,
          t,
          a
        ), e.flags & xn && e.memoizedState !== null && D0(
          a,
          Rt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Ol(
          e,
          t,
          a
        );
        break;
      case 3:
      case 4:
        var l = Rt;
        Rt = Zi(e.stateNode.containerInfo), Ol(
          e,
          t,
          a
        ), Rt = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = xn, xn = 16777216, Ol(
          e,
          t,
          a
        ), xn = l) : Ol(
          e,
          t,
          a
        ));
        break;
      default:
        Ol(
          e,
          t,
          a
        );
    }
  }
  function Hf(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Nn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var l = t[a];
          Qe = l, qf(
            l,
            e
          );
        }
      Hf(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Lf(e), e = e.sibling;
  }
  function Lf(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Nn(e), e.flags & 2048 && ba(9, e, e.return);
        break;
      case 3:
        Nn(e);
        break;
      case 12:
        Nn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ri(e)) : Nn(e);
        break;
      default:
        Nn(e);
    }
  }
  function Ri(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var l = t[a];
          Qe = l, qf(
            l,
            e
          );
        }
      Hf(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          ba(8, t, t.return), Ri(t);
          break;
        case 22:
          a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, Ri(t));
          break;
        default:
          Ri(t);
      }
      e = e.sibling;
    }
  }
  function qf(e, t) {
    for (; Qe !== null; ) {
      var a = Qe;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          ba(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var l = a.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          un(a.memoizedState.cache);
      }
      if (l = a.child, l !== null) l.return = a, Qe = l;
      else
        e: for (a = e; Qe !== null; ) {
          l = Qe;
          var n = l.sibling, i = l.return;
          if (Of(l), l === a) {
            Qe = null;
            break e;
          }
          if (n !== null) {
            n.return = i, Qe = n;
            break e;
          }
          Qe = i;
        }
    }
  }
  var J_ = {
    getCacheForType: function(e) {
      var t = $e(He), a = t.data.get(e);
      return a === void 0 && (a = e(), t.data.set(e, a)), a;
    },
    cacheSignal: function() {
      return $e(He).controller.signal;
    }
  }, $_ = typeof WeakMap == "function" ? WeakMap : Map, he = 0, Ne = null, ne = null, ce = 0, pe = 0, pt = null, Sa = !1, jl = !1, $u = !1, na = 0, De = 0, Ea = 0, Ia = 0, Wu = 0, bt = 0, Ul = 0, An = null, rt = null, Fu = !1, wi = 0, Yf = 0, Gi = 1 / 0, Bi = null, xa = null, ke = 0, Na = null, Dl = null, ia = 0, Iu = 0, Pu = null, kf = null, Mn = 0, eo = null;
  function St() {
    return (he & 2) !== 0 && ce !== 0 ? ce & -ce : z.T !== null ? co() : ls();
  }
  function Vf() {
    if (bt === 0)
      if ((ce & 536870912) === 0 || re) {
        var e = Xn;
        Xn <<= 1, (Xn & 3932160) === 0 && (Xn = 262144), bt = e;
      } else bt = 536870912;
    return e = vt.current, e !== null && (e.flags |= 32), bt;
  }
  function ft(e, t, a) {
    (e === Ne && (pe === 2 || pe === 9) || e.cancelPendingCommit !== null) && (Rl(e, 0), Aa(
      e,
      ce,
      bt,
      !1
    )), Kl(e, a), ((he & 2) === 0 || e !== Ne) && (e === Ne && ((he & 2) === 0 && (Ia |= a), De === 4 && Aa(
      e,
      ce,
      bt,
      !1
    )), Yt(e));
  }
  function Qf(e, t, a) {
    if ((he & 6) !== 0) throw Error(r(327));
    var l = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Xl(e, t), n = l ? I_(e, t) : ao(e, t, !0), i = l;
    do {
      if (n === 0) {
        jl && !l && Aa(e, t, 0, !1);
        break;
      } else {
        if (a = e.current.alternate, i && !W_(a)) {
          n = ao(e, t, !1), i = !1;
          continue;
        }
        if (n === 2) {
          if (i = t, e.errorRecoveryDisabledLanes & i)
            var c = 0;
          else
            c = e.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            t = c;
            e: {
              var o = e;
              n = An;
              var m = o.current.memoizedState.isDehydrated;
              if (m && (Rl(o, c).flags |= 256), c = ao(
                o,
                c,
                !1
              ), c !== 2) {
                if ($u && !m) {
                  o.errorRecoveryDisabledLanes |= i, Ia |= i, n = 4;
                  break e;
                }
                i = rt, rt = n, i !== null && (rt === null ? rt = i : rt.push.apply(
                  rt,
                  i
                ));
              }
              n = c;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Rl(e, 0), Aa(e, t, 0, !0);
          break;
        }
        e: {
          switch (l = e, i = n, i) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Aa(
                l,
                t,
                bt,
                !Sa
              );
              break e;
            case 2:
              rt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && (n = wi + 300 - dt(), 10 < n)) {
            if (Aa(
              l,
              t,
              bt,
              !Sa
            ), Zn(l, 0, !0) !== 0) break e;
            ia = t, l.timeoutHandle = Sd(
              Xf.bind(
                null,
                l,
                a,
                rt,
                Bi,
                Fu,
                t,
                bt,
                Ia,
                Ul,
                Sa,
                i,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          Xf(
            l,
            a,
            rt,
            Bi,
            Fu,
            t,
            bt,
            Ia,
            Ul,
            Sa,
            i,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Yt(e);
  }
  function Xf(e, t, a, l, n, i, c, o, m, E, T, D, x, A) {
    if (e.timeoutHandle = -1, D = t.subtreeFlags, D & 8192 || (D & 16785408) === 16785408) {
      D = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Qt
      }, Bf(
        t,
        i,
        D
      );
      var q = (i & 62914560) === i ? wi - dt() : (i & 4194048) === i ? Yf - dt() : 0;
      if (q = R0(
        D,
        q
      ), q !== null) {
        ia = i, e.cancelPendingCommit = q(
          Pf.bind(
            null,
            e,
            t,
            i,
            a,
            l,
            n,
            c,
            o,
            m,
            T,
            D,
            null,
            x,
            A
          )
        ), Aa(e, i, c, !E);
        return;
      }
    }
    Pf(
      e,
      t,
      i,
      a,
      l,
      n,
      c,
      o,
      m
    );
  }
  function W_(e) {
    for (var t = e; ; ) {
      var a = t.tag;
      if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null)))
        for (var l = 0; l < a.length; l++) {
          var n = a[l], i = n.getSnapshot;
          n = n.value;
          try {
            if (!gt(i(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (a = t.child, t.subtreeFlags & 16384 && a !== null)
        a.return = t, t = a;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Aa(e, t, a, l) {
    t &= ~Wu, t &= ~Ia, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - _t(n), c = 1 << i;
      l[i] = -1, n &= ~c;
    }
    a !== 0 && es(e, a, t);
  }
  function Hi() {
    return (he & 6) === 0 ? (zn(0), !1) : !0;
  }
  function to() {
    if (ne !== null) {
      if (pe === 0)
        var e = ne.return;
      else
        e = ne, Jt = Va = null, vu(e), Nl = null, sn = 0, e = ne;
      for (; e !== null; )
        Ef(e.alternate, e), e = e.return;
      ne = null;
    }
  }
  function Rl(e, t) {
    var a = e.timeoutHandle;
    a !== -1 && (e.timeoutHandle = -1, h0(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), ia = 0, to(), Ne = e, ne = a = Kt(e.current, null), ce = t, pe = 0, pt = null, Sa = !1, jl = Xl(e, t), $u = !1, Ul = bt = Wu = Ia = Ea = De = 0, rt = An = null, Fu = !1, (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var n = 31 - _t(l), i = 1 << n;
        t |= e[n], l &= ~i;
      }
    return na = t, ii(), a;
  }
  function Kf(e, t) {
    F = null, z.H = vn, t === xl || t === mi ? (t = ur(), pe = 3) : t === iu ? (t = ur(), pe = 4) : pe = t === Du ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, pt = t, ne === null && (De = 1, zi(
      e,
      At(t, e.current)
    ));
  }
  function Zf() {
    var e = vt.current;
    return e === null ? !0 : (ce & 4194048) === ce ? Ct === null : (ce & 62914560) === ce || (ce & 536870912) !== 0 ? e === Ct : !1;
  }
  function Jf() {
    var e = z.H;
    return z.H = vn, e === null ? vn : e;
  }
  function $f() {
    var e = z.A;
    return z.A = J_, e;
  }
  function Li() {
    De = 4, Sa || (ce & 4194048) !== ce && vt.current !== null || (jl = !0), (Ea & 134217727) === 0 && (Ia & 134217727) === 0 || Ne === null || Aa(
      Ne,
      ce,
      bt,
      !1
    );
  }
  function ao(e, t, a) {
    var l = he;
    he |= 2;
    var n = Jf(), i = $f();
    (Ne !== e || ce !== t) && (Bi = null, Rl(e, t)), t = !1;
    var c = De;
    e: do
      try {
        if (pe !== 0 && ne !== null) {
          var o = ne, m = pt;
          switch (pe) {
            case 8:
              to(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              vt.current === null && (t = !0);
              var E = pe;
              if (pe = 0, pt = null, wl(e, o, m, E), a && jl) {
                c = 0;
                break e;
              }
              break;
            default:
              E = pe, pe = 0, pt = null, wl(e, o, m, E);
          }
        }
        F_(), c = De;
        break;
      } catch (T) {
        Kf(e, T);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Jt = Va = null, he = l, z.H = n, z.A = i, ne === null && (Ne = null, ce = 0, ii()), c;
  }
  function F_() {
    for (; ne !== null; ) Wf(ne);
  }
  function I_(e, t) {
    var a = he;
    he |= 2;
    var l = Jf(), n = $f();
    Ne !== e || ce !== t ? (Bi = null, Gi = dt() + 500, Rl(e, t)) : jl = Xl(
      e,
      t
    );
    e: do
      try {
        if (pe !== 0 && ne !== null) {
          t = ne;
          var i = pt;
          t: switch (pe) {
            case 1:
              pe = 0, pt = null, wl(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (ir(i)) {
                pe = 0, pt = null, Ff(t);
                break;
              }
              t = function() {
                pe !== 2 && pe !== 9 || Ne !== e || (pe = 7), Yt(e);
              }, i.then(t, t);
              break e;
            case 3:
              pe = 7;
              break e;
            case 4:
              pe = 5;
              break e;
            case 7:
              ir(i) ? (pe = 0, pt = null, Ff(t)) : (pe = 0, pt = null, wl(e, t, i, 7));
              break;
            case 5:
              var c = null;
              switch (ne.tag) {
                case 26:
                  c = ne.memoizedState;
                case 5:
                case 27:
                  var o = ne;
                  if (c ? Gd(c) : o.stateNode.complete) {
                    pe = 0, pt = null;
                    var m = o.sibling;
                    if (m !== null) ne = m;
                    else {
                      var E = o.return;
                      E !== null ? (ne = E, qi(E)) : ne = null;
                    }
                    break t;
                  }
              }
              pe = 0, pt = null, wl(e, t, i, 5);
              break;
            case 6:
              pe = 0, pt = null, wl(e, t, i, 6);
              break;
            case 8:
              to(), De = 6;
              break e;
            default:
              throw Error(r(462));
          }
        }
        P_();
        break;
      } catch (T) {
        Kf(e, T);
      }
    while (!0);
    return Jt = Va = null, z.H = l, z.A = n, he = a, ne !== null ? 0 : (Ne = null, ce = 0, ii(), De);
  }
  function P_() {
    for (; ne !== null && !Em(); )
      Wf(ne);
  }
  function Wf(e) {
    var t = bf(e.alternate, e, na);
    e.memoizedProps = e.pendingProps, t === null ? qi(e) : ne = t;
  }
  function Ff(e) {
    var t = e, a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = _f(
          a,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ce
        );
        break;
      case 11:
        t = _f(
          a,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ce
        );
        break;
      case 5:
        vu(t);
      default:
        Ef(a, t), t = ne = Js(t, na), t = bf(a, t, na);
    }
    e.memoizedProps = e.pendingProps, t === null ? qi(e) : ne = t;
  }
  function wl(e, t, a, l) {
    Jt = Va = null, vu(t), Nl = null, sn = 0;
    var n = t.return;
    try {
      if (Y_(
        e,
        n,
        t,
        a,
        ce
      )) {
        De = 1, zi(
          e,
          At(a, e.current)
        ), ne = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw ne = n, i;
      De = 1, zi(
        e,
        At(a, e.current)
      ), ne = null;
      return;
    }
    t.flags & 32768 ? (re || l === 1 ? e = !0 : jl || (ce & 536870912) !== 0 ? e = !1 : (Sa = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = vt.current, l !== null && l.tag === 13 && (l.flags |= 16384))), If(t, e)) : qi(t);
  }
  function qi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        If(
          t,
          Sa
        );
        return;
      }
      e = t.return;
      var a = Q_(
        t.alternate,
        t,
        na
      );
      if (a !== null) {
        ne = a;
        return;
      }
      if (t = t.sibling, t !== null) {
        ne = t;
        return;
      }
      ne = t = e;
    } while (t !== null);
    De === 0 && (De = 5);
  }
  function If(e, t) {
    do {
      var a = X_(e.alternate, e);
      if (a !== null) {
        a.flags &= 32767, ne = a;
        return;
      }
      if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
        ne = e;
        return;
      }
      ne = e = a;
    } while (e !== null);
    De = 6, ne = null;
  }
  function Pf(e, t, a, l, n, i, c, o, m) {
    e.cancelPendingCommit = null;
    do
      Yi();
    while (ke !== 0);
    if ((he & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === e.current) throw Error(r(177));
      if (i = t.lanes | t.childLanes, i |= Qc, Um(
        e,
        a,
        i,
        c,
        o,
        m
      ), e === Ne && (ne = Ne = null, ce = 0), Dl = t, Na = e, ia = a, Iu = i, Pu = n, kf = l, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, l0(Vn, function() {
        return nd(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
        l = z.T, z.T = null, n = w.p, w.p = 2, c = he, he |= 4;
        try {
          K_(e, t, a);
        } finally {
          he = c, w.p = n, z.T = l;
        }
      }
      ke = 1, ed(), td(), ad();
    }
  }
  function ed() {
    if (ke === 1) {
      ke = 0;
      var e = Na, t = Dl, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = z.T, z.T = null;
        var l = w.p;
        w.p = 2;
        var n = he;
        he |= 4;
        try {
          Rf(t, e);
          var i = go, c = Ls(e.containerInfo), o = i.focusedElem, m = i.selectionRange;
          if (c !== o && o && o.ownerDocument && Hs(
            o.ownerDocument.documentElement,
            o
          )) {
            if (m !== null && Lc(o)) {
              var E = m.start, T = m.end;
              if (T === void 0 && (T = E), "selectionStart" in o)
                o.selectionStart = E, o.selectionEnd = Math.min(
                  T,
                  o.value.length
                );
              else {
                var D = o.ownerDocument || document, x = D && D.defaultView || window;
                if (x.getSelection) {
                  var A = x.getSelection(), q = o.textContent.length, Z = Math.min(m.start, q), xe = m.end === void 0 ? Z : Math.min(m.end, q);
                  !A.extend && Z > xe && (c = xe, xe = Z, Z = c);
                  var v = Bs(
                    o,
                    Z
                  ), g = Bs(
                    o,
                    xe
                  );
                  if (v && g && (A.rangeCount !== 1 || A.anchorNode !== v.node || A.anchorOffset !== v.offset || A.focusNode !== g.node || A.focusOffset !== g.offset)) {
                    var S = D.createRange();
                    S.setStart(v.node, v.offset), A.removeAllRanges(), Z > xe ? (A.addRange(S), A.extend(g.node, g.offset)) : (S.setEnd(g.node, g.offset), A.addRange(S));
                  }
                }
              }
            }
            for (D = [], A = o; A = A.parentNode; )
              A.nodeType === 1 && D.push({
                element: A,
                left: A.scrollLeft,
                top: A.scrollTop
              });
            for (typeof o.focus == "function" && o.focus(), o = 0; o < D.length; o++) {
              var O = D[o];
              O.element.scrollLeft = O.left, O.element.scrollTop = O.top;
            }
          }
          Pi = !!_o, go = _o = null;
        } finally {
          he = n, w.p = l, z.T = a;
        }
      }
      e.current = t, ke = 2;
    }
  }
  function td() {
    if (ke === 2) {
      ke = 0;
      var e = Na, t = Dl, a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        a = z.T, z.T = null;
        var l = w.p;
        w.p = 2;
        var n = he;
        he |= 4;
        try {
          Cf(e, t.alternate, t);
        } finally {
          he = n, w.p = l, z.T = a;
        }
      }
      ke = 3;
    }
  }
  function ad() {
    if (ke === 4 || ke === 3) {
      ke = 0, xm();
      var e = Na, t = Dl, a = ia, l = kf;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? ke = 5 : (ke = 0, Dl = Na = null, ld(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (xa = null), bc(a), t = t.stateNode, mt && typeof mt.onCommitFiberRoot == "function")
        try {
          mt.onCommitFiberRoot(
            Ql,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (l !== null) {
        t = z.T, n = w.p, w.p = 2, z.T = null;
        try {
          for (var i = e.onRecoverableError, c = 0; c < l.length; c++) {
            var o = l[c];
            i(o.value, {
              componentStack: o.stack
            });
          }
        } finally {
          z.T = t, w.p = n;
        }
      }
      (ia & 3) !== 0 && Yi(), Yt(e), n = e.pendingLanes, (a & 261930) !== 0 && (n & 42) !== 0 ? e === eo ? Mn++ : (Mn = 0, eo = e) : Mn = 0, zn(0);
    }
  }
  function ld(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, un(t)));
  }
  function Yi() {
    return ed(), td(), ad(), nd();
  }
  function nd() {
    if (ke !== 5) return !1;
    var e = Na, t = Iu;
    Iu = 0;
    var a = bc(ia), l = z.T, n = w.p;
    try {
      w.p = 32 > a ? 32 : a, z.T = null, a = Pu, Pu = null;
      var i = Na, c = ia;
      if (ke = 0, Dl = Na = null, ia = 0, (he & 6) !== 0) throw Error(r(331));
      var o = he;
      if (he |= 4, Lf(i.current), Gf(
        i,
        i.current,
        c,
        a
      ), he = o, zn(0, !1), mt && typeof mt.onPostCommitFiberRoot == "function")
        try {
          mt.onPostCommitFiberRoot(Ql, i);
        } catch {
        }
      return !0;
    } finally {
      w.p = n, z.T = l, ld(e, t);
    }
  }
  function id(e, t, a) {
    t = At(a, t), t = Uu(e.stateNode, t, 2), e = va(e, t, 2), e !== null && (Kl(e, 2), Yt(e));
  }
  function be(e, t, a) {
    if (e.tag === 3)
      id(e, e, a);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          id(
            t,
            e,
            a
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (xa === null || !xa.has(l))) {
            e = At(a, e), a = cf(2), l = va(t, a, 2), l !== null && (uf(
              a,
              l,
              t,
              e
            ), Kl(l, 2), Yt(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function lo(e, t, a) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new $_();
      var n = /* @__PURE__ */ new Set();
      l.set(t, n);
    } else
      n = l.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), l.set(t, n));
    n.has(a) || ($u = !0, n.add(a), e = e0.bind(null, e, t, a), t.then(e, e));
  }
  function e0(e, t, a) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, Ne === e && (ce & a) === a && (De === 4 || De === 3 && (ce & 62914560) === ce && 300 > dt() - wi ? (he & 2) === 0 && Rl(e, 0) : Wu |= a, Ul === ce && (Ul = 0)), Yt(e);
  }
  function cd(e, t) {
    t === 0 && (t = Po()), e = qa(e, t), e !== null && (Kl(e, t), Yt(e));
  }
  function t0(e) {
    var t = e.memoizedState, a = 0;
    t !== null && (a = t.retryLane), cd(e, a);
  }
  function a0(e, t) {
    var a = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode, n = e.memoizedState;
        n !== null && (a = n.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    l !== null && l.delete(t), cd(e, a);
  }
  function l0(e, t) {
    return hc(e, t);
  }
  var ki = null, Gl = null, no = !1, Vi = !1, io = !1, Ma = 0;
  function Yt(e) {
    e !== Gl && e.next === null && (Gl === null ? ki = Gl = e : Gl = Gl.next = e), Vi = !0, no || (no = !0, i0());
  }
  function zn(e, t) {
    if (!io && Vi) {
      io = !0;
      do
        for (var a = !1, l = ki; l !== null; ) {
          if (e !== 0) {
            var n = l.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = l.suspendedLanes, o = l.pingedLanes;
              i = (1 << 31 - _t(42 | e) + 1) - 1, i &= n & ~(c & ~o), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (a = !0, rd(l, i));
          } else
            i = ce, i = Zn(
              l,
              l === Ne ? i : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (i & 3) === 0 || Xl(l, i) || (a = !0, rd(l, i));
          l = l.next;
        }
      while (a);
      io = !1;
    }
  }
  function n0() {
    ud();
  }
  function ud() {
    Vi = no = !1;
    var e = 0;
    Ma !== 0 && g0() && (e = Ma);
    for (var t = dt(), a = null, l = ki; l !== null; ) {
      var n = l.next, i = od(l, t);
      i === 0 ? (l.next = null, a === null ? ki = n : a.next = n, n === null && (Gl = a)) : (a = l, (e !== 0 || (i & 3) !== 0) && (Vi = !0)), l = n;
    }
    ke !== 0 && ke !== 5 || zn(e), Ma !== 0 && (Ma = 0);
  }
  function od(e, t) {
    for (var a = e.suspendedLanes, l = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var c = 31 - _t(i), o = 1 << c, m = n[c];
      m === -1 ? ((o & a) === 0 || (o & l) !== 0) && (n[c] = jm(o, t)) : m <= t && (e.expiredLanes |= o), i &= ~o;
    }
    if (t = Ne, a = ce, a = Zn(
      e,
      e === t ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, a === 0 || e === t && (pe === 2 || pe === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && vc(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((a & 3) === 0 || Xl(e, a)) {
      if (t = a & -a, t === e.callbackPriority) return t;
      switch (l !== null && vc(l), bc(a)) {
        case 2:
        case 8:
          a = Fo;
          break;
        case 32:
          a = Vn;
          break;
        case 268435456:
          a = Io;
          break;
        default:
          a = Vn;
      }
      return l = sd.bind(null, e), a = hc(a, l), e.callbackPriority = t, e.callbackNode = a, t;
    }
    return l !== null && l !== null && vc(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function sd(e, t) {
    if (ke !== 0 && ke !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var a = e.callbackNode;
    if (Yi() && e.callbackNode !== a)
      return null;
    var l = ce;
    return l = Zn(
      e,
      e === Ne ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (Qf(e, l, t), od(e, dt()), e.callbackNode != null && e.callbackNode === a ? sd.bind(null, e) : null);
  }
  function rd(e, t) {
    if (Yi()) return null;
    Qf(e, t, !0);
  }
  function i0() {
    v0(function() {
      (he & 6) !== 0 ? hc(
        Wo,
        n0
      ) : ud();
    });
  }
  function co() {
    if (Ma === 0) {
      var e = Sl;
      e === 0 && (e = Qn, Qn <<= 1, (Qn & 261888) === 0 && (Qn = 256)), Ma = e;
    }
    return Ma;
  }
  function fd(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Fn("" + e);
  }
  function dd(e, t) {
    var a = t.ownerDocument.createElement("input");
    return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
  }
  function c0(e, t, a, l, n) {
    if (t === "submit" && a && a.stateNode === n) {
      var i = fd(
        (n[it] || null).action
      ), c = l.submitter;
      c && (t = (t = c[it] || null) ? fd(t.formAction) : c.getAttribute("formAction"), t !== null && (i = t, c = null));
      var o = new ti(
        "action",
        "action",
        null,
        l,
        n
      );
      e.push({
        event: o,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (Ma !== 0) {
                  var m = c ? dd(n, c) : new FormData(n);
                  Mu(
                    a,
                    {
                      pending: !0,
                      data: m,
                      method: n.method,
                      action: i
                    },
                    null,
                    m
                  );
                }
              } else
                typeof i == "function" && (o.preventDefault(), m = c ? dd(n, c) : new FormData(n), Mu(
                  a,
                  {
                    pending: !0,
                    data: m,
                    method: n.method,
                    action: i
                  },
                  i,
                  m
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var uo = 0; uo < Vc.length; uo++) {
    var oo = Vc[uo], u0 = oo.toLowerCase(), o0 = oo[0].toUpperCase() + oo.slice(1);
    Dt(
      u0,
      "on" + o0
    );
  }
  Dt(ks, "onAnimationEnd"), Dt(Vs, "onAnimationIteration"), Dt(Qs, "onAnimationStart"), Dt("dblclick", "onDoubleClick"), Dt("focusin", "onFocus"), Dt("focusout", "onBlur"), Dt(N_, "onTransitionRun"), Dt(A_, "onTransitionStart"), Dt(M_, "onTransitionCancel"), Dt(Xs, "onTransitionEnd"), ul("onMouseEnter", ["mouseout", "mouseover"]), ul("onMouseLeave", ["mouseout", "mouseover"]), ul("onPointerEnter", ["pointerout", "pointerover"]), ul("onPointerLeave", ["pointerout", "pointerover"]), Ga(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ga(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ga("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ga(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ga(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ga(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Tn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), s0 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Tn)
  );
  function md(e, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < e.length; a++) {
      var l = e[a], n = l.event;
      l = l.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var c = l.length - 1; 0 <= c; c--) {
            var o = l[c], m = o.instance, E = o.currentTarget;
            if (o = o.listener, m !== i && n.isPropagationStopped())
              break e;
            i = o, n.currentTarget = E;
            try {
              i(n);
            } catch (T) {
              ni(T);
            }
            n.currentTarget = null, i = m;
          }
        else
          for (c = 0; c < l.length; c++) {
            if (o = l[c], m = o.instance, E = o.currentTarget, o = o.listener, m !== i && n.isPropagationStopped())
              break e;
            i = o, n.currentTarget = E;
            try {
              i(n);
            } catch (T) {
              ni(T);
            }
            n.currentTarget = null, i = m;
          }
      }
    }
  }
  function ie(e, t) {
    var a = t[Sc];
    a === void 0 && (a = t[Sc] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    a.has(l) || (_d(t, e, 2, !1), a.add(l));
  }
  function so(e, t, a) {
    var l = 0;
    t && (l |= 4), _d(
      a,
      e,
      l,
      t
    );
  }
  var Qi = "_reactListening" + Math.random().toString(36).slice(2);
  function ro(e) {
    if (!e[Qi]) {
      e[Qi] = !0, cs.forEach(function(a) {
        a !== "selectionchange" && (s0.has(a) || so(a, !1, e), so(a, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Qi] || (t[Qi] = !0, so("selectionchange", !1, t));
    }
  }
  function _d(e, t, a, l) {
    switch (Vd(t)) {
      case 2:
        var n = B0;
        break;
      case 8:
        n = H0;
        break;
      default:
        n = Mo;
    }
    a = n.bind(
      null,
      t,
      a,
      e
    ), n = void 0, !Oc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), l ? n !== void 0 ? e.addEventListener(t, a, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, a, !0) : n !== void 0 ? e.addEventListener(t, a, {
      passive: n
    }) : e.addEventListener(t, a, !1);
  }
  function fo(e, t, a, l, n) {
    var i = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var c = l.tag;
        if (c === 3 || c === 4) {
          var o = l.stateNode.containerInfo;
          if (o === n) break;
          if (c === 4)
            for (c = l.return; c !== null; ) {
              var m = c.tag;
              if ((m === 3 || m === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; o !== null; ) {
            if (c = nl(o), c === null) return;
            if (m = c.tag, m === 5 || m === 6 || m === 26 || m === 27) {
              l = i = c;
              continue e;
            }
            o = o.parentNode;
          }
        }
        l = l.return;
      }
    ys(function() {
      var E = i, T = Tc(a), D = [];
      e: {
        var x = Ks.get(e);
        if (x !== void 0) {
          var A = ti, q = e;
          switch (e) {
            case "keypress":
              if (Pn(a) === 0) break e;
            case "keydown":
            case "keyup":
              A = a_;
              break;
            case "focusin":
              q = "focus", A = Rc;
              break;
            case "focusout":
              q = "blur", A = Rc;
              break;
            case "beforeblur":
            case "afterblur":
              A = Rc;
              break;
            case "click":
              if (a.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              A = Ss;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              A = Qm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              A = i_;
              break;
            case ks:
            case Vs:
            case Qs:
              A = Zm;
              break;
            case Xs:
              A = u_;
              break;
            case "scroll":
            case "scrollend":
              A = km;
              break;
            case "wheel":
              A = s_;
              break;
            case "copy":
            case "cut":
            case "paste":
              A = $m;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              A = xs;
              break;
            case "toggle":
            case "beforetoggle":
              A = f_;
          }
          var Z = (t & 4) !== 0, xe = !Z && (e === "scroll" || e === "scrollend"), v = Z ? x !== null ? x + "Capture" : null : x;
          Z = [];
          for (var g = E, S; g !== null; ) {
            var O = g;
            if (S = O.stateNode, O = O.tag, O !== 5 && O !== 26 && O !== 27 || S === null || v === null || (O = $l(g, v), O != null && Z.push(
              Cn(g, O, S)
            )), xe) break;
            g = g.return;
          }
          0 < Z.length && (x = new A(
            x,
            q,
            null,
            a,
            T
          ), D.push({ event: x, listeners: Z }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (x = e === "mouseover" || e === "pointerover", A = e === "mouseout" || e === "pointerout", x && a !== zc && (q = a.relatedTarget || a.fromElement) && (nl(q) || q[ll]))
            break e;
          if ((A || x) && (x = T.window === T ? T : (x = T.ownerDocument) ? x.defaultView || x.parentWindow : window, A ? (q = a.relatedTarget || a.toElement, A = E, q = q ? nl(q) : null, q !== null && (xe = b(q), Z = q.tag, q !== xe || Z !== 5 && Z !== 27 && Z !== 6) && (q = null)) : (A = null, q = E), A !== q)) {
            if (Z = Ss, O = "onMouseLeave", v = "onMouseEnter", g = "mouse", (e === "pointerout" || e === "pointerover") && (Z = xs, O = "onPointerLeave", v = "onPointerEnter", g = "pointer"), xe = A == null ? x : Jl(A), S = q == null ? x : Jl(q), x = new Z(
              O,
              g + "leave",
              A,
              a,
              T
            ), x.target = xe, x.relatedTarget = S, O = null, nl(T) === E && (Z = new Z(
              v,
              g + "enter",
              q,
              a,
              T
            ), Z.target = S, Z.relatedTarget = xe, O = Z), xe = O, A && q)
              t: {
                for (Z = r0, v = A, g = q, S = 0, O = v; O; O = Z(O))
                  S++;
                O = 0;
                for (var Q = g; Q; Q = Z(Q))
                  O++;
                for (; 0 < S - O; )
                  v = Z(v), S--;
                for (; 0 < O - S; )
                  g = Z(g), O--;
                for (; S--; ) {
                  if (v === g || g !== null && v === g.alternate) {
                    Z = v;
                    break t;
                  }
                  v = Z(v), g = Z(g);
                }
                Z = null;
              }
            else Z = null;
            A !== null && gd(
              D,
              x,
              A,
              Z,
              !1
            ), q !== null && xe !== null && gd(
              D,
              xe,
              q,
              Z,
              !0
            );
          }
        }
        e: {
          if (x = E ? Jl(E) : window, A = x.nodeName && x.nodeName.toLowerCase(), A === "select" || A === "input" && x.type === "file")
            var _e = js;
          else if (Cs(x))
            if (Us)
              _e = S_;
            else {
              _e = p_;
              var k = y_;
            }
          else
            A = x.nodeName, !A || A.toLowerCase() !== "input" || x.type !== "checkbox" && x.type !== "radio" ? E && Mc(E.elementType) && (_e = js) : _e = b_;
          if (_e && (_e = _e(e, E))) {
            Os(
              D,
              _e,
              a,
              T
            );
            break e;
          }
          k && k(e, x, E), e === "focusout" && E && x.type === "number" && E.memoizedProps.value != null && Ac(x, "number", x.value);
        }
        switch (k = E ? Jl(E) : window, e) {
          case "focusin":
            (Cs(k) || k.contentEditable === "true") && (ml = k, qc = E, ln = null);
            break;
          case "focusout":
            ln = qc = ml = null;
            break;
          case "mousedown":
            Yc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Yc = !1, qs(D, a, T);
            break;
          case "selectionchange":
            if (x_) break;
          case "keydown":
          case "keyup":
            qs(D, a, T);
        }
        var I;
        if (Gc)
          e: {
            switch (e) {
              case "compositionstart":
                var ue = "onCompositionStart";
                break e;
              case "compositionend":
                ue = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ue = "onCompositionUpdate";
                break e;
            }
            ue = void 0;
          }
        else
          dl ? zs(e, a) && (ue = "onCompositionEnd") : e === "keydown" && a.keyCode === 229 && (ue = "onCompositionStart");
        ue && (Ns && a.locale !== "ko" && (dl || ue !== "onCompositionStart" ? ue === "onCompositionEnd" && dl && (I = ps()) : (ra = T, jc = "value" in ra ? ra.value : ra.textContent, dl = !0)), k = Xi(E, ue), 0 < k.length && (ue = new Es(
          ue,
          e,
          null,
          a,
          T
        ), D.push({ event: ue, listeners: k }), I ? ue.data = I : (I = Ts(a), I !== null && (ue.data = I)))), (I = m_ ? __(e, a) : g_(e, a)) && (ue = Xi(E, "onBeforeInput"), 0 < ue.length && (k = new Es(
          "onBeforeInput",
          "beforeinput",
          null,
          a,
          T
        ), D.push({
          event: k,
          listeners: ue
        }), k.data = I)), c0(
          D,
          e,
          E,
          a,
          T
        );
      }
      md(D, t);
    });
  }
  function Cn(e, t, a) {
    return {
      instance: e,
      listener: t,
      currentTarget: a
    };
  }
  function Xi(e, t) {
    for (var a = t + "Capture", l = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = $l(e, a), n != null && l.unshift(
        Cn(e, n, i)
      ), n = $l(e, t), n != null && l.push(
        Cn(e, n, i)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function r0(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function gd(e, t, a, l, n) {
    for (var i = t._reactName, c = []; a !== null && a !== l; ) {
      var o = a, m = o.alternate, E = o.stateNode;
      if (o = o.tag, m !== null && m === l) break;
      o !== 5 && o !== 26 && o !== 27 || E === null || (m = E, n ? (E = $l(a, i), E != null && c.unshift(
        Cn(a, E, m)
      )) : n || (E = $l(a, i), E != null && c.push(
        Cn(a, E, m)
      ))), a = a.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var f0 = /\r\n?/g, d0 = /\u0000|\uFFFD/g;
  function hd(e) {
    return (typeof e == "string" ? e : "" + e).replace(f0, `
`).replace(d0, "");
  }
  function vd(e, t) {
    return t = hd(t), hd(e) === t;
  }
  function Ee(e, t, a, l, n, i) {
    switch (a) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || sl(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && sl(e, "" + l);
        break;
      case "className":
        $n(e, "class", l);
        break;
      case "tabIndex":
        $n(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        $n(e, a, l);
        break;
      case "style":
        hs(e, l, i);
        break;
      case "data":
        if (t !== "object") {
          $n(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || a !== "href")) {
          e.removeAttribute(a);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(a);
          break;
        }
        l = Fn("" + l), e.setAttribute(a, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof i == "function" && (a === "formAction" ? (t !== "input" && Ee(e, t, "name", n.name, n, null), Ee(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Ee(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Ee(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Ee(e, t, "encType", n.encType, n, null), Ee(e, t, "method", n.method, n, null), Ee(e, t, "target", n.target, n, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(a);
          break;
        }
        l = Fn("" + l), e.setAttribute(a, l);
        break;
      case "onClick":
        l != null && (e.onclick = Qt);
        break;
      case "onScroll":
        l != null && ie("scroll", e);
        break;
      case "onScrollEnd":
        l != null && ie("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(r(61));
          if (a = l.__html, a != null) {
            if (n.children != null) throw Error(r(60));
            e.innerHTML = a;
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        a = Fn("" + l), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          a
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, "" + l) : e.removeAttribute(a);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, "") : e.removeAttribute(a);
        break;
      case "capture":
      case "download":
        l === !0 ? e.setAttribute(a, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, l) : e.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(a, l) : e.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(a) : e.setAttribute(a, l);
        break;
      case "popover":
        ie("beforetoggle", e), ie("toggle", e), Jn(e, "popover", l);
        break;
      case "xlinkActuate":
        Vt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        Vt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        Vt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        Vt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        Vt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        Vt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        Vt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        Vt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        Vt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        Jn(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = qm.get(a) || a, Jn(e, a, l));
    }
  }
  function mo(e, t, a, l, n, i) {
    switch (a) {
      case "style":
        hs(e, l, i);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(r(61));
          if (a = l.__html, a != null) {
            if (n.children != null) throw Error(r(60));
            e.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof l == "string" ? sl(e, l) : (typeof l == "number" || typeof l == "bigint") && sl(e, "" + l);
        break;
      case "onScroll":
        l != null && ie("scroll", e);
        break;
      case "onScrollEnd":
        l != null && ie("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = Qt);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!us.hasOwnProperty(a))
          e: {
            if (a[0] === "o" && a[1] === "n" && (n = a.endsWith("Capture"), t = a.slice(2, n ? a.length - 7 : void 0), i = e[it] || null, i = i != null ? i[a] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof l == "function")) {
              typeof i != "function" && i !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, l, n);
              break e;
            }
            a in e ? e[a] = l : l === !0 ? e.setAttribute(a, "") : Jn(e, a, l);
          }
    }
  }
  function Fe(e, t, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        ie("error", e), ie("load", e);
        var l = !1, n = !1, i;
        for (i in a)
          if (a.hasOwnProperty(i)) {
            var c = a[i];
            if (c != null)
              switch (i) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, t));
                default:
                  Ee(e, t, i, c, a, null);
              }
          }
        n && Ee(e, t, "srcSet", a.srcSet, a, null), l && Ee(e, t, "src", a.src, a, null);
        return;
      case "input":
        ie("invalid", e);
        var o = i = c = n = null, m = null, E = null;
        for (l in a)
          if (a.hasOwnProperty(l)) {
            var T = a[l];
            if (T != null)
              switch (l) {
                case "name":
                  n = T;
                  break;
                case "type":
                  c = T;
                  break;
                case "checked":
                  m = T;
                  break;
                case "defaultChecked":
                  E = T;
                  break;
                case "value":
                  i = T;
                  break;
                case "defaultValue":
                  o = T;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (T != null)
                    throw Error(r(137, t));
                  break;
                default:
                  Ee(e, t, l, T, a, null);
              }
          }
        ds(
          e,
          i,
          o,
          m,
          E,
          c,
          n,
          !1
        );
        return;
      case "select":
        ie("invalid", e), l = c = i = null;
        for (n in a)
          if (a.hasOwnProperty(n) && (o = a[n], o != null))
            switch (n) {
              case "value":
                i = o;
                break;
              case "defaultValue":
                c = o;
                break;
              case "multiple":
                l = o;
              default:
                Ee(e, t, n, o, a, null);
            }
        t = i, a = c, e.multiple = !!l, t != null ? ol(e, !!l, t, !1) : a != null && ol(e, !!l, a, !0);
        return;
      case "textarea":
        ie("invalid", e), i = n = l = null;
        for (c in a)
          if (a.hasOwnProperty(c) && (o = a[c], o != null))
            switch (c) {
              case "value":
                l = o;
                break;
              case "defaultValue":
                n = o;
                break;
              case "children":
                i = o;
                break;
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(r(91));
                break;
              default:
                Ee(e, t, c, o, a, null);
            }
        _s(e, l, n, i);
        return;
      case "option":
        for (m in a)
          a.hasOwnProperty(m) && (l = a[m], l != null) && (m === "selected" ? e.selected = l && typeof l != "function" && typeof l != "symbol" : Ee(e, t, m, l, a, null));
        return;
      case "dialog":
        ie("beforetoggle", e), ie("toggle", e), ie("cancel", e), ie("close", e);
        break;
      case "iframe":
      case "object":
        ie("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Tn.length; l++)
          ie(Tn[l], e);
        break;
      case "image":
        ie("error", e), ie("load", e);
        break;
      case "details":
        ie("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ie("error", e), ie("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (E in a)
          if (a.hasOwnProperty(E) && (l = a[E], l != null))
            switch (E) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, t));
              default:
                Ee(e, t, E, l, a, null);
            }
        return;
      default:
        if (Mc(t)) {
          for (T in a)
            a.hasOwnProperty(T) && (l = a[T], l !== void 0 && mo(
              e,
              t,
              T,
              l,
              a,
              void 0
            ));
          return;
        }
    }
    for (o in a)
      a.hasOwnProperty(o) && (l = a[o], l != null && Ee(e, t, o, l, a, null));
  }
  function m0(e, t, a, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null, i = null, c = null, o = null, m = null, E = null, T = null;
        for (A in a) {
          var D = a[A];
          if (a.hasOwnProperty(A) && D != null)
            switch (A) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                m = D;
              default:
                l.hasOwnProperty(A) || Ee(e, t, A, null, l, D);
            }
        }
        for (var x in l) {
          var A = l[x];
          if (D = a[x], l.hasOwnProperty(x) && (A != null || D != null))
            switch (x) {
              case "type":
                i = A;
                break;
              case "name":
                n = A;
                break;
              case "checked":
                E = A;
                break;
              case "defaultChecked":
                T = A;
                break;
              case "value":
                c = A;
                break;
              case "defaultValue":
                o = A;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(r(137, t));
                break;
              default:
                A !== D && Ee(
                  e,
                  t,
                  x,
                  A,
                  l,
                  D
                );
            }
        }
        Nc(
          e,
          c,
          o,
          m,
          E,
          T,
          i,
          n
        );
        return;
      case "select":
        A = c = o = x = null;
        for (i in a)
          if (m = a[i], a.hasOwnProperty(i) && m != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                A = m;
              default:
                l.hasOwnProperty(i) || Ee(
                  e,
                  t,
                  i,
                  null,
                  l,
                  m
                );
            }
        for (n in l)
          if (i = l[n], m = a[n], l.hasOwnProperty(n) && (i != null || m != null))
            switch (n) {
              case "value":
                x = i;
                break;
              case "defaultValue":
                o = i;
                break;
              case "multiple":
                c = i;
              default:
                i !== m && Ee(
                  e,
                  t,
                  n,
                  i,
                  l,
                  m
                );
            }
        t = o, a = c, l = A, x != null ? ol(e, !!a, x, !1) : !!l != !!a && (t != null ? ol(e, !!a, t, !0) : ol(e, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        A = x = null;
        for (o in a)
          if (n = a[o], a.hasOwnProperty(o) && n != null && !l.hasOwnProperty(o))
            switch (o) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ee(e, t, o, null, l, n);
            }
        for (c in l)
          if (n = l[c], i = a[c], l.hasOwnProperty(c) && (n != null || i != null))
            switch (c) {
              case "value":
                x = n;
                break;
              case "defaultValue":
                A = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(r(91));
                break;
              default:
                n !== i && Ee(e, t, c, n, l, i);
            }
        ms(e, x, A);
        return;
      case "option":
        for (var q in a)
          x = a[q], a.hasOwnProperty(q) && x != null && !l.hasOwnProperty(q) && (q === "selected" ? e.selected = !1 : Ee(
            e,
            t,
            q,
            null,
            l,
            x
          ));
        for (m in l)
          x = l[m], A = a[m], l.hasOwnProperty(m) && x !== A && (x != null || A != null) && (m === "selected" ? e.selected = x && typeof x != "function" && typeof x != "symbol" : Ee(
            e,
            t,
            m,
            x,
            l,
            A
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var Z in a)
          x = a[Z], a.hasOwnProperty(Z) && x != null && !l.hasOwnProperty(Z) && Ee(e, t, Z, null, l, x);
        for (E in l)
          if (x = l[E], A = a[E], l.hasOwnProperty(E) && x !== A && (x != null || A != null))
            switch (E) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (x != null)
                  throw Error(r(137, t));
                break;
              default:
                Ee(
                  e,
                  t,
                  E,
                  x,
                  l,
                  A
                );
            }
        return;
      default:
        if (Mc(t)) {
          for (var xe in a)
            x = a[xe], a.hasOwnProperty(xe) && x !== void 0 && !l.hasOwnProperty(xe) && mo(
              e,
              t,
              xe,
              void 0,
              l,
              x
            );
          for (T in l)
            x = l[T], A = a[T], !l.hasOwnProperty(T) || x === A || x === void 0 && A === void 0 || mo(
              e,
              t,
              T,
              x,
              l,
              A
            );
          return;
        }
    }
    for (var v in a)
      x = a[v], a.hasOwnProperty(v) && x != null && !l.hasOwnProperty(v) && Ee(e, t, v, null, l, x);
    for (D in l)
      x = l[D], A = a[D], !l.hasOwnProperty(D) || x === A || x == null && A == null || Ee(e, t, D, x, l, A);
  }
  function yd(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function _0() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), l = 0; l < a.length; l++) {
        var n = a[l], i = n.transferSize, c = n.initiatorType, o = n.duration;
        if (i && o && yd(c)) {
          for (c = 0, o = n.responseEnd, l += 1; l < a.length; l++) {
            var m = a[l], E = m.startTime;
            if (E > o) break;
            var T = m.transferSize, D = m.initiatorType;
            T && yd(D) && (m = m.responseEnd, c += T * (m < o ? 1 : (o - E) / (m - E)));
          }
          if (--l, t += 8 * (i + c) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var _o = null, go = null;
  function Ki(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function pd(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function bd(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function ho(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var vo = null;
  function g0() {
    var e = window.event;
    return e && e.type === "popstate" ? e === vo ? !1 : (vo = e, !0) : (vo = null, !1);
  }
  var Sd = typeof setTimeout == "function" ? setTimeout : void 0, h0 = typeof clearTimeout == "function" ? clearTimeout : void 0, Ed = typeof Promise == "function" ? Promise : void 0, v0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ed < "u" ? function(e) {
    return Ed.resolve(null).then(e).catch(y0);
  } : Sd;
  function y0(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function za(e) {
    return e === "head";
  }
  function xd(e, t) {
    var a = t, l = 0;
    do {
      var n = a.nextSibling;
      if (e.removeChild(a), n && n.nodeType === 8)
        if (a = n.data, a === "/$" || a === "/&") {
          if (l === 0) {
            e.removeChild(n), ql(t);
            return;
          }
          l--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&")
          l++;
        else if (a === "html")
          On(e.ownerDocument.documentElement);
        else if (a === "head") {
          a = e.ownerDocument.head, On(a);
          for (var i = a.firstChild; i; ) {
            var c = i.nextSibling, o = i.nodeName;
            i[Zl] || o === "SCRIPT" || o === "STYLE" || o === "LINK" && i.rel.toLowerCase() === "stylesheet" || a.removeChild(i), i = c;
          }
        } else
          a === "body" && On(e.ownerDocument.body);
      a = n;
    } while (a);
    ql(t);
  }
  function Nd(e, t) {
    var a = e;
    e = 0;
    do {
      var l = a.nextSibling;
      if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), l && l.nodeType === 8)
        if (a = l.data, a === "/$") {
          if (e === 0) break;
          e--;
        } else
          a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || e++;
      a = l;
    } while (a);
  }
  function yo(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var a = t;
      switch (t = t.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          yo(a), Ec(a);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(a);
    }
  }
  function p0(e, t, a, l) {
    for (; e.nodeType === 1; ) {
      var n = a;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[Zl])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (i = e.getAttribute("rel"), i === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (i !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (i = e.getAttribute("src"), (i !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && i && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var i = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === i)
          return e;
      } else return e;
      if (e = Ot(e.nextSibling), e === null) break;
    }
    return null;
  }
  function b0(e, t, a) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = Ot(e.nextSibling), e === null)) return null;
    return e;
  }
  function Ad(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Ot(e.nextSibling), e === null)) return null;
    return e;
  }
  function po(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function bo(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function S0(e, t) {
    var a = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || a.readyState !== "loading")
      t();
    else {
      var l = function() {
        t(), a.removeEventListener("DOMContentLoaded", l);
      };
      a.addEventListener("DOMContentLoaded", l), e._reactRetry = l;
    }
  }
  function Ot(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var So = null;
  function Md(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "/$" || a === "/&") {
          if (t === 0)
            return Ot(e.nextSibling);
          t--;
        } else
          a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function zd(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
          if (t === 0) return e;
          t--;
        } else a !== "/$" && a !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Td(e, t, a) {
    switch (t = Ki(a), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(r(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(r(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(r(454));
        return e;
      default:
        throw Error(r(451));
    }
  }
  function On(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Ec(e);
  }
  var jt = /* @__PURE__ */ new Map(), Cd = /* @__PURE__ */ new Set();
  function Zi(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var ca = w.d;
  w.d = {
    f: E0,
    r: x0,
    D: N0,
    C: A0,
    L: M0,
    m: z0,
    X: C0,
    S: T0,
    M: O0
  };
  function E0() {
    var e = ca.f(), t = Hi();
    return e || t;
  }
  function x0(e) {
    var t = il(e);
    t !== null && t.tag === 5 && t.type === "form" ? Xr(t) : ca.r(e);
  }
  var Bl = typeof document > "u" ? null : document;
  function Od(e, t, a) {
    var l = Bl;
    if (l && typeof t == "string" && t) {
      var n = xt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof a == "string" && (n += '[crossorigin="' + a + '"]'), Cd.has(n) || (Cd.add(n), e = { rel: e, crossOrigin: a, href: t }, l.querySelector(n) === null && (t = l.createElement("link"), Fe(t, "link", e), Ve(t), l.head.appendChild(t)));
    }
  }
  function N0(e) {
    ca.D(e), Od("dns-prefetch", e, null);
  }
  function A0(e, t) {
    ca.C(e, t), Od("preconnect", e, t);
  }
  function M0(e, t, a) {
    ca.L(e, t, a);
    var l = Bl;
    if (l && e && t) {
      var n = 'link[rel="preload"][as="' + xt(t) + '"]';
      t === "image" && a && a.imageSrcSet ? (n += '[imagesrcset="' + xt(
        a.imageSrcSet
      ) + '"]', typeof a.imageSizes == "string" && (n += '[imagesizes="' + xt(
        a.imageSizes
      ) + '"]')) : n += '[href="' + xt(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = Hl(e);
          break;
        case "script":
          i = Ll(e);
      }
      jt.has(i) || (e = U(
        {
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : e,
          as: t
        },
        a
      ), jt.set(i, e), l.querySelector(n) !== null || t === "style" && l.querySelector(jn(i)) || t === "script" && l.querySelector(Un(i)) || (t = l.createElement("link"), Fe(t, "link", e), Ve(t), l.head.appendChild(t)));
    }
  }
  function z0(e, t) {
    ca.m(e, t);
    var a = Bl;
    if (a && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + xt(l) + '"][href="' + xt(e) + '"]', i = n;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Ll(e);
      }
      if (!jt.has(i) && (e = U({ rel: "modulepreload", href: e }, t), jt.set(i, e), a.querySelector(n) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(Un(i)))
              return;
        }
        l = a.createElement("link"), Fe(l, "link", e), Ve(l), a.head.appendChild(l);
      }
    }
  }
  function T0(e, t, a) {
    ca.S(e, t, a);
    var l = Bl;
    if (l && e) {
      var n = cl(l).hoistableStyles, i = Hl(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var o = { loading: 0, preload: null };
        if (c = l.querySelector(
          jn(i)
        ))
          o.loading = 5;
        else {
          e = U(
            { rel: "stylesheet", href: e, "data-precedence": t },
            a
          ), (a = jt.get(i)) && Eo(e, a);
          var m = c = l.createElement("link");
          Ve(m), Fe(m, "link", e), m._p = new Promise(function(E, T) {
            m.onload = E, m.onerror = T;
          }), m.addEventListener("load", function() {
            o.loading |= 1;
          }), m.addEventListener("error", function() {
            o.loading |= 2;
          }), o.loading |= 4, Ji(c, t, l);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: o
        }, n.set(i, c);
      }
    }
  }
  function C0(e, t) {
    ca.X(e, t);
    var a = Bl;
    if (a && e) {
      var l = cl(a).hoistableScripts, n = Ll(e), i = l.get(n);
      i || (i = a.querySelector(Un(n)), i || (e = U({ src: e, async: !0 }, t), (t = jt.get(n)) && xo(e, t), i = a.createElement("script"), Ve(i), Fe(i, "link", e), a.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, l.set(n, i));
    }
  }
  function O0(e, t) {
    ca.M(e, t);
    var a = Bl;
    if (a && e) {
      var l = cl(a).hoistableScripts, n = Ll(e), i = l.get(n);
      i || (i = a.querySelector(Un(n)), i || (e = U({ src: e, async: !0, type: "module" }, t), (t = jt.get(n)) && xo(e, t), i = a.createElement("script"), Ve(i), Fe(i, "link", e), a.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, l.set(n, i));
    }
  }
  function jd(e, t, a, l) {
    var n = (n = le.current) ? Zi(n) : null;
    if (!n) throw Error(r(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Hl(a.href), a = cl(
          n
        ).hoistableStyles, l = a.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          e = Hl(a.href);
          var i = cl(
            n
          ).hoistableStyles, c = i.get(e);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, c), (i = n.querySelector(
            jn(e)
          )) && !i._p && (c.instance = i, c.state.loading = 5), jt.has(e) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, jt.set(e, a), i || j0(
            n,
            e,
            a,
            c.state
          ))), t && l === null)
            throw Error(r(528, ""));
          return c;
        }
        if (t && l !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ll(a), a = cl(
          n
        ).hoistableScripts, l = a.get(t), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, e));
    }
  }
  function Hl(e) {
    return 'href="' + xt(e) + '"';
  }
  function jn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Ud(e) {
    return U({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function j0(e, t, a, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), Fe(t, "link", a), Ve(t), e.head.appendChild(t));
  }
  function Ll(e) {
    return '[src="' + xt(e) + '"]';
  }
  function Un(e) {
    return "script[async]" + e;
  }
  function Dd(e, t, a) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + xt(a.href) + '"]'
          );
          if (l)
            return t.instance = l, Ve(l), l;
          var n = U({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), Ve(l), Fe(l, "style", n), Ji(l, a.precedence, e), t.instance = l;
        case "stylesheet":
          n = Hl(a.href);
          var i = e.querySelector(
            jn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, Ve(i), i;
          l = Ud(a), (n = jt.get(n)) && Eo(l, n), i = (e.ownerDocument || e).createElement("link"), Ve(i);
          var c = i;
          return c._p = new Promise(function(o, m) {
            c.onload = o, c.onerror = m;
          }), Fe(i, "link", l), t.state.loading |= 4, Ji(i, a.precedence, e), t.instance = i;
        case "script":
          return i = Ll(a.src), (n = e.querySelector(
            Un(i)
          )) ? (t.instance = n, Ve(n), n) : (l = a, (n = jt.get(i)) && (l = U({}, a), xo(l, n)), e = e.ownerDocument || e, n = e.createElement("script"), Ve(n), Fe(n, "link", l), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, Ji(l, a.precedence, e));
    return t.instance;
  }
  function Ji(e, t, a) {
    for (var l = a.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = l.length ? l[l.length - 1] : null, i = n, c = 0; c < l.length; c++) {
      var o = l[c];
      if (o.dataset.precedence === t) i = o;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(e, t.firstChild));
  }
  function Eo(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function xo(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var $i = null;
  function Rd(e, t, a) {
    if ($i === null) {
      var l = /* @__PURE__ */ new Map(), n = $i = /* @__PURE__ */ new Map();
      n.set(a, l);
    } else
      n = $i, l = n.get(a), l || (l = /* @__PURE__ */ new Map(), n.set(a, l));
    if (l.has(e)) return l;
    for (l.set(e, null), a = a.getElementsByTagName(e), n = 0; n < a.length; n++) {
      var i = a[n];
      if (!(i[Zl] || i[Ze] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = i.getAttribute(t) || "";
        c = e + c;
        var o = l.get(c);
        o ? o.push(i) : l.set(c, [i]);
      }
    }
    return l;
  }
  function wd(e, t, a) {
    e = e.ownerDocument || e, e.head.insertBefore(
      a,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function U0(e, t, a) {
    if (a === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        return t.rel === "stylesheet" ? (e = t.disabled, typeof t.precedence == "string" && e == null) : !0;
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Gd(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function D0(e, t, a, l) {
    if (a.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (a.state.loading & 4) === 0) {
      if (a.instance === null) {
        var n = Hl(l.href), i = t.querySelector(
          jn(n)
        );
        if (i) {
          t = i._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Wi.bind(e), t.then(e, e)), a.state.loading |= 4, a.instance = i, Ve(i);
          return;
        }
        i = t.ownerDocument || t, l = Ud(l), (n = jt.get(n)) && Eo(l, n), i = i.createElement("link"), Ve(i);
        var c = i;
        c._p = new Promise(function(o, m) {
          c.onload = o, c.onerror = m;
        }), Fe(i, "link", l), a.instance = i;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (e.count++, a = Wi.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
    }
  }
  var No = 0;
  function R0(e, t) {
    return e.stylesheets && e.count === 0 && Ii(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(a) {
      var l = setTimeout(function() {
        if (e.stylesheets && Ii(e, e.stylesheets), e.unsuspend) {
          var i = e.unsuspend;
          e.unsuspend = null, i();
        }
      }, 6e4 + t);
      0 < e.imgBytes && No === 0 && (No = 62500 * _0());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Ii(e, e.stylesheets), e.unsuspend)) {
            var i = e.unsuspend;
            e.unsuspend = null, i();
          }
        },
        (e.imgBytes > No ? 50 : 800) + t
      );
      return e.unsuspend = a, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(n);
      };
    } : null;
  }
  function Wi() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Ii(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Fi = null;
  function Ii(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Fi = /* @__PURE__ */ new Map(), t.forEach(w0, e), Fi = null, Wi.call(e));
  }
  function w0(e, t) {
    if (!(t.state.loading & 4)) {
      var a = Fi.get(e);
      if (a) var l = a.get(null);
      else {
        a = /* @__PURE__ */ new Map(), Fi.set(e, a);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (a.set(c.dataset.precedence, c), l = c);
        }
        l && a.set(null, l);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), i = a.get(c) || l, i === l && a.set(null, n), a.set(c, n), this.count++, l = Wi.bind(this), n.addEventListener("load", l), n.addEventListener("error", l), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Dn = {
    $$typeof: te,
    Provider: null,
    Consumer: null,
    _currentValue: K,
    _currentValue2: K,
    _threadCount: 0
  };
  function G0(e, t, a, l, n, i, c, o, m) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = yc(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = yc(0), this.hiddenUpdates = yc(null), this.identifierPrefix = l, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = m, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Bd(e, t, a, l, n, i, c, o, m, E, T, D) {
    return e = new G0(
      e,
      t,
      a,
      c,
      m,
      E,
      T,
      D,
      o
    ), t = 1, i === !0 && (t |= 24), i = ht(3, null, null, t), e.current = i, i.stateNode = e, t = au(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: l,
      isDehydrated: a,
      cache: t
    }, cu(i), e;
  }
  function Hd(e) {
    return e ? (e = hl, e) : hl;
  }
  function Ld(e, t, a, l, n, i) {
    n = Hd(n), l.context === null ? l.context = n : l.pendingContext = n, l = ha(t), l.payload = { element: a }, i = i === void 0 ? null : i, i !== null && (l.callback = i), a = va(e, l, t), a !== null && (ft(a, e, t), fn(a, e, t));
  }
  function qd(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var a = e.retryLane;
      e.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function Ao(e, t) {
    qd(e, t), (e = e.alternate) && qd(e, t);
  }
  function Yd(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = qa(e, 67108864);
      t !== null && ft(t, e, 67108864), Ao(e, 67108864);
    }
  }
  function kd(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = St();
      t = pc(t);
      var a = qa(e, t);
      a !== null && ft(a, e, t), Ao(e, t);
    }
  }
  var Pi = !0;
  function B0(e, t, a, l) {
    var n = z.T;
    z.T = null;
    var i = w.p;
    try {
      w.p = 2, Mo(e, t, a, l);
    } finally {
      w.p = i, z.T = n;
    }
  }
  function H0(e, t, a, l) {
    var n = z.T;
    z.T = null;
    var i = w.p;
    try {
      w.p = 8, Mo(e, t, a, l);
    } finally {
      w.p = i, z.T = n;
    }
  }
  function Mo(e, t, a, l) {
    if (Pi) {
      var n = zo(l);
      if (n === null)
        fo(
          e,
          t,
          l,
          ec,
          a
        ), Qd(e, l);
      else if (q0(
        n,
        e,
        t,
        a,
        l
      ))
        l.stopPropagation();
      else if (Qd(e, l), t & 4 && -1 < L0.indexOf(e)) {
        for (; n !== null; ) {
          var i = il(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var c = wa(i.pendingLanes);
                  if (c !== 0) {
                    var o = i;
                    for (o.pendingLanes |= 2, o.entangledLanes |= 2; c; ) {
                      var m = 1 << 31 - _t(c);
                      o.entanglements[1] |= m, c &= ~m;
                    }
                    Yt(i), (he & 6) === 0 && (Gi = dt() + 500, zn(0));
                  }
                }
                break;
              case 31:
              case 13:
                o = qa(i, 2), o !== null && ft(o, i, 2), Hi(), Ao(i, 2);
            }
          if (i = zo(l), i === null && fo(
            e,
            t,
            l,
            ec,
            a
          ), i === n) break;
          n = i;
        }
        n !== null && l.stopPropagation();
      } else
        fo(
          e,
          t,
          l,
          null,
          a
        );
    }
  }
  function zo(e) {
    return e = Tc(e), To(e);
  }
  var ec = null;
  function To(e) {
    if (ec = null, e = nl(e), e !== null) {
      var t = b(e);
      if (t === null) e = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (e = M(t), e !== null) return e;
          e = null;
        } else if (a === 31) {
          if (e = C(t), e !== null) return e;
          e = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ec = e, null;
  }
  function Vd(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Nm()) {
          case Wo:
            return 2;
          case Fo:
            return 8;
          case Vn:
          case Am:
            return 32;
          case Io:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Co = !1, Ta = null, Ca = null, Oa = null, Rn = /* @__PURE__ */ new Map(), wn = /* @__PURE__ */ new Map(), ja = [], L0 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Qd(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ta = null;
        break;
      case "dragenter":
      case "dragleave":
        Ca = null;
        break;
      case "mouseover":
      case "mouseout":
        Oa = null;
        break;
      case "pointerover":
      case "pointerout":
        Rn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        wn.delete(t.pointerId);
    }
  }
  function Gn(e, t, a, l, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: a,
      eventSystemFlags: l,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = il(t), t !== null && Yd(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function q0(e, t, a, l, n) {
    switch (t) {
      case "focusin":
        return Ta = Gn(
          Ta,
          e,
          t,
          a,
          l,
          n
        ), !0;
      case "dragenter":
        return Ca = Gn(
          Ca,
          e,
          t,
          a,
          l,
          n
        ), !0;
      case "mouseover":
        return Oa = Gn(
          Oa,
          e,
          t,
          a,
          l,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return Rn.set(
          i,
          Gn(
            Rn.get(i) || null,
            e,
            t,
            a,
            l,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, wn.set(
          i,
          Gn(
            wn.get(i) || null,
            e,
            t,
            a,
            l,
            n
          )
        ), !0;
    }
    return !1;
  }
  function Xd(e) {
    var t = nl(e.target);
    if (t !== null) {
      var a = b(t);
      if (a !== null) {
        if (t = a.tag, t === 13) {
          if (t = M(a), t !== null) {
            e.blockedOn = t, ns(e.priority, function() {
              kd(a);
            });
            return;
          }
        } else if (t === 31) {
          if (t = C(a), t !== null) {
            e.blockedOn = t, ns(e.priority, function() {
              kd(a);
            });
            return;
          }
        } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function tc(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var a = zo(e.nativeEvent);
      if (a === null) {
        a = e.nativeEvent;
        var l = new a.constructor(
          a.type,
          a
        );
        zc = l, a.target.dispatchEvent(l), zc = null;
      } else
        return t = il(a), t !== null && Yd(t), e.blockedOn = a, !1;
      t.shift();
    }
    return !0;
  }
  function Kd(e, t, a) {
    tc(e) && a.delete(t);
  }
  function Y0() {
    Co = !1, Ta !== null && tc(Ta) && (Ta = null), Ca !== null && tc(Ca) && (Ca = null), Oa !== null && tc(Oa) && (Oa = null), Rn.forEach(Kd), wn.forEach(Kd);
  }
  function ac(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Co || (Co = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      Y0
    )));
  }
  var lc = null;
  function Zd(e) {
    lc !== e && (lc = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        lc === e && (lc = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t], l = e[t + 1], n = e[t + 2];
          if (typeof l != "function") {
            if (To(l || a) === null)
              continue;
            break;
          }
          var i = il(a);
          i !== null && (e.splice(t, 3), t -= 3, Mu(
            i,
            {
              pending: !0,
              data: n,
              method: a.method,
              action: l
            },
            l,
            n
          ));
        }
      }
    ));
  }
  function ql(e) {
    function t(m) {
      return ac(m, e);
    }
    Ta !== null && ac(Ta, e), Ca !== null && ac(Ca, e), Oa !== null && ac(Oa, e), Rn.forEach(t), wn.forEach(t);
    for (var a = 0; a < ja.length; a++) {
      var l = ja[a];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < ja.length && (a = ja[0], a.blockedOn === null); )
      Xd(a), a.blockedOn === null && ja.shift();
    if (a = (e.ownerDocument || e).$$reactFormReplay, a != null)
      for (l = 0; l < a.length; l += 3) {
        var n = a[l], i = a[l + 1], c = n[it] || null;
        if (typeof i == "function")
          c || Zd(a);
        else if (c) {
          var o = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, c = i[it] || null)
              o = c.formAction;
            else if (To(n) !== null) continue;
          } else o = c.action;
          typeof o == "function" ? a[l + 1] = o : (a.splice(l, 3), l -= 3), Zd(a);
        }
      }
  }
  function Jd() {
    function e(i) {
      i.canIntercept && i.info === "react-transition" && i.intercept({
        handler: function() {
          return new Promise(function(c) {
            return n = c;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      n !== null && (n(), n = null), l || setTimeout(a, 20);
    }
    function a() {
      if (!l && !navigation.transition) {
        var i = navigation.currentEntry;
        i && i.url != null && navigation.navigate(i.url, {
          state: i.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1, n = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
        l = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function Oo(e) {
    this._internalRoot = e;
  }
  nc.prototype.render = Oo.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(r(409));
    var a = t.current, l = St();
    Ld(a, l, e, t, null, null);
  }, nc.prototype.unmount = Oo.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Ld(e.current, 2, null, e, null, null), Hi(), t[ll] = null;
    }
  };
  function nc(e) {
    this._internalRoot = e;
  }
  nc.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = ls();
      e = { blockedOn: null, target: e, priority: t };
      for (var a = 0; a < ja.length && t !== 0 && t < ja[a].priority; a++) ;
      ja.splice(a, 0, e), a === 0 && Xd(e);
    }
  };
  var $d = f.version;
  if ($d !== "19.2.3")
    throw Error(
      r(
        527,
        $d,
        "19.2.3"
      )
    );
  w.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(r(188)) : (e = Object.keys(e).join(","), Error(r(268, e)));
    return e = h(t), e = e !== null ? N(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var k0 = {
    bundleType: 0,
    version: "19.2.3",
    rendererPackageName: "react-dom",
    currentDispatcherRef: z,
    reconcilerVersion: "19.2.3"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ic = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ic.isDisabled && ic.supportsFiber)
      try {
        Ql = ic.inject(
          k0
        ), mt = ic;
      } catch {
      }
  }
  return Hn.createRoot = function(e, t) {
    if (!p(e)) throw Error(r(299));
    var a = !1, l = "", n = tf, i = af, c = lf;
    return t != null && (t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = Bd(
      e,
      1,
      !1,
      null,
      null,
      a,
      l,
      null,
      n,
      i,
      c,
      Jd
    ), e[ll] = t.current, ro(e), new Oo(t);
  }, Hn.hydrateRoot = function(e, t, a) {
    if (!p(e)) throw Error(r(299));
    var l = !1, n = "", i = tf, c = af, o = lf, m = null;
    return a != null && (a.unstable_strictMode === !0 && (l = !0), a.identifierPrefix !== void 0 && (n = a.identifierPrefix), a.onUncaughtError !== void 0 && (i = a.onUncaughtError), a.onCaughtError !== void 0 && (c = a.onCaughtError), a.onRecoverableError !== void 0 && (o = a.onRecoverableError), a.formState !== void 0 && (m = a.formState)), t = Bd(
      e,
      1,
      !0,
      t,
      a ?? null,
      l,
      n,
      m,
      i,
      c,
      o,
      Jd
    ), t.context = Hd(null), a = t.current, l = St(), l = pc(l), n = ha(l), n.callback = null, va(a, n, l), a = l, t.current.lanes = a, Kl(t, a), Yt(t), e[ll] = t.current, ro(e), new nc(t);
  }, Hn.version = "19.2.3", Hn;
}
var im;
function P0() {
  if (im) return Do.exports;
  im = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (f) {
        console.error(f);
      }
  }
  return u(), Do.exports = I0(), Do.exports;
}
var eg = P0();
const tg = /* @__PURE__ */ dm(eg);
const mm = (...u) => u.filter((f, d, r) => !!f && f.trim() !== "" && r.indexOf(f) === d).join(" ").trim();
const ag = (u) => u.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const lg = (u) => u.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (f, d, r) => r ? r.toUpperCase() : d.toLowerCase()
);
const cm = (u) => {
  const f = lg(u);
  return f.charAt(0).toUpperCase() + f.slice(1);
};
var ng = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const ig = (u) => {
  for (const f in u)
    if (f.startsWith("aria-") || f === "role" || f === "title")
      return !0;
  return !1;
};
const cg = V.forwardRef(
  ({
    color: u = "currentColor",
    size: f = 24,
    strokeWidth: d = 2,
    absoluteStrokeWidth: r,
    className: p = "",
    children: b,
    iconNode: M,
    ...C
  }, y) => V.createElement(
    "svg",
    {
      ref: y,
      ...ng,
      width: f,
      height: f,
      stroke: u,
      strokeWidth: r ? Number(d) * 24 / Number(f) : d,
      className: mm("lucide", p),
      ...!b && !ig(C) && { "aria-hidden": "true" },
      ...C
    },
    [
      ...M.map(([h, N]) => V.createElement(h, N)),
      ...Array.isArray(b) ? b : [b]
    ]
  )
);
const P = (u, f) => {
  const d = V.forwardRef(
    ({ className: r, ...p }, b) => V.createElement(cg, {
      ref: b,
      iconNode: f,
      className: mm(
        `lucide-${ag(cm(u))}`,
        `lucide-${u}`,
        r
      ),
      ...p
    })
  );
  return d.displayName = cm(u), d;
};
const ug = [
  [
    "path",
    {
      d: "M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
      key: "67vhrh"
    }
  ],
  ["path", { d: "M4 9v6", key: "bns7oa" }]
], og = P("arrow-big-right-dash", ug);
const sg = [
  ["path", { d: "m11 7-3 5h4l-3 5", key: "b4a64w" }],
  ["path", { d: "M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935", key: "lre1cr" }],
  ["path", { d: "M22 14v-4", key: "14q9d5" }],
  ["path", { d: "M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936", key: "13q5k0" }]
];
P("battery-charging", sg);
const rg = [
  ["path", { d: "M10 10v4", key: "1mb2ec" }],
  ["path", { d: "M14 10v4", key: "1nt88p" }],
  ["path", { d: "M22 14v-4", key: "14q9d5" }],
  ["path", { d: "M6 10v4", key: "1n77qd" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
], fg = P("battery-full", rg);
const dg = [
  ["path", { d: "M22 14v-4", key: "14q9d5" }],
  ["path", { d: "M6 14v-4", key: "14a6bd" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
], mg = P("battery-low", dg);
const _g = [
  ["path", { d: "M10 14v-4", key: "suye4c" }],
  ["path", { d: "M22 14v-4", key: "14q9d5" }],
  ["path", { d: "M6 14v-4", key: "14a6bd" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
], gg = P("battery-medium", _g);
const hg = [
  ["path", { d: "M 22 14 L 22 10", key: "nqc4tb" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
], vg = P("battery", hg);
const yg = [
  [
    "path",
    {
      d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
      key: "oz39mx"
    }
  ]
], pg = P("bookmark", yg);
const bg = [
  ["path", { d: "M12 18V5", key: "adv99a" }],
  ["path", { d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4", key: "1e3is1" }],
  ["path", { d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5", key: "1gqd8o" }],
  ["path", { d: "M17.997 5.125a4 4 0 0 1 2.526 5.77", key: "iwvgf7" }],
  ["path", { d: "M18 18a4 4 0 0 0 2-7.464", key: "efp6ie" }],
  ["path", { d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517", key: "1gq6am" }],
  ["path", { d: "M6 18a4 4 0 0 1-2-7.464", key: "k1g0md" }],
  ["path", { d: "M6.003 5.125a4 4 0 0 0-2.526 5.77", key: "q97ue3" }]
], Sg = P("brain", bg);
const Eg = [
  ["path", { d: "m16 22-1-4", key: "1ow2iv" }],
  [
    "path",
    {
      d: "M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1",
      key: "11gii7"
    }
  ],
  ["path", { d: "M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z", key: "bju7h4" }],
  ["path", { d: "m8 22 1-4", key: "s3unb" }]
], Yo = P("brush-cleaning", Eg);
const xg = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Ng = P("chevron-down", xg);
const Ag = [
  [
    "path",
    {
      d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
      key: "kmsa83"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
], Mg = P("circle-play", Ag);
const zg = [
  [
    "path",
    {
      d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
      key: "c7niix"
    }
  ]
], ko = P("droplet", zg);
const Tg = [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
], Cg = P("gauge", Tg);
const Og = [
  [
    "path",
    {
      d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
      key: "11za1p"
    }
  ],
  ["path", { d: "m16 19 2 2 4-4", key: "1b14m6" }]
], jg = P("grid-2x2-check", Og);
const Ug = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], Dg = P("history", Ug);
const Rg = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
], wg = P("info", Rg);
const Gg = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
], Bg = P("layers", Gg);
const Hg = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
], Lg = P("map-pin", Hg);
const qg = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
], Yg = P("map", qg);
const kg = [
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
      key: "2d38gg"
    }
  ],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
], Vg = P("octagon-x", kg);
const Qg = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "m15 8-3 3-3-3", key: "1oxy1z" }]
], Xg = P("panel-bottom-close", Qg);
const Kg = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
], Zg = P("pause", Kg);
const Jg = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
], $g = P("play", Jg);
const Wg = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Fg = P("plus", Wg);
const Ig = [
  ["circle", { cx: "6", cy: "19", r: "3", key: "1kj8tv" }],
  ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15", key: "1d8sl" }],
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }]
], Pg = P("route", Ig);
const eh = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }]
], _m = P("scan", eh);
const th = [
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["path", { d: "M19 7h-9", key: "6i9tg" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
], ah = P("settings-2", th);
const lh = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], nh = P("settings", lh);
const ih = [
  [
    "path",
    {
      d: "M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44",
      key: "1cn552"
    }
  ]
], ch = P("shell", ih);
const uh = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }],
  ["path", { d: "M17 20V8", key: "1tkaf5" }]
], oh = P("signal-high", uh);
const sh = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }]
], rh = P("signal-low", sh);
const fh = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }]
], dh = P("signal-medium", fh);
const mh = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }],
  ["path", { d: "M17 20V8", key: "1tkaf5" }],
  ["path", { d: "M22 4v16", key: "sih9yq" }]
], _h = P("signal", mh);
const gh = [
  [
    "path",
    {
      d: "M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "1ystz2"
    }
  ],
  ["path", { d: "M3 4v16", key: "1ph11n" }]
], hh = P("step-forward", gh);
const vh = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
], yh = P("timer", vh);
const ph = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
], gm = P("volume-2", ph);
const bh = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
], Sh = P("volume-x", bh);
const Eh = [
  ["path", { d: "M12 10L12 2", key: "jvb0aw" }],
  ["path", { d: "M16 6L12 10L8 6", key: "9j6vje" }],
  [
    "path",
    {
      d: "M2 15C2.6 15.5 3.2 16 4.5 16C7 16 7 14 9.5 14C12.1 14 11.9 16 14.5 16C17 16 17 14 19.5 14C20.8 14 21.4 14.5 22 15",
      key: "s2zepw"
    }
  ],
  [
    "path",
    {
      d: "M2 21C2.6 21.5 3.2 22 4.5 22C7 22 7 20 9.5 20C12.1 20 11.9 22 14.5 22C17 22 17 20 19.5 20C20.8 20 21.4 20.5 22 21",
      key: "u68omc"
    }
  ]
], xh = P("waves-arrow-down", Eh);
const Nh = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
], Ah = P("zap", Nh), Mh = /* @__PURE__ */ s.jsx(vg, {}), zh = /* @__PURE__ */ s.jsx(mg, {}), Th = /* @__PURE__ */ s.jsx(gg, {}), Ch = /* @__PURE__ */ s.jsx(fg, {}), Oh = /* @__PURE__ */ s.jsx(Dg, {}), jh = /* @__PURE__ */ s.jsx(_m, {}), Uh = /* @__PURE__ */ s.jsx($g, {}), Dh = /* @__PURE__ */ s.jsx(Zg, {}), Rh = /* @__PURE__ */ s.jsx(hh, {}), wh = /* @__PURE__ */ s.jsx(Vg, {}), Gh = /* @__PURE__ */ s.jsx(Xg, {}), Bh = /* @__PURE__ */ s.jsx(pg, {}), Hh = /* @__PURE__ */ s.jsx(Mg, {}), hm = /* @__PURE__ */ s.jsx(Yo, {}), vm = /* @__PURE__ */ s.jsx(ko, {}), oc = /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
  /* @__PURE__ */ s.jsx(Yo, {}),
  /* @__PURE__ */ s.jsx(Fg, {}),
  /* @__PURE__ */ s.jsx(ko, {})
] }), Vo = /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
  /* @__PURE__ */ s.jsx(Yo, {}),
  /* @__PURE__ */ s.jsx(og, {}),
  /* @__PURE__ */ s.jsx(ko, {})
] }), Lh = /* @__PURE__ */ s.jsx(rh, {}), qh = /* @__PURE__ */ s.jsx(dh, {}), Yh = /* @__PURE__ */ s.jsx(oh, {}), kh = /* @__PURE__ */ s.jsx(_h, {}), Vh = /* @__PURE__ */ s.jsx(_m, {}), Qh = /* @__PURE__ */ s.jsx(yh, {}), Xh = /* @__PURE__ */ s.jsx(jg, {}), Kh = /* @__PURE__ */ s.jsx(Ah, {}), Zh = /* @__PURE__ */ s.jsx(Pg, {}), Jh = /* @__PURE__ */ s.jsx(ch, {}), $h = /* @__PURE__ */ s.jsx(xh, {}), Ln = {
  WETNESS: {
    MIN: 1,
    MAX: 32
  }
}, Yl = {
  SELECT: "select",
  SWITCH: "switch",
  NUMBER: "number",
  VACUUM: "vacuum",
  LAWN_MOWER: "lawn_mower",
  DREAME_VACUUM: "dreame_vacuum"
}, Pa = {
  SELECT_OPTION: "select_option",
  TURN_ON: "turn_on",
  TURN_OFF: "turn_off",
  SET_VALUE: "set_value",
  START: "start",
  START_MOWING: "start_mowing",
  PAUSE: "pause",
  DOCK: "dock",
  RETURN_TO_BASE: "return_to_base",
  VACUUM_CLEAN_SEGMENT: "vacuum_clean_segment"
}, Gt = {
  CLEANING_MODE: "cleaning_mode",
  CLEANGENIUS_MODE: "cleangenius_mode",
  CLEANGENIUS: "cleangenius",
  SUCTION_LEVEL: "suction_level",
  CLEANING_ROUTE: "cleaning_route",
  MAX_SUCTION_POWER: "max_suction_power",
  CUSTOM_MOPPING_MODE: "custom_mopping_mode",
  WETNESS_LEVEL: "wetness_level",
  SELF_CLEAN_FREQUENCY: "self_clean_frequency",
  SELF_CLEAN_AREA: "self_clean_area",
  SELF_CLEAN_TIME: "self_clean_time"
}, Re = {
  SWEEPING: "Sweeping",
  MOPPING: "Mopping",
  SWEEPING_AND_MOPPING: "Sweeping and mopping",
  MOPPING_AFTER_SWEEPING: "Mopping after sweeping"
}, ua = {
  VACUUM_AND_MOP: "Vacuum and mop",
  MOP_AFTER_VACUUM: "Mop after vacuum"
}, kt = {
  OFF: "Off",
  ROUTINE_CLEANING: "Routine cleaning",
  DEEP_CLEANING: "Deep cleaning"
}, Ut = {
  CLEANING_MODE: {
    SWEEPING: "sweeping",
    MOPPING: "mopping",
    SWEEPING_AND_MOPPING: "sweeping_and_mopping",
    MOPPING_AFTER_SWEEPING: "mopping_after_sweeping"
  },
  CLEANGENIUS_MODE: {
    VACUUM_AND_MOP: "vacuum_and_mop",
    MOP_AFTER_VACUUM: "mop_after_vacuum"
  },
  CLEANGENIUS: {
    OFF: "off",
    ROUTINE_CLEANING: "routine_cleaning",
    DEEP_CLEANING: "deep_cleaning"
  },
  SELF_CLEAN_FREQUENCY: {
    BY_AREA: "by_area",
    BY_TIME: "by_time",
    BY_ROOM: "by_room"
  }
}, al = {
  BY_AREA: "By area",
  BY_TIME: "By time",
  BY_ROOM: "By room"
}, Da = {
  QUIET: "Quiet",
  SILENT: "Silent",
  STANDARD: "Standard",
  STRONG: "Strong",
  TURBO: "Turbo"
}, tl = {
  QUICK: "Quick",
  STANDARD: "Standard",
  INTENSIVE: "Intensive",
  DEEP: "Deep"
}, uc = {
  SLIGHTLY_DRY: "Slightly dry",
  MOIST: "Moist",
  WET: "Wet"
}, Wh = {
  ALL: "all"
}, qn = {
  CLEANGENIUS: "CleanGenius",
  CUSTOM: "Custom"
}, lt = {
  MODE: Wh.ALL,
  CLEANING_MODE: Re.SWEEPING_AND_MOPPING,
  CLEANGENIUS_MODE: ua.VACUUM_AND_MOP,
  SUCTION_LEVEL: Da.STANDARD,
  WETNESS_LEVEL: 20,
  CLEANING_ROUTE: tl.STANDARD,
  MAX_SUCTION_POWER: !1,
  SELF_CLEAN_AREA: 20,
  SELF_CLEAN_FREQUENCY: al.BY_AREA,
  MOP_PAD_HUMIDITY: uc.MOIST,
  SELF_CLEAN_AREA_MIN: 10,
  SELF_CLEAN_AREA_MAX: 35,
  SELF_CLEAN_TIME: 25,
  SELF_CLEAN_TIME_MIN: 10,
  SELF_CLEAN_TIME_MAX: 50
};
function Fh(u) {
  switch (u) {
    case Re.SWEEPING:
      return Ut.CLEANING_MODE.SWEEPING;
    case Re.MOPPING:
      return Ut.CLEANING_MODE.MOPPING;
    case Re.SWEEPING_AND_MOPPING:
      return Ut.CLEANING_MODE.SWEEPING_AND_MOPPING;
    case Re.MOPPING_AFTER_SWEEPING:
      return Ut.CLEANING_MODE.MOPPING_AFTER_SWEEPING;
    default:
      return u;
  }
}
function Ih(u) {
  switch (u) {
    case ua.VACUUM_AND_MOP:
      return Ut.CLEANGENIUS_MODE.VACUUM_AND_MOP;
    case ua.MOP_AFTER_VACUUM:
      return Ut.CLEANGENIUS_MODE.MOP_AFTER_VACUUM;
    default:
      return u;
  }
}
function sc(u) {
  switch (u) {
    case kt.OFF:
      return Ut.CLEANGENIUS.OFF;
    case kt.ROUTINE_CLEANING:
      return Ut.CLEANGENIUS.ROUTINE_CLEANING;
    case kt.DEEP_CLEANING:
      return Ut.CLEANGENIUS.DEEP_CLEANING;
    default:
      return u;
  }
}
function Ph(u) {
  switch (u) {
    case al.BY_AREA:
      return Ut.SELF_CLEAN_FREQUENCY.BY_AREA;
    case al.BY_TIME:
      return Ut.SELF_CLEAN_FREQUENCY.BY_TIME;
    case al.BY_ROOM:
      return Ut.SELF_CLEAN_FREQUENCY.BY_ROOM;
    default:
      return u;
  }
}
function rc(u) {
  return u.toLowerCase();
}
function kl(u, f) {
  return `select.${u}_${f}`;
}
function um(u, f) {
  return `switch.${u}_${f}`;
}
function Bo(u, f) {
  return `number.${u}_${f}`;
}
function ym(u) {
  return u.replace(/^[a-z_]+\./, "");
}
function e1(u) {
  switch (u) {
    case Re.SWEEPING_AND_MOPPING:
      return "Vac & Mop";
    case Re.MOPPING_AFTER_SWEEPING:
      return "Mop after Vac";
    case Re.SWEEPING:
      return "Vac";
    case Re.MOPPING:
      return "Mop";
    default:
      return u;
  }
}
function t1(u) {
  switch (u) {
    case ua.VACUUM_AND_MOP:
      return "Vac & Mop";
    case ua.MOP_AFTER_VACUUM:
      return "Mop after Vac";
    default:
      return u;
  }
}
function a1(u) {
  return u === Da.STRONG || u.includes("Strong") ? "Turbo" : u === Da.TURBO || u.includes("Turbo") ? "Max" : u;
}
function l1(u) {
  switch (u) {
    case Re.SWEEPING:
      return hm;
    case Re.MOPPING:
      return vm;
    case Re.SWEEPING_AND_MOPPING:
      return oc;
    case Re.MOPPING_AFTER_SWEEPING:
      return Vo;
    default:
      return "";
  }
}
function n1(u) {
  switch (u) {
    case ua.VACUUM_AND_MOP:
      return oc;
    case ua.MOP_AFTER_VACUUM:
      return Vo;
    default:
      return "";
  }
}
function i1(u) {
  switch (u) {
    case Da.QUIET:
    case Da.SILENT:
      return Lh;
    case Da.STANDARD:
      return qh;
    case Da.STRONG:
      return Yh;
    case Da.TURBO:
      return kh;
  }
}
function c1(u) {
  switch (u) {
    case tl.QUICK:
      return Kh;
    case tl.STANDARD:
      return Zh;
    case tl.INTENSIVE:
      return Jh;
    case tl.DEEP:
      return $h;
  }
}
function u1(u) {
  switch (u) {
    case al.BY_AREA:
      return Vh;
    case al.BY_TIME:
      return Qh;
    case al.BY_ROOM:
      return Xh;
    default:
      return "⚙️";
  }
}
function ae(u, f) {
  return typeof u == typeof f ? u : f;
}
function pm(u) {
  return typeof u == "string";
}
function Bt(u) {
  return typeof u == "number";
}
function Qo(u) {
  return typeof u == "boolean";
}
function o1(u) {
  return typeof u == "object" && u !== null;
}
function a2(u, f) {
  if (f.map_entity) return f.map_entity;
  const d = f.entity.split(".")[1];
  const r = [`camera.${d}`, `camera.${d}_carte`, `camera.${d}_map`];
  for (const p of r) {
    if (u.states[p]) return p;
  }
  return r[0];
}
function s1(u, f, w) {
  if (!u)
    return null;
  const d = u.attributes?.friendly_name || f.title || "Dreame Vacuum", r = w ? a2(w, f) : (f.map_entity || `camera.${f.entity.split(".")[1]}`), p = u.attributes?.rooms?.[u.attributes?.selected_map || ""], b = p ? p.map((M) => ({
    id: M.id,
    name: M.name,
    x: 50,
    y: 50,
    icon: M.icon
  })) : [];
  return {
    deviceName: d,
    mapEntityId: r,
    rooms: b
  };
}
function r1(u, f) {
  const d = ae(u.attributes.status, ""), r = u.attributes.segment_cleaning || !1, p = u.attributes.zone_cleaning || !1;
  if (u.attributes.started) {
    if (r || d.toLowerCase().includes("room"))
      return "room";
    if (p || d.toLowerCase().includes("zone"))
      return "zone";
  }
  return f;
}
function om(u, f, d) {
  const r = d.scale || 1, p = d.padding || [0, 0, 0, 0], b = d.crop || [0, 0, 0, 0], M = d.left, C = d.top, y = d.height, h = d.grid_size, N = (u + b[0] - p[0]) / r * h + M, U = C + (y * h - 1) - (f + b[1] - p[1]) / r * h;
  return { x: Math.round(N), y: Math.round(U) };
}
function f1(u, f, d, r) {
  const p = _1(f);
  if (!p) {
    const U = m1(f);
    return d1(u, U, d, r);
  }
  const b = u.x1 / 100 * d, M = u.y1 / 100 * r, C = u.x2 / 100 * d, y = u.y2 / 100 * r, h = om(b, M, p), N = om(C, y, p);
  return {
    x1: h.x,
    y1: h.y,
    x2: N.x,
    y2: N.y
  };
}
function d1(u, f, d, r) {
  if (!f || f.length < 3)
    return {
      x1: Math.round(u.x1 / 100 * 12e3 - 6e3),
      y1: Math.round(u.y1 / 100 * 12e3 - 6e3),
      x2: Math.round(u.x2 / 100 * 12e3 - 6e3),
      y2: Math.round(u.y2 / 100 * 12e3 - 6e3)
    };
  const p = u.x1 / 100 * d, b = u.y1 / 100 * r, M = u.x2 / 100 * d, C = u.y2 / 100 * r, y = f[0], h = f[1], N = f[2], U = (h.vacuum.x - y.vacuum.x) / (h.map.x - y.map.x || 1), L = (N.vacuum.y - y.vacuum.y) / (N.map.y - y.map.y || 1), B = Math.round(y.vacuum.x + (p - y.map.x) * U), R = Math.round(y.vacuum.y + (b - y.map.y) * L), X = Math.round(y.vacuum.x + (M - y.map.x) * U), oe = Math.round(y.vacuum.y + (C - y.map.y) * L);
  return {
    x1: B,
    y1: R,
    x2: X,
    y2: oe
  };
}
function m1(u) {
  const f = u?.attributes?.calibration_points;
  return !f || !Array.isArray(f) || f.length < 3 ? null : f.map((d) => {
    const r = d;
    return {
      vacuum: { x: r.vacuum?.x ?? 0, y: r.vacuum?.y ?? 0 },
      map: { x: r.map?.x ?? 0, y: r.map?.y ?? 0 }
    };
  });
}
function _1(u) {
  const f = u?.attributes;
  if (!f)
    return null;
  const d = Bt(f.top) ? f.top : void 0, r = Bt(f.left) ? f.left : void 0, p = Bt(f.height) ? f.height : void 0, b = Bt(f.width) ? f.width : void 0, M = Bt(f.grid_size) ? f.grid_size : void 0;
  if (d !== void 0 && r !== void 0 && p && b && M) {
    const C = Bt(f.scale) ? f.scale : 1, y = Array.isArray(f.padding) ? f.padding : [0, 0, 0, 0], h = Array.isArray(f.crop) ? f.crop : [0, 0, 0, 0];
    return {
      top: d,
      left: r,
      height: p,
      width: b,
      grid_size: M,
      scale: C,
      padding: y,
      crop: h
    };
  }
  return null;
}
function g1(u, f) {
  const d = u.states[f];
  if (!d?.attributes?.rooms)
    return [];
  const r = d.attributes.rooms;
  return Object.values(r).map((p) => ({
    id: p.room_id,
    name: p.name,
    icon: p.icon,
    visibility: p.visibility,
    x0: p.x0,
    y0: p.y0,
    x1: p.x1,
    y1: p.y1,
    x: p.x,
    y: p.y
  }));
}
function cc(u, f, d, r, p) {
  if (!d || d.length < 3) {
    const B = (u + 1e4) / 2e4, R = (f + 1e4) / 2e4;
    return {
      x: B * r,
      y: R * p
    };
  }
  const b = d[0], M = d[1], C = d[2], y = (M.map.x - b.map.x) / (M.vacuum.x - b.vacuum.x || 1), h = (C.map.y - b.map.y) / (C.vacuum.y - b.vacuum.y || 1), N = b.map.x + (u - b.vacuum.x) * y, U = b.map.y + (f - b.vacuum.y) * h;
  return { x: N, y: U };
}
function h1(u, f, d, r) {
  if (u.x0 === void 0 || u.y0 === void 0 || u.x1 === void 0 || u.y1 === void 0)
    return console.warn("Room missing coordinates:", u), "";
  const p = cc(u.x0, u.y0, f, d, r), b = cc(u.x1, u.y0, f, d, r), M = cc(u.x1, u.y1, f, d, r), C = cc(u.x0, u.y1, f, d, r);
  return `M ${p.x} ${p.y} L ${b.x} ${b.y} L ${M.x} ${M.y} L ${C.x} ${C.y} Z`;
}
function v1({ entity: u, deviceName: f, onSettingsClick: d }) {
  const r = ae(u.attributes.status, u.state), p = ae(u.attributes.cleaned_area, 0), b = ae(u.attributes.cleaning_time, 0), M = ae(u.attributes.battery, 0), C = () => {
    const N = u.attributes.battery;
    return Bt(N) ? N >= 80 ? Ch : N >= 60 ? Th : N >= 20 ? zh : Mh : null;
  }, y = ae(u.attributes.cleaning_progress, 0) || ae(u.attributes.drying_progress, 0), h = u.attributes.status;
  return /* @__PURE__ */ s.jsxs("div", { className: "header", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "header__top", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "header__title-wrapper", children: [
        /* @__PURE__ */ s.jsx("h1", { className: "header__title", children: f }),
        /* @__PURE__ */ s.jsx("p", { className: "header__status", children: r })
      ] }),
      d && /* @__PURE__ */ s.jsx("button", { className: "header__settings-btn", onClick: d, type: "button", "aria-label": "Settings", children: /* @__PURE__ */ s.jsx(nh, {}) })
    ] }),
    h !== "Sleeping" && y > 0 && /* @__PURE__ */ s.jsx("div", { className: "header__progress", children: /* @__PURE__ */ s.jsx("div", { className: "header__progress-bar", children: /* @__PURE__ */ s.jsx("div", { className: "header__progress-fill", style: { width: `${y}%` } }) }) }),
    /* @__PURE__ */ s.jsxs("div", { className: "header__stats", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "header__stat", children: [
        /* @__PURE__ */ s.jsx("span", { className: "header__stat-icon--area", children: jh }),
        /* @__PURE__ */ s.jsxs("span", { className: "header__stat-value", children: [
          p,
          " m²"
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "header__stat", children: [
        /* @__PURE__ */ s.jsx("span", { className: "header__stat-icon--cleaning-time", children: Oh }),
        /* @__PURE__ */ s.jsxs("span", { className: "header__stat-value", children: [
          b,
          " min"
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "header__stat", children: [
        /* @__PURE__ */ s.jsx("span", { className: "header__stat-icon", children: C() }),
        /* @__PURE__ */ s.jsxs("span", { className: "header__stat-value", children: [
          M,
          " %"
        ] })
      ] })
    ] })
  ] });
}
const y1 = {
  // Zone Selector
  room_selector: {
    title: "Select Zones",
    selected_count: "{{count}} selected"
  },
  // Mower Map
  vacuum_map: {
    no_map: "No map available",
    looking_for: "Looking for: {{entity}}",
    room_overlay: "Click on zone numbers to select zones for mowing",
    zone_overlay_create: "Click on the map to place a mowing area",
    zone_overlay_resize: "Drag corners to resize, click elsewhere to reposition",
    clear_zone: "Clear area"
  },
  // Mode Tabs
  modes: {
    room: "Zone",
    all: "All",
    zone: "Area"
  },
  // Action Buttons
  actions: {
    clean: "Mow",
    clean_all: "Mow All",
    clean_rooms: "Mow Zone {{count}}",
    clean_rooms_plural: "Mow {{count}} Zones",
    select_rooms: "Select Zones",
    zone_clean: "Custom Area",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    dock: "Return to Base"
  },
  // Toast Messages
  toast: {
    selected_room: "Selected {{name}}",
    deselected_room: "Deselected {{name}}",
    paused: "Paused mowing",
    stopped: "Stopped mowing",
    docked: "Returning to base",
    cleaning_started: "Mowing started",
    resuming: "Resuming mowing",
    starting_full_clean: "Starting full lawn mowing",
    pausing_vacuum: "Pausing device",
    pausing_device: "Pausing device",
    stopping_vacuum: "Stopping device",
    stopping_device: "Stopping device",
    vacuum_docking: "Returning to base",
    device_docking: "Returning to base",
    starting_room_clean: "Starting mowing for {{count}} selected zone",
    starting_room_clean_plural: "Starting mowing for {{count}} selected zones",
    starting_zone_clean: "Starting area mowing",
    select_rooms_first: "Please select zones to mow first",
    cannot_determine_map: "Cannot determine map dimensions",
    select_zone_first: "Please select an area on the map"
  },
  // Zone Selection Display
  room_display: {
    selected_rooms: "Selected Zones:",
    selected_label: "Selected:"
  },
  // Mowing Mode Button
  cleaning_mode_button: {
    prefix_custom: "Custom: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "View shortcuts",
    vac_and_mop: "Mow & Edge",
    mop_after_vac: "Edge after Mow",
    vacuum: "Mow",
    mop: "Edge"
  },
  // Mowing Mode Modal
  cleaning_mode: {
    title: "Mowing Mode",
    clean_genius: "CleanGenius",
    custom: "Custom"
  },
  // Shortcuts Modal
  shortcuts: {
    title: "Shortcuts",
    no_shortcuts: "No shortcuts available",
    create_hint: "Create shortcuts in the Dreame app to quickly start your favorite cleaning routines"
  },
  // Custom Mode
  custom_mode: {
    cleaning_mode_title: "Mowing Mode",
    suction_power_title: "Cutting Power",
    max_plus_description: "The cutting power will be increased to the highest level.",
    wetness_title: "Wetness",
    slightly_dry: "Slightly dry",
    moist: "Moist",
    wet: "Wet",
    mop_washing_frequency_title: "Mop-washing frequency",
    route_title: "Route"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Mowing Mode",
    deep_cleaning: "Deep Cut"
  },
  // Header
  header: {
    battery: "Battery",
    status: "Status"
  },
  // Errors
  errors: {
    entity_not_found: "Entity not found: {{entity}}",
    failed_to_load: "Failed to load entity data"
  },
  // Settings Panel
  settings: {
    title: "Settings",
    consumables: {
      title: "Consumables",
      main_brush: "Brush",
      side_brush: "Blades",
      filter: "Maintenance",
      sensor: "Sensor",
      remaining: "remaining",
      reset: "Reset"
    },
    device_info: {
      title: "Device Info",
      firmware: "Firmware",
      total_area: "Total Mowed Area",
      total_time: "Total Mowing Time",
      total_cleans: "Total Mowings",
      wifi_ssid: "Wi-Fi Network",
      wifi_signal: "Signal Strength",
      ip_address: "IP Address"
    },
    map_management: {
      title: "Map Management",
      description: "Select which map to use for mowing.",
      no_maps: "No maps available"
    },
    quick_settings: {
      title: "Quick Settings",
      child_lock: "Child Lock",
      child_lock_desc: "Disable physical buttons on device",
      carpet_boost: "Edge Boost",
      carpet_boost_desc: "Increase cutting power near edges",
      obstacle_avoidance: "Obstacle Avoidance",
      obstacle_avoidance_desc: "Avoid obstacles during mowing",
      auto_dust_collecting: "Auto Empty",
      auto_dust_collecting_desc: "Automatically empty dustbin",
      auto_drying: "Auto Drying",
      auto_drying_desc: "Dry mop pad after mowing",
      dnd: "Do Not Disturb",
      dnd_desc: "Quiet hours with reduced activity"
    },
    volume: {
      title: "Volume & Sound",
      test_sound: "Locate",
      muted: "Muted"
    },
    carpet: {
      title: "Edge Settings",
      carpet_boost: "Edge Boost",
      carpet_boost_desc: "Increase cutting power near edges",
      carpet_recognition: "Edge Recognition",
      carpet_recognition_desc: "Automatically detect edges",
      carpet_avoidance: "Obstacle Avoidance",
      carpet_avoidance_desc: "Avoid obstacles while mowing",
      sensitivity: "Edge Sensitivity",
      sensitivity_desc: "Detection sensitivity level",
      sensitivity_low: "Low",
      sensitivity_medium: "Medium",
      sensitivity_high: "High"
    },
    ai_detection: {
      title: "AI & Detection",
      obstacle_avoidance: "Obstacle Avoidance",
      obstacle_avoidance_desc: "Use sensors to avoid obstacles",
      ai_obstacle_detection: "AI Obstacle Detection",
      ai_obstacle_detection_desc: "Use AI to identify and avoid obstacles",
      ai_obstacle_image_upload: "Obstacle Image Upload",
      ai_obstacle_image_upload_desc: "Upload obstacle images for analysis",
      ai_pet_detection: "Pet Detection",
      ai_pet_detection_desc: "Detect and avoid pets",
      ai_human_detection: "Human Detection",
      ai_human_detection_desc: "Detect and avoid humans",
      ai_furniture_detection: "Furniture Detection",
      ai_furniture_detection_desc: "Detect and navigate around furniture",
      ai_fluid_detection: "Fluid Detection",
      ai_fluid_detection_desc: "Detect and avoid liquids",
      stain_avoidance: "Stain Avoidance",
      stain_avoidance_desc: "Avoid detected stains",
      collision_avoidance: "Collision Avoidance",
      collision_avoidance_desc: "Prevent collisions with objects",
      fill_light: "Fill Light",
      fill_light_desc: "Use fill light for better detection"
    }
  }
}, p1 = {
  // Room Selector
  room_selector: {
    title: "Räume auswählen",
    selected_count: "{{count}} ausgewählt"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "Keine Karte verfügbar",
    looking_for: "Suche nach: {{entity}}",
    room_overlay: "Klicken Sie auf Raumnummern, um Räume zum Reinigen auszuwählen",
    zone_overlay_create: "Klicken Sie auf die Karte, um eine Reinigungszone zu platzieren",
    zone_overlay_resize: "Ziehen Sie an den Ecken, um die Größe zu ändern, oder klicken Sie woanders, um neu zu positionieren",
    clear_zone: "Zone löschen"
  },
  // Mode Tabs
  modes: {
    room: "Raum",
    all: "Alle",
    zone: "Zone"
  },
  // Action Buttons
  actions: {
    clean: "Reinigen",
    clean_all: "Alles reinigen",
    clean_rooms: "{{count}} Raum reinigen",
    clean_rooms_plural: "{{count}} Räume reinigen",
    select_rooms: "Räume auswählen",
    zone_clean: "Zone reinigen",
    pause: "Pause",
    resume: "Fortsetzen",
    stop: "Stopp",
    dock: "Andocken"
  },
  // Toast Messages
  toast: {
    selected_room: "{{name}} ausgewählt",
    deselected_room: "{{name}} abgewählt",
    paused: "Reinigung pausiert",
    stopped: "Reinigung gestoppt",
    docked: "Kehrt zur Station zurück",
    cleaning_started: "Reinigung gestartet",
    resuming: "Reinigung wird fortgesetzt",
    starting_full_clean: "Vollständige Hausreinigung gestartet",
    pausing_vacuum: "Saugroboter wird pausiert",
    pausing_device: "Gerät wird pausiert",
    stopping_vacuum: "Saugroboter wird gestoppt",
    stopping_device: "Gerät wird gestoppt",
    vacuum_docking: "Saugroboter kehrt zur Station zurück",
    device_docking: "Gerät kehrt zur Station zurück",
    starting_room_clean: "Reinigung für {{count}} ausgewählten Raum wird gestartet",
    starting_room_clean_plural: "Reinigung für {{count}} ausgewählte Räume wird gestartet",
    starting_zone_clean: "Zonenreinigung wird gestartet",
    select_rooms_first: "Bitte wählen Sie zuerst Räume zum Reinigen aus",
    cannot_determine_map: "Kartenabmessungen können nicht ermittelt werden",
    select_zone_first: "Bitte wählen Sie zuerst eine Zone auf der Karte aus"
  },
  // Room Selection Display
  room_display: {
    selected_rooms: "Ausgewählte Räume:",
    selected_label: "Ausgewählt:"
  },
  // Cleaning Mode Button
  cleaning_mode_button: {
    prefix_custom: "Benutzerdefiniert: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "Verknüpfungen anzeigen",
    vac_and_mop: "Saugen & Wischen",
    mop_after_vac: "Wischen nach Saugen",
    vacuum: "Saugen",
    mop: "Wischen"
  },
  // Cleaning Mode Modal
  cleaning_mode: {
    title: "Reinigungsmodus",
    clean_genius: "CleanGenius",
    custom: "Benutzerdefiniert"
  },
  // Shortcuts Modal
  shortcuts: {
    title: "Verknüpfungen",
    no_shortcuts: "Keine Verknüpfungen verfügbar",
    create_hint: "Erstellen Sie Verknüpfungen in der Dreame-App, um Ihre bevorzugten Reinigungsroutinen schnell zu starten"
  },
  // Custom Mode
  custom_mode: {
    cleaning_mode_title: "Reinigungsmodus",
    suction_power_title: "Saugleistung",
    max_plus_description: "Die Saugkraft wird auf die höchste Stufe erhöht. Dies ist ein Einmal-Modus.",
    wetness_title: "Feuchtigkeit",
    slightly_dry: "Leicht trocken",
    moist: "Feucht",
    wet: "Nass",
    mop_washing_frequency_title: "Wischmopp-Waschfrequenz",
    route_title: "Route"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Reinigungsmodus",
    deep_cleaning: "Tiefenreinigung"
  },
  // Header
  header: {
    battery: "Batterie",
    status: "Status"
  },
  // Errors
  errors: {
    entity_not_found: "Entität nicht gefunden: {{entity}}",
    failed_to_load: "Entitätsdaten konnten nicht geladen werden"
  },
  // Settings Panel
  settings: {
    title: "Einstellungen",
    consumables: {
      title: "Verbrauchsmaterialien",
      main_brush: "Hauptbürste",
      side_brush: "Seitenbürste",
      filter: "Filter",
      sensor: "Sensor",
      remaining: "verbleibend",
      reset: "Zurücksetzen"
    },
    device_info: {
      title: "Geräteinformationen",
      firmware: "Firmware",
      total_area: "Gesamtreinigungsfläche",
      total_time: "Gesamtreinigungszeit",
      total_cleans: "Gesamte Reinigungen",
      wifi_ssid: "WLAN-Netzwerk",
      wifi_signal: "Signalstärke",
      ip_address: "IP-Adresse"
    },
    map_management: {
      title: "Kartenverwaltung",
      description: "Wählen Sie die Karte für die Reinigung aus.",
      no_maps: "Keine Karten verfügbar"
    },
    quick_settings: {
      title: "Schnelleinstellungen",
      child_lock: "Kindersicherung",
      child_lock_desc: "Tasten am Gerät deaktivieren",
      carpet_boost: "Teppich-Boost",
      carpet_boost_desc: "Saugkraft auf Teppichen erhöhen",
      obstacle_avoidance: "Hindernisvermeidung",
      obstacle_avoidance_desc: "Hindernisse beim Reinigen umfahren",
      auto_dust_collecting: "Auto-Entleerung",
      auto_dust_collecting_desc: "Staubbehälter automatisch leeren",
      auto_drying: "Auto-Trocknung",
      auto_drying_desc: "Wischmopp nach Reinigung trocknen",
      dnd: "Nicht stören",
      dnd_desc: "Ruhezeiten mit reduzierter Aktivität"
    },
    volume: {
      title: "Lautstärke & Ton",
      test_sound: "Finden",
      muted: "Stumm"
    },
    carpet: {
      title: "Teppich-Einstellungen",
      carpet_boost: "Teppich-Boost",
      carpet_boost_desc: "Saugkraft auf Teppichen erhöhen",
      carpet_recognition: "Teppicherkennung",
      carpet_recognition_desc: "Teppiche automatisch erkennen",
      carpet_avoidance: "Teppichvermeidung",
      carpet_avoidance_desc: "Teppiche beim Wischen vermeiden",
      sensitivity: "Teppich-Empfindlichkeit",
      sensitivity_desc: "Erkennungsempfindlichkeit",
      sensitivity_low: "Niedrig",
      sensitivity_medium: "Mittel",
      sensitivity_high: "Hoch"
    },
    ai_detection: {
      title: "KI & Erkennung",
      obstacle_avoidance: "Hindernisvermeidung",
      obstacle_avoidance_desc: "Sensoren zur Hindernisvermeidung nutzen",
      ai_obstacle_detection: "KI-Hinderniserkennung",
      ai_obstacle_detection_desc: "KI zur Erkennung und Vermeidung von Hindernissen nutzen",
      ai_obstacle_image_upload: "Hindernis-Bilder hochladen",
      ai_obstacle_image_upload_desc: "Hindernisbilder zur Analyse hochladen",
      ai_pet_detection: "Haustiererkennung",
      ai_pet_detection_desc: "Haustiere erkennen und vermeiden",
      ai_human_detection: "Personenerkennung",
      ai_human_detection_desc: "Personen erkennen und vermeiden",
      ai_furniture_detection: "Möbelerkennung",
      ai_furniture_detection_desc: "Möbel erkennen und umfahren",
      ai_fluid_detection: "Flüssigkeitserkennung",
      ai_fluid_detection_desc: "Flüssigkeiten erkennen und vermeiden",
      stain_avoidance: "Fleckenvermeidung",
      stain_avoidance_desc: "Erkannte Flecken vermeiden",
      collision_avoidance: "Kollisionsvermeidung",
      collision_avoidance_desc: "Kollisionen mit Objekten verhindern",
      fill_light: "Zusatzlicht",
      fill_light_desc: "Zusatzlicht für bessere Erkennung nutzen"
    }
  }
}, b1 = {
  // Room Selector
  room_selector: {
    title: "Выбор комнат",
    selected_count: "{{count}} выбрано"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "Нет доступной карты",
    looking_for: "Обнаружение: {{entity}}",
    room_overlay: "Кликните на номера комнат чтобы выбрать комнаты для убокри",
    zone_overlay_create: "Кликните на карту для добавления зоны уборки",
    zone_overlay_resize: "Потяните за углы для изменения размеры, кликните на любом месте для новой зоны",
    clear_zone: "Уборка зоны"
  },
  // Mode Tabs
  modes: {
    room: "Комната",
    all: "Всё",
    zone: "Зона"
  },
  // Action Buttons
  actions: {
    clean: "Очистка",
    clean_all: "Очистка всего",
    clean_rooms: "Очистка {{count}} комнаты",
    clean_rooms_plural: "Очистка {{count}} комнат",
    select_rooms: "Выбор комнат",
    zone_clean: "Уборка зоны",
    pause: "Пауза",
    resume: "Продолжить",
    stop: "Стоп",
    dock: "Возврат на базу"
  },
  // Toast Messages
  toast: {
    selected_room: "Выбраны {{name}}",
    deselected_room: "Исключены {{name}}",
    paused: "Уборки приостановлена",
    stopped: "Уборка остановлена",
    docked: "Возвращение на базу",
    cleaning_started: "Уборка начата",
    resuming: "Продолжение уборки",
    starting_full_clean: "Начинается полная уборка дома",
    pausing_vacuum: "Приостановка устройства",
    pausing_device: "Приостановка устройства",
    stopping_vacuum: "Остановка устройства",
    stopping_device: "Остановка устройства",
    vacuum_docking: "Устройство возвращается на базу",
    device_docking: "Устройство возвращается на базу",
    starting_room_clean: "Начало уборки {{count}} выбранной комнаты",
    starting_room_clean_plural: "Начало уборки {{count}} выбранных комнат",
    starting_zone_clean: "Начало зональной уборки",
    select_rooms_first: "Пожалуйста, сначала выберите комнаты с которых начать",
    cannot_determine_map: "Не удаётся распознать размеры карты",
    select_zone_first: "Пожалуйста, выберите зону на карте"
  },
  // Room Selection Display
  room_display: {
    selected_rooms: "Выбранные комнаты:",
    selected_label: "Выбрано:"
  },
  // Cleaning Mode Button
  cleaning_mode_button: {
    prefix_custom: "Настроить уборку: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "Посмотреть шорткаты",
    vac_and_mop: "Сухая и влажная",
    mop_after_vac: "Влажная после сухой",
    vacuum: "Сухая уборка",
    mop: "Влажная уборка"
  },
  // Cleaning Mode Modal
  cleaning_mode: {
    title: "Режим уборки",
    clean_genius: "CleanGenius",
    custom: "Настроить"
  },
  // Shortcuts Modal
  shortcuts: {
    title: "Шорткаты",
    no_shortcuts: "Нет доступных шорткатов",
    create_hint: "Создайте шорткаты в приложении Dreame для быстрого выбора ваших любимых процедур "
  },
  // Custom Mode
  custom_mode: {
    cleaning_mode_title: "Режим уборки",
    suction_power_title: "Мощность всасывания",
    max_plus_description: "Мощность всасывания будет увеличена до максимального уровня, что соответствует режиму одноразового использования.",
    wetness_title: "Влажность",
    slightly_dry: "Слегка сухая",
    moist: "Влажная",
    wet: "Мокрая",
    mop_washing_frequency_title: "Периодичность промывки швабры",
    route_title: "Маршрут"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Режим уборки",
    deep_cleaning: "Тщательная уборка"
  },
  // Header
  header: {
    battery: "Батарея",
    status: "Статус"
  },
  // Errors
  errors: {
    entity_not_found: "Сущность не найдена: {{entity}}",
    failed_to_load: "Не удалось получить данные сущности"
  },
  // Settings Panel
  settings: {
    title: "Настройки",
    consumables: {
      title: "Расходные материалы",
      main_brush: "Основная щётка",
      side_brush: "Боковая щётка",
      filter: "Фильтр",
      sensor: "Датчик",
      remaining: "осталось",
      reset: "Сбросить"
    },
    device_info: {
      title: "Информация об устройстве",
      firmware: "Прошивка",
      total_area: "Общая площадь уборки",
      total_time: "Общее время уборки",
      total_cleans: "Всего уборок",
      wifi_ssid: "Сеть Wi-Fi",
      wifi_signal: "Уровень сигнала",
      ip_address: "IP-адрес"
    },
    map_management: {
      title: "Управление картами",
      description: "Выберите карту для уборки.",
      no_maps: "Нет доступных карт"
    },
    quick_settings: {
      title: "Быстрые настройки",
      child_lock: "Блокировка от детей",
      child_lock_desc: "Отключить кнопки на устройстве",
      carpet_boost: "Усиление на коврах",
      carpet_boost_desc: "Увеличить мощность на коврах",
      obstacle_avoidance: "Избегание препятствий",
      obstacle_avoidance_desc: "Обход препятствий при уборке",
      auto_dust_collecting: "Автоочистка",
      auto_dust_collecting_desc: "Автоматическая очистка пылесборника",
      auto_drying: "Автосушка",
      auto_drying_desc: "Сушка салфетки после уборки",
      dnd: "Не беспокоить",
      dnd_desc: "Тихие часы с ограниченной активностью"
    },
    volume: {
      title: "Громкость и звук",
      test_sound: "Найти",
      muted: "Без звука"
    },
    carpet: {
      title: "Настройки ковров",
      carpet_boost: "Усиление на коврах",
      carpet_boost_desc: "Увеличить мощность всасывания на коврах",
      carpet_recognition: "Распознавание ковров",
      carpet_recognition_desc: "Автоматическое определение ковров",
      carpet_avoidance: "Избегание ковров",
      carpet_avoidance_desc: "Обходить ковры при влажной уборке",
      sensitivity: "Чувствительность ковра",
      sensitivity_desc: "Уровень чувствительности распознавания",
      sensitivity_low: "Низкая",
      sensitivity_medium: "Средняя",
      sensitivity_high: "Высокая"
    },
    ai_detection: {
      title: "ИИ и распознавание",
      obstacle_avoidance: "Избегание препятствий",
      obstacle_avoidance_desc: "Использовать датчики для обхода препятствий",
      ai_obstacle_detection: "ИИ-распознавание препятствий",
      ai_obstacle_detection_desc: "Использовать ИИ для определения и обхода препятствий",
      ai_obstacle_image_upload: "Загрузка изображений препятствий",
      ai_obstacle_image_upload_desc: "Загружать изображения препятствий для анализа",
      ai_pet_detection: "Распознавание питомцев",
      ai_pet_detection_desc: "Обнаружение и обход питомцев",
      ai_human_detection: "Распознавание людей",
      ai_human_detection_desc: "Обнаружение и обход людей",
      ai_furniture_detection: "Распознавание мебели",
      ai_furniture_detection_desc: "Обнаружение и обход мебели",
      ai_fluid_detection: "Распознавание жидкостей",
      ai_fluid_detection_desc: "Обнаружение и обход жидкостей",
      stain_avoidance: "Избегание пятен",
      stain_avoidance_desc: "Обходить обнаруженные пятна",
      collision_avoidance: "Предотвращение столкновений",
      collision_avoidance_desc: "Предотвращать столкновения с объектами",
      fill_light: "Подсветка",
      fill_light_desc: "Использовать подсветку для лучшего распознавания"
    }
  }
}, sm = {
  en: y1,
  de: p1,
  ru: b1
};
function S1(u, f) {
  return f ? Object.entries(f).reduce((d, [r, p]) => d.replace(new RegExp(`{{${r}}}`, "g"), String(p)), u) : u;
}
function E1(u, f) {
  return f.split(".").reduce((d, r) => {
    if (d && typeof d == "object" && r in d)
      return d[r];
  }, u);
}
function x1(u = "en") {
  const f = sm[u] || sm.en;
  return function(r, p) {
    const b = E1(f, r);
    return typeof b != "string" ? (console.warn(`Translation key not found: ${r}`), r) : S1(b, p);
  };
}
function N1(u, f) {
  return f === 0 ? u("actions.select_rooms") : u(f === 1 ? "actions.clean_rooms" : "actions.clean_rooms_plural", { count: String(f) });
}
function je(u = "en") {
  const f = V.useMemo(() => x1(u), [u]);
  return {
    t: f,
    getRoomCountTranslation: (d) => N1(f, d)
  };
}
function A1({
  cleaningMode: u,
  cleanGeniusMode: f,
  cleangenius: d,
  onClick: r,
  onShortcutsClick: p,
  disabled: b = !1,
  language: M
}) {
  const { t: C } = je(M), y = (B) => B === Re.SWEEPING ? hm : B === Re.MOPPING ? vm : B === Re.SWEEPING_AND_MOPPING ? oc : B === Re.MOPPING_AFTER_SWEEPING ? Vo : oc, h = (B) => B === ua.VACUUM_AND_MOP ? C("cleaning_mode_button.vac_and_mop") : B === ua.MOP_AFTER_VACUUM ? C("cleaning_mode_button.mop_after_vac") : "", N = (B) => B === Re.MOPPING_AFTER_SWEEPING ? C("cleaning_mode_button.mop_after_vac") : B === Re.SWEEPING_AND_MOPPING ? C("cleaning_mode_button.vac_and_mop") : B === Re.SWEEPING ? C("cleaning_mode_button.vacuum") : B === Re.MOPPING ? C("cleaning_mode_button.mop") : "", U = () => C(d === "Off" ? "cleaning_mode_button.prefix_custom" : "cleaning_mode_button.prefix_cleangenius"), L = (B) => {
    B.stopPropagation(), p?.();
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-button-wrapper", children: [
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        onClick: r,
        className: `cleaning-mode-button ${b ? "cleaning-mode-button--disabled" : ""}`,
        disabled: b,
        children: [
          /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-button__content", children: [
            /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-button__icon", children: y(u) }),
            /* @__PURE__ */ s.jsxs("span", { className: "cleaning-mode-button__text", children: [
              U(),
              d === "Off" ? N(u) : h(f)
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-button__arrow", children: "›" })
        ]
      }
    ),
    d === "Off" && p && /* @__PURE__ */ s.jsx(
      "button",
      {
        className: "cleaning-mode-button-wrapper__shortcuts",
        onClick: L,
        title: C("cleaning_mode_button.view_shortcuts"),
        disabled: b,
        children: Bh
      }
    )
  ] });
}
function Xo(u) {
  const f = V.useCallback(
    (y, h, N) => {
      u.callService(y, h, N);
    },
    [u]
  ), d = V.useCallback(
    (y, h) => {
      const N = {
        entity_id: y,
        option: h
      };
      f(Yl.SELECT, Pa.SELECT_OPTION, N);
    },
    [f]
  ), r = V.useCallback(
    (y, h) => {
      const N = h ? Pa.TURN_ON : Pa.TURN_OFF;
      f(Yl.SWITCH, N, { entity_id: y });
    },
    [f]
  ), p = V.useCallback(
    (y, h) => {
      const N = {
        entity_id: y,
        value: h
      };
      f(Yl.NUMBER, Pa.SET_VALUE, N);
    },
    [f]
  ), b = V.useCallback(
    (y) => {
      f(Yl.VACUUM, Pa.START, { entity_id: y });
    },
    [f]
  ), M = V.useCallback(
    (y) => {
      f(Yl.VACUUM, Pa.RETURN_TO_BASE, { entity_id: y });
    },
    [f]
  ), C = V.useCallback(
    (y, h) => {
      const N = {
        entity_id: y,
        segments: h
      };
      f(Yl.DREAME_VACUUM, Pa.VACUUM_CLEAN_SEGMENT, N);
    },
    [f]
  );
  return {
    setSelectOption: d,
    setSwitch: r,
    setNumber: p,
    startVacuum: b,
    returnToBase: M,
    cleanSegments: C,
    callService: f
  };
}
function Ko(u) {
  return V.useMemo(() => {
    const f = ym(u);
    return {
      base: f,
      cleaningMode: kl(f, Gt.CLEANING_MODE),
      cleangeniusMode: kl(f, Gt.CLEANGENIUS_MODE),
      cleangenius: kl(f, Gt.CLEANGENIUS),
      suctionLevel: kl(f, Gt.SUCTION_LEVEL),
      cleaningRoute: kl(f, Gt.CLEANING_ROUTE),
      maxSuctionPower: um(f, Gt.MAX_SUCTION_POWER),
      customMoppingMode: um(f, Gt.CUSTOM_MOPPING_MODE),
      wetnessLevel: Bo(f, Gt.WETNESS_LEVEL),
      selfCleanFrequency: kl(f, Gt.SELF_CLEAN_FREQUENCY),
      selfCleanArea: Bo(f, Gt.SELF_CLEAN_AREA),
      selfCleanTime: Bo(f, Gt.SELF_CLEAN_TIME)
    };
  }, [u]);
}
function M1({ defaultMode: u = lt.MODE } = {}) {
  const [f, d] = V.useState(u), [r, p] = V.useState(/* @__PURE__ */ new Map()), [b, M] = V.useState(null), [C, y] = V.useState(!1), [h, N] = V.useState(!1), [U, L] = V.useState(!1), B = V.useCallback((X) => {
    d(X), p(/* @__PURE__ */ new Map()), M(null);
  }, []), R = V.useCallback(
    (X, oe) => (p((ee) => {
      const ve = new Map(ee);
      return ve.has(X) ? ve.delete(X) : ve.set(X, oe), ve;
    }), r.has(X)),
    [r]
  );
  return {
    selectedMode: f,
    selectedRooms: r,
    selectedZone: b,
    modalOpened: C,
    shortcutsModalOpened: h,
    settingsPanelOpened: U,
    setSelectedMode: d,
    setSelectedRooms: p,
    setSelectedZone: M,
    setModalOpened: y,
    setShortcutsModalOpened: N,
    setSettingsPanelOpened: L,
    handleModeChange: B,
    handleRoomToggle: R
  };
}
function z1({ hass: u, entityId: f, mapEntityId: d, onSuccess: r, language: p = "en" }) {
  const { t: b } = je(p), q0 = f.split(".")[0], i0 = q0 === "lawn_mower", M = V.useCallback(() => {
    i0 ? u.callService("lawn_mower", "start_mowing", { entity_id: f }) : u.callService("vacuum", "start", { entity_id: f }), r?.(b("toast.starting_full_clean"));
  }, [u, f, r, b, i0]), C = V.useCallback(() => {
    u.callService(i0 ? "lawn_mower" : "vacuum", "pause", { entity_id: f }), r?.(b("toast.pausing_device"));
  }, [u, f, r, b, i0]), y = V.useCallback(() => {
    if (i0) {
      u.callService("lawn_mower", "dock", { entity_id: f });
    } else {
      u.callService("vacuum", "stop", { entity_id: f }), u.callService("vacuum", "return_to_base", { entity_id: f });
    }
    r?.(b("toast.stopping_device"));
  }, [u, f, r, b, i0]), h = V.useCallback(() => {
    i0 ? u.callService("lawn_mower", "dock", { entity_id: f }) : u.callService("vacuum", "return_to_base", { entity_id: f }), r?.(b("toast.device_docking"));
  }, [u, f, r, b, i0]), N = V.useCallback(
    (B, R) => {
      u.callService("dreame_vacuum", "vacuum_clean_segment", {
        entity_id: f,
        segments: B
      }), r?.(b(R === 1 ? "toast.starting_room_clean" : "toast.starting_room_clean_plural", { count: String(R) }));
    },
    [u, f, r, b]
  ), U = V.useCallback(
    (B, R, X) => {
      const oe = u.states[d];
      console.log("Zone conversion debug:", {
        uiZone: B,
        imageWidth: R,
        imageHeight: X,
        mapEntity: oe?.attributes
      });
      const ee = f1(B, oe, R, X);
      console.log("Converted vacuum zone:", ee), u.callService("dreame_vacuum", "vacuum_clean_zone", {
        entity_id: f,
        zone: [ee.x1, ee.y1, ee.x2, ee.y2]
      }), r?.(b("toast.starting_zone_clean"));
    },
    [u, f, d, r, b]
  ), L = V.useCallback(
    (B, R, X, oe, ee) => {
      switch (B) {
        case "all":
          M();
          break;
        case "room":
          R.size > 0 ? N(Array.from(R.keys()), R.size) : r?.(b("toast.select_rooms_first"));
          break;
        case "zone":
          X && oe && ee ? U(X, oe, ee) : r?.(b(X ? "toast.cannot_determine_map" : "toast.select_zone_first"));
          break;
      }
    },
    [M, N, U, r, b]
  );
  return {
    handleStart: M,
    handlePause: C,
    handleStop: y,
    handleDock: h,
    handleCleanSegments: N,
    handleCleanZone: U,
    handleClean: L
  };
}
function T1(u = 3e3) {
  const [f, d] = V.useState(null);
  V.useEffect(() => {
    if (f) {
      const b = setTimeout(() => d(null), u);
      return () => clearTimeout(b);
    }
  }, [f, u]);
  const r = V.useCallback((b) => {
    d(b);
  }, []), p = V.useCallback(() => {
    d(null);
  }, []);
  return {
    toast: f,
    showToast: r,
    hideToast: p
  };
}
const Lo = {
  name: "light",
  colors: {
    // Background colors
    cardBg: "#f5f5f7",
    surfaceBg: "#ffffff",
    surfaceSecondary: "#f0f0f0",
    surfaceTertiary: "#e8e8e8",
    surfaceBgHover: "rgba(255, 255, 255, 0.5)",
    // Text colors
    textPrimary: "#1a1a1a",
    textPrimaryInvert: "#ffffff",
    textSecondary: "#666666",
    textTertiary: "#999999",
    // Accent colors
    accentColor: "#007aff",
    accentColorHover: "#0051d5",
    accentBg: "#e3f2fd",
    accentBgHover: "#bbdefb",
    accentBgSecondary: "#999999",
    accentBgSecondaryHover: "#666666",
    accentBgTransparent: "rgba(0, 122, 255, 0.15)",
    accentShadow: "rgba(0, 122, 255, 0.3)",
    accentColorShadowColor: "rgba(0, 122, 255, 0.25)",
    // State colors
    warningColor: "#ff9500",
    warningShadow: "rgba(255, 149, 0, 0.4)",
    errorColor: "#ff3b30",
    errorColorHover: "#ff1f0f",
    errorShadow: "rgba(255, 59, 48, 0.4)",
    // UI elements
    borderColor: "#e0e0e0",
    overlayBg: "rgba(0, 0, 0, 0.05)",
    cardShadow: "rgba(0, 0, 0, 0.08)",
    cardShadowHover: "rgba(0, 0, 0, 0.12)",
    handleShadow: "rgba(0, 0, 0, 0.2)",
    handleBg: "rgba(0, 0, 0, 0.15)",
    backdropBg: "rgba(0, 0, 0, 0.4)",
    // Toggle specific
    toggleActive: "rgba(0, 122, 255, 0.25)",
    toggleActiveBorder: "#0051d5",
    toggleActiveShadowColor: "#ffffff"
  }
}, bm = {
  name: "dark",
  colors: {
    // Background colors
    cardBg: "#1c1c1e",
    surfaceBg: "#2c2c2e",
    surfaceSecondary: "#3a3a3c",
    surfaceTertiary: "#48484a",
    surfaceBgHover: "rgba(255, 255, 255, 0.1)",
    // Text colors
    textPrimary: "#ffffff",
    textPrimaryInvert: "#1a1a1a",
    textSecondary: "#aeaeb2",
    textTertiary: "#8e8e93",
    // Accent colors
    accentColor: "#5865f2",
    accentColorHover: "#409cff",
    accentBg: "rgba(10, 132, 255, 0.2)",
    accentBgHover: "rgba(10, 132, 255, 0.3)",
    accentBgSecondary: "rgba(10, 132, 255, 0.1)",
    accentBgSecondaryHover: "rgba(10, 132, 255, 0.2)",
    accentBgTransparent: "rgba(10, 132, 255, 0.2)",
    accentShadow: "rgba(10, 132, 255, 0.4)",
    accentColorShadowColor: "rgba(88, 101, 242, 0.25)",
    // State colors
    warningColor: "#ff9f0a",
    warningShadow: "rgba(255, 159, 10, 0.4)",
    errorColor: "#ff453a",
    errorColorHover: "#ff6961",
    errorShadow: "rgba(255, 69, 58, 0.4)",
    // UI elements
    borderColor: "#48484a",
    overlayBg: "rgba(0, 0, 0, 0.3)",
    cardShadow: "rgba(0, 0, 0, 0.3)",
    cardShadowHover: "rgba(0, 0, 0, 0.4)",
    handleShadow: "rgba(0, 0, 0, 0.4)",
    handleBg: "rgba(255, 255, 255, 0.15)",
    backdropBg: "rgba(0, 0, 0, 0.6)",
    // Toggle specific
    toggleActive: "#2e354f",
    toggleActiveBorder: "#5865f2",
    toggleActiveShadowColor: "rgba(88, 101, 242, 0.25)"
  }
};
// --- HA Theme Auto-Detection Helpers ---
function _parseColor(str) {
  // Parse a CSS color string into {r, g, b} (supports hex, rgb, rgba, hsl, hsla)
  if (!str) return null;
  str = str.trim();
  // hex
  let m = str.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length === 4) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
    return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) };
  }
  // rgb/rgba
  m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  // hsl/hsla
  m = str.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/);
  if (m) {
    const h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100;
    if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
    const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    return { r: Math.round(hue2rgb(p, q, h + 1/3) * 255), g: Math.round(hue2rgb(p, q, h) * 255), b: Math.round(hue2rgb(p, q, h - 1/3) * 255) };
  }
  return null;
}
function _toRgbStr(c) {
  return c ? `rgb(${c.r}, ${c.g}, ${c.b})` : null;
}
function _withAlpha(c, a) {
  return c ? `rgba(${c.r}, ${c.g}, ${c.b}, ${a})` : null;
}
function _adjustBrightness(c, factor) {
  if (!c) return null;
  const r = Math.min(255, Math.round(c.r * factor));
  const g = Math.min(255, Math.round(c.g * factor));
  const b = Math.min(255, Math.round(c.b * factor));
  return { r, g, b };
}
function _luminance(c) {
  if (!c) return 0.5;
  const rs = c.r/255, gs = c.g/255, bs = c.b/255;
  const rl = rs <= 0.03928 ? rs/12.92 : Math.pow((rs+0.055)/1.055, 2.4);
  const gl = gs <= 0.03928 ? gs/12.92 : Math.pow((gs+0.055)/1.055, 2.4);
  const bl = bs <= 0.03928 ? bs/12.92 : Math.pow((bs+0.055)/1.055, 2.4);
  return 0.2126*rl + 0.7152*gl + 0.0722*bl;
}
function _getHATheme() {
  // Reads HA native CSS variables from the document and derives a full theme palette
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const get = (v) => cs.getPropertyValue(v).trim() || null;
  const primary = _parseColor(get("--primary-color"));
  const bg = _parseColor(get("--primary-background-color") || get("--ha-card-background"));
  const cardBgRaw = get("--ha-card-background") || get("--primary-background-color");
  const textPrimary = _parseColor(get("--primary-text-color"));
  const textSecondary = _parseColor(get("--secondary-text-color"));
  const textDisabled = _parseColor(get("--disabled-text-color"));
  const divider = _parseColor(get("--divider-color"));
  // Auto-detect light vs dark based on background luminance
  const isDark = bg ? _luminance(bg) < 0.2 : false;
  const base = isDark ? bm : Lo;
  // Build the palette, falling back to the base theme for any missing values
  const accent = primary || _parseColor(base.colors.accentColor);
  const accentDarker = _adjustBrightness(accent, 0.75);
  const accentStr = _toRgbStr(accent) || base.colors.accentColor;
  const accentHoverStr = _toRgbStr(accentDarker) || base.colors.accentColorHover;
  // Derive surface variants from background color
  const surfaceSecondary = bg ? _toRgbStr(_adjustBrightness(bg, isDark ? 1.25 : 0.96)) : base.colors.surfaceSecondary;
  const surfaceTertiary = bg ? _toRgbStr(_adjustBrightness(bg, isDark ? 1.45 : 0.92)) : base.colors.surfaceTertiary;
  // Invert text for buttons on accent backgrounds
  const textPrimaryInvert = isDark ? base.colors.textPrimaryInvert : (textPrimary ? (_luminance(textPrimary) < 0.5 ? "#ffffff" : "#1a1a1a") : base.colors.textPrimaryInvert);
  return {
    name: isDark ? "dark" : "light",
    colors: {
      ...base.colors,
      cardBg: cardBgRaw || base.colors.cardBg,
      surfaceBg: cardBgRaw || base.colors.surfaceBg,
      surfaceSecondary,
      surfaceTertiary,
      textPrimary: _toRgbStr(textPrimary) || base.colors.textPrimary,
      textPrimaryInvert,
      textSecondary: _toRgbStr(textSecondary) || base.colors.textSecondary,
      textTertiary: _toRgbStr(textDisabled) || base.colors.textTertiary,
      accentColor: accentStr,
      accentColorHover: accentHoverStr,
      accentBg: _withAlpha(accent, 0.15) || base.colors.accentBg,
      accentBgHover: _withAlpha(accent, 0.25) || base.colors.accentBgHover,
      accentBgTransparent: _withAlpha(accent, 0.15) || base.colors.accentBgTransparent,
      accentShadow: _withAlpha(accent, 0.3) || base.colors.accentShadow,
      accentColorShadowColor: _withAlpha(accent, 0.25) || base.colors.accentColorShadowColor,
      borderColor: _toRgbStr(divider) || base.colors.borderColor
    }
  };
}
// --- End HA Theme Auto-Detection Helpers ---
function C1(u, f) {
  switch (u) {
    case "light":
      return Lo;
    case "dark":
      return bm;
    case "auto":
      try { return _getHATheme(); } catch(e) { return Lo; }
    case "custom":
      return O1(f || {});
    default:
      return Lo;
  }
}
function O1(u) {
  let baseColors;
  if (u.base === "dark") {
    baseColors = bm.colors;
  } else if (u.base === "light") {
    baseColors = Lo.colors;
  } else {
    try { baseColors = _getHATheme().colors; } catch(e) { baseColors = Lo.colors; }
  }
  return {
    name: "custom",
    colors: {
      ...baseColors,
      ...u
    }
  };
}
function j1(u) {
  return {
    "--card-bg": u.cardBg,
    "--surface-bg": u.surfaceBg,
    "--surface-secondary": u.surfaceSecondary,
    "--surface-tertiary": u.surfaceTertiary,
    "--surface-bg-hover": u.surfaceBgHover,
    "--text-primary": u.textPrimary,
    "--text-primary-invert": u.textPrimaryInvert,
    "--text-secondary": u.textSecondary,
    "--text-tertiary": u.textTertiary,
    "--accent-color": u.accentColor,
    "--accent-color-hover": u.accentColorHover,
    "--accent-bg": u.accentBg,
    "--accent-bg-hover": u.accentBgHover,
    "--accent-bg-secondary": u.accentBgSecondary,
    "--accent-bg-secondary-hover": u.accentBgSecondaryHover,
    "--accent-bg-transparent": u.accentBgTransparent,
    "--accent-shadow": u.accentShadow,
    "--accent-color-shadow-color": u.accentColorShadowColor,
    "--warning-color": u.warningColor,
    "--warning-shadow": u.warningShadow,
    "--error-color": u.errorColor,
    "--error-color-hover": u.errorColorHover,
    "--error-shadow": u.errorShadow,
    "--border-color": u.borderColor,
    "--overlay-bg": u.overlayBg,
    "--card-shadow": u.cardShadow,
    "--card-shadow-hover": u.cardShadowHover,
    "--handle-shadow": u.handleShadow,
    "--handle-bg": u.handleBg,
    "--backdrop-bg": u.backdropBg,
    "--toggle-active": u.toggleActive,
    "--toggle-active-border": u.toggleActiveBorder,
    "--toggle-active-shadow-color": u.toggleActiveShadowColor
  };
}
function U1(u, f) {
  const d = j1(f.colors);
  Object.entries(d).forEach(([r, p]) => {
    u.style.setProperty(r, p);
  });
}
function D1({ themeType: u = "auto", customThemeConfig: f, containerRef: d }) {
  const r = V.useMemo(() => C1(u, f), [u, f]);
  return V.useEffect(() => {
    d?.current && U1(d.current, r);
  }, [r, d]), r;
}
function R1({ zone: u, onZoneChange: f, clearZoneLabel: d, isStarted: r = !1 }) {
  const [p, b] = V.useState(null), [M, C] = V.useState(null), y = (R, X) => {
    R.stopPropagation(), u && (b(X), C(u));
  }, h = (R) => "touches" in R && R.touches.length > 0 ? { clientX: R.touches[0].clientX, clientY: R.touches[0].clientY } : { clientX: R.clientX, clientY: R.clientY }, N = (R, X) => {
    if (!p || !M) return;
    const { clientX: oe, clientY: ee } = h(R), ve = oe - X.left, te = ee - X.top, de = Math.max(0, Math.min(100, ve / X.width * 100)), Ae = Math.max(0, Math.min(100, te / X.height * 100)), $ = { ...M };
    switch (p) {
      case "tl":
        $.x1 = Math.min(de, M.x2 - 5), $.y1 = Math.min(Ae, M.y2 - 5);
        break;
      case "tr":
        $.x2 = Math.max(de, M.x1 + 5), $.y1 = Math.min(Ae, M.y2 - 5);
        break;
      case "bl":
        $.x1 = Math.min(de, M.x2 - 5), $.y2 = Math.max(Ae, M.y1 + 5);
        break;
      case "br":
        $.x2 = Math.max(de, M.x1 + 5), $.y2 = Math.max(Ae, M.y1 + 5);
        break;
    }
    f($);
  }, U = () => {
    b(null), C(null);
  }, L = (R) => {
    R.stopPropagation(), f(null), b(null), C(null);
  };
  return {
    resizingHandle: p,
    handleResizeMove: N,
    handleResizeEnd: U,
    isResizing: () => p !== null,
    renderZone: () => u && /* @__PURE__ */ s.jsx(
      "div",
      {
        className: "vacuum-map__zone",
        style: {
          left: `${u.x1}%`,
          top: `${u.y1}%`,
          width: `${u.x2 - u.x1}%`,
          height: `${u.y2 - u.y1}%`
        },
        onClick: (R) => R.stopPropagation(),
        children: !r && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            "div",
            {
              className: "vacuum-map__zone-handle vacuum-map__zone-handle--tl",
              onMouseDown: (R) => y(R, "tl"),
              onTouchStart: (R) => y(R, "tl"),
              title: "Resize"
            }
          ),
          /* @__PURE__ */ s.jsx(
            "div",
            {
              className: "vacuum-map__zone-handle vacuum-map__zone-handle--tr",
              onMouseDown: (R) => y(R, "tr"),
              onTouchStart: (R) => y(R, "tr"),
              title: "Resize"
            }
          ),
          /* @__PURE__ */ s.jsx(
            "div",
            {
              className: "vacuum-map__zone-handle vacuum-map__zone-handle--bl",
              onMouseDown: (R) => y(R, "bl"),
              onTouchStart: (R) => y(R, "bl"),
              title: "Resize"
            }
          ),
          /* @__PURE__ */ s.jsx(
            "div",
            {
              className: "vacuum-map__zone-handle vacuum-map__zone-handle--br",
              onMouseDown: (R) => y(R, "br"),
              onTouchStart: (R) => y(R, "br"),
              title: "Resize"
            }
          ),
          /* @__PURE__ */ s.jsx("button", { className: "vacuum-map__zone-clear", onClick: L, title: d, children: "×" })
        ] })
      }
    )
  };
}
function w1({
  rooms: u,
  selectedRooms: f,
  onRoomToggle: d,
  calibrationPoints: r,
  imageWidth: p,
  imageHeight: b,
  isStarted: M
}) {
  const C = V.useMemo(() => u.filter((h) => h.visibility !== "Hidden").map((h) => ({
    room: h,
    path: h1(h, r, p, b)
  })), [u, r, p, b]), y = (h, N) => {
    d(h, N);
  };
  return !p || !b ? null : /* @__PURE__ */ s.jsx(
    "svg",
    {
      className: "vacuum-map__room-segments",
      width: "100%",
      height: "100%",
      viewBox: `0 0 ${p} ${b}`,
      preserveAspectRatio: "none",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto"
      },
      children: C.map(({ room: h, path: N }) => {
        const U = f.has(h.id);
        return N ? /* @__PURE__ */ s.jsx(
          "path",
          {
            d: N,
            className: `vacuum-map__room-segment ${U ? "vacuum-map__room-segment--selected" : ""}`,
            fill: U ? "var(--accent-bg, rgba(212, 175, 55, 0.3))" : "transparent",
            stroke: !M && U ? "var(--accent-color, #D4AF37)" : "rgba(255, 255, 255, 0.2)",
            strokeWidth: "2",
            style: {
              cursor: "pointer",
              transition: "all 0.2s ease"
            },
            onClick: (L) => {
              L.stopPropagation(), y(h.id, h.name);
            },
            "data-room-id": h.id,
            "data-room-name": h.name,
            children: /* @__PURE__ */ s.jsx("title", { children: h.name })
          },
          h.id
        ) : (console.warn("No path for room:", h.id, h.name), null);
      })
    }
  );
}
function _MapImage({ imgRef, hass, entityPicture, isStarted, onImageLoad }) {
  const [cacheBust, setCacheBust] = V.useState(0);
  V.useEffect(() => {
    // Pause polling when the browser tab is not visible
    let timer = null;
    const interval = isStarted ? 3000 : 30000;
    const startPolling = () => {
      stopPolling();
      timer = setInterval(() => setCacheBust(Date.now()), interval);
    };
    const stopPolling = () => { if (timer) { clearInterval(timer); timer = null; } };
    const onVisChange = () => { document.hidden ? stopPolling() : startPolling(); };
    document.addEventListener("visibilitychange", onVisChange);
    if (!document.hidden) startPolling();
    // Immediate refresh when state changes to started
    if (isStarted) setCacheBust(Date.now());
    return () => { stopPolling(); document.removeEventListener("visibilitychange", onVisChange); };
  }, [isStarted]);
  const baseUrl = hass.hassUrl(entityPicture);
  const sep = baseUrl.includes("?") ? "&" : "?";
  const src = cacheBust ? `${baseUrl}${sep}_cb=${cacheBust}` : baseUrl;
  return /* @__PURE__ */ s.jsx(
    "img",
    {
      ref: imgRef,
      src: src,
      alt: "Mower Map",
      className: "vacuum-map__image",
      onLoad: onImageLoad
    }
  );
}
function G1({
  hass: u,
  mapEntityId: f,
  selectedMode: d,
  selectedRooms: r,
  onRoomToggle: p,
  zone: b,
  onZoneChange: M,
  onImageDimensionsChange: C,
  language: y = "en",
  isStarted: h = !1
}) {
  const { t: N } = je(y), U = u.states[f], L = U?.attributes?.entity_picture, B = V.useRef(null), R = V.useRef(null), [X, oe] = V.useState({ width: 0, height: 0 }), ee = g1(u, f), ve = U?.attributes?.calibration_points ?? [], te = R1({
    zone: b,
    onZoneChange: M,
    clearZoneLabel: N("vacuum_map.clear_zone"),
    isStarted: h
  }), de = ($) => {
    if (d !== "zone" || te.isResizing()) return;
    const H = B.current?.getBoundingClientRect();
    if (!H) return;
    const me = $.clientX - H.left, Ce = $.clientY - H.top, Xe = me / H.width * 100, Ie = Ce / H.height * 100, Oe = 15, nt = Xe, Pe = Ie, Ke = {
      x1: Math.max(0, nt - Oe / 2),
      y1: Math.max(0, Pe - Oe / 2),
      x2: Math.min(100, nt + Oe / 2),
      y2: Math.min(100, Pe + Oe / 2)
    };
    M(Ke);
  }, Ae = ($) => {
    const H = B.current?.getBoundingClientRect();
    H && te.handleResizeMove($, H);
  };
  return /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: "vacuum-map",
      ref: B,
      onClick: de,
      onMouseMove: Ae,
      onMouseUp: te.handleResizeEnd,
      onMouseLeave: te.handleResizeEnd,
      onTouchMove: Ae,
      onTouchEnd: te.handleResizeEnd,
      onTouchCancel: te.handleResizeEnd,
      children: [
        U && L ? /* @__PURE__ */ s.jsx(
          _MapImage,
          {
            imgRef: R,
            hass: u,
            entityPicture: L,
            isStarted: h,
            onImageLoad: ($) => {
              const H = $.currentTarget;
              H.naturalWidth && H.naturalHeight && (oe({ width: H.naturalWidth, height: H.naturalHeight }), C?.(H.naturalWidth, H.naturalHeight));
            }
          }
        ) : /* @__PURE__ */ s.jsxs("div", { className: "vacuum-map__placeholder", children: [
          N("vacuum_map.no_map"),
          /* @__PURE__ */ s.jsx("br", {}),
          /* @__PURE__ */ s.jsx("small", { children: N("vacuum_map.looking_for", { entity: f }) })
        ] }),
        d === "room" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("div", { className: "vacuum-map__overlay", children: N("vacuum_map.room_overlay") }),
          X.width > 0 && X.height > 0 && /* @__PURE__ */ s.jsx(
            w1,
            {
              rooms: ee,
              selectedRooms: r,
              onRoomToggle: p,
              calibrationPoints: ve,
              imageWidth: X.width,
              imageHeight: X.height,
              isStarted: h
            }
          )
        ] }),
        d === "zone" && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("div", { className: "vacuum-map__overlay", children: N(b ? "vacuum_map.zone_overlay_resize" : "vacuum_map.zone_overlay_create") }),
          te.renderZone()
        ] })
      ]
    }
  );
}
function B1({ selectedMode: u, onModeChange: f, disabled: d = !1, language: r = "en" }) {
  const { t: p } = je(r), b = [
    { value: "room", label: p("modes.room") },
    { value: "all", label: p("modes.all") },
    { value: "zone", label: p("modes.zone") }
  ];
  return /* @__PURE__ */ s.jsx("div", { className: `mode-tabs ${d ? "mode-tabs--disabled" : ""}`, children: b.map((M) => /* @__PURE__ */ s.jsxs(
    "button",
    {
      onClick: () => f(M.value),
      className: `mode-tabs__button ${u === M.value ? "mode-tabs__button--active" : ""}`,
      disabled: d,
      children: [
        M.label,
        M.icon && /* @__PURE__ */ s.jsx("span", { className: "mode-tabs__button-icon", children: M.icon })
      ]
    },
    M.value
  )) });
}
function H1({ onClick: u, text: f }) {
  return /* @__PURE__ */ s.jsxs("button", { onClick: u, className: "action-buttons__clean", children: [
    /* @__PURE__ */ s.jsx("span", { className: "action-buttons__icon", children: Uh }),
    /* @__PURE__ */ s.jsx("span", { children: f })
  ] });
}
function L1({ onClick: u, language: f = "en" }) {
  const { t: d } = je(f);
  return /* @__PURE__ */ s.jsxs("button", { onClick: u, className: "action-buttons__pause", children: [
    /* @__PURE__ */ s.jsx("span", { className: "action-buttons__icon", children: Dh }),
    /* @__PURE__ */ s.jsx("span", { children: d("actions.pause") })
  ] });
}
function q1({ onClick: u, language: f = "en" }) {
  const { t: d } = je(f);
  return /* @__PURE__ */ s.jsxs("button", { onClick: u, className: "action-buttons__resume", children: [
    /* @__PURE__ */ s.jsx("span", { className: "action-buttons__icon", children: Rh }),
    /* @__PURE__ */ s.jsx("span", { children: d("actions.resume") })
  ] });
}
function rm({ onClick: u, language: f = "en" }) {
  const { t: d } = je(f);
  return /* @__PURE__ */ s.jsxs("button", { onClick: u, className: "action-buttons__stop", children: [
    /* @__PURE__ */ s.jsx("span", { className: "action-buttons__icon", children: wh }),
    /* @__PURE__ */ s.jsx("span", { children: d("actions.stop") })
  ] });
}
function Y1({ onClick: u, language: f = "en" }) {
  const { t: d } = je(f);
  return /* @__PURE__ */ s.jsxs("button", { onClick: u, className: "action-buttons__dock", children: [
    /* @__PURE__ */ s.jsx("span", { className: "action-buttons__icon", children: Gh }),
    /* @__PURE__ */ s.jsx("span", { children: d("actions.dock") })
  ] });
}
function k1({
  selectedMode: u,
  selectedRoomsCount: f,
  isRunning: d,
  isPaused: r,
  isDocked: p,
  onClean: b,
  onPause: M,
  onResume: C,
  onStop: y,
  onDock: h,
  language: N = "en"
}) {
  const { t: U, getRoomCountTranslation: L } = je(N), R = (() => {
    switch (u) {
      case "room":
        return L(f);
      case "all":
        return U("actions.clean_all");
      case "zone":
        return U("actions.zone_clean");
      default:
        return U("actions.clean");
    }
  })();
  return d && !r && !p ? /* @__PURE__ */ s.jsxs("div", { className: "action-buttons", children: [
    /* @__PURE__ */ s.jsx(L1, { onClick: M, language: N }),
    /* @__PURE__ */ s.jsx(rm, { onClick: y, language: N })
  ] }) : r ? /* @__PURE__ */ s.jsxs("div", { className: "action-buttons", children: [
    /* @__PURE__ */ s.jsx(q1, { onClick: C, language: N }),
    /* @__PURE__ */ s.jsx(rm, { onClick: y, language: N })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "action-buttons", children: [
    /* @__PURE__ */ s.jsx(H1, { onClick: b, text: R }),
    /* @__PURE__ */ s.jsx(Y1, { onClick: h, language: N })
  ] });
}
function el({ title: u, icon: f, defaultOpen: d = !1, children: r }) {
  const [p, b] = V.useState(d), M = V.useCallback(() => {
    b((C) => !C);
  }, []);
  return /* @__PURE__ */ s.jsxs("div", { className: `accordion ${p ? "accordion--open" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("button", { className: "accordion__header", onClick: M, type: "button", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "accordion__title-wrapper", children: [
        f && /* @__PURE__ */ s.jsx("span", { className: "accordion__icon", children: f }),
        /* @__PURE__ */ s.jsx("span", { className: "accordion__title", children: u })
      ] }),
      /* @__PURE__ */ s.jsx(Ng, { className: "accordion__chevron" })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "accordion__content", children: /* @__PURE__ */ s.jsx("div", { className: "accordion__content-inner", children: r }) })
  ] });
}
function Yn({ checked: u = !1, onChange: f, disabled: d = !1 }) {
  const r = (p) => {
    f && !d && f(p.target.checked);
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `toggle ${d ? "toggle--disabled" : ""}`, children: [
    /* @__PURE__ */ s.jsx("input", { type: "checkbox", className: "toggle__input", checked: u, onChange: r, disabled: d }),
    /* @__PURE__ */ s.jsx("span", { className: "toggle__slider", children: /* @__PURE__ */ s.jsx("span", { className: "toggle__knob" }) })
  ] });
}
function fc({
  icon: u,
  label: f,
  selected: d = !1,
  onClick: r,
  size: p = "medium",
  iconStyle: b = {}
}) {
  const M = typeof u == "string" && u.trim().startsWith("<svg");
  return /* @__PURE__ */ s.jsxs("div", { className: "circular-button", children: [
    /* @__PURE__ */ s.jsx(
      "button",
      {
        className: `circular-button__circle circular-button__circle--${p} ${d ? "circular-button__circle--selected" : ""}`,
        onClick: r,
        children: typeof u == "string" ? M ? /* @__PURE__ */ s.jsx(
          "span",
          {
            className: "circular-button__icon circular-button__icon--svg",
            dangerouslySetInnerHTML: { __html: u }
          }
        ) : /* @__PURE__ */ s.jsx("span", { className: "circular-button__icon", style: b, children: u }) : u
      }
    ),
    f && /* @__PURE__ */ s.jsx("span", { className: "circular-button__label", children: f })
  ] });
}
function Zo({ opened: u, onClose: f, children: d }) {
  return u ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "modal__backdrop", onClick: f }),
    /* @__PURE__ */ s.jsxs("div", { className: "modal", children: [
      /* @__PURE__ */ s.jsx("div", { className: "modal__handle" }),
      /* @__PURE__ */ s.jsx("div", { className: "modal__content", children: d })
    ] })
  ] }) : null;
}
function V1({ options: u, value: f, onChange: d }) {
  return /* @__PURE__ */ s.jsx("div", { className: "segmented-control", children: u.map((r) => /* @__PURE__ */ s.jsx(
    "button",
    {
      className: `segmented-control__button ${f === r.value ? "segmented-control__button--active" : ""}`,
      onClick: () => d(r.value),
      children: r.label
    },
    r.value
  )) });
}
function Q1({ message: u, onClose: f }) {
  return /* @__PURE__ */ s.jsxs("div", { className: "toast", children: [
    /* @__PURE__ */ s.jsx("span", { className: "toast__message", children: u }),
    /* @__PURE__ */ s.jsx("button", { className: "toast__close", onClick: f, "aria-label": "Close", children: "×" })
  ] });
}
function X1({
  cleangeniusMode: u,
  cleangeniusModeList: f,
  cleangenius: d,
  baseEntityId: r,
  hass: p,
  language: b
}) {
  const { setSelectOption: M } = Xo(p), { t: C } = je(b), y = Ko(r), h = (N) => {
    N ? (M(
      y.cleangenius,
      sc(kt.DEEP_CLEANING)
    ), M(y.cleaningRoute, rc(tl.DEEP))) : (M(
      y.cleangenius,
      sc(kt.ROUTINE_CLEANING)
    ), M(y.cleaningRoute, rc(tl.STANDARD)));
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__content", children: [
    /* @__PURE__ */ s.jsxs("section", { className: "cleaning-mode-modal__section", children: [
      /* @__PURE__ */ s.jsx("h3", { className: "cleaning-mode-modal__section-title", children: C("cleangenius_mode.cleaning_mode_title") }),
      /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__mode-grid", children: f.map((N, U) => {
        const L = N, B = N === "Vacuum and mop";
        return /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: `cleaning-mode-modal__mode-card ${N === u ? "cleaning-mode-modal__mode-card--selected" : ""}`,
            onClick: () => M(y.cleangeniusMode, Ih(L)),
            style: { cursor: "pointer" },
            children: [
              /* @__PURE__ */ s.jsx(
                "div",
                {
                  className: `cleaning-mode-modal__mode-icon cleaning-mode-modal__mode-icon--${B ? "vac-mop" : "mop-after"}`,
                  children: n1(L)
                }
              ),
              /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-modal__mode-label", children: t1(L) }),
              N === u && /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__mode-checkmark", children: /* @__PURE__ */ s.jsx("span", { children: "✓" }) })
            ]
          },
          U
        );
      }) })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__setting", children: [
      /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-modal__setting-label", children: C("cleangenius_mode.deep_cleaning") }),
      /* @__PURE__ */ s.jsx(Yn, { checked: d === kt.DEEP_CLEANING, onChange: h })
    ] })
  ] });
}
function K1({
  cleaningMode: u,
  cleaningModeList: f,
  onSelect: d,
  entityId: r
}) {
  return /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__power-grid", children: f.map((p, b) => /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__mode-option", children: [
    /* @__PURE__ */ s.jsx(
      fc,
      {
        size: "small",
        selected: p === u,
        onClick: () => d(r, Fh(p)),
        icon: l1(p)
      }
    ),
    /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-modal__mode-option-label", children: e1(p) })
  ] }, b)) });
}
function Z1({
  suctionLevel: u,
  suctionLevelList: f,
  maxSuctionPower: d,
  onSelectSuctionLevel: r,
  onToggleMaxPower: p,
  suctionLevelEntityId: b,
  maxSuctionPowerEntityId: M,
  maxPlusDescription: C
}) {
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__power-grid", children: f.map((y, h) => /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__power-option", children: [
      /* @__PURE__ */ s.jsx(
        fc,
        {
          size: "small",
          selected: y === u,
          onClick: () => r(b, rc(y)),
          icon: i1(y)
        }
      ),
      /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-modal__power-label", children: a1(y) })
    ] }, h)) }),
    /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__max-plus", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__max-plus-header", children: [
        /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-modal__max-plus-title", children: "Max+" }),
        /* @__PURE__ */ s.jsx(
          Yn,
          {
            checked: d,
            onChange: (y) => p(M, y)
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "cleaning-mode-modal__max-plus-description", children: C })
    ] })
  ] });
}
function J1({
  wetnessLevel: u,
  mopPadHumidity: f,
  onChangeWetness: d,
  entityId: r,
  slightlyDryLabel: p,
  moistLabel: b,
  wetLabel: M
}) {
  const [C, y] = V.useState(u), h = (C - Ln.WETNESS.MIN) / (Ln.WETNESS.MAX - Ln.WETNESS.MIN) * 100, N = 20, U = `calc(${h}% + ${N / 2 - h * N / 100}px)`, L = (R) => {
    y(parseInt(R.target.value));
  }, B = () => {
    C !== u && d(r, C);
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__slider-container", children: /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__slider-wrapper", children: [
      /* @__PURE__ */ s.jsx(
        "input",
        {
          type: "range",
          min: Ln.WETNESS.MIN,
          max: Ln.WETNESS.MAX,
          value: C,
          onChange: L,
          onMouseUp: B,
          onTouchEnd: B,
          className: "cleaning-mode-modal__slider",
          style: {
            background: `linear-gradient(to right, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${h}%, var(--accent-bg-secondary-hover) ${h}%, var(--accent-bg-secondary-hover) 100%)`
          }
        }
      ),
      /* @__PURE__ */ s.jsx(
        "div",
        {
          className: "cleaning-mode-modal__slider-tooltip",
          style: {
            left: U
          },
          children: C
        }
      )
    ] }) }),
    /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__slider-labels", children: [
      /* @__PURE__ */ s.jsx(
        "span",
        {
          className: `cleaning-mode-modal__slider-label ${f === uc.SLIGHTLY_DRY ? "cleaning-mode-modal__slider-label--active" : "cleaning-mode-modal__slider-label--inactive"}`,
          children: p
        }
      ),
      /* @__PURE__ */ s.jsx(
        "span",
        {
          className: `cleaning-mode-modal__slider-label ${f === uc.MOIST ? "cleaning-mode-modal__slider-label--active" : "cleaning-mode-modal__slider-label--inactive"}`,
          children: b
        }
      ),
      /* @__PURE__ */ s.jsx(
        "span",
        {
          className: `cleaning-mode-modal__slider-label ${f === uc.WET ? "cleaning-mode-modal__slider-label--active" : "cleaning-mode-modal__slider-label--inactive"}`,
          children: M
        }
      )
    ] })
  ] });
}
function $1({
  selfCleanFrequency: u,
  selfCleanFrequencyList: f,
  selfCleanArea: d,
  selfCleanAreaMin: r,
  selfCleanAreaMax: p,
  selfCleanTime: b,
  selfCleanTimeMin: M,
  selfCleanTimeMax: C,
  onSelectFrequency: y,
  onChangeArea: h,
  onChangeTime: N,
  frequencyEntityId: U,
  areaEntityId: L,
  timeEntityId: B
}) {
  const [R, X] = V.useState(d), [oe, ee] = V.useState(b), ve = (R - r) / (p - r) * 100, te = (oe - M) / (C - M) * 100, de = 20, Ae = `calc(${ve}% + ${de / 2 - ve * de / 100}px)`, $ = `calc(${te}% + ${de / 2 - te * de / 100}px)`, H = (Ce) => {
    const Xe = parseInt(Ce.target.value);
    u === "By area" ? X(Xe) : ee(Xe);
  }, me = () => {
    u === "By area" && R !== d ? h(L, R) : u === "By time" && oe !== b && N(B, oe);
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__horizontal-scroll", children: f.map((Ce, Xe) => /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__mode-option", children: [
      /* @__PURE__ */ s.jsx(
        fc,
        {
          size: "small",
          selected: Ce === u,
          onClick: () => y(U, Ph(Ce)),
          icon: u1(Ce)
        }
      ),
      /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-modal__mode-option-label", children: Ce })
    ] }, Xe)) }),
    (u === "By area" || u === "By time") && /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__slider-container", style: { marginTop: "1rem" }, children: /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__slider-wrapper", children: [
      /* @__PURE__ */ s.jsx(
        "input",
        {
          type: "range",
          min: u === "By area" ? r : M,
          max: u === "By area" ? p : C,
          value: u === "By area" ? R : oe,
          onChange: H,
          onMouseUp: me,
          onTouchEnd: me,
          className: "cleaning-mode-modal__slider",
          style: {
            background: u === "By area" ? `linear-gradient(to right, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${ve}%, var(--accent-bg-secondary-hover) ${ve}%, var(--accent-bg-secondary-hover) 100%)` : `linear-gradient(to right, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${te}%, var(--accent-bg-secondary-hover) ${te}%, var(--accent-bg-secondary-hover) 100%)`
          }
        }
      ),
      /* @__PURE__ */ s.jsx(
        "div",
        {
          className: "cleaning-mode-modal__slider-tooltip",
          style: {
            left: u === "By area" ? Ae : $
          },
          children: u === "By area" ? `${R}m²` : `${oe}m`
        }
      )
    ] }) })
  ] });
}
function W1({ cleaningRoute: u, cleaningRouteList: f, onSelect: d, entityId: r }) {
  return /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__route-grid", children: f.map((p, b) => /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__route-option", children: [
    /* @__PURE__ */ s.jsx(
      fc,
      {
        size: "small",
        selected: p === u,
        onClick: () => d(r, rc(p)),
        icon: c1(p)
      }
    ),
    /* @__PURE__ */ s.jsx("span", { className: "cleaning-mode-modal__route-label", children: p })
  ] }, b)) });
}
function F1({
  cleaningMode: u,
  cleaningModeList: f,
  suctionLevel: d,
  suctionLevelList: r,
  wetnessLevel: p,
  mopPadHumidity: b,
  cleaningRoute: M,
  cleaningRouteList: C,
  maxSuctionPower: y,
  selfCleanArea: h,
  selfCleanFrequency: N,
  selfCleanFrequencyList: U,
  selfCleanAreaMin: L,
  selfCleanAreaMax: B,
  selfCleanTime: R,
  selfCleanTimeMin: X,
  selfCleanTimeMax: oe,
  baseEntityId: ee,
  hass: ve,
  language: te
}) {
  const { setSelectOption: de, setSwitch: Ae, setNumber: $ } = Xo(ve), H = Ko(ee), { t: me } = je(te);
  return /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal__content", children: [
    /* @__PURE__ */ s.jsxs("section", { className: "cleaning-mode-modal__section", children: [
      /* @__PURE__ */ s.jsx("h3", { className: "cleaning-mode-modal__section-title", children: me("custom_mode.cleaning_mode_title") }),
      /* @__PURE__ */ s.jsx(
        K1,
        {
          cleaningMode: u,
          cleaningModeList: f,
          onSelect: de,
          entityId: H.cleaningMode
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "cleaning-mode-modal__section", children: [
      /* @__PURE__ */ s.jsx("h3", { className: "cleaning-mode-modal__section-title", children: me("custom_mode.suction_power_title") }),
      /* @__PURE__ */ s.jsx(
        Z1,
        {
          suctionLevel: d,
          suctionLevelList: r,
          maxSuctionPower: y,
          onSelectSuctionLevel: de,
          onToggleMaxPower: Ae,
          suctionLevelEntityId: H.suctionLevel,
          maxSuctionPowerEntityId: H.maxSuctionPower,
          maxPlusDescription: me("custom_mode.max_plus_description")
        }
      )
    ] }),
    u !== Re.SWEEPING && /* @__PURE__ */ s.jsxs("section", { className: "cleaning-mode-modal__section", children: [
      /* @__PURE__ */ s.jsx("h3", { className: "cleaning-mode-modal__section-title", children: me("custom_mode.wetness_title") }),
      /* @__PURE__ */ s.jsx(
        J1,
        {
          wetnessLevel: p,
          mopPadHumidity: b,
          onChangeWetness: $,
          entityId: H.wetnessLevel,
          slightlyDryLabel: me("custom_mode.slightly_dry"),
          moistLabel: me("custom_mode.moist"),
          wetLabel: me("custom_mode.wet")
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "cleaning-mode-modal__section", children: [
      /* @__PURE__ */ s.jsx("h3", { className: "cleaning-mode-modal__section-title", children: me("custom_mode.mop_washing_frequency_title") }),
      /* @__PURE__ */ s.jsx(
        $1,
        {
          selfCleanFrequency: N,
          selfCleanFrequencyList: U,
          selfCleanArea: h,
          selfCleanAreaMin: L,
          selfCleanAreaMax: B,
          selfCleanTime: R,
          selfCleanTimeMin: X,
          selfCleanTimeMax: oe,
          onSelectFrequency: de,
          onChangeArea: $,
          onChangeTime: $,
          frequencyEntityId: H.selfCleanFrequency,
          areaEntityId: H.selfCleanArea,
          timeEntityId: H.selfCleanTime
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "cleaning-mode-modal__section", children: [
      /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__section-header", children: /* @__PURE__ */ s.jsx("h3", { className: "cleaning-mode-modal__section-title", children: me("custom_mode.route_title") }) }),
      /* @__PURE__ */ s.jsx(
        W1,
        {
          cleaningRoute: M,
          cleaningRouteList: C,
          onSelect: de,
          entityId: H.cleaningRoute
        }
      )
    ] })
  ] });
}
function I1({ opened: u, onClose: f, entity: d, hass: r, language: p }) {
  const { t: b } = je(p), M = ym(d.entity_id), { setSelectOption: C, setSwitch: y } = Xo(r), h = Ko(M), N = (fe, se) => {
    const _ = d.attributes[fe];
    return Array.isArray(_) ? _ : se;
  }, U = ae(d.attributes.cleangenius, kt.OFF), [L, B] = V.useState(U !== kt.OFF), R = ae(d.attributes.cleaning_mode, lt.CLEANING_MODE), X = ae(d.attributes.cleangenius_mode, lt.CLEANGENIUS_MODE), oe = ae(d.attributes.suction_level, lt.SUCTION_LEVEL), ee = ae(d.attributes.wetness_level, lt.WETNESS_LEVEL), ve = ae(d.attributes.cleaning_route, lt.CLEANING_ROUTE), te = ae(d.attributes.max_suction_power, lt.MAX_SUCTION_POWER), de = ae(d.attributes.self_clean_area, lt.SELF_CLEAN_AREA), Ae = ae(d.attributes.self_clean_frequency, lt.SELF_CLEAN_FREQUENCY), $ = N("self_clean_frequency_list", ["By area", "By time", "By room"]), H = ae(d.attributes.self_clean_area_min, lt.SELF_CLEAN_AREA_MIN), me = ae(d.attributes.self_clean_area_max, lt.SELF_CLEAN_AREA_MAX), Ce = ae(d.attributes.previous_self_clean_time, lt.SELF_CLEAN_TIME), Xe = ae(d.attributes.self_clean_time_min, lt.SELF_CLEAN_TIME_MIN), Ie = ae(d.attributes.self_clean_time_max, lt.SELF_CLEAN_TIME_MAX), Oe = ae(d.attributes.mop_pad_humidity, lt.MOP_PAD_HUMIDITY), nt = [
    { value: qn.CLEANGENIUS, label: b("cleaning_mode.clean_genius") },
    { value: qn.CUSTOM, label: b("cleaning_mode.custom") }
  ], Pe = N("cleaning_mode_list", [
    "Sweeping",
    "Mopping",
    "Sweeping and mopping",
    "Mopping after sweeping"
  ]), Ke = N("cleangenius_mode_list", ["Vacuum and mop", "Mop after vacuum"]), z = N("suction_level_list", ["Quiet", "Standard", "Strong", "Turbo"]), w = N("cleaning_route_list", ["Quick", "Standard", "Intensive", "Deep"]), K = (fe) => {
    const se = fe === qn.CLEANGENIUS;
    B(se), y(h.customMoppingMode, !se), se ? C(
      h.cleangenius,
      sc(kt.ROUTINE_CLEANING)
    ) : C(
      h.cleangenius,
      sc(kt.OFF)
    );
  };
  return /* @__PURE__ */ s.jsx(Zo, { opened: u, onClose: f, children: /* @__PURE__ */ s.jsxs("div", { className: "cleaning-mode-modal", children: [
    /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__header", children: /* @__PURE__ */ s.jsx(
      V1,
      {
        value: L ? qn.CLEANGENIUS : qn.CUSTOM,
        onChange: K,
        options: nt
      }
    ) }),
    /* @__PURE__ */ s.jsx("div", { className: "cleaning-mode-modal__content-wrapper", children: L ? /* @__PURE__ */ s.jsx(
      X1,
      {
        cleangeniusMode: X,
        cleangeniusModeList: Ke,
        cleangenius: U,
        baseEntityId: M,
        hass: r,
        language: p
      }
    ) : /* @__PURE__ */ s.jsx(
      F1,
      {
        cleaningMode: R,
        cleaningModeList: Pe,
        suctionLevel: oe,
        suctionLevelList: z,
        wetnessLevel: ee,
        mopPadHumidity: Oe,
        cleaningRoute: ve,
        cleaningRouteList: w,
        maxSuctionPower: te,
        selfCleanArea: de,
        selfCleanFrequency: Ae,
        selfCleanFrequencyList: $,
        selfCleanAreaMin: H,
        selfCleanAreaMax: me,
        selfCleanTime: Ce,
        selfCleanTimeMin: Xe,
        selfCleanTimeMax: Ie,
        baseEntityId: M,
        hass: r,
        language: p
      }
    ) })
  ] }) });
}
function P1({ opened: u, onClose: f, entity: d, hass: r, language: p }) {
  const { t: b } = je(p), M = d.attributes.shortcuts || {}, C = Object.entries(M).map(([h, N]) => ({
    id: parseInt(h),
    ...N
  })), y = (h) => {
    r.callService("dreame_vacuum", "vacuum_start_shortcut", {
      entity_id: d.entity_id,
      shortcut_id: h
    }), f();
  };
  return /* @__PURE__ */ s.jsx(Zo, { opened: u, onClose: f, children: /* @__PURE__ */ s.jsxs("div", { className: "shortcuts-modal", children: [
    /* @__PURE__ */ s.jsx("h2", { className: "shortcuts-modal__title", children: b("shortcuts.title") }),
    C.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "shortcuts-modal__empty", children: [
      /* @__PURE__ */ s.jsx("p", { children: b("shortcuts.no_shortcuts") }),
      /* @__PURE__ */ s.jsx("p", { className: "shortcuts-modal__empty-hint", children: b("shortcuts.create_hint") })
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "shortcuts-modal__list", children: C.map((h) => /* @__PURE__ */ s.jsxs(
      "button",
      {
        className: "shortcuts-modal__item",
        onClick: () => y(h.id),
        children: [
          /* @__PURE__ */ s.jsx("span", { className: "shortcuts-modal__item-icon", children: Hh }),
          /* @__PURE__ */ s.jsx("span", { className: "shortcuts-modal__item-name", children: h.name })
        ]
      },
      h.id
    )) })
  ] }) });
}
const ev = [
  {
    key: "obstacle_avoidance",
    labelKey: "settings.ai_detection.obstacle_avoidance",
    descriptionKey: "settings.ai_detection.obstacle_avoidance_desc",
    attributeKey: "obstacle_avoidance",
    switchEntitySuffix: "obstacle_avoidance"
  },
  {
    key: "ai_obstacle_detection",
    labelKey: "settings.ai_detection.ai_obstacle_detection",
    descriptionKey: "settings.ai_detection.ai_obstacle_detection_desc",
    attributeKey: "ai_obstacle_detection",
    switchEntitySuffix: "ai_obstacle_detection"
  },
  {
    key: "ai_obstacle_image_upload",
    labelKey: "settings.ai_detection.ai_obstacle_image_upload",
    descriptionKey: "settings.ai_detection.ai_obstacle_image_upload_desc",
    attributeKey: "ai_obstacle_image_upload",
    switchEntitySuffix: "ai_obstacle_image_upload"
  },
  {
    key: "ai_pet_detection",
    labelKey: "settings.ai_detection.ai_pet_detection",
    descriptionKey: "settings.ai_detection.ai_pet_detection_desc",
    attributeKey: "ai_pet_detection",
    switchEntitySuffix: "ai_pet_detection"
  },
  {
    key: "ai_human_detection",
    labelKey: "settings.ai_detection.ai_human_detection",
    descriptionKey: "settings.ai_detection.ai_human_detection_desc",
    attributeKey: "ai_human_detection",
    switchEntitySuffix: "ai_human_detection"
  },
  {
    key: "ai_furniture_detection",
    labelKey: "settings.ai_detection.ai_furniture_detection",
    descriptionKey: "settings.ai_detection.ai_furniture_detection_desc",
    attributeKey: "ai_furniture_detection",
    switchEntitySuffix: "ai_furniture_detection"
  },
  {
    key: "ai_fluid_detection",
    labelKey: "settings.ai_detection.ai_fluid_detection",
    descriptionKey: "settings.ai_detection.ai_fluid_detection_desc",
    attributeKey: "ai_fluid_detection",
    switchEntitySuffix: "ai_fluid_detection"
  },
  {
    key: "stain_avoidance",
    labelKey: "settings.ai_detection.stain_avoidance",
    descriptionKey: "settings.ai_detection.stain_avoidance_desc",
    attributeKey: "stain_avoidance",
    switchEntitySuffix: "stain_avoidance"
  },
  {
    key: "collision_avoidance",
    labelKey: "settings.ai_detection.collision_avoidance",
    descriptionKey: "settings.ai_detection.collision_avoidance_desc",
    attributeKey: "collision_avoidance",
    switchEntitySuffix: "collision_avoidance"
  },
  {
    key: "fill_light",
    labelKey: "settings.ai_detection.fill_light",
    descriptionKey: "settings.ai_detection.fill_light_desc",
    attributeKey: "fill_light",
    switchEntitySuffix: "fill_light"
  }
];
function tv({ hass: u, entity: f }) {
  const { t: d } = je(), r = f.attributes, p = f.entity_id.split(".")[1] ?? "", b = V.useCallback(
    (C, y) => {
      const h = `switch.${p}_${C}`;
      u.callService("switch", y ? "turn_on" : "turn_off", {
        entity_id: h
      });
    },
    [u, p]
  ), M = (C) => {
    const y = r[C];
    return Qo(y) ? y : Bt(y) ? y > 0 : !1;
  };
  return /* @__PURE__ */ s.jsx("div", { className: "ai-detection-section", children: ev.map((C) => /* @__PURE__ */ s.jsxs("div", { className: "ai-detection-section__item", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "ai-detection-section__info", children: [
      /* @__PURE__ */ s.jsx("span", { className: "ai-detection-section__label", children: d(C.labelKey) }),
      /* @__PURE__ */ s.jsx("span", { className: "ai-detection-section__description", children: d(C.descriptionKey) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Yn,
      {
        checked: M(C.attributeKey),
        onChange: (y) => b(C.switchEntitySuffix, y)
      }
    )
  ] }, C.key)) });
}
const av = [
  {
    key: "carpet_boost",
    labelKey: "settings.carpet.carpet_boost",
    descriptionKey: "settings.carpet.carpet_boost_desc",
    attributeKey: "carpet_boost",
    switchEntitySuffix: "carpet_boost"
  },
  {
    key: "carpet_recognition",
    labelKey: "settings.carpet.carpet_recognition",
    descriptionKey: "settings.carpet.carpet_recognition_desc",
    attributeKey: "carpet_recognition",
    switchEntitySuffix: "carpet_recognition"
  },
  {
    key: "carpet_avoidance",
    labelKey: "settings.carpet.carpet_avoidance",
    descriptionKey: "settings.carpet.carpet_avoidance_desc",
    attributeKey: "carpet_avoidance",
    switchEntitySuffix: "carpet_avoidance"
  }
], lv = ["low", "medium", "high"];
function nv({ hass: u, entity: f }) {
  const { t: d } = je(), r = f.attributes, p = f.entity_id.split(".")[1] ?? "", b = V.useCallback(
    (N, U) => {
      const L = `switch.${p}_${N}`;
      u.callService("switch", U ? "turn_on" : "turn_off", {
        entity_id: L
      });
    },
    [u, p]
  ), M = V.useCallback(
    (N) => {
      const U = `select.${p}_carpet_sensitivity`;
      u.callService("select", "select_option", {
        entity_id: U,
        option: N
      });
    },
    [u, p]
  ), C = (N) => {
    const U = r[N];
    return Qo(U) ? U : Bt(U) ? U > 0 : !1;
  }, y = ae(r.carpet_sensitivity, "medium"), h = pm(y) ? y.toLowerCase() : "medium";
  return /* @__PURE__ */ s.jsxs("div", { className: "carpet-settings-section", children: [
    av.map((N) => /* @__PURE__ */ s.jsxs("div", { className: "carpet-settings-section__item", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "carpet-settings-section__info", children: [
        /* @__PURE__ */ s.jsx("span", { className: "carpet-settings-section__label", children: d(N.labelKey) }),
        /* @__PURE__ */ s.jsx("span", { className: "carpet-settings-section__description", children: d(N.descriptionKey) })
      ] }),
      /* @__PURE__ */ s.jsx(
        Yn,
        {
          checked: C(N.attributeKey),
          onChange: (U) => b(N.switchEntitySuffix, U)
        }
      )
    ] }, N.key)),
    /* @__PURE__ */ s.jsxs("div", { className: "carpet-settings-section__item carpet-settings-section__item--select", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "carpet-settings-section__info", children: [
        /* @__PURE__ */ s.jsx("span", { className: "carpet-settings-section__label", children: d("settings.carpet.sensitivity") }),
        /* @__PURE__ */ s.jsx("span", { className: "carpet-settings-section__description", children: d("settings.carpet.sensitivity_desc") })
      ] }),
      /* @__PURE__ */ s.jsx(
        "select",
        {
          className: "carpet-settings-section__select",
          value: h,
          onChange: (N) => M(N.target.value),
          children: lv.map((N) => /* @__PURE__ */ s.jsx("option", { value: N, children: d(`settings.carpet.sensitivity_${N}`) }, N))
        }
      )
    ] })
  ] });
}
const iv = [
  {
    key: "main_brush",
    labelKey: "settings.consumables.main_brush",
    percentKey: "main_brush_left",
    hoursKey: "main_brush_time_left",
    resetCommand: "reset_main_brush"
  },
  {
    key: "side_brush",
    labelKey: "settings.consumables.side_brush",
    percentKey: "blade_left",
    hoursKey: "blade_time_left",
    resetCommand: "reset_blade"
  },
  {
    key: "filter",
    labelKey: "settings.consumables.filter",
    percentKey: "life_left",
    hoursKey: "life_time_left",
    resetCommand: "reset_life"
  }
];
function cv({ hass: u, entity: f }) {
  const { t: d } = je(), r = f.attributes, p = V.useCallback(
    (M) => {
      u.callService("dreame_vacuum", M, {
        entity_id: f.entity_id
      });
    },
    [u, f.entity_id]
  ), b = (M) => M >= 50 ? "var(--consumable-good, #34c759)" : M >= 20 ? "var(--consumable-warning, #ff9500)" : "var(--consumable-critical, #ff3b30)";
  return /* @__PURE__ */ s.jsx("div", { className: "consumables-section", children: iv.map((M) => {
    const C = ae(r[M.percentKey], 0), y = ae(r[M.hoursKey], 0), h = b(C);
    return /* @__PURE__ */ s.jsxs("div", { className: "consumables-section__item", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "consumables-section__info", children: [
        /* @__PURE__ */ s.jsx("span", { className: "consumables-section__label", children: d(M.labelKey) }),
        /* @__PURE__ */ s.jsxs("span", { className: "consumables-section__stats", children: [
          C,
          "% · ",
          y,
          "h ",
          d("settings.consumables.remaining")
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "consumables-section__progress", children: /* @__PURE__ */ s.jsx(
        "div",
        {
          className: "consumables-section__progress-bar",
          style: {
            width: `${C}%`,
            backgroundColor: h
          }
        }
      ) }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          className: "consumables-section__reset",
          onClick: () => p(M.resetCommand),
          type: "button",
          children: d("settings.consumables.reset")
        }
      )
    ] }, M.key);
  }) });
}
function uv({ entity: u }) {
  const { t: f } = je(), d = u.attributes, r = d.firmware_version, p = pm(r) || Bt(r) ? r : "-", b = ae(d.total_cleaned_area, 0), M = ae(d.total_cleaning_time, 0), C = ae(d.cleaning_count, 0), y = d.ap, h = y?.ssid ?? "-", N = y?.rssi ?? "-", U = y?.ip ?? "-", L = [
    { labelKey: "settings.device_info.firmware", value: p },
    { labelKey: "settings.device_info.total_area", value: b, unit: "m²" },
    { labelKey: "settings.device_info.total_time", value: M, unit: "min" },
    { labelKey: "settings.device_info.total_cleans", value: C },
    { labelKey: "settings.device_info.wifi_ssid", value: h },
    { labelKey: "settings.device_info.wifi_signal", value: N, unit: "dBm" },
    { labelKey: "settings.device_info.ip_address", value: U }
  ];
  return /* @__PURE__ */ s.jsx("div", { className: "device-info-section", children: L.map((B) => /* @__PURE__ */ s.jsxs("div", { className: "device-info-section__item", children: [
    /* @__PURE__ */ s.jsx("span", { className: "device-info-section__label", children: f(B.labelKey) }),
    /* @__PURE__ */ s.jsxs("span", { className: "device-info-section__value", children: [
      B.value,
      B.unit && ` ${B.unit}`
    ] })
  ] }, B.labelKey)) });
}
function ov({ hass: u, entity: f, config: d }) {
  const { t: r } = je(), p = f.attributes, b = V.useMemo(() => p.maps ?? [], [p.maps]), M = p.selected_map_id ?? p.selected_map, y = `select.${d.entity?.split(".")[1] ?? ""}_selected_map`, h = V.useCallback(
    (N) => {
      const U = b.find((L) => L.id === N);
      U && u.callService("select", "select_option", {
        entity_id: y,
        option: U.name
      });
    },
    [u, y, b]
  );
  return b.length === 0 ? /* @__PURE__ */ s.jsx("div", { className: "map-management-section", children: /* @__PURE__ */ s.jsx("p", { className: "map-management-section__empty", children: r("settings.map_management.no_maps") }) }) : /* @__PURE__ */ s.jsxs("div", { className: "map-management-section", children: [
    /* @__PURE__ */ s.jsx("p", { className: "map-management-section__description", children: r("settings.map_management.description") }),
    /* @__PURE__ */ s.jsx("div", { className: "map-management-section__maps", children: b.map((N) => /* @__PURE__ */ s.jsx(
      "button",
      {
        className: `map-management-section__map ${N.id === M ? "map-management-section__map--active" : ""}`,
        onClick: () => h(N.id),
        type: "button",
        children: N.name
      },
      N.id
    )) })
  ] });
}
const sv = [
  {
    key: "child_lock",
    labelKey: "settings.quick_settings.child_lock",
    descriptionKey: "settings.quick_settings.child_lock_desc",
    attributeKey: "child_lock",
    switchEntitySuffix: "child_lock"
  },
  {
    key: "carpet_boost",
    labelKey: "settings.quick_settings.carpet_boost",
    descriptionKey: "settings.quick_settings.carpet_boost_desc",
    attributeKey: "carpet_boost",
    switchEntitySuffix: "carpet_boost"
  },
  {
    key: "obstacle_avoidance",
    labelKey: "settings.quick_settings.obstacle_avoidance",
    descriptionKey: "settings.quick_settings.obstacle_avoidance_desc",
    attributeKey: "obstacle_avoidance",
    switchEntitySuffix: "obstacle_avoidance"
  },
  {
    key: "auto_dust_collecting",
    labelKey: "settings.quick_settings.auto_dust_collecting",
    descriptionKey: "settings.quick_settings.auto_dust_collecting_desc",
    attributeKey: "auto_dust_collecting",
    switchEntitySuffix: "auto_dust_collecting"
  },
  {
    key: "auto_drying",
    labelKey: "settings.quick_settings.auto_drying",
    descriptionKey: "settings.quick_settings.auto_drying_desc",
    attributeKey: "auto_drying",
    switchEntitySuffix: "auto_drying"
  }
];
function rv({ hass: u, entity: f }) {
  const { t: d } = je(), r = f.attributes, p = f.entity_id.split(".")[1] ?? "", b = V.useCallback(
    (C, y) => {
      const h = `switch.${p}_${C}`;
      u.callService("switch", y ? "turn_on" : "turn_off", {
        entity_id: h
      });
    },
    [u, p]
  ), M = (C) => {
    const y = r[C];
    return Qo(y) ? y : Bt(y) ? y > 0 : o1(y) ? y.enabled ?? !1 : !1;
  };
  return /* @__PURE__ */ s.jsx("div", { className: "quick-settings-section", children: sv.map((C) => /* @__PURE__ */ s.jsxs("div", { className: "quick-settings-section__item", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "quick-settings-section__info", children: [
      /* @__PURE__ */ s.jsx("span", { className: "quick-settings-section__label", children: d(C.labelKey) }),
      /* @__PURE__ */ s.jsx("span", { className: "quick-settings-section__description", children: d(C.descriptionKey) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Yn,
      {
        checked: M(C.attributeKey),
        onChange: (y) => b(C.switchEntitySuffix, y)
      }
    )
  ] }, C.key)) });
}
const Ho = 0, fm = 100;
function fv({ hass: u, entity: f }) {
  const { t: d } = je(), r = f.entity_id.split(".")[1] ?? "", p = ae(f.attributes.volume, 50), [b, M] = V.useState(p), C = (b - Ho) / (fm - Ho) * 100, y = 20, h = `calc(${C}% + ${y / 2 - C * y / 100}px)`, N = (R) => {
    M(parseInt(R.target.value));
  }, U = V.useCallback(() => {
    if (b !== p) {
      const R = `number.${r}_volume`;
      u.callService("number", "set_value", {
        entity_id: R,
        value: b
      });
    }
  }, [u, r, b, p]), L = V.useCallback(() => {
    u.callService("vacuum", "locate", {
      entity_id: f.entity_id
    });
  }, [u, f.entity_id]), B = b === 0;
  return /* @__PURE__ */ s.jsxs("div", { className: "volume-section", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "volume-section__control", children: [
      /* @__PURE__ */ s.jsx("div", { className: "volume-section__icon", children: B ? /* @__PURE__ */ s.jsx(Sh, { size: 20 }) : /* @__PURE__ */ s.jsx(gm, { size: 20 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "volume-section__slider-container", children: /* @__PURE__ */ s.jsxs("div", { className: "volume-section__slider-wrapper", children: [
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "range",
            min: Ho,
            max: fm,
            value: b,
            onChange: N,
            onMouseUp: U,
            onTouchEnd: U,
            className: "volume-section__slider",
            style: {
              background: `linear-gradient(to right, var(--accent-color, #007aff) 0%, var(--accent-color, #007aff) ${C}%, var(--surface-secondary, #e5e5e5) ${C}%, var(--surface-secondary, #e5e5e5) 100%)`
            }
          }
        ),
        /* @__PURE__ */ s.jsx("div", { className: "volume-section__tooltip", style: { left: h }, children: B ? d("settings.volume.muted") : `${b}%` })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsxs("button", { className: "volume-section__test-button", onClick: L, type: "button", children: [
      /* @__PURE__ */ s.jsx(Lg, { size: 16 }),
      /* @__PURE__ */ s.jsx("span", { children: d("settings.volume.test_sound") })
    ] })
  ] });
}
function dv({ opened: u, onClose: f, hass: d, entity: r, config: p }) {
  const { t: b } = je();
  return /* @__PURE__ */ s.jsx(Zo, { opened: u, onClose: f, children: /* @__PURE__ */ s.jsxs("div", { className: "settings-panel", children: [
    /* @__PURE__ */ s.jsx("h2", { className: "settings-panel__title", children: b("settings.title") }),
    /* @__PURE__ */ s.jsx("div", { className: "settings-panel__scroll-wrapper", children: /* @__PURE__ */ s.jsxs("div", { className: "settings-panel__sections", children: [
      /* @__PURE__ */ s.jsx(el, { title: b("settings.consumables.title"), icon: /* @__PURE__ */ s.jsx(Cg, {}), defaultOpen: !0, children: /* @__PURE__ */ s.jsx(cv, { hass: d, entity: r }) }),
      /* @__PURE__ */ s.jsx(el, { title: b("settings.device_info.title"), icon: /* @__PURE__ */ s.jsx(wg, {}), children: /* @__PURE__ */ s.jsx(uv, { entity: r }) }),
      /* @__PURE__ */ s.jsx(el, { title: b("settings.map_management.title"), icon: /* @__PURE__ */ s.jsx(Yg, {}), children: /* @__PURE__ */ s.jsx(ov, { hass: d, entity: r, config: p }) }),
      /* @__PURE__ */ s.jsx(el, { title: b("settings.volume.title"), icon: /* @__PURE__ */ s.jsx(gm, {}), children: /* @__PURE__ */ s.jsx(fv, { hass: d, entity: r }) }),
      /* @__PURE__ */ s.jsx(el, { title: b("settings.quick_settings.title"), icon: /* @__PURE__ */ s.jsx(ah, {}), children: /* @__PURE__ */ s.jsx(rv, { hass: d, entity: r }) }),
      /* @__PURE__ */ s.jsx(el, { title: b("settings.carpet.title"), icon: /* @__PURE__ */ s.jsx(Bg, {}), children: /* @__PURE__ */ s.jsx(nv, { hass: d, entity: r }) }),
      /* @__PURE__ */ s.jsx(el, { title: b("settings.ai_detection.title"), icon: /* @__PURE__ */ s.jsx(Sg, {}), children: /* @__PURE__ */ s.jsx(tv, { hass: d, entity: r }) })
    ] }) })
  ] }) });
}
function mv({ selectedRooms: u, language: f }) {
  const { t: d } = je(f);
  if (u.size === 0)
    return null;
  const r = Array.from(u.values()).join(", ");
  return /* @__PURE__ */ s.jsxs("div", { className: "room-selection-display", children: [
    /* @__PURE__ */ s.jsx("span", { className: "room-selection-display__label", children: d("room_display.selected_label") }),
    /* @__PURE__ */ s.jsx("span", { className: "room-selection-display__rooms", children: r })
  ] });
}
function _v({ hass: u, config: f }) {
  const d = u.states[f.entity], r = f.theme || "auto", p = f.language || "en", { t: b } = je(p), M = V.useRef(null), C = D1({
    themeType: r,
    customThemeConfig: f.custom_theme,
    containerRef: M
  }), [y, h] = V.useState(null), {
    selectedMode: N,
    selectedRooms: U,
    selectedZone: L,
    modalOpened: B,
    shortcutsModalOpened: R,
    settingsPanelOpened: X,
    setSelectedZone: oe,
    setModalOpened: ee,
    setShortcutsModalOpened: ve,
    setSettingsPanelOpened: te,
    handleModeChange: de,
    handleRoomToggle: Ae
  } = M1({ defaultMode: f.default_mode }), { toast: $, showToast: H, hideToast: me } = T1(), { handlePause: Ce, handleStop: Xe, handleDock: Ie, handleClean: Oe } = z1({
    hass: u,
    entityId: f.entity,
    mapEntityId: a2(u, f),
    onSuccess: H,
    language: p
  }), nt = (_, j) => {
    const G = U.has(_);
    Ae(_, j), H(
      G ? b("toast.deselected_room", { name: j }) : b("toast.selected_room", { name: j })
    );
  }, Pe = () => {
    Oe(N, U, L, y?.width, y?.height);
  }, Ke = () => {
    const q0 = f.entity.split(".")[0];
    q0 === "lawn_mower" ? u.callService("lawn_mower", "start_mowing", { entity_id: f.entity }) : u.callService("vacuum", "start", { entity_id: f.entity }), H(b("toast.resuming"));
  };
  if (!d)
    return /* @__PURE__ */ s.jsx("div", { className: "dreame-vacuum-card__error", children: b("errors.entity_not_found", { entity: f.entity }) });
  const z = s1(d, f, u);
  if (!z)
    return /* @__PURE__ */ s.jsx("div", { className: "dreame-vacuum-card__error", children: b("errors.failed_to_load") });
  const { deviceName: w, mapEntityId: K, rooms: fe } = z, se = r1(d, N);
  return /* @__PURE__ */ s.jsx("div", { ref: M, className: `dreame-vacuum-card dreame-vacuum-card--${C.name}`, children:
    /* @__PURE__ */ s.jsx("div", { className: "dreame-vacuum-card__container", children:
      /* @__PURE__ */ s.jsx(
        G1,
        {
          hass: u,
          mapEntityId: K,
          selectedMode: N,
          selectedRooms: U,
          rooms: fe,
          onRoomToggle: nt,
          zone: L,
          onZoneChange: oe,
          onImageDimensionsChange: (_, j) => h({ width: _, height: j }),
          language: p,
          isStarted: ae(d.attributes.started, !1)
        }
      )
    })
  });
}
const gv = '.accordion{border-radius:.75rem;background:var(--card-bg, rgba(255, 255, 255, .8));overflow:hidden;margin-bottom:.5rem}.accordion__header{display:flex;align-items:center;justify-content:space-between;width:100%;padding:.875rem 1rem;background:none;border:none;cursor:pointer;color:var(--text-primary, #000);font-size:.9375rem;font-weight:500;text-align:left;transition:background-color .2s ease}.accordion__header:hover{background:var(--hover-bg, rgba(0, 0, 0, .03))}.accordion__header:active{background:var(--active-bg, rgba(0, 0, 0, .06))}.accordion__title-wrapper{display:flex;align-items:center;gap:.625rem}.accordion__icon{display:flex;align-items:center;justify-content:center;color:var(--accent-color, #007aff)}.accordion__icon svg{width:1.25rem;height:1.25rem}.accordion__title{font-weight:500}.accordion__chevron{width:1.25rem;height:1.25rem;color:var(--text-secondary, #666);transition:transform .3s ease}.accordion__content{max-height:0;overflow:hidden;transition:max-height .3s ease}.accordion__content-inner{padding:0 1rem 1rem}.accordion--open .accordion__chevron{transform:rotate(180deg)}.accordion--open .accordion__content{max-height:600px}.toggle{position:relative;display:inline-block;width:3.1875rem;height:1.9375rem}.toggle__input{opacity:0;width:0;height:0}.toggle__slider{position:absolute;cursor:pointer;inset:0;background-color:var(--surface-tertiary, #e0e0e0);transition:.4s;border-radius:1.9375rem}.toggle__knob{position:absolute;height:1.6875rem;width:1.6875rem;left:.125rem;bottom:.125rem;background-color:var(--surface-bg, white);transition:.4s;border-radius:50%;box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .2))}.toggle__input:checked+.toggle__slider{background-color:var(--toggle-active);border:.125rem solid var(--toggle-active-border);box-shadow:0 0 0 .25rem var(--toggle-active-shadow-color)}.toggle__input:checked+.toggle__slider .toggle__knob{transform:translate(1.25rem)}.toggle--disabled{opacity:.5;pointer-events:none}.circular-button{display:flex;flex-direction:column;align-items:center;gap:.5rem}.circular-button:hover{transform:translateY(-.125rem)}.circular-button__circle{border-radius:50%;background:var(--surface-secondary, #f5f5f5);display:flex;align-items:center;justify-content:center;cursor:pointer;border:.0625rem solid var(--text-primary, black);transition:all .2s ease;color:var(--text-primary)}.circular-button__circle--small{width:3.5rem;height:3.5rem;font-size:1.5rem}.circular-button__circle--medium{width:4.5rem;height:4.5rem;font-size:1.75rem}.circular-button__circle--large{width:5.5rem;height:5.5rem;font-size:2rem}.circular-button__circle--selected{background:var(--toggle-active);border:.1875rem solid var(--toggle-active-border);box-shadow:0 0 0 .25rem var(--toggle-active-shadow-color);color:var(--text-primary)}.circular-button__circle:hover:not(.circular-button__circle--selected){background:var(--surface-tertiary, #ebebeb)}.circular-button__circle:active{transform:scale(.95)}.circular-button__icon{display:flex;align-items:center;justify-content:center}.circular-button__icon--svg{width:100%;height:100%;color:var(--text-primary, #1a1a1a)}.circular-button__icon--svg svg{width:100%;height:100%;display:block}.circular-button__circle--selected .circular-button__icon--svg{color:#fff}.circular-button__label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center;line-height:1.2}.modal{position:absolute;inset:20% 0 0;background:var(--surface-bg, #f5f5f7);border-radius:1.25rem 1.25rem 0 0;padding:0 1.25rem 1.25rem;z-index:1000;max-height:80vh;overflow-y:hiddedn;color:var(--text-primary, black)}.modal::-webkit-scrollbar{display:none}.modal__backdrop{position:absolute;inset:0;background:var(--backdrop-bg, rgba(0, 0, 0, .4));z-index:999;border-radius:1.25rem}.modal__handle{width:2.25rem;height:.3125rem;background:var(--handle-bg, rgba(0, 0, 0, .15));border-radius:.1875rem;margin:.75rem auto 1.25rem}.segmented-control{display:flex;gap:.5rem;background:var(--surface-tertiary, #e8e8e8);border-radius:.75rem;padding:.25rem}.segmented-control__button{flex:1;border:none;border-radius:.625rem;padding:.75rem;font-size:.9375rem;font-weight:500;cursor:pointer;background-color:transparent;color:var(--text-primary, #1a1a1a);transition:all .2s}.segmented-control__button--active{background-color:var(--surface-bg, white);box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .08))}.segmented-control__button:hover:not(.segmented-control__button--active){background-color:var(--surface-bg-hover, rgba(255, 255, 255, .5))}.toast{position:fixed;bottom:1.25rem;left:50%;transform:translate(-50%);background:var(--surface-bg, #ffffff);border:.0625rem solid var(--border-color, #e0e0e0);border-radius:.5rem;padding:.75rem 1rem;display:flex;align-items:center;gap:.75rem;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12));animation:toast-slide-up .3s ease-out;z-index:1000;max-width:90%}@keyframes toast-slide-up{0%{transform:translate(-50%) translateY(1.25rem);opacity:0}to{transform:translate(-50%) translateY(0);opacity:1}}.toast__message{color:var(--text-primary, #1a1a1a);font-size:.875rem}.toast__close{background:none;border:none;color:var(--text-secondary, #666666);font-size:1.5rem;cursor:pointer;padding:0;width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;line-height:1;transition:color .2s}.toast__close:hover{color:var(--text-primary, #1a1a1a)}.header{padding:1.25rem 1.25rem .625rem;text-align:center}.header__top{display:flex;justify-content:space-between;align-items:flex-start}.header__title-wrapper{flex:1;text-align:center;padding-left:2rem}.header__settings-btn{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;padding:0;background:none;border:none;color:var(--text-secondary, #666);cursor:pointer;border-radius:.5rem;transition:all .2s ease}.header__settings-btn svg{width:1.25rem;height:1.25rem}.header__settings-btn:hover{background:var(--hover-bg, rgba(0, 0, 0, .05));color:var(--text-primary, #1a1a1a)}.header__settings-btn:active{background:var(--active-bg, rgba(0, 0, 0, .1))}.header__title{margin:0;font-size:1rem;font-weight:600;color:var(--text-primary, #1a1a1a)}.header__status{margin:0;font-size:.875rem;color:var(--text-secondary, #666)}.header__progress{margin:0 auto;max-width:12.5rem}.header__progress-bar{width:100%;height:.25rem;background-color:var(--surface-tertiary, #e8e8e8);border-radius:.25rem;overflow:hidden}.header__progress-fill{height:100%;background-color:var(--accent-color, #007aff);transition:width .3s ease}.header__progress-text{margin:.25rem 0 0;font-size:.75rem;color:var(--text-tertiary, #999)}.header__stats{display:flex;justify-content:center;gap:1.25rem;font-size:1rem;color:var(--text-primary, #1a1a1a);margin-top:.875rem;align-items:center}.header__stat{display:flex;align-items:center;gap:.25rem}.header__stat-icon,.header__stat-icon--cleaning-time,.header__stat-icon--area{display:flex}.header__stat-icon--cleaning-time svg,.header__stat-icon--area svg{scale:.8}.header__stat-value{display:flex;font-weight:500}.mode-tabs{display:flex;gap:.25rem;background:var(--surface-tertiary, #e8e8e8);border-radius:.9375rem;padding:.25rem;margin-bottom:.9375rem}.mode-tabs--disabled{opacity:.5;pointer-events:none}.mode-tabs__button{flex:1;display:flex;align-items:center;justify-content:center;border:none;border-radius:.6875rem;padding:.625rem;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .2s;background-color:transparent;color:var(--text-secondary, #666)}.mode-tabs__button-icon svg{scale:.5;color:var(--text-secondary, #666)}.mode-tabs__button--active{background-color:var(--surface-bg, white);color:var(--text-primary, #000);box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .1))}.mode-tabs__button:hover:not(.mode-tabs__button--active):not(:disabled){background-color:var(--surface-bg-hover, rgba(255, 255, 255, .5))}.mode-tabs__button:disabled{cursor:not-allowed}.action-buttons{display:flex;gap:.75rem;margin-top:.9375rem}.action-buttons__clean,.action-buttons__dock,.action-buttons__pause,.action-buttons__resume,.action-buttons__stop{flex:1;background:var(--accent-bg);border:.0625rem solid var(--accent-bg);border-radius:.875rem;padding:.875rem;font-size:.9375rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;transition:all .3s cubic-bezier(.16,1,.3,1);color:var(--text-primary)}.action-buttons__clean--selected,.action-buttons__dock--selected,.action-buttons__pause--selected,.action-buttons__resume--selected,.action-buttons__stop--selected{transform:translateY(-.125rem);border:.0625rem solid var(--toggle-active-border);box-shadow:0 .625rem 1.25rem #0006,0 0 .75rem #5865f240,inset 0 .0625rem .0625rem #ffffff1a!important}.action-buttons__clean{color:var(--text-primary-invert);background:var(--accent-color)}.action-buttons__pause{color:var(--accent-color);border-color:var(--accent-color-hover)}.action-buttons__resume{color:#32d74b;border-color:#32d74b80}.action-buttons__stop{color:#ff453a;border-color:#ff453a80}.action-buttons__dock{background:var(--surface-secondary);color:var(--text-secondary)}.cleaning-mode-button-wrapper{margin:.625rem 1.25rem;width:calc(100% - 2.5rem);display:flex;align-items:center;gap:.5rem}.cleaning-mode-button-wrapper__shortcuts{background:var(--accent-color, #007aff);color:#fff;border:none;border-radius:50%;width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;flex-shrink:0;transition:transform .2s,opacity .2s;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-button-wrapper__shortcuts svg{scale:.8}.cleaning-mode-button-wrapper__shortcuts:hover:not(:disabled){transform:scale(1.1);opacity:.9;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button-wrapper__shortcuts:active:not(:disabled){transform:scale(.95)}.cleaning-mode-button-wrapper__shortcuts:disabled{opacity:.5;cursor:not-allowed}.cleaning-mode-button{flex:1;background:var(--surface-bg, #fff);border:none;border-radius:.75rem;padding:.75rem 1rem;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08));color:var(--text-primary, #1a1a1a);font-weight:400;font-size:.9375rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:transform .1s ease}.cleaning-mode-button:hover:not(:disabled){box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button:active:not(:disabled){transform:scale(.98)}.cleaning-mode-button--disabled,.cleaning-mode-button:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.cleaning-mode-button__content{display:flex;align-items:center}.cleaning-mode-button__icon{scale:.7;display:flex}.cleaning-mode-button__text{font-weight:400;font-size:.8rem}.cleaning-mode-button__arrow{font-size:1.25rem;color:var(--text-tertiary, #999)}.vacuum-map{position:relative;margin:0 1.25rem;border-radius:.9375rem;overflow:hidden;background:var(--surface-bg, #fff);display:flex;align-items:center;justify-content:center;box-shadow:0 .25rem .9375rem var(--card-shadow, rgba(0, 0, 0, .1));min-height:18.75rem}.vacuum-map__image{width:100%;height:100%;object-fit:contain;border-radius:.9375rem}.dreame-vacuum-card--dark .vacuum-map .vacuum-map__image{filter:brightness(.8) contrast(.9) saturate(.85)}.vacuum-map__placeholder{color:#666;text-align:center;font-size:.875rem}.vacuum-map__placeholder small{font-size:.75rem;color:#999}.vacuum-map__overlay{position:absolute;inset:0;background:#0000000d;border-radius:.9375rem;display:flex;align-items:center;justify-content:center;font-size:.875rem;color:#666;pointer-events:none}.vacuum-map__cycles{position:absolute;right:1rem;bottom:1rem;width:2.5rem;height:2.5rem;border-radius:25%;border-radius:.375rem}.vacuum-map__zone{position:absolute;border:.1875rem solid #007aff;background:repeating-linear-gradient(45deg,#007aff1a,#007aff1a .625rem,#007aff0d .625rem 1.25rem);pointer-events:auto;border-radius:.5rem;box-shadow:0 .125rem .75rem #007aff4d}.vacuum-map__zone-handle{position:absolute;width:1.5rem;height:1.5rem;background:#007aff;border:.125rem solid white;border-radius:50%;cursor:pointer;pointer-events:auto;box-shadow:0 .125rem .25rem #0003;transition:all .2s ease;z-index:10;touch-action:none}.vacuum-map__zone-handle:before{content:"";position:absolute;inset:-.5rem}.vacuum-map__zone-handle:hover{background:#0051d5;transform:scale(1.2)}.vacuum-map__zone-handle:active{transform:scale(.9)}.vacuum-map__zone-handle--tl{top:-.75rem;left:-.75rem;cursor:nwse-resize}.vacuum-map__zone-handle--tr{top:-.75rem;right:-.75rem;cursor:nesw-resize}.vacuum-map__zone-handle--bl{bottom:-.75rem;left:-.75rem;cursor:nesw-resize}.vacuum-map__zone-handle--br{bottom:-.75rem;right:-.75rem;cursor:nwse-resize}.vacuum-map__zone-clear{position:absolute;top:-.75rem;right:-.75rem;width:1.5rem;height:1.5rem;border-radius:50%;background:#ff3b30;color:#fff;border:.125rem solid white;font-size:1.125rem;font-weight:700;cursor:pointer;pointer-events:auto;display:flex;align-items:center;justify-content:center;box-shadow:0 .125rem .5rem #ff3b3066;transition:all .2s ease;line-height:1;padding:0}.vacuum-map__zone-clear:hover{background:#ff1f0f;transform:scale(1.1)}.vacuum-map__zone-clear:active{transform:scale(.95)}.vacuum-map__room-segments{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto}.vacuum-map__room-segment{cursor:pointer;transition:all .2s ease}.vacuum-map__room-segment:hover{fill:var(--accent-bg-transparent, rgba(212, 175, 55, .2));stroke:var(--accent-color, #d4af37);stroke-width:3}.vacuum-map__room-segment--selected{fill:var(--accent-bg-transparent, rgba(212, 175, 55, .3));stroke:var(--accent-color, #d4af37);stroke-width:3}.vacuum-map__room-segment--selected:hover{fill:var(--accent-bg-transparent, rgba(212, 175, 55, .4))}.vacuum-map__rooms{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.vacuum-map__room{position:absolute;transform:translate(-50%,-50%);width:2rem;height:2rem;border-radius:50%;background:#ffffffe6;border:.125rem solid var(--border-color, #e0e0e0);display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:600;color:var(--text-primary, #1a1a1a);cursor:pointer;pointer-events:auto;transition:all .2s ease;box-shadow:0 .125rem .25rem #0000001a;z-index:2}.vacuum-map__room:hover{transform:translate(-50%,-50%) scale(1.1);background:#fff;box-shadow:0 .25rem .5rem #00000026}.vacuum-map__room--selected{background:var(--accent-color, #d4af37);color:#fff;border-color:var(--accent-color, #d4af37);box-shadow:0 .125rem .5rem var(--accent-color-shadow-color, rgba(212, 175, 55, .4))}.vacuum-map__room--selected:hover{transform:translate(-50%,-50%) scale(1.1);box-shadow:0 .25rem .75rem var(--accent-color-shadow-color, rgba(212, 175, 55, .5))}.cleaning-mode-modal__header{margin-bottom:1.5rem}.cleaning-mode-modal__content-wrapper{max-height:38rem;overflow-y:auto;width:100%;overflow-x:hidden}.cleaning-mode-modal__content-wrapper::-webkit-scrollbar{display:none}.cleaning-mode-modal__section{margin-bottom:1.5rem}.cleaning-mode-modal__section-title{font-size:.9375rem;color:var(--text-primary, #1a1a1a);font-weight:500;margin:0 0 .75rem}.cleaning-mode-modal__section-header{display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem}.cleaning-mode-modal__help-icon{display:inline-flex;align-items:center;justify-content:center;width:1rem;height:1rem;border-radius:50%;border:.09375rem solid var(--text-tertiary, #999);font-size:.6875rem;color:var(--text-tertiary, #999);font-weight:600}.cleaning-mode-modal__room-map{background:var(--surface-bg, white);border-radius:.75rem;padding:1rem;display:flex;align-items:center;justify-content:center;min-height:7.5rem}.cleaning-mode-modal__placeholder{font-size:.8125rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.cleaning-mode-modal__mode-card{position:relative;border:.125rem solid var(--border-color, #e0e0e0);border-radius:1rem;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-bg, white);padding:1.5rem 1rem;transition:all .2s ease}.cleaning-mode-modal__mode-card:hover{transform:translateY(-.125rem);box-shadow:0 .25rem .75rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-modal__mode-card--selected{border:.1875rem solid var(--accent-color, #d4af37);box-shadow:0 0 0 .25rem var(--accent-color-shadow-color, rgba(212, 175, 55, .15))}.cleaning-mode-modal__mode-card--selected:hover{transform:translateY(-.125rem);box-shadow:0 0 0 .25rem var(--accent-color-shadow-color, rgba(88, 101, 242, .25)),0 .25rem .75rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-modal__mode-icon{border-radius:50%;margin-bottom:.75rem;display:flex;align-items:center;justify-content:center;font-size:1.75rem}.cleaning-mode-modal__mode-label{font-size:.875rem;font-weight:500;color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__mode-checkmark{position:absolute;top:.75rem;right:.75rem;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--accent-color, #d4af37);display:flex;align-items:center;justify-content:center;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .15));color:#fff;font-size:.875rem}.cleaning-mode-modal__horizontal-scroll{display:flex;gap:4rem;overflow-x:auto;padding-bottom:.5rem;padding-top:.5rem;padding-left:1.5rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar{height:.25rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-track{background:var(--surface-secondary, #f1f1f1);border-radius:.125rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-thumb{background:var(--surface-tertiary, #ccc);border-radius:.125rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-thumb:hover{background:var(--border-color, #bbb)}.cleaning-mode-modal__mode-option{min-width:4.375rem;display:flex;flex-direction:column;align-items:center;gap:.375rem}.cleaning-mode-modal__mode-option-label{font-size:.75rem;color:var(--text-secondary, #666);text-align:center;line-height:1.2}.cleaning-mode-modal__power-grid{display:grid;grid-template-columns:repeat(4,1fr);margin-bottom:1rem}.cleaning-mode-modal__power-option{display:flex;flex-direction:column;align-items:center;gap:.5rem}.cleaning-mode-modal__power-label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center}.cleaning-mode-modal__max-plus{background:var(--surface-bg, white);border-radius:.75rem;padding:1rem}.cleaning-mode-modal__max-plus-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}.cleaning-mode-modal__max-plus-title{font-size:.9375rem;color:var(--text-primary, #1a1a1a);font-weight:500}.cleaning-mode-modal__max-plus-description{font-size:.8125rem;color:var(--text-tertiary, #999);margin:0;line-height:1.4}.cleaning-mode-modal__slider-container{position:relative;padding:0 .5rem;margin-bottom:.75rem}.cleaning-mode-modal__slider-wrapper{position:relative;padding-top:2rem}.cleaning-mode-modal__slider{width:100%;height:.375rem;border-radius:.1875rem;outline:none;-webkit-appearance:none;appearance:none;cursor:pointer}.cleaning-mode-modal__slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:1.25rem;height:1.25rem;border-radius:50%;background:var(--accent-color, #d4af37);cursor:pointer;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider::-moz-range-thumb{width:1.25rem;height:1.25rem;border-radius:50%;background:var(--accent-color, #d4af37);cursor:pointer;border:none;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider-tooltip{position:absolute;top:-.5rem;left:0;transform:translate(-50%);background:var(--accent-color, #d4af37);color:#fff;padding:.25rem .5rem;border-radius:.375rem;font-size:.85rem;font-weight:600;white-space:nowrap;pointer-events:none;box-shadow:0 .125rem .375rem var(--accent-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider-tooltip:after{content:"";position:absolute;top:100%;left:50%;transform:translate(-50%);width:0;height:0;border-left:.3125rem solid transparent;border-right:.3125rem solid transparent;border-top:.3125rem solid var(--accent-color, #d4af37)}.cleaning-mode-modal__slider-value{position:absolute;top:-2rem;transform:translate(-50%);background:var(--accent-color, #d4af37);border-radius:50%;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:600;color:#fff;box-shadow:0 .125rem .5rem var(--accent-color-shadow-color, rgba(88, 101, 242, .25));pointer-events:none}.cleaning-mode-modal__slider-labels{display:flex;justify-content:space-between;padding:0 .5rem;margin-top:1.5rem}.cleaning-mode-modal__slider-label{font-size:.8125rem}.cleaning-mode-modal__slider-label--inactive{color:var(--text-tertiary, #999)}.cleaning-mode-modal__slider-label--active{color:var(--text-primary, #1a1a1a);font-weight:500}.cleaning-mode-modal__setting{display:flex;align-items:center;justify-content:space-between;padding:1rem;background:var(--surface-bg, white);border-radius:.75rem;margin-bottom:1rem}.cleaning-mode-modal__setting--clickable{cursor:pointer;transition:background .2s ease}.cleaning-mode-modal__setting--clickable:hover{background:var(--surface-secondary, #f8f8f8)}.cleaning-mode-modal__setting--clickable:active{background:var(--surface-tertiary, #f0f0f0)}.cleaning-mode-modal__setting-label{font-size:.9375rem;color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__setting-value{display:flex;align-items:center;gap:.5rem;font-size:.875rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__setting-arrow{font-size:1.125rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__route-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem}.cleaning-mode-modal__route-option{display:flex;flex-direction:column;align-items:center;gap:.5rem}.cleaning-mode-modal__route-label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center}.room-selection-display{padding:.75rem 1rem;background:var(--accent-bg, #e3f2fd);border-radius:.5rem;margin-bottom:.75rem;font-size:.875rem;color:var(--text-primary, #1a1a1a)}.room-selection-display__label{font-weight:600;margin-right:.5rem;color:var(--accent-color, #007aff)}.room-selection-display__rooms{color:var(--text-secondary, #666666)}.shortcuts-modal{padding:0}.shortcuts-modal__title{font-size:1.3rem;font-weight:600;margin:0 0 1rem;padding:1.5rem 1.5rem 0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__empty{padding:2rem 1.5rem;text-align:center;color:var(--text-secondary, #666)}.shortcuts-modal__empty p{margin:.5rem 0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__empty-hint{font-size:.9rem;color:var(--text-tertiary, #888)}.shortcuts-modal__list{max-height:35rem;overflow-y:auto;padding:.5rem 0;gap:.5rem;display:flex;flex-direction:column}.shortcuts-modal__item{display:flex;align-items:center;gap:1rem;padding:.75rem 1.5rem;margin:.25rem 1rem;background:var(--surface-bg, #fff);border:2px solid var(--accent-color);border-radius:.75rem;box-shadow:0 .125rem .5rem var(--accent-shadow);transition:all .2s;width:90%}.shortcuts-modal__item:hover{box-shadow:0 .25rem .75rem var(--accent-shadow);transform:translateY(-.0625rem)}.shortcuts-modal__item-info{flex:1;min-width:0;display:flex;align-items:center;gap:.75rem}.shortcuts-modal__item-icon{display:flex;font-size:1.3rem;flex-shrink:0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__item-icon svg{scale:.8}.shortcuts-modal__item-name{font-size:1rem;font-weight:500;color:var(--text-primary, #1a1a1a)}.ai-detection-section{display:flex;flex-direction:column;gap:.75rem}.ai-detection-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.ai-detection-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.ai-detection-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.ai-detection-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.carpet-settings-section{display:flex;flex-direction:column;gap:.75rem}.carpet-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.carpet-settings-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.carpet-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.carpet-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.carpet-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.carpet-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.carpet-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.carpet-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.consumables-section{display:flex;flex-direction:column;gap:1rem}.consumables-section__item{display:flex;flex-direction:column;gap:.375rem}.consumables-section__info{display:flex;justify-content:space-between;align-items:center}.consumables-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #000)}.consumables-section__stats{font-size:.75rem;color:var(--text-secondary, #666)}.consumables-section__progress{height:.375rem;background:var(--progress-bg, rgba(0, 0, 0, .1));border-radius:.1875rem;overflow:hidden}.consumables-section__progress-bar{height:100%;border-radius:.1875rem;transition:width .3s ease}.consumables-section__reset{align-self:flex-end;padding:.25rem .75rem;font-size:.75rem;font-weight:500;color:var(--accent-color, #007aff);background:none;border:1px solid var(--accent-color, #007aff);border-radius:.375rem;cursor:pointer;transition:all .2s ease}.consumables-section__reset:hover{background:var(--accent-color, #007aff);color:#fff}.consumables-section__reset:active{opacity:.8}.device-info-section{display:flex;flex-direction:column;gap:.75rem}.device-info-section__item{display:flex;justify-content:space-between;align-items:center;padding:.25rem 0;border-bottom:1px solid var(--divider-color, rgba(0, 0, 0, .06))}.device-info-section__item:last-child{border-bottom:none}.device-info-section__label{font-size:.875rem;color:var(--text-secondary, #666)}.device-info-section__value{font-size:.875rem;font-weight:500;color:var(--text-primary, #000)}.map-management-section__description{font-size:.8125rem;color:var(--text-secondary, #666);margin:0 0 .75rem;line-height:1.4}.map-management-section__empty{font-size:.875rem;color:var(--text-secondary, #666);text-align:center;padding:1rem 0;margin:0}.map-management-section__maps{display:flex;flex-wrap:wrap;gap:.5rem}.map-management-section__map{padding:.5rem 1rem;font-size:.875rem;font-weight:500;color:var(--text-primary, #000);background:var(--button-bg, rgba(0, 0, 0, .05));border:2px solid transparent;border-radius:.5rem;cursor:pointer;transition:all .2s ease}.map-management-section__map:hover{background:var(--button-hover-bg, rgba(0, 0, 0, .08))}.map-management-section__map--active{border-color:var(--accent-color, #007aff);background:var(--accent-bg, rgba(0, 122, 255, .1));color:var(--accent-color, #007aff)}.quick-settings-section{display:flex;flex-direction:column;gap:1rem}.quick-settings-section__item{display:flex;justify-content:space-between;align-items:center;gap:1rem}.quick-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.quick-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #000)}.quick-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.volume-section{display:flex;flex-direction:row;gap:1rem}.volume-section__control{display:flex;align-items:center;gap:.75rem;flex:1}.volume-section__icon{display:flex;align-items:center;justify-content:center;color:var(--text-secondary, #666);flex-shrink:0}.volume-section__slider-container{flex:1;padding-top:1.5rem}.volume-section__slider-wrapper{position:relative;width:100%}.volume-section__slider{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;outline:none;cursor:pointer}.volume-section__slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer;box-shadow:0 2px 4px #0003;transition:transform .1s ease}.volume-section__slider::-webkit-slider-thumb:hover{transform:scale(1.1)}.volume-section__slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer;border:none;box-shadow:0 2px 4px #0003;transition:transform .1s ease}.volume-section__slider::-moz-range-thumb:hover{transform:scale(1.1)}.volume-section__tooltip{position:absolute;top:-1.75rem;transform:translate(-50%);background:var(--accent-color, #007aff);color:#fff;padding:.25rem .5rem;border-radius:4px;font-size:.75rem;font-weight:500;white-space:nowrap;pointer-events:none}.volume-section__tooltip:after{content:"";position:absolute;top:100%;left:50%;transform:translate(-50%);border:4px solid transparent;border-top-color:var(--accent-color, #007aff)}.volume-section__test-button{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.625rem 1rem;background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;color:var(--text-primary, #333);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.volume-section__test-button:hover{background:var(--surface-tertiary, #eee)}.volume-section__test-button:active{transform:scale(.98)}.volume-section__test-button svg{color:var(--accent-color, #007aff)}.settings-panel__title{font-size:1.25rem;font-weight:600;margin:0 0 1rem;text-align:center;color:var(--text-primary, #000)}.settings-panel__scroll-wrapper{max-height:45vh;overflow-y:auto}.settings-panel__sections{display:flex;flex-direction:column;gap:.25rem;padding-right:.25rem}.settings-panel__sections::-webkit-scrollbar{width:4px}.settings-panel__sections::-webkit-scrollbar-track{background:transparent}.settings-panel__sections::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb, rgba(0, 0, 0, .2));border-radius:2px}.dreame-vacuum-card{position:relative;background:var(--card-bg, #f5f5f7);border-radius:1.25rem;overflow:hidden;box-shadow:0 .125rem 1.25rem var(--card-shadow, rgba(0, 0, 0, .08));font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.dreame-vacuum-card__error{padding:1.25rem;color:var(--error-color, #ff3b30);text-align:center}.dreame-vacuum-card__container{display:flex;flex-direction:column;gap:1rem}.dreame-vacuum-card__controls{padding:0 1.25rem 1.25rem}.dreame-vacuum-card__error{padding:1.25rem;text-align:center;color:var(--error-color, #ff3b30);font-size:.875rem}';

// ── Device detection ─────────────────────────────────────────
const MWC_IS_IPAD = /iPad/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const MWC_IS_LOW_POWER = MWC_IS_IPAD || /iPhone|Android/.test(navigator.userAgent);

class hv extends HTMLElement {
  _root = null;
  _hass = null;
  _config = null;
  _built = false;
  _maintOpen = false;
  _cardModObserver = null;
  _cardModStyleEl = null;
  _cardModApplying = false;
  _cardModDebounce = null;
  _rafUpdate = null;
  _lastStates = {};

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static getStubConfig() {
    return { type: "custom:mova-mower-card", entity: "lawn_mower.mova_1000", header: { title: "Mova 1000", icon: "mdi:robot-mower" } };
  }

  setConfig(f) {
    if (!f || !f.entity) throw new Error("entity is required");
    this._cleanup();
    const slug = f.slug || f.entity.split(".")[1];
    this._config = {
      ...f,
      slug,
      card_mod_bg: f.card_mod_bg !== false,
      header: { enabled: true, title: "Mova", icon: "mdi:robot-mower", ...(f.header || {}) },
      sensors: {
        battery: `sensor.${slug}_batterie`, status: `sensor.${slug}_statut`,
        charging: `sensor.${slug}_charging_status`, bluetooth: `sensor.${slug}_bluetooth`,
        device_code: `sensor.${slug}_code_de_peripherique`, current_task: `sensor.${slug}_tache_actuelle`,
        progress: `sensor.${slug}_progression_de_la_tonte`, brush: `sensor.${slug}_etat_de_la_brosse`,
        blades: `sensor.${slug}_etat_des_lames`, maintenance: `sensor.${slug}_etat_de_maintenance`,
        ...(f.sensors || {}),
      },
      selects: {
        mowing_action: `select.${slug}_mowing_action`, edge: `select.${slug}_edge`,
        map: `select.${slug}_map`, zone: `select.${slug}_zone`, spot: `select.${slug}_spot`,
        ...(f.selects || {}),
      },
      buttons: {
        reset_blades: `button.${slug}_reinitialiser_le_compteur_des_lames`,
        reset_brush: `button.${slug}_reinitialiser_le_compteur_de_brosse`,
        reset_maintenance: `button.${slug}_reinitialiser_le_compteur_de_maintenance`,
        ...(f.buttons || {}),
      },
      map_entity: f.map_entity || f.camera || `camera.${slug}_carte`,
      pause_entity: f.pause_entity || "input_boolean.tondeuse_pause",
    };
    this._maintOpen = !!f.maintenance_open;
  }

  set hass(f) {
    this._hass = f;
    if (!this._config) return;

    // First render
    if (!this._built) { this._fullRender(); return; }

    // Always forward hass to React
    this._updateReact();

    // Dirty-check: only update native blocks if watched states changed
    const snap = this._snapshot();
    if (this._statesEqual(snap, this._lastStates)) return;
    this._lastStates = snap;

    // RAF coalescing
    if (this._rafUpdate) return;
    this._rafUpdate = requestAnimationFrame(() => {
      this._rafUpdate = null;
      this._updateBlocks();
    });
  }

  getCardSize() { return 8; }

  /* ── Snapshot + dirty-check ─────────────────────────────────────────── */

  _snapshot() {
    const c = this._config, h = this._hass;
    if (!h || !c) return {};
    const g = (eid) => h.states?.[eid]?.state ?? "";
    const o = (eid) => JSON.stringify(h.states?.[eid]?.attributes?.options ?? []);
    return {
      entity: g(c.entity),
      battery: g(c.sensors.battery), status: g(c.sensors.status),
      charging: g(c.sensors.charging), progress: g(c.sensors.progress),
      current_task: g(c.sensors.current_task), blades: g(c.sensors.blades),
      brush: g(c.sensors.brush), maintenance: g(c.sensors.maintenance),
      bluetooth: g(c.sensors.bluetooth), device_code: g(c.sensors.device_code),
      mowing_action: g(c.selects.mowing_action), edge: g(c.selects.edge),
      map: g(c.selects.map), zone: g(c.selects.zone), spot: g(c.selects.spot),
      // Track options changes too (rare but possible)
      mowing_action_opts: o(c.selects.mowing_action),
      pause: g(c.pause_entity),
    };
  }

  _statesEqual(a, b) {
    if (!a || !b) return false;
    for (const k in a) { if (a[k] !== b[k]) return false; }
    return true;
  }

  /* ── State helpers ──────────────────────────────────────────────────── */

  _st(eid, fb) { const e = this._hass?.states?.[eid]; return e ? e.state : (fb ?? ""); }
  _attr(eid, a, fb) { const e = this._hass?.states?.[eid]; return e ? (e.attributes?.[a] ?? fb) : fb; }
  _exists(eid) { return !!(eid && this._hass?.states?.[eid]); }
  _opts(eid) { return this._attr(eid, "options", []) || []; }
  _num(v) { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; }
  _cap(s) { s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
  _esc(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

  /* ── Full render ────────────────────────────────────────────────────── */

  _fullRender() {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    const h = this._config.header;

    this.shadowRoot.innerHTML = "";

    // React component CSS
    const rs = document.createElement("style"); rs.id = "dreame-card-styles"; rs.textContent = gv;
    this.shadowRoot.appendChild(rs);

    // Wrapper neon CSS
    const ws = document.createElement("style"); ws.id = "mova-wrapper-styles"; ws.textContent = this._wrapperCSS();
    this.shadowRoot.appendChild(ws);

    // Build DOM
    const card = document.createElement("ha-card");
    card.innerHTML = `
      <div class="mw-inner">
        ${h.enabled !== false ? `
          <div class="mw-hdr">
            ${h.icon ? `<div class="mw-hdr-icon"><ha-icon icon="${h.icon}"></ha-icon></div>` : ""}
            ${h.title ? `<span class="mw-hdr-title">${h.title}</span>` : ""}
            <div style="flex:1"></div>
          </div>
          <div class="mw-divider"></div>
        ` : ""}
        <div class="mw-mini-stats" id="mw-mini-stats"></div>
        <div id="react-root" class="mw-map-slot"></div>
        <div class="mw-block" id="mw-status"></div>
        <div class="mw-block" id="mw-controls"></div>
        <div class="mw-block" id="mw-maint"></div>
      </div>
    `;
    this.shadowRoot.appendChild(card);

    // Mount React map
    const rr = this.shadowRoot.querySelector("#react-root");
    this._root = tg.createRoot(rr);
    this._updateReact();

    this._built = true;
    this._lastStates = this._snapshot();
    this._updateBlocks();
    this._wireEvents();
    this._setupCardModObserver();
    requestAnimationFrame(() => this._applyCardModStyles());
  }

  _updateReact() {
    if (!this._root || !this._hass || !this._config) return;
    this._root.render(
      s.jsx(Z0.StrictMode, { children: s.jsx(_v, { hass: this._hass, config: this._config }) })
    );
  }

  /* ── Update dynamic blocks (only called after dirty-check) ──────── */

  _updateBlocks() {
    if (!this._built || !this._hass) return;
    this._renderStatus();
    // Skip controls re-render if a select/dropdown is focused inside it
    const cBlock = this.shadowRoot.getElementById("mw-controls");
    if (cBlock && !cBlock.contains(this.shadowRoot.activeElement)) {
      this._renderControls();
    }
    this._renderMaintenance();
  }

  _renderStatus() {
    const el = this.shadowRoot.getElementById("mw-status");
    const ms = this.shadowRoot.getElementById("mw-mini-stats");
    if (!el) return;
    const c = this._config, prog = this._num(this._st(c.sensors.progress)),
      status = this._st(c.sensors.status, "—"), task = this._st(c.sensors.current_task, ""),
      bat = this._num(this._st(c.sensors.battery)), charging = this._st(c.sensors.charging, ""),
      lState = this._st(c.entity, ""),
      isCharging = /charg/i.test(charging) || charging === "on",
      isMowing = /mow|cleaning|run/i.test(lState) || (prog > 0 && prog < 100);

    const badge = this.shadowRoot.getElementById("mw-badge");
    if (badge) {
      const t = isMowing ? "krypton" : "argon";
      badge.innerHTML = `<span class="mw-badge mw-badge-${t}">${this._cap(status || lState || "—")}</span>`;
    }

    // Mini stats sous le header
    if (ms) {
      const pEid = this._config.pause_entity;
      const paused = pEid && this._exists(pEid) && this._st(pEid) === "on";
      const pauseHTML = pEid && this._exists(pEid) ? `
        <button class="mw-mini-stat mw-mini-pause ${paused ? "mw-stat-pause" : "mw-stat-ok"}" data-act="toggle" data-eid="${pEid}" style="grid-column:1/-1;cursor:pointer;font:inherit;text-align:left;">
          <span class="mw-mini-l">Auto tonte</span>
          <ha-icon icon="${paused ? "mdi:pause-circle" : "mdi:robot-mower"}" class="mw-mini-ic mw-mini-ic-pause"></ha-icon>
          <span class="mw-mini-v">${paused ? "EN PAUSE" : "ACTIVE"}</span>
          <span class="mw-sw" aria-hidden="true"><span class="mw-sw-kn"></span></span>
        </button>` : "";
      ms.innerHTML = `
        <div class="mw-mini-stat ${isCharging ? "mw-stat-chg" : ""}">
          <span class="mw-mini-l">${isCharging ? "Charge" : "Batterie"}</span>
          <ha-icon icon="${this._batIcon(bat,isCharging)}" class="mw-mini-ic"></ha-icon>
          <span class="mw-mini-v">${bat.toFixed(0)}%</span>
        </div>
        <div class="mw-mini-stat">
          <span class="mw-mini-l">État</span>
          <ha-icon icon="mdi:radar" class="mw-mini-ic"></ha-icon>
          <span class="mw-mini-v">${this._cap(lState || "—")}</span>
        </div>
        ${pauseHTML}`;
    }

    // Hero progress + 3 boutons action
    el.innerHTML = `
      <div class="mw-hero">
        <div class="mw-hero-top">
          <span class="mw-hero-label">Progression</span>
          <span class="mw-hero-pct">${prog.toFixed(0)}%</span>
        </div>
        <div class="mw-bar-track"><div class="mw-bar-fill ${isMowing ? "mw-flowing" : ""}" style="width:${Math.max(0,Math.min(100,prog))}%"></div></div>
      </div>
      <div class="mw-action-btns">
        <button class="mw-act-btn mw-act-start" data-act="mower" data-svc="start_mowing" data-eid="${c.entity}">
          <ha-icon icon="mdi:play" class="mw-act-ic"></ha-icon>
          <span>Démarrer</span>
        </button>
        <button class="mw-act-btn mw-act-pause" data-act="mower" data-svc="pause" data-eid="${c.entity}">
          <ha-icon icon="mdi:pause" class="mw-act-ic"></ha-icon>
          <span>Pause</span>
        </button>
        <button class="mw-act-btn mw-act-dock" data-act="mower" data-svc="dock" data-eid="${c.entity}">
          <ha-icon icon="mdi:home-import-outline" class="mw-act-ic"></ha-icon>
          <span>Base</span>
        </button>
      </div>`;
  }

  _batIcon(l, ch) {
    const r = Math.round(l / 10) * 10;
    if (ch) return r >= 100 ? "mdi:battery-charging-100" : `mdi:battery-charging-${Math.max(20,r)}`;
    return r >= 100 ? "mdi:battery" : r <= 10 ? "mdi:battery-alert" : `mdi:battery-${r}`;
  }

  _renderControls() {
    const el = this.shadowRoot.getElementById("mw-controls");
    if (!el) return;
    const c = this._config, aEid = c.selects.mowing_action,
      aState = this._st(aEid, ""), aOpts = this._opts(aEid);
    const dds = [
      { k:"edge", l:"Edge", e:c.selects.edge, i:"mdi:vector-square" },
      { k:"map", l:"Map", e:c.selects.map, i:"mdi:map" },
      { k:"zone", l:"Zone", e:c.selects.zone, i:"mdi:texture-box" },
    ];
    el.innerHTML = `
      <div class="mw-label">Action</div>
      <div class="mw-big-grid">
        ${aOpts.length ? aOpts.map(o => `
          <button class="mw-big ${o === aState ? "mw-big-on" : ""}" data-act="sel" data-eid="${aEid}" data-val="${this._esc(o)}">
            <ha-icon icon="${this._actIcon(o)}" class="mw-big-ic"></ha-icon>
            <span class="mw-big-lb">${this._cap(o)}</span>
          </button>`).join("") : `<div class="mw-empty">${aEid} non trouvé</div>`}
      </div>
      <div class="mw-dd-grid">
        ${dds.map(d => {
          if (!this._exists(d.e)) return `<div class="mw-dd-w mw-dd-off"><ha-icon icon="${d.i}" class="mw-dd-ic"></ha-icon><span class="mw-dd-lb">${d.l}</span></div>`;
          return `<label class="mw-dd-w"><ha-icon icon="${d.i}" class="mw-dd-ic"></ha-icon><span class="mw-dd-lb">${d.l}</span><select class="mw-dd" data-act="sel" data-eid="${d.e}">${this._opts(d.e).map(o => `<option value="${this._esc(o)}" ${o === this._st(d.e) ? "selected" : ""}>${this._cap(o)}</option>`).join("")}</select></label>`;
        }).join("")}
      </div>`;
  }

  _actIcon(o) {
    const l = (o||"").toLowerCase();
    if (/mow|tondre|start/.test(l)) return "mdi:play";
    if (/edge|bordure/.test(l)) return "mdi:vector-square";
    if (/zone/.test(l)) return "mdi:texture-box";
    if (/spot/.test(l)) return "mdi:crosshairs-gps";
    if (/pause/.test(l)) return "mdi:pause";
    if (/dock|return|home/.test(l)) return "mdi:home-import-outline";
    if (/stop/.test(l)) return "mdi:stop";
    return "mdi:circle-medium";
  }

  _renderMaintenance() {
    const el = this.shadowRoot.getElementById("mw-maint");
    if (!el) return;
    const c = this._config, items = [
      { l:"Lames", e:c.sensors.blades, r:c.buttons.reset_blades, i:"mdi:fan" },
      { l:"Brosse", e:c.sensors.brush, r:c.buttons.reset_brush, i:"mdi:brush" },
      { l:"Maintenance", e:c.sensors.maintenance, r:c.buttons.reset_maintenance, i:"mdi:wrench" },
    ];
    const bt = this._st(c.sensors.bluetooth), code = this._st(c.sensors.device_code);
    el.innerHTML = `
      <button class="mw-acc ${this._maintOpen ? "mw-acc-open" : ""}" id="mw-acc">
        <ha-icon icon="mdi:wrench-cog" class="mw-acc-ic"></ha-icon>
        <span class="mw-acc-t">Maintenance</span>
        <ha-icon icon="mdi:chevron-down" class="mw-acc-ch"></ha-icon>
      </button>
      <div class="mw-acc-body" id="mw-acc-body" style="${this._maintOpen ? "" : "display:none"}">
        ${items.map(it => {
          if (!this._exists(it.e)) return `<div class="mw-mr mw-mr-off"><ha-icon icon="${it.i}" class="mw-mr-ic"></ha-icon><span class="mw-mr-lb">${it.l}</span><span class="mw-mr-na">n/a</span></div>`;
          const v = this._num(this._st(it.e)), p = Math.max(0,Math.min(100,v)),
            t = p < 20 ? "radon" : p < 50 ? "helium" : "krypton",
            u = this._attr(it.e,"unit_of_measurement","%") || "%";
          return `<div class="mw-mr"><ha-icon icon="${it.i}" class="mw-mr-ic"></ha-icon><span class="mw-mr-lb">${it.l}</span><div class="mw-mr-bw"><div class="mw-mr-bar mw-c-${t}" style="width:${p}%"></div></div><span class="mw-mr-pct">${p.toFixed(0)}${u}</span>${this._exists(it.r) ? `<button class="mw-mr-rst" data-act="press" data-eid="${it.r}" title="Reset ${it.l}"><ha-icon icon="mdi:restart"></ha-icon></button>` : ""}</div>`;
        }).join("")}
        <div class="mw-footer">
          ${bt ? `<span><ha-icon icon="mdi:bluetooth" class="mw-fi"></ha-icon>${this._cap(bt)}</span>` : ""}
          ${code ? `<span><ha-icon icon="mdi:identifier" class="mw-fi"></ha-icon>${code}</span>` : ""}
        </div>
      </div>`;
  }

  /* ── Events ─────────────────────────────────────────────────────────── */

  _wireEvents() {
    this.shadowRoot.addEventListener("click", ev => {
      const acc = ev.target.closest("#mw-acc");
      if (acc) {
        this._maintOpen = !this._maintOpen;
        const b = this.shadowRoot.getElementById("mw-acc-body");
        if (b) b.style.display = this._maintOpen ? "" : "none";
        acc.classList.toggle("mw-acc-open", this._maintOpen);
        return;
      }
      const btn = ev.target.closest("[data-act]");
      if (!btn || !this._hass) return;
      const eid = btn.dataset.eid;
      if (btn.dataset.act === "press") this._hass.callService("button", "press", { entity_id: eid });
      else if (btn.dataset.act === "toggle") this._hass.callService("input_boolean", "toggle", { entity_id: eid });
      else if (btn.dataset.act === "mower") this._hass.callService("lawn_mower", btn.dataset.svc, { entity_id: eid });
      else if (btn.dataset.act === "sel" && btn.tagName === "BUTTON") this._hass.callService("select", "select_option", { entity_id: eid, option: btn.dataset.val });
    });
    this.shadowRoot.addEventListener("change", ev => {
      const sel = ev.target.closest("select[data-act='sel']");
      if (sel && this._hass) this._hass.callService("select", "select_option", { entity_id: sel.dataset.eid, option: sel.value });
    });
  }

  /* ── Card-mod support (neon-header-card pattern) ────────────────────── */

  _collectCardModCSS() {
    if (!this.shadowRoot) return "";
    const styles = this.shadowRoot.querySelectorAll('style[id*="card-mod"]');
    let css = "";
    styles.forEach(el => { if (el.id !== "card-mod-mirror") css += (el.textContent || "") + "\n"; });
    return css;
  }

  _applyCardModStyles() {
    if (this._cardModApplying || !this.shadowRoot) return;
    this._cardModApplying = true;
    try {
      const mirror = this.shadowRoot.querySelector("#card-mod-mirror");
      if (!mirror) return;
      const mirrorCSS = this._collectCardModCSS();
      if (mirror.textContent !== mirrorCSS) mirror.textContent = mirrorCSS;
    } finally { this._cardModApplying = false; }
  }

  _setupCardModObserver() {
    if (this._cardModObserver || !this.shadowRoot) return;
    this._cardModObserver = new MutationObserver(() => {
      if (this._cardModApplying) return;
      clearTimeout(this._cardModDebounce);
      this._cardModDebounce = setTimeout(() => this._applyCardModStyles(), 100);
    });
    this._cardModObserver.observe(this.shadowRoot, { childList: true });
    this._cardModObserver.observe(this, { attributes: true, attributeFilter: ["style", "class"] });
  }

  /* ── Lifecycle ──────────────────────────────────────────────────────── */

  _cleanup() {
    if (this._root) { this._root.unmount(); this._root = null; }
    if (this._rafUpdate) { cancelAnimationFrame(this._rafUpdate); this._rafUpdate = null; }
    if (this._cardModObserver) { this._cardModObserver.disconnect(); this._cardModObserver = null; }
    clearTimeout(this._cardModDebounce); this._cardModDebounce = null;
    this._built = false;
    this._lastStates = {};
  }

  connectedCallback() {
    this._setupCardModObserver();
    this._applyCardModStyles();
    if (this._hass && this._config && !this._built) this._fullRender();
  }

  disconnectedCallback() { this._cleanup(); }

  /* ── Wrapper CSS ────────────────────────────────────────────────────── */

  _wrapperCSS() {
    const h = this._config.header || {};
    const tc = h.color || "rgba(180,130,255,0.65)";
    const tf = h.font ? `'${h.font}',` : "'Orbitron',";
    const ts = h.title_shadow || "0 0 8px color-mix(in srgb, currentColor, transparent 30%)";
    const cmBg = this._config.card_mod_bg;
    const flowAnim = MWC_IS_LOW_POWER ? "" : "animation:plasma-flow 3s linear infinite,plasma-pulse 2.5s ease-in-out infinite";
    return `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap');
:host{display:block;contain:layout style;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;--xenon:0,212,255;--argon:157,78,221;--krypton:46,229,182;--helium:255,238,88;--radon:224,17,95;--plasma:var(--rgb-plasma-uv-glow,157,78,221)}
ha-card{contain:layout style paint;box-sizing:border-box;border-radius:var(--ha-card-border-radius,18px);overflow:hidden;position:relative;${cmBg ? "background:var(--ha-card-background,var(--card-background-color,rgba(4,8,22,0.82)))" : "background:rgba(10,6,30,0.82)"};border:1px solid rgba(98,0,234,0.45);box-shadow:0 0 0 1px rgba(180,0,255,0.06),0 8px 32px rgba(0,0,0,0.55),0 0 40px rgba(98,0,234,0.10),inset 0 1px 0 rgba(255,255,255,0.05)}
ha-card::after{content:'';position:absolute;top:-50px;left:-50px;width:180px;height:180px;background:radial-gradient(circle,rgba(98,0,234,0.16) 0%,transparent 70%);pointer-events:none;z-index:0}
.mw-inner{position:relative;z-index:1}

/* React card overrides */
.dreame-vacuum-card{background:transparent;box-shadow:none;border-radius:0}
.dreame-vacuum-card__container{gap:0}
.vacuum-map{margin:0;box-shadow:0 0 20px rgba(var(--xenon),0.12),0 0 0 1px rgba(var(--xenon),0.18) inset;border-radius:12px}

/* Header */
.mw-hdr{display:flex;align-items:center;gap:8px;padding:11px 14px 8px;container-type:inline-size;font-family:${tf}var(--primary-font-family,system-ui)}
.mw-hdr-icon{display:flex;align-items:center;flex-shrink:0}
.mw-hdr-icon ha-icon{--mdc-icon-size:${h.title_size || "clamp(7px,2.6cqi,11px)"};color:${tc};filter:drop-shadow(0 0 8px color-mix(in srgb,currentColor,transparent 10%))}
.mw-hdr-title{font-family:${tf}var(--primary-font-family,system-ui);font-size:${h.title_size || "clamp(7px,2.6cqi,11px)"};padding-left:8px;color:${tc};letter-spacing:clamp(1px,0.5cqi,3px);text-transform:uppercase;text-shadow:${ts};line-height:1.2}
.mw-badge{font-family:'Orbitron',system-ui;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;padding:4px 10px;border-radius:20px;font-weight:500}
.mw-badge-krypton{background:rgba(var(--krypton),0.15);color:rgb(var(--krypton));border:1px solid rgba(var(--krypton),0.4);box-shadow:0 0 10px rgba(var(--krypton),0.3)}
.mw-badge-helium{background:rgba(var(--helium),0.15);color:rgb(var(--helium));border:1px solid rgba(var(--helium),0.4);box-shadow:0 0 10px rgba(var(--helium),0.3)}
.mw-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(var(--argon),0.55),rgba(var(--xenon),0.25),transparent);margin:0 14px}
.mw-map-slot{padding:10px 0}
.mw-block{padding:6px 16px}
.mw-block+.mw-block{border-top:1px solid rgba(var(--argon),0.12)}
.mw-label{font-family:'Orbitron',system-ui;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(var(--argon),0.7);margin:0 0 10px;font-weight:500;text-shadow:0 0 6px rgba(var(--argon),0.4)}

/* Status hero */
.mw-hero{margin-bottom:12px}
.mw-hero-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
.mw-hero-label{font-family:'Orbitron',system-ui;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(var(--xenon),0.7);font-weight:500;text-shadow:0 0 6px rgba(var(--xenon),0.3)}
.mw-hero-pct{font-family:'Orbitron',system-ui;font-size:22px;font-weight:700;color:rgb(var(--plasma));text-shadow:0 0 12px rgba(var(--plasma),0.6)}
.mw-bar-track{position:relative;height:10px;background:rgba(0,0,0,0.55);border-radius:5px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.7),inset 0 -1px 2px rgba(255,255,255,0.03),0 0 0 1px rgba(var(--plasma),0.25)}
.mw-bar-track::after{content:'';position:absolute;top:1px;left:2px;right:2px;height:3px;border-radius:2px;background:linear-gradient(to bottom,rgba(255,255,255,0.12),transparent);pointer-events:none;z-index:2}
.mw-bar-fill{position:relative;height:100%;background:linear-gradient(90deg,rgba(var(--plasma),0.45) 0%,rgba(var(--plasma),1) 40%,rgba(255,255,255,0.25) 60%,rgba(var(--plasma),0.8) 80%,rgba(var(--plasma),0.45) 100%);background-size:250% 100%;box-shadow:0 0 12px rgba(var(--plasma),0.7),0 0 24px rgba(var(--plasma),0.35),inset 0 1px 2px rgba(255,255,255,0.2);border-radius:5px;transition:width 0.6s cubic-bezier(0.4,0,0.2,1)}
.mw-flowing{${flowAnim}}
@keyframes plasma-flow{0%{background-position:250% 0}100%{background-position:-250% 0}}
@keyframes plasma-pulse{0%,100%{box-shadow:0 0 10px rgba(var(--plasma),0.6),0 0 20px rgba(var(--plasma),0.3),inset 0 1px 2px rgba(255,255,255,0.2)}50%{box-shadow:0 0 16px rgba(var(--plasma),0.85),0 0 32px rgba(var(--plasma),0.5),inset 0 1px 2px rgba(255,255,255,0.3)}}

/* Mini stats (sous header) */
.mw-mini-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:8px 14px 0}
.mw-mini-stat{display:flex;align-items:center;gap:6px;padding:6px 10px;background:rgba(255,255,255,0.025);border:1px solid rgba(var(--xenon),0.15);border-radius:8px}
.mw-mini-stat.mw-stat-chg{border-color:rgba(var(--helium),0.4);box-shadow:0 0 8px rgba(var(--helium),0.15);animation:mw-chg-pulse 2s ease-in-out infinite}
@keyframes mw-chg-pulse{0%,100%{border-color:rgba(var(--helium),0.4);box-shadow:0 0 8px rgba(var(--helium),0.15)}50%{border-color:rgba(var(--helium),0.75);box-shadow:0 0 16px rgba(var(--helium),0.45),inset 0 0 6px rgba(var(--helium),0.08)}}
.mw-mini-ic{--mdc-icon-size:16px;color:rgb(var(--xenon));filter:drop-shadow(0 0 4px rgba(var(--xenon),0.5));flex-shrink:0}
.mw-mini-stat.mw-stat-chg .mw-mini-ic{color:rgb(var(--helium));filter:drop-shadow(0 0 4px rgba(var(--helium),0.6))}
.mw-mini-v{font-family:'Orbitron',system-ui;font-size:11px;font-weight:700;color:#fff;margin-left:auto}
.mw-mini-l{font-family:'Orbitron',system-ui;font-size:8px;letter-spacing:1px;text-transform:uppercase;color:rgba(232,233,240,0.45)}

/* Action buttons */
.mw-action-btns{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px}
.mw-act-btn{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 6px;border-radius:12px;border:1px solid;background:rgba(20,24,40,0.5);font-family:'Orbitron',system-ui;font-size:8px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;transition:all .2s}
.mw-act-btn:active{transform:scale(0.95)}
.mw-act-ic{--mdc-icon-size:20px}
.mw-act-start{color:rgb(var(--krypton));border-color:rgba(var(--krypton),0.4);box-shadow:0 0 10px rgba(var(--krypton),0.1)}
.mw-act-start:hover{background:rgba(var(--krypton),0.1);border-color:rgba(var(--krypton),0.7);box-shadow:0 0 16px rgba(var(--krypton),0.3)}
.mw-act-start .mw-act-ic{color:rgb(var(--krypton));filter:drop-shadow(0 0 5px rgba(var(--krypton),0.6))}
.mw-act-pause{color:rgb(var(--helium));border-color:rgba(var(--helium),0.4);box-shadow:0 0 10px rgba(var(--helium),0.1)}
.mw-act-pause:hover{background:rgba(var(--helium),0.1);border-color:rgba(var(--helium),0.7);box-shadow:0 0 16px rgba(var(--helium),0.3)}
.mw-act-pause .mw-act-ic{color:rgb(var(--helium));filter:drop-shadow(0 0 5px rgba(var(--helium),0.6))}
.mw-act-dock{color:rgb(var(--argon));border-color:rgba(var(--argon),0.4);box-shadow:0 0 10px rgba(var(--argon),0.1)}
.mw-act-dock:hover{background:rgba(var(--argon),0.1);border-color:rgba(var(--argon),0.7);box-shadow:0 0 16px rgba(var(--argon),0.3)}
.mw-act-dock .mw-act-ic{color:rgb(var(--argon));filter:drop-shadow(0 0 5px rgba(var(--argon),0.6))}

/* Big buttons */
.mw-big-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:8px;margin-bottom:12px}
.mw-big{padding:12px 6px;border-radius:12px;background:rgba(20,24,40,0.5);border:1px solid rgba(var(--xenon),0.25);color:rgba(232,233,240,0.75);font-family:'Orbitron',system-ui;font-size:clamp(8px,2.5vw,10px);font-weight:500;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;transition:all .2s}
.mw-big:hover{border-color:rgba(var(--xenon),0.5);background:rgba(var(--xenon),0.06)}
.mw-big:active{transform:scale(0.96)}
.mw-big-ic{--mdc-icon-size:22px;color:rgba(var(--xenon),0.7)}
.mw-big-on{background:rgba(var(--xenon),0.12);border-color:rgb(var(--xenon));color:rgb(var(--xenon));box-shadow:0 0 18px rgba(var(--xenon),0.35),inset 0 0 12px rgba(var(--xenon),0.08);transform:translateY(-1px)}
.mw-big-on .mw-big-ic{color:rgb(var(--xenon));filter:drop-shadow(0 0 6px rgba(var(--xenon),0.6))}
.mw-big-lb{line-height:1.1}

/* Dropdowns */
.mw-dd-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}
.mw-dd-w{display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(0,0,0,0.3);border:1px solid rgba(var(--argon),0.25);border-radius:10px}
.mw-dd-w:focus-within{border-color:rgba(var(--xenon),0.5);box-shadow:0 0 0 2px rgba(var(--xenon),0.15)}
.mw-dd-off{opacity:.4;pointer-events:none}
.mw-dd-ic{--mdc-icon-size:16px;color:rgba(var(--argon),0.7);flex-shrink:0}
.mw-dd-lb{font-family:'Orbitron',system-ui;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:rgba(var(--argon),0.7);font-weight:500}
.mw-dd{flex:1;background:transparent;border:none;color:#e8e9f0;font-size:12px;font-family:inherit;appearance:none;cursor:pointer;outline:none;padding-right:18px;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300D4FF' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right 0 center;background-size:12px}
.mw-dd option{background:#14182a;color:#e8e9f0}
.mw-empty{font-size:11px;color:rgba(232,233,240,0.4);padding:8px;grid-column:1/-1;text-align:center}

/* Maintenance accordion */
.mw-acc{width:100%;display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(255,255,255,0.02);border:1px solid rgba(var(--argon),0.2);border-radius:10px;color:rgba(232,233,240,0.8);cursor:pointer;font-family:'Orbitron',system-ui;transition:all .2s}
.mw-acc:hover{background:rgba(var(--argon),0.06);border-color:rgba(var(--argon),0.4)}
.mw-acc-ic{--mdc-icon-size:18px;color:rgba(var(--argon),0.8)}
.mw-acc-t{flex:1;text-align:left;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500}
.mw-acc-ch{--mdc-icon-size:18px;color:rgba(var(--argon),0.6);transition:transform .3s}
.mw-acc-open .mw-acc-ch{transform:rotate(180deg)}
.mw-acc-body{margin-top:10px;padding:8px 4px;display:flex;flex-direction:column;gap:8px}
.mw-mr{display:flex;align-items:center;gap:10px;padding:8px 10px;background:rgba(0,0,0,0.25);border-radius:8px}
.mw-mr-off{opacity:.4}
.mw-mr-ic{--mdc-icon-size:16px;color:rgba(var(--argon),0.7);flex-shrink:0}
.mw-mr-lb{font-family:'Orbitron',system-ui;font-size:11px;font-weight:500;color:rgba(232,233,240,0.85);min-width:80px}
.mw-mr-bw{flex:1;height:6px;background:rgba(0,0,0,0.5);border-radius:3px;overflow:hidden;box-shadow:inset 0 0 4px rgba(0,0,0,0.6)}
.mw-mr-bar{height:100%;border-radius:3px;transition:width .4s}
.mw-c-krypton{background:rgb(var(--krypton));box-shadow:0 0 8px rgba(var(--krypton),0.5)}
.mw-c-helium{background:rgb(var(--helium));box-shadow:0 0 8px rgba(var(--helium),0.5)}
.mw-c-radon{background:rgb(var(--radon));box-shadow:0 0 8px rgba(var(--radon),0.5)}
.mw-mr-pct{font-family:'Orbitron',system-ui;font-size:11px;font-weight:700;color:#fff;min-width:38px;text-align:right}
.mw-mr-na{font-size:10px;color:rgba(232,233,240,0.4);margin-left:auto}
.mw-mr-rst{background:rgba(var(--xenon),0.08);border:1px solid rgba(var(--xenon),0.3);border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:rgb(var(--xenon));cursor:pointer;flex-shrink:0;transition:all .2s}
.mw-mr-rst ha-icon{--mdc-icon-size:14px}
.mw-mr-rst:hover{background:rgba(var(--xenon),0.18);transform:rotate(-90deg)}
.mw-mr-rst:active{transform:rotate(-180deg) scale(0.9)}
.mw-footer{display:flex;flex-wrap:wrap;gap:12px;padding:10px 6px 4px;font-size:9px;letter-spacing:.5px;color:rgba(232,233,240,0.4);font-family:'Orbitron',system-ui}
.mw-footer span{display:inline-flex;align-items:center;gap:4px}
.mw-fi{--mdc-icon-size:12px;color:rgba(var(--argon),0.5)}

/* Pause banner */
.mw-mini-pause{transition:all .2s;background:rgba(255,255,255,0.025);border:1px solid rgba(var(--xenon),0.15);border-radius:8px;padding:6px 10px;}
.mw-mini-ic-pause{--mdc-icon-size:16px;flex-shrink:0}
.mw-stat-ok{border-color:rgba(var(--krypton),0.3)}
.mw-stat-ok .mw-mini-ic-pause{color:rgb(var(--krypton));filter:drop-shadow(0 0 4px rgba(var(--krypton),0.5))}
.mw-stat-pause{border-color:rgba(var(--radon),0.45);animation:mw-pause-pulse 2s ease-in-out infinite}
.mw-stat-pause .mw-mini-ic-pause{color:rgb(var(--radon));filter:drop-shadow(0 0 5px rgba(var(--radon),0.5))}
.mw-mini-pause:hover{filter:brightness(1.15)}
/* valeur colorée selon l'état + interrupteur (toggle auto-tonte) */
.mw-mini-pause .mw-mini-v{transition:color .25s}
.mw-stat-ok .mw-mini-v{color:rgb(var(--krypton))}
.mw-stat-pause .mw-mini-v{color:rgb(var(--radon))}
.mw-sw{margin-left:auto;width:44px;height:22px;border-radius:20px;position:relative;flex-shrink:0;border:1px solid;transition:background .25s,border-color .25s}
.mw-sw-kn{position:absolute;top:2px;width:16px;height:16px;border-radius:50%;transition:left .25s,background .25s;box-shadow:0 1px 3px rgba(0,0,0,0.5)}
.mw-stat-ok .mw-sw{background:rgba(var(--krypton),0.18);border-color:rgba(var(--krypton),0.5)}
.mw-stat-ok .mw-sw-kn{left:24px;background:rgb(var(--krypton))}
.mw-stat-pause .mw-sw{background:rgba(var(--radon),0.18);border-color:rgba(var(--radon),0.5)}
.mw-stat-pause .mw-sw-kn{left:2px;background:rgb(var(--radon))}
@keyframes mw-pause-pulse{0%,100%{border-color:rgba(var(--radon),0.45)}50%{border-color:rgba(var(--radon),0.8);box-shadow:0 0 14px rgba(var(--radon),0.25)}}

/* iPad — animations OFF */
${MWC_IS_LOW_POWER ? `.mw-flowing{animation:none !important}` : ""}
`;
  }
}

if (!customElements.get("mova-mower-card")) {
  customElements.define("mova-mower-card", hv);
}
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === "mova-mower-card")) {
  window.customCards.push({
    type: "mova-mower-card",
    name: "Mova Mower Card",
    description: "Cyberpunk mower card with map, status, controls and maintenance"
  });
}
console.info("Mova Mower Card loaded");

console.info(
  '%c 🌿 mova-mower-card v12.771 %c Neo Tokyo ',
  'background:#2EE5B6;color:#000;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold;',
  'background:#040811;color:#6200EA;padding:2px 4px;border-radius:0 3px 3px 0;'
);
