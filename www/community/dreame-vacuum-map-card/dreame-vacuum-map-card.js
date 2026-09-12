
(function() {
  const style = document.createElement('style');
  style.textContent = ".header{padding:1.25rem 1.25rem .625rem;text-align:center;padding-bottom:unset}.header__top{display:flex;justify-content:space-between;align-items:flex-start}.header__title-wrapper{flex:1;text-align:center;padding-left:2rem}[dir=rtl] .header__title-wrapper{padding-left:0;padding-right:2rem}.header__settings-btn{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;padding:0;background:none;border:none;color:var(--text-secondary, #666);cursor:pointer;border-radius:.5rem;transition:all .2s ease}.header__settings-btn svg{width:1.25rem;height:1.25rem}.header__settings-btn:hover{background:var(--hover-bg, rgba(0, 0, 0, .05));color:var(--text-primary, #1a1a1a)}.header__settings-btn:active{background:var(--active-bg, rgba(0, 0, 0, .1))}.header__title{margin:0;font-size:1rem;font-weight:600;color:var(--text-primary, #1a1a1a)}.header__status{margin:0;font-size:.875rem;color:var(--text-secondary, #666)}.header__progress{margin:0 auto;max-width:12.5rem}.header__progress-bar{width:100%;height:.25rem;background-color:var(--surface-tertiary, #e8e8e8);border-radius:.25rem;overflow:hidden}.header__progress-fill{height:100%;background-color:var(--accent-color, #007aff);transition:width .3s ease}.header__progress-text{margin:.25rem 0 0;font-size:.75rem;color:var(--text-tertiary, #999)}.header__stats{display:flex;justify-content:center;gap:1.25rem;font-size:1rem;color:var(--text-primary, #1a1a1a);margin-top:.875rem;align-items:center}.header__stat{display:flex;align-items:center;gap:.25rem}.header__stat-icon{display:flex;color:var(--accent-color)}.header__stat-icon--cleaning-time,.header__stat-icon--area{display:flex}.header__stat-icon--cleaning-time svg,.header__stat-icon--area svg{scale:.8}.header__stat-value{display:flex;font-weight:500;unicode-bidi:plaintext}.header__stat-value--cleaning-time{unicode-bidi:unset}.map-selector{position:relative;display:flex;justify-content:center}.map-selector__button{display:inline-flex;align-items:center;gap:.375rem;padding:.375rem .75rem;background:var(--surface-bg, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:1.25rem;color:var(--text-primary, #1a1a1a);font-size:.8125rem;font-weight:500;cursor:pointer;transition:all .2s ease}.map-selector__button:hover{background:var(--surface-bg-hover, #ebebeb)}.map-selector__button--open{background:var(--surface-bg-hover, #ebebeb);border-color:var(--accent-color, #007aff)}.map-selector__button--disabled,.map-selector__button:disabled{opacity:.5;cursor:not-allowed}.map-selector__icon{display:flex;align-items:center;color:var(--text-secondary, #666)}.map-selector__icon svg{width:1rem;height:1rem}.map-selector__label{max-width:8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.map-selector__chevron{width:1rem;height:1rem;color:var(--text-secondary, #666);transition:transform .2s ease}.map-selector__chevron--open{transform:rotate(180deg)}.map-selector__dropdown{position:absolute;top:calc(100% + .25rem);left:50%;transform:translate(-50%);min-width:10rem;max-width:14rem;background:var(--surface-bg, #fff);border:1px solid var(--border-color, #e0e0e0);border-radius:.75rem;box-shadow:var(--card-shadow, 0 4px 12px rgba(0, 0, 0, .1));overflow:hidden;z-index:100;animation:map-selector-dropdown-fade-in .15s ease}.map-selector__option{display:flex;align-items:center;justify-content:space-between;width:100%;padding:.625rem .875rem;background:transparent;border:none;color:var(--text-primary, #1a1a1a);font-size:.875rem;text-align:start;cursor:pointer;transition:background .15s ease}.map-selector__option:hover{background:var(--surface-bg-hover, #f5f5f5)}.map-selector__option--selected{color:var(--accent-color, #007aff);font-weight:500}.map-selector__option:not(:last-child){border-bottom:1px solid var(--border-color, #e8e8e8)}.map-selector__option-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:.5rem}[dir=rtl] .map-selector__option-name{padding-right:0;padding-left:.5rem}.map-selector__option-check{width:1rem;height:1rem;color:var(--accent-color, #007aff);flex-shrink:0}@keyframes map-selector-dropdown-fade-in{0%{opacity:0;transform:translate(-50%) translateY(-.25rem)}to{opacity:1;transform:translate(-50%) translateY(0)}}.cleaning-mode-button-wrapper{margin:.625rem 1.25rem;width:calc(100% - 2.5rem);display:flex;align-items:center;gap:.5rem;margin-bottom:unset}.cleaning-mode-button-wrapper__repeats{background:var(--accent-color, #007aff);color:#fff;border:none;border-radius:50%;width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.9rem;font-weight:600;flex-shrink:0;transition:transform .2s,opacity .2s;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-button-wrapper__repeats:hover:not(:disabled){transform:scale(1.1);opacity:.9;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button-wrapper__repeats:active:not(:disabled){transform:scale(.95)}.cleaning-mode-button-wrapper__repeats:disabled{opacity:.5;cursor:not-allowed}.cleaning-mode-button-wrapper__shortcuts{background:var(--accent-color, #007aff);color:#fff;border:none;border-radius:50%;width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;flex-shrink:0;transition:transform .2s,opacity .2s;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-button-wrapper__shortcuts svg{scale:.8}.cleaning-mode-button-wrapper__shortcuts:hover:not(:disabled){transform:scale(1.1);opacity:.9;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button-wrapper__shortcuts:active:not(:disabled){transform:scale(.95)}.cleaning-mode-button-wrapper__shortcuts:disabled{opacity:.5;cursor:not-allowed}.cleaning-mode-button{flex:1;background:var(--surface-bg, #fff);border:none;border-radius:.75rem;padding:.75rem 1rem .75rem .5rem;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08));color:var(--text-primary, #1a1a1a);font-weight:400;font-size:.9375rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:transform .1s ease}.cleaning-mode-button:hover:not(:disabled){box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button:active:not(:disabled){transform:scale(.98)}.cleaning-mode-button--disabled,.cleaning-mode-button:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.cleaning-mode-button__content{display:flex;align-items:center}.cleaning-mode-button__icon{scale:.7;display:flex}.cleaning-mode-button__text{font-weight:400;font-size:.8rem}.cleaning-mode-button__arrow{font-size:1.25rem;color:var(--text-tertiary, #999)}.map-controls{position:absolute;top:.75rem;right:.75rem}[dir=rtl] .map-controls{right:auto;left:.75rem}.map-controls{display:flex;flex-direction:column;gap:.25rem;z-index:10}.map-controls__button{width:2.25rem;height:2.25rem;border-radius:.5rem;background:var(--surface-bg, #fff);border:1px solid var(--border-color, #e0e0e0);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-primary, #1a1a1a);box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .1));transition:all .2s ease}.map-controls__button:hover{background:var(--surface-secondary, #f5f5f5);transform:scale(1.05)}.map-controls__button:active{transform:scale(.95)}.map-controls__button svg{transition:transform .2s ease}.map-controls__button--lock{margin-top:.25rem}.map-controls__button--locked{background:var(--accent-color, #007aff);border-color:var(--accent-color, #007aff);color:#fff}.map-controls__button--locked:hover{background:var(--accent-hover, #0066d6);border-color:var(--accent-hover, #0066d6)}.room-list-view{position:absolute;inset:0;background:var(--surface-bg, #fff);border-radius:.9375rem;display:flex;flex-direction:column;overflow:hidden}.room-list-view__header{padding:.75rem 3.5rem .75rem 1rem}[dir=rtl] .room-list-view__header{padding-right:0;padding-left:3.5rem}.room-list-view__header{padding-left:1rem}[dir=rtl] .room-list-view__header{padding-left:0;padding-right:1rem}.room-list-view__header{font-size:.875rem;color:var(--text-secondary, #666);background:var(--surface-secondary, #f5f5f5);border-bottom:1px solid var(--border-color, #e0e0e0);flex-shrink:0}.room-list-view__list{flex:1;overflow-y:auto;padding:.5rem;display:flex;flex-direction:column;gap:.5rem}.room-list-view__list::-webkit-scrollbar{width:.25rem}.room-list-view__list::-webkit-scrollbar-track{background:transparent}.room-list-view__list::-webkit-scrollbar-thumb{background:var(--surface-tertiary, #ccc);border-radius:.125rem}.room-list-view__empty{flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-tertiary, #999);font-size:.875rem}.room-list-view__item{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:var(--surface-secondary, #f5f5f5);border:2px solid transparent;border-radius:.75rem;cursor:pointer;transition:all .2s ease;width:100%;text-align:left}[dir=rtl] .room-list-view__item{text-align:right}.room-list-view__item:hover{background:var(--surface-tertiary, #ebebeb)}.room-list-view__item:active{transform:scale(.98)}.room-list-view__item--selected{background:var(--accent-bg-transparent, rgba(212, 175, 55, .1));border-color:var(--accent-color, #d4af37)}.room-list-view__item--selected:hover{background:var(--accent-bg-transparent, rgba(212, 175, 55, .15))}.room-list-view__item-name{flex:1;font-size:.9375rem;font-weight:500;color:var(--text-primary, #1a1a1a);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.room-list-view__item-check{width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--accent-color, #d4af37)}.vacuum-position-marker{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10}.vacuum-position-marker__bg{fill:var(--vacuum-marker-bg, rgba(255, 255, 255, .9));stroke:var(--vacuum-marker-stroke, #4caf50);stroke-width:2;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}.vacuum-position-marker__icon{fill:var(--vacuum-marker-color, #4caf50)}.vacuum-position-marker--cleaning .vacuum-position-marker__bg{animation:vacuum-pulse 1.5s ease-in-out infinite}.charger-marker{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5}.charger-marker__bg{fill:var(--charger-marker-bg, rgba(255, 255, 255, .9));stroke:var(--charger-marker-stroke, #ffc107);stroke-width:2;filter:drop-shadow(0 1px 3px rgba(0,0,0,.25))}.charger-marker__icon{fill:var(--charger-marker-color, #ffc107)}@keyframes vacuum-pulse{0%{opacity:1}50%{opacity:.7}to{opacity:1}}.room-labels{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:8}.room-labels__bg{fill:var(--room-label-bg, rgba(0, 0, 0, .7))}.room-labels__text{fill:var(--room-label-color, #fff);font-weight:500;font-family:inherit}.vacuum-map{position:relative;margin:0 1.25rem;border-radius:.9375rem;overflow:hidden;background:var(--surface-bg, #fff);box-shadow:0 .25rem .9375rem var(--card-shadow, rgba(0, 0, 0, .1));min-height:18.75rem;--map-max-height-fallback: none}@media(orientation:landscape){.vacuum-map{--map-max-height-fallback: calc(100vh - 280px) ;min-height:min(18.75rem,100vh - 280px)}@supports (height: 100dvh){.vacuum-map{--map-max-height-fallback: calc(100dvh - 280px) }}}.vacuum-map--locked .react-transform-wrapper{touch-action:pan-y}.vacuum-map__content{position:relative;display:inline-block;width:100%;height:100%}.vacuum-map__image{display:block;width:100%;height:auto;max-height:var(--map-max-height, var(--map-max-height-fallback, none));object-fit:contain;border-radius:.9375rem;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}.dreame-vacuum-card--dark .vacuum-map .vacuum-map__image{filter:brightness(.8) contrast(.9) saturate(.85)}.vacuum-map__placeholder{color:#666;text-align:center;font-size:.875rem}.vacuum-map__placeholder small{font-size:.75rem;color:#999}.vacuum-map__overlay{position:absolute;inset:0;background:#0000000d;border-radius:.9375rem;display:flex;align-items:center;justify-content:center;font-size:.875rem;color:#666;pointer-events:none}.vacuum-map__cycles{position:absolute;right:1rem}[dir=rtl] .vacuum-map__cycles{right:auto;left:1rem}.vacuum-map__cycles{bottom:1rem;width:2.5rem;height:2.5rem;border-radius:25%;border-radius:.375rem}.vacuum-map__zone{position:absolute;border:.1875rem solid #007aff;background:repeating-linear-gradient(45deg,#007aff1a,#007aff1a .625rem,#007aff0d .625rem 1.25rem);pointer-events:auto;border-radius:.5rem;box-shadow:0 .125rem .75rem #007aff4d}.vacuum-map__zone-container{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto}.vacuum-map__zone-handle{position:absolute;background:#007aff;border:.125rem solid white;border-radius:.25rem;pointer-events:auto;box-shadow:0 .125rem .25rem #0003;transition:background .2s ease;z-index:10;touch-action:none}.vacuum-map__zone-handle:before{content:\"\";position:absolute;inset:-.5rem}.vacuum-map__zone-handle:hover{background:#0051d5}.vacuum-map__zone-handle:active{background:#003d99}.vacuum-map__zone-handle--top,.vacuum-map__zone-handle--bottom{width:2.5rem;height:.5rem;left:50%;cursor:ns-resize}.vacuum-map__zone-handle--top{top:-.25rem}.vacuum-map__zone-handle--bottom{bottom:-.25rem}.vacuum-map__zone-handle--left,.vacuum-map__zone-handle--right{width:.5rem;height:2.5rem;top:50%;cursor:ew-resize}.vacuum-map__zone-handle--left{left:-.25rem}[dir=rtl] .vacuum-map__zone-handle--left{left:auto;right:-.25rem}.vacuum-map__zone-handle--right{right:-.25rem}[dir=rtl] .vacuum-map__zone-handle--right{right:auto;left:-.25rem}.vacuum-map__zone-clear{position:absolute;top:-.75rem;right:-.75rem}[dir=rtl] .vacuum-map__zone-clear{right:auto;left:-.75rem}.vacuum-map__zone-clear{width:1.5rem;height:1.5rem;border-radius:50%;background:#ff3b30;color:#fff;border:.125rem solid white;font-size:1.125rem;font-weight:700;cursor:pointer;pointer-events:auto;display:flex;align-items:center;justify-content:center;box-shadow:0 .125rem .5rem #ff3b3066;transition:background .2s ease;line-height:1;padding:0;z-index:11}.vacuum-map__zone-clear:hover{background:#ff1f0f}.vacuum-map__zone-clear:active{background:#c00}.vacuum-map__room-segments{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.vacuum-map__room-segments path{pointer-events:auto}.vacuum-map__room-segment{cursor:pointer;transition:all .2s ease}.vacuum-map__room-segment:hover:not(.vacuum-map__room-segment--selected){fill:#ffffff26;stroke:#ffffffe6;stroke-width:3;filter:drop-shadow(0 0 8px rgba(255,255,255,.6))}.vacuum-map__room-segment--selected{fill:var(--accent-bg, rgba(212, 175, 55, .3));stroke:var(--accent-color, #d4af37);stroke-width:3}.vacuum-map__room-segment--selected:hover{fill:var(--accent-bg-hover, rgba(212, 175, 55, .45));filter:drop-shadow(0 0 6px var(--accent-color-shadow-color, rgba(212, 175, 55, .5)))}.vacuum-map__rooms{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.vacuum-map__room{position:absolute;transform:translate(-50%,-50%);width:2rem;height:2rem;border-radius:50%;background:#ffffffe6;border:.125rem solid var(--border-color, #e0e0e0);display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:600;color:var(--text-primary, #1a1a1a);cursor:pointer;pointer-events:auto;transition:all .2s ease;box-shadow:0 .125rem .25rem #0000001a;z-index:2}.vacuum-map__room:hover{transform:translate(-50%,-50%) scale(1.1);background:#fff;box-shadow:0 .25rem .5rem #00000026}.vacuum-map__room--selected{background:var(--accent-color, #d4af37);color:#fff;border-color:var(--accent-color, #d4af37);box-shadow:0 .125rem .5rem var(--accent-color-shadow-color, rgba(212, 175, 55, .4))}.vacuum-map__room--selected:hover{transform:translate(-50%,-50%) scale(1.1);box-shadow:0 .25rem .75rem var(--accent-color-shadow-color, rgba(212, 175, 55, .5))}.mode-tabs{display:flex;gap:.25rem;background:var(--surface-tertiary, #e8e8e8);border-radius:.9375rem;padding:.25rem;margin-bottom:.9375rem}.mode-tabs--disabled{opacity:.5;pointer-events:none}.mode-tabs__button{flex:1;display:flex;align-items:center;justify-content:center;border:none;border-radius:.6875rem;padding:.625rem;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .2s;background-color:transparent;color:var(--text-secondary, #666)}.mode-tabs__button-icon svg{scale:.5;color:var(--text-secondary, #666)}.mode-tabs__button--active{background-color:var(--surface-bg, white);color:var(--text-primary, #000);box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .1))}.mode-tabs__button:hover:not(.mode-tabs__button--active):not(:disabled){background-color:var(--surface-bg-hover, rgba(255, 255, 255, .5))}.mode-tabs__button:disabled{cursor:not-allowed}.action-buttons{display:flex;gap:.75rem;margin-top:.9375rem}.action-buttons__clean,.action-buttons__dock,.action-buttons__pause,.action-buttons__resume,.action-buttons__stop{flex:1;background:var(--accent-bg);border:.0625rem solid var(--accent-bg);border-radius:.875rem;padding:.575rem;font-size:.9375rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;transition:all .3s cubic-bezier(.16,1,.3,1);color:var(--text-primary)}.action-buttons__clean--selected,.action-buttons__dock--selected,.action-buttons__pause--selected,.action-buttons__resume--selected,.action-buttons__stop--selected{transform:translateY(-.125rem);border:.0625rem solid var(--toggle-active-border);box-shadow:0 .625rem 1.25rem #0006,0 0 .75rem #5865f240,inset 0 .0625rem .0625rem #ffffff1a!important}.action-buttons__clean{color:#fff;background:var(--accent-color)}.action-buttons__pause{color:var(--accent-color);border-color:var(--accent-color-hover)}.action-buttons__resume{color:#32d74b;border-color:#32d74b80}.action-buttons__stop{color:#ff453a;border-color:#ff453a80}.action-buttons__dock{background:var(--surface-secondary);color:var(--text-secondary)}.accordion{border-radius:.75rem;background:var(--card-bg, rgba(255, 255, 255, .8));overflow:hidden;margin-bottom:.5rem}.accordion__header{display:flex;align-items:center;justify-content:space-between;width:100%;padding:.875rem 1rem;background:none;border:none;cursor:pointer;color:var(--text-primary, #000);font-size:.9375rem;font-weight:500;text-align:left}[dir=rtl] .accordion__header{text-align:right}.accordion__header{transition:background-color .2s ease}.accordion__header:hover{background:var(--hover-bg, rgba(0, 0, 0, .03))}.accordion__header:active{background:var(--active-bg, rgba(0, 0, 0, .06))}.accordion__title-wrapper{display:flex;align-items:center;gap:.625rem}.accordion__icon{display:flex;align-items:center;justify-content:center;color:var(--accent-color, #007aff)}.accordion__icon svg{width:1.25rem;height:1.25rem}.accordion__title{font-weight:500}.accordion__chevron{width:1.25rem;height:1.25rem;color:var(--text-secondary, #666);transition:transform .3s ease}.accordion__content{max-height:0;overflow:hidden;transition:max-height .3s ease}.accordion__content-inner{padding:0 1rem 1rem}.accordion--open .accordion__chevron{transform:rotate(180deg)}.accordion--open .accordion__content{max-height:1000px}.toggle{position:relative;display:inline-block;width:3.1875rem;height:1.9375rem}.toggle__input{opacity:0;width:0;height:0}.toggle__slider{position:absolute;cursor:pointer;inset:0;background-color:var(--surface-tertiary, #e0e0e0);transition:.4s;border-radius:1.9375rem}.toggle__knob{position:absolute;height:1.6875rem;width:1.6875rem;left:.125rem}[dir=rtl] .toggle__knob{left:auto;right:.125rem}.toggle__knob{bottom:.125rem;background-color:var(--surface-bg, white);transition:.4s;border-radius:50%;box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .2))}.toggle__input:checked+.toggle__slider{background-color:var(--toggle-active);border:.125rem solid var(--toggle-active-border);box-shadow:0 0 0 .25rem var(--toggle-active-shadow-color)}.toggle__input:checked+.toggle__slider .toggle__knob{transform:translate(1.25rem)}[dir=rtl] .toggle__input:checked+.toggle__slider .toggle__knob{transform:translate(-1.25rem)}.toggle--disabled{opacity:.5;pointer-events:none}.circular-button{display:flex;flex-direction:column;align-items:center;gap:.5rem}.circular-button:hover:not(.circular-button--disabled){transform:translateY(-.125rem)}.circular-button--disabled{opacity:.5;pointer-events:none}.circular-button__circle{border-radius:50%;background:var(--surface-secondary, #f5f5f5);display:flex;align-items:center;justify-content:center;cursor:pointer;border:.0625rem solid var(--text-primary, black);transition:all .2s ease;color:var(--text-primary)}[dir=rtl] .circular-button__circle>:nth-child(2):not(:last-child){rotate:180deg}.circular-button__circle--small{width:3.5rem;height:3.5rem;font-size:1.5rem}.circular-button__circle--medium{width:4.5rem;height:4.5rem;font-size:1.75rem}.circular-button__circle--large{width:5.5rem;height:5.5rem;font-size:2rem}.circular-button__circle--selected{background:var(--toggle-active);border:.1875rem solid var(--toggle-active-border);box-shadow:0 0 0 .25rem var(--toggle-active-shadow-color);color:var(--text-primary)}.circular-button__circle:hover:not(.circular-button__circle--selected){background:var(--surface-tertiary, #ebebeb)}.circular-button__circle:active{transform:scale(.95)}.circular-button__icon{display:flex;align-items:center;justify-content:center}.circular-button__icon--svg{width:100%;height:100%;color:var(--text-primary, #1a1a1a)}.circular-button__icon--svg svg{width:100%;height:100%;display:block}.circular-button__circle--selected .circular-button__icon--svg{color:#fff}.circular-button__label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center;line-height:1.2}.modal{position:absolute;inset:20% 0 0;background:var(--surface-bg, #f5f5f7);border-radius:1.25rem 1.25rem 0 0;padding:0 1.25rem 1.25rem;z-index:1000;max-height:80vh;overflow-y:hidden;color:var(--text-primary, black)}.modal::-webkit-scrollbar{display:none}.modal__backdrop{position:absolute;inset:0;background:var(--backdrop-bg, rgba(0, 0, 0, .4));z-index:999;border-radius:1.25rem}.modal__handle{width:2.25rem;height:.3125rem;background:var(--handle-bg, rgba(0, 0, 0, .15));border-radius:.1875rem;margin:.75rem auto 1.25rem}.modal__content{height:90%}.segmented-control{display:flex;gap:.5rem;background:var(--surface-tertiary, #e8e8e8);border-radius:.75rem;padding:.25rem}.segmented-control--disabled{opacity:.5;pointer-events:none}.segmented-control__button{flex:1;border:none;border-radius:.625rem;padding:.75rem;font-size:.9375rem;font-weight:500;cursor:pointer;background-color:transparent;color:var(--text-primary, #1a1a1a);transition:all .2s}.segmented-control__button--active{background-color:var(--surface-bg, white);box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .08))}.segmented-control__button:hover:not(.segmented-control__button--active){background-color:var(--surface-bg-hover, rgba(255, 255, 255, .5))}.toast{position:absolute;top:1.25rem;left:50%;transform:translate(-50%);background:var(--surface-bg, #ffffff);border:.0625rem solid var(--border-color, #e0e0e0);border-radius:.5rem;padding:.75rem 1rem;display:flex;align-items:center;gap:.75rem;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12));animation:toast-slide-down .3s ease-out;z-index:1000;max-width:90%}@keyframes toast-slide-down{0%{transform:translate(-50%) translateY(-1.25rem);opacity:0}to{transform:translate(-50%) translateY(0);opacity:1}}.toast__message{color:var(--text-primary, #1a1a1a);font-size:.875rem}.toast__close{background:none;border:none;color:var(--text-secondary, #666666);font-size:1.5rem;cursor:pointer;padding:0;width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;line-height:1;transition:color .2s}.toast__close:hover{color:var(--text-primary, #1a1a1a)}.error-boundary{display:flex;align-items:center;justify-content:center;min-height:200px;padding:1.5rem;background:var(--surface-bg, #f5f5f5);border-radius:.75rem}.error-boundary__content{text-align:center;max-width:300px}.error-boundary__icon{width:48px;height:48px;margin:0 auto 1rem;background:var(--error-color, #ff3b30);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700}.error-boundary__title{margin:0 0 .5rem;font-size:1.125rem;font-weight:600;color:var(--text-primary, #1a1a1a)}.error-boundary__message{margin:0 0 1rem;font-size:.875rem;color:var(--text-secondary, #666);line-height:1.4}.error-boundary__retry{padding:.5rem 1rem;background:var(--accent-color, #007aff);color:#fff;border:none;border-radius:.5rem;font-size:.875rem;font-weight:500;cursor:pointer;transition:background .2s ease}.error-boundary__retry:hover{background:var(--accent-color-hover, #0056b3)}.customize-mode{display:flex;flex-direction:column;gap:.5rem}.customize-mode__empty{display:flex;align-items:center;justify-content:center;padding:2rem;color:var(--text-secondary);font-size:.875rem}.customize-mode__empty p{margin:0}.customize-mode__room-accordions{display:flex;flex-direction:column;gap:.25rem}.customize-mode__badges{display:flex;gap:.25rem}.customize-mode__badge{display:inline-flex;align-items:center;justify-content:center;min-width:1.25rem;padding:.125rem .25rem;border-radius:.25rem;background:var(--accent-bg);font-size:.8rem;font-weight:600;color:var(--accent-color);text-transform:uppercase}.customize-mode__badge:nth-child(3){text-transform:unset}.customize-mode__room-settings-content{display:flex;flex-direction:column;gap:1rem}.customize-mode__setting-group{display:flex;flex-direction:column;gap:.5rem}.customize-mode__setting-label{font-size:.75rem;font-weight:500;color:var(--text-secondary)}.customize-mode__options{display:flex;justify-content:flex-start;overflow-x:auto;padding-bottom:.5rem;padding-top:.5rem;gap:2rem}.customize-mode__options--pills{gap:1rem}.customize-mode__option{display:flex;flex-direction:column;align-items:center;gap:2rem}.customize-mode__option-label{font-size:.8rem;color:var(--text-secondary);text-align:center}.customize-mode__pill{padding:.375rem .75rem;border:1.5px solid var(--surface-border);border-radius:1.25rem;background:var(--surface-bg);color:var(--text-secondary);font-size:1rem;font-weight:500;cursor:pointer;transition:all .15s ease;min-width:3.5rem}.customize-mode__pill:hover{border-color:var(--accent-color);background:var(--accent-bg-secondary)}.customize-mode__pill--selected{border-color:var(--accent-color);background:var(--accent-color);color:var(--accent-bg-secondary);color:#fff}.customize-mode__pill--cycle{font-weight:600}.customize-mode__wetness-slider{display:flex;flex-direction:column;gap:.25rem}.cleaning-mode-modal{height:100%}.cleaning-mode-modal__header{margin-bottom:1.5rem}.cleaning-mode-modal__content-wrapper{height:100%;overflow-y:auto;width:100%;overflow-x:hidden}.cleaning-mode-modal__content-wrapper::-webkit-scrollbar{display:none}.cleaning-mode-modal__section{margin-bottom:1.5rem}.cleaning-mode-modal__section-title{font-size:.9375rem;color:var(--text-primary, #1a1a1a);font-weight:500;margin:0 0 .75rem}.cleaning-mode-modal__section-header{display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem}.cleaning-mode-modal__help-icon{display:inline-flex;align-items:center;justify-content:center;width:1rem;height:1rem;border-radius:50%;border:.09375rem solid var(--text-tertiary, #999);font-size:.6875rem;color:var(--text-tertiary, #999);font-weight:600}.cleaning-mode-modal__room-map{background:var(--surface-bg, white);border-radius:.75rem;padding:1rem;display:flex;align-items:center;justify-content:center;min-height:7.5rem}.cleaning-mode-modal__placeholder{font-size:.8125rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.cleaning-mode-modal__mode-grid--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__mode-card{position:relative;border:.125rem solid var(--border-color, #e0e0e0);border-radius:1rem;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-bg, white);padding:1.5rem 1rem;transition:all .2s ease}.cleaning-mode-modal__mode-card:hover:not(.cleaning-mode-modal__mode-card--disabled){transform:translateY(-.125rem);box-shadow:0 .25rem .75rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-modal__mode-card--selected{border:.1875rem solid var(--accent-color, #d4af37);box-shadow:0 0 0 .25rem var(--accent-color-shadow-color, rgba(212, 175, 55, .15))}.cleaning-mode-modal__mode-card--selected:hover:not(.cleaning-mode-modal__mode-card--disabled){transform:translateY(-.125rem);box-shadow:0 0 0 .25rem var(--accent-color-shadow-color, rgba(88, 101, 242, .25)),0 .25rem .75rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-modal__mode-card--disabled{cursor:not-allowed;opacity:.5}.cleaning-mode-modal__mode-icon{border-radius:50%;margin-bottom:.75rem;display:flex;align-items:center;justify-content:center;font-size:1.75rem}[dir=rtl] .cleaning-mode-modal__mode-icon--mop-after>:nth-child(2),[dir=rtl] .cleaning-mode-modal__mode-icon--vac-mop>:nth-child(2){rotate:180deg}.cleaning-mode-modal__mode-label{font-size:.875rem;font-weight:500;color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__mode-checkmark{position:absolute;top:.75rem;right:.75rem}[dir=rtl] .cleaning-mode-modal__mode-checkmark{right:auto;left:.75rem}.cleaning-mode-modal__mode-checkmark{width:1.5rem;height:1.5rem;border-radius:50%;background:var(--accent-color, #d4af37);display:flex;align-items:center;justify-content:center;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .15));color:#fff;font-size:.875rem}.cleaning-mode-modal__horizontal-scroll{display:flex;justify-content:flex-start;overflow-x:auto;padding-bottom:.5rem;padding-top:.5rem;gap:2rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar{height:.25rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-track{background:var(--surface-secondary, #f1f1f1);border-radius:.125rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-thumb{background:var(--surface-tertiary, #ccc);border-radius:.125rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-thumb:hover{background:var(--border-color, #bbb)}.cleaning-mode-modal__mode-option{min-width:4.375rem;display:flex;flex-direction:column;align-items:center;gap:.375rem}.cleaning-mode-modal__mode-option-label{font-size:.75rem;color:var(--text-secondary, #666);text-align:center;line-height:1.2}.cleaning-mode-modal__power-grid{display:flex;justify-content:flex-start;gap:2rem;overflow-x:auto;padding:.5rem 0}.cleaning-mode-modal__power-grid--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__power-option{min-width:4.375rem;display:flex;flex-direction:column;align-items:center;gap:.375rem}.cleaning-mode-modal__power-label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center}.cleaning-mode-modal__max-plus{background:var(--surface-bg, white);border-radius:.75rem;padding:1rem}.cleaning-mode-modal__max-plus-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}.cleaning-mode-modal__max-plus-title{font-size:.9375rem;color:var(--text-primary, #1a1a1a);font-weight:500}.cleaning-mode-modal__max-plus-description{font-size:.8125rem;color:var(--text-tertiary, #999);margin:0;line-height:1.4}.cleaning-mode-modal__slider-container{position:relative;padding:0 .5rem;margin-bottom:.75rem}.cleaning-mode-modal__slider-container--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__slider-wrapper{position:relative;padding-top:2rem}.cleaning-mode-modal__slider{width:100%;height:.375rem;border-radius:.1875rem;outline:none;-webkit-appearance:none;appearance:none;cursor:pointer}.cleaning-mode-modal__slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:1.25rem;height:1.25rem;border-radius:50%;background:var(--accent-color, #d4af37);cursor:pointer;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider::-moz-range-thumb{width:1.25rem;height:1.25rem;border-radius:50%;background:var(--accent-color, #d4af37);cursor:pointer;border:none;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider-tooltip{position:absolute;top:-.5rem;transform:translate(-50%);background:var(--accent-color, #d4af37);color:#fff;padding:.25rem .5rem;border-radius:.375rem;font-size:.85rem;font-weight:600;white-space:nowrap;pointer-events:none;box-shadow:0 .125rem .375rem var(--accent-shadow, rgba(0, 0, 0, .2))}[dir=rtl] .cleaning-mode-modal__slider-tooltip{transform:translate(50%)}.cleaning-mode-modal__slider-tooltip:after{content:\"\";position:absolute;top:100%;left:50%;transform:translate(-50%);width:0;height:0;border-left:.3125rem solid transparent;border-right:.3125rem solid transparent;border-top:.3125rem solid var(--accent-color, #d4af37)}.cleaning-mode-modal__slider-value{position:absolute;top:-2rem;transform:translate(-50%);background:var(--accent-color, #d4af37);border-radius:50%;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:600;color:#fff;box-shadow:0 .125rem .5rem var(--accent-color-shadow-color, rgba(88, 101, 242, .25));pointer-events:none}.cleaning-mode-modal__slider-labels{display:flex;justify-content:space-between;padding:0 .5rem;margin-top:1.5rem}.cleaning-mode-modal__slider-label{font-size:.8125rem}.cleaning-mode-modal__slider-label--inactive{color:var(--text-tertiary, #999)}.cleaning-mode-modal__slider-label--active{color:var(--text-primary, #1a1a1a);font-weight:500}.cleaning-mode-modal__setting{display:flex;align-items:center;justify-content:space-between;padding:1rem;background:var(--surface-bg, white);border-radius:.75rem;margin-bottom:1rem}.cleaning-mode-modal__setting--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__setting--clickable{cursor:pointer;transition:background .2s ease}.cleaning-mode-modal__setting--clickable:hover{background:var(--surface-secondary, #f8f8f8)}.cleaning-mode-modal__setting--clickable:active{background:var(--surface-tertiary, #f0f0f0)}.cleaning-mode-modal__setting-label{font-size:.9375rem;color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__setting-value{display:flex;align-items:center;gap:.5rem;font-size:.875rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__setting-arrow{font-size:1.125rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__route-grid{display:flex;justify-content:flex-start;overflow-x:auto;padding-bottom:.5rem;padding-top:.5rem;gap:2rem}.cleaning-mode-modal__route-grid--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__route-option{min-width:4.375rem;display:flex;flex-direction:column;align-items:center;gap:.375rem}.cleaning-mode-modal__route-label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center}.shortcuts-modal{padding:0}.shortcuts-modal__title{font-size:1.3rem;font-weight:600;margin:0 0 1rem;padding:1.5rem 1.5rem 0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__empty{padding:2rem 1.5rem;text-align:center;color:var(--text-secondary, #666)}.shortcuts-modal__empty p{margin:.5rem 0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__empty-hint{font-size:.9rem;color:var(--text-tertiary, #888)}.shortcuts-modal__list{max-height:35rem;overflow-y:auto;padding:.5rem 0;gap:.5rem;display:flex;flex-direction:column}.shortcuts-modal__item{display:flex;align-items:center;gap:1rem;padding:.75rem 1.5rem;margin:.25rem 1rem;background:var(--surface-bg, #fff);border:2px solid var(--accent-color);border-radius:.75rem;box-shadow:0 .125rem .5rem var(--accent-shadow);transition:all .2s;width:90%}.shortcuts-modal__item:hover{box-shadow:0 .25rem .75rem var(--accent-shadow);transform:translateY(-.0625rem)}.shortcuts-modal__item-info{flex:1;min-width:0;display:flex;align-items:center;gap:.75rem}.shortcuts-modal__item-icon{display:flex;font-size:1.3rem;flex-shrink:0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__item-icon svg{scale:.8}.shortcuts-modal__item-name{font-size:1rem;font-weight:500;color:var(--text-primary, #1a1a1a)}.entity-item{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--divider-color, rgba(0, 0, 0, .1));gap:16px}.entity-item:last-child{border-bottom:none}.entity-item--child{padding-left:16px;opacity:.9}.entity-item__info{display:flex;flex-direction:column;flex:1;min-width:0}.entity-item__label{font-size:14px;font-weight:500;color:var(--text-primary, #000)}.entity-item__description{font-size:12px;color:var(--text-secondary, #666);margin-top:2px}.entity-item--select{flex-direction:column;align-items:stretch;gap:8px}.entity-item--select .entity-item__info{flex:none}.entity-item--segmented{flex-direction:column;align-items:stretch;gap:8px}.entity-item--segmented .entity-item__info{flex:none}.entity-item--slider{flex-direction:column;align-items:stretch;gap:8px}.entity-item--slider .entity-item__info{flex:none}.entity-item__select{padding:8px 12px;border-radius:8px;border:1px solid var(--divider-color, rgba(0, 0, 0, .2));background:var(--surface-bg, #fff);color:var(--text-primary, #000);font-size:14px;cursor:pointer;min-width:120px}.entity-item__select:disabled{opacity:.5;cursor:not-allowed}.entity-item__button{padding:8px 16px;border-radius:8px;border:none;background:var(--accent-color, #007aff);color:#fff;font-size:14px;font-weight:500;cursor:pointer;transition:opacity .2s ease}.entity-item__button:hover:not(:disabled){opacity:.9}.entity-item__button:active:not(:disabled){opacity:.8}.entity-item__button:disabled{opacity:.5;cursor:not-allowed}.entity-item__slider-container{display:flex;align-items:center;gap:12px}.entity-item__slider{flex:1;height:6px;border-radius:3px;appearance:none;background:var(--divider-color, rgba(0, 0, 0, .2));cursor:pointer}.entity-item__slider::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer}.entity-item__slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--accent-color, #007aff);border:none;cursor:pointer}.entity-item__slider:disabled{opacity:.5;cursor:not-allowed}.entity-item__slider:disabled::-webkit-slider-thumb{cursor:not-allowed}.entity-item__slider:disabled::-moz-range-thumb{cursor:not-allowed}.entity-item__slider-value{font-size:14px;font-weight:500;color:var(--text-primary, #000);min-width:40px;text-align:right}.entity-item__slider--volume .entity-item__slider::-webkit-slider-thumb,.entity-item__slider--brightness .entity-item__slider::-webkit-slider-thumb{background:var(--accent-color, #007aff)}.entity-item__time-input{padding:8px 12px;border-radius:8px;border:1px solid var(--divider-color, rgba(0, 0, 0, .2));background:var(--surface-bg, #fff);color:var(--text-primary, #000);font-size:14px;font-family:inherit;cursor:pointer;min-width:100px}.entity-item__time-input:disabled{opacity:.5;cursor:not-allowed}.entity-item__time-input::-webkit-calendar-picker-indicator{cursor:pointer;filter:var(--time-picker-filter, none)}.ai-detection-section{display:flex;flex-direction:column;gap:.75rem}.ai-detection-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.ai-detection-section__item--slider{flex-direction:column;align-items:stretch;gap:.5rem}.ai-detection-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.ai-detection-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.ai-detection-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.ai-detection-section__slider-container{display:flex;align-items:center;gap:.75rem}.ai-detection-section__slider{flex:1;height:4px;appearance:none;background:var(--surface-secondary, #e0e0e0);border-radius:2px;cursor:pointer}.ai-detection-section__slider::-webkit-slider-thumb{appearance:none;width:16px;height:16px;background:var(--accent-color, #007aff);border-radius:50%;cursor:pointer}.ai-detection-section__slider:disabled{opacity:.5;cursor:not-allowed}.ai-detection-section__slider-value{font-size:.75rem;font-weight:500;color:var(--text-primary, #333);min-width:36px;text-align:right}.carpet-settings-section{display:flex;flex-direction:column;gap:.75rem}.carpet-settings-section__mode-selector{display:flex;flex-direction:column;gap:.75rem;padding-bottom:.5rem;border-bottom:1px solid var(--border-color, #e0e0e0);margin-bottom:.25rem}.carpet-settings-section__sub-options{display:flex;flex-direction:column;gap:.5rem;padding-left:.25rem}.carpet-settings-section__sub-label{font-size:.75rem;color:var(--text-secondary, #666);font-weight:500}.carpet-settings-section__sub-buttons{display:flex;gap:.5rem}.carpet-settings-section__sub-button{flex:1;padding:.5rem .75rem;font-size:.8125rem;font-weight:500;border:1px solid var(--border-color, #e0e0e0);border-radius:.5rem;background:var(--surface-secondary, #f5f5f5);color:var(--text-primary, #333);cursor:pointer;transition:all .2s ease}.carpet-settings-section__sub-button:hover:not(.carpet-settings-section__sub-button--active){background:var(--surface-tertiary, #eee)}.carpet-settings-section__sub-button--active{background:var(--accent-color, #007aff);border-color:var(--accent-color, #007aff);color:#fff}.carpet-settings-section__sub-button:disabled{opacity:.5;cursor:not-allowed}.carpet-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.carpet-settings-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.carpet-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.carpet-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.carpet-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.carpet-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.carpet-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.carpet-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.carpet-settings-section__select:disabled{opacity:.5;cursor:not-allowed}.consumables-section{display:flex;flex-direction:column;gap:1rem}.consumables-section__item{display:flex;flex-direction:column;gap:.375rem}.consumables-section__info{display:flex;justify-content:space-between;align-items:center}.consumables-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #000)}.consumables-section__stats{font-size:.75rem;color:var(--text-secondary, #666)}.consumables-section__progress{height:.375rem;background:var(--progress-bg, rgba(0, 0, 0, .1));border-radius:.1875rem;overflow:hidden}.consumables-section__progress-bar{height:100%;border-radius:.1875rem;transition:width .3s ease}.consumables-section__reset{align-self:flex-end;padding:.25rem .75rem;font-size:.75rem;font-weight:500;color:var(--accent-color, #007aff);background:none;border:1px solid var(--accent-color, #007aff);border-radius:.375rem;cursor:pointer;transition:all .2s ease}.consumables-section__reset:hover{background:var(--accent-color, #007aff);color:#fff}.consumables-section__reset:active{opacity:.8}.device-info-section{display:flex;flex-direction:column;gap:.75rem}.device-info-section__item{display:flex;justify-content:space-between;align-items:center;padding:.25rem 0;border-bottom:1px solid var(--divider-color, rgba(0, 0, 0, .06))}.device-info-section__item:last-child{border-bottom:none}.device-info-section__label{font-size:.875rem;color:var(--text-secondary, #666)}.device-info-section__value{font-size:.875rem;font-weight:500;color:var(--text-primary, #000);unicode-bidi:plaintext}.dock-settings-section{display:flex;flex-direction:column;gap:.75rem}.dock-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.dock-settings-section__item--select,.dock-settings-section__item--segmented{flex-direction:column;align-items:stretch;gap:.5rem}.dock-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.dock-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.dock-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.dock-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.dock-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.dock-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.dock-settings-section__select:disabled{opacity:.5;cursor:not-allowed}.dock-settings-section__button{padding:.5rem 1rem;font-size:.8125rem;font-weight:500;border:1px solid var(--accent-color, #007aff);border-radius:.5rem;background:var(--accent-color, #007aff);color:#fff;cursor:pointer;transition:all .2s ease;white-space:nowrap}.dock-settings-section__button:hover:not(:disabled){background:var(--accent-color-hover, #0056b3)}.dock-settings-section__button:disabled{opacity:.5;cursor:not-allowed}.edge-corner-section{display:flex;flex-direction:column;gap:.75rem}.edge-corner-section__sub-settings{display:flex;flex-direction:column;gap:.5rem;margin-top:-.25rem}.edge-corner-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.edge-corner-section__item--indented{padding-left:1rem;border-left:2px solid var(--border-color, #e0e0e0);margin-left:.5rem}.edge-corner-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.edge-corner-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.edge-corner-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.edge-corner-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.edge-corner-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.edge-corner-section__select:focus{border-color:var(--accent-color, #007aff)}.edge-corner-section__select:hover{background:var(--surface-tertiary, #eee)}.edge-corner-section__select:disabled{opacity:.5;cursor:not-allowed}.floor-settings-section{display:flex;flex-direction:column;gap:.75rem}.floor-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.floor-settings-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.floor-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.floor-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.floor-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.floor-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.floor-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.floor-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.floor-settings-section__select:disabled{opacity:.5;cursor:not-allowed}.map-settings-section{display:flex;flex-direction:column;gap:.75rem}.map-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.map-settings-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.map-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.map-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.map-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.map-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.map-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.map-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.map-settings-section__select:disabled{opacity:.5;cursor:not-allowed}.map-settings-section__actions{display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem;padding-top:.75rem;border-top:1px solid var(--border-color, #e0e0e0)}.map-settings-section__actions-label{font-size:.75rem;font-weight:500;color:var(--text-secondary, #666);text-transform:uppercase;letter-spacing:.5px}.map-settings-section__actions-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:.5rem}.map-settings-section__action-button{display:flex;flex-direction:column;align-items:center;gap:.375rem;padding:.75rem .5rem;background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:.5rem;cursor:pointer;transition:all .2s ease}.map-settings-section__action-button:hover{background:var(--surface-tertiary, #eee);border-color:var(--accent-color, #007aff)}.map-settings-section__action-button:active{transform:scale(.98)}.map-settings-section__action-button:disabled{opacity:.5;cursor:not-allowed}.map-settings-section__action-icon{display:flex;align-items:center;justify-content:center;color:var(--accent-color, #007aff)}.map-settings-section__action-label{font-size:.75rem;font-weight:500;color:var(--text-primary, #333);text-align:center;line-height:1.2}.quick-settings-section{display:flex;flex-direction:column;gap:.75rem}.quick-settings-section__item{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 0}.quick-settings-section__item--child{margin-left:1rem;padding-left:.75rem;border-left:2px solid var(--accent-color, #007aff)}.quick-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.quick-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.quick-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.quick-settings-section__actions{display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem;padding-top:.75rem;border-top:1px solid var(--border-color, #e0e0e0)}.quick-settings-section__actions-label{font-size:.75rem;font-weight:500;color:var(--text-secondary, #666);text-transform:uppercase;letter-spacing:.5px}.quick-settings-section__actions-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:.5rem}.quick-settings-section__action-button{display:flex;flex-direction:column;align-items:center;gap:.375rem;padding:.75rem .5rem;background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:.5rem;cursor:pointer;transition:all .2s ease}.quick-settings-section__action-button:hover{background:var(--surface-tertiary, #eee);border-color:var(--accent-color, #007aff)}.quick-settings-section__action-button:active{transform:scale(.98)}.quick-settings-section__action-icon{display:flex;align-items:center;justify-content:center;color:var(--accent-color, #007aff)}.quick-settings-section__action-label{font-size:.75rem;font-weight:500;color:var(--text-primary, #333);text-align:center;line-height:1.2}.volume-section{display:flex;flex-direction:column;gap:.75rem}.volume-section__row{display:flex;flex-direction:row;gap:1rem}.volume-section__item{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 0}.volume-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.volume-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.volume-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.volume-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.volume-section__select{width:100%;padding:.5rem 2.5rem .5rem .75rem;font-size:.875rem;font-weight:500;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:.5rem;cursor:pointer;appearance:none;background-image:url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\");background-repeat:no-repeat;background-position:right .75rem center;background-size:1rem}.volume-section__select:hover{border-color:var(--accent-color, #007aff)}.volume-section__select:focus{outline:none;border-color:var(--accent-color, #007aff);box-shadow:0 0 0 2px #007aff33}.volume-section__select:disabled{opacity:.5;cursor:not-allowed}.volume-section__control{display:flex;align-items:center;gap:.75rem;flex:1}.volume-section__icon{display:flex;align-items:center;justify-content:center;color:var(--text-secondary, #666);flex-shrink:0}.volume-section__slider-container{flex:1;padding-top:1.5rem;margin-top:1rem}.volume-section__slider-wrapper{position:relative;width:100%}.volume-section__slider{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;outline:none;cursor:pointer}.volume-section__slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer;box-shadow:0 2px 4px #0003;transition:transform .1s ease}.volume-section__slider::-webkit-slider-thumb:hover{transform:scale(1.1)}.volume-section__slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer;border:none;box-shadow:0 2px 4px #0003;transition:transform .1s ease}.volume-section__slider::-moz-range-thumb:hover{transform:scale(1.1)}.volume-section__tooltip{position:absolute;top:-1.75rem;transform:translate(-50%);background:var(--accent-color, #007aff);color:#fff;padding:.25rem .5rem;border-radius:4px;font-size:.75rem;font-weight:500;white-space:nowrap;pointer-events:none}[dir=rtl] .volume-section__tooltip{transform:translate(50%)}.volume-section__tooltip:after{content:\"\";position:absolute;top:100%;left:50%;transform:translate(-50%);border:4px solid transparent;border-top-color:var(--accent-color, #007aff)}.volume-section__test-button{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.625rem 1rem;background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;color:var(--text-primary, #333);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.volume-section__test-button:hover{background:var(--surface-tertiary, #eee)}.volume-section__test-button:active{transform:scale(.98)}.volume-section__test-button svg{color:var(--accent-color, #007aff)}.settings-panel{height:100%}.settings-panel__title{font-size:1.25rem;font-weight:600;margin:0 0 1rem;text-align:center;color:var(--text-primary, #000)}.settings-panel__scroll-wrapper{height:90%;overflow-y:auto}.settings-panel__sections{display:flex;flex-direction:column;gap:.25rem;padding-right:.25rem}[dir=rtl] .settings-panel__sections{padding-right:0;padding-left:.25rem}.settings-panel__sections::-webkit-scrollbar{width:4px}.settings-panel__sections::-webkit-scrollbar-track{background:transparent}.settings-panel__sections::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb, rgba(0, 0, 0, .2));border-radius:2px}.room-selection-display{padding:.75rem 1rem;background:var(--accent-bg, #e3f2fd);border-radius:.5rem;margin-bottom:.75rem;font-size:.875rem;color:var(--text-primary, #1a1a1a)}.room-selection-display__label{font-weight:600;margin-right:.5rem}[dir=rtl] .room-selection-display__label{margin-right:0;margin-left:.5rem}.room-selection-display__label{color:var(--accent-color, #007aff)}.room-selection-display__rooms{color:var(--text-secondary, #666666)}.dreame-vacuum-card{position:relative;background:var(--card-bg, #f5f5f7);border-radius:1.25rem;overflow:hidden;box-shadow:0 .125rem 1.25rem var(--card-shadow, rgba(0, 0, 0, .08));font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.dreame-vacuum-card__error{padding:1.25rem;color:var(--error-color, #ff3b30);text-align:center;font-size:.875rem}.dreame-vacuum-card__container{display:flex;flex-direction:column;gap:1rem}.dreame-vacuum-card__controls{padding:0 1.25rem 1.25rem}\n";
  document.head.appendChild(style);
})();
function Ag(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var fu = { exports: {} }, Jo = {};
var fp;
function Tb() {
  if (fp) return Jo;
  fp = 1;
  var n = /* @__PURE__ */ Symbol.for("react.transitional.element"), a = /* @__PURE__ */ Symbol.for("react.fragment");
  function o(s, l, d) {
    var _ = null;
    if (d !== void 0 && (_ = "" + d), l.key !== void 0 && (_ = "" + l.key), "key" in l) {
      d = {};
      for (var m in l)
        m !== "key" && (d[m] = l[m]);
    } else d = l;
    return l = d.ref, {
      $$typeof: n,
      type: s,
      key: _,
      ref: l !== void 0 ? l : null,
      props: d
    };
  }
  return Jo.Fragment = a, Jo.jsx = o, Jo.jsxs = o, Jo;
}
var pp;
function Ab() {
  return pp || (pp = 1, fu.exports = Tb()), fu.exports;
}
var h = Ab(), pu = { exports: {} }, ge = {};
var gp;
function Nb() {
  if (gp) return ge;
  gp = 1;
  var n = /* @__PURE__ */ Symbol.for("react.transitional.element"), a = /* @__PURE__ */ Symbol.for("react.portal"), o = /* @__PURE__ */ Symbol.for("react.fragment"), s = /* @__PURE__ */ Symbol.for("react.strict_mode"), l = /* @__PURE__ */ Symbol.for("react.profiler"), d = /* @__PURE__ */ Symbol.for("react.consumer"), _ = /* @__PURE__ */ Symbol.for("react.context"), m = /* @__PURE__ */ Symbol.for("react.forward_ref"), p = /* @__PURE__ */ Symbol.for("react.suspense"), f = /* @__PURE__ */ Symbol.for("react.memo"), v = /* @__PURE__ */ Symbol.for("react.lazy"), y = /* @__PURE__ */ Symbol.for("react.activity"), w = Symbol.iterator;
  function E(k) {
    return k === null || typeof k != "object" ? null : (k = w && k[w] || k["@@iterator"], typeof k == "function" ? k : null);
  }
  var z = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, N = Object.assign, j = {};
  function R(k, q, X) {
    this.props = k, this.context = q, this.refs = j, this.updater = X || z;
  }
  R.prototype.isReactComponent = {}, R.prototype.setState = function(k, q) {
    if (typeof k != "object" && typeof k != "function" && k != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, k, q, "setState");
  }, R.prototype.forceUpdate = function(k) {
    this.updater.enqueueForceUpdate(this, k, "forceUpdate");
  };
  function U() {
  }
  U.prototype = R.prototype;
  function Y(k, q, X) {
    this.props = k, this.context = q, this.refs = j, this.updater = X || z;
  }
  var P = Y.prototype = new U();
  P.constructor = Y, N(P, R.prototype), P.isPureReactComponent = !0;
  var I = Array.isArray;
  function F() {
  }
  var V = { H: null, A: null, T: null, S: null }, W = Object.prototype.hasOwnProperty;
  function J(k, q, X) {
    var $ = X.ref;
    return {
      $$typeof: n,
      type: k,
      key: q,
      ref: $ !== void 0 ? $ : null,
      props: X
    };
  }
  function se(k, q) {
    return J(k.type, q, k.props);
  }
  function _e(k) {
    return typeof k == "object" && k !== null && k.$$typeof === n;
  }
  function ie(k) {
    var q = { "=": "=0", ":": "=2" };
    return "$" + k.replace(/[=:]/g, function(X) {
      return q[X];
    });
  }
  var Ce = /\/+/g;
  function we(k, q) {
    return typeof k == "object" && k !== null && k.key != null ? ie("" + k.key) : q.toString(36);
  }
  function xe(k) {
    switch (k.status) {
      case "fulfilled":
        return k.value;
      case "rejected":
        throw k.reason;
      default:
        switch (typeof k.status == "string" ? k.then(F, F) : (k.status = "pending", k.then(
          function(q) {
            k.status === "pending" && (k.status = "fulfilled", k.value = q);
          },
          function(q) {
            k.status === "pending" && (k.status = "rejected", k.reason = q);
          }
        )), k.status) {
          case "fulfilled":
            return k.value;
          case "rejected":
            throw k.reason;
        }
    }
    throw k;
  }
  function M(k, q, X, $, te) {
    var le = typeof k;
    (le === "undefined" || le === "boolean") && (k = null);
    var ve = !1;
    if (k === null) ve = !0;
    else
      switch (le) {
        case "bigint":
        case "string":
        case "number":
          ve = !0;
          break;
        case "object":
          switch (k.$$typeof) {
            case n:
            case a:
              ve = !0;
              break;
            case v:
              return ve = k._init, M(
                ve(k._payload),
                q,
                X,
                $,
                te
              );
          }
      }
    if (ve)
      return te = te(k), ve = $ === "" ? "." + we(k, 0) : $, I(te) ? (X = "", ve != null && (X = ve.replace(Ce, "$&/") + "/"), M(te, q, X, "", function(kt) {
        return kt;
      })) : te != null && (_e(te) && (te = se(
        te,
        X + (te.key == null || k && k.key === te.key ? "" : ("" + te.key).replace(
          Ce,
          "$&/"
        ) + "/") + ve
      )), q.push(te)), 1;
    ve = 0;
    var Ye = $ === "" ? "." : $ + ":";
    if (I(k))
      for (var Le = 0; Le < k.length; Le++)
        $ = k[Le], le = Ye + we($, Le), ve += M(
          $,
          q,
          X,
          le,
          te
        );
    else if (Le = E(k), typeof Le == "function")
      for (k = Le.call(k), Le = 0; !($ = k.next()).done; )
        $ = $.value, le = Ye + we($, Le++), ve += M(
          $,
          q,
          X,
          le,
          te
        );
    else if (le === "object") {
      if (typeof k.then == "function")
        return M(
          xe(k),
          q,
          X,
          $,
          te
        );
      throw q = String(k), Error(
        "Objects are not valid as a React child (found: " + (q === "[object Object]" ? "object with keys {" + Object.keys(k).join(", ") + "}" : q) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ve;
  }
  function K(k, q, X) {
    if (k == null) return k;
    var $ = [], te = 0;
    return M(k, $, "", "", function(le) {
      return q.call(X, le, te++);
    }), $;
  }
  function Q(k) {
    if (k._status === -1) {
      var q = k._result;
      q = q(), q.then(
        function(X) {
          (k._status === 0 || k._status === -1) && (k._status = 1, k._result = X);
        },
        function(X) {
          (k._status === 0 || k._status === -1) && (k._status = 2, k._result = X);
        }
      ), k._status === -1 && (k._status = 0, k._result = q);
    }
    if (k._status === 1) return k._result.default;
    throw k._result;
  }
  var me = typeof reportError == "function" ? reportError : function(k) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var q = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof k == "object" && k !== null && typeof k.message == "string" ? String(k.message) : String(k),
        error: k
      });
      if (!window.dispatchEvent(q)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", k);
      return;
    }
    console.error(k);
  }, pe = {
    map: K,
    forEach: function(k, q, X) {
      K(
        k,
        function() {
          q.apply(this, arguments);
        },
        X
      );
    },
    count: function(k) {
      var q = 0;
      return K(k, function() {
        q++;
      }), q;
    },
    toArray: function(k) {
      return K(k, function(q) {
        return q;
      }) || [];
    },
    only: function(k) {
      if (!_e(k))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return k;
    }
  };
  return ge.Activity = y, ge.Children = pe, ge.Component = R, ge.Fragment = o, ge.Profiler = l, ge.PureComponent = Y, ge.StrictMode = s, ge.Suspense = p, ge.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V, ge.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(k) {
      return V.H.useMemoCache(k);
    }
  }, ge.cache = function(k) {
    return function() {
      return k.apply(null, arguments);
    };
  }, ge.cacheSignal = function() {
    return null;
  }, ge.cloneElement = function(k, q, X) {
    if (k == null)
      throw Error(
        "The argument must be a React element, but you passed " + k + "."
      );
    var $ = N({}, k.props), te = k.key;
    if (q != null)
      for (le in q.key !== void 0 && (te = "" + q.key), q)
        !W.call(q, le) || le === "key" || le === "__self" || le === "__source" || le === "ref" && q.ref === void 0 || ($[le] = q[le]);
    var le = arguments.length - 2;
    if (le === 1) $.children = X;
    else if (1 < le) {
      for (var ve = Array(le), Ye = 0; Ye < le; Ye++)
        ve[Ye] = arguments[Ye + 2];
      $.children = ve;
    }
    return J(k.type, te, $);
  }, ge.createContext = function(k) {
    return k = {
      $$typeof: _,
      _currentValue: k,
      _currentValue2: k,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, k.Provider = k, k.Consumer = {
      $$typeof: d,
      _context: k
    }, k;
  }, ge.createElement = function(k, q, X) {
    var $, te = {}, le = null;
    if (q != null)
      for ($ in q.key !== void 0 && (le = "" + q.key), q)
        W.call(q, $) && $ !== "key" && $ !== "__self" && $ !== "__source" && (te[$] = q[$]);
    var ve = arguments.length - 2;
    if (ve === 1) te.children = X;
    else if (1 < ve) {
      for (var Ye = Array(ve), Le = 0; Le < ve; Le++)
        Ye[Le] = arguments[Le + 2];
      te.children = Ye;
    }
    if (k && k.defaultProps)
      for ($ in ve = k.defaultProps, ve)
        te[$] === void 0 && (te[$] = ve[$]);
    return J(k, le, te);
  }, ge.createRef = function() {
    return { current: null };
  }, ge.forwardRef = function(k) {
    return { $$typeof: m, render: k };
  }, ge.isValidElement = _e, ge.lazy = function(k) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: k },
      _init: Q
    };
  }, ge.memo = function(k, q) {
    return {
      $$typeof: f,
      type: k,
      compare: q === void 0 ? null : q
    };
  }, ge.startTransition = function(k) {
    var q = V.T, X = {};
    V.T = X;
    try {
      var $ = k(), te = V.S;
      te !== null && te(X, $), typeof $ == "object" && $ !== null && typeof $.then == "function" && $.then(F, me);
    } catch (le) {
      me(le);
    } finally {
      q !== null && X.types !== null && (q.types = X.types), V.T = q;
    }
  }, ge.unstable_useCacheRefresh = function() {
    return V.H.useCacheRefresh();
  }, ge.use = function(k) {
    return V.H.use(k);
  }, ge.useActionState = function(k, q, X) {
    return V.H.useActionState(k, q, X);
  }, ge.useCallback = function(k, q) {
    return V.H.useCallback(k, q);
  }, ge.useContext = function(k) {
    return V.H.useContext(k);
  }, ge.useDebugValue = function() {
  }, ge.useDeferredValue = function(k, q) {
    return V.H.useDeferredValue(k, q);
  }, ge.useEffect = function(k, q) {
    return V.H.useEffect(k, q);
  }, ge.useEffectEvent = function(k) {
    return V.H.useEffectEvent(k);
  }, ge.useId = function() {
    return V.H.useId();
  }, ge.useImperativeHandle = function(k, q, X) {
    return V.H.useImperativeHandle(k, q, X);
  }, ge.useInsertionEffect = function(k, q) {
    return V.H.useInsertionEffect(k, q);
  }, ge.useLayoutEffect = function(k, q) {
    return V.H.useLayoutEffect(k, q);
  }, ge.useMemo = function(k, q) {
    return V.H.useMemo(k, q);
  }, ge.useOptimistic = function(k, q) {
    return V.H.useOptimistic(k, q);
  }, ge.useReducer = function(k, q, X) {
    return V.H.useReducer(k, q, X);
  }, ge.useRef = function(k) {
    return V.H.useRef(k);
  }, ge.useState = function(k) {
    return V.H.useState(k);
  }, ge.useSyncExternalStore = function(k, q, X) {
    return V.H.useSyncExternalStore(
      k,
      q,
      X
    );
  }, ge.useTransition = function() {
    return V.H.useTransition();
  }, ge.version = "19.2.3", ge;
}
var hp;
function Iu() {
  return hp || (hp = 1, pu.exports = Nb()), pu.exports;
}
var D = Iu();
const xa = /* @__PURE__ */ Ag(D);
var gu = { exports: {} }, er = {}, hu = { exports: {} }, vu = {};
var vp;
function Cb() {
  return vp || (vp = 1, (function(n) {
    function a(M, K) {
      var Q = M.length;
      M.push(K);
      e: for (; 0 < Q; ) {
        var me = Q - 1 >>> 1, pe = M[me];
        if (0 < l(pe, K))
          M[me] = K, M[Q] = pe, Q = me;
        else break e;
      }
    }
    function o(M) {
      return M.length === 0 ? null : M[0];
    }
    function s(M) {
      if (M.length === 0) return null;
      var K = M[0], Q = M.pop();
      if (Q !== K) {
        M[0] = Q;
        e: for (var me = 0, pe = M.length, k = pe >>> 1; me < k; ) {
          var q = 2 * (me + 1) - 1, X = M[q], $ = q + 1, te = M[$];
          if (0 > l(X, Q))
            $ < pe && 0 > l(te, X) ? (M[me] = te, M[$] = Q, me = $) : (M[me] = X, M[q] = Q, me = q);
          else if ($ < pe && 0 > l(te, Q))
            M[me] = te, M[$] = Q, me = $;
          else break e;
        }
      }
      return K;
    }
    function l(M, K) {
      var Q = M.sortIndex - K.sortIndex;
      return Q !== 0 ? Q : M.id - K.id;
    }
    if (n.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      n.unstable_now = function() {
        return d.now();
      };
    } else {
      var _ = Date, m = _.now();
      n.unstable_now = function() {
        return _.now() - m;
      };
    }
    var p = [], f = [], v = 1, y = null, w = 3, E = !1, z = !1, N = !1, j = !1, R = typeof setTimeout == "function" ? setTimeout : null, U = typeof clearTimeout == "function" ? clearTimeout : null, Y = typeof setImmediate < "u" ? setImmediate : null;
    function P(M) {
      for (var K = o(f); K !== null; ) {
        if (K.callback === null) s(f);
        else if (K.startTime <= M)
          s(f), K.sortIndex = K.expirationTime, a(p, K);
        else break;
        K = o(f);
      }
    }
    function I(M) {
      if (N = !1, P(M), !z)
        if (o(p) !== null)
          z = !0, F || (F = !0, ie());
        else {
          var K = o(f);
          K !== null && xe(I, K.startTime - M);
        }
    }
    var F = !1, V = -1, W = 5, J = -1;
    function se() {
      return j ? !0 : !(n.unstable_now() - J < W);
    }
    function _e() {
      if (j = !1, F) {
        var M = n.unstable_now();
        J = M;
        var K = !0;
        try {
          e: {
            z = !1, N && (N = !1, U(V), V = -1), E = !0;
            var Q = w;
            try {
              t: {
                for (P(M), y = o(p); y !== null && !(y.expirationTime > M && se()); ) {
                  var me = y.callback;
                  if (typeof me == "function") {
                    y.callback = null, w = y.priorityLevel;
                    var pe = me(
                      y.expirationTime <= M
                    );
                    if (M = n.unstable_now(), typeof pe == "function") {
                      y.callback = pe, P(M), K = !0;
                      break t;
                    }
                    y === o(p) && s(p), P(M);
                  } else s(p);
                  y = o(p);
                }
                if (y !== null) K = !0;
                else {
                  var k = o(f);
                  k !== null && xe(
                    I,
                    k.startTime - M
                  ), K = !1;
                }
              }
              break e;
            } finally {
              y = null, w = Q, E = !1;
            }
            K = void 0;
          }
        } finally {
          K ? ie() : F = !1;
        }
      }
    }
    var ie;
    if (typeof Y == "function")
      ie = function() {
        Y(_e);
      };
    else if (typeof MessageChannel < "u") {
      var Ce = new MessageChannel(), we = Ce.port2;
      Ce.port1.onmessage = _e, ie = function() {
        we.postMessage(null);
      };
    } else
      ie = function() {
        R(_e, 0);
      };
    function xe(M, K) {
      V = R(function() {
        M(n.unstable_now());
      }, K);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, n.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : W = 0 < M ? Math.floor(1e3 / M) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return w;
    }, n.unstable_next = function(M) {
      switch (w) {
        case 1:
        case 2:
        case 3:
          var K = 3;
          break;
        default:
          K = w;
      }
      var Q = w;
      w = K;
      try {
        return M();
      } finally {
        w = Q;
      }
    }, n.unstable_requestPaint = function() {
      j = !0;
    }, n.unstable_runWithPriority = function(M, K) {
      switch (M) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          M = 3;
      }
      var Q = w;
      w = M;
      try {
        return K();
      } finally {
        w = Q;
      }
    }, n.unstable_scheduleCallback = function(M, K, Q) {
      var me = n.unstable_now();
      switch (typeof Q == "object" && Q !== null ? (Q = Q.delay, Q = typeof Q == "number" && 0 < Q ? me + Q : me) : Q = me, M) {
        case 1:
          var pe = -1;
          break;
        case 2:
          pe = 250;
          break;
        case 5:
          pe = 1073741823;
          break;
        case 4:
          pe = 1e4;
          break;
        default:
          pe = 5e3;
      }
      return pe = Q + pe, M = {
        id: v++,
        callback: K,
        priorityLevel: M,
        startTime: Q,
        expirationTime: pe,
        sortIndex: -1
      }, Q > me ? (M.sortIndex = Q, a(f, M), o(p) === null && M === o(f) && (N ? (U(V), V = -1) : N = !0, xe(I, Q - me))) : (M.sortIndex = pe, a(p, M), z || E || (z = !0, F || (F = !0, ie()))), M;
    }, n.unstable_shouldYield = se, n.unstable_wrapCallback = function(M) {
      var K = w;
      return function() {
        var Q = w;
        w = K;
        try {
          return M.apply(this, arguments);
        } finally {
          w = Q;
        }
      };
    };
  })(vu)), vu;
}
var yp;
function xb() {
  return yp || (yp = 1, hu.exports = Cb()), hu.exports;
}
var yu = { exports: {} }, St = {};
var bp;
function Mb() {
  if (bp) return St;
  bp = 1;
  var n = Iu();
  function a(p) {
    var f = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      f += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        f += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + p + "; visit " + f + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var s = {
    d: {
      f: o,
      r: function() {
        throw Error(a(522));
      },
      D: o,
      C: o,
      L: o,
      m: o,
      X: o,
      S: o,
      M: o
    },
    p: 0,
    findDOMNode: null
  }, l = /* @__PURE__ */ Symbol.for("react.portal");
  function d(p, f, v) {
    var y = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: l,
      key: y == null ? null : "" + y,
      children: p,
      containerInfo: f,
      implementation: v
    };
  }
  var _ = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function m(p, f) {
    if (p === "font") return "";
    if (typeof f == "string")
      return f === "use-credentials" ? f : "";
  }
  return St.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = s, St.createPortal = function(p, f) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!f || f.nodeType !== 1 && f.nodeType !== 9 && f.nodeType !== 11)
      throw Error(a(299));
    return d(p, f, null, v);
  }, St.flushSync = function(p) {
    var f = _.T, v = s.p;
    try {
      if (_.T = null, s.p = 2, p) return p();
    } finally {
      _.T = f, s.p = v, s.d.f();
    }
  }, St.preconnect = function(p, f) {
    typeof p == "string" && (f ? (f = f.crossOrigin, f = typeof f == "string" ? f === "use-credentials" ? f : "" : void 0) : f = null, s.d.C(p, f));
  }, St.prefetchDNS = function(p) {
    typeof p == "string" && s.d.D(p);
  }, St.preinit = function(p, f) {
    if (typeof p == "string" && f && typeof f.as == "string") {
      var v = f.as, y = m(v, f.crossOrigin), w = typeof f.integrity == "string" ? f.integrity : void 0, E = typeof f.fetchPriority == "string" ? f.fetchPriority : void 0;
      v === "style" ? s.d.S(
        p,
        typeof f.precedence == "string" ? f.precedence : void 0,
        {
          crossOrigin: y,
          integrity: w,
          fetchPriority: E
        }
      ) : v === "script" && s.d.X(p, {
        crossOrigin: y,
        integrity: w,
        fetchPriority: E,
        nonce: typeof f.nonce == "string" ? f.nonce : void 0
      });
    }
  }, St.preinitModule = function(p, f) {
    if (typeof p == "string")
      if (typeof f == "object" && f !== null) {
        if (f.as == null || f.as === "script") {
          var v = m(
            f.as,
            f.crossOrigin
          );
          s.d.M(p, {
            crossOrigin: v,
            integrity: typeof f.integrity == "string" ? f.integrity : void 0,
            nonce: typeof f.nonce == "string" ? f.nonce : void 0
          });
        }
      } else f == null && s.d.M(p);
  }, St.preload = function(p, f) {
    if (typeof p == "string" && typeof f == "object" && f !== null && typeof f.as == "string") {
      var v = f.as, y = m(v, f.crossOrigin);
      s.d.L(p, v, {
        crossOrigin: y,
        integrity: typeof f.integrity == "string" ? f.integrity : void 0,
        nonce: typeof f.nonce == "string" ? f.nonce : void 0,
        type: typeof f.type == "string" ? f.type : void 0,
        fetchPriority: typeof f.fetchPriority == "string" ? f.fetchPriority : void 0,
        referrerPolicy: typeof f.referrerPolicy == "string" ? f.referrerPolicy : void 0,
        imageSrcSet: typeof f.imageSrcSet == "string" ? f.imageSrcSet : void 0,
        imageSizes: typeof f.imageSizes == "string" ? f.imageSizes : void 0,
        media: typeof f.media == "string" ? f.media : void 0
      });
    }
  }, St.preloadModule = function(p, f) {
    if (typeof p == "string")
      if (f) {
        var v = m(f.as, f.crossOrigin);
        s.d.m(p, {
          as: typeof f.as == "string" && f.as !== "script" ? f.as : void 0,
          crossOrigin: v,
          integrity: typeof f.integrity == "string" ? f.integrity : void 0
        });
      } else s.d.m(p);
  }, St.requestFormReset = function(p) {
    s.d.r(p);
  }, St.unstable_batchedUpdates = function(p, f) {
    return p(f);
  }, St.useFormState = function(p, f, v) {
    return _.H.useFormState(p, f, v);
  }, St.useFormStatus = function() {
    return _.H.useHostTransitionStatus();
  }, St.version = "19.2.3", St;
}
var wp;
function Ob() {
  if (wp) return yu.exports;
  wp = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (a) {
        console.error(a);
      }
  }
  return n(), yu.exports = Mb(), yu.exports;
}
var Sp;
function Rb() {
  if (Sp) return er;
  Sp = 1;
  var n = xb(), a = Iu(), o = Ob();
  function s(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        t += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function l(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function d(e) {
    var t = e, i = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (i = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? i : null;
  }
  function _(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function m(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function p(e) {
    if (d(e) !== e)
      throw Error(s(188));
  }
  function f(e) {
    var t = e.alternate;
    if (!t) {
      if (t = d(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var i = e, r = t; ; ) {
      var c = i.return;
      if (c === null) break;
      var u = c.alternate;
      if (u === null) {
        if (r = c.return, r !== null) {
          i = r;
          continue;
        }
        break;
      }
      if (c.child === u.child) {
        for (u = c.child; u; ) {
          if (u === i) return p(c), e;
          if (u === r) return p(c), t;
          u = u.sibling;
        }
        throw Error(s(188));
      }
      if (i.return !== r.return) i = c, r = u;
      else {
        for (var g = !1, b = c.child; b; ) {
          if (b === i) {
            g = !0, i = c, r = u;
            break;
          }
          if (b === r) {
            g = !0, r = c, i = u;
            break;
          }
          b = b.sibling;
        }
        if (!g) {
          for (b = u.child; b; ) {
            if (b === i) {
              g = !0, i = u, r = c;
              break;
            }
            if (b === r) {
              g = !0, r = u, i = c;
              break;
            }
            b = b.sibling;
          }
          if (!g) throw Error(s(189));
        }
      }
      if (i.alternate !== r) throw Error(s(190));
    }
    if (i.tag !== 3) throw Error(s(188));
    return i.stateNode.current === i ? e : t;
  }
  function v(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = v(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var y = Object.assign, w = /* @__PURE__ */ Symbol.for("react.element"), E = /* @__PURE__ */ Symbol.for("react.transitional.element"), z = /* @__PURE__ */ Symbol.for("react.portal"), N = /* @__PURE__ */ Symbol.for("react.fragment"), j = /* @__PURE__ */ Symbol.for("react.strict_mode"), R = /* @__PURE__ */ Symbol.for("react.profiler"), U = /* @__PURE__ */ Symbol.for("react.consumer"), Y = /* @__PURE__ */ Symbol.for("react.context"), P = /* @__PURE__ */ Symbol.for("react.forward_ref"), I = /* @__PURE__ */ Symbol.for("react.suspense"), F = /* @__PURE__ */ Symbol.for("react.suspense_list"), V = /* @__PURE__ */ Symbol.for("react.memo"), W = /* @__PURE__ */ Symbol.for("react.lazy"), J = /* @__PURE__ */ Symbol.for("react.activity"), se = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), _e = Symbol.iterator;
  function ie(e) {
    return e === null || typeof e != "object" ? null : (e = _e && e[_e] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Ce = /* @__PURE__ */ Symbol.for("react.client.reference");
  function we(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Ce ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case N:
        return "Fragment";
      case R:
        return "Profiler";
      case j:
        return "StrictMode";
      case I:
        return "Suspense";
      case F:
        return "SuspenseList";
      case J:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case z:
          return "Portal";
        case Y:
          return e.displayName || "Context";
        case U:
          return (e._context.displayName || "Context") + ".Consumer";
        case P:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case V:
          return t = e.displayName || null, t !== null ? t : we(e.type) || "Memo";
        case W:
          t = e._payload, e = e._init;
          try {
            return we(e(t));
          } catch {
          }
      }
    return null;
  }
  var xe = Array.isArray, M = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, me = [], pe = -1;
  function k(e) {
    return { current: e };
  }
  function q(e) {
    0 > pe || (e.current = me[pe], me[pe] = null, pe--);
  }
  function X(e, t) {
    pe++, me[pe] = e.current, e.current = t;
  }
  var $ = k(null), te = k(null), le = k(null), ve = k(null);
  function Ye(e, t) {
    switch (X(le, t), X(te, e), X($, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Uf(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Uf(t), e = qf(t, e);
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
    q($), X($, e);
  }
  function Le() {
    q($), q(te), q(le);
  }
  function kt(e) {
    e.memoizedState !== null && X(ve, e);
    var t = $.current, i = qf(t, e.type);
    t !== i && (X(te, e), X($, i));
  }
  function tn(e) {
    te.current === e && (q($), q(te)), ve.current === e && (q(ve), Fo._currentValue = Q);
  }
  var Dt, yn;
  function Tt(e) {
    if (Dt === void 0)
      try {
        throw Error();
      } catch (i) {
        var t = i.stack.trim().match(/\n( *(at )?)/);
        Dt = t && t[1] || "", yn = -1 < i.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < i.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Dt + e + yn;
  }
  var Ua = !1;
  function qa(e, t) {
    if (!e || Ua) return "";
    Ua = !0;
    var i = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var r = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var Z = function() {
                throw Error();
              };
              if (Object.defineProperty(Z.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(Z, []);
                } catch (L) {
                  var O = L;
                }
                Reflect.construct(e, [], Z);
              } else {
                try {
                  Z.call();
                } catch (L) {
                  O = L;
                }
                e.call(Z.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (L) {
                O = L;
              }
              (Z = e()) && typeof Z.catch == "function" && Z.catch(function() {
              });
            }
          } catch (L) {
            if (L && O && typeof L.stack == "string")
              return [L.stack, O.stack];
          }
          return [null, null];
        }
      };
      r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var c = Object.getOwnPropertyDescriptor(
        r.DetermineComponentFrameRoot,
        "name"
      );
      c && c.configurable && Object.defineProperty(
        r.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = r.DetermineComponentFrameRoot(), g = u[0], b = u[1];
      if (g && b) {
        var S = g.split(`
`), x = b.split(`
`);
        for (c = r = 0; r < S.length && !S[r].includes("DetermineComponentFrameRoot"); )
          r++;
        for (; c < x.length && !x[c].includes(
          "DetermineComponentFrameRoot"
        ); )
          c++;
        if (r === S.length || c === x.length)
          for (r = S.length - 1, c = x.length - 1; 1 <= r && 0 <= c && S[r] !== x[c]; )
            c--;
        for (; 1 <= r && 0 <= c; r--, c--)
          if (S[r] !== x[c]) {
            if (r !== 1 || c !== 1)
              do
                if (r--, c--, 0 > c || S[r] !== x[c]) {
                  var G = `
` + S[r].replace(" at new ", " at ");
                  return e.displayName && G.includes("<anonymous>") && (G = G.replace("<anonymous>", e.displayName)), G;
                }
              while (1 <= r && 0 <= c);
            break;
          }
      }
    } finally {
      Ua = !1, Error.prepareStackTrace = i;
    }
    return (i = e ? e.displayName || e.name : "") ? Tt(i) : "";
  }
  function Ga(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Tt(e.type);
      case 16:
        return Tt("Lazy");
      case 13:
        return e.child !== t && t !== null ? Tt("Suspense Fallback") : Tt("Suspense");
      case 19:
        return Tt("SuspenseList");
      case 0:
      case 15:
        return qa(e.type, !1);
      case 11:
        return qa(e.type.render, !1);
      case 1:
        return qa(e.type, !0);
      case 31:
        return Tt("Activity");
      default:
        return "";
    }
  }
  function _i(e) {
    try {
      var t = "", i = null;
      do
        t += Ga(e, i), i = e, e = e.return;
      while (e);
      return t;
    } catch (r) {
      return `
Error generating stack: ` + r.message + `
` + r.stack;
    }
  }
  var bt = Object.prototype.hasOwnProperty, At = n.unstable_scheduleCallback, wt = n.unstable_cancelCallback, bn = n.unstable_shouldYield, ea = n.unstable_requestPaint, Nt = n.unstable_now, rv = n.unstable_getCurrentPriorityLevel, fd = n.unstable_ImmediatePriority, pd = n.unstable_UserBlockingPriority, pr = n.unstable_NormalPriority, sv = n.unstable_LowPriority, gd = n.unstable_IdlePriority, lv = n.log, cv = n.unstable_setDisableYieldValue, ro = null, Yt = null;
  function ta(e) {
    if (typeof lv == "function" && cv(e), Yt && typeof Yt.setStrictMode == "function")
      try {
        Yt.setStrictMode(ro, e);
      } catch {
      }
  }
  var Vt = Math.clz32 ? Math.clz32 : _v, uv = Math.log, dv = Math.LN2;
  function _v(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (uv(e) / dv | 0) | 0;
  }
  var gr = 256, hr = 262144, vr = 4194304;
  function Ia(e) {
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
  function yr(e, t, i) {
    var r = e.pendingLanes;
    if (r === 0) return 0;
    var c = 0, u = e.suspendedLanes, g = e.pingedLanes;
    e = e.warmLanes;
    var b = r & 134217727;
    return b !== 0 ? (r = b & ~u, r !== 0 ? c = Ia(r) : (g &= b, g !== 0 ? c = Ia(g) : i || (i = b & ~e, i !== 0 && (c = Ia(i))))) : (b = r & ~u, b !== 0 ? c = Ia(b) : g !== 0 ? c = Ia(g) : i || (i = r & ~e, i !== 0 && (c = Ia(i)))), c === 0 ? 0 : t !== 0 && t !== c && (t & u) === 0 && (u = c & -c, i = t & -t, u >= i || u === 32 && (i & 4194048) !== 0) ? t : c;
  }
  function so(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function mv(e, t) {
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
  function hd() {
    var e = vr;
    return vr <<= 1, (vr & 62914560) === 0 && (vr = 4194304), e;
  }
  function nl(e) {
    for (var t = [], i = 0; 31 > i; i++) t.push(e);
    return t;
  }
  function lo(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function fv(e, t, i, r, c, u) {
    var g = e.pendingLanes;
    e.pendingLanes = i, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= i, e.entangledLanes &= i, e.errorRecoveryDisabledLanes &= i, e.shellSuspendCounter = 0;
    var b = e.entanglements, S = e.expirationTimes, x = e.hiddenUpdates;
    for (i = g & ~i; 0 < i; ) {
      var G = 31 - Vt(i), Z = 1 << G;
      b[G] = 0, S[G] = -1;
      var O = x[G];
      if (O !== null)
        for (x[G] = null, G = 0; G < O.length; G++) {
          var L = O[G];
          L !== null && (L.lane &= -536870913);
        }
      i &= ~Z;
    }
    r !== 0 && vd(e, r, 0), u !== 0 && c === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(g & ~t));
  }
  function vd(e, t, i) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var r = 31 - Vt(t);
    e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | i & 261930;
  }
  function yd(e, t) {
    var i = e.entangledLanes |= t;
    for (e = e.entanglements; i; ) {
      var r = 31 - Vt(i), c = 1 << r;
      c & t | e[r] & t && (e[r] |= t), i &= ~c;
    }
  }
  function bd(e, t) {
    var i = t & -t;
    return i = (i & 42) !== 0 ? 1 : al(i), (i & (e.suspendedLanes | t)) !== 0 ? 0 : i;
  }
  function al(e) {
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
  function il(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function wd() {
    var e = K.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : sp(e.type));
  }
  function Sd(e, t) {
    var i = K.p;
    try {
      return K.p = e, t();
    } finally {
      K.p = i;
    }
  }
  var na = Math.random().toString(36).slice(2), mt = "__reactFiber$" + na, jt = "__reactProps$" + na, mi = "__reactContainer$" + na, ol = "__reactEvents$" + na, pv = "__reactListeners$" + na, gv = "__reactHandles$" + na, Ed = "__reactResources$" + na, co = "__reactMarker$" + na;
  function rl(e) {
    delete e[mt], delete e[jt], delete e[ol], delete e[pv], delete e[gv];
  }
  function fi(e) {
    var t = e[mt];
    if (t) return t;
    for (var i = e.parentNode; i; ) {
      if (t = i[mi] || i[mt]) {
        if (i = t.alternate, t.child !== null || i !== null && i.child !== null)
          for (e = Yf(e); e !== null; ) {
            if (i = e[mt]) return i;
            e = Yf(e);
          }
        return t;
      }
      e = i, i = e.parentNode;
    }
    return null;
  }
  function pi(e) {
    if (e = e[mt] || e[mi]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function uo(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(s(33));
  }
  function gi(e) {
    var t = e[Ed];
    return t || (t = e[Ed] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function dt(e) {
    e[co] = !0;
  }
  var zd = /* @__PURE__ */ new Set(), kd = {};
  function Ha(e, t) {
    hi(e, t), hi(e + "Capture", t);
  }
  function hi(e, t) {
    for (kd[e] = t, e = 0; e < t.length; e++)
      zd.add(t[e]);
  }
  var hv = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Td = {}, Ad = {};
  function vv(e) {
    return bt.call(Ad, e) ? !0 : bt.call(Td, e) ? !1 : hv.test(e) ? Ad[e] = !0 : (Td[e] = !0, !1);
  }
  function br(e, t, i) {
    if (vv(t))
      if (i === null) e.removeAttribute(t);
      else {
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var r = t.toLowerCase().slice(0, 5);
            if (r !== "data-" && r !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + i);
      }
  }
  function wr(e, t, i) {
    if (i === null) e.removeAttribute(t);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + i);
    }
  }
  function Dn(e, t, i, r) {
    if (r === null) e.removeAttribute(i);
    else {
      switch (typeof r) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(i);
          return;
      }
      e.setAttributeNS(t, i, "" + r);
    }
  }
  function nn(e) {
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
  function Nd(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function yv(e, t, i) {
    var r = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof r < "u" && typeof r.get == "function" && typeof r.set == "function") {
      var c = r.get, u = r.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return c.call(this);
        },
        set: function(g) {
          i = "" + g, u.call(this, g);
        }
      }), Object.defineProperty(e, t, {
        enumerable: r.enumerable
      }), {
        getValue: function() {
          return i;
        },
        setValue: function(g) {
          i = "" + g;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function sl(e) {
    if (!e._valueTracker) {
      var t = Nd(e) ? "checked" : "value";
      e._valueTracker = yv(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Cd(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var i = t.getValue(), r = "";
    return e && (r = Nd(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== i ? (t.setValue(e), !0) : !1;
  }
  function Sr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var bv = /[\n"\\]/g;
  function an(e) {
    return e.replace(
      bv,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ll(e, t, i, r, c, u, g, b) {
    e.name = "", g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? e.type = g : e.removeAttribute("type"), t != null ? g === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + nn(t)) : e.value !== "" + nn(t) && (e.value = "" + nn(t)) : g !== "submit" && g !== "reset" || e.removeAttribute("value"), t != null ? cl(e, g, nn(t)) : i != null ? cl(e, g, nn(i)) : r != null && e.removeAttribute("value"), c == null && u != null && (e.defaultChecked = !!u), c != null && (e.checked = c && typeof c != "function" && typeof c != "symbol"), b != null && typeof b != "function" && typeof b != "symbol" && typeof b != "boolean" ? e.name = "" + nn(b) : e.removeAttribute("name");
  }
  function xd(e, t, i, r, c, u, g, b) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || i != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        sl(e);
        return;
      }
      i = i != null ? "" + nn(i) : "", t = t != null ? "" + nn(t) : i, b || t === e.value || (e.value = t), e.defaultValue = t;
    }
    r = r ?? c, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = b ? e.checked : !!r, e.defaultChecked = !!r, g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" && (e.name = g), sl(e);
  }
  function cl(e, t, i) {
    t === "number" && Sr(e.ownerDocument) === e || e.defaultValue === "" + i || (e.defaultValue = "" + i);
  }
  function vi(e, t, i, r) {
    if (e = e.options, t) {
      t = {};
      for (var c = 0; c < i.length; c++)
        t["$" + i[c]] = !0;
      for (i = 0; i < e.length; i++)
        c = t.hasOwnProperty("$" + e[i].value), e[i].selected !== c && (e[i].selected = c), c && r && (e[i].defaultSelected = !0);
    } else {
      for (i = "" + nn(i), t = null, c = 0; c < e.length; c++) {
        if (e[c].value === i) {
          e[c].selected = !0, r && (e[c].defaultSelected = !0);
          return;
        }
        t !== null || e[c].disabled || (t = e[c]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Md(e, t, i) {
    if (t != null && (t = "" + nn(t), t !== e.value && (e.value = t), i == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = i != null ? "" + nn(i) : "";
  }
  function Od(e, t, i, r) {
    if (t == null) {
      if (r != null) {
        if (i != null) throw Error(s(92));
        if (xe(r)) {
          if (1 < r.length) throw Error(s(93));
          r = r[0];
        }
        i = r;
      }
      i == null && (i = ""), t = i;
    }
    i = nn(t), e.defaultValue = i, r = e.textContent, r === i && r !== "" && r !== null && (e.value = r), sl(e);
  }
  function yi(e, t) {
    if (t) {
      var i = e.firstChild;
      if (i && i === e.lastChild && i.nodeType === 3) {
        i.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var wv = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Rd(e, t, i) {
    var r = t.indexOf("--") === 0;
    i == null || typeof i == "boolean" || i === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, i) : typeof i != "number" || i === 0 || wv.has(t) ? t === "float" ? e.cssFloat = i : e[t] = ("" + i).trim() : e[t] = i + "px";
  }
  function Dd(e, t, i) {
    if (t != null && typeof t != "object")
      throw Error(s(62));
    if (e = e.style, i != null) {
      for (var r in i)
        !i.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
      for (var c in t)
        r = t[c], t.hasOwnProperty(c) && i[c] !== r && Rd(e, c, r);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && Rd(e, u, t[u]);
  }
  function ul(e) {
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
  var Sv = /* @__PURE__ */ new Map([
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
  ]), Ev = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Er(e) {
    return Ev.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function jn() {
  }
  var dl = null;
  function _l(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var bi = null, wi = null;
  function jd(e) {
    var t = pi(e);
    if (t && (e = t.stateNode)) {
      var i = e[jt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (ll(
            e,
            i.value,
            i.defaultValue,
            i.defaultValue,
            i.checked,
            i.defaultChecked,
            i.type,
            i.name
          ), t = i.name, i.type === "radio" && t != null) {
            for (i = e; i.parentNode; ) i = i.parentNode;
            for (i = i.querySelectorAll(
              'input[name="' + an(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < i.length; t++) {
              var r = i[t];
              if (r !== e && r.form === e.form) {
                var c = r[jt] || null;
                if (!c) throw Error(s(90));
                ll(
                  r,
                  c.value,
                  c.defaultValue,
                  c.defaultValue,
                  c.checked,
                  c.defaultChecked,
                  c.type,
                  c.name
                );
              }
            }
            for (t = 0; t < i.length; t++)
              r = i[t], r.form === e.form && Cd(r);
          }
          break e;
        case "textarea":
          Md(e, i.value, i.defaultValue);
          break e;
        case "select":
          t = i.value, t != null && vi(e, !!i.multiple, t, !1);
      }
    }
  }
  var ml = !1;
  function Ld(e, t, i) {
    if (ml) return e(t, i);
    ml = !0;
    try {
      var r = e(t);
      return r;
    } finally {
      if (ml = !1, (bi !== null || wi !== null) && (us(), bi && (t = bi, e = wi, wi = bi = null, jd(t), e)))
        for (t = 0; t < e.length; t++) jd(e[t]);
    }
  }
  function _o(e, t) {
    var i = e.stateNode;
    if (i === null) return null;
    var r = i[jt] || null;
    if (r === null) return null;
    i = r[t];
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
        (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (i && typeof i != "function")
      throw Error(
        s(231, t, typeof i)
      );
    return i;
  }
  var Ln = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), fl = !1;
  if (Ln)
    try {
      var mo = {};
      Object.defineProperty(mo, "passive", {
        get: function() {
          fl = !0;
        }
      }), window.addEventListener("test", mo, mo), window.removeEventListener("test", mo, mo);
    } catch {
      fl = !1;
    }
  var aa = null, pl = null, zr = null;
  function Ud() {
    if (zr) return zr;
    var e, t = pl, i = t.length, r, c = "value" in aa ? aa.value : aa.textContent, u = c.length;
    for (e = 0; e < i && t[e] === c[e]; e++) ;
    var g = i - e;
    for (r = 1; r <= g && t[i - r] === c[u - r]; r++) ;
    return zr = c.slice(e, 1 < r ? 1 - r : void 0);
  }
  function kr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Tr() {
    return !0;
  }
  function qd() {
    return !1;
  }
  function Lt(e) {
    function t(i, r, c, u, g) {
      this._reactName = i, this._targetInst = c, this.type = r, this.nativeEvent = u, this.target = g, this.currentTarget = null;
      for (var b in e)
        e.hasOwnProperty(b) && (i = e[b], this[b] = i ? i(u) : u[b]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Tr : qd, this.isPropagationStopped = qd, this;
    }
    return y(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var i = this.nativeEvent;
        i && (i.preventDefault ? i.preventDefault() : typeof i.returnValue != "unknown" && (i.returnValue = !1), this.isDefaultPrevented = Tr);
      },
      stopPropagation: function() {
        var i = this.nativeEvent;
        i && (i.stopPropagation ? i.stopPropagation() : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0), this.isPropagationStopped = Tr);
      },
      persist: function() {
      },
      isPersistent: Tr
    }), t;
  }
  var Pa = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ar = Lt(Pa), fo = y({}, Pa, { view: 0, detail: 0 }), zv = Lt(fo), gl, hl, po, Nr = y({}, fo, {
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
    getModifierState: yl,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== po && (po && e.type === "mousemove" ? (gl = e.screenX - po.screenX, hl = e.screenY - po.screenY) : hl = gl = 0, po = e), gl);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : hl;
    }
  }), Gd = Lt(Nr), kv = y({}, Nr, { dataTransfer: 0 }), Tv = Lt(kv), Av = y({}, fo, { relatedTarget: 0 }), vl = Lt(Av), Nv = y({}, Pa, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Cv = Lt(Nv), xv = y({}, Pa, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Mv = Lt(xv), Ov = y({}, Pa, { data: 0 }), Id = Lt(Ov), Rv = {
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
  }, Dv = {
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
  }, jv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Lv(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = jv[e]) ? !!t[e] : !1;
  }
  function yl() {
    return Lv;
  }
  var Uv = y({}, fo, {
    key: function(e) {
      if (e.key) {
        var t = Rv[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = kr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Dv[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: yl,
    charCode: function(e) {
      return e.type === "keypress" ? kr(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? kr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), qv = Lt(Uv), Gv = y({}, Nr, {
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
  }), Hd = Lt(Gv), Iv = y({}, fo, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: yl
  }), Hv = Lt(Iv), Pv = y({}, Pa, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Bv = Lt(Pv), Zv = y({}, Nr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Yv = Lt(Zv), Vv = y({}, Pa, {
    newState: 0,
    oldState: 0
  }), Kv = Lt(Vv), Xv = [9, 13, 27, 32], bl = Ln && "CompositionEvent" in window, go = null;
  Ln && "documentMode" in document && (go = document.documentMode);
  var Fv = Ln && "TextEvent" in window && !go, Pd = Ln && (!bl || go && 8 < go && 11 >= go), Bd = " ", Zd = !1;
  function Yd(e, t) {
    switch (e) {
      case "keyup":
        return Xv.indexOf(t.keyCode) !== -1;
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
  function Vd(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Si = !1;
  function Wv(e, t) {
    switch (e) {
      case "compositionend":
        return Vd(t);
      case "keypress":
        return t.which !== 32 ? null : (Zd = !0, Bd);
      case "textInput":
        return e = t.data, e === Bd && Zd ? null : e;
      default:
        return null;
    }
  }
  function $v(e, t) {
    if (Si)
      return e === "compositionend" || !bl && Yd(e, t) ? (e = Ud(), zr = pl = aa = null, Si = !1, e) : null;
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
        return Pd && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Qv = {
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
  function Kd(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Qv[e.type] : t === "textarea";
  }
  function Xd(e, t, i, r) {
    bi ? wi ? wi.push(r) : wi = [r] : bi = r, t = hs(t, "onChange"), 0 < t.length && (i = new Ar(
      "onChange",
      "change",
      null,
      i,
      r
    ), e.push({ event: i, listeners: t }));
  }
  var ho = null, vo = null;
  function Jv(e) {
    Mf(e, 0);
  }
  function Cr(e) {
    var t = uo(e);
    if (Cd(t)) return e;
  }
  function Fd(e, t) {
    if (e === "change") return t;
  }
  var Wd = !1;
  if (Ln) {
    var wl;
    if (Ln) {
      var Sl = "oninput" in document;
      if (!Sl) {
        var $d = document.createElement("div");
        $d.setAttribute("oninput", "return;"), Sl = typeof $d.oninput == "function";
      }
      wl = Sl;
    } else wl = !1;
    Wd = wl && (!document.documentMode || 9 < document.documentMode);
  }
  function Qd() {
    ho && (ho.detachEvent("onpropertychange", Jd), vo = ho = null);
  }
  function Jd(e) {
    if (e.propertyName === "value" && Cr(vo)) {
      var t = [];
      Xd(
        t,
        vo,
        e,
        _l(e)
      ), Ld(Jv, t);
    }
  }
  function ey(e, t, i) {
    e === "focusin" ? (Qd(), ho = t, vo = i, ho.attachEvent("onpropertychange", Jd)) : e === "focusout" && Qd();
  }
  function ty(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Cr(vo);
  }
  function ny(e, t) {
    if (e === "click") return Cr(t);
  }
  function ay(e, t) {
    if (e === "input" || e === "change")
      return Cr(t);
  }
  function iy(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Kt = typeof Object.is == "function" ? Object.is : iy;
  function yo(e, t) {
    if (Kt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var i = Object.keys(e), r = Object.keys(t);
    if (i.length !== r.length) return !1;
    for (r = 0; r < i.length; r++) {
      var c = i[r];
      if (!bt.call(t, c) || !Kt(e[c], t[c]))
        return !1;
    }
    return !0;
  }
  function e_(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function t_(e, t) {
    var i = e_(e);
    e = 0;
    for (var r; i; ) {
      if (i.nodeType === 3) {
        if (r = e + i.textContent.length, e <= t && r >= t)
          return { node: i, offset: t - e };
        e = r;
      }
      e: {
        for (; i; ) {
          if (i.nextSibling) {
            i = i.nextSibling;
            break e;
          }
          i = i.parentNode;
        }
        i = void 0;
      }
      i = e_(i);
    }
  }
  function n_(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? n_(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function a_(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Sr(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var i = typeof t.contentWindow.location.href == "string";
      } catch {
        i = !1;
      }
      if (i) e = t.contentWindow;
      else break;
      t = Sr(e.document);
    }
    return t;
  }
  function El(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var oy = Ln && "documentMode" in document && 11 >= document.documentMode, Ei = null, zl = null, bo = null, kl = !1;
  function i_(e, t, i) {
    var r = i.window === i ? i.document : i.nodeType === 9 ? i : i.ownerDocument;
    kl || Ei == null || Ei !== Sr(r) || (r = Ei, "selectionStart" in r && El(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
      anchorNode: r.anchorNode,
      anchorOffset: r.anchorOffset,
      focusNode: r.focusNode,
      focusOffset: r.focusOffset
    }), bo && yo(bo, r) || (bo = r, r = hs(zl, "onSelect"), 0 < r.length && (t = new Ar(
      "onSelect",
      "select",
      null,
      t,
      i
    ), e.push({ event: t, listeners: r }), t.target = Ei)));
  }
  function Ba(e, t) {
    var i = {};
    return i[e.toLowerCase()] = t.toLowerCase(), i["Webkit" + e] = "webkit" + t, i["Moz" + e] = "moz" + t, i;
  }
  var zi = {
    animationend: Ba("Animation", "AnimationEnd"),
    animationiteration: Ba("Animation", "AnimationIteration"),
    animationstart: Ba("Animation", "AnimationStart"),
    transitionrun: Ba("Transition", "TransitionRun"),
    transitionstart: Ba("Transition", "TransitionStart"),
    transitioncancel: Ba("Transition", "TransitionCancel"),
    transitionend: Ba("Transition", "TransitionEnd")
  }, Tl = {}, o_ = {};
  Ln && (o_ = document.createElement("div").style, "AnimationEvent" in window || (delete zi.animationend.animation, delete zi.animationiteration.animation, delete zi.animationstart.animation), "TransitionEvent" in window || delete zi.transitionend.transition);
  function Za(e) {
    if (Tl[e]) return Tl[e];
    if (!zi[e]) return e;
    var t = zi[e], i;
    for (i in t)
      if (t.hasOwnProperty(i) && i in o_)
        return Tl[e] = t[i];
    return e;
  }
  var r_ = Za("animationend"), s_ = Za("animationiteration"), l_ = Za("animationstart"), ry = Za("transitionrun"), sy = Za("transitionstart"), ly = Za("transitioncancel"), c_ = Za("transitionend"), u_ = /* @__PURE__ */ new Map(), Al = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Al.push("scrollEnd");
  function wn(e, t) {
    u_.set(e, t), Ha(t, [e]);
  }
  var xr = typeof reportError == "function" ? reportError : function(e) {
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
  }, on = [], ki = 0, Nl = 0;
  function Mr() {
    for (var e = ki, t = Nl = ki = 0; t < e; ) {
      var i = on[t];
      on[t++] = null;
      var r = on[t];
      on[t++] = null;
      var c = on[t];
      on[t++] = null;
      var u = on[t];
      if (on[t++] = null, r !== null && c !== null) {
        var g = r.pending;
        g === null ? c.next = c : (c.next = g.next, g.next = c), r.pending = c;
      }
      u !== 0 && d_(i, c, u);
    }
  }
  function Or(e, t, i, r) {
    on[ki++] = e, on[ki++] = t, on[ki++] = i, on[ki++] = r, Nl |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
  }
  function Cl(e, t, i, r) {
    return Or(e, t, i, r), Rr(e);
  }
  function Ya(e, t) {
    return Or(e, null, null, t), Rr(e);
  }
  function d_(e, t, i) {
    e.lanes |= i;
    var r = e.alternate;
    r !== null && (r.lanes |= i);
    for (var c = !1, u = e.return; u !== null; )
      u.childLanes |= i, r = u.alternate, r !== null && (r.childLanes |= i), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (c = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, c && t !== null && (c = 31 - Vt(i), e = u.hiddenUpdates, r = e[c], r === null ? e[c] = [t] : r.push(t), t.lane = i | 536870912), u) : null;
  }
  function Rr(e) {
    if (50 < Po)
      throw Po = 0, qc = null, Error(s(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Ti = {};
  function cy(e, t, i, r) {
    this.tag = e, this.key = i, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Xt(e, t, i, r) {
    return new cy(e, t, i, r);
  }
  function xl(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Un(e, t) {
    var i = e.alternate;
    return i === null ? (i = Xt(
      e.tag,
      t,
      e.key,
      e.mode
    ), i.elementType = e.elementType, i.type = e.type, i.stateNode = e.stateNode, i.alternate = e, e.alternate = i) : (i.pendingProps = t, i.type = e.type, i.flags = 0, i.subtreeFlags = 0, i.deletions = null), i.flags = e.flags & 65011712, i.childLanes = e.childLanes, i.lanes = e.lanes, i.child = e.child, i.memoizedProps = e.memoizedProps, i.memoizedState = e.memoizedState, i.updateQueue = e.updateQueue, t = e.dependencies, i.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, i.sibling = e.sibling, i.index = e.index, i.ref = e.ref, i.refCleanup = e.refCleanup, i;
  }
  function __(e, t) {
    e.flags &= 65011714;
    var i = e.alternate;
    return i === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = i.childLanes, e.lanes = i.lanes, e.child = i.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = i.memoizedProps, e.memoizedState = i.memoizedState, e.updateQueue = i.updateQueue, e.type = i.type, t = i.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Dr(e, t, i, r, c, u) {
    var g = 0;
    if (r = e, typeof e == "function") xl(e) && (g = 1);
    else if (typeof e == "string")
      g = fb(
        e,
        i,
        $.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case J:
          return e = Xt(31, i, t, c), e.elementType = J, e.lanes = u, e;
        case N:
          return Va(i.children, c, u, t);
        case j:
          g = 8, c |= 24;
          break;
        case R:
          return e = Xt(12, i, t, c | 2), e.elementType = R, e.lanes = u, e;
        case I:
          return e = Xt(13, i, t, c), e.elementType = I, e.lanes = u, e;
        case F:
          return e = Xt(19, i, t, c), e.elementType = F, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Y:
                g = 10;
                break e;
              case U:
                g = 9;
                break e;
              case P:
                g = 11;
                break e;
              case V:
                g = 14;
                break e;
              case W:
                g = 16, r = null;
                break e;
            }
          g = 29, i = Error(
            s(130, e === null ? "null" : typeof e, "")
          ), r = null;
      }
    return t = Xt(g, i, t, c), t.elementType = e, t.type = r, t.lanes = u, t;
  }
  function Va(e, t, i, r) {
    return e = Xt(7, e, r, t), e.lanes = i, e;
  }
  function Ml(e, t, i) {
    return e = Xt(6, e, null, t), e.lanes = i, e;
  }
  function m_(e) {
    var t = Xt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Ol(e, t, i) {
    return t = Xt(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = i, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var f_ = /* @__PURE__ */ new WeakMap();
  function rn(e, t) {
    if (typeof e == "object" && e !== null) {
      var i = f_.get(e);
      return i !== void 0 ? i : (t = {
        value: e,
        source: t,
        stack: _i(t)
      }, f_.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: _i(t)
    };
  }
  var Ai = [], Ni = 0, jr = null, wo = 0, sn = [], ln = 0, ia = null, An = 1, Nn = "";
  function qn(e, t) {
    Ai[Ni++] = wo, Ai[Ni++] = jr, jr = e, wo = t;
  }
  function p_(e, t, i) {
    sn[ln++] = An, sn[ln++] = Nn, sn[ln++] = ia, ia = e;
    var r = An;
    e = Nn;
    var c = 32 - Vt(r) - 1;
    r &= ~(1 << c), i += 1;
    var u = 32 - Vt(t) + c;
    if (30 < u) {
      var g = c - c % 5;
      u = (r & (1 << g) - 1).toString(32), r >>= g, c -= g, An = 1 << 32 - Vt(t) + c | i << c | r, Nn = u + e;
    } else
      An = 1 << u | i << c | r, Nn = e;
  }
  function Rl(e) {
    e.return !== null && (qn(e, 1), p_(e, 1, 0));
  }
  function Dl(e) {
    for (; e === jr; )
      jr = Ai[--Ni], Ai[Ni] = null, wo = Ai[--Ni], Ai[Ni] = null;
    for (; e === ia; )
      ia = sn[--ln], sn[ln] = null, Nn = sn[--ln], sn[ln] = null, An = sn[--ln], sn[ln] = null;
  }
  function g_(e, t) {
    sn[ln++] = An, sn[ln++] = Nn, sn[ln++] = ia, An = t.id, Nn = t.overflow, ia = e;
  }
  var ft = null, Ve = null, Ae = !1, oa = null, cn = !1, jl = Error(s(519));
  function ra(e) {
    var t = Error(
      s(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw So(rn(t, e)), jl;
  }
  function h_(e) {
    var t = e.stateNode, i = e.type, r = e.memoizedProps;
    switch (t[mt] = e, t[jt] = r, i) {
      case "dialog":
        Ee("cancel", t), Ee("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        Ee("load", t);
        break;
      case "video":
      case "audio":
        for (i = 0; i < Zo.length; i++)
          Ee(Zo[i], t);
        break;
      case "source":
        Ee("error", t);
        break;
      case "img":
      case "image":
      case "link":
        Ee("error", t), Ee("load", t);
        break;
      case "details":
        Ee("toggle", t);
        break;
      case "input":
        Ee("invalid", t), xd(
          t,
          r.value,
          r.defaultValue,
          r.checked,
          r.defaultChecked,
          r.type,
          r.name,
          !0
        );
        break;
      case "select":
        Ee("invalid", t);
        break;
      case "textarea":
        Ee("invalid", t), Od(t, r.value, r.defaultValue, r.children);
    }
    i = r.children, typeof i != "string" && typeof i != "number" && typeof i != "bigint" || t.textContent === "" + i || r.suppressHydrationWarning === !0 || jf(t.textContent, i) ? (r.popover != null && (Ee("beforetoggle", t), Ee("toggle", t)), r.onScroll != null && Ee("scroll", t), r.onScrollEnd != null && Ee("scrollend", t), r.onClick != null && (t.onclick = jn), t = !0) : t = !1, t || ra(e, !0);
  }
  function v_(e) {
    for (ft = e.return; ft; )
      switch (ft.tag) {
        case 5:
        case 31:
        case 13:
          cn = !1;
          return;
        case 27:
        case 3:
          cn = !0;
          return;
        default:
          ft = ft.return;
      }
  }
  function Ci(e) {
    if (e !== ft) return !1;
    if (!Ae) return v_(e), Ae = !0, !1;
    var t = e.tag, i;
    if ((i = t !== 3 && t !== 27) && ((i = t === 5) && (i = e.type, i = !(i !== "form" && i !== "button") || Jc(e.type, e.memoizedProps)), i = !i), i && Ve && ra(e), v_(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      Ve = Zf(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      Ve = Zf(e);
    } else
      t === 27 ? (t = Ve, ba(e.type) ? (e = iu, iu = null, Ve = e) : Ve = t) : Ve = ft ? dn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ka() {
    Ve = ft = null, Ae = !1;
  }
  function Ll() {
    var e = oa;
    return e !== null && (It === null ? It = e : It.push.apply(
      It,
      e
    ), oa = null), e;
  }
  function So(e) {
    oa === null ? oa = [e] : oa.push(e);
  }
  var Ul = k(null), Xa = null, Gn = null;
  function sa(e, t, i) {
    X(Ul, t._currentValue), t._currentValue = i;
  }
  function In(e) {
    e._currentValue = Ul.current, q(Ul);
  }
  function ql(e, t, i) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === i) break;
      e = e.return;
    }
  }
  function Gl(e, t, i, r) {
    var c = e.child;
    for (c !== null && (c.return = e); c !== null; ) {
      var u = c.dependencies;
      if (u !== null) {
        var g = c.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var b = u;
          u = c;
          for (var S = 0; S < t.length; S++)
            if (b.context === t[S]) {
              u.lanes |= i, b = u.alternate, b !== null && (b.lanes |= i), ql(
                u.return,
                i,
                e
              ), r || (g = null);
              break e;
            }
          u = b.next;
        }
      } else if (c.tag === 18) {
        if (g = c.return, g === null) throw Error(s(341));
        g.lanes |= i, u = g.alternate, u !== null && (u.lanes |= i), ql(g, i, e), g = null;
      } else g = c.child;
      if (g !== null) g.return = c;
      else
        for (g = c; g !== null; ) {
          if (g === e) {
            g = null;
            break;
          }
          if (c = g.sibling, c !== null) {
            c.return = g.return, g = c;
            break;
          }
          g = g.return;
        }
      c = g;
    }
  }
  function xi(e, t, i, r) {
    e = null;
    for (var c = t, u = !1; c !== null; ) {
      if (!u) {
        if ((c.flags & 524288) !== 0) u = !0;
        else if ((c.flags & 262144) !== 0) break;
      }
      if (c.tag === 10) {
        var g = c.alternate;
        if (g === null) throw Error(s(387));
        if (g = g.memoizedProps, g !== null) {
          var b = c.type;
          Kt(c.pendingProps.value, g.value) || (e !== null ? e.push(b) : e = [b]);
        }
      } else if (c === ve.current) {
        if (g = c.alternate, g === null) throw Error(s(387));
        g.memoizedState.memoizedState !== c.memoizedState.memoizedState && (e !== null ? e.push(Fo) : e = [Fo]);
      }
      c = c.return;
    }
    e !== null && Gl(
      t,
      e,
      i,
      r
    ), t.flags |= 262144;
  }
  function Lr(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Kt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Fa(e) {
    Xa = e, Gn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function pt(e) {
    return y_(Xa, e);
  }
  function Ur(e, t) {
    return Xa === null && Fa(e), y_(e, t);
  }
  function y_(e, t) {
    var i = t._currentValue;
    if (t = { context: t, memoizedValue: i, next: null }, Gn === null) {
      if (e === null) throw Error(s(308));
      Gn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Gn = Gn.next = t;
    return i;
  }
  var uy = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(i, r) {
        e.push(r);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(i) {
        return i();
      });
    };
  }, dy = n.unstable_scheduleCallback, _y = n.unstable_NormalPriority, ot = {
    $$typeof: Y,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Il() {
    return {
      controller: new uy(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Eo(e) {
    e.refCount--, e.refCount === 0 && dy(_y, function() {
      e.controller.abort();
    });
  }
  var zo = null, Hl = 0, Mi = 0, Oi = null;
  function my(e, t) {
    if (zo === null) {
      var i = zo = [];
      Hl = 0, Mi = Zc(), Oi = {
        status: "pending",
        value: void 0,
        then: function(r) {
          i.push(r);
        }
      };
    }
    return Hl++, t.then(b_, b_), t;
  }
  function b_() {
    if (--Hl === 0 && zo !== null) {
      Oi !== null && (Oi.status = "fulfilled");
      var e = zo;
      zo = null, Mi = 0, Oi = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function fy(e, t) {
    var i = [], r = {
      status: "pending",
      value: null,
      reason: null,
      then: function(c) {
        i.push(c);
      }
    };
    return e.then(
      function() {
        r.status = "fulfilled", r.value = t;
        for (var c = 0; c < i.length; c++) (0, i[c])(t);
      },
      function(c) {
        for (r.status = "rejected", r.reason = c, c = 0; c < i.length; c++)
          (0, i[c])(void 0);
      }
    ), r;
  }
  var w_ = M.S;
  M.S = function(e, t) {
    of = Nt(), typeof t == "object" && t !== null && typeof t.then == "function" && my(e, t), w_ !== null && w_(e, t);
  };
  var Wa = k(null);
  function Pl() {
    var e = Wa.current;
    return e !== null ? e : Ze.pooledCache;
  }
  function qr(e, t) {
    t === null ? X(Wa, Wa.current) : X(Wa, t.pool);
  }
  function S_() {
    var e = Pl();
    return e === null ? null : { parent: ot._currentValue, pool: e };
  }
  var Ri = Error(s(460)), Bl = Error(s(474)), Gr = Error(s(542)), Ir = { then: function() {
  } };
  function E_(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function z_(e, t, i) {
    switch (i = e[i], i === void 0 ? e.push(t) : i !== t && (t.then(jn, jn), t = i), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, T_(e), e;
      default:
        if (typeof t.status == "string") t.then(jn, jn);
        else {
          if (e = Ze, e !== null && 100 < e.shellSuspendCounter)
            throw Error(s(482));
          e = t, e.status = "pending", e.then(
            function(r) {
              if (t.status === "pending") {
                var c = t;
                c.status = "fulfilled", c.value = r;
              }
            },
            function(r) {
              if (t.status === "pending") {
                var c = t;
                c.status = "rejected", c.reason = r;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, T_(e), e;
        }
        throw Qa = t, Ri;
    }
  }
  function $a(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (i) {
      throw i !== null && typeof i == "object" && typeof i.then == "function" ? (Qa = i, Ri) : i;
    }
  }
  var Qa = null;
  function k_() {
    if (Qa === null) throw Error(s(459));
    var e = Qa;
    return Qa = null, e;
  }
  function T_(e) {
    if (e === Ri || e === Gr)
      throw Error(s(483));
  }
  var Di = null, ko = 0;
  function Hr(e) {
    var t = ko;
    return ko += 1, Di === null && (Di = []), z_(Di, e, t);
  }
  function To(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Pr(e, t) {
    throw t.$$typeof === w ? Error(s(525)) : (e = Object.prototype.toString.call(t), Error(
      s(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function A_(e) {
    function t(A, T) {
      if (e) {
        var C = A.deletions;
        C === null ? (A.deletions = [T], A.flags |= 16) : C.push(T);
      }
    }
    function i(A, T) {
      if (!e) return null;
      for (; T !== null; )
        t(A, T), T = T.sibling;
      return null;
    }
    function r(A) {
      for (var T = /* @__PURE__ */ new Map(); A !== null; )
        A.key !== null ? T.set(A.key, A) : T.set(A.index, A), A = A.sibling;
      return T;
    }
    function c(A, T) {
      return A = Un(A, T), A.index = 0, A.sibling = null, A;
    }
    function u(A, T, C) {
      return A.index = C, e ? (C = A.alternate, C !== null ? (C = C.index, C < T ? (A.flags |= 67108866, T) : C) : (A.flags |= 67108866, T)) : (A.flags |= 1048576, T);
    }
    function g(A) {
      return e && A.alternate === null && (A.flags |= 67108866), A;
    }
    function b(A, T, C, H) {
      return T === null || T.tag !== 6 ? (T = Ml(C, A.mode, H), T.return = A, T) : (T = c(T, C), T.return = A, T);
    }
    function S(A, T, C, H) {
      var oe = C.type;
      return oe === N ? G(
        A,
        T,
        C.props.children,
        H,
        C.key
      ) : T !== null && (T.elementType === oe || typeof oe == "object" && oe !== null && oe.$$typeof === W && $a(oe) === T.type) ? (T = c(T, C.props), To(T, C), T.return = A, T) : (T = Dr(
        C.type,
        C.key,
        C.props,
        null,
        A.mode,
        H
      ), To(T, C), T.return = A, T);
    }
    function x(A, T, C, H) {
      return T === null || T.tag !== 4 || T.stateNode.containerInfo !== C.containerInfo || T.stateNode.implementation !== C.implementation ? (T = Ol(C, A.mode, H), T.return = A, T) : (T = c(T, C.children || []), T.return = A, T);
    }
    function G(A, T, C, H, oe) {
      return T === null || T.tag !== 7 ? (T = Va(
        C,
        A.mode,
        H,
        oe
      ), T.return = A, T) : (T = c(T, C), T.return = A, T);
    }
    function Z(A, T, C) {
      if (typeof T == "string" && T !== "" || typeof T == "number" || typeof T == "bigint")
        return T = Ml(
          "" + T,
          A.mode,
          C
        ), T.return = A, T;
      if (typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case E:
            return C = Dr(
              T.type,
              T.key,
              T.props,
              null,
              A.mode,
              C
            ), To(C, T), C.return = A, C;
          case z:
            return T = Ol(
              T,
              A.mode,
              C
            ), T.return = A, T;
          case W:
            return T = $a(T), Z(A, T, C);
        }
        if (xe(T) || ie(T))
          return T = Va(
            T,
            A.mode,
            C,
            null
          ), T.return = A, T;
        if (typeof T.then == "function")
          return Z(A, Hr(T), C);
        if (T.$$typeof === Y)
          return Z(
            A,
            Ur(A, T),
            C
          );
        Pr(A, T);
      }
      return null;
    }
    function O(A, T, C, H) {
      var oe = T !== null ? T.key : null;
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return oe !== null ? null : b(A, T, "" + C, H);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case E:
            return C.key === oe ? S(A, T, C, H) : null;
          case z:
            return C.key === oe ? x(A, T, C, H) : null;
          case W:
            return C = $a(C), O(A, T, C, H);
        }
        if (xe(C) || ie(C))
          return oe !== null ? null : G(A, T, C, H, null);
        if (typeof C.then == "function")
          return O(
            A,
            T,
            Hr(C),
            H
          );
        if (C.$$typeof === Y)
          return O(
            A,
            T,
            Ur(A, C),
            H
          );
        Pr(A, C);
      }
      return null;
    }
    function L(A, T, C, H, oe) {
      if (typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint")
        return A = A.get(C) || null, b(T, A, "" + H, oe);
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case E:
            return A = A.get(
              H.key === null ? C : H.key
            ) || null, S(T, A, H, oe);
          case z:
            return A = A.get(
              H.key === null ? C : H.key
            ) || null, x(T, A, H, oe);
          case W:
            return H = $a(H), L(
              A,
              T,
              C,
              H,
              oe
            );
        }
        if (xe(H) || ie(H))
          return A = A.get(C) || null, G(T, A, H, oe, null);
        if (typeof H.then == "function")
          return L(
            A,
            T,
            C,
            Hr(H),
            oe
          );
        if (H.$$typeof === Y)
          return L(
            A,
            T,
            C,
            Ur(T, H),
            oe
          );
        Pr(T, H);
      }
      return null;
    }
    function ee(A, T, C, H) {
      for (var oe = null, Me = null, ae = T, be = T = 0, ke = null; ae !== null && be < C.length; be++) {
        ae.index > be ? (ke = ae, ae = null) : ke = ae.sibling;
        var Oe = O(
          A,
          ae,
          C[be],
          H
        );
        if (Oe === null) {
          ae === null && (ae = ke);
          break;
        }
        e && ae && Oe.alternate === null && t(A, ae), T = u(Oe, T, be), Me === null ? oe = Oe : Me.sibling = Oe, Me = Oe, ae = ke;
      }
      if (be === C.length)
        return i(A, ae), Ae && qn(A, be), oe;
      if (ae === null) {
        for (; be < C.length; be++)
          ae = Z(A, C[be], H), ae !== null && (T = u(
            ae,
            T,
            be
          ), Me === null ? oe = ae : Me.sibling = ae, Me = ae);
        return Ae && qn(A, be), oe;
      }
      for (ae = r(ae); be < C.length; be++)
        ke = L(
          ae,
          A,
          be,
          C[be],
          H
        ), ke !== null && (e && ke.alternate !== null && ae.delete(
          ke.key === null ? be : ke.key
        ), T = u(
          ke,
          T,
          be
        ), Me === null ? oe = ke : Me.sibling = ke, Me = ke);
      return e && ae.forEach(function(ka) {
        return t(A, ka);
      }), Ae && qn(A, be), oe;
    }
    function ue(A, T, C, H) {
      if (C == null) throw Error(s(151));
      for (var oe = null, Me = null, ae = T, be = T = 0, ke = null, Oe = C.next(); ae !== null && !Oe.done; be++, Oe = C.next()) {
        ae.index > be ? (ke = ae, ae = null) : ke = ae.sibling;
        var ka = O(A, ae, Oe.value, H);
        if (ka === null) {
          ae === null && (ae = ke);
          break;
        }
        e && ae && ka.alternate === null && t(A, ae), T = u(ka, T, be), Me === null ? oe = ka : Me.sibling = ka, Me = ka, ae = ke;
      }
      if (Oe.done)
        return i(A, ae), Ae && qn(A, be), oe;
      if (ae === null) {
        for (; !Oe.done; be++, Oe = C.next())
          Oe = Z(A, Oe.value, H), Oe !== null && (T = u(Oe, T, be), Me === null ? oe = Oe : Me.sibling = Oe, Me = Oe);
        return Ae && qn(A, be), oe;
      }
      for (ae = r(ae); !Oe.done; be++, Oe = C.next())
        Oe = L(ae, A, be, Oe.value, H), Oe !== null && (e && Oe.alternate !== null && ae.delete(Oe.key === null ? be : Oe.key), T = u(Oe, T, be), Me === null ? oe = Oe : Me.sibling = Oe, Me = Oe);
      return e && ae.forEach(function(kb) {
        return t(A, kb);
      }), Ae && qn(A, be), oe;
    }
    function Be(A, T, C, H) {
      if (typeof C == "object" && C !== null && C.type === N && C.key === null && (C = C.props.children), typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case E:
            e: {
              for (var oe = C.key; T !== null; ) {
                if (T.key === oe) {
                  if (oe = C.type, oe === N) {
                    if (T.tag === 7) {
                      i(
                        A,
                        T.sibling
                      ), H = c(
                        T,
                        C.props.children
                      ), H.return = A, A = H;
                      break e;
                    }
                  } else if (T.elementType === oe || typeof oe == "object" && oe !== null && oe.$$typeof === W && $a(oe) === T.type) {
                    i(
                      A,
                      T.sibling
                    ), H = c(T, C.props), To(H, C), H.return = A, A = H;
                    break e;
                  }
                  i(A, T);
                  break;
                } else t(A, T);
                T = T.sibling;
              }
              C.type === N ? (H = Va(
                C.props.children,
                A.mode,
                H,
                C.key
              ), H.return = A, A = H) : (H = Dr(
                C.type,
                C.key,
                C.props,
                null,
                A.mode,
                H
              ), To(H, C), H.return = A, A = H);
            }
            return g(A);
          case z:
            e: {
              for (oe = C.key; T !== null; ) {
                if (T.key === oe)
                  if (T.tag === 4 && T.stateNode.containerInfo === C.containerInfo && T.stateNode.implementation === C.implementation) {
                    i(
                      A,
                      T.sibling
                    ), H = c(T, C.children || []), H.return = A, A = H;
                    break e;
                  } else {
                    i(A, T);
                    break;
                  }
                else t(A, T);
                T = T.sibling;
              }
              H = Ol(C, A.mode, H), H.return = A, A = H;
            }
            return g(A);
          case W:
            return C = $a(C), Be(
              A,
              T,
              C,
              H
            );
        }
        if (xe(C))
          return ee(
            A,
            T,
            C,
            H
          );
        if (ie(C)) {
          if (oe = ie(C), typeof oe != "function") throw Error(s(150));
          return C = oe.call(C), ue(
            A,
            T,
            C,
            H
          );
        }
        if (typeof C.then == "function")
          return Be(
            A,
            T,
            Hr(C),
            H
          );
        if (C.$$typeof === Y)
          return Be(
            A,
            T,
            Ur(A, C),
            H
          );
        Pr(A, C);
      }
      return typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint" ? (C = "" + C, T !== null && T.tag === 6 ? (i(A, T.sibling), H = c(T, C), H.return = A, A = H) : (i(A, T), H = Ml(C, A.mode, H), H.return = A, A = H), g(A)) : i(A, T);
    }
    return function(A, T, C, H) {
      try {
        ko = 0;
        var oe = Be(
          A,
          T,
          C,
          H
        );
        return Di = null, oe;
      } catch (ae) {
        if (ae === Ri || ae === Gr) throw ae;
        var Me = Xt(29, ae, null, A.mode);
        return Me.lanes = H, Me.return = A, Me;
      }
    };
  }
  var Ja = A_(!0), N_ = A_(!1), la = !1;
  function Zl(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Yl(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ca(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function ua(e, t, i) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (De & 2) !== 0) {
      var c = r.pending;
      return c === null ? t.next = t : (t.next = c.next, c.next = t), r.pending = t, t = Rr(e), d_(e, null, i), t;
    }
    return Or(e, r, t, i), Rr(e);
  }
  function Ao(e, t, i) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (i & 4194048) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, i |= r, t.lanes = i, yd(e, i);
    }
  }
  function Vl(e, t) {
    var i = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, i === r)) {
      var c = null, u = null;
      if (i = i.firstBaseUpdate, i !== null) {
        do {
          var g = {
            lane: i.lane,
            tag: i.tag,
            payload: i.payload,
            callback: null,
            next: null
          };
          u === null ? c = u = g : u = u.next = g, i = i.next;
        } while (i !== null);
        u === null ? c = u = t : u = u.next = t;
      } else c = u = t;
      i = {
        baseState: r.baseState,
        firstBaseUpdate: c,
        lastBaseUpdate: u,
        shared: r.shared,
        callbacks: r.callbacks
      }, e.updateQueue = i;
      return;
    }
    e = i.lastBaseUpdate, e === null ? i.firstBaseUpdate = t : e.next = t, i.lastBaseUpdate = t;
  }
  var Kl = !1;
  function No() {
    if (Kl) {
      var e = Oi;
      if (e !== null) throw e;
    }
  }
  function Co(e, t, i, r) {
    Kl = !1;
    var c = e.updateQueue;
    la = !1;
    var u = c.firstBaseUpdate, g = c.lastBaseUpdate, b = c.shared.pending;
    if (b !== null) {
      c.shared.pending = null;
      var S = b, x = S.next;
      S.next = null, g === null ? u = x : g.next = x, g = S;
      var G = e.alternate;
      G !== null && (G = G.updateQueue, b = G.lastBaseUpdate, b !== g && (b === null ? G.firstBaseUpdate = x : b.next = x, G.lastBaseUpdate = S));
    }
    if (u !== null) {
      var Z = c.baseState;
      g = 0, G = x = S = null, b = u;
      do {
        var O = b.lane & -536870913, L = O !== b.lane;
        if (L ? (ze & O) === O : (r & O) === O) {
          O !== 0 && O === Mi && (Kl = !0), G !== null && (G = G.next = {
            lane: 0,
            tag: b.tag,
            payload: b.payload,
            callback: null,
            next: null
          });
          e: {
            var ee = e, ue = b;
            O = t;
            var Be = i;
            switch (ue.tag) {
              case 1:
                if (ee = ue.payload, typeof ee == "function") {
                  Z = ee.call(Be, Z, O);
                  break e;
                }
                Z = ee;
                break e;
              case 3:
                ee.flags = ee.flags & -65537 | 128;
              case 0:
                if (ee = ue.payload, O = typeof ee == "function" ? ee.call(Be, Z, O) : ee, O == null) break e;
                Z = y({}, Z, O);
                break e;
              case 2:
                la = !0;
            }
          }
          O = b.callback, O !== null && (e.flags |= 64, L && (e.flags |= 8192), L = c.callbacks, L === null ? c.callbacks = [O] : L.push(O));
        } else
          L = {
            lane: O,
            tag: b.tag,
            payload: b.payload,
            callback: b.callback,
            next: null
          }, G === null ? (x = G = L, S = Z) : G = G.next = L, g |= O;
        if (b = b.next, b === null) {
          if (b = c.shared.pending, b === null)
            break;
          L = b, b = L.next, L.next = null, c.lastBaseUpdate = L, c.shared.pending = null;
        }
      } while (!0);
      G === null && (S = Z), c.baseState = S, c.firstBaseUpdate = x, c.lastBaseUpdate = G, u === null && (c.shared.lanes = 0), pa |= g, e.lanes = g, e.memoizedState = Z;
    }
  }
  function C_(e, t) {
    if (typeof e != "function")
      throw Error(s(191, e));
    e.call(t);
  }
  function x_(e, t) {
    var i = e.callbacks;
    if (i !== null)
      for (e.callbacks = null, e = 0; e < i.length; e++)
        C_(i[e], t);
  }
  var ji = k(null), Br = k(0);
  function M_(e, t) {
    e = Fn, X(Br, e), X(ji, t), Fn = e | t.baseLanes;
  }
  function Xl() {
    X(Br, Fn), X(ji, ji.current);
  }
  function Fl() {
    Fn = Br.current, q(ji), q(Br);
  }
  var Ft = k(null), un = null;
  function da(e) {
    var t = e.alternate;
    X(nt, nt.current & 1), X(Ft, e), un === null && (t === null || ji.current !== null || t.memoizedState !== null) && (un = e);
  }
  function Wl(e) {
    X(nt, nt.current), X(Ft, e), un === null && (un = e);
  }
  function O_(e) {
    e.tag === 22 ? (X(nt, nt.current), X(Ft, e), un === null && (un = e)) : _a();
  }
  function _a() {
    X(nt, nt.current), X(Ft, Ft.current);
  }
  function Wt(e) {
    q(Ft), un === e && (un = null), q(nt);
  }
  var nt = k(0);
  function Zr(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var i = t.memoizedState;
        if (i !== null && (i = i.dehydrated, i === null || nu(i) || au(i)))
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
  var Hn = 0, ye = null, He = null, rt = null, Yr = !1, Li = !1, ei = !1, Vr = 0, xo = 0, Ui = null, py = 0;
  function Qe() {
    throw Error(s(321));
  }
  function $l(e, t) {
    if (t === null) return !1;
    for (var i = 0; i < t.length && i < e.length; i++)
      if (!Kt(e[i], t[i])) return !1;
    return !0;
  }
  function Ql(e, t, i, r, c, u) {
    return Hn = u, ye = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, M.H = e === null || e.memoizedState === null ? pm : mc, ei = !1, u = i(r, c), ei = !1, Li && (u = D_(
      t,
      i,
      r,
      c
    )), R_(e), u;
  }
  function R_(e) {
    M.H = Ro;
    var t = He !== null && He.next !== null;
    if (Hn = 0, rt = He = ye = null, Yr = !1, xo = 0, Ui = null, t) throw Error(s(300));
    e === null || st || (e = e.dependencies, e !== null && Lr(e) && (st = !0));
  }
  function D_(e, t, i, r) {
    ye = e;
    var c = 0;
    do {
      if (Li && (Ui = null), xo = 0, Li = !1, 25 <= c) throw Error(s(301));
      if (c += 1, rt = He = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      M.H = gm, u = t(i, r);
    } while (Li);
    return u;
  }
  function gy() {
    var e = M.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Mo(t) : t, e = e.useState()[0], (He !== null ? He.memoizedState : null) !== e && (ye.flags |= 1024), t;
  }
  function Jl() {
    var e = Vr !== 0;
    return Vr = 0, e;
  }
  function ec(e, t, i) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~i;
  }
  function tc(e) {
    if (Yr) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Yr = !1;
    }
    Hn = 0, rt = He = ye = null, Li = !1, xo = Vr = 0, Ui = null;
  }
  function Ct() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return rt === null ? ye.memoizedState = rt = e : rt = rt.next = e, rt;
  }
  function at() {
    if (He === null) {
      var e = ye.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = He.next;
    var t = rt === null ? ye.memoizedState : rt.next;
    if (t !== null)
      rt = t, He = e;
    else {
      if (e === null)
        throw ye.alternate === null ? Error(s(467)) : Error(s(310));
      He = e, e = {
        memoizedState: He.memoizedState,
        baseState: He.baseState,
        baseQueue: He.baseQueue,
        queue: He.queue,
        next: null
      }, rt === null ? ye.memoizedState = rt = e : rt = rt.next = e;
    }
    return rt;
  }
  function Kr() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Mo(e) {
    var t = xo;
    return xo += 1, Ui === null && (Ui = []), e = z_(Ui, e, t), t = ye, (rt === null ? t.memoizedState : rt.next) === null && (t = t.alternate, M.H = t === null || t.memoizedState === null ? pm : mc), e;
  }
  function Xr(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Mo(e);
      if (e.$$typeof === Y) return pt(e);
    }
    throw Error(s(438, String(e)));
  }
  function nc(e) {
    var t = null, i = ye.updateQueue;
    if (i !== null && (t = i.memoCache), t == null) {
      var r = ye.alternate;
      r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
        data: r.data.map(function(c) {
          return c.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), i === null && (i = Kr(), ye.updateQueue = i), i.memoCache = t, i = t.data[t.index], i === void 0)
      for (i = t.data[t.index] = Array(e), r = 0; r < e; r++)
        i[r] = se;
    return t.index++, i;
  }
  function Pn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Fr(e) {
    var t = at();
    return ac(t, He, e);
  }
  function ac(e, t, i) {
    var r = e.queue;
    if (r === null) throw Error(s(311));
    r.lastRenderedReducer = i;
    var c = e.baseQueue, u = r.pending;
    if (u !== null) {
      if (c !== null) {
        var g = c.next;
        c.next = u.next, u.next = g;
      }
      t.baseQueue = c = u, r.pending = null;
    }
    if (u = e.baseState, c === null) e.memoizedState = u;
    else {
      t = c.next;
      var b = g = null, S = null, x = t, G = !1;
      do {
        var Z = x.lane & -536870913;
        if (Z !== x.lane ? (ze & Z) === Z : (Hn & Z) === Z) {
          var O = x.revertLane;
          if (O === 0)
            S !== null && (S = S.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: x.action,
              hasEagerState: x.hasEagerState,
              eagerState: x.eagerState,
              next: null
            }), Z === Mi && (G = !0);
          else if ((Hn & O) === O) {
            x = x.next, O === Mi && (G = !0);
            continue;
          } else
            Z = {
              lane: 0,
              revertLane: x.revertLane,
              gesture: null,
              action: x.action,
              hasEagerState: x.hasEagerState,
              eagerState: x.eagerState,
              next: null
            }, S === null ? (b = S = Z, g = u) : S = S.next = Z, ye.lanes |= O, pa |= O;
          Z = x.action, ei && i(u, Z), u = x.hasEagerState ? x.eagerState : i(u, Z);
        } else
          O = {
            lane: Z,
            revertLane: x.revertLane,
            gesture: x.gesture,
            action: x.action,
            hasEagerState: x.hasEagerState,
            eagerState: x.eagerState,
            next: null
          }, S === null ? (b = S = O, g = u) : S = S.next = O, ye.lanes |= Z, pa |= Z;
        x = x.next;
      } while (x !== null && x !== t);
      if (S === null ? g = u : S.next = b, !Kt(u, e.memoizedState) && (st = !0, G && (i = Oi, i !== null)))
        throw i;
      e.memoizedState = u, e.baseState = g, e.baseQueue = S, r.lastRenderedState = u;
    }
    return c === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
  }
  function ic(e) {
    var t = at(), i = t.queue;
    if (i === null) throw Error(s(311));
    i.lastRenderedReducer = e;
    var r = i.dispatch, c = i.pending, u = t.memoizedState;
    if (c !== null) {
      i.pending = null;
      var g = c = c.next;
      do
        u = e(u, g.action), g = g.next;
      while (g !== c);
      Kt(u, t.memoizedState) || (st = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), i.lastRenderedState = u;
    }
    return [u, r];
  }
  function j_(e, t, i) {
    var r = ye, c = at(), u = Ae;
    if (u) {
      if (i === void 0) throw Error(s(407));
      i = i();
    } else i = t();
    var g = !Kt(
      (He || c).memoizedState,
      i
    );
    if (g && (c.memoizedState = i, st = !0), c = c.queue, sc(q_.bind(null, r, c, e), [
      e
    ]), c.getSnapshot !== t || g || rt !== null && rt.memoizedState.tag & 1) {
      if (r.flags |= 2048, qi(
        9,
        { destroy: void 0 },
        U_.bind(
          null,
          r,
          c,
          i,
          t
        ),
        null
      ), Ze === null) throw Error(s(349));
      u || (Hn & 127) !== 0 || L_(r, t, i);
    }
    return i;
  }
  function L_(e, t, i) {
    e.flags |= 16384, e = { getSnapshot: t, value: i }, t = ye.updateQueue, t === null ? (t = Kr(), ye.updateQueue = t, t.stores = [e]) : (i = t.stores, i === null ? t.stores = [e] : i.push(e));
  }
  function U_(e, t, i, r) {
    t.value = i, t.getSnapshot = r, G_(t) && I_(e);
  }
  function q_(e, t, i) {
    return i(function() {
      G_(t) && I_(e);
    });
  }
  function G_(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var i = t();
      return !Kt(e, i);
    } catch {
      return !0;
    }
  }
  function I_(e) {
    var t = Ya(e, 2);
    t !== null && Ht(t, e, 2);
  }
  function oc(e) {
    var t = Ct();
    if (typeof e == "function") {
      var i = e;
      if (e = i(), ei) {
        ta(!0);
        try {
          i();
        } finally {
          ta(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Pn,
      lastRenderedState: e
    }, t;
  }
  function H_(e, t, i, r) {
    return e.baseState = i, ac(
      e,
      He,
      typeof r == "function" ? r : Pn
    );
  }
  function hy(e, t, i, r, c) {
    if (Qr(e)) throw Error(s(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: c,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(g) {
          u.listeners.push(g);
        }
      };
      M.T !== null ? i(!0) : u.isTransition = !1, r(u), i = t.pending, i === null ? (u.next = t.pending = u, P_(t, u)) : (u.next = i.next, t.pending = i.next = u);
    }
  }
  function P_(e, t) {
    var i = t.action, r = t.payload, c = e.state;
    if (t.isTransition) {
      var u = M.T, g = {};
      M.T = g;
      try {
        var b = i(c, r), S = M.S;
        S !== null && S(g, b), B_(e, t, b);
      } catch (x) {
        rc(e, t, x);
      } finally {
        u !== null && g.types !== null && (u.types = g.types), M.T = u;
      }
    } else
      try {
        u = i(c, r), B_(e, t, u);
      } catch (x) {
        rc(e, t, x);
      }
  }
  function B_(e, t, i) {
    i !== null && typeof i == "object" && typeof i.then == "function" ? i.then(
      function(r) {
        Z_(e, t, r);
      },
      function(r) {
        return rc(e, t, r);
      }
    ) : Z_(e, t, i);
  }
  function Z_(e, t, i) {
    t.status = "fulfilled", t.value = i, Y_(t), e.state = i, t = e.pending, t !== null && (i = t.next, i === t ? e.pending = null : (i = i.next, t.next = i, P_(e, i)));
  }
  function rc(e, t, i) {
    var r = e.pending;
    if (e.pending = null, r !== null) {
      r = r.next;
      do
        t.status = "rejected", t.reason = i, Y_(t), t = t.next;
      while (t !== r);
    }
    e.action = null;
  }
  function Y_(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function V_(e, t) {
    return t;
  }
  function K_(e, t) {
    if (Ae) {
      var i = Ze.formState;
      if (i !== null) {
        e: {
          var r = ye;
          if (Ae) {
            if (Ve) {
              t: {
                for (var c = Ve, u = cn; c.nodeType !== 8; ) {
                  if (!u) {
                    c = null;
                    break t;
                  }
                  if (c = dn(
                    c.nextSibling
                  ), c === null) {
                    c = null;
                    break t;
                  }
                }
                u = c.data, c = u === "F!" || u === "F" ? c : null;
              }
              if (c) {
                Ve = dn(
                  c.nextSibling
                ), r = c.data === "F!";
                break e;
              }
            }
            ra(r);
          }
          r = !1;
        }
        r && (t = i[0]);
      }
    }
    return i = Ct(), i.memoizedState = i.baseState = t, r = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: V_,
      lastRenderedState: t
    }, i.queue = r, i = _m.bind(
      null,
      ye,
      r
    ), r.dispatch = i, r = oc(!1), u = _c.bind(
      null,
      ye,
      !1,
      r.queue
    ), r = Ct(), c = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, r.queue = c, i = hy.bind(
      null,
      ye,
      c,
      u,
      i
    ), c.dispatch = i, r.memoizedState = e, [t, i, !1];
  }
  function X_(e) {
    var t = at();
    return F_(t, He, e);
  }
  function F_(e, t, i) {
    if (t = ac(
      e,
      t,
      V_
    )[0], e = Fr(Pn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var r = Mo(t);
      } catch (g) {
        throw g === Ri ? Gr : g;
      }
    else r = t;
    t = at();
    var c = t.queue, u = c.dispatch;
    return i !== t.memoizedState && (ye.flags |= 2048, qi(
      9,
      { destroy: void 0 },
      vy.bind(null, c, i),
      null
    )), [r, u, e];
  }
  function vy(e, t) {
    e.action = t;
  }
  function W_(e) {
    var t = at(), i = He;
    if (i !== null)
      return F_(t, i, e);
    at(), t = t.memoizedState, i = at();
    var r = i.queue.dispatch;
    return i.memoizedState = e, [t, r, !1];
  }
  function qi(e, t, i, r) {
    return e = { tag: e, create: i, deps: r, inst: t, next: null }, t = ye.updateQueue, t === null && (t = Kr(), ye.updateQueue = t), i = t.lastEffect, i === null ? t.lastEffect = e.next = e : (r = i.next, i.next = e, e.next = r, t.lastEffect = e), e;
  }
  function $_() {
    return at().memoizedState;
  }
  function Wr(e, t, i, r) {
    var c = Ct();
    ye.flags |= e, c.memoizedState = qi(
      1 | t,
      { destroy: void 0 },
      i,
      r === void 0 ? null : r
    );
  }
  function $r(e, t, i, r) {
    var c = at();
    r = r === void 0 ? null : r;
    var u = c.memoizedState.inst;
    He !== null && r !== null && $l(r, He.memoizedState.deps) ? c.memoizedState = qi(t, u, i, r) : (ye.flags |= e, c.memoizedState = qi(
      1 | t,
      u,
      i,
      r
    ));
  }
  function Q_(e, t) {
    Wr(8390656, 8, e, t);
  }
  function sc(e, t) {
    $r(2048, 8, e, t);
  }
  function yy(e) {
    ye.flags |= 4;
    var t = ye.updateQueue;
    if (t === null)
      t = Kr(), ye.updateQueue = t, t.events = [e];
    else {
      var i = t.events;
      i === null ? t.events = [e] : i.push(e);
    }
  }
  function J_(e) {
    var t = at().memoizedState;
    return yy({ ref: t, nextImpl: e }), function() {
      if ((De & 2) !== 0) throw Error(s(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function em(e, t) {
    return $r(4, 2, e, t);
  }
  function tm(e, t) {
    return $r(4, 4, e, t);
  }
  function nm(e, t) {
    if (typeof t == "function") {
      e = e();
      var i = t(e);
      return function() {
        typeof i == "function" ? i() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function am(e, t, i) {
    i = i != null ? i.concat([e]) : null, $r(4, 4, nm.bind(null, t, e), i);
  }
  function lc() {
  }
  function im(e, t) {
    var i = at();
    t = t === void 0 ? null : t;
    var r = i.memoizedState;
    return t !== null && $l(t, r[1]) ? r[0] : (i.memoizedState = [e, t], e);
  }
  function om(e, t) {
    var i = at();
    t = t === void 0 ? null : t;
    var r = i.memoizedState;
    if (t !== null && $l(t, r[1]))
      return r[0];
    if (r = e(), ei) {
      ta(!0);
      try {
        e();
      } finally {
        ta(!1);
      }
    }
    return i.memoizedState = [r, t], r;
  }
  function cc(e, t, i) {
    return i === void 0 || (Hn & 1073741824) !== 0 && (ze & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = i, e = sf(), ye.lanes |= e, pa |= e, i);
  }
  function rm(e, t, i, r) {
    return Kt(i, t) ? i : ji.current !== null ? (e = cc(e, i, r), Kt(e, t) || (st = !0), e) : (Hn & 42) === 0 || (Hn & 1073741824) !== 0 && (ze & 261930) === 0 ? (st = !0, e.memoizedState = i) : (e = sf(), ye.lanes |= e, pa |= e, t);
  }
  function sm(e, t, i, r, c) {
    var u = K.p;
    K.p = u !== 0 && 8 > u ? u : 8;
    var g = M.T, b = {};
    M.T = b, _c(e, !1, t, i);
    try {
      var S = c(), x = M.S;
      if (x !== null && x(b, S), S !== null && typeof S == "object" && typeof S.then == "function") {
        var G = fy(
          S,
          r
        );
        Oo(
          e,
          t,
          G,
          Jt(e)
        );
      } else
        Oo(
          e,
          t,
          r,
          Jt(e)
        );
    } catch (Z) {
      Oo(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: Z },
        Jt()
      );
    } finally {
      K.p = u, g !== null && b.types !== null && (g.types = b.types), M.T = g;
    }
  }
  function by() {
  }
  function uc(e, t, i, r) {
    if (e.tag !== 5) throw Error(s(476));
    var c = lm(e).queue;
    sm(
      e,
      c,
      t,
      Q,
      i === null ? by : function() {
        return cm(e), i(r);
      }
    );
  }
  function lm(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Q,
      baseState: Q,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Pn,
        lastRenderedState: Q
      },
      next: null
    };
    var i = {};
    return t.next = {
      memoizedState: i,
      baseState: i,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Pn,
        lastRenderedState: i
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function cm(e) {
    var t = lm(e);
    t.next === null && (t = e.alternate.memoizedState), Oo(
      e,
      t.next.queue,
      {},
      Jt()
    );
  }
  function dc() {
    return pt(Fo);
  }
  function um() {
    return at().memoizedState;
  }
  function dm() {
    return at().memoizedState;
  }
  function wy(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var i = Jt();
          e = ca(i);
          var r = ua(t, e, i);
          r !== null && (Ht(r, t, i), Ao(r, t, i)), t = { cache: Il() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Sy(e, t, i) {
    var r = Jt();
    i = {
      lane: r,
      revertLane: 0,
      gesture: null,
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Qr(e) ? mm(t, i) : (i = Cl(e, t, i, r), i !== null && (Ht(i, e, r), fm(i, t, r)));
  }
  function _m(e, t, i) {
    var r = Jt();
    Oo(e, t, i, r);
  }
  function Oo(e, t, i, r) {
    var c = {
      lane: r,
      revertLane: 0,
      gesture: null,
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Qr(e)) mm(t, c);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var g = t.lastRenderedState, b = u(g, i);
          if (c.hasEagerState = !0, c.eagerState = b, Kt(b, g))
            return Or(e, t, c, 0), Ze === null && Mr(), !1;
        } catch {
        }
      if (i = Cl(e, t, c, r), i !== null)
        return Ht(i, e, r), fm(i, t, r), !0;
    }
    return !1;
  }
  function _c(e, t, i, r) {
    if (r = {
      lane: 2,
      revertLane: Zc(),
      gesture: null,
      action: r,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Qr(e)) {
      if (t) throw Error(s(479));
    } else
      t = Cl(
        e,
        i,
        r,
        2
      ), t !== null && Ht(t, e, 2);
  }
  function Qr(e) {
    var t = e.alternate;
    return e === ye || t !== null && t === ye;
  }
  function mm(e, t) {
    Li = Yr = !0;
    var i = e.pending;
    i === null ? t.next = t : (t.next = i.next, i.next = t), e.pending = t;
  }
  function fm(e, t, i) {
    if ((i & 4194048) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, i |= r, t.lanes = i, yd(e, i);
    }
  }
  var Ro = {
    readContext: pt,
    use: Xr,
    useCallback: Qe,
    useContext: Qe,
    useEffect: Qe,
    useImperativeHandle: Qe,
    useLayoutEffect: Qe,
    useInsertionEffect: Qe,
    useMemo: Qe,
    useReducer: Qe,
    useRef: Qe,
    useState: Qe,
    useDebugValue: Qe,
    useDeferredValue: Qe,
    useTransition: Qe,
    useSyncExternalStore: Qe,
    useId: Qe,
    useHostTransitionStatus: Qe,
    useFormState: Qe,
    useActionState: Qe,
    useOptimistic: Qe,
    useMemoCache: Qe,
    useCacheRefresh: Qe
  };
  Ro.useEffectEvent = Qe;
  var pm = {
    readContext: pt,
    use: Xr,
    useCallback: function(e, t) {
      return Ct().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: pt,
    useEffect: Q_,
    useImperativeHandle: function(e, t, i) {
      i = i != null ? i.concat([e]) : null, Wr(
        4194308,
        4,
        nm.bind(null, t, e),
        i
      );
    },
    useLayoutEffect: function(e, t) {
      return Wr(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Wr(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var i = Ct();
      t = t === void 0 ? null : t;
      var r = e();
      if (ei) {
        ta(!0);
        try {
          e();
        } finally {
          ta(!1);
        }
      }
      return i.memoizedState = [r, t], r;
    },
    useReducer: function(e, t, i) {
      var r = Ct();
      if (i !== void 0) {
        var c = i(t);
        if (ei) {
          ta(!0);
          try {
            i(t);
          } finally {
            ta(!1);
          }
        }
      } else c = t;
      return r.memoizedState = r.baseState = c, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: c
      }, r.queue = e, e = e.dispatch = Sy.bind(
        null,
        ye,
        e
      ), [r.memoizedState, e];
    },
    useRef: function(e) {
      var t = Ct();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = oc(e);
      var t = e.queue, i = _m.bind(null, ye, t);
      return t.dispatch = i, [e.memoizedState, i];
    },
    useDebugValue: lc,
    useDeferredValue: function(e, t) {
      var i = Ct();
      return cc(i, e, t);
    },
    useTransition: function() {
      var e = oc(!1);
      return e = sm.bind(
        null,
        ye,
        e.queue,
        !0,
        !1
      ), Ct().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, i) {
      var r = ye, c = Ct();
      if (Ae) {
        if (i === void 0)
          throw Error(s(407));
        i = i();
      } else {
        if (i = t(), Ze === null)
          throw Error(s(349));
        (ze & 127) !== 0 || L_(r, t, i);
      }
      c.memoizedState = i;
      var u = { value: i, getSnapshot: t };
      return c.queue = u, Q_(q_.bind(null, r, u, e), [
        e
      ]), r.flags |= 2048, qi(
        9,
        { destroy: void 0 },
        U_.bind(
          null,
          r,
          u,
          i,
          t
        ),
        null
      ), i;
    },
    useId: function() {
      var e = Ct(), t = Ze.identifierPrefix;
      if (Ae) {
        var i = Nn, r = An;
        i = (r & ~(1 << 32 - Vt(r) - 1)).toString(32) + i, t = "_" + t + "R_" + i, i = Vr++, 0 < i && (t += "H" + i.toString(32)), t += "_";
      } else
        i = py++, t = "_" + t + "r_" + i.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: dc,
    useFormState: K_,
    useActionState: K_,
    useOptimistic: function(e) {
      var t = Ct();
      t.memoizedState = t.baseState = e;
      var i = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = i, t = _c.bind(
        null,
        ye,
        !0,
        i
      ), i.dispatch = t, [e, t];
    },
    useMemoCache: nc,
    useCacheRefresh: function() {
      return Ct().memoizedState = wy.bind(
        null,
        ye
      );
    },
    useEffectEvent: function(e) {
      var t = Ct(), i = { impl: e };
      return t.memoizedState = i, function() {
        if ((De & 2) !== 0)
          throw Error(s(440));
        return i.impl.apply(void 0, arguments);
      };
    }
  }, mc = {
    readContext: pt,
    use: Xr,
    useCallback: im,
    useContext: pt,
    useEffect: sc,
    useImperativeHandle: am,
    useInsertionEffect: em,
    useLayoutEffect: tm,
    useMemo: om,
    useReducer: Fr,
    useRef: $_,
    useState: function() {
      return Fr(Pn);
    },
    useDebugValue: lc,
    useDeferredValue: function(e, t) {
      var i = at();
      return rm(
        i,
        He.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Fr(Pn)[0], t = at().memoizedState;
      return [
        typeof e == "boolean" ? e : Mo(e),
        t
      ];
    },
    useSyncExternalStore: j_,
    useId: um,
    useHostTransitionStatus: dc,
    useFormState: X_,
    useActionState: X_,
    useOptimistic: function(e, t) {
      var i = at();
      return H_(i, He, e, t);
    },
    useMemoCache: nc,
    useCacheRefresh: dm
  };
  mc.useEffectEvent = J_;
  var gm = {
    readContext: pt,
    use: Xr,
    useCallback: im,
    useContext: pt,
    useEffect: sc,
    useImperativeHandle: am,
    useInsertionEffect: em,
    useLayoutEffect: tm,
    useMemo: om,
    useReducer: ic,
    useRef: $_,
    useState: function() {
      return ic(Pn);
    },
    useDebugValue: lc,
    useDeferredValue: function(e, t) {
      var i = at();
      return He === null ? cc(i, e, t) : rm(
        i,
        He.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ic(Pn)[0], t = at().memoizedState;
      return [
        typeof e == "boolean" ? e : Mo(e),
        t
      ];
    },
    useSyncExternalStore: j_,
    useId: um,
    useHostTransitionStatus: dc,
    useFormState: W_,
    useActionState: W_,
    useOptimistic: function(e, t) {
      var i = at();
      return He !== null ? H_(i, He, e, t) : (i.baseState = e, [e, i.queue.dispatch]);
    },
    useMemoCache: nc,
    useCacheRefresh: dm
  };
  gm.useEffectEvent = J_;
  function fc(e, t, i, r) {
    t = e.memoizedState, i = i(r, t), i = i == null ? t : y({}, t, i), e.memoizedState = i, e.lanes === 0 && (e.updateQueue.baseState = i);
  }
  var pc = {
    enqueueSetState: function(e, t, i) {
      e = e._reactInternals;
      var r = Jt(), c = ca(r);
      c.payload = t, i != null && (c.callback = i), t = ua(e, c, r), t !== null && (Ht(t, e, r), Ao(t, e, r));
    },
    enqueueReplaceState: function(e, t, i) {
      e = e._reactInternals;
      var r = Jt(), c = ca(r);
      c.tag = 1, c.payload = t, i != null && (c.callback = i), t = ua(e, c, r), t !== null && (Ht(t, e, r), Ao(t, e, r));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var i = Jt(), r = ca(i);
      r.tag = 2, t != null && (r.callback = t), t = ua(e, r, i), t !== null && (Ht(t, e, i), Ao(t, e, i));
    }
  };
  function hm(e, t, i, r, c, u, g) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, u, g) : t.prototype && t.prototype.isPureReactComponent ? !yo(i, r) || !yo(c, u) : !0;
  }
  function vm(e, t, i, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(i, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(i, r), t.state !== e && pc.enqueueReplaceState(t, t.state, null);
  }
  function ti(e, t) {
    var i = t;
    if ("ref" in t) {
      i = {};
      for (var r in t)
        r !== "ref" && (i[r] = t[r]);
    }
    if (e = e.defaultProps) {
      i === t && (i = y({}, i));
      for (var c in e)
        i[c] === void 0 && (i[c] = e[c]);
    }
    return i;
  }
  function ym(e) {
    xr(e);
  }
  function bm(e) {
    console.error(e);
  }
  function wm(e) {
    xr(e);
  }
  function Jr(e, t) {
    try {
      var i = e.onUncaughtError;
      i(t.value, { componentStack: t.stack });
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  function Sm(e, t, i) {
    try {
      var r = e.onCaughtError;
      r(i.value, {
        componentStack: i.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (c) {
      setTimeout(function() {
        throw c;
      });
    }
  }
  function gc(e, t, i) {
    return i = ca(i), i.tag = 3, i.payload = { element: null }, i.callback = function() {
      Jr(e, t);
    }, i;
  }
  function Em(e) {
    return e = ca(e), e.tag = 3, e;
  }
  function zm(e, t, i, r) {
    var c = i.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var u = r.value;
      e.payload = function() {
        return c(u);
      }, e.callback = function() {
        Sm(t, i, r);
      };
    }
    var g = i.stateNode;
    g !== null && typeof g.componentDidCatch == "function" && (e.callback = function() {
      Sm(t, i, r), typeof c != "function" && (ga === null ? ga = /* @__PURE__ */ new Set([this]) : ga.add(this));
      var b = r.stack;
      this.componentDidCatch(r.value, {
        componentStack: b !== null ? b : ""
      });
    });
  }
  function Ey(e, t, i, r, c) {
    if (i.flags |= 32768, r !== null && typeof r == "object" && typeof r.then == "function") {
      if (t = i.alternate, t !== null && xi(
        t,
        i,
        c,
        !0
      ), i = Ft.current, i !== null) {
        switch (i.tag) {
          case 31:
          case 13:
            return un === null ? ds() : i.alternate === null && Je === 0 && (Je = 3), i.flags &= -257, i.flags |= 65536, i.lanes = c, r === Ir ? i.flags |= 16384 : (t = i.updateQueue, t === null ? i.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Hc(e, r, c)), !1;
          case 22:
            return i.flags |= 65536, r === Ir ? i.flags |= 16384 : (t = i.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([r])
            }, i.updateQueue = t) : (i = t.retryQueue, i === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : i.add(r)), Hc(e, r, c)), !1;
        }
        throw Error(s(435, i.tag));
      }
      return Hc(e, r, c), ds(), !1;
    }
    if (Ae)
      return t = Ft.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = c, r !== jl && (e = Error(s(422), { cause: r }), So(rn(e, i)))) : (r !== jl && (t = Error(s(423), {
        cause: r
      }), So(
        rn(t, i)
      )), e = e.current.alternate, e.flags |= 65536, c &= -c, e.lanes |= c, r = rn(r, i), c = gc(
        e.stateNode,
        r,
        c
      ), Vl(e, c), Je !== 4 && (Je = 2)), !1;
    var u = Error(s(520), { cause: r });
    if (u = rn(u, i), Ho === null ? Ho = [u] : Ho.push(u), Je !== 4 && (Je = 2), t === null) return !0;
    r = rn(r, i), i = t;
    do {
      switch (i.tag) {
        case 3:
          return i.flags |= 65536, e = c & -c, i.lanes |= e, e = gc(i.stateNode, r, e), Vl(i, e), !1;
        case 1:
          if (t = i.type, u = i.stateNode, (i.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (ga === null || !ga.has(u))))
            return i.flags |= 65536, c &= -c, i.lanes |= c, c = Em(c), zm(
              c,
              e,
              i,
              r
            ), Vl(i, c), !1;
      }
      i = i.return;
    } while (i !== null);
    return !1;
  }
  var hc = Error(s(461)), st = !1;
  function gt(e, t, i, r) {
    t.child = e === null ? N_(t, null, i, r) : Ja(
      t,
      e.child,
      i,
      r
    );
  }
  function km(e, t, i, r, c) {
    i = i.render;
    var u = t.ref;
    if ("ref" in r) {
      var g = {};
      for (var b in r)
        b !== "ref" && (g[b] = r[b]);
    } else g = r;
    return Fa(t), r = Ql(
      e,
      t,
      i,
      g,
      u,
      c
    ), b = Jl(), e !== null && !st ? (ec(e, t, c), Bn(e, t, c)) : (Ae && b && Rl(t), t.flags |= 1, gt(e, t, r, c), t.child);
  }
  function Tm(e, t, i, r, c) {
    if (e === null) {
      var u = i.type;
      return typeof u == "function" && !xl(u) && u.defaultProps === void 0 && i.compare === null ? (t.tag = 15, t.type = u, Am(
        e,
        t,
        u,
        r,
        c
      )) : (e = Dr(
        i.type,
        null,
        r,
        t,
        t.mode,
        c
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !kc(e, c)) {
      var g = u.memoizedProps;
      if (i = i.compare, i = i !== null ? i : yo, i(g, r) && e.ref === t.ref)
        return Bn(e, t, c);
    }
    return t.flags |= 1, e = Un(u, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Am(e, t, i, r, c) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (yo(u, r) && e.ref === t.ref)
        if (st = !1, t.pendingProps = r = u, kc(e, c))
          (e.flags & 131072) !== 0 && (st = !0);
        else
          return t.lanes = e.lanes, Bn(e, t, c);
    }
    return vc(
      e,
      t,
      i,
      r,
      c
    );
  }
  function Nm(e, t, i, r) {
    var c = r.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), r.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | i : i, e !== null) {
          for (r = t.child = e.child, c = 0; r !== null; )
            c = c | r.lanes | r.childLanes, r = r.sibling;
          r = c & ~u;
        } else r = 0, t.child = null;
        return Cm(
          e,
          t,
          u,
          i,
          r
        );
      }
      if ((i & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && qr(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? M_(t, u) : Xl(), O_(t);
      else
        return r = t.lanes = 536870912, Cm(
          e,
          t,
          u !== null ? u.baseLanes | i : i,
          i,
          r
        );
    } else
      u !== null ? (qr(t, u.cachePool), M_(t, u), _a(), t.memoizedState = null) : (e !== null && qr(t, null), Xl(), _a());
    return gt(e, t, c, i), t.child;
  }
  function Do(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Cm(e, t, i, r, c) {
    var u = Pl();
    return u = u === null ? null : { parent: ot._currentValue, pool: u }, t.memoizedState = {
      baseLanes: i,
      cachePool: u
    }, e !== null && qr(t, null), Xl(), O_(t), e !== null && xi(e, t, r, !0), t.childLanes = c, null;
  }
  function es(e, t) {
    return t = ns(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function xm(e, t, i) {
    return Ja(t, e.child, null, i), e = es(t, t.pendingProps), e.flags |= 2, Wt(t), t.memoizedState = null, e;
  }
  function zy(e, t, i) {
    var r = t.pendingProps, c = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Ae) {
        if (r.mode === "hidden")
          return e = es(t, r), t.lanes = 536870912, Do(null, e);
        if (Wl(t), (e = Ve) ? (e = Bf(
          e,
          cn
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ia !== null ? { id: An, overflow: Nn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, i = m_(e), i.return = t, t.child = i, ft = t, Ve = null)) : e = null, e === null) throw ra(t);
        return t.lanes = 536870912, null;
      }
      return es(t, r);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var g = u.dehydrated;
      if (Wl(t), c)
        if (t.flags & 256)
          t.flags &= -257, t = xm(
            e,
            t,
            i
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(s(558));
      else if (st || xi(e, t, i, !1), c = (i & e.childLanes) !== 0, st || c) {
        if (r = Ze, r !== null && (g = bd(r, i), g !== 0 && g !== u.retryLane))
          throw u.retryLane = g, Ya(e, g), Ht(r, e, g), hc;
        ds(), t = xm(
          e,
          t,
          i
        );
      } else
        e = u.treeContext, Ve = dn(g.nextSibling), ft = t, Ae = !0, oa = null, cn = !1, e !== null && g_(t, e), t = es(t, r), t.flags |= 4096;
      return t;
    }
    return e = Un(e.child, {
      mode: r.mode,
      children: r.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function ts(e, t) {
    var i = t.ref;
    if (i === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof i != "function" && typeof i != "object")
        throw Error(s(284));
      (e === null || e.ref !== i) && (t.flags |= 4194816);
    }
  }
  function vc(e, t, i, r, c) {
    return Fa(t), i = Ql(
      e,
      t,
      i,
      r,
      void 0,
      c
    ), r = Jl(), e !== null && !st ? (ec(e, t, c), Bn(e, t, c)) : (Ae && r && Rl(t), t.flags |= 1, gt(e, t, i, c), t.child);
  }
  function Mm(e, t, i, r, c, u) {
    return Fa(t), t.updateQueue = null, i = D_(
      t,
      r,
      i,
      c
    ), R_(e), r = Jl(), e !== null && !st ? (ec(e, t, u), Bn(e, t, u)) : (Ae && r && Rl(t), t.flags |= 1, gt(e, t, i, u), t.child);
  }
  function Om(e, t, i, r, c) {
    if (Fa(t), t.stateNode === null) {
      var u = Ti, g = i.contextType;
      typeof g == "object" && g !== null && (u = pt(g)), u = new i(r, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = pc, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = r, u.state = t.memoizedState, u.refs = {}, Zl(t), g = i.contextType, u.context = typeof g == "object" && g !== null ? pt(g) : Ti, u.state = t.memoizedState, g = i.getDerivedStateFromProps, typeof g == "function" && (fc(
        t,
        i,
        g,
        r
      ), u.state = t.memoizedState), typeof i.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (g = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), g !== u.state && pc.enqueueReplaceState(u, u.state, null), Co(t, r, u, c), No(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
    } else if (e === null) {
      u = t.stateNode;
      var b = t.memoizedProps, S = ti(i, b);
      u.props = S;
      var x = u.context, G = i.contextType;
      g = Ti, typeof G == "object" && G !== null && (g = pt(G));
      var Z = i.getDerivedStateFromProps;
      G = typeof Z == "function" || typeof u.getSnapshotBeforeUpdate == "function", b = t.pendingProps !== b, G || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (b || x !== g) && vm(
        t,
        u,
        r,
        g
      ), la = !1;
      var O = t.memoizedState;
      u.state = O, Co(t, r, u, c), No(), x = t.memoizedState, b || O !== x || la ? (typeof Z == "function" && (fc(
        t,
        i,
        Z,
        r
      ), x = t.memoizedState), (S = la || hm(
        t,
        i,
        S,
        r,
        O,
        x,
        g
      )) ? (G || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = x), u.props = r, u.state = x, u.context = g, r = S) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      u = t.stateNode, Yl(e, t), g = t.memoizedProps, G = ti(i, g), u.props = G, Z = t.pendingProps, O = u.context, x = i.contextType, S = Ti, typeof x == "object" && x !== null && (S = pt(x)), b = i.getDerivedStateFromProps, (x = typeof b == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (g !== Z || O !== S) && vm(
        t,
        u,
        r,
        S
      ), la = !1, O = t.memoizedState, u.state = O, Co(t, r, u, c), No();
      var L = t.memoizedState;
      g !== Z || O !== L || la || e !== null && e.dependencies !== null && Lr(e.dependencies) ? (typeof b == "function" && (fc(
        t,
        i,
        b,
        r
      ), L = t.memoizedState), (G = la || hm(
        t,
        i,
        G,
        r,
        O,
        L,
        S
      ) || e !== null && e.dependencies !== null && Lr(e.dependencies)) ? (x || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(r, L, S), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        r,
        L,
        S
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || g === e.memoizedProps && O === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || g === e.memoizedProps && O === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = L), u.props = r, u.state = L, u.context = S, r = G) : (typeof u.componentDidUpdate != "function" || g === e.memoizedProps && O === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || g === e.memoizedProps && O === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return u = r, ts(e, t), r = (t.flags & 128) !== 0, u || r ? (u = t.stateNode, i = r && typeof i.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && r ? (t.child = Ja(
      t,
      e.child,
      null,
      c
    ), t.child = Ja(
      t,
      null,
      i,
      c
    )) : gt(e, t, i, c), t.memoizedState = u.state, e = t.child) : e = Bn(
      e,
      t,
      c
    ), e;
  }
  function Rm(e, t, i, r) {
    return Ka(), t.flags |= 256, gt(e, t, i, r), t.child;
  }
  var yc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function bc(e) {
    return { baseLanes: e, cachePool: S_() };
  }
  function wc(e, t, i) {
    return e = e !== null ? e.childLanes & ~i : 0, t && (e |= Qt), e;
  }
  function Dm(e, t, i) {
    var r = t.pendingProps, c = !1, u = (t.flags & 128) !== 0, g;
    if ((g = u) || (g = e !== null && e.memoizedState === null ? !1 : (nt.current & 2) !== 0), g && (c = !0, t.flags &= -129), g = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ae) {
        if (c ? da(t) : _a(), (e = Ve) ? (e = Bf(
          e,
          cn
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ia !== null ? { id: An, overflow: Nn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, i = m_(e), i.return = t, t.child = i, ft = t, Ve = null)) : e = null, e === null) throw ra(t);
        return au(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var b = r.children;
      return r = r.fallback, c ? (_a(), c = t.mode, b = ns(
        { mode: "hidden", children: b },
        c
      ), r = Va(
        r,
        c,
        i,
        null
      ), b.return = t, r.return = t, b.sibling = r, t.child = b, r = t.child, r.memoizedState = bc(i), r.childLanes = wc(
        e,
        g,
        i
      ), t.memoizedState = yc, Do(null, r)) : (da(t), Sc(t, b));
    }
    var S = e.memoizedState;
    if (S !== null && (b = S.dehydrated, b !== null)) {
      if (u)
        t.flags & 256 ? (da(t), t.flags &= -257, t = Ec(
          e,
          t,
          i
        )) : t.memoizedState !== null ? (_a(), t.child = e.child, t.flags |= 128, t = null) : (_a(), b = r.fallback, c = t.mode, r = ns(
          { mode: "visible", children: r.children },
          c
        ), b = Va(
          b,
          c,
          i,
          null
        ), b.flags |= 2, r.return = t, b.return = t, r.sibling = b, t.child = r, Ja(
          t,
          e.child,
          null,
          i
        ), r = t.child, r.memoizedState = bc(i), r.childLanes = wc(
          e,
          g,
          i
        ), t.memoizedState = yc, t = Do(null, r));
      else if (da(t), au(b)) {
        if (g = b.nextSibling && b.nextSibling.dataset, g) var x = g.dgst;
        g = x, r = Error(s(419)), r.stack = "", r.digest = g, So({ value: r, source: null, stack: null }), t = Ec(
          e,
          t,
          i
        );
      } else if (st || xi(e, t, i, !1), g = (i & e.childLanes) !== 0, st || g) {
        if (g = Ze, g !== null && (r = bd(g, i), r !== 0 && r !== S.retryLane))
          throw S.retryLane = r, Ya(e, r), Ht(g, e, r), hc;
        nu(b) || ds(), t = Ec(
          e,
          t,
          i
        );
      } else
        nu(b) ? (t.flags |= 192, t.child = e.child, t = null) : (e = S.treeContext, Ve = dn(
          b.nextSibling
        ), ft = t, Ae = !0, oa = null, cn = !1, e !== null && g_(t, e), t = Sc(
          t,
          r.children
        ), t.flags |= 4096);
      return t;
    }
    return c ? (_a(), b = r.fallback, c = t.mode, S = e.child, x = S.sibling, r = Un(S, {
      mode: "hidden",
      children: r.children
    }), r.subtreeFlags = S.subtreeFlags & 65011712, x !== null ? b = Un(
      x,
      b
    ) : (b = Va(
      b,
      c,
      i,
      null
    ), b.flags |= 2), b.return = t, r.return = t, r.sibling = b, t.child = r, Do(null, r), r = t.child, b = e.child.memoizedState, b === null ? b = bc(i) : (c = b.cachePool, c !== null ? (S = ot._currentValue, c = c.parent !== S ? { parent: S, pool: S } : c) : c = S_(), b = {
      baseLanes: b.baseLanes | i,
      cachePool: c
    }), r.memoizedState = b, r.childLanes = wc(
      e,
      g,
      i
    ), t.memoizedState = yc, Do(e.child, r)) : (da(t), i = e.child, e = i.sibling, i = Un(i, {
      mode: "visible",
      children: r.children
    }), i.return = t, i.sibling = null, e !== null && (g = t.deletions, g === null ? (t.deletions = [e], t.flags |= 16) : g.push(e)), t.child = i, t.memoizedState = null, i);
  }
  function Sc(e, t) {
    return t = ns(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function ns(e, t) {
    return e = Xt(22, e, null, t), e.lanes = 0, e;
  }
  function Ec(e, t, i) {
    return Ja(t, e.child, null, i), e = Sc(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function jm(e, t, i) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), ql(e.return, t, i);
  }
  function zc(e, t, i, r, c, u) {
    var g = e.memoizedState;
    g === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: r,
      tail: i,
      tailMode: c,
      treeForkCount: u
    } : (g.isBackwards = t, g.rendering = null, g.renderingStartTime = 0, g.last = r, g.tail = i, g.tailMode = c, g.treeForkCount = u);
  }
  function Lm(e, t, i) {
    var r = t.pendingProps, c = r.revealOrder, u = r.tail;
    r = r.children;
    var g = nt.current, b = (g & 2) !== 0;
    if (b ? (g = g & 1 | 2, t.flags |= 128) : g &= 1, X(nt, g), gt(e, t, r, i), r = Ae ? wo : 0, !b && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && jm(e, i, t);
        else if (e.tag === 19)
          jm(e, i, t);
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
    switch (c) {
      case "forwards":
        for (i = t.child, c = null; i !== null; )
          e = i.alternate, e !== null && Zr(e) === null && (c = i), i = i.sibling;
        i = c, i === null ? (c = t.child, t.child = null) : (c = i.sibling, i.sibling = null), zc(
          t,
          !1,
          c,
          i,
          u,
          r
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (i = null, c = t.child, t.child = null; c !== null; ) {
          if (e = c.alternate, e !== null && Zr(e) === null) {
            t.child = c;
            break;
          }
          e = c.sibling, c.sibling = i, i = c, c = e;
        }
        zc(
          t,
          !0,
          i,
          null,
          u,
          r
        );
        break;
      case "together":
        zc(
          t,
          !1,
          null,
          null,
          void 0,
          r
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Bn(e, t, i) {
    if (e !== null && (t.dependencies = e.dependencies), pa |= t.lanes, (i & t.childLanes) === 0)
      if (e !== null) {
        if (xi(
          e,
          t,
          i,
          !1
        ), (i & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, i = Un(e, e.pendingProps), t.child = i, i.return = t; e.sibling !== null; )
        e = e.sibling, i = i.sibling = Un(e, e.pendingProps), i.return = t;
      i.sibling = null;
    }
    return t.child;
  }
  function kc(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Lr(e)));
  }
  function ky(e, t, i) {
    switch (t.tag) {
      case 3:
        Ye(t, t.stateNode.containerInfo), sa(t, ot, e.memoizedState.cache), Ka();
        break;
      case 27:
      case 5:
        kt(t);
        break;
      case 4:
        Ye(t, t.stateNode.containerInfo);
        break;
      case 10:
        sa(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Wl(t), null;
        break;
      case 13:
        var r = t.memoizedState;
        if (r !== null)
          return r.dehydrated !== null ? (da(t), t.flags |= 128, null) : (i & t.child.childLanes) !== 0 ? Dm(e, t, i) : (da(t), e = Bn(
            e,
            t,
            i
          ), e !== null ? e.sibling : null);
        da(t);
        break;
      case 19:
        var c = (e.flags & 128) !== 0;
        if (r = (i & t.childLanes) !== 0, r || (xi(
          e,
          t,
          i,
          !1
        ), r = (i & t.childLanes) !== 0), c) {
          if (r)
            return Lm(
              e,
              t,
              i
            );
          t.flags |= 128;
        }
        if (c = t.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), X(nt, nt.current), r) break;
        return null;
      case 22:
        return t.lanes = 0, Nm(
          e,
          t,
          i,
          t.pendingProps
        );
      case 24:
        sa(t, ot, e.memoizedState.cache);
    }
    return Bn(e, t, i);
  }
  function Um(e, t, i) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        st = !0;
      else {
        if (!kc(e, i) && (t.flags & 128) === 0)
          return st = !1, ky(
            e,
            t,
            i
          );
        st = (e.flags & 131072) !== 0;
      }
    else
      st = !1, Ae && (t.flags & 1048576) !== 0 && p_(t, wo, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var r = t.pendingProps;
          if (e = $a(t.elementType), t.type = e, typeof e == "function")
            xl(e) ? (r = ti(e, r), t.tag = 1, t = Om(
              null,
              t,
              e,
              r,
              i
            )) : (t.tag = 0, t = vc(
              null,
              t,
              e,
              r,
              i
            ));
          else {
            if (e != null) {
              var c = e.$$typeof;
              if (c === P) {
                t.tag = 11, t = km(
                  null,
                  t,
                  e,
                  r,
                  i
                );
                break e;
              } else if (c === V) {
                t.tag = 14, t = Tm(
                  null,
                  t,
                  e,
                  r,
                  i
                );
                break e;
              }
            }
            throw t = we(e) || e, Error(s(306, t, ""));
          }
        }
        return t;
      case 0:
        return vc(
          e,
          t,
          t.type,
          t.pendingProps,
          i
        );
      case 1:
        return r = t.type, c = ti(
          r,
          t.pendingProps
        ), Om(
          e,
          t,
          r,
          c,
          i
        );
      case 3:
        e: {
          if (Ye(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(s(387));
          r = t.pendingProps;
          var u = t.memoizedState;
          c = u.element, Yl(e, t), Co(t, r, null, i);
          var g = t.memoizedState;
          if (r = g.cache, sa(t, ot, r), r !== u.cache && Gl(
            t,
            [ot],
            i,
            !0
          ), No(), r = g.element, u.isDehydrated)
            if (u = {
              element: r,
              isDehydrated: !1,
              cache: g.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = Rm(
                e,
                t,
                r,
                i
              );
              break e;
            } else if (r !== c) {
              c = rn(
                Error(s(424)),
                t
              ), So(c), t = Rm(
                e,
                t,
                r,
                i
              );
              break e;
            } else
              for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, Ve = dn(e.firstChild), ft = t, Ae = !0, oa = null, cn = !0, i = N_(
                t,
                null,
                r,
                i
              ), t.child = i; i; )
                i.flags = i.flags & -3 | 4096, i = i.sibling;
          else {
            if (Ka(), r === c) {
              t = Bn(
                e,
                t,
                i
              );
              break e;
            }
            gt(e, t, r, i);
          }
          t = t.child;
        }
        return t;
      case 26:
        return ts(e, t), e === null ? (i = Ff(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = i : Ae || (i = t.type, e = t.pendingProps, r = vs(
          le.current
        ).createElement(i), r[mt] = t, r[jt] = e, ht(r, i, e), dt(r), t.stateNode = r) : t.memoizedState = Ff(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return kt(t), e === null && Ae && (r = t.stateNode = Vf(
          t.type,
          t.pendingProps,
          le.current
        ), ft = t, cn = !0, c = Ve, ba(t.type) ? (iu = c, Ve = dn(r.firstChild)) : Ve = c), gt(
          e,
          t,
          t.pendingProps.children,
          i
        ), ts(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Ae && ((c = r = Ve) && (r = tb(
          r,
          t.type,
          t.pendingProps,
          cn
        ), r !== null ? (t.stateNode = r, ft = t, Ve = dn(r.firstChild), cn = !1, c = !0) : c = !1), c || ra(t)), kt(t), c = t.type, u = t.pendingProps, g = e !== null ? e.memoizedProps : null, r = u.children, Jc(c, u) ? r = null : g !== null && Jc(c, g) && (t.flags |= 32), t.memoizedState !== null && (c = Ql(
          e,
          t,
          gy,
          null,
          null,
          i
        ), Fo._currentValue = c), ts(e, t), gt(e, t, r, i), t.child;
      case 6:
        return e === null && Ae && ((e = i = Ve) && (i = nb(
          i,
          t.pendingProps,
          cn
        ), i !== null ? (t.stateNode = i, ft = t, Ve = null, e = !0) : e = !1), e || ra(t)), null;
      case 13:
        return Dm(e, t, i);
      case 4:
        return Ye(
          t,
          t.stateNode.containerInfo
        ), r = t.pendingProps, e === null ? t.child = Ja(
          t,
          null,
          r,
          i
        ) : gt(e, t, r, i), t.child;
      case 11:
        return km(
          e,
          t,
          t.type,
          t.pendingProps,
          i
        );
      case 7:
        return gt(
          e,
          t,
          t.pendingProps,
          i
        ), t.child;
      case 8:
        return gt(
          e,
          t,
          t.pendingProps.children,
          i
        ), t.child;
      case 12:
        return gt(
          e,
          t,
          t.pendingProps.children,
          i
        ), t.child;
      case 10:
        return r = t.pendingProps, sa(t, t.type, r.value), gt(e, t, r.children, i), t.child;
      case 9:
        return c = t.type._context, r = t.pendingProps.children, Fa(t), c = pt(c), r = r(c), t.flags |= 1, gt(e, t, r, i), t.child;
      case 14:
        return Tm(
          e,
          t,
          t.type,
          t.pendingProps,
          i
        );
      case 15:
        return Am(
          e,
          t,
          t.type,
          t.pendingProps,
          i
        );
      case 19:
        return Lm(e, t, i);
      case 31:
        return zy(e, t, i);
      case 22:
        return Nm(
          e,
          t,
          i,
          t.pendingProps
        );
      case 24:
        return Fa(t), r = pt(ot), e === null ? (c = Pl(), c === null && (c = Ze, u = Il(), c.pooledCache = u, u.refCount++, u !== null && (c.pooledCacheLanes |= i), c = u), t.memoizedState = { parent: r, cache: c }, Zl(t), sa(t, ot, c)) : ((e.lanes & i) !== 0 && (Yl(e, t), Co(t, null, null, i), No()), c = e.memoizedState, u = t.memoizedState, c.parent !== r ? (c = { parent: r, cache: r }, t.memoizedState = c, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = c), sa(t, ot, r)) : (r = u.cache, sa(t, ot, r), r !== c.cache && Gl(
          t,
          [ot],
          i,
          !0
        ))), gt(
          e,
          t,
          t.pendingProps.children,
          i
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(s(156, t.tag));
  }
  function Zn(e) {
    e.flags |= 4;
  }
  function Tc(e, t, i, r, c) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (c & 335544128) === c)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (df()) e.flags |= 8192;
        else
          throw Qa = Ir, Bl;
    } else e.flags &= -16777217;
  }
  function qm(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !ep(t))
      if (df()) e.flags |= 8192;
      else
        throw Qa = Ir, Bl;
  }
  function as(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? hd() : 536870912, e.lanes |= t, Pi |= t);
  }
  function jo(e, t) {
    if (!Ae)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var i = null; t !== null; )
            t.alternate !== null && (i = t), t = t.sibling;
          i === null ? e.tail = null : i.sibling = null;
          break;
        case "collapsed":
          i = e.tail;
          for (var r = null; i !== null; )
            i.alternate !== null && (r = i), i = i.sibling;
          r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
      }
  }
  function Ke(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, i = 0, r = 0;
    if (t)
      for (var c = e.child; c !== null; )
        i |= c.lanes | c.childLanes, r |= c.subtreeFlags & 65011712, r |= c.flags & 65011712, c.return = e, c = c.sibling;
    else
      for (c = e.child; c !== null; )
        i |= c.lanes | c.childLanes, r |= c.subtreeFlags, r |= c.flags, c.return = e, c = c.sibling;
    return e.subtreeFlags |= r, e.childLanes = i, t;
  }
  function Ty(e, t, i) {
    var r = t.pendingProps;
    switch (Dl(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ke(t), null;
      case 1:
        return Ke(t), null;
      case 3:
        return i = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), In(ot), Le(), i.pendingContext && (i.context = i.pendingContext, i.pendingContext = null), (e === null || e.child === null) && (Ci(t) ? Zn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ll())), Ke(t), null;
      case 26:
        var c = t.type, u = t.memoizedState;
        return e === null ? (Zn(t), u !== null ? (Ke(t), qm(t, u)) : (Ke(t), Tc(
          t,
          c,
          null,
          r,
          i
        ))) : u ? u !== e.memoizedState ? (Zn(t), Ke(t), qm(t, u)) : (Ke(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== r && Zn(t), Ke(t), Tc(
          t,
          c,
          e,
          r,
          i
        )), null;
      case 27:
        if (tn(t), i = le.current, c = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== r && Zn(t);
        else {
          if (!r) {
            if (t.stateNode === null)
              throw Error(s(166));
            return Ke(t), null;
          }
          e = $.current, Ci(t) ? h_(t) : (e = Vf(c, r, i), t.stateNode = e, Zn(t));
        }
        return Ke(t), null;
      case 5:
        if (tn(t), c = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== r && Zn(t);
        else {
          if (!r) {
            if (t.stateNode === null)
              throw Error(s(166));
            return Ke(t), null;
          }
          if (u = $.current, Ci(t))
            h_(t);
          else {
            var g = vs(
              le.current
            );
            switch (u) {
              case 1:
                u = g.createElementNS(
                  "http://www.w3.org/2000/svg",
                  c
                );
                break;
              case 2:
                u = g.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  c
                );
                break;
              default:
                switch (c) {
                  case "svg":
                    u = g.createElementNS(
                      "http://www.w3.org/2000/svg",
                      c
                    );
                    break;
                  case "math":
                    u = g.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      c
                    );
                    break;
                  case "script":
                    u = g.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof r.is == "string" ? g.createElement("select", {
                      is: r.is
                    }) : g.createElement("select"), r.multiple ? u.multiple = !0 : r.size && (u.size = r.size);
                    break;
                  default:
                    u = typeof r.is == "string" ? g.createElement(c, { is: r.is }) : g.createElement(c);
                }
            }
            u[mt] = t, u[jt] = r;
            e: for (g = t.child; g !== null; ) {
              if (g.tag === 5 || g.tag === 6)
                u.appendChild(g.stateNode);
              else if (g.tag !== 4 && g.tag !== 27 && g.child !== null) {
                g.child.return = g, g = g.child;
                continue;
              }
              if (g === t) break e;
              for (; g.sibling === null; ) {
                if (g.return === null || g.return === t)
                  break e;
                g = g.return;
              }
              g.sibling.return = g.return, g = g.sibling;
            }
            t.stateNode = u;
            e: switch (ht(u, c, r), c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
            r && Zn(t);
          }
        }
        return Ke(t), Tc(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          i
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== r && Zn(t);
        else {
          if (typeof r != "string" && t.stateNode === null)
            throw Error(s(166));
          if (e = le.current, Ci(t)) {
            if (e = t.stateNode, i = t.memoizedProps, r = null, c = ft, c !== null)
              switch (c.tag) {
                case 27:
                case 5:
                  r = c.memoizedProps;
              }
            e[mt] = t, e = !!(e.nodeValue === i || r !== null && r.suppressHydrationWarning === !0 || jf(e.nodeValue, i)), e || ra(t, !0);
          } else
            e = vs(e).createTextNode(
              r
            ), e[mt] = t, t.stateNode = e;
        }
        return Ke(t), null;
      case 31:
        if (i = t.memoizedState, e === null || e.memoizedState !== null) {
          if (r = Ci(t), i !== null) {
            if (e === null) {
              if (!r) throw Error(s(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(557));
              e[mt] = t;
            } else
              Ka(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ke(t), e = !1;
          } else
            i = Ll(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), e = !0;
          if (!e)
            return t.flags & 256 ? (Wt(t), t) : (Wt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(s(558));
        }
        return Ke(t), null;
      case 13:
        if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (c = Ci(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!c) throw Error(s(318));
              if (c = t.memoizedState, c = c !== null ? c.dehydrated : null, !c) throw Error(s(317));
              c[mt] = t;
            } else
              Ka(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ke(t), c = !1;
          } else
            c = Ll(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = c), c = !0;
          if (!c)
            return t.flags & 256 ? (Wt(t), t) : (Wt(t), null);
        }
        return Wt(t), (t.flags & 128) !== 0 ? (t.lanes = i, t) : (i = r !== null, e = e !== null && e.memoizedState !== null, i && (r = t.child, c = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (c = r.alternate.memoizedState.cachePool.pool), u = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (u = r.memoizedState.cachePool.pool), u !== c && (r.flags |= 2048)), i !== e && i && (t.child.flags |= 8192), as(t, t.updateQueue), Ke(t), null);
      case 4:
        return Le(), e === null && Xc(t.stateNode.containerInfo), Ke(t), null;
      case 10:
        return In(t.type), Ke(t), null;
      case 19:
        if (q(nt), r = t.memoizedState, r === null) return Ke(t), null;
        if (c = (t.flags & 128) !== 0, u = r.rendering, u === null)
          if (c) jo(r, !1);
          else {
            if (Je !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = Zr(e), u !== null) {
                  for (t.flags |= 128, jo(r, !1), e = u.updateQueue, t.updateQueue = e, as(t, e), t.subtreeFlags = 0, e = i, i = t.child; i !== null; )
                    __(i, e), i = i.sibling;
                  return X(
                    nt,
                    nt.current & 1 | 2
                  ), Ae && qn(t, r.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            r.tail !== null && Nt() > ls && (t.flags |= 128, c = !0, jo(r, !1), t.lanes = 4194304);
          }
        else {
          if (!c)
            if (e = Zr(u), e !== null) {
              if (t.flags |= 128, c = !0, e = e.updateQueue, t.updateQueue = e, as(t, e), jo(r, !0), r.tail === null && r.tailMode === "hidden" && !u.alternate && !Ae)
                return Ke(t), null;
            } else
              2 * Nt() - r.renderingStartTime > ls && i !== 536870912 && (t.flags |= 128, c = !0, jo(r, !1), t.lanes = 4194304);
          r.isBackwards ? (u.sibling = t.child, t.child = u) : (e = r.last, e !== null ? e.sibling = u : t.child = u, r.last = u);
        }
        return r.tail !== null ? (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Nt(), e.sibling = null, i = nt.current, X(
          nt,
          c ? i & 1 | 2 : i & 1
        ), Ae && qn(t, r.treeForkCount), e) : (Ke(t), null);
      case 22:
      case 23:
        return Wt(t), Fl(), r = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== r && (t.flags |= 8192) : r && (t.flags |= 8192), r ? (i & 536870912) !== 0 && (t.flags & 128) === 0 && (Ke(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ke(t), i = t.updateQueue, i !== null && as(t, i.retryQueue), i = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (i = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== i && (t.flags |= 2048), e !== null && q(Wa), null;
      case 24:
        return i = null, e !== null && (i = e.memoizedState.cache), t.memoizedState.cache !== i && (t.flags |= 2048), In(ot), Ke(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function Ay(e, t) {
    switch (Dl(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return In(ot), Le(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return tn(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Wt(t), t.alternate === null)
            throw Error(s(340));
          Ka();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Wt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(s(340));
          Ka();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return q(nt), null;
      case 4:
        return Le(), null;
      case 10:
        return In(t.type), null;
      case 22:
      case 23:
        return Wt(t), Fl(), e !== null && q(Wa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return In(ot), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Gm(e, t) {
    switch (Dl(t), t.tag) {
      case 3:
        In(ot), Le();
        break;
      case 26:
      case 27:
      case 5:
        tn(t);
        break;
      case 4:
        Le();
        break;
      case 31:
        t.memoizedState !== null && Wt(t);
        break;
      case 13:
        Wt(t);
        break;
      case 19:
        q(nt);
        break;
      case 10:
        In(t.type);
        break;
      case 22:
      case 23:
        Wt(t), Fl(), e !== null && q(Wa);
        break;
      case 24:
        In(ot);
    }
  }
  function Lo(e, t) {
    try {
      var i = t.updateQueue, r = i !== null ? i.lastEffect : null;
      if (r !== null) {
        var c = r.next;
        i = c;
        do {
          if ((i.tag & e) === e) {
            r = void 0;
            var u = i.create, g = i.inst;
            r = u(), g.destroy = r;
          }
          i = i.next;
        } while (i !== c);
      }
    } catch (b) {
      qe(t, t.return, b);
    }
  }
  function ma(e, t, i) {
    try {
      var r = t.updateQueue, c = r !== null ? r.lastEffect : null;
      if (c !== null) {
        var u = c.next;
        r = u;
        do {
          if ((r.tag & e) === e) {
            var g = r.inst, b = g.destroy;
            if (b !== void 0) {
              g.destroy = void 0, c = t;
              var S = i, x = b;
              try {
                x();
              } catch (G) {
                qe(
                  c,
                  S,
                  G
                );
              }
            }
          }
          r = r.next;
        } while (r !== u);
      }
    } catch (G) {
      qe(t, t.return, G);
    }
  }
  function Im(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var i = e.stateNode;
      try {
        x_(t, i);
      } catch (r) {
        qe(e, e.return, r);
      }
    }
  }
  function Hm(e, t, i) {
    i.props = ti(
      e.type,
      e.memoizedProps
    ), i.state = e.memoizedState;
    try {
      i.componentWillUnmount();
    } catch (r) {
      qe(e, t, r);
    }
  }
  function Uo(e, t) {
    try {
      var i = e.ref;
      if (i !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var r = e.stateNode;
            break;
          case 30:
            r = e.stateNode;
            break;
          default:
            r = e.stateNode;
        }
        typeof i == "function" ? e.refCleanup = i(r) : i.current = r;
      }
    } catch (c) {
      qe(e, t, c);
    }
  }
  function Cn(e, t) {
    var i = e.ref, r = e.refCleanup;
    if (i !== null)
      if (typeof r == "function")
        try {
          r();
        } catch (c) {
          qe(e, t, c);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof i == "function")
        try {
          i(null);
        } catch (c) {
          qe(e, t, c);
        }
      else i.current = null;
  }
  function Pm(e) {
    var t = e.type, i = e.memoizedProps, r = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          i.autoFocus && r.focus();
          break e;
        case "img":
          i.src ? r.src = i.src : i.srcSet && (r.srcset = i.srcSet);
      }
    } catch (c) {
      qe(e, e.return, c);
    }
  }
  function Ac(e, t, i) {
    try {
      var r = e.stateNode;
      Fy(r, e.type, i, t), r[jt] = t;
    } catch (c) {
      qe(e, e.return, c);
    }
  }
  function Bm(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ba(e.type) || e.tag === 4;
  }
  function Nc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Bm(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && ba(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Cc(e, t, i) {
    var r = e.tag;
    if (r === 5 || r === 6)
      e = e.stateNode, t ? (i.nodeType === 9 ? i.body : i.nodeName === "HTML" ? i.ownerDocument.body : i).insertBefore(e, t) : (t = i.nodeType === 9 ? i.body : i.nodeName === "HTML" ? i.ownerDocument.body : i, t.appendChild(e), i = i._reactRootContainer, i != null || t.onclick !== null || (t.onclick = jn));
    else if (r !== 4 && (r === 27 && ba(e.type) && (i = e.stateNode, t = null), e = e.child, e !== null))
      for (Cc(e, t, i), e = e.sibling; e !== null; )
        Cc(e, t, i), e = e.sibling;
  }
  function is(e, t, i) {
    var r = e.tag;
    if (r === 5 || r === 6)
      e = e.stateNode, t ? i.insertBefore(e, t) : i.appendChild(e);
    else if (r !== 4 && (r === 27 && ba(e.type) && (i = e.stateNode), e = e.child, e !== null))
      for (is(e, t, i), e = e.sibling; e !== null; )
        is(e, t, i), e = e.sibling;
  }
  function Zm(e) {
    var t = e.stateNode, i = e.memoizedProps;
    try {
      for (var r = e.type, c = t.attributes; c.length; )
        t.removeAttributeNode(c[0]);
      ht(t, r, i), t[mt] = e, t[jt] = i;
    } catch (u) {
      qe(e, e.return, u);
    }
  }
  var Yn = !1, lt = !1, xc = !1, Ym = typeof WeakSet == "function" ? WeakSet : Set, _t = null;
  function Ny(e, t) {
    if (e = e.containerInfo, $c = ks, e = a_(e), El(e)) {
      if ("selectionStart" in e)
        var i = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          i = (i = e.ownerDocument) && i.defaultView || window;
          var r = i.getSelection && i.getSelection();
          if (r && r.rangeCount !== 0) {
            i = r.anchorNode;
            var c = r.anchorOffset, u = r.focusNode;
            r = r.focusOffset;
            try {
              i.nodeType, u.nodeType;
            } catch {
              i = null;
              break e;
            }
            var g = 0, b = -1, S = -1, x = 0, G = 0, Z = e, O = null;
            t: for (; ; ) {
              for (var L; Z !== i || c !== 0 && Z.nodeType !== 3 || (b = g + c), Z !== u || r !== 0 && Z.nodeType !== 3 || (S = g + r), Z.nodeType === 3 && (g += Z.nodeValue.length), (L = Z.firstChild) !== null; )
                O = Z, Z = L;
              for (; ; ) {
                if (Z === e) break t;
                if (O === i && ++x === c && (b = g), O === u && ++G === r && (S = g), (L = Z.nextSibling) !== null) break;
                Z = O, O = Z.parentNode;
              }
              Z = L;
            }
            i = b === -1 || S === -1 ? null : { start: b, end: S };
          } else i = null;
        }
      i = i || { start: 0, end: 0 };
    } else i = null;
    for (Qc = { focusedElem: e, selectionRange: i }, ks = !1, _t = t; _t !== null; )
      if (t = _t, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, _t = e;
      else
        for (; _t !== null; ) {
          switch (t = _t, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (i = 0; i < e.length; i++)
                  c = e[i], c.ref.impl = c.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, i = t, c = u.memoizedProps, u = u.memoizedState, r = i.stateNode;
                try {
                  var ee = ti(
                    i.type,
                    c
                  );
                  e = r.getSnapshotBeforeUpdate(
                    ee,
                    u
                  ), r.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ue) {
                  qe(
                    i,
                    i.return,
                    ue
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, i = e.nodeType, i === 9)
                  tu(e);
                else if (i === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      tu(e);
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
              if ((e & 1024) !== 0) throw Error(s(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, _t = e;
            break;
          }
          _t = t.return;
        }
  }
  function Vm(e, t, i) {
    var r = i.flags;
    switch (i.tag) {
      case 0:
      case 11:
      case 15:
        Kn(e, i), r & 4 && Lo(5, i);
        break;
      case 1:
        if (Kn(e, i), r & 4)
          if (e = i.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (g) {
              qe(i, i.return, g);
            }
          else {
            var c = ti(
              i.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                c,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (g) {
              qe(
                i,
                i.return,
                g
              );
            }
          }
        r & 64 && Im(i), r & 512 && Uo(i, i.return);
        break;
      case 3:
        if (Kn(e, i), r & 64 && (e = i.updateQueue, e !== null)) {
          if (t = null, i.child !== null)
            switch (i.child.tag) {
              case 27:
              case 5:
                t = i.child.stateNode;
                break;
              case 1:
                t = i.child.stateNode;
            }
          try {
            x_(e, t);
          } catch (g) {
            qe(i, i.return, g);
          }
        }
        break;
      case 27:
        t === null && r & 4 && Zm(i);
      case 26:
      case 5:
        Kn(e, i), t === null && r & 4 && Pm(i), r & 512 && Uo(i, i.return);
        break;
      case 12:
        Kn(e, i);
        break;
      case 31:
        Kn(e, i), r & 4 && Fm(e, i);
        break;
      case 13:
        Kn(e, i), r & 4 && Wm(e, i), r & 64 && (e = i.memoizedState, e !== null && (e = e.dehydrated, e !== null && (i = Uy.bind(
          null,
          i
        ), ab(e, i))));
        break;
      case 22:
        if (r = i.memoizedState !== null || Yn, !r) {
          t = t !== null && t.memoizedState !== null || lt, c = Yn;
          var u = lt;
          Yn = r, (lt = t) && !u ? Xn(
            e,
            i,
            (i.subtreeFlags & 8772) !== 0
          ) : Kn(e, i), Yn = c, lt = u;
        }
        break;
      case 30:
        break;
      default:
        Kn(e, i);
    }
  }
  function Km(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Km(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && rl(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Xe = null, Ut = !1;
  function Vn(e, t, i) {
    for (i = i.child; i !== null; )
      Xm(e, t, i), i = i.sibling;
  }
  function Xm(e, t, i) {
    if (Yt && typeof Yt.onCommitFiberUnmount == "function")
      try {
        Yt.onCommitFiberUnmount(ro, i);
      } catch {
      }
    switch (i.tag) {
      case 26:
        lt || Cn(i, t), Vn(
          e,
          t,
          i
        ), i.memoizedState ? i.memoizedState.count-- : i.stateNode && (i = i.stateNode, i.parentNode.removeChild(i));
        break;
      case 27:
        lt || Cn(i, t);
        var r = Xe, c = Ut;
        ba(i.type) && (Xe = i.stateNode, Ut = !1), Vn(
          e,
          t,
          i
        ), Vo(i.stateNode), Xe = r, Ut = c;
        break;
      case 5:
        lt || Cn(i, t);
      case 6:
        if (r = Xe, c = Ut, Xe = null, Vn(
          e,
          t,
          i
        ), Xe = r, Ut = c, Xe !== null)
          if (Ut)
            try {
              (Xe.nodeType === 9 ? Xe.body : Xe.nodeName === "HTML" ? Xe.ownerDocument.body : Xe).removeChild(i.stateNode);
            } catch (u) {
              qe(
                i,
                t,
                u
              );
            }
          else
            try {
              Xe.removeChild(i.stateNode);
            } catch (u) {
              qe(
                i,
                t,
                u
              );
            }
        break;
      case 18:
        Xe !== null && (Ut ? (e = Xe, Hf(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          i.stateNode
        ), Wi(e)) : Hf(Xe, i.stateNode));
        break;
      case 4:
        r = Xe, c = Ut, Xe = i.stateNode.containerInfo, Ut = !0, Vn(
          e,
          t,
          i
        ), Xe = r, Ut = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ma(2, i, t), lt || ma(4, i, t), Vn(
          e,
          t,
          i
        );
        break;
      case 1:
        lt || (Cn(i, t), r = i.stateNode, typeof r.componentWillUnmount == "function" && Hm(
          i,
          t,
          r
        )), Vn(
          e,
          t,
          i
        );
        break;
      case 21:
        Vn(
          e,
          t,
          i
        );
        break;
      case 22:
        lt = (r = lt) || i.memoizedState !== null, Vn(
          e,
          t,
          i
        ), lt = r;
        break;
      default:
        Vn(
          e,
          t,
          i
        );
    }
  }
  function Fm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Wi(e);
      } catch (i) {
        qe(t, t.return, i);
      }
    }
  }
  function Wm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Wi(e);
      } catch (i) {
        qe(t, t.return, i);
      }
  }
  function Cy(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Ym()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Ym()), t;
      default:
        throw Error(s(435, e.tag));
    }
  }
  function os(e, t) {
    var i = Cy(e);
    t.forEach(function(r) {
      if (!i.has(r)) {
        i.add(r);
        var c = qy.bind(null, e, r);
        r.then(c, c);
      }
    });
  }
  function qt(e, t) {
    var i = t.deletions;
    if (i !== null)
      for (var r = 0; r < i.length; r++) {
        var c = i[r], u = e, g = t, b = g;
        e: for (; b !== null; ) {
          switch (b.tag) {
            case 27:
              if (ba(b.type)) {
                Xe = b.stateNode, Ut = !1;
                break e;
              }
              break;
            case 5:
              Xe = b.stateNode, Ut = !1;
              break e;
            case 3:
            case 4:
              Xe = b.stateNode.containerInfo, Ut = !0;
              break e;
          }
          b = b.return;
        }
        if (Xe === null) throw Error(s(160));
        Xm(u, g, c), Xe = null, Ut = !1, u = c.alternate, u !== null && (u.return = null), c.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        $m(t, e), t = t.sibling;
  }
  var Sn = null;
  function $m(e, t) {
    var i = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        qt(t, e), Gt(e), r & 4 && (ma(3, e, e.return), Lo(3, e), ma(5, e, e.return));
        break;
      case 1:
        qt(t, e), Gt(e), r & 512 && (lt || i === null || Cn(i, i.return)), r & 64 && Yn && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (i = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = i === null ? r : i.concat(r))));
        break;
      case 26:
        var c = Sn;
        if (qt(t, e), Gt(e), r & 512 && (lt || i === null || Cn(i, i.return)), r & 4) {
          var u = i !== null ? i.memoizedState : null;
          if (r = e.memoizedState, i === null)
            if (r === null)
              if (e.stateNode === null) {
                e: {
                  r = e.type, i = e.memoizedProps, c = c.ownerDocument || c;
                  t: switch (r) {
                    case "title":
                      u = c.getElementsByTagName("title")[0], (!u || u[co] || u[mt] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = c.createElement(r), c.head.insertBefore(
                        u,
                        c.querySelector("head > title")
                      )), ht(u, r, i), u[mt] = e, dt(u), r = u;
                      break e;
                    case "link":
                      var g = Qf(
                        "link",
                        "href",
                        c
                      ).get(r + (i.href || ""));
                      if (g) {
                        for (var b = 0; b < g.length; b++)
                          if (u = g[b], u.getAttribute("href") === (i.href == null || i.href === "" ? null : i.href) && u.getAttribute("rel") === (i.rel == null ? null : i.rel) && u.getAttribute("title") === (i.title == null ? null : i.title) && u.getAttribute("crossorigin") === (i.crossOrigin == null ? null : i.crossOrigin)) {
                            g.splice(b, 1);
                            break t;
                          }
                      }
                      u = c.createElement(r), ht(u, r, i), c.head.appendChild(u);
                      break;
                    case "meta":
                      if (g = Qf(
                        "meta",
                        "content",
                        c
                      ).get(r + (i.content || ""))) {
                        for (b = 0; b < g.length; b++)
                          if (u = g[b], u.getAttribute("content") === (i.content == null ? null : "" + i.content) && u.getAttribute("name") === (i.name == null ? null : i.name) && u.getAttribute("property") === (i.property == null ? null : i.property) && u.getAttribute("http-equiv") === (i.httpEquiv == null ? null : i.httpEquiv) && u.getAttribute("charset") === (i.charSet == null ? null : i.charSet)) {
                            g.splice(b, 1);
                            break t;
                          }
                      }
                      u = c.createElement(r), ht(u, r, i), c.head.appendChild(u);
                      break;
                    default:
                      throw Error(s(468, r));
                  }
                  u[mt] = e, dt(u), r = u;
                }
                e.stateNode = r;
              } else
                Jf(
                  c,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = $f(
                c,
                r,
                e.memoizedProps
              );
          else
            u !== r ? (u === null ? i.stateNode !== null && (i = i.stateNode, i.parentNode.removeChild(i)) : u.count--, r === null ? Jf(
              c,
              e.type,
              e.stateNode
            ) : $f(
              c,
              r,
              e.memoizedProps
            )) : r === null && e.stateNode !== null && Ac(
              e,
              e.memoizedProps,
              i.memoizedProps
            );
        }
        break;
      case 27:
        qt(t, e), Gt(e), r & 512 && (lt || i === null || Cn(i, i.return)), i !== null && r & 4 && Ac(
          e,
          e.memoizedProps,
          i.memoizedProps
        );
        break;
      case 5:
        if (qt(t, e), Gt(e), r & 512 && (lt || i === null || Cn(i, i.return)), e.flags & 32) {
          c = e.stateNode;
          try {
            yi(c, "");
          } catch (ee) {
            qe(e, e.return, ee);
          }
        }
        r & 4 && e.stateNode != null && (c = e.memoizedProps, Ac(
          e,
          c,
          i !== null ? i.memoizedProps : c
        )), r & 1024 && (xc = !0);
        break;
      case 6:
        if (qt(t, e), Gt(e), r & 4) {
          if (e.stateNode === null)
            throw Error(s(162));
          r = e.memoizedProps, i = e.stateNode;
          try {
            i.nodeValue = r;
          } catch (ee) {
            qe(e, e.return, ee);
          }
        }
        break;
      case 3:
        if (ws = null, c = Sn, Sn = ys(t.containerInfo), qt(t, e), Sn = c, Gt(e), r & 4 && i !== null && i.memoizedState.isDehydrated)
          try {
            Wi(t.containerInfo);
          } catch (ee) {
            qe(e, e.return, ee);
          }
        xc && (xc = !1, Qm(e));
        break;
      case 4:
        r = Sn, Sn = ys(
          e.stateNode.containerInfo
        ), qt(t, e), Gt(e), Sn = r;
        break;
      case 12:
        qt(t, e), Gt(e);
        break;
      case 31:
        qt(t, e), Gt(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, os(e, r)));
        break;
      case 13:
        qt(t, e), Gt(e), e.child.flags & 8192 && e.memoizedState !== null != (i !== null && i.memoizedState !== null) && (ss = Nt()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, os(e, r)));
        break;
      case 22:
        c = e.memoizedState !== null;
        var S = i !== null && i.memoizedState !== null, x = Yn, G = lt;
        if (Yn = x || c, lt = G || S, qt(t, e), lt = G, Yn = x, Gt(e), r & 8192)
          e: for (t = e.stateNode, t._visibility = c ? t._visibility & -2 : t._visibility | 1, c && (i === null || S || Yn || lt || ni(e)), i = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (i === null) {
                S = i = t;
                try {
                  if (u = S.stateNode, c)
                    g = u.style, typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : g.display = "none";
                  else {
                    b = S.stateNode;
                    var Z = S.memoizedProps.style, O = Z != null && Z.hasOwnProperty("display") ? Z.display : null;
                    b.style.display = O == null || typeof O == "boolean" ? "" : ("" + O).trim();
                  }
                } catch (ee) {
                  qe(S, S.return, ee);
                }
              }
            } else if (t.tag === 6) {
              if (i === null) {
                S = t;
                try {
                  S.stateNode.nodeValue = c ? "" : S.memoizedProps;
                } catch (ee) {
                  qe(S, S.return, ee);
                }
              }
            } else if (t.tag === 18) {
              if (i === null) {
                S = t;
                try {
                  var L = S.stateNode;
                  c ? Pf(L, !0) : Pf(S.stateNode, !1);
                } catch (ee) {
                  qe(S, S.return, ee);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              i === t && (i = null), t = t.return;
            }
            i === t && (i = null), t.sibling.return = t.return, t = t.sibling;
          }
        r & 4 && (r = e.updateQueue, r !== null && (i = r.retryQueue, i !== null && (r.retryQueue = null, os(e, i))));
        break;
      case 19:
        qt(t, e), Gt(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, os(e, r)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        qt(t, e), Gt(e);
    }
  }
  function Gt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var i, r = e.return; r !== null; ) {
          if (Bm(r)) {
            i = r;
            break;
          }
          r = r.return;
        }
        if (i == null) throw Error(s(160));
        switch (i.tag) {
          case 27:
            var c = i.stateNode, u = Nc(e);
            is(e, u, c);
            break;
          case 5:
            var g = i.stateNode;
            i.flags & 32 && (yi(g, ""), i.flags &= -33);
            var b = Nc(e);
            is(e, b, g);
            break;
          case 3:
          case 4:
            var S = i.stateNode.containerInfo, x = Nc(e);
            Cc(
              e,
              x,
              S
            );
            break;
          default:
            throw Error(s(161));
        }
      } catch (G) {
        qe(e, e.return, G);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Qm(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Qm(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function Kn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Vm(e, t.alternate, t), t = t.sibling;
  }
  function ni(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ma(4, t, t.return), ni(t);
          break;
        case 1:
          Cn(t, t.return);
          var i = t.stateNode;
          typeof i.componentWillUnmount == "function" && Hm(
            t,
            t.return,
            i
          ), ni(t);
          break;
        case 27:
          Vo(t.stateNode);
        case 26:
        case 5:
          Cn(t, t.return), ni(t);
          break;
        case 22:
          t.memoizedState === null && ni(t);
          break;
        case 30:
          ni(t);
          break;
        default:
          ni(t);
      }
      e = e.sibling;
    }
  }
  function Xn(e, t, i) {
    for (i = i && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var r = t.alternate, c = e, u = t, g = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Xn(
            c,
            u,
            i
          ), Lo(4, u);
          break;
        case 1:
          if (Xn(
            c,
            u,
            i
          ), r = u, c = r.stateNode, typeof c.componentDidMount == "function")
            try {
              c.componentDidMount();
            } catch (x) {
              qe(r, r.return, x);
            }
          if (r = u, c = r.updateQueue, c !== null) {
            var b = r.stateNode;
            try {
              var S = c.shared.hiddenCallbacks;
              if (S !== null)
                for (c.shared.hiddenCallbacks = null, c = 0; c < S.length; c++)
                  C_(S[c], b);
            } catch (x) {
              qe(r, r.return, x);
            }
          }
          i && g & 64 && Im(u), Uo(u, u.return);
          break;
        case 27:
          Zm(u);
        case 26:
        case 5:
          Xn(
            c,
            u,
            i
          ), i && r === null && g & 4 && Pm(u), Uo(u, u.return);
          break;
        case 12:
          Xn(
            c,
            u,
            i
          );
          break;
        case 31:
          Xn(
            c,
            u,
            i
          ), i && g & 4 && Fm(c, u);
          break;
        case 13:
          Xn(
            c,
            u,
            i
          ), i && g & 4 && Wm(c, u);
          break;
        case 22:
          u.memoizedState === null && Xn(
            c,
            u,
            i
          ), Uo(u, u.return);
          break;
        case 30:
          break;
        default:
          Xn(
            c,
            u,
            i
          );
      }
      t = t.sibling;
    }
  }
  function Mc(e, t) {
    var i = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (i = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== i && (e != null && e.refCount++, i != null && Eo(i));
  }
  function Oc(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Eo(e));
  }
  function En(e, t, i, r) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Jm(
          e,
          t,
          i,
          r
        ), t = t.sibling;
  }
  function Jm(e, t, i, r) {
    var c = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        En(
          e,
          t,
          i,
          r
        ), c & 2048 && Lo(9, t);
        break;
      case 1:
        En(
          e,
          t,
          i,
          r
        );
        break;
      case 3:
        En(
          e,
          t,
          i,
          r
        ), c & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Eo(e)));
        break;
      case 12:
        if (c & 2048) {
          En(
            e,
            t,
            i,
            r
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, g = u.id, b = u.onPostCommit;
            typeof b == "function" && b(
              g,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (S) {
            qe(t, t.return, S);
          }
        } else
          En(
            e,
            t,
            i,
            r
          );
        break;
      case 31:
        En(
          e,
          t,
          i,
          r
        );
        break;
      case 13:
        En(
          e,
          t,
          i,
          r
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, g = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? En(
          e,
          t,
          i,
          r
        ) : qo(e, t) : u._visibility & 2 ? En(
          e,
          t,
          i,
          r
        ) : (u._visibility |= 2, Gi(
          e,
          t,
          i,
          r,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), c & 2048 && Mc(g, t);
        break;
      case 24:
        En(
          e,
          t,
          i,
          r
        ), c & 2048 && Oc(t.alternate, t);
        break;
      default:
        En(
          e,
          t,
          i,
          r
        );
    }
  }
  function Gi(e, t, i, r, c) {
    for (c = c && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, g = t, b = i, S = r, x = g.flags;
      switch (g.tag) {
        case 0:
        case 11:
        case 15:
          Gi(
            u,
            g,
            b,
            S,
            c
          ), Lo(8, g);
          break;
        case 23:
          break;
        case 22:
          var G = g.stateNode;
          g.memoizedState !== null ? G._visibility & 2 ? Gi(
            u,
            g,
            b,
            S,
            c
          ) : qo(
            u,
            g
          ) : (G._visibility |= 2, Gi(
            u,
            g,
            b,
            S,
            c
          )), c && x & 2048 && Mc(
            g.alternate,
            g
          );
          break;
        case 24:
          Gi(
            u,
            g,
            b,
            S,
            c
          ), c && x & 2048 && Oc(g.alternate, g);
          break;
        default:
          Gi(
            u,
            g,
            b,
            S,
            c
          );
      }
      t = t.sibling;
    }
  }
  function qo(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var i = e, r = t, c = r.flags;
        switch (r.tag) {
          case 22:
            qo(i, r), c & 2048 && Mc(
              r.alternate,
              r
            );
            break;
          case 24:
            qo(i, r), c & 2048 && Oc(r.alternate, r);
            break;
          default:
            qo(i, r);
        }
        t = t.sibling;
      }
  }
  var Go = 8192;
  function Ii(e, t, i) {
    if (e.subtreeFlags & Go)
      for (e = e.child; e !== null; )
        ef(
          e,
          t,
          i
        ), e = e.sibling;
  }
  function ef(e, t, i) {
    switch (e.tag) {
      case 26:
        Ii(
          e,
          t,
          i
        ), e.flags & Go && e.memoizedState !== null && pb(
          i,
          Sn,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Ii(
          e,
          t,
          i
        );
        break;
      case 3:
      case 4:
        var r = Sn;
        Sn = ys(e.stateNode.containerInfo), Ii(
          e,
          t,
          i
        ), Sn = r;
        break;
      case 22:
        e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Go, Go = 16777216, Ii(
          e,
          t,
          i
        ), Go = r) : Ii(
          e,
          t,
          i
        ));
        break;
      default:
        Ii(
          e,
          t,
          i
        );
    }
  }
  function tf(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Io(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var i = 0; i < t.length; i++) {
          var r = t[i];
          _t = r, af(
            r,
            e
          );
        }
      tf(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        nf(e), e = e.sibling;
  }
  function nf(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Io(e), e.flags & 2048 && ma(9, e, e.return);
        break;
      case 3:
        Io(e);
        break;
      case 12:
        Io(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, rs(e)) : Io(e);
        break;
      default:
        Io(e);
    }
  }
  function rs(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var i = 0; i < t.length; i++) {
          var r = t[i];
          _t = r, af(
            r,
            e
          );
        }
      tf(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          ma(8, t, t.return), rs(t);
          break;
        case 22:
          i = t.stateNode, i._visibility & 2 && (i._visibility &= -3, rs(t));
          break;
        default:
          rs(t);
      }
      e = e.sibling;
    }
  }
  function af(e, t) {
    for (; _t !== null; ) {
      var i = _t;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          ma(8, i, t);
          break;
        case 23:
        case 22:
          if (i.memoizedState !== null && i.memoizedState.cachePool !== null) {
            var r = i.memoizedState.cachePool.pool;
            r != null && r.refCount++;
          }
          break;
        case 24:
          Eo(i.memoizedState.cache);
      }
      if (r = i.child, r !== null) r.return = i, _t = r;
      else
        e: for (i = e; _t !== null; ) {
          r = _t;
          var c = r.sibling, u = r.return;
          if (Km(r), r === i) {
            _t = null;
            break e;
          }
          if (c !== null) {
            c.return = u, _t = c;
            break e;
          }
          _t = u;
        }
    }
  }
  var xy = {
    getCacheForType: function(e) {
      var t = pt(ot), i = t.data.get(e);
      return i === void 0 && (i = e(), t.data.set(e, i)), i;
    },
    cacheSignal: function() {
      return pt(ot).controller.signal;
    }
  }, My = typeof WeakMap == "function" ? WeakMap : Map, De = 0, Ze = null, Se = null, ze = 0, Ue = 0, $t = null, fa = !1, Hi = !1, Rc = !1, Fn = 0, Je = 0, pa = 0, ai = 0, Dc = 0, Qt = 0, Pi = 0, Ho = null, It = null, jc = !1, ss = 0, of = 0, ls = 1 / 0, cs = null, ga = null, ut = 0, ha = null, Bi = null, Wn = 0, Lc = 0, Uc = null, rf = null, Po = 0, qc = null;
  function Jt() {
    return (De & 2) !== 0 && ze !== 0 ? ze & -ze : M.T !== null ? Zc() : wd();
  }
  function sf() {
    if (Qt === 0)
      if ((ze & 536870912) === 0 || Ae) {
        var e = hr;
        hr <<= 1, (hr & 3932160) === 0 && (hr = 262144), Qt = e;
      } else Qt = 536870912;
    return e = Ft.current, e !== null && (e.flags |= 32), Qt;
  }
  function Ht(e, t, i) {
    (e === Ze && (Ue === 2 || Ue === 9) || e.cancelPendingCommit !== null) && (Zi(e, 0), va(
      e,
      ze,
      Qt,
      !1
    )), lo(e, i), ((De & 2) === 0 || e !== Ze) && (e === Ze && ((De & 2) === 0 && (ai |= i), Je === 4 && va(
      e,
      ze,
      Qt,
      !1
    )), xn(e));
  }
  function lf(e, t, i) {
    if ((De & 6) !== 0) throw Error(s(327));
    var r = !i && (t & 127) === 0 && (t & e.expiredLanes) === 0 || so(e, t), c = r ? Dy(e, t) : Ic(e, t, !0), u = r;
    do {
      if (c === 0) {
        Hi && !r && va(e, t, 0, !1);
        break;
      } else {
        if (i = e.current.alternate, u && !Oy(i)) {
          c = Ic(e, t, !1), u = !1;
          continue;
        }
        if (c === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var g = 0;
          else
            g = e.pendingLanes & -536870913, g = g !== 0 ? g : g & 536870912 ? 536870912 : 0;
          if (g !== 0) {
            t = g;
            e: {
              var b = e;
              c = Ho;
              var S = b.current.memoizedState.isDehydrated;
              if (S && (Zi(b, g).flags |= 256), g = Ic(
                b,
                g,
                !1
              ), g !== 2) {
                if (Rc && !S) {
                  b.errorRecoveryDisabledLanes |= u, ai |= u, c = 4;
                  break e;
                }
                u = It, It = c, u !== null && (It === null ? It = u : It.push.apply(
                  It,
                  u
                ));
              }
              c = g;
            }
            if (u = !1, c !== 2) continue;
          }
        }
        if (c === 1) {
          Zi(e, 0), va(e, t, 0, !0);
          break;
        }
        e: {
          switch (r = e, u = c, u) {
            case 0:
            case 1:
              throw Error(s(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              va(
                r,
                t,
                Qt,
                !fa
              );
              break e;
            case 2:
              It = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(s(329));
          }
          if ((t & 62914560) === t && (c = ss + 300 - Nt(), 10 < c)) {
            if (va(
              r,
              t,
              Qt,
              !fa
            ), yr(r, 0, !0) !== 0) break e;
            Wn = t, r.timeoutHandle = Gf(
              cf.bind(
                null,
                r,
                i,
                It,
                cs,
                jc,
                t,
                Qt,
                ai,
                Pi,
                fa,
                u,
                "Throttled",
                -0,
                0
              ),
              c
            );
            break e;
          }
          cf(
            r,
            i,
            It,
            cs,
            jc,
            t,
            Qt,
            ai,
            Pi,
            fa,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    xn(e);
  }
  function cf(e, t, i, r, c, u, g, b, S, x, G, Z, O, L) {
    if (e.timeoutHandle = -1, Z = t.subtreeFlags, Z & 8192 || (Z & 16785408) === 16785408) {
      Z = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: jn
      }, ef(
        t,
        u,
        Z
      );
      var ee = (u & 62914560) === u ? ss - Nt() : (u & 4194048) === u ? of - Nt() : 0;
      if (ee = gb(
        Z,
        ee
      ), ee !== null) {
        Wn = u, e.cancelPendingCommit = ee(
          hf.bind(
            null,
            e,
            t,
            u,
            i,
            r,
            c,
            g,
            b,
            S,
            G,
            Z,
            null,
            O,
            L
          )
        ), va(e, u, g, !x);
        return;
      }
    }
    hf(
      e,
      t,
      u,
      i,
      r,
      c,
      g,
      b,
      S
    );
  }
  function Oy(e) {
    for (var t = e; ; ) {
      var i = t.tag;
      if ((i === 0 || i === 11 || i === 15) && t.flags & 16384 && (i = t.updateQueue, i !== null && (i = i.stores, i !== null)))
        for (var r = 0; r < i.length; r++) {
          var c = i[r], u = c.getSnapshot;
          c = c.value;
          try {
            if (!Kt(u(), c)) return !1;
          } catch {
            return !1;
          }
        }
      if (i = t.child, t.subtreeFlags & 16384 && i !== null)
        i.return = t, t = i;
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
  function va(e, t, i, r) {
    t &= ~Dc, t &= ~ai, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
    for (var c = t; 0 < c; ) {
      var u = 31 - Vt(c), g = 1 << u;
      r[u] = -1, c &= ~g;
    }
    i !== 0 && vd(e, i, t);
  }
  function us() {
    return (De & 6) === 0 ? (Bo(0), !1) : !0;
  }
  function Gc() {
    if (Se !== null) {
      if (Ue === 0)
        var e = Se.return;
      else
        e = Se, Gn = Xa = null, tc(e), Di = null, ko = 0, e = Se;
      for (; e !== null; )
        Gm(e.alternate, e), e = e.return;
      Se = null;
    }
  }
  function Zi(e, t) {
    var i = e.timeoutHandle;
    i !== -1 && (e.timeoutHandle = -1, Qy(i)), i = e.cancelPendingCommit, i !== null && (e.cancelPendingCommit = null, i()), Wn = 0, Gc(), Ze = e, Se = i = Un(e.current, null), ze = t, Ue = 0, $t = null, fa = !1, Hi = so(e, t), Rc = !1, Pi = Qt = Dc = ai = pa = Je = 0, It = Ho = null, jc = !1, (t & 8) !== 0 && (t |= t & 32);
    var r = e.entangledLanes;
    if (r !== 0)
      for (e = e.entanglements, r &= t; 0 < r; ) {
        var c = 31 - Vt(r), u = 1 << c;
        t |= e[c], r &= ~u;
      }
    return Fn = t, Mr(), i;
  }
  function uf(e, t) {
    ye = null, M.H = Ro, t === Ri || t === Gr ? (t = k_(), Ue = 3) : t === Bl ? (t = k_(), Ue = 4) : Ue = t === hc ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, $t = t, Se === null && (Je = 1, Jr(
      e,
      rn(t, e.current)
    ));
  }
  function df() {
    var e = Ft.current;
    return e === null ? !0 : (ze & 4194048) === ze ? un === null : (ze & 62914560) === ze || (ze & 536870912) !== 0 ? e === un : !1;
  }
  function _f() {
    var e = M.H;
    return M.H = Ro, e === null ? Ro : e;
  }
  function mf() {
    var e = M.A;
    return M.A = xy, e;
  }
  function ds() {
    Je = 4, fa || (ze & 4194048) !== ze && Ft.current !== null || (Hi = !0), (pa & 134217727) === 0 && (ai & 134217727) === 0 || Ze === null || va(
      Ze,
      ze,
      Qt,
      !1
    );
  }
  function Ic(e, t, i) {
    var r = De;
    De |= 2;
    var c = _f(), u = mf();
    (Ze !== e || ze !== t) && (cs = null, Zi(e, t)), t = !1;
    var g = Je;
    e: do
      try {
        if (Ue !== 0 && Se !== null) {
          var b = Se, S = $t;
          switch (Ue) {
            case 8:
              Gc(), g = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Ft.current === null && (t = !0);
              var x = Ue;
              if (Ue = 0, $t = null, Yi(e, b, S, x), i && Hi) {
                g = 0;
                break e;
              }
              break;
            default:
              x = Ue, Ue = 0, $t = null, Yi(e, b, S, x);
          }
        }
        Ry(), g = Je;
        break;
      } catch (G) {
        uf(e, G);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Gn = Xa = null, De = r, M.H = c, M.A = u, Se === null && (Ze = null, ze = 0, Mr()), g;
  }
  function Ry() {
    for (; Se !== null; ) ff(Se);
  }
  function Dy(e, t) {
    var i = De;
    De |= 2;
    var r = _f(), c = mf();
    Ze !== e || ze !== t ? (cs = null, ls = Nt() + 500, Zi(e, t)) : Hi = so(
      e,
      t
    );
    e: do
      try {
        if (Ue !== 0 && Se !== null) {
          t = Se;
          var u = $t;
          t: switch (Ue) {
            case 1:
              Ue = 0, $t = null, Yi(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (E_(u)) {
                Ue = 0, $t = null, pf(t);
                break;
              }
              t = function() {
                Ue !== 2 && Ue !== 9 || Ze !== e || (Ue = 7), xn(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ue = 7;
              break e;
            case 4:
              Ue = 5;
              break e;
            case 7:
              E_(u) ? (Ue = 0, $t = null, pf(t)) : (Ue = 0, $t = null, Yi(e, t, u, 7));
              break;
            case 5:
              var g = null;
              switch (Se.tag) {
                case 26:
                  g = Se.memoizedState;
                case 5:
                case 27:
                  var b = Se;
                  if (g ? ep(g) : b.stateNode.complete) {
                    Ue = 0, $t = null;
                    var S = b.sibling;
                    if (S !== null) Se = S;
                    else {
                      var x = b.return;
                      x !== null ? (Se = x, _s(x)) : Se = null;
                    }
                    break t;
                  }
              }
              Ue = 0, $t = null, Yi(e, t, u, 5);
              break;
            case 6:
              Ue = 0, $t = null, Yi(e, t, u, 6);
              break;
            case 8:
              Gc(), Je = 6;
              break e;
            default:
              throw Error(s(462));
          }
        }
        jy();
        break;
      } catch (G) {
        uf(e, G);
      }
    while (!0);
    return Gn = Xa = null, M.H = r, M.A = c, De = i, Se !== null ? 0 : (Ze = null, ze = 0, Mr(), Je);
  }
  function jy() {
    for (; Se !== null && !bn(); )
      ff(Se);
  }
  function ff(e) {
    var t = Um(e.alternate, e, Fn);
    e.memoizedProps = e.pendingProps, t === null ? _s(e) : Se = t;
  }
  function pf(e) {
    var t = e, i = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Mm(
          i,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ze
        );
        break;
      case 11:
        t = Mm(
          i,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ze
        );
        break;
      case 5:
        tc(t);
      default:
        Gm(i, t), t = Se = __(t, Fn), t = Um(i, t, Fn);
    }
    e.memoizedProps = e.pendingProps, t === null ? _s(e) : Se = t;
  }
  function Yi(e, t, i, r) {
    Gn = Xa = null, tc(t), Di = null, ko = 0;
    var c = t.return;
    try {
      if (Ey(
        e,
        c,
        t,
        i,
        ze
      )) {
        Je = 1, Jr(
          e,
          rn(i, e.current)
        ), Se = null;
        return;
      }
    } catch (u) {
      if (c !== null) throw Se = c, u;
      Je = 1, Jr(
        e,
        rn(i, e.current)
      ), Se = null;
      return;
    }
    t.flags & 32768 ? (Ae || r === 1 ? e = !0 : Hi || (ze & 536870912) !== 0 ? e = !1 : (fa = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Ft.current, r !== null && r.tag === 13 && (r.flags |= 16384))), gf(t, e)) : _s(t);
  }
  function _s(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        gf(
          t,
          fa
        );
        return;
      }
      e = t.return;
      var i = Ty(
        t.alternate,
        t,
        Fn
      );
      if (i !== null) {
        Se = i;
        return;
      }
      if (t = t.sibling, t !== null) {
        Se = t;
        return;
      }
      Se = t = e;
    } while (t !== null);
    Je === 0 && (Je = 5);
  }
  function gf(e, t) {
    do {
      var i = Ay(e.alternate, e);
      if (i !== null) {
        i.flags &= 32767, Se = i;
        return;
      }
      if (i = e.return, i !== null && (i.flags |= 32768, i.subtreeFlags = 0, i.deletions = null), !t && (e = e.sibling, e !== null)) {
        Se = e;
        return;
      }
      Se = e = i;
    } while (e !== null);
    Je = 6, Se = null;
  }
  function hf(e, t, i, r, c, u, g, b, S) {
    e.cancelPendingCommit = null;
    do
      ms();
    while (ut !== 0);
    if ((De & 6) !== 0) throw Error(s(327));
    if (t !== null) {
      if (t === e.current) throw Error(s(177));
      if (u = t.lanes | t.childLanes, u |= Nl, fv(
        e,
        i,
        u,
        g,
        b,
        S
      ), e === Ze && (Se = Ze = null, ze = 0), Bi = t, ha = e, Wn = i, Lc = u, Uc = c, rf = r, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Gy(pr, function() {
        return Sf(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || r) {
        r = M.T, M.T = null, c = K.p, K.p = 2, g = De, De |= 4;
        try {
          Ny(e, t, i);
        } finally {
          De = g, K.p = c, M.T = r;
        }
      }
      ut = 1, vf(), yf(), bf();
    }
  }
  function vf() {
    if (ut === 1) {
      ut = 0;
      var e = ha, t = Bi, i = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || i) {
        i = M.T, M.T = null;
        var r = K.p;
        K.p = 2;
        var c = De;
        De |= 4;
        try {
          $m(t, e);
          var u = Qc, g = a_(e.containerInfo), b = u.focusedElem, S = u.selectionRange;
          if (g !== b && b && b.ownerDocument && n_(
            b.ownerDocument.documentElement,
            b
          )) {
            if (S !== null && El(b)) {
              var x = S.start, G = S.end;
              if (G === void 0 && (G = x), "selectionStart" in b)
                b.selectionStart = x, b.selectionEnd = Math.min(
                  G,
                  b.value.length
                );
              else {
                var Z = b.ownerDocument || document, O = Z && Z.defaultView || window;
                if (O.getSelection) {
                  var L = O.getSelection(), ee = b.textContent.length, ue = Math.min(S.start, ee), Be = S.end === void 0 ? ue : Math.min(S.end, ee);
                  !L.extend && ue > Be && (g = Be, Be = ue, ue = g);
                  var A = t_(
                    b,
                    ue
                  ), T = t_(
                    b,
                    Be
                  );
                  if (A && T && (L.rangeCount !== 1 || L.anchorNode !== A.node || L.anchorOffset !== A.offset || L.focusNode !== T.node || L.focusOffset !== T.offset)) {
                    var C = Z.createRange();
                    C.setStart(A.node, A.offset), L.removeAllRanges(), ue > Be ? (L.addRange(C), L.extend(T.node, T.offset)) : (C.setEnd(T.node, T.offset), L.addRange(C));
                  }
                }
              }
            }
            for (Z = [], L = b; L = L.parentNode; )
              L.nodeType === 1 && Z.push({
                element: L,
                left: L.scrollLeft,
                top: L.scrollTop
              });
            for (typeof b.focus == "function" && b.focus(), b = 0; b < Z.length; b++) {
              var H = Z[b];
              H.element.scrollLeft = H.left, H.element.scrollTop = H.top;
            }
          }
          ks = !!$c, Qc = $c = null;
        } finally {
          De = c, K.p = r, M.T = i;
        }
      }
      e.current = t, ut = 2;
    }
  }
  function yf() {
    if (ut === 2) {
      ut = 0;
      var e = ha, t = Bi, i = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || i) {
        i = M.T, M.T = null;
        var r = K.p;
        K.p = 2;
        var c = De;
        De |= 4;
        try {
          Vm(e, t.alternate, t);
        } finally {
          De = c, K.p = r, M.T = i;
        }
      }
      ut = 3;
    }
  }
  function bf() {
    if (ut === 4 || ut === 3) {
      ut = 0, ea();
      var e = ha, t = Bi, i = Wn, r = rf;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? ut = 5 : (ut = 0, Bi = ha = null, wf(e, e.pendingLanes));
      var c = e.pendingLanes;
      if (c === 0 && (ga = null), il(i), t = t.stateNode, Yt && typeof Yt.onCommitFiberRoot == "function")
        try {
          Yt.onCommitFiberRoot(
            ro,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (r !== null) {
        t = M.T, c = K.p, K.p = 2, M.T = null;
        try {
          for (var u = e.onRecoverableError, g = 0; g < r.length; g++) {
            var b = r[g];
            u(b.value, {
              componentStack: b.stack
            });
          }
        } finally {
          M.T = t, K.p = c;
        }
      }
      (Wn & 3) !== 0 && ms(), xn(e), c = e.pendingLanes, (i & 261930) !== 0 && (c & 42) !== 0 ? e === qc ? Po++ : (Po = 0, qc = e) : Po = 0, Bo(0);
    }
  }
  function wf(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Eo(t)));
  }
  function ms() {
    return vf(), yf(), bf(), Sf();
  }
  function Sf() {
    if (ut !== 5) return !1;
    var e = ha, t = Lc;
    Lc = 0;
    var i = il(Wn), r = M.T, c = K.p;
    try {
      K.p = 32 > i ? 32 : i, M.T = null, i = Uc, Uc = null;
      var u = ha, g = Wn;
      if (ut = 0, Bi = ha = null, Wn = 0, (De & 6) !== 0) throw Error(s(331));
      var b = De;
      if (De |= 4, nf(u.current), Jm(
        u,
        u.current,
        g,
        i
      ), De = b, Bo(0, !1), Yt && typeof Yt.onPostCommitFiberRoot == "function")
        try {
          Yt.onPostCommitFiberRoot(ro, u);
        } catch {
        }
      return !0;
    } finally {
      K.p = c, M.T = r, wf(e, t);
    }
  }
  function Ef(e, t, i) {
    t = rn(i, t), t = gc(e.stateNode, t, 2), e = ua(e, t, 2), e !== null && (lo(e, 2), xn(e));
  }
  function qe(e, t, i) {
    if (e.tag === 3)
      Ef(e, e, i);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Ef(
            t,
            e,
            i
          );
          break;
        } else if (t.tag === 1) {
          var r = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (ga === null || !ga.has(r))) {
            e = rn(i, e), i = Em(2), r = ua(t, i, 2), r !== null && (zm(
              i,
              r,
              t,
              e
            ), lo(r, 2), xn(r));
            break;
          }
        }
        t = t.return;
      }
  }
  function Hc(e, t, i) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new My();
      var c = /* @__PURE__ */ new Set();
      r.set(t, c);
    } else
      c = r.get(t), c === void 0 && (c = /* @__PURE__ */ new Set(), r.set(t, c));
    c.has(i) || (Rc = !0, c.add(i), e = Ly.bind(null, e, t, i), t.then(e, e));
  }
  function Ly(e, t, i) {
    var r = e.pingCache;
    r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & i, e.warmLanes &= ~i, Ze === e && (ze & i) === i && (Je === 4 || Je === 3 && (ze & 62914560) === ze && 300 > Nt() - ss ? (De & 2) === 0 && Zi(e, 0) : Dc |= i, Pi === ze && (Pi = 0)), xn(e);
  }
  function zf(e, t) {
    t === 0 && (t = hd()), e = Ya(e, t), e !== null && (lo(e, t), xn(e));
  }
  function Uy(e) {
    var t = e.memoizedState, i = 0;
    t !== null && (i = t.retryLane), zf(e, i);
  }
  function qy(e, t) {
    var i = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var r = e.stateNode, c = e.memoizedState;
        c !== null && (i = c.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      case 22:
        r = e.stateNode._retryCache;
        break;
      default:
        throw Error(s(314));
    }
    r !== null && r.delete(t), zf(e, i);
  }
  function Gy(e, t) {
    return At(e, t);
  }
  var fs = null, Vi = null, Pc = !1, ps = !1, Bc = !1, ya = 0;
  function xn(e) {
    e !== Vi && e.next === null && (Vi === null ? fs = Vi = e : Vi = Vi.next = e), ps = !0, Pc || (Pc = !0, Hy());
  }
  function Bo(e, t) {
    if (!Bc && ps) {
      Bc = !0;
      do
        for (var i = !1, r = fs; r !== null; ) {
          if (e !== 0) {
            var c = r.pendingLanes;
            if (c === 0) var u = 0;
            else {
              var g = r.suspendedLanes, b = r.pingedLanes;
              u = (1 << 31 - Vt(42 | e) + 1) - 1, u &= c & ~(g & ~b), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (i = !0, Nf(r, u));
          } else
            u = ze, u = yr(
              r,
              r === Ze ? u : 0,
              r.cancelPendingCommit !== null || r.timeoutHandle !== -1
            ), (u & 3) === 0 || so(r, u) || (i = !0, Nf(r, u));
          r = r.next;
        }
      while (i);
      Bc = !1;
    }
  }
  function Iy() {
    kf();
  }
  function kf() {
    ps = Pc = !1;
    var e = 0;
    ya !== 0 && $y() && (e = ya);
    for (var t = Nt(), i = null, r = fs; r !== null; ) {
      var c = r.next, u = Tf(r, t);
      u === 0 ? (r.next = null, i === null ? fs = c : i.next = c, c === null && (Vi = i)) : (i = r, (e !== 0 || (u & 3) !== 0) && (ps = !0)), r = c;
    }
    ut !== 0 && ut !== 5 || Bo(e), ya !== 0 && (ya = 0);
  }
  function Tf(e, t) {
    for (var i = e.suspendedLanes, r = e.pingedLanes, c = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var g = 31 - Vt(u), b = 1 << g, S = c[g];
      S === -1 ? ((b & i) === 0 || (b & r) !== 0) && (c[g] = mv(b, t)) : S <= t && (e.expiredLanes |= b), u &= ~b;
    }
    if (t = Ze, i = ze, i = yr(
      e,
      e === t ? i : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), r = e.callbackNode, i === 0 || e === t && (Ue === 2 || Ue === 9) || e.cancelPendingCommit !== null)
      return r !== null && r !== null && wt(r), e.callbackNode = null, e.callbackPriority = 0;
    if ((i & 3) === 0 || so(e, i)) {
      if (t = i & -i, t === e.callbackPriority) return t;
      switch (r !== null && wt(r), il(i)) {
        case 2:
        case 8:
          i = pd;
          break;
        case 32:
          i = pr;
          break;
        case 268435456:
          i = gd;
          break;
        default:
          i = pr;
      }
      return r = Af.bind(null, e), i = At(i, r), e.callbackPriority = t, e.callbackNode = i, t;
    }
    return r !== null && r !== null && wt(r), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Af(e, t) {
    if (ut !== 0 && ut !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var i = e.callbackNode;
    if (ms() && e.callbackNode !== i)
      return null;
    var r = ze;
    return r = yr(
      e,
      e === Ze ? r : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), r === 0 ? null : (lf(e, r, t), Tf(e, Nt()), e.callbackNode != null && e.callbackNode === i ? Af.bind(null, e) : null);
  }
  function Nf(e, t) {
    if (ms()) return null;
    lf(e, t, !0);
  }
  function Hy() {
    Jy(function() {
      (De & 6) !== 0 ? At(
        fd,
        Iy
      ) : kf();
    });
  }
  function Zc() {
    if (ya === 0) {
      var e = Mi;
      e === 0 && (e = gr, gr <<= 1, (gr & 261888) === 0 && (gr = 256)), ya = e;
    }
    return ya;
  }
  function Cf(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Er("" + e);
  }
  function xf(e, t) {
    var i = t.ownerDocument.createElement("input");
    return i.name = t.name, i.value = t.value, e.id && i.setAttribute("form", e.id), t.parentNode.insertBefore(i, t), e = new FormData(e), i.parentNode.removeChild(i), e;
  }
  function Py(e, t, i, r, c) {
    if (t === "submit" && i && i.stateNode === c) {
      var u = Cf(
        (c[jt] || null).action
      ), g = r.submitter;
      g && (t = (t = g[jt] || null) ? Cf(t.formAction) : g.getAttribute("formAction"), t !== null && (u = t, g = null));
      var b = new Ar(
        "action",
        "action",
        null,
        r,
        c
      );
      e.push({
        event: b,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (r.defaultPrevented) {
                if (ya !== 0) {
                  var S = g ? xf(c, g) : new FormData(c);
                  uc(
                    i,
                    {
                      pending: !0,
                      data: S,
                      method: c.method,
                      action: u
                    },
                    null,
                    S
                  );
                }
              } else
                typeof u == "function" && (b.preventDefault(), S = g ? xf(c, g) : new FormData(c), uc(
                  i,
                  {
                    pending: !0,
                    data: S,
                    method: c.method,
                    action: u
                  },
                  u,
                  S
                ));
            },
            currentTarget: c
          }
        ]
      });
    }
  }
  for (var Yc = 0; Yc < Al.length; Yc++) {
    var Vc = Al[Yc], By = Vc.toLowerCase(), Zy = Vc[0].toUpperCase() + Vc.slice(1);
    wn(
      By,
      "on" + Zy
    );
  }
  wn(r_, "onAnimationEnd"), wn(s_, "onAnimationIteration"), wn(l_, "onAnimationStart"), wn("dblclick", "onDoubleClick"), wn("focusin", "onFocus"), wn("focusout", "onBlur"), wn(ry, "onTransitionRun"), wn(sy, "onTransitionStart"), wn(ly, "onTransitionCancel"), wn(c_, "onTransitionEnd"), hi("onMouseEnter", ["mouseout", "mouseover"]), hi("onMouseLeave", ["mouseout", "mouseover"]), hi("onPointerEnter", ["pointerout", "pointerover"]), hi("onPointerLeave", ["pointerout", "pointerover"]), Ha(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ha(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ha("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ha(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ha(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ha(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Zo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Yy = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Zo)
  );
  function Mf(e, t) {
    t = (t & 4) !== 0;
    for (var i = 0; i < e.length; i++) {
      var r = e[i], c = r.event;
      r = r.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var g = r.length - 1; 0 <= g; g--) {
            var b = r[g], S = b.instance, x = b.currentTarget;
            if (b = b.listener, S !== u && c.isPropagationStopped())
              break e;
            u = b, c.currentTarget = x;
            try {
              u(c);
            } catch (G) {
              xr(G);
            }
            c.currentTarget = null, u = S;
          }
        else
          for (g = 0; g < r.length; g++) {
            if (b = r[g], S = b.instance, x = b.currentTarget, b = b.listener, S !== u && c.isPropagationStopped())
              break e;
            u = b, c.currentTarget = x;
            try {
              u(c);
            } catch (G) {
              xr(G);
            }
            c.currentTarget = null, u = S;
          }
      }
    }
  }
  function Ee(e, t) {
    var i = t[ol];
    i === void 0 && (i = t[ol] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    i.has(r) || (Of(t, e, 2, !1), i.add(r));
  }
  function Kc(e, t, i) {
    var r = 0;
    t && (r |= 4), Of(
      i,
      e,
      r,
      t
    );
  }
  var gs = "_reactListening" + Math.random().toString(36).slice(2);
  function Xc(e) {
    if (!e[gs]) {
      e[gs] = !0, zd.forEach(function(i) {
        i !== "selectionchange" && (Yy.has(i) || Kc(i, !1, e), Kc(i, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[gs] || (t[gs] = !0, Kc("selectionchange", !1, t));
    }
  }
  function Of(e, t, i, r) {
    switch (sp(t)) {
      case 2:
        var c = yb;
        break;
      case 8:
        c = bb;
        break;
      default:
        c = cu;
    }
    i = c.bind(
      null,
      t,
      i,
      e
    ), c = void 0, !fl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (c = !0), r ? c !== void 0 ? e.addEventListener(t, i, {
      capture: !0,
      passive: c
    }) : e.addEventListener(t, i, !0) : c !== void 0 ? e.addEventListener(t, i, {
      passive: c
    }) : e.addEventListener(t, i, !1);
  }
  function Fc(e, t, i, r, c) {
    var u = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null)
      e: for (; ; ) {
        if (r === null) return;
        var g = r.tag;
        if (g === 3 || g === 4) {
          var b = r.stateNode.containerInfo;
          if (b === c) break;
          if (g === 4)
            for (g = r.return; g !== null; ) {
              var S = g.tag;
              if ((S === 3 || S === 4) && g.stateNode.containerInfo === c)
                return;
              g = g.return;
            }
          for (; b !== null; ) {
            if (g = fi(b), g === null) return;
            if (S = g.tag, S === 5 || S === 6 || S === 26 || S === 27) {
              r = u = g;
              continue e;
            }
            b = b.parentNode;
          }
        }
        r = r.return;
      }
    Ld(function() {
      var x = u, G = _l(i), Z = [];
      e: {
        var O = u_.get(e);
        if (O !== void 0) {
          var L = Ar, ee = e;
          switch (e) {
            case "keypress":
              if (kr(i) === 0) break e;
            case "keydown":
            case "keyup":
              L = qv;
              break;
            case "focusin":
              ee = "focus", L = vl;
              break;
            case "focusout":
              ee = "blur", L = vl;
              break;
            case "beforeblur":
            case "afterblur":
              L = vl;
              break;
            case "click":
              if (i.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              L = Gd;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              L = Tv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              L = Hv;
              break;
            case r_:
            case s_:
            case l_:
              L = Cv;
              break;
            case c_:
              L = Bv;
              break;
            case "scroll":
            case "scrollend":
              L = zv;
              break;
            case "wheel":
              L = Yv;
              break;
            case "copy":
            case "cut":
            case "paste":
              L = Mv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              L = Hd;
              break;
            case "toggle":
            case "beforetoggle":
              L = Kv;
          }
          var ue = (t & 4) !== 0, Be = !ue && (e === "scroll" || e === "scrollend"), A = ue ? O !== null ? O + "Capture" : null : O;
          ue = [];
          for (var T = x, C; T !== null; ) {
            var H = T;
            if (C = H.stateNode, H = H.tag, H !== 5 && H !== 26 && H !== 27 || C === null || A === null || (H = _o(T, A), H != null && ue.push(
              Yo(T, H, C)
            )), Be) break;
            T = T.return;
          }
          0 < ue.length && (O = new L(
            O,
            ee,
            null,
            i,
            G
          ), Z.push({ event: O, listeners: ue }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (O = e === "mouseover" || e === "pointerover", L = e === "mouseout" || e === "pointerout", O && i !== dl && (ee = i.relatedTarget || i.fromElement) && (fi(ee) || ee[mi]))
            break e;
          if ((L || O) && (O = G.window === G ? G : (O = G.ownerDocument) ? O.defaultView || O.parentWindow : window, L ? (ee = i.relatedTarget || i.toElement, L = x, ee = ee ? fi(ee) : null, ee !== null && (Be = d(ee), ue = ee.tag, ee !== Be || ue !== 5 && ue !== 27 && ue !== 6) && (ee = null)) : (L = null, ee = x), L !== ee)) {
            if (ue = Gd, H = "onMouseLeave", A = "onMouseEnter", T = "mouse", (e === "pointerout" || e === "pointerover") && (ue = Hd, H = "onPointerLeave", A = "onPointerEnter", T = "pointer"), Be = L == null ? O : uo(L), C = ee == null ? O : uo(ee), O = new ue(
              H,
              T + "leave",
              L,
              i,
              G
            ), O.target = Be, O.relatedTarget = C, H = null, fi(G) === x && (ue = new ue(
              A,
              T + "enter",
              ee,
              i,
              G
            ), ue.target = C, ue.relatedTarget = Be, H = ue), Be = H, L && ee)
              t: {
                for (ue = Vy, A = L, T = ee, C = 0, H = A; H; H = ue(H))
                  C++;
                H = 0;
                for (var oe = T; oe; oe = ue(oe))
                  H++;
                for (; 0 < C - H; )
                  A = ue(A), C--;
                for (; 0 < H - C; )
                  T = ue(T), H--;
                for (; C--; ) {
                  if (A === T || T !== null && A === T.alternate) {
                    ue = A;
                    break t;
                  }
                  A = ue(A), T = ue(T);
                }
                ue = null;
              }
            else ue = null;
            L !== null && Rf(
              Z,
              O,
              L,
              ue,
              !1
            ), ee !== null && Be !== null && Rf(
              Z,
              Be,
              ee,
              ue,
              !0
            );
          }
        }
        e: {
          if (O = x ? uo(x) : window, L = O.nodeName && O.nodeName.toLowerCase(), L === "select" || L === "input" && O.type === "file")
            var Me = Fd;
          else if (Kd(O))
            if (Wd)
              Me = ay;
            else {
              Me = ty;
              var ae = ey;
            }
          else
            L = O.nodeName, !L || L.toLowerCase() !== "input" || O.type !== "checkbox" && O.type !== "radio" ? x && ul(x.elementType) && (Me = Fd) : Me = ny;
          if (Me && (Me = Me(e, x))) {
            Xd(
              Z,
              Me,
              i,
              G
            );
            break e;
          }
          ae && ae(e, O, x), e === "focusout" && x && O.type === "number" && x.memoizedProps.value != null && cl(O, "number", O.value);
        }
        switch (ae = x ? uo(x) : window, e) {
          case "focusin":
            (Kd(ae) || ae.contentEditable === "true") && (Ei = ae, zl = x, bo = null);
            break;
          case "focusout":
            bo = zl = Ei = null;
            break;
          case "mousedown":
            kl = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            kl = !1, i_(Z, i, G);
            break;
          case "selectionchange":
            if (oy) break;
          case "keydown":
          case "keyup":
            i_(Z, i, G);
        }
        var be;
        if (bl)
          e: {
            switch (e) {
              case "compositionstart":
                var ke = "onCompositionStart";
                break e;
              case "compositionend":
                ke = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ke = "onCompositionUpdate";
                break e;
            }
            ke = void 0;
          }
        else
          Si ? Yd(e, i) && (ke = "onCompositionEnd") : e === "keydown" && i.keyCode === 229 && (ke = "onCompositionStart");
        ke && (Pd && i.locale !== "ko" && (Si || ke !== "onCompositionStart" ? ke === "onCompositionEnd" && Si && (be = Ud()) : (aa = G, pl = "value" in aa ? aa.value : aa.textContent, Si = !0)), ae = hs(x, ke), 0 < ae.length && (ke = new Id(
          ke,
          e,
          null,
          i,
          G
        ), Z.push({ event: ke, listeners: ae }), be ? ke.data = be : (be = Vd(i), be !== null && (ke.data = be)))), (be = Fv ? Wv(e, i) : $v(e, i)) && (ke = hs(x, "onBeforeInput"), 0 < ke.length && (ae = new Id(
          "onBeforeInput",
          "beforeinput",
          null,
          i,
          G
        ), Z.push({
          event: ae,
          listeners: ke
        }), ae.data = be)), Py(
          Z,
          e,
          x,
          i,
          G
        );
      }
      Mf(Z, t);
    });
  }
  function Yo(e, t, i) {
    return {
      instance: e,
      listener: t,
      currentTarget: i
    };
  }
  function hs(e, t) {
    for (var i = t + "Capture", r = []; e !== null; ) {
      var c = e, u = c.stateNode;
      if (c = c.tag, c !== 5 && c !== 26 && c !== 27 || u === null || (c = _o(e, i), c != null && r.unshift(
        Yo(e, c, u)
      ), c = _o(e, t), c != null && r.push(
        Yo(e, c, u)
      )), e.tag === 3) return r;
      e = e.return;
    }
    return [];
  }
  function Vy(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Rf(e, t, i, r, c) {
    for (var u = t._reactName, g = []; i !== null && i !== r; ) {
      var b = i, S = b.alternate, x = b.stateNode;
      if (b = b.tag, S !== null && S === r) break;
      b !== 5 && b !== 26 && b !== 27 || x === null || (S = x, c ? (x = _o(i, u), x != null && g.unshift(
        Yo(i, x, S)
      )) : c || (x = _o(i, u), x != null && g.push(
        Yo(i, x, S)
      ))), i = i.return;
    }
    g.length !== 0 && e.push({ event: t, listeners: g });
  }
  var Ky = /\r\n?/g, Xy = /\u0000|\uFFFD/g;
  function Df(e) {
    return (typeof e == "string" ? e : "" + e).replace(Ky, `
`).replace(Xy, "");
  }
  function jf(e, t) {
    return t = Df(t), Df(e) === t;
  }
  function Pe(e, t, i, r, c, u) {
    switch (i) {
      case "children":
        typeof r == "string" ? t === "body" || t === "textarea" && r === "" || yi(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && yi(e, "" + r);
        break;
      case "className":
        wr(e, "class", r);
        break;
      case "tabIndex":
        wr(e, "tabindex", r);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        wr(e, i, r);
        break;
      case "style":
        Dd(e, r, u);
        break;
      case "data":
        if (t !== "object") {
          wr(e, "data", r);
          break;
        }
      case "src":
      case "href":
        if (r === "" && (t !== "a" || i !== "href")) {
          e.removeAttribute(i);
          break;
        }
        if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
          e.removeAttribute(i);
          break;
        }
        r = Er("" + r), e.setAttribute(i, r);
        break;
      case "action":
      case "formAction":
        if (typeof r == "function") {
          e.setAttribute(
            i,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (i === "formAction" ? (t !== "input" && Pe(e, t, "name", c.name, c, null), Pe(
            e,
            t,
            "formEncType",
            c.formEncType,
            c,
            null
          ), Pe(
            e,
            t,
            "formMethod",
            c.formMethod,
            c,
            null
          ), Pe(
            e,
            t,
            "formTarget",
            c.formTarget,
            c,
            null
          )) : (Pe(e, t, "encType", c.encType, c, null), Pe(e, t, "method", c.method, c, null), Pe(e, t, "target", c.target, c, null)));
        if (r == null || typeof r == "symbol" || typeof r == "boolean") {
          e.removeAttribute(i);
          break;
        }
        r = Er("" + r), e.setAttribute(i, r);
        break;
      case "onClick":
        r != null && (e.onclick = jn);
        break;
      case "onScroll":
        r != null && Ee("scroll", e);
        break;
      case "onScrollEnd":
        r != null && Ee("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (r != null) {
          if (typeof r != "object" || !("__html" in r))
            throw Error(s(61));
          if (i = r.__html, i != null) {
            if (c.children != null) throw Error(s(60));
            e.innerHTML = i;
          }
        }
        break;
      case "multiple":
        e.multiple = r && typeof r != "function" && typeof r != "symbol";
        break;
      case "muted":
        e.muted = r && typeof r != "function" && typeof r != "symbol";
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
        if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        i = Er("" + r), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          i
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
        r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(i, "" + r) : e.removeAttribute(i);
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
        r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(i, "") : e.removeAttribute(i);
        break;
      case "capture":
      case "download":
        r === !0 ? e.setAttribute(i, "") : r !== !1 && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(i, r) : e.removeAttribute(i);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(i, r) : e.removeAttribute(i);
        break;
      case "rowSpan":
      case "start":
        r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(i) : e.setAttribute(i, r);
        break;
      case "popover":
        Ee("beforetoggle", e), Ee("toggle", e), br(e, "popover", r);
        break;
      case "xlinkActuate":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          r
        );
        break;
      case "xlinkArcrole":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          r
        );
        break;
      case "xlinkRole":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          r
        );
        break;
      case "xlinkShow":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          r
        );
        break;
      case "xlinkTitle":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          r
        );
        break;
      case "xlinkType":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          r
        );
        break;
      case "xmlBase":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          r
        );
        break;
      case "xmlLang":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          r
        );
        break;
      case "xmlSpace":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          r
        );
        break;
      case "is":
        br(e, "is", r);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < i.length) || i[0] !== "o" && i[0] !== "O" || i[1] !== "n" && i[1] !== "N") && (i = Sv.get(i) || i, br(e, i, r));
    }
  }
  function Wc(e, t, i, r, c, u) {
    switch (i) {
      case "style":
        Dd(e, r, u);
        break;
      case "dangerouslySetInnerHTML":
        if (r != null) {
          if (typeof r != "object" || !("__html" in r))
            throw Error(s(61));
          if (i = r.__html, i != null) {
            if (c.children != null) throw Error(s(60));
            e.innerHTML = i;
          }
        }
        break;
      case "children":
        typeof r == "string" ? yi(e, r) : (typeof r == "number" || typeof r == "bigint") && yi(e, "" + r);
        break;
      case "onScroll":
        r != null && Ee("scroll", e);
        break;
      case "onScrollEnd":
        r != null && Ee("scrollend", e);
        break;
      case "onClick":
        r != null && (e.onclick = jn);
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
        if (!kd.hasOwnProperty(i))
          e: {
            if (i[0] === "o" && i[1] === "n" && (c = i.endsWith("Capture"), t = i.slice(2, c ? i.length - 7 : void 0), u = e[jt] || null, u = u != null ? u[i] : null, typeof u == "function" && e.removeEventListener(t, u, c), typeof r == "function")) {
              typeof u != "function" && u !== null && (i in e ? e[i] = null : e.hasAttribute(i) && e.removeAttribute(i)), e.addEventListener(t, r, c);
              break e;
            }
            i in e ? e[i] = r : r === !0 ? e.setAttribute(i, "") : br(e, i, r);
          }
    }
  }
  function ht(e, t, i) {
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
        Ee("error", e), Ee("load", e);
        var r = !1, c = !1, u;
        for (u in i)
          if (i.hasOwnProperty(u)) {
            var g = i[u];
            if (g != null)
              switch (u) {
                case "src":
                  r = !0;
                  break;
                case "srcSet":
                  c = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(s(137, t));
                default:
                  Pe(e, t, u, g, i, null);
              }
          }
        c && Pe(e, t, "srcSet", i.srcSet, i, null), r && Pe(e, t, "src", i.src, i, null);
        return;
      case "input":
        Ee("invalid", e);
        var b = u = g = c = null, S = null, x = null;
        for (r in i)
          if (i.hasOwnProperty(r)) {
            var G = i[r];
            if (G != null)
              switch (r) {
                case "name":
                  c = G;
                  break;
                case "type":
                  g = G;
                  break;
                case "checked":
                  S = G;
                  break;
                case "defaultChecked":
                  x = G;
                  break;
                case "value":
                  u = G;
                  break;
                case "defaultValue":
                  b = G;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (G != null)
                    throw Error(s(137, t));
                  break;
                default:
                  Pe(e, t, r, G, i, null);
              }
          }
        xd(
          e,
          u,
          b,
          S,
          x,
          g,
          c,
          !1
        );
        return;
      case "select":
        Ee("invalid", e), r = g = u = null;
        for (c in i)
          if (i.hasOwnProperty(c) && (b = i[c], b != null))
            switch (c) {
              case "value":
                u = b;
                break;
              case "defaultValue":
                g = b;
                break;
              case "multiple":
                r = b;
              default:
                Pe(e, t, c, b, i, null);
            }
        t = u, i = g, e.multiple = !!r, t != null ? vi(e, !!r, t, !1) : i != null && vi(e, !!r, i, !0);
        return;
      case "textarea":
        Ee("invalid", e), u = c = r = null;
        for (g in i)
          if (i.hasOwnProperty(g) && (b = i[g], b != null))
            switch (g) {
              case "value":
                r = b;
                break;
              case "defaultValue":
                c = b;
                break;
              case "children":
                u = b;
                break;
              case "dangerouslySetInnerHTML":
                if (b != null) throw Error(s(91));
                break;
              default:
                Pe(e, t, g, b, i, null);
            }
        Od(e, r, c, u);
        return;
      case "option":
        for (S in i)
          i.hasOwnProperty(S) && (r = i[S], r != null) && (S === "selected" ? e.selected = r && typeof r != "function" && typeof r != "symbol" : Pe(e, t, S, r, i, null));
        return;
      case "dialog":
        Ee("beforetoggle", e), Ee("toggle", e), Ee("cancel", e), Ee("close", e);
        break;
      case "iframe":
      case "object":
        Ee("load", e);
        break;
      case "video":
      case "audio":
        for (r = 0; r < Zo.length; r++)
          Ee(Zo[r], e);
        break;
      case "image":
        Ee("error", e), Ee("load", e);
        break;
      case "details":
        Ee("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        Ee("error", e), Ee("load", e);
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
        for (x in i)
          if (i.hasOwnProperty(x) && (r = i[x], r != null))
            switch (x) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(s(137, t));
              default:
                Pe(e, t, x, r, i, null);
            }
        return;
      default:
        if (ul(t)) {
          for (G in i)
            i.hasOwnProperty(G) && (r = i[G], r !== void 0 && Wc(
              e,
              t,
              G,
              r,
              i,
              void 0
            ));
          return;
        }
    }
    for (b in i)
      i.hasOwnProperty(b) && (r = i[b], r != null && Pe(e, t, b, r, i, null));
  }
  function Fy(e, t, i, r) {
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
        var c = null, u = null, g = null, b = null, S = null, x = null, G = null;
        for (L in i) {
          var Z = i[L];
          if (i.hasOwnProperty(L) && Z != null)
            switch (L) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                S = Z;
              default:
                r.hasOwnProperty(L) || Pe(e, t, L, null, r, Z);
            }
        }
        for (var O in r) {
          var L = r[O];
          if (Z = i[O], r.hasOwnProperty(O) && (L != null || Z != null))
            switch (O) {
              case "type":
                u = L;
                break;
              case "name":
                c = L;
                break;
              case "checked":
                x = L;
                break;
              case "defaultChecked":
                G = L;
                break;
              case "value":
                g = L;
                break;
              case "defaultValue":
                b = L;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (L != null)
                  throw Error(s(137, t));
                break;
              default:
                L !== Z && Pe(
                  e,
                  t,
                  O,
                  L,
                  r,
                  Z
                );
            }
        }
        ll(
          e,
          g,
          b,
          S,
          x,
          G,
          u,
          c
        );
        return;
      case "select":
        L = g = b = O = null;
        for (u in i)
          if (S = i[u], i.hasOwnProperty(u) && S != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                L = S;
              default:
                r.hasOwnProperty(u) || Pe(
                  e,
                  t,
                  u,
                  null,
                  r,
                  S
                );
            }
        for (c in r)
          if (u = r[c], S = i[c], r.hasOwnProperty(c) && (u != null || S != null))
            switch (c) {
              case "value":
                O = u;
                break;
              case "defaultValue":
                b = u;
                break;
              case "multiple":
                g = u;
              default:
                u !== S && Pe(
                  e,
                  t,
                  c,
                  u,
                  r,
                  S
                );
            }
        t = b, i = g, r = L, O != null ? vi(e, !!i, O, !1) : !!r != !!i && (t != null ? vi(e, !!i, t, !0) : vi(e, !!i, i ? [] : "", !1));
        return;
      case "textarea":
        L = O = null;
        for (b in i)
          if (c = i[b], i.hasOwnProperty(b) && c != null && !r.hasOwnProperty(b))
            switch (b) {
              case "value":
                break;
              case "children":
                break;
              default:
                Pe(e, t, b, null, r, c);
            }
        for (g in r)
          if (c = r[g], u = i[g], r.hasOwnProperty(g) && (c != null || u != null))
            switch (g) {
              case "value":
                O = c;
                break;
              case "defaultValue":
                L = c;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(s(91));
                break;
              default:
                c !== u && Pe(e, t, g, c, r, u);
            }
        Md(e, O, L);
        return;
      case "option":
        for (var ee in i)
          O = i[ee], i.hasOwnProperty(ee) && O != null && !r.hasOwnProperty(ee) && (ee === "selected" ? e.selected = !1 : Pe(
            e,
            t,
            ee,
            null,
            r,
            O
          ));
        for (S in r)
          O = r[S], L = i[S], r.hasOwnProperty(S) && O !== L && (O != null || L != null) && (S === "selected" ? e.selected = O && typeof O != "function" && typeof O != "symbol" : Pe(
            e,
            t,
            S,
            O,
            r,
            L
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
        for (var ue in i)
          O = i[ue], i.hasOwnProperty(ue) && O != null && !r.hasOwnProperty(ue) && Pe(e, t, ue, null, r, O);
        for (x in r)
          if (O = r[x], L = i[x], r.hasOwnProperty(x) && O !== L && (O != null || L != null))
            switch (x) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(s(137, t));
                break;
              default:
                Pe(
                  e,
                  t,
                  x,
                  O,
                  r,
                  L
                );
            }
        return;
      default:
        if (ul(t)) {
          for (var Be in i)
            O = i[Be], i.hasOwnProperty(Be) && O !== void 0 && !r.hasOwnProperty(Be) && Wc(
              e,
              t,
              Be,
              void 0,
              r,
              O
            );
          for (G in r)
            O = r[G], L = i[G], !r.hasOwnProperty(G) || O === L || O === void 0 && L === void 0 || Wc(
              e,
              t,
              G,
              O,
              r,
              L
            );
          return;
        }
    }
    for (var A in i)
      O = i[A], i.hasOwnProperty(A) && O != null && !r.hasOwnProperty(A) && Pe(e, t, A, null, r, O);
    for (Z in r)
      O = r[Z], L = i[Z], !r.hasOwnProperty(Z) || O === L || O == null && L == null || Pe(e, t, Z, O, r, L);
  }
  function Lf(e) {
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
  function Wy() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, i = performance.getEntriesByType("resource"), r = 0; r < i.length; r++) {
        var c = i[r], u = c.transferSize, g = c.initiatorType, b = c.duration;
        if (u && b && Lf(g)) {
          for (g = 0, b = c.responseEnd, r += 1; r < i.length; r++) {
            var S = i[r], x = S.startTime;
            if (x > b) break;
            var G = S.transferSize, Z = S.initiatorType;
            G && Lf(Z) && (S = S.responseEnd, g += G * (S < b ? 1 : (b - x) / (S - x)));
          }
          if (--r, t += 8 * (u + g) / (c.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var $c = null, Qc = null;
  function vs(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Uf(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function qf(e, t) {
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
  function Jc(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var eu = null;
  function $y() {
    var e = window.event;
    return e && e.type === "popstate" ? e === eu ? !1 : (eu = e, !0) : (eu = null, !1);
  }
  var Gf = typeof setTimeout == "function" ? setTimeout : void 0, Qy = typeof clearTimeout == "function" ? clearTimeout : void 0, If = typeof Promise == "function" ? Promise : void 0, Jy = typeof queueMicrotask == "function" ? queueMicrotask : typeof If < "u" ? function(e) {
    return If.resolve(null).then(e).catch(eb);
  } : Gf;
  function eb(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function ba(e) {
    return e === "head";
  }
  function Hf(e, t) {
    var i = t, r = 0;
    do {
      var c = i.nextSibling;
      if (e.removeChild(i), c && c.nodeType === 8)
        if (i = c.data, i === "/$" || i === "/&") {
          if (r === 0) {
            e.removeChild(c), Wi(t);
            return;
          }
          r--;
        } else if (i === "$" || i === "$?" || i === "$~" || i === "$!" || i === "&")
          r++;
        else if (i === "html")
          Vo(e.ownerDocument.documentElement);
        else if (i === "head") {
          i = e.ownerDocument.head, Vo(i);
          for (var u = i.firstChild; u; ) {
            var g = u.nextSibling, b = u.nodeName;
            u[co] || b === "SCRIPT" || b === "STYLE" || b === "LINK" && u.rel.toLowerCase() === "stylesheet" || i.removeChild(u), u = g;
          }
        } else
          i === "body" && Vo(e.ownerDocument.body);
      i = c;
    } while (i);
    Wi(t);
  }
  function Pf(e, t) {
    var i = e;
    e = 0;
    do {
      var r = i.nextSibling;
      if (i.nodeType === 1 ? t ? (i._stashedDisplay = i.style.display, i.style.display = "none") : (i.style.display = i._stashedDisplay || "", i.getAttribute("style") === "" && i.removeAttribute("style")) : i.nodeType === 3 && (t ? (i._stashedText = i.nodeValue, i.nodeValue = "") : i.nodeValue = i._stashedText || ""), r && r.nodeType === 8)
        if (i = r.data, i === "/$") {
          if (e === 0) break;
          e--;
        } else
          i !== "$" && i !== "$?" && i !== "$~" && i !== "$!" || e++;
      i = r;
    } while (i);
  }
  function tu(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var i = t;
      switch (t = t.nextSibling, i.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          tu(i), rl(i);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (i.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(i);
    }
  }
  function tb(e, t, i, r) {
    for (; e.nodeType === 1; ) {
      var c = i;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (r) {
        if (!e[co])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== c.rel || e.getAttribute("href") !== (c.href == null || c.href === "" ? null : c.href) || e.getAttribute("crossorigin") !== (c.crossOrigin == null ? null : c.crossOrigin) || e.getAttribute("title") !== (c.title == null ? null : c.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (c.src == null ? null : c.src) || e.getAttribute("type") !== (c.type == null ? null : c.type) || e.getAttribute("crossorigin") !== (c.crossOrigin == null ? null : c.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = c.name == null ? null : "" + c.name;
        if (c.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = dn(e.nextSibling), e === null) break;
    }
    return null;
  }
  function nb(e, t, i) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !i || (e = dn(e.nextSibling), e === null)) return null;
    return e;
  }
  function Bf(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = dn(e.nextSibling), e === null)) return null;
    return e;
  }
  function nu(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function au(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function ab(e, t) {
    var i = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || i.readyState !== "loading")
      t();
    else {
      var r = function() {
        t(), i.removeEventListener("DOMContentLoaded", r);
      };
      i.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
    }
  }
  function dn(e) {
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
  var iu = null;
  function Zf(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var i = e.data;
        if (i === "/$" || i === "/&") {
          if (t === 0)
            return dn(e.nextSibling);
          t--;
        } else
          i !== "$" && i !== "$!" && i !== "$?" && i !== "$~" && i !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Yf(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var i = e.data;
        if (i === "$" || i === "$!" || i === "$?" || i === "$~" || i === "&") {
          if (t === 0) return e;
          t--;
        } else i !== "/$" && i !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Vf(e, t, i) {
    switch (t = vs(i), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(s(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(s(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(s(454));
        return e;
      default:
        throw Error(s(451));
    }
  }
  function Vo(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    rl(e);
  }
  var _n = /* @__PURE__ */ new Map(), Kf = /* @__PURE__ */ new Set();
  function ys(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var $n = K.d;
  K.d = {
    f: ib,
    r: ob,
    D: rb,
    C: sb,
    L: lb,
    m: cb,
    X: db,
    S: ub,
    M: _b
  };
  function ib() {
    var e = $n.f(), t = us();
    return e || t;
  }
  function ob(e) {
    var t = pi(e);
    t !== null && t.tag === 5 && t.type === "form" ? cm(t) : $n.r(e);
  }
  var Ki = typeof document > "u" ? null : document;
  function Xf(e, t, i) {
    var r = Ki;
    if (r && typeof t == "string" && t) {
      var c = an(t);
      c = 'link[rel="' + e + '"][href="' + c + '"]', typeof i == "string" && (c += '[crossorigin="' + i + '"]'), Kf.has(c) || (Kf.add(c), e = { rel: e, crossOrigin: i, href: t }, r.querySelector(c) === null && (t = r.createElement("link"), ht(t, "link", e), dt(t), r.head.appendChild(t)));
    }
  }
  function rb(e) {
    $n.D(e), Xf("dns-prefetch", e, null);
  }
  function sb(e, t) {
    $n.C(e, t), Xf("preconnect", e, t);
  }
  function lb(e, t, i) {
    $n.L(e, t, i);
    var r = Ki;
    if (r && e && t) {
      var c = 'link[rel="preload"][as="' + an(t) + '"]';
      t === "image" && i && i.imageSrcSet ? (c += '[imagesrcset="' + an(
        i.imageSrcSet
      ) + '"]', typeof i.imageSizes == "string" && (c += '[imagesizes="' + an(
        i.imageSizes
      ) + '"]')) : c += '[href="' + an(e) + '"]';
      var u = c;
      switch (t) {
        case "style":
          u = Xi(e);
          break;
        case "script":
          u = Fi(e);
      }
      _n.has(u) || (e = y(
        {
          rel: "preload",
          href: t === "image" && i && i.imageSrcSet ? void 0 : e,
          as: t
        },
        i
      ), _n.set(u, e), r.querySelector(c) !== null || t === "style" && r.querySelector(Ko(u)) || t === "script" && r.querySelector(Xo(u)) || (t = r.createElement("link"), ht(t, "link", e), dt(t), r.head.appendChild(t)));
    }
  }
  function cb(e, t) {
    $n.m(e, t);
    var i = Ki;
    if (i && e) {
      var r = t && typeof t.as == "string" ? t.as : "script", c = 'link[rel="modulepreload"][as="' + an(r) + '"][href="' + an(e) + '"]', u = c;
      switch (r) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Fi(e);
      }
      if (!_n.has(u) && (e = y({ rel: "modulepreload", href: e }, t), _n.set(u, e), i.querySelector(c) === null)) {
        switch (r) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (i.querySelector(Xo(u)))
              return;
        }
        r = i.createElement("link"), ht(r, "link", e), dt(r), i.head.appendChild(r);
      }
    }
  }
  function ub(e, t, i) {
    $n.S(e, t, i);
    var r = Ki;
    if (r && e) {
      var c = gi(r).hoistableStyles, u = Xi(e);
      t = t || "default";
      var g = c.get(u);
      if (!g) {
        var b = { loading: 0, preload: null };
        if (g = r.querySelector(
          Ko(u)
        ))
          b.loading = 5;
        else {
          e = y(
            { rel: "stylesheet", href: e, "data-precedence": t },
            i
          ), (i = _n.get(u)) && ou(e, i);
          var S = g = r.createElement("link");
          dt(S), ht(S, "link", e), S._p = new Promise(function(x, G) {
            S.onload = x, S.onerror = G;
          }), S.addEventListener("load", function() {
            b.loading |= 1;
          }), S.addEventListener("error", function() {
            b.loading |= 2;
          }), b.loading |= 4, bs(g, t, r);
        }
        g = {
          type: "stylesheet",
          instance: g,
          count: 1,
          state: b
        }, c.set(u, g);
      }
    }
  }
  function db(e, t) {
    $n.X(e, t);
    var i = Ki;
    if (i && e) {
      var r = gi(i).hoistableScripts, c = Fi(e), u = r.get(c);
      u || (u = i.querySelector(Xo(c)), u || (e = y({ src: e, async: !0 }, t), (t = _n.get(c)) && ru(e, t), u = i.createElement("script"), dt(u), ht(u, "link", e), i.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, r.set(c, u));
    }
  }
  function _b(e, t) {
    $n.M(e, t);
    var i = Ki;
    if (i && e) {
      var r = gi(i).hoistableScripts, c = Fi(e), u = r.get(c);
      u || (u = i.querySelector(Xo(c)), u || (e = y({ src: e, async: !0, type: "module" }, t), (t = _n.get(c)) && ru(e, t), u = i.createElement("script"), dt(u), ht(u, "link", e), i.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, r.set(c, u));
    }
  }
  function Ff(e, t, i, r) {
    var c = (c = le.current) ? ys(c) : null;
    if (!c) throw Error(s(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof i.precedence == "string" && typeof i.href == "string" ? (t = Xi(i.href), i = gi(
          c
        ).hoistableStyles, r = i.get(t), r || (r = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, i.set(t, r)), r) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (i.rel === "stylesheet" && typeof i.href == "string" && typeof i.precedence == "string") {
          e = Xi(i.href);
          var u = gi(
            c
          ).hoistableStyles, g = u.get(e);
          if (g || (c = c.ownerDocument || c, g = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, g), (u = c.querySelector(
            Ko(e)
          )) && !u._p && (g.instance = u, g.state.loading = 5), _n.has(e) || (i = {
            rel: "preload",
            as: "style",
            href: i.href,
            crossOrigin: i.crossOrigin,
            integrity: i.integrity,
            media: i.media,
            hrefLang: i.hrefLang,
            referrerPolicy: i.referrerPolicy
          }, _n.set(e, i), u || mb(
            c,
            e,
            i,
            g.state
          ))), t && r === null)
            throw Error(s(528, ""));
          return g;
        }
        if (t && r !== null)
          throw Error(s(529, ""));
        return null;
      case "script":
        return t = i.async, i = i.src, typeof i == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Fi(i), i = gi(
          c
        ).hoistableScripts, r = i.get(t), r || (r = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, i.set(t, r)), r) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(s(444, e));
    }
  }
  function Xi(e) {
    return 'href="' + an(e) + '"';
  }
  function Ko(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Wf(e) {
    return y({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function mb(e, t, i, r) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
      return r.loading |= 1;
    }), t.addEventListener("error", function() {
      return r.loading |= 2;
    }), ht(t, "link", i), dt(t), e.head.appendChild(t));
  }
  function Fi(e) {
    return '[src="' + an(e) + '"]';
  }
  function Xo(e) {
    return "script[async]" + e;
  }
  function $f(e, t, i) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var r = e.querySelector(
            'style[data-href~="' + an(i.href) + '"]'
          );
          if (r)
            return t.instance = r, dt(r), r;
          var c = y({}, i, {
            "data-href": i.href,
            "data-precedence": i.precedence,
            href: null,
            precedence: null
          });
          return r = (e.ownerDocument || e).createElement(
            "style"
          ), dt(r), ht(r, "style", c), bs(r, i.precedence, e), t.instance = r;
        case "stylesheet":
          c = Xi(i.href);
          var u = e.querySelector(
            Ko(c)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, dt(u), u;
          r = Wf(i), (c = _n.get(c)) && ou(r, c), u = (e.ownerDocument || e).createElement("link"), dt(u);
          var g = u;
          return g._p = new Promise(function(b, S) {
            g.onload = b, g.onerror = S;
          }), ht(u, "link", r), t.state.loading |= 4, bs(u, i.precedence, e), t.instance = u;
        case "script":
          return u = Fi(i.src), (c = e.querySelector(
            Xo(u)
          )) ? (t.instance = c, dt(c), c) : (r = i, (c = _n.get(u)) && (r = y({}, i), ru(r, c)), e = e.ownerDocument || e, c = e.createElement("script"), dt(c), ht(c, "link", r), e.head.appendChild(c), t.instance = c);
        case "void":
          return null;
        default:
          throw Error(s(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (r = t.instance, t.state.loading |= 4, bs(r, i.precedence, e));
    return t.instance;
  }
  function bs(e, t, i) {
    for (var r = i.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), c = r.length ? r[r.length - 1] : null, u = c, g = 0; g < r.length; g++) {
      var b = r[g];
      if (b.dataset.precedence === t) u = b;
      else if (u !== c) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = i.nodeType === 9 ? i.head : i, t.insertBefore(e, t.firstChild));
  }
  function ou(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function ru(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var ws = null;
  function Qf(e, t, i) {
    if (ws === null) {
      var r = /* @__PURE__ */ new Map(), c = ws = /* @__PURE__ */ new Map();
      c.set(i, r);
    } else
      c = ws, r = c.get(i), r || (r = /* @__PURE__ */ new Map(), c.set(i, r));
    if (r.has(e)) return r;
    for (r.set(e, null), i = i.getElementsByTagName(e), c = 0; c < i.length; c++) {
      var u = i[c];
      if (!(u[co] || u[mt] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var g = u.getAttribute(t) || "";
        g = e + g;
        var b = r.get(g);
        b ? b.push(u) : r.set(g, [u]);
      }
    }
    return r;
  }
  function Jf(e, t, i) {
    e = e.ownerDocument || e, e.head.insertBefore(
      i,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function fb(e, t, i) {
    if (i === 1 || t.itemProp != null) return !1;
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
  function ep(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function pb(e, t, i, r) {
    if (i.type === "stylesheet" && (typeof r.media != "string" || matchMedia(r.media).matches !== !1) && (i.state.loading & 4) === 0) {
      if (i.instance === null) {
        var c = Xi(r.href), u = t.querySelector(
          Ko(c)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Ss.bind(e), t.then(e, e)), i.state.loading |= 4, i.instance = u, dt(u);
          return;
        }
        u = t.ownerDocument || t, r = Wf(r), (c = _n.get(c)) && ou(r, c), u = u.createElement("link"), dt(u);
        var g = u;
        g._p = new Promise(function(b, S) {
          g.onload = b, g.onerror = S;
        }), ht(u, "link", r), i.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(i, t), (t = i.state.preload) && (i.state.loading & 3) === 0 && (e.count++, i = Ss.bind(e), t.addEventListener("load", i), t.addEventListener("error", i));
    }
  }
  var su = 0;
  function gb(e, t) {
    return e.stylesheets && e.count === 0 && zs(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(i) {
      var r = setTimeout(function() {
        if (e.stylesheets && zs(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && su === 0 && (su = 62500 * Wy());
      var c = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && zs(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > su ? 50 : 800) + t
      );
      return e.unsuspend = i, function() {
        e.unsuspend = null, clearTimeout(r), clearTimeout(c);
      };
    } : null;
  }
  function Ss() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) zs(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Es = null;
  function zs(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Es = /* @__PURE__ */ new Map(), t.forEach(hb, e), Es = null, Ss.call(e));
  }
  function hb(e, t) {
    if (!(t.state.loading & 4)) {
      var i = Es.get(e);
      if (i) var r = i.get(null);
      else {
        i = /* @__PURE__ */ new Map(), Es.set(e, i);
        for (var c = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < c.length; u++) {
          var g = c[u];
          (g.nodeName === "LINK" || g.getAttribute("media") !== "not all") && (i.set(g.dataset.precedence, g), r = g);
        }
        r && i.set(null, r);
      }
      c = t.instance, g = c.getAttribute("data-precedence"), u = i.get(g) || r, u === r && i.set(null, c), i.set(g, c), this.count++, r = Ss.bind(this), c.addEventListener("load", r), c.addEventListener("error", r), u ? u.parentNode.insertBefore(c, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(c, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Fo = {
    $$typeof: Y,
    Provider: null,
    Consumer: null,
    _currentValue: Q,
    _currentValue2: Q,
    _threadCount: 0
  };
  function vb(e, t, i, r, c, u, g, b, S) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = nl(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = nl(0), this.hiddenUpdates = nl(null), this.identifierPrefix = r, this.onUncaughtError = c, this.onCaughtError = u, this.onRecoverableError = g, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = S, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function tp(e, t, i, r, c, u, g, b, S, x, G, Z) {
    return e = new vb(
      e,
      t,
      i,
      g,
      S,
      x,
      G,
      Z,
      b
    ), t = 1, u === !0 && (t |= 24), u = Xt(3, null, null, t), e.current = u, u.stateNode = e, t = Il(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: r,
      isDehydrated: i,
      cache: t
    }, Zl(u), e;
  }
  function np(e) {
    return e ? (e = Ti, e) : Ti;
  }
  function ap(e, t, i, r, c, u) {
    c = np(c), r.context === null ? r.context = c : r.pendingContext = c, r = ca(t), r.payload = { element: i }, u = u === void 0 ? null : u, u !== null && (r.callback = u), i = ua(e, r, t), i !== null && (Ht(i, e, t), Ao(i, e, t));
  }
  function ip(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var i = e.retryLane;
      e.retryLane = i !== 0 && i < t ? i : t;
    }
  }
  function lu(e, t) {
    ip(e, t), (e = e.alternate) && ip(e, t);
  }
  function op(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ya(e, 67108864);
      t !== null && Ht(t, e, 67108864), lu(e, 67108864);
    }
  }
  function rp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Jt();
      t = al(t);
      var i = Ya(e, t);
      i !== null && Ht(i, e, t), lu(e, t);
    }
  }
  var ks = !0;
  function yb(e, t, i, r) {
    var c = M.T;
    M.T = null;
    var u = K.p;
    try {
      K.p = 2, cu(e, t, i, r);
    } finally {
      K.p = u, M.T = c;
    }
  }
  function bb(e, t, i, r) {
    var c = M.T;
    M.T = null;
    var u = K.p;
    try {
      K.p = 8, cu(e, t, i, r);
    } finally {
      K.p = u, M.T = c;
    }
  }
  function cu(e, t, i, r) {
    if (ks) {
      var c = uu(r);
      if (c === null)
        Fc(
          e,
          t,
          r,
          Ts,
          i
        ), lp(e, r);
      else if (Sb(
        c,
        e,
        t,
        i,
        r
      ))
        r.stopPropagation();
      else if (lp(e, r), t & 4 && -1 < wb.indexOf(e)) {
        for (; c !== null; ) {
          var u = pi(c);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var g = Ia(u.pendingLanes);
                  if (g !== 0) {
                    var b = u;
                    for (b.pendingLanes |= 2, b.entangledLanes |= 2; g; ) {
                      var S = 1 << 31 - Vt(g);
                      b.entanglements[1] |= S, g &= ~S;
                    }
                    xn(u), (De & 6) === 0 && (ls = Nt() + 500, Bo(0));
                  }
                }
                break;
              case 31:
              case 13:
                b = Ya(u, 2), b !== null && Ht(b, u, 2), us(), lu(u, 2);
            }
          if (u = uu(r), u === null && Fc(
            e,
            t,
            r,
            Ts,
            i
          ), u === c) break;
          c = u;
        }
        c !== null && r.stopPropagation();
      } else
        Fc(
          e,
          t,
          r,
          null,
          i
        );
    }
  }
  function uu(e) {
    return e = _l(e), du(e);
  }
  var Ts = null;
  function du(e) {
    if (Ts = null, e = fi(e), e !== null) {
      var t = d(e);
      if (t === null) e = null;
      else {
        var i = t.tag;
        if (i === 13) {
          if (e = _(t), e !== null) return e;
          e = null;
        } else if (i === 31) {
          if (e = m(t), e !== null) return e;
          e = null;
        } else if (i === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Ts = e, null;
  }
  function sp(e) {
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
        switch (rv()) {
          case fd:
            return 2;
          case pd:
            return 8;
          case pr:
          case sv:
            return 32;
          case gd:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var _u = !1, wa = null, Sa = null, Ea = null, Wo = /* @__PURE__ */ new Map(), $o = /* @__PURE__ */ new Map(), za = [], wb = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function lp(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        wa = null;
        break;
      case "dragenter":
      case "dragleave":
        Sa = null;
        break;
      case "mouseover":
      case "mouseout":
        Ea = null;
        break;
      case "pointerover":
      case "pointerout":
        Wo.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        $o.delete(t.pointerId);
    }
  }
  function Qo(e, t, i, r, c, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: i,
      eventSystemFlags: r,
      nativeEvent: u,
      targetContainers: [c]
    }, t !== null && (t = pi(t), t !== null && op(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, c !== null && t.indexOf(c) === -1 && t.push(c), e);
  }
  function Sb(e, t, i, r, c) {
    switch (t) {
      case "focusin":
        return wa = Qo(
          wa,
          e,
          t,
          i,
          r,
          c
        ), !0;
      case "dragenter":
        return Sa = Qo(
          Sa,
          e,
          t,
          i,
          r,
          c
        ), !0;
      case "mouseover":
        return Ea = Qo(
          Ea,
          e,
          t,
          i,
          r,
          c
        ), !0;
      case "pointerover":
        var u = c.pointerId;
        return Wo.set(
          u,
          Qo(
            Wo.get(u) || null,
            e,
            t,
            i,
            r,
            c
          )
        ), !0;
      case "gotpointercapture":
        return u = c.pointerId, $o.set(
          u,
          Qo(
            $o.get(u) || null,
            e,
            t,
            i,
            r,
            c
          )
        ), !0;
    }
    return !1;
  }
  function cp(e) {
    var t = fi(e.target);
    if (t !== null) {
      var i = d(t);
      if (i !== null) {
        if (t = i.tag, t === 13) {
          if (t = _(i), t !== null) {
            e.blockedOn = t, Sd(e.priority, function() {
              rp(i);
            });
            return;
          }
        } else if (t === 31) {
          if (t = m(i), t !== null) {
            e.blockedOn = t, Sd(e.priority, function() {
              rp(i);
            });
            return;
          }
        } else if (t === 3 && i.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = i.tag === 3 ? i.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function As(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var i = uu(e.nativeEvent);
      if (i === null) {
        i = e.nativeEvent;
        var r = new i.constructor(
          i.type,
          i
        );
        dl = r, i.target.dispatchEvent(r), dl = null;
      } else
        return t = pi(i), t !== null && op(t), e.blockedOn = i, !1;
      t.shift();
    }
    return !0;
  }
  function up(e, t, i) {
    As(e) && i.delete(t);
  }
  function Eb() {
    _u = !1, wa !== null && As(wa) && (wa = null), Sa !== null && As(Sa) && (Sa = null), Ea !== null && As(Ea) && (Ea = null), Wo.forEach(up), $o.forEach(up);
  }
  function Ns(e, t) {
    e.blockedOn === t && (e.blockedOn = null, _u || (_u = !0, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      Eb
    )));
  }
  var Cs = null;
  function dp(e) {
    Cs !== e && (Cs = e, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      function() {
        Cs === e && (Cs = null);
        for (var t = 0; t < e.length; t += 3) {
          var i = e[t], r = e[t + 1], c = e[t + 2];
          if (typeof r != "function") {
            if (du(r || i) === null)
              continue;
            break;
          }
          var u = pi(i);
          u !== null && (e.splice(t, 3), t -= 3, uc(
            u,
            {
              pending: !0,
              data: c,
              method: i.method,
              action: r
            },
            r,
            c
          ));
        }
      }
    ));
  }
  function Wi(e) {
    function t(S) {
      return Ns(S, e);
    }
    wa !== null && Ns(wa, e), Sa !== null && Ns(Sa, e), Ea !== null && Ns(Ea, e), Wo.forEach(t), $o.forEach(t);
    for (var i = 0; i < za.length; i++) {
      var r = za[i];
      r.blockedOn === e && (r.blockedOn = null);
    }
    for (; 0 < za.length && (i = za[0], i.blockedOn === null); )
      cp(i), i.blockedOn === null && za.shift();
    if (i = (e.ownerDocument || e).$$reactFormReplay, i != null)
      for (r = 0; r < i.length; r += 3) {
        var c = i[r], u = i[r + 1], g = c[jt] || null;
        if (typeof u == "function")
          g || dp(i);
        else if (g) {
          var b = null;
          if (u && u.hasAttribute("formAction")) {
            if (c = u, g = u[jt] || null)
              b = g.formAction;
            else if (du(c) !== null) continue;
          } else b = g.action;
          typeof b == "function" ? i[r + 1] = b : (i.splice(r, 3), r -= 3), dp(i);
        }
      }
  }
  function _p() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(g) {
            return c = g;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      c !== null && (c(), c = null), r || setTimeout(i, 20);
    }
    function i() {
      if (!r && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var r = !1, c = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(i, 100), function() {
        r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), c !== null && (c(), c = null);
      };
    }
  }
  function mu(e) {
    this._internalRoot = e;
  }
  xs.prototype.render = mu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    var i = t.current, r = Jt();
    ap(i, r, e, t, null, null);
  }, xs.prototype.unmount = mu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      ap(e.current, 2, null, e, null, null), us(), t[mi] = null;
    }
  };
  function xs(e) {
    this._internalRoot = e;
  }
  xs.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = wd();
      e = { blockedOn: null, target: e, priority: t };
      for (var i = 0; i < za.length && t !== 0 && t < za[i].priority; i++) ;
      za.splice(i, 0, e), i === 0 && cp(e);
    }
  };
  var mp = a.version;
  if (mp !== "19.2.3")
    throw Error(
      s(
        527,
        mp,
        "19.2.3"
      )
    );
  K.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = f(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var zb = {
    bundleType: 0,
    version: "19.2.3",
    rendererPackageName: "react-dom",
    currentDispatcherRef: M,
    reconcilerVersion: "19.2.3"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ms = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ms.isDisabled && Ms.supportsFiber)
      try {
        ro = Ms.inject(
          zb
        ), Yt = Ms;
      } catch {
      }
  }
  return er.createRoot = function(e, t) {
    if (!l(e)) throw Error(s(299));
    var i = !1, r = "", c = ym, u = bm, g = wm;
    return t != null && (t.unstable_strictMode === !0 && (i = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (c = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (g = t.onRecoverableError)), t = tp(
      e,
      1,
      !1,
      null,
      null,
      i,
      r,
      null,
      c,
      u,
      g,
      _p
    ), e[mi] = t.current, Xc(e), new mu(t);
  }, er.hydrateRoot = function(e, t, i) {
    if (!l(e)) throw Error(s(299));
    var r = !1, c = "", u = ym, g = bm, b = wm, S = null;
    return i != null && (i.unstable_strictMode === !0 && (r = !0), i.identifierPrefix !== void 0 && (c = i.identifierPrefix), i.onUncaughtError !== void 0 && (u = i.onUncaughtError), i.onCaughtError !== void 0 && (g = i.onCaughtError), i.onRecoverableError !== void 0 && (b = i.onRecoverableError), i.formState !== void 0 && (S = i.formState)), t = tp(
      e,
      1,
      !0,
      t,
      i ?? null,
      r,
      c,
      S,
      u,
      g,
      b,
      _p
    ), t.context = np(null), i = t.current, r = Jt(), r = al(r), c = ca(r), c.callback = null, ua(i, c, r), i = r, t.current.lanes = i, lo(t, i), xn(t), e[mi] = t.current, Xc(e), new xs(t);
  }, er.version = "19.2.3", er;
}
var Ep;
function Db() {
  if (Ep) return gu.exports;
  Ep = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (a) {
        console.error(a);
      }
  }
  return n(), gu.exports = Rb(), gu.exports;
}
var jb = Db();
const Lb = /* @__PURE__ */ Ag(jb);
const Ng = (...n) => n.filter((a, o, s) => !!a && a.trim() !== "" && s.indexOf(a) === o).join(" ").trim();
const Ub = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const qb = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (a, o, s) => s ? s.toUpperCase() : o.toLowerCase()
);
const zp = (n) => {
  const a = qb(n);
  return a.charAt(0).toUpperCase() + a.slice(1);
};
var Gb = {
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
const Ib = (n) => {
  for (const a in n)
    if (a.startsWith("aria-") || a === "role" || a === "title")
      return !0;
  return !1;
};
const Hb = D.forwardRef(
  ({
    color: n = "currentColor",
    size: a = 24,
    strokeWidth: o = 2,
    absoluteStrokeWidth: s,
    className: l = "",
    children: d,
    iconNode: _,
    ...m
  }, p) => D.createElement(
    "svg",
    {
      ref: p,
      ...Gb,
      width: a,
      height: a,
      stroke: n,
      strokeWidth: s ? Number(o) * 24 / Number(a) : o,
      className: Ng("lucide", l),
      ...!d && !Ib(m) && { "aria-hidden": "true" },
      ...m
    },
    [
      ..._.map(([f, v]) => D.createElement(f, v)),
      ...Array.isArray(d) ? d : [d]
    ]
  )
);
const de = (n, a) => {
  const o = D.forwardRef(
    ({ className: s, ...l }, d) => D.createElement(Hb, {
      ref: d,
      iconNode: a,
      className: Ng(
        `lucide-${Ub(zp(n))}`,
        `lucide-${n}`,
        s
      ),
      ...l
    })
  );
  return o.displayName = zp(n), o;
};
const Pb = [
  [
    "path",
    {
      d: "M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
      key: "67vhrh"
    }
  ],
  ["path", { d: "M4 9v6", key: "bns7oa" }]
], Bb = de("arrow-big-right-dash", Pb);
const Zb = [
  ["path", { d: "m11 7-3 5h4l-3 5", key: "b4a64w" }],
  ["path", { d: "M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935", key: "lre1cr" }],
  ["path", { d: "M22 14v-4", key: "14q9d5" }],
  ["path", { d: "M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936", key: "13q5k0" }]
];
de("battery-charging", Zb);
const Yb = [
  ["path", { d: "M10 10v4", key: "1mb2ec" }],
  ["path", { d: "M14 10v4", key: "1nt88p" }],
  ["path", { d: "M22 14v-4", key: "14q9d5" }],
  ["path", { d: "M6 10v4", key: "1n77qd" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
], Vb = de("battery-full", Yb);
const Kb = [
  ["path", { d: "M22 14v-4", key: "14q9d5" }],
  ["path", { d: "M6 14v-4", key: "14a6bd" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
], Xb = de("battery-low", Kb);
const Fb = [
  ["path", { d: "M10 14v-4", key: "suye4c" }],
  ["path", { d: "M22 14v-4", key: "14q9d5" }],
  ["path", { d: "M6 14v-4", key: "14a6bd" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
], Wb = de("battery-medium", Fb);
const $b = [
  ["path", { d: "M 22 14 L 22 10", key: "nqc4tb" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
], Qb = de("battery", $b);
const Jb = [
  [
    "path",
    {
      d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
      key: "oz39mx"
    }
  ]
], e0 = de("bookmark", Jb);
const t0 = [
  ["path", { d: "M12 18V5", key: "adv99a" }],
  ["path", { d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4", key: "1e3is1" }],
  ["path", { d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5", key: "1gqd8o" }],
  ["path", { d: "M17.997 5.125a4 4 0 0 1 2.526 5.77", key: "iwvgf7" }],
  ["path", { d: "M18 18a4 4 0 0 0 2-7.464", key: "efp6ie" }],
  ["path", { d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517", key: "1gq6am" }],
  ["path", { d: "M6 18a4 4 0 0 1-2-7.464", key: "k1g0md" }],
  ["path", { d: "M6.003 5.125a4 4 0 0 0-2.526 5.77", key: "q97ue3" }]
], n0 = de("brain", t0);
const a0 = [
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
], Hu = de("brush-cleaning", a0);
const i0 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Cg = de("check", i0);
const o0 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], xg = de("chevron-down", o0);
const r0 = [
  [
    "path",
    {
      d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
      key: "kmsa83"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
], s0 = de("circle-play", r0);
const l0 = [
  ["path", { d: "m15 10 5 5-5 5", key: "qqa56n" }],
  ["path", { d: "M4 4v7a4 4 0 0 0 4 4h12", key: "z08zvw" }]
], c0 = de("corner-down-right", l0);
const u0 = [
  ["path", { d: "M2 8h20", key: "d11cs7" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "M6 16h12", key: "u522kt" }]
], d0 = de("dock", u0);
const _0 = [
  [
    "path",
    {
      d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
      key: "c7niix"
    }
  ]
], Xs = de("droplet", _0);
const m0 = [
  [
    "path",
    {
      d: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z",
      key: "1dudjm"
    }
  ],
  [
    "path",
    {
      d: "M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z",
      key: "l2t8xc"
    }
  ],
  ["path", { d: "M16 17h4", key: "1dejxt" }],
  ["path", { d: "M4 13h4", key: "1bwh8b" }]
], f0 = de("footprints", m0);
const p0 = [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
], Gs = de("gauge", p0);
const g0 = [
  [
    "path",
    {
      d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
      key: "11za1p"
    }
  ],
  ["path", { d: "m16 19 2 2 4-4", key: "1b14m6" }]
], h0 = de("grid-2x2-check", g0);
const v0 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], y0 = de("history", v0);
const b0 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
], w0 = de("info", b0);
const S0 = [
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
], E0 = de("layers", S0);
const z0 = [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }]
], k0 = de("list", z0);
const T0 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
], A0 = de("lock-open", T0);
const N0 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
], C0 = de("lock", N0);
const x0 = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
], Pu = de("map", x0);
const M0 = [["path", { d: "M5 12h14", key: "1ays0h" }]], O0 = de("minus", M0);
const R0 = [
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
      key: "2d38gg"
    }
  ],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
], D0 = de("octagon-x", R0);
const j0 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "m15 8-3 3-3-3", key: "1oxy1z" }]
], L0 = de("panel-bottom-close", j0);
const U0 = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
], q0 = de("pause", U0);
const G0 = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
], I0 = de("play", G0);
const H0 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Mg = de("plus", H0);
const P0 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
], B0 = de("rotate-ccw", P0);
const Z0 = [
  ["circle", { cx: "6", cy: "19", r: "3", key: "1kj8tv" }],
  ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15", key: "1d8sl" }],
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }]
], Y0 = de("route", Z0);
const V0 = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }]
], Og = de("scan", V0);
const K0 = [
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["path", { d: "M19 7h-9", key: "6i9tg" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
], X0 = de("settings-2", K0);
const F0 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], W0 = de("settings", F0);
const $0 = [
  [
    "path",
    {
      d: "M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44",
      key: "1cn552"
    }
  ]
], Q0 = de("shell", $0);
const J0 = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }],
  ["path", { d: "M17 20V8", key: "1tkaf5" }]
], ew = de("signal-high", J0);
const tw = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }]
], nw = de("signal-low", tw);
const aw = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }]
], iw = de("signal-medium", aw);
const ow = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }],
  ["path", { d: "M17 20V8", key: "1tkaf5" }],
  ["path", { d: "M22 4v16", key: "sih9yq" }]
], rw = de("signal", ow);
const sw = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
], lw = de("sliders-horizontal", sw);
const cw = [
  [
    "path",
    {
      d: "M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "1ystz2"
    }
  ],
  ["path", { d: "M3 4v16", key: "1ph11n" }]
], uw = de("step-forward", cw);
const dw = [
  ["path", { d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z", key: "17jzev" }]
], Cu = de("thermometer", dw);
const _w = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
], mw = de("timer", _w);
const fw = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
], pw = de("volume-2", fw);
const gw = [
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
], hw = de("waves-arrow-down", gw);
const vw = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
], yw = de("zap", vw), Te = {
  STATE: { key: "state" },
  MAIN_BRUSH_LEFT: { key: "main_brush_left" },
  MAIN_BRUSH_TIME_LEFT: {
    key: "main_brush_time_left"
  },
  SIDE_BRUSH_LEFT: { key: "side_brush_left" },
  SIDE_BRUSH_TIME_LEFT: {
    key: "side_brush_time_left"
  },
  FILTER_LEFT: { key: "filter_left" },
  FILTER_TIME_LEFT: { key: "filter_time_left" },
  SENSOR_DIRTY_LEFT: { key: "sensor_dirty_left" },
  SENSOR_DIRTY_TIME_LEFT: {
    key: "sensor_dirty_time_left"
  },
  TANK_FILTER_LEFT: { key: "tank_filter_left" },
  TANK_FILTER_TIME_LEFT: {
    key: "tank_filter_time_left"
  },
  MOP_PAD_LEFT: { key: "mop_pad_left" },
  MOP_PAD_TIME_LEFT: { key: "mop_pad_time_left" },
  SILVER_ION_LEFT: { key: "silver_ion_left" },
  SILVER_ION_TIME_LEFT: {
    key: "silver_ion_time_left"
  },
  DETERGENT_LEFT: { key: "detergent_left" },
  DETERGENT_TIME_LEFT: {
    key: "detergent_time_left"
  },
  SQUEEGEE_LEFT: { key: "squeegee_left" },
  SQUEEGEE_TIME_LEFT: { key: "squeegee_time_left" },
  ONBOARD_DIRTY_WATER_TANK_LEFT: {
    key: "onboard_dirty_water_tank_left"
  },
  ONBOARD_DIRTY_WATER_TANK_TIME_LEFT: {
    key: "onboard_dirty_water_tank_time_left"
  },
  DIRTY_WATER_CHANNEL_DIRTY_LEFT: {
    key: "dirty_water_channel_dirty_left"
  },
  DIRTY_WATER_CHANNEL_DIRTY_TIME_LEFT: {
    key: "dirty_water_channel_dirty_time_left"
  },
  DEODORIZER_LEFT: { key: "deodorizer_left" },
  DEODORIZER_TIME_LEFT: { key: "deodorizer_time_left" },
  WHEEL_DIRTY_LEFT: { key: "wheel_dirty_left" },
  WHEEL_DIRTY_TIME_LEFT: { key: "wheel_dirty_time_left" },
  SCALE_INHIBITOR_LEFT: { key: "scale_inhibitor_left" },
  SCALE_INHIBITOR_TIME_LEFT: {
    key: "scale_inhibitor_time_left"
  },
  FLUFFING_ROLLER_DIRTY_LEFT: {
    key: "fluffing_roller_dirty_left"
  },
  FLUFFING_ROLLER_DIRTY_TIME_LEFT: {
    key: "fluffing_roller_dirty_time_left"
  },
  ROLLER_MOP_FILTER_DIRTY_LEFT: {
    key: "roller_mop_filter_dirty_left"
  },
  ROLLER_MOP_FILTER_DIRTY_TIME_LEFT: {
    key: "roller_mop_filter_dirty_time_left"
  },
  WATER_OUTLET_FILTER_DIRTY_LEFT: {
    key: "water_outlet_filter_dirty_left"
  },
  WATER_OUTLET_FILTER_DIRTY_TIME_LEFT: {
    key: "water_outlet_filter_dirty_time_left"
  }
}, Bu = {
  RESUME_CLEANING: { key: "resume_cleaning", platform: "switch" },
  CARPET_BOOST: { key: "carpet_boost", platform: "switch", category: "config" },
  OBSTACLE_AVOIDANCE: { key: "obstacle_avoidance", platform: "switch", category: "config" },
  CUSTOMIZED_CLEANING: { key: "customized_cleaning", platform: "switch", icon: "mdi:home-search" },
  CHILD_LOCK: { key: "child_lock", platform: "switch", category: "config" },
  TIGHT_MOPPING: { key: "tight_mopping", platform: "switch", icon: "mdi:heating-coil", category: "config" },
  DND: { key: "dnd", platform: "switch", category: "config", name: "DnD" },
  DND_DISABLE_RESUME_CLEANING: {
    key: "dnd_disable_resume_cleaning",
    platform: "switch",
    icon: "mdi:pause-box",
    category: "config"
  },
  DND_DISABLE_AUTO_EMPTY: {
    key: "dnd_disable_auto_empty",
    platform: "switch",
    icon: "mdi:delete-off",
    category: "config"
  },
  DND_REDUCE_VOLUME: { key: "dnd_reduce_volume", platform: "switch", icon: "mdi:volume-minus", category: "config" },
  MULTI_FLOOR_MAP: { key: "multi_floor_map", platform: "switch", category: "config" },
  AUTO_DUST_COLLECTING: { key: "auto_dust_collecting", platform: "switch" },
  CARPET_RECOGNITION: { key: "carpet_recognition", platform: "switch", icon: "mdi:rug", category: "config" },
  SELF_CLEAN: { key: "self_clean", platform: "switch" },
  WATER_ELECTROLYSIS: { key: "water_electrolysis", platform: "switch", category: "config" },
  AUTO_WATER_REFILLING: { key: "auto_water_refilling", platform: "switch", category: "config" },
  INTELLIGENT_RECOGNITION: { key: "intelligent_recognition", platform: "switch", category: "config" },
  AUTO_DRYING: { key: "auto_drying", platform: "switch" },
  CARPET_AVOIDANCE: { key: "carpet_avoidance", platform: "switch", icon: "mdi:close-box-outline", category: "config" },
  AUTO_ADD_DETERGENT: { key: "auto_add_detergent", platform: "switch", icon: "mdi:chart-bubble", category: "config" },
  MOP_WASHING_WITH_DETERGENT: {
    key: "mop_washing_with_detergent",
    platform: "switch",
    icon: "mdi:hand-wash",
    category: "config",
    name: "Mop Washing With Detergent"
  },
  MOPPING_WITH_DETERGENT: {
    key: "mopping_with_detergent",
    platform: "switch",
    icon: "mdi:hand-wash",
    category: "config"
  },
  MAP_SAVING: { key: "map_saving", platform: "switch", icon: "mdi:map-legend", category: "config" },
  AUTO_MOUNT_MOP: { key: "auto_mount_mop", platform: "switch", icon: "mdi:google-circles-group", category: "config" },
  AUTO_CHANGE_MOP: { key: "auto_change_mop", platform: "switch", icon: "mdi:domain-switch", category: "config" },
  VOICE_ASSISTANT: { key: "voice_assistant", platform: "switch", category: "config" },
  CLEANING_SEQUENCE: { key: "cleaning_sequence", platform: "switch", icon: "mdi:order-numeric-ascending" },
  SELF_CLEAN_BY_ZONE: { key: "self_clean_by_zone", platform: "switch" },
  AI_OBSTACLE_DETECTION: { key: "ai_obstacle_detection", platform: "switch", category: "config" },
  AI_OBSTACLE_IMAGE_UPLOAD: {
    key: "ai_obstacle_image_upload",
    platform: "switch",
    icon: "mdi:cloud-upload",
    category: "config"
  },
  AI_OBSTACLE_PICTURE: { key: "ai_obstacle_picture", platform: "switch", category: "config" },
  AI_PET_DETECTION: { key: "ai_pet_detection", platform: "switch", category: "config" },
  AI_HUMAN_DETECTION: { key: "ai_human_detection", platform: "switch", category: "config" },
  AI_FURNITURE_DETECTION: {
    key: "ai_furniture_detection",
    platform: "switch",
    icon: "mdi:table-furniture",
    category: "config"
  },
  AI_FLUID_DETECTION: { key: "ai_fluid_detection", platform: "switch", category: "config" },
  FUZZY_OBSTACLE_DETECTION: {
    key: "fuzzy_obstacle_detection",
    platform: "switch",
    icon: "mdi:blur-linear",
    category: "config"
  },
  AI_PET_AVOIDANCE: { key: "ai_pet_avoidance", platform: "switch", icon: "mdi:dog-service", category: "config" },
  PET_PICTURE: { key: "pet_picture", platform: "switch", icon: "mdi:cat", category: "config" },
  PET_FOCUSED_DETECTION: { key: "pet_focused_detection", platform: "switch", icon: "mdi:dog", category: "config" },
  LARGE_PARTICLES_BOOST: {
    key: "large_particles_boost",
    platform: "switch",
    icon: "mdi:weather-dust",
    category: "config"
  },
  FILL_LIGHT: { key: "fill_light", platform: "switch" },
  COLLISION_AVOIDANCE: { key: "collision_avoidance", platform: "switch", category: "config" },
  STAIN_AVOIDANCE: { key: "stain_avoidance", platform: "switch", icon: "mdi:liquid-spot" },
  FLOOR_DIRECTION_CLEANING: {
    key: "floor_direction_cleaning",
    platform: "switch",
    icon: "mdi:arrow-decision-auto",
    category: "config"
  },
  PET_FOCUSED_CLEANING: { key: "pet_focused_cleaning", platform: "switch", icon: "mdi:paw", category: "config" },
  INTENSIVE_CARPET_CLEANING: {
    key: "intensive_carpet_cleaning",
    platform: "switch",
    icon: "mdi:creation",
    category: "config"
  },
  SIDE_REACH: { key: "side_reach", platform: "switch", icon: "mdi:selection-ellipse-arrow-inside", category: "config" },
  MOP_EXTEND: { key: "mop_extend", platform: "switch", icon: "mdi:waves-arrow-right" },
  GAP_CLEANING_EXTENSION: {
    key: "gap_cleaning_extension",
    platform: "switch",
    icon: "mdi:plus-circle-multiple",
    category: "config"
  },
  MOPPING_UNDER_FURNITURES: {
    key: "mopping_under_furnitures",
    platform: "switch",
    icon: "mdi:table-picnic",
    category: "config"
  },
  OFF_PEAK_CHARGING: { key: "off_peak_charging", platform: "switch", icon: "mdi:battery-clock", category: "config" },
  AUTO_CHARGING: { key: "auto_charging", platform: "switch", icon: "mdi:battery-sync" },
  HUMAN_FOLLOW: { key: "human_follow", platform: "switch" },
  MAX_SUCTION_POWER: { key: "max_suction_power", platform: "switch", icon: "mdi:speedometer" },
  SMART_DRYING: { key: "smart_drying", platform: "switch", icon: "mdi:clock-fast" },
  HOT_WASHING: { key: "hot_washing", platform: "switch", icon: "mdi:sun-thermometer" },
  UV_STERILIZATION: { key: "uv_sterilization", platform: "switch", icon: "mdi:sun-wireless" },
  ULTRA_CLEAN_MODE: { key: "ultra_clean_mode", platform: "switch", icon: "mdi:silverware-clean" },
  STREAMING_VOICE_PROMPT: { key: "streaming_voice_prompt", platform: "switch" },
  CLEAN_CARPETS_FIRST: {
    key: "clean_carpets_first",
    platform: "switch",
    icon: "mdi:order-bool-descending-variant",
    category: "config"
  },
  SMART_MOP_WASHING: { key: "smart_mop_washing", platform: "switch", icon: "mdi:hand-water", category: "config" },
  SILENT_DRYING: { key: "silent_drying", platform: "switch", icon: "mdi:volume-mute" },
  HAIR_COMPRESSION: {
    key: "hair_compression",
    platform: "switch",
    icon: "mdi:arrow-collapse-vertical",
    category: "config"
  },
  SIDE_BRUSH_CARPET_ROTATE: {
    key: "side_brush_carpet_rotate",
    platform: "switch",
    icon: "mdi:format-rotate-90",
    category: "config"
  },
  LIFT_CHASSIS_ON_CARPET: {
    key: "lift_chassis_on_carpet",
    platform: "switch",
    icon: "mdi:weather-moonset-up",
    category: "config"
  },
  CLOSE_ROLLER_COVER_ON_CARPET: {
    key: "close_roller_cover_on_carpet",
    platform: "switch",
    icon: "mdi:circle-off-outline",
    category: "config"
  },
  DUST_BAG_DRYING: { key: "dust_bag_drying", platform: "switch", icon: "mdi:fire-circle", category: "config" },
  RING_LIGHT_ALWAYS_ON: {
    key: "ring_light_always_on",
    platform: "switch",
    icon: "mdi:light-recessed",
    category: "config"
  },
  OBSTACLE_CROSSING: {
    key: "obstacle_crossing",
    platform: "switch",
    icon: "mdi:boom-gate-arrow-up",
    category: "config",
    name: "Synchronized Obstacle Crossing"
  },
  ACTIVE_SUSPENSION_CROSSING: {
    key: "active_suspension_crossing",
    platform: "switch",
    icon: "mdi:weather-moonset-up",
    category: "config"
  },
  DYNAMIC_OBSTACLE_CLEANING: {
    key: "dynamic_obstacle_cleaning",
    platform: "switch",
    icon: "mdi:map-marker-circle",
    category: "config"
  },
  PRESSURIZED_CLEANING: {
    key: "pressurized_cleaning",
    platform: "switch",
    icon: "mdi:car-brake-low-pressure",
    category: "config"
  },
  LDS_STATE: { key: "lds_state", platform: "switch", name: "LDS State" },
  CAMERA_LIGHT_BRIGHTNESS_AUTO: { key: "camera_light_brightness_auto", platform: "switch" }
}, Mn = {
  SUCTION_LEVEL: { key: "suction_level", platform: "select" },
  WATER_VOLUME: { key: "water_volume", platform: "select" },
  CLEANING_MODE: { key: "cleaning_mode", platform: "select" },
  CARPET_SENSITIVITY: { key: "carpet_sensitivity", platform: "select", icon: "mdi:rug" },
  CARPET_CLEANING: { key: "carpet_cleaning", platform: "select", icon: "mdi:close-box-outline" },
  AUTO_EMPTY_FREQUENCY: { key: "auto_empty_frequency", platform: "select" },
  DRYING_TIME: { key: "drying_time", platform: "select", icon: "mdi:sun-clock" },
  MOP_WASH_LEVEL: { key: "mop_wash_level", platform: "select", icon: "mdi:water-opacity" },
  VOICE_ASSISTANT_LANGUAGE: {
    key: "voice_assistant_language",
    platform: "select",
    icon: "mdi:translate-variant",
    category: "config"
  },
  MOP_PRESSURE: { key: "mop_pressure", platform: "select", icon: "mdi:car-brake-low-pressure" },
  MOP_TEMPERATURE: { key: "mop_temperature", platform: "select", icon: "mdi:thermometer-water" },
  LOW_LYING_AREA_FREQUENCY: {
    key: "low_lying_area_frequency",
    platform: "select",
    icon: "mdi:priority-high",
    category: "config"
  },
  SCRAPER_FREQUENCY: { key: "scraper_frequency", platform: "select", icon: "mdi:squeegee", category: "config" },
  MOP_PAD_HUMIDITY: { key: "mop_pad_humidity", platform: "select" },
  MOPPING_TYPE: { key: "mopping_type", platform: "select", icon: "mdi:spray-bottle", category: "config" },
  CUSTOM_MOPPING_ROUTE: { key: "custom_mopping_route", platform: "select" },
  WIDER_CORNER_COVERAGE: {
    key: "wider_corner_coverage",
    platform: "select",
    icon: "mdi:rounded-corner",
    category: "config"
  },
  MOP_PAD_SWING: { key: "mop_pad_swing", platform: "select", icon: "mdi:arrow-split-vertical", category: "config" },
  MOP_EXTEND_FREQUENCY: {
    key: "mop_extend_frequency",
    platform: "select",
    icon: "mdi:waves-arrow-right",
    category: "config"
  },
  SELF_CLEAN_FREQUENCY: { key: "self_clean_frequency", platform: "select" },
  AUTO_RECLEANING: { key: "auto_recleaning", platform: "select", icon: "mdi:repeat-variant" },
  AUTO_REWASHING: { key: "auto_rewashing", platform: "select" },
  CLEANING_ROUTE: { key: "cleaning_route", platform: "select" },
  BATTERY_CHARGE_LEVEL: {
    key: "battery_charge_level",
    platform: "select",
    icon: "mdi:battery-heart-variant",
    category: "config"
  },
  CLEANGENIUS: { key: "cleangenius", platform: "select", icon: "mdi:atom" },
  CLEANGENIUS_MODE: { key: "cleangenius_mode", platform: "select", icon: "mdi:atom" },
  WATER_TEMPERATURE: { key: "water_temperature", platform: "select", icon: "mdi:water-thermometer" },
  AUTO_LDS_COVERAGE: { key: "auto_lds_coverage", platform: "select", icon: "mdi:elevator", category: "config" },
  AUTO_EMPTY_MODE: { key: "auto_empty_mode", platform: "select" },
  MOP_CLEAN_FREQUENCY: { key: "mop_clean_frequency", platform: "select" },
  WASHING_MODE: { key: "washing_mode", platform: "select", icon: "mdi:water-opacity" },
  MAP_ROTATION: { key: "map_rotation", platform: "select", icon: "mdi:crop-rotate", category: "config" },
  SELECTED_MAP: { key: "selected_map", platform: "select", icon: "mdi:map-check" },
  CLEANING_TIMES: { key: "cleaning_times", platform: "select" },
  MOP_TYPE: { key: "mop_type", platform: "select", category: "config" },
  ORDER: { key: "order", platform: "select" },
  FLOOR_MATERIAL: { key: "floor_material", platform: "select" },
  FLOOR_MATERIAL_DIRECTION: { key: "floor_material_direction", platform: "select" },
  VISIBILITY: { key: "visibility", platform: "select" },
  NAME: { key: "name", platform: "select" }
}, bw = {
  RESET_MAIN_BRUSH: {
    key: "reset_main_brush",
    platform: "button",
    icon: "mdi:car-turbocharger",
    category: "diagnostic"
  },
  RESET_SIDE_BRUSH: {
    key: "reset_side_brush",
    platform: "button",
    icon: "mdi:pinwheel-outline",
    category: "diagnostic"
  },
  RESET_FILTER: { key: "reset_filter", platform: "button", icon: "mdi:air-filter", category: "diagnostic" },
  RESET_SENSOR: { key: "reset_sensor", platform: "button", icon: "mdi:radar", category: "diagnostic" },
  RESET_MOP_PAD: { key: "reset_mop_pad", platform: "button", icon: "mdi:hydro-power", category: "diagnostic" },
  RESET_SILVER_ION: { key: "reset_silver_ion", platform: "button", icon: "mdi:shimmer", category: "diagnostic" },
  RESET_DETERGENT: { key: "reset_detergent", platform: "button", icon: "mdi:chart-bubble", category: "diagnostic" },
  RESET_SQUEEGEE: { key: "reset_squeegee", platform: "button", icon: "mdi:squeegee", category: "diagnostic" },
  RESET_ONBOARD_DIRTY_WATER_TANK: {
    key: "reset_onboard_dirty_water_tank",
    platform: "button",
    icon: "mdi:train-car-tank",
    category: "diagnostic"
  },
  RESET_DIRTY_WATER_CHANNEL: {
    key: "reset_dirty_water_channel",
    platform: "button",
    icon: "mdi:cup",
    category: "diagnostic"
  },
  RESET_DEODORIZER: { key: "reset_deodorizer", platform: "button", icon: "mdi:scent", category: "diagnostic" },
  RESET_SCALE_INHIBITOR: { key: "reset_scale_inhibitor", platform: "button", icon: "mdi:pipe", category: "diagnostic" },
  RESET_WHEEL: { key: "reset_wheel", platform: "button", icon: "mdi:tire", category: "diagnostic" },
  RESET_FLUFFING_ROLLER: {
    key: "reset_fluffing_roller",
    platform: "button",
    icon: "mdi:blinds-open",
    category: "diagnostic"
  },
  RESET_ROLLER_MOP_FILTER: {
    key: "reset_roller_mop_filter",
    platform: "button",
    icon: "mdi:filter-settings",
    category: "diagnostic"
  },
  RESET_WATER_OUTLET_FILTER: {
    key: "reset_water_outlet_filter",
    platform: "button",
    icon: "mdi:filter-settings",
    category: "diagnostic"
  },
  START_AUTO_EMPTY: { key: "start_auto_empty", platform: "button" },
  CLEAR_WARNING: {
    key: "clear_warning",
    platform: "button",
    icon: "mdi:clipboard-check-outline",
    category: "diagnostic"
  },
  START_FAST_MAPPING: { key: "start_fast_mapping", platform: "button", icon: "mdi:map-plus", category: "config" },
  START_MAPPING: { key: "start_mapping", platform: "button", icon: "mdi:broom", category: "config" },
  SELF_CLEAN: { key: "self_clean", platform: "button" },
  MANUAL_DRYING: { key: "manual_drying", platform: "button" },
  MANUAL_DUST_BAG_DRYING: { key: "manual_dust_bag_drying", platform: "button" },
  WATER_TANK_DRAINING: { key: "water_tank_draining", platform: "button", icon: "mdi:pump", category: "diagnostic" },
  EMPTY_WATER_TANK: { key: "empty_water_tank", platform: "button", icon: "mdi:waves-arrow-up", category: "diagnostic" },
  BASE_STATION_SELF_REPAIR: { key: "base_station_self_repair", platform: "button", category: "diagnostic" },
  BASE_STATION_CLEANING: {
    key: "base_station_cleaning",
    platform: "button",
    icon: "mdi:car-wash",
    category: "diagnostic"
  },
  START_RECLEANING: {
    key: "start_recleaning",
    platform: "button",
    icon: "mdi:refresh-circle",
    name: "Start Re-Cleaning"
  },
  RELOAD_SHORTCUTS: {
    key: "reload_shortcuts",
    platform: "button",
    icon: "mdi:motion-play-outline",
    category: "diagnostic"
  },
  SHORTCUT: { key: "shortcut", platform: "button", icon: "mdi:play-speed" },
  BACKUP: { key: "backup", platform: "button", icon: "mdi:content-save", category: "diagnostic" }
}, Ls = {
  VOLUME: { key: "volume", platform: "number" },
  MOP_CLEANING_REMAINDER: {
    key: "mop_cleaning_remainder",
    platform: "number",
    icon: "mdi:alarm-check",
    category: "config"
  },
  SELF_CLEAN_AREA: { key: "self_clean_area", platform: "number" },
  SELF_CLEAN_TIME: { key: "self_clean_time", platform: "number", icon: "mdi:table-clock" },
  CAMERA_LIGHT_BRIGHTNESS: {
    key: "camera_light_brightness",
    platform: "number",
    icon: "mdi:brightness-percent",
    category: "config"
  },
  WETNESS_LEVEL: { key: "wetness_level", platform: "number" },
  DRYING_TIME: { key: "drying_time", platform: "number", icon: "mdi:sun-clock" },
  AUTO_EMPTY_AREA: { key: "auto_empty_area", platform: "number", icon: "mdi:recycle" }
}, ww = {
  DND_START: { key: "dnd_start", platform: "time", icon: "mdi:clock-start", category: "config", name: "DnD Start" },
  DND_END: { key: "dnd_end", platform: "time", icon: "mdi:clock-end", category: "config", name: "DnD End" },
  OFF_PEAK_CHARGING_START: {
    key: "off_peak_charging_start",
    platform: "time",
    icon: "mdi:battery-lock-open",
    category: "config",
    name: "Off-Peak Charging Start"
  },
  OFF_PEAK_CHARGING_END: {
    key: "off_peak_charging_end",
    platform: "time",
    icon: "mdi:battery-lock",
    category: "config",
    name: "Off-Peak Charging End"
  }
}, Sw = {
  MAP: { key: "map" }
}, mn = {
  SUCTION_LEVEL: { key: "suction_level" },
  MOP_PRESSURE: { key: "mop_pressure" },
  MOP_TEMPERATURE: { key: "mop_temperature" },
  CLEANING_TIMES: { key: "cleaning_times" }
}, xu = {
  WETNESS_LEVEL: { key: "wetness_level" }
}, kp = {
  VACUUM_RESET_CONSUMABLE: { key: "vacuum_reset_consumable", domain: "dreame_vacuum" }
}, Rg = {
  AI_DETECTION: "ai_detection",
  AUTO_ADD_DETERGENT: "auto_add_detergent",
  AUTO_EMPTY_BASE: "auto_empty_base",
  AUTO_EMPTY_MODE: "auto_empty_mode",
  AUTO_REWASHING: "auto_rewashing",
  CARPET_RECOGNITION: "carpet_recognition",
  CLEANGENIUS: "cleangenius",
  CLEANING_ROUTE: "cleaning_route",
  DND: "dnd",
  DND_FUNCTIONS: "dnd_functions",
  HOT_WASHING: "hot_washing",
  LOW_LYING_AREA_FREQUENCY: "low_lying_area_frequency",
  MAX_SUCTION_POWER: "max_suction_power",
  MOP_PAD_LIFTING: "mop_pad_lifting",
  MOP_PAD_SWING: "mop_pad_swing",
  MOP_PAD_SWING_PLUS: "mop_pad_swing_plus",
  OFF_PEAK_CHARGING: "off_peak_charging",
  SCRAPER_FREQUENCY: "scraper_frequency",
  SELF_CLEAN_FREQUENCY: "self_clean_frequency",
  SELF_WASH_BASE: "self_wash_base",
  SHORTCUTS: "shortcuts",
  SIDE_REACH: "side_reach",
  SMART_MOP_WASHING: "smart_mop_washing",
  STATION_CLEANING: "station_cleaning",
  VOICE_ASSISTANT: "voice_assistant",
  WASHING_MODE: "washing_mode",
  WETNESS_LEVEL: "wetness_level"
};
function vt(n, a, o) {
  return `${n}.${a}_${o}`;
}
function Mt(n, a, o, s) {
  return `${n}.${a}_room_${o}_${s}`;
}
function ce(n, a, o, s) {
  return {
    key: Bu[n].key,
    platform: "switch",
    labelKey: a,
    descriptionKey: o,
    ...s
  };
}
function Ot(n, a, o, s) {
  return {
    key: Mn[n].key,
    platform: "select",
    labelKey: a,
    descriptionKey: o,
    ...s
  };
}
function Dg(n, a, o, s) {
  return {
    key: Ls[n].key,
    platform: "number",
    labelKey: a,
    descriptionKey: o,
    ...s
  };
}
function fn(n, a, o, s) {
  return {
    key: bw[n].key,
    platform: "button",
    labelKey: a,
    descriptionKey: o,
    ...s
  };
}
function Is(n, a, o, s) {
  return {
    key: ww[n].key,
    platform: "time",
    labelKey: a,
    descriptionKey: o,
    ...s
  };
}
const fe = Rg, jg = {
  key: "quick_settings",
  titleKey: "settings.quick_settings.title",
  order: 1,
  entities: [
    ce("CHILD_LOCK", "settings.quick_settings.child_lock", "settings.quick_settings.child_lock_desc"),
    ce("RESUME_CLEANING", "settings.quick_settings.resume_cleaning", "settings.quick_settings.resume_cleaning_desc"),
    ce("DND", "settings.quick_settings.dnd", "settings.quick_settings.dnd_desc", { capability: fe.DND }),
    Is("DND_START", "settings.quick_settings.dnd_start", void 0, {
      capability: fe.DND,
      parentKey: "dnd"
    }),
    Is("DND_END", "settings.quick_settings.dnd_end", void 0, {
      capability: fe.DND,
      parentKey: "dnd"
    }),
    ce(
      "DND_DISABLE_RESUME_CLEANING",
      "settings.quick_settings.dnd_disable_resume",
      "settings.quick_settings.dnd_disable_resume_desc",
      {
        capability: fe.DND_FUNCTIONS,
        parentKey: "dnd"
      }
    ),
    ce(
      "DND_DISABLE_AUTO_EMPTY",
      "settings.quick_settings.dnd_disable_auto_empty",
      "settings.quick_settings.dnd_disable_auto_empty_desc",
      {
        capability: fe.DND_FUNCTIONS,
        parentKey: "dnd"
      }
    ),
    ce(
      "DND_REDUCE_VOLUME",
      "settings.quick_settings.dnd_reduce_volume",
      "settings.quick_settings.dnd_reduce_volume_desc",
      {
        capability: fe.DND_FUNCTIONS,
        parentKey: "dnd"
      }
    )
  ]
}, Lg = {
  key: "quick_actions",
  titleKey: "settings.station_controls.title",
  order: 2,
  entities: [
    fn("SELF_CLEAN", "settings.station_controls.self_clean", "settings.station_controls.self_clean_desc"),
    fn("MANUAL_DRYING", "settings.station_controls.manual_drying", "settings.station_controls.manual_drying_desc"),
    fn(
      "WATER_TANK_DRAINING",
      "settings.station_controls.water_tank_draining",
      "settings.station_controls.water_tank_draining_desc"
    ),
    fn(
      "BASE_STATION_CLEANING",
      "settings.station_controls.base_station_cleaning",
      "settings.station_controls.base_station_cleaning_desc"
    ),
    fn(
      "EMPTY_WATER_TANK",
      "settings.station_controls.empty_water_tank",
      "settings.station_controls.empty_water_tank_desc"
    ),
    fn(
      "START_AUTO_EMPTY",
      "settings.station_controls.start_auto_empty",
      "settings.station_controls.start_auto_empty_desc"
    ),
    fn(
      "START_RECLEANING",
      "settings.station_controls.start_recleaning",
      "settings.station_controls.start_recleaning_desc"
    ),
    fn("CLEAR_WARNING", "settings.station_controls.clear_warning", "settings.station_controls.clear_warning_desc")
  ]
}, Ug = {
  key: "carpet_settings",
  titleKey: "settings.carpet.title",
  order: 3,
  capabilities: [fe.CARPET_RECOGNITION],
  entities: [
    ce("CARPET_RECOGNITION", "settings.carpet.carpet_recognition", "settings.carpet.carpet_recognition_desc"),
    ce("CARPET_AVOIDANCE", "settings.carpet.carpet_avoidance", "settings.carpet.carpet_avoidance_desc"),
    Ot("CARPET_CLEANING", "settings.carpet.cleaning_mode", "settings.carpet.cleaning_mode_desc"),
    ce("CLEAN_CARPETS_FIRST", "settings.carpet.clean_carpets_first", "settings.carpet.clean_carpets_first_desc"),
    ce("CARPET_BOOST", "settings.carpet.carpet_boost", "settings.carpet.carpet_boost_desc"),
    ce("INTENSIVE_CARPET_CLEANING", "settings.carpet.intensive_cleaning", "settings.carpet.intensive_cleaning_desc"),
    ce("SIDE_BRUSH_CARPET_ROTATE", "settings.carpet.side_brush_rotate", "settings.carpet.side_brush_rotate_desc"),
    Ot("CARPET_SENSITIVITY", "settings.carpet.sensitivity", "settings.carpet.sensitivity_desc")
  ]
}, qg = {
  key: "floor_settings",
  titleKey: "settings.floor.title",
  order: 4,
  entities: [
    ce("OBSTACLE_AVOIDANCE", "settings.floor.obstacle_avoidance", "settings.floor.obstacle_avoidance_desc"),
    ce("COLLISION_AVOIDANCE", "settings.floor.collision_avoidance", "settings.floor.collision_avoidance_desc"),
    ce("AUTO_MOUNT_MOP", "settings.floor.auto_mount_mop", "settings.floor.auto_mount_mop_desc"),
    ce("TIGHT_MOPPING", "settings.floor.tight_mopping", "settings.floor.tight_mopping_desc"),
    ce("STAIN_AVOIDANCE", "settings.floor.stain_avoidance", "settings.floor.stain_avoidance_desc"),
    ce(
      "FLOOR_DIRECTION_CLEANING",
      "settings.floor.floor_direction_cleaning",
      "settings.floor.floor_direction_cleaning_desc"
    ),
    ce("LARGE_PARTICLES_BOOST", "settings.floor.large_particles_boost", "settings.floor.large_particles_boost_desc"),
    ce("PET_FOCUSED_CLEANING", "settings.floor.pet_focused_cleaning", "settings.floor.pet_focused_cleaning_desc"),
    Ot("AUTO_RECLEANING", "settings.floor.auto_recleaning", "settings.floor.auto_recleaning_desc"),
    Ot(
      "LOW_LYING_AREA_FREQUENCY",
      "settings.floor.low_lying_area_frequency",
      "settings.floor.low_lying_area_frequency_desc",
      {
        capability: fe.LOW_LYING_AREA_FREQUENCY
      }
    )
  ]
}, Gg = {
  key: "edge_corner",
  titleKey: "settings.edge_corner.title",
  order: 5,
  capabilities: [fe.MOP_PAD_LIFTING, fe.SIDE_REACH, fe.MOP_PAD_SWING, fe.MOP_PAD_SWING_PLUS],
  entities: [
    ce("SIDE_REACH", "settings.edge_corner.side_reach", "settings.edge_corner.side_reach_desc", {
      capability: fe.SIDE_REACH
    }),
    ce("MOP_EXTEND", "settings.edge_corner.mop_extend", "settings.edge_corner.mop_extend_desc"),
    ce("GAP_CLEANING_EXTENSION", "settings.edge_corner.gap_cleaning", "settings.edge_corner.gap_cleaning_desc", {
      parentKey: "mop_extend"
    }),
    ce("MOPPING_UNDER_FURNITURES", "settings.edge_corner.mopping_under", "settings.edge_corner.mopping_under_desc", {
      parentKey: "mop_extend"
    }),
    Ot("MOP_EXTEND_FREQUENCY", "settings.edge_corner.extend_frequency", "settings.edge_corner.extend_frequency_desc")
  ]
}, Ig = {
  key: "volume",
  titleKey: "settings.volume.title",
  order: 6,
  entities: [
    Dg("VOLUME", "settings.volume.volume", void 0, { renderHint: "volume", min: 0, max: 100 }),
    ce("VOICE_ASSISTANT", "settings.volume.voice_assistant", "settings.volume.voice_assistant_desc", {
      capability: fe.VOICE_ASSISTANT
    }),
    Ot("VOICE_ASSISTANT_LANGUAGE", "settings.volume.voice_language", "settings.volume.voice_language_desc", {
      capability: fe.VOICE_ASSISTANT,
      parentKey: "voice_assistant"
    }),
    ce(
      "STREAMING_VOICE_PROMPT",
      "settings.volume.streaming_voice_prompt",
      "settings.volume.streaming_voice_prompt_desc"
    )
  ]
}, Hg = {
  key: "dock_settings",
  titleKey: "settings.dock.title",
  order: 7,
  capabilities: [
    fe.AUTO_EMPTY_BASE,
    fe.SELF_WASH_BASE,
    fe.AUTO_ADD_DETERGENT,
    fe.SMART_MOP_WASHING,
    fe.WASHING_MODE,
    fe.HOT_WASHING,
    fe.OFF_PEAK_CHARGING,
    fe.STATION_CLEANING,
    fe.AUTO_REWASHING
  ],
  entities: [
    ce("SELF_CLEAN", "settings.dock.self_clean", "settings.dock.self_clean_desc", { capability: fe.SELF_WASH_BASE }),
    ce("AUTO_DUST_COLLECTING", "settings.dock.auto_dust_collecting", "settings.dock.auto_dust_collecting_desc", {
      capability: fe.AUTO_EMPTY_BASE
    }),
    Ot("AUTO_EMPTY_MODE", "settings.dock.auto_empty_mode", "settings.dock.auto_empty_mode_desc", {
      capability: fe.AUTO_EMPTY_MODE
    }),
    Ot("AUTO_EMPTY_FREQUENCY", "settings.dock.auto_empty_frequency", "settings.dock.auto_empty_frequency_desc", {
      capability: fe.AUTO_EMPTY_BASE
    }),
    ce("AUTO_ADD_DETERGENT", "settings.dock.auto_detergent", "settings.dock.auto_detergent_desc", {
      capability: fe.AUTO_ADD_DETERGENT
    }),
    ce(
      "MOP_WASHING_WITH_DETERGENT",
      "settings.dock.mop_washing_with_detergent",
      "settings.dock.mop_washing_with_detergent_desc",
      {
        capability: fe.AUTO_ADD_DETERGENT
      }
    ),
    ce("MOPPING_WITH_DETERGENT", "settings.dock.mopping_with_detergent", "settings.dock.mopping_with_detergent_desc"),
    ce("WATER_ELECTROLYSIS", "settings.dock.water_electrolysis", "settings.dock.water_electrolysis_desc", {
      capability: fe.SELF_WASH_BASE
    }),
    ce("AUTO_WATER_REFILLING", "settings.dock.auto_water_refilling", "settings.dock.auto_water_refilling_desc"),
    ce("SMART_MOP_WASHING", "settings.dock.smart_washing", "settings.dock.smart_washing_desc", {
      capability: fe.SMART_MOP_WASHING
    }),
    Ot("MOP_WASH_LEVEL", "settings.dock.mop_wash_level", "settings.dock.mop_wash_level_desc", {
      capability: fe.SELF_WASH_BASE
    }),
    Ot("WASHING_MODE", "settings.dock.washing_mode", "settings.dock.washing_mode_desc", {
      capability: fe.WASHING_MODE
    }),
    Ot("WATER_TEMPERATURE", "settings.dock.water_temperature", "settings.dock.water_temperature_desc", {
      capability: fe.HOT_WASHING
    }),
    ce("AUTO_DRYING", "settings.dock.auto_drying", "settings.dock.auto_drying_desc", {
      capability: fe.SELF_WASH_BASE
    }),
    Ot("DRYING_TIME", "settings.dock.drying_time", "settings.dock.drying_time_desc", {
      capability: fe.SELF_WASH_BASE,
      useSegmentedControl: !0
    }),
    Ot("AUTO_REWASHING", "settings.dock.auto_rewashing", "settings.dock.auto_rewashing_desc", {
      capability: fe.AUTO_REWASHING
    }),
    ce("OFF_PEAK_CHARGING", "settings.dock.off_peak_charging", "settings.dock.off_peak_charging_desc", {
      capability: fe.OFF_PEAK_CHARGING
    }),
    Is("OFF_PEAK_CHARGING_START", "settings.dock.off_peak_charging_start", void 0, {
      capability: fe.OFF_PEAK_CHARGING,
      parentKey: "off_peak_charging"
    }),
    Is("OFF_PEAK_CHARGING_END", "settings.dock.off_peak_charging_end", void 0, {
      capability: fe.OFF_PEAK_CHARGING,
      parentKey: "off_peak_charging"
    }),
    fn("BASE_STATION_CLEANING", "settings.dock.station_cleaning", "settings.dock.station_cleaning_desc", {
      capability: fe.STATION_CLEANING
    }),
    fn("BASE_STATION_SELF_REPAIR", "settings.dock.self_repair", "settings.dock.self_repair_desc", {
      capability: fe.STATION_CLEANING
    }),
    Ot("SCRAPER_FREQUENCY", "settings.dock.scraper_frequency", "settings.dock.scraper_frequency_desc", {
      capability: fe.SCRAPER_FREQUENCY
    })
  ]
}, Pg = {
  key: "ai_detection",
  titleKey: "settings.ai_detection.title",
  order: 8,
  capabilities: [fe.AI_DETECTION],
  entities: [
    ce(
      "INTELLIGENT_RECOGNITION",
      "settings.ai_detection.intelligent_recognition",
      "settings.ai_detection.intelligent_recognition_desc"
    ),
    ce(
      "AI_OBSTACLE_DETECTION",
      "settings.ai_detection.ai_obstacle_detection",
      "settings.ai_detection.ai_obstacle_detection_desc"
    ),
    ce(
      "FUZZY_OBSTACLE_DETECTION",
      "settings.ai_detection.fuzzy_obstacle_detection",
      "settings.ai_detection.fuzzy_obstacle_detection_desc"
    ),
    ce(
      "AI_OBSTACLE_IMAGE_UPLOAD",
      "settings.ai_detection.ai_obstacle_image_upload",
      "settings.ai_detection.ai_obstacle_image_upload_desc"
    ),
    ce(
      "AI_OBSTACLE_PICTURE",
      "settings.ai_detection.ai_obstacle_picture",
      "settings.ai_detection.ai_obstacle_picture_desc"
    ),
    ce("AI_PET_DETECTION", "settings.ai_detection.ai_pet_detection", "settings.ai_detection.ai_pet_detection_desc"),
    ce("AI_PET_AVOIDANCE", "settings.ai_detection.ai_pet_avoidance", "settings.ai_detection.ai_pet_avoidance_desc"),
    ce(
      "PET_FOCUSED_DETECTION",
      "settings.ai_detection.pet_focused_detection",
      "settings.ai_detection.pet_focused_detection_desc"
    ),
    ce("PET_PICTURE", "settings.ai_detection.pet_picture", "settings.ai_detection.pet_picture_desc"),
    ce(
      "AI_HUMAN_DETECTION",
      "settings.ai_detection.ai_human_detection",
      "settings.ai_detection.ai_human_detection_desc"
    ),
    ce("HUMAN_FOLLOW", "settings.ai_detection.human_follow", "settings.ai_detection.human_follow_desc"),
    ce(
      "AI_FURNITURE_DETECTION",
      "settings.ai_detection.ai_furniture_detection",
      "settings.ai_detection.ai_furniture_detection_desc"
    ),
    ce(
      "AI_FLUID_DETECTION",
      "settings.ai_detection.ai_fluid_detection",
      "settings.ai_detection.ai_fluid_detection_desc"
    ),
    ce("FILL_LIGHT", "settings.ai_detection.fill_light", "settings.ai_detection.fill_light_desc"),
    ce(
      "CAMERA_LIGHT_BRIGHTNESS_AUTO",
      "settings.ai_detection.camera_light_auto",
      "settings.ai_detection.camera_light_auto_desc"
    ),
    Dg(
      "CAMERA_LIGHT_BRIGHTNESS",
      "settings.ai_detection.camera_light_brightness",
      "settings.ai_detection.camera_light_brightness_desc",
      {
        renderHint: "brightness",
        parentKey: "camera_light_brightness_auto"
        // Show only when auto is OFF (inverted logic handled in component)
      }
    )
  ]
}, Bg = {
  key: "map_settings",
  titleKey: "settings.map.title",
  order: 9,
  entities: [
    ce("MULTI_FLOOR_MAP", "settings.map.multi_floor", "settings.map.multi_floor_desc"),
    Ot("MAP_ROTATION", "settings.map.rotation", "settings.map.rotation_desc"),
    fn("START_MAPPING", "settings.map.start_mapping"),
    fn("START_FAST_MAPPING", "settings.map.start_fast_mapping")
  ]
};
[
  jg,
  Lg,
  Ug,
  qg,
  Gg,
  Ig,
  Hg,
  Pg,
  Bg
].sort((n, a) => n.order - a.order);
const Ew = /* @__PURE__ */ h.jsx(Qb, {}), zw = /* @__PURE__ */ h.jsx(Xb, {}), kw = /* @__PURE__ */ h.jsx(Wb, {}), Tw = /* @__PURE__ */ h.jsx(Vb, {}), Aw = /* @__PURE__ */ h.jsx(y0, {}), Nw = /* @__PURE__ */ h.jsx(Og, {}), Cw = /* @__PURE__ */ h.jsx(I0, {}), xw = /* @__PURE__ */ h.jsx(q0, {}), Mw = /* @__PURE__ */ h.jsx(uw, {}), Ow = /* @__PURE__ */ h.jsx(D0, {}), Rw = /* @__PURE__ */ h.jsx(L0, {}), Dw = /* @__PURE__ */ h.jsx(e0, {}), jw = /* @__PURE__ */ h.jsx(s0, {}), Zg = /* @__PURE__ */ h.jsx(Hu, {}), Yg = /* @__PURE__ */ h.jsx(Xs, {}), Hs = /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
  /* @__PURE__ */ h.jsx(Hu, {}),
  /* @__PURE__ */ h.jsx(Mg, {}),
  /* @__PURE__ */ h.jsx(Xs, {})
] }), Zu = /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
  /* @__PURE__ */ h.jsx(Hu, {}),
  /* @__PURE__ */ h.jsx(Bb, {}),
  /* @__PURE__ */ h.jsx(Xs, {})
] }), Mu = /* @__PURE__ */ h.jsx(nw, {}), Yu = /* @__PURE__ */ h.jsx(iw, {}), Vg = /* @__PURE__ */ h.jsx(ew, {}), Ou = /* @__PURE__ */ h.jsx(rw, {}), Lw = /* @__PURE__ */ h.jsx(Og, {}), Uw = /* @__PURE__ */ h.jsx(mw, {}), qw = /* @__PURE__ */ h.jsx(h0, {}), Gw = /* @__PURE__ */ h.jsx(yw, {}), Iw = /* @__PURE__ */ h.jsx(Y0, {}), Hw = /* @__PURE__ */ h.jsx(Q0, {}), Pw = /* @__PURE__ */ h.jsx(hw, {}), Kg = /* @__PURE__ */ h.jsx(lw, {}), Xg = /* @__PURE__ */ h.jsx(Xs, {}), Tp = {
  // Idle states
  idle: "idle",
  charging: "idle",
  charging_completed: "idle",
  // Cleaning states
  sweeping: "cleaning",
  mopping: "cleaning",
  sweeping_and_mopping: "cleaning",
  second_cleaning: "cleaning",
  spot_cleaning: "cleaning",
  extra_cleaning: "cleaning",
  initial_deep_cleaning: "cleaning",
  floor_maintaining: "cleaning",
  // Paused states
  paused: "paused",
  washing_paused: "paused",
  monitoring_paused: "paused",
  dust_bag_drying_paused: "paused",
  finding_pet_paused: "paused",
  initial_deep_cleaning_paused: "paused",
  changing_mop_paused: "paused",
  floor_maintaining_paused: "paused",
  // Returning states
  returning: "returning",
  returning_to_wash: "returning",
  returning_install_mop: "returning",
  returning_remove_mop: "returning",
  returning_auto_empty: "returning",
  returning_to_drain: "returning",
  heading_to_extra_cleaning: "returning",
  // Maintenance states
  washing: "maintenance",
  drying: "maintenance",
  auto_emptying: "maintenance",
  station_cleaning: "maintenance",
  draining: "maintenance",
  auto_water_draining: "maintenance",
  emptying: "maintenance",
  dust_bag_drying: "maintenance",
  water_check: "maintenance",
  clean_add_water: "maintenance",
  sanitizing: "maintenance",
  sanitizing_with_dry: "maintenance",
  changing_mop: "maintenance",
  // Error state
  error: "error",
  // Other states
  unknown: "other",
  building: "other",
  upgrading: "other",
  remote_control: "other",
  monitoring: "other",
  shortcut: "other",
  human_following: "other",
  finding_pet: "other",
  waiting_for_task: "other",
  smart_charging: "other",
  station_reset: "other",
  clean_summon: "other"
}, Ap = {
  sweeping: "vacuuming",
  spot_cleaning: "vacuuming",
  mopping: "mopping",
  second_cleaning: "mopping",
  // Mopping phase of "mop after vac"
  sweeping_and_mopping: "vacuuming_and_mopping",
  extra_cleaning: "vacuuming",
  initial_deep_cleaning: "vacuuming_and_mopping",
  floor_maintaining: "mopping"
}, Np = {
  cleaning: "cleaning",
  docked: "idle",
  idle: "idle",
  paused: "paused",
  returning: "returning",
  error: "error"
}, Bw = "idle", Zw = "none", it = Rg, Yw = {
  WETNESS: {
    MIN: 1,
    MAX: 32
  }
}, ii = {
  SELECT: "select",
  SWITCH: "switch",
  NUMBER: "number",
  VACUUM: "vacuum",
  DREAME_VACUUM: "dreame_vacuum"
}, Ta = {
  SELECT_OPTION: "select_option",
  TURN_ON: "turn_on",
  TURN_OFF: "turn_off",
  SET_VALUE: "set_value",
  START: "start",
  RETURN_TO_BASE: "return_to_base",
  VACUUM_CLEAN_SEGMENT: "vacuum_clean_segment",
  SET_FAN_SPEED: "set_fan_speed"
}, he = {
  SWEEPING: "Sweeping",
  MOPPING: "Mopping",
  SWEEPING_AND_MOPPING: "Sweeping and mopping",
  MOPPING_AFTER_SWEEPING: "Mopping after sweeping",
  CUSTOMIZE: "Customize"
}, Tn = {
  VACUUM_AND_MOP: "Vacuum and mop",
  MOP_AFTER_VACUUM: "Mop after vacuum"
}, On = {
  OFF: "Off",
  ROUTINE_CLEANING: "Routine cleaning",
  DEEP_CLEANING: "Deep cleaning"
}, en = {
  CLEANING_MODE: {
    SWEEPING: "sweeping",
    MOPPING: "mopping",
    SWEEPING_AND_MOPPING: "sweeping_and_mopping",
    MOPPING_AFTER_SWEEPING: "mopping_after_sweeping",
    CUSTOMIZE: "customize"
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
}, ci = {
  BY_AREA: "By area",
  BY_TIME: "By time",
  BY_ROOM: "By room"
}, Qi = {
  QUIET: "Quiet",
  SILENT: "Silent",
  STANDARD: "Standard",
  STRONG: "Strong",
  TURBO: "Turbo"
}, si = {
  QUICK: "Quick",
  STANDARD: "Standard",
  INTENSIVE: "Intensive",
  DEEP: "Deep"
}, ui = {
  SLIGHTLY_DRY: "Slightly dry",
  MOIST: "Moist",
  WET: "Wet"
}, Us = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
}, Vw = {
  ALL: "all"
}, tr = {
  CLEANGENIUS: "CleanGenius",
  CUSTOM: "Custom"
}, Cp = {
  MAP_LOCKED: "dreame-vacuum-map-locked",
  CUSTOMIZE_CONFIG: "dreame-vacuum-card:customize_config"
}, Et = {
  MODE: Vw.ALL,
  CLEANING_MODE: he.SWEEPING_AND_MOPPING,
  CLEANGENIUS_MODE: Tn.VACUUM_AND_MOP,
  SUCTION_LEVEL: Qi.STANDARD,
  WETNESS_LEVEL: 20,
  CLEANING_ROUTE: si.STANDARD,
  MAX_SUCTION_POWER: !1,
  SELF_CLEAN_AREA: 20,
  SELF_CLEAN_FREQUENCY: ci.BY_AREA,
  MOP_PAD_HUMIDITY: ui.MOIST,
  WATER_VOLUME: Us.MEDIUM,
  SELF_CLEAN_AREA_MIN: 10,
  SELF_CLEAN_AREA_MAX: 35,
  SELF_CLEAN_TIME: 25,
  SELF_CLEAN_TIME_MIN: 10,
  SELF_CLEAN_TIME_MAX: 50
};
let bu = !1;
const ne = {
  /** Enable or disable debug logging */
  setDebug: (n) => {
    bu = n;
  },
  /** Check if debug logging is enabled */
  isDebugEnabled: () => bu,
  /** Log debug message (only when debug is enabled) */
  debug: (n, ...a) => {
    bu && console.debug(`[Dreame][${n}]`, ...a);
  },
  /** Log info message (always logged) */
  info: (...n) => {
    console.info("[Dreame]", ...n);
  },
  /** Log warning message (always logged) */
  warn: (...n) => {
    console.warn("[Dreame]", ...n);
  },
  /** Log error message (always logged) */
  error: (...n) => {
    console.error("[Dreame]", ...n);
  }
};
function Kw() {
  const n = {
    enableDebug: () => {
      ne.setDebug(!0), ne.info("Debug logging enabled");
    },
    disableDebug: () => {
      ne.setDebug(!1), ne.info("Debug logging disabled");
    },
    isDebugEnabled: () => ne.isDebugEnabled()
  };
  window.dreameVacuum = n;
}
function Vu(n) {
  const a = D.useCallback(
    (f, v, y) => {
      ne.debug("HA", "Service call:", f, v, y), n.callService(f, v, y);
    },
    [n]
  ), o = D.useCallback(
    (f, v) => {
      ne.debug("HA", "Select:", f, "→", v);
      const y = {
        entity_id: f,
        option: v
      };
      a(ii.SELECT, Ta.SELECT_OPTION, y);
    },
    [a]
  ), s = D.useCallback(
    (f, v) => {
      ne.debug("HA", "Switch:", f, "→", v ? "ON" : "OFF");
      const y = v ? Ta.TURN_ON : Ta.TURN_OFF;
      a(ii.SWITCH, y, { entity_id: f });
    },
    [a]
  ), l = D.useCallback(
    (f, v) => {
      ne.debug("HA", "Number:", f, "→", v);
      const y = {
        entity_id: f,
        value: v
      };
      a(ii.NUMBER, Ta.SET_VALUE, y);
    },
    [a]
  ), d = D.useCallback(
    (f) => {
      ne.debug("HA", "Vacuum Start:", f), a(ii.VACUUM, Ta.START, { entity_id: f });
    },
    [a]
  ), _ = D.useCallback(
    (f) => {
      ne.debug("HA", "Vacuum Return to base:", f), a(ii.VACUUM, Ta.RETURN_TO_BASE, { entity_id: f });
    },
    [a]
  ), m = D.useCallback(
    (f, v) => {
      ne.debug("HA", "Vacuum Clean segments:", f, v);
      const y = {
        entity_id: f,
        segments: v
      };
      a(ii.DREAME_VACUUM, Ta.VACUUM_CLEAN_SEGMENT, y);
    },
    [a]
  ), p = D.useCallback(
    (f, v) => {
      ne.debug("HA", "Vacuum Set fan speed:", f, "→", v), a(ii.VACUUM, Ta.SET_FAN_SPEED, {
        entity_id: f,
        fan_speed: v
      });
    },
    [a]
  );
  return {
    setSelectOption: o,
    setSwitch: s,
    setNumber: l,
    startVacuum: d,
    returnToBase: _,
    cleanSegments: m,
    setFanSpeed: p,
    callService: a
  };
}
function Xw(n) {
  switch (n) {
    case he.SWEEPING:
      return en.CLEANING_MODE.SWEEPING;
    case he.MOPPING:
      return en.CLEANING_MODE.MOPPING;
    case he.SWEEPING_AND_MOPPING:
      return en.CLEANING_MODE.SWEEPING_AND_MOPPING;
    case he.MOPPING_AFTER_SWEEPING:
      return en.CLEANING_MODE.MOPPING_AFTER_SWEEPING;
    case he.CUSTOMIZE:
      return en.CLEANING_MODE.CUSTOMIZE;
    default:
      return n;
  }
}
function Fw(n) {
  switch (n) {
    case Tn.VACUUM_AND_MOP:
      return en.CLEANGENIUS_MODE.VACUUM_AND_MOP;
    case Tn.MOP_AFTER_VACUUM:
      return en.CLEANGENIUS_MODE.MOP_AFTER_VACUUM;
    default:
      return n;
  }
}
function Fg(n) {
  switch (n) {
    case On.OFF:
      return en.CLEANGENIUS.OFF;
    case On.ROUTINE_CLEANING:
      return en.CLEANGENIUS.ROUTINE_CLEANING;
    case On.DEEP_CLEANING:
      return en.CLEANGENIUS.DEEP_CLEANING;
    default:
      return n;
  }
}
function Ww(n) {
  switch (n) {
    case ci.BY_AREA:
      return en.SELF_CLEAN_FREQUENCY.BY_AREA;
    case ci.BY_TIME:
      return en.SELF_CLEAN_FREQUENCY.BY_TIME;
    case ci.BY_ROOM:
      return en.SELF_CLEAN_FREQUENCY.BY_ROOM;
    default:
      return n;
  }
}
function rr(n) {
  return n.toLowerCase();
}
function Ku(n) {
  return n.replace("vacuum.", "");
}
function Xu(n) {
  return D.useMemo(() => {
    const a = Ku(n);
    return {
      base: a,
      cleaningMode: vt("select", a, Mn.CLEANING_MODE.key),
      cleangeniusMode: vt("select", a, Mn.CLEANGENIUS_MODE.key),
      cleangenius: vt("select", a, Mn.CLEANGENIUS.key),
      suctionLevel: vt("select", a, Mn.SUCTION_LEVEL.key),
      waterVolume: vt("select", a, Mn.WATER_VOLUME.key),
      mopPadHumidity: vt("select", a, Mn.MOP_PAD_HUMIDITY.key),
      cleaningRoute: vt("select", a, Mn.CLEANING_ROUTE.key),
      maxSuctionPower: vt("switch", a, Bu.MAX_SUCTION_POWER.key),
      wetnessLevel: vt("number", a, Ls.WETNESS_LEVEL.key),
      selfCleanFrequency: vt("select", a, Mn.SELF_CLEAN_FREQUENCY.key),
      selfCleanArea: vt("number", a, Ls.SELF_CLEAN_AREA.key),
      selfCleanTime: vt("number", a, Ls.SELF_CLEAN_TIME.key),
      stateSensor: vt("sensor", a, Te.STATE.key)
    };
  }, [n]);
}
const Fu = "dreame-vacuum-card:repeat_count";
function $w() {
  try {
    const n = localStorage.getItem(Fu);
    if (n) {
      const a = parseInt(n, 10);
      if (a >= 1 && a <= 3)
        return a;
    }
  } catch {
  }
  return 1;
}
function Qw(n) {
  try {
    localStorage.setItem(Fu, String(n));
  } catch {
  }
}
function Jw() {
  try {
    localStorage.removeItem(Fu);
  } catch {
  }
}
function e1({ defaultMode: n = Et.MODE } = {}) {
  const [a, o] = D.useState(n), [s, l] = D.useState(/* @__PURE__ */ new Map()), [d, _] = D.useState(null), [m, p] = D.useState(!1), [f, v] = D.useState(!1), [y, w] = D.useState(!1), [E, z] = D.useState($w), N = D.useCallback((V) => {
    ne.debug("UI", "Mode changed:", V), o(V), l(/* @__PURE__ */ new Map()), _(null);
  }, []), j = D.useCallback((V, W) => {
    l((J) => {
      const se = new Map(J);
      return J.has(V) ? (ne.debug("UI", "Room deselected:", { roomId: V, roomName: W }), se.delete(V)) : (ne.debug("UI", "Room selected:", { roomId: V, roomName: W }), se.set(V, W)), se;
    });
  }, []), R = D.useCallback((V) => {
    ne.debug("UI", "Cleaning mode modal:", V ? "opened" : "closed"), p(V);
  }, []), U = D.useCallback((V) => {
    ne.debug("UI", "Shortcuts modal:", V ? "opened" : "closed"), v(V);
  }, []), Y = D.useCallback((V) => {
    ne.debug("UI", "Settings panel:", V ? "opened" : "closed"), w(V);
  }, []), P = D.useCallback((V) => {
    ne.debug("UI", "Zone changed:", V), _(V);
  }, []), I = D.useCallback(() => {
    z((V) => {
      const W = V % 3 + 1;
      return Qw(W), ne.debug("UI", "Repeat count cycled to", W), W;
    });
  }, []), F = D.useCallback(() => {
    z(1), Jw(), ne.debug("UI", "Repeat count reset to 1");
  }, []);
  return {
    selectedMode: a,
    selectedRooms: s,
    selectedZone: d,
    modalOpened: m,
    shortcutsModalOpened: f,
    settingsPanelOpened: y,
    repeatCount: E,
    setSelectedMode: o,
    setSelectedRooms: l,
    setSelectedZone: P,
    setModalOpened: R,
    setShortcutsModalOpened: U,
    setSettingsPanelOpened: Y,
    handleModeChange: N,
    handleRoomToggle: j,
    cycleRepeatCount: I,
    resetRepeatCount: F
  };
}
const t1 = {
  // Common
  common: {
    run: "Run",
    start: "Start",
    stop: "Stop",
    cancel: "Cancel",
    save: "Save",
    apply: "Apply",
    reset: "Reset"
  },
  // Room Selector
  room_selector: {
    title: "Select Rooms",
    selected_count: "{{count}} selected"
  },
  // Map Selector
  map_selector: {
    unknown: "Unknown Map"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "No map available",
    looking_for: "Looking for: {{entity}}",
    room_overlay: "Click on room numbers to select rooms for cleaning",
    zone_overlay_create: "Click on the map to place a cleaning zone",
    zone_overlay_resize: "Drag corners to resize, click elsewhere to reposition",
    clear_zone: "Clear zone",
    switch_to_list: "Switch to list view",
    switch_to_map: "Switch to map view",
    room_list_overlay: "Tap rooms to select for cleaning",
    no_rooms: "No rooms available",
    zoom_in: "Zoom in",
    zoom_out: "Zoom out",
    zoom_reset: "Reset zoom",
    lock_map: "Lock map",
    unlock_map: "Unlock map"
  },
  // Mode Tabs
  modes: {
    room: "Room",
    all: "All",
    zone: "Zone"
  },
  // Action Buttons
  actions: {
    clean: "Clean",
    clean_all: "Clean All",
    clean_rooms: "Clean {{count}} Room",
    clean_rooms_plural: "Clean {{count}} Rooms",
    select_rooms: "Select Rooms",
    zone_clean: "Zone Clean",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    stop_and_dock: "Stop & Dock",
    dock: "Dock"
  },
  // Toast Messages
  toast: {
    selected_room: "Selected {{name}}",
    deselected_room: "Deselected {{name}}",
    paused: "Paused cleaning",
    stopped: "Stopped cleaning",
    docked: "Returning to dock",
    cleaning_started: "Cleaning started",
    resuming: "Resuming cleaning",
    starting_full_clean: "Starting full house cleaning",
    pausing_vacuum: "Pausing vacuum",
    stopping_vacuum: "Stopping vacuum",
    stopping_and_docking: "Stopping and returning to dock",
    vacuum_docking: "Vacuum returning to dock",
    starting_room_clean: "Starting cleaning for {{count}} selected room",
    starting_room_clean_plural: "Starting cleaning for {{count}} selected rooms",
    starting_zone_clean: "Starting zone cleaning",
    select_rooms_first: "Please select rooms to clean first",
    cannot_determine_map: "Cannot determine map dimensions",
    select_zone_first: "Please select a zone on the map"
  },
  // Room Selection Display
  room_display: {
    selected_rooms: "Selected Rooms:",
    selected_label: "Selected:"
  },
  // Cleaning Mode Button
  cleaning_mode_button: {
    prefix_custom: "Custom: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "View shortcuts",
    repeats_tooltip: "Cleaning passes",
    vac_and_mop: "Vac & Mop",
    mop_after_vac: "Mop after Vac",
    vacuum: "Vacuum",
    mop: "Mop"
  },
  // Cleaning Mode Modal
  cleaning_mode: {
    title: "Cleaning Mode",
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
    cleaning_mode_title: "Cleaning Mode",
    suction_power_title: "Suction Power",
    max_plus_description: "The suction power will be increased to the highest level, which is a single-use mode.",
    wetness_title: "Wetness",
    mop_pad_humidity_title: "Mop Pad Humidity",
    slightly_dry: "Slightly dry",
    moist: "Moist",
    wet: "Wet",
    water_volume_title: "Water Volume",
    water_low: "Low",
    water_medium: "Medium",
    water_high: "High",
    mop_washing_frequency_title: "Mop-washing frequency",
    route_title: "Route",
    mop_pressure_title: "Mop Pressure",
    mop_temperature_title: "Water Temperature"
  },
  // Mop pressure levels
  mop_pressure: {
    light: "Light",
    normal: "Normal"
  },
  // Mop temperature levels
  mop_temperature: {
    normal: "Normal",
    warm: "Warm"
  },
  // Customize Cleaning Mode
  customize: {
    title: "Customize",
    description: "Set personalized suction and mopping preferences for each area.",
    set_button: "Set",
    vacuum: "Vacuum",
    mop: "Mop",
    vac_and_mop: "Vac & Mop",
    cycles: "Cycles",
    apply_to_all: "Apply to All Rooms",
    click_room_hint: "Click the single area to change the mode.",
    intelligent_recommendation: "Intelligent Recommendation",
    select_room: "Select Room",
    settings_for: "{{room}} Settings",
    no_rooms: "No rooms available"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Cleaning Mode",
    deep_cleaning: "Deep Cleaning"
  },
  // Header
  header: {
    battery: "Battery",
    status: "Status",
    area: "Area",
    time: "Time"
  },
  // Units
  units: {
    square_meters: "m²",
    minutes: "min",
    minutes_short: "m",
    percent: "%",
    decibels: "dBm"
  },
  // Suction Levels (friendly names)
  suction_levels: {
    quiet: "Quiet",
    standard: "Standard",
    strong: "Turbo",
    turbo: "Max"
  },
  // Mop Washing Frequency
  mop_washing_frequency: {
    by_room: "By room",
    by_area: "By area",
    by_time: "By time"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "Quick",
    standard: "Standard",
    intensive: "Intensive",
    deep: "Deep"
  },
  // Errors
  errors: {
    entity_not_found: "Entity not found: {{entity}}",
    failed_to_load: "Failed to load entity data",
    service_call_failed: "Failed to send command to vacuum",
    entity_unavailable: "Vacuum is unavailable"
  },
  // Settings Panel
  settings: {
    title: "Settings",
    consumables: {
      title: "Consumables",
      main_brush: "Main Brush",
      side_brush: "Side Brush",
      filter: "Filter",
      sensor: "Sensor",
      mop_pad: "Mop Pad",
      silver_ion: "Silver Ion",
      detergent: "Detergent",
      squeegee: "Squeegee",
      tank_filter: "Tank Filter",
      onboard_dirty_water_tank: "Onboard Dirty Water Tank",
      dirty_water_channel: "Dirty Water Channel",
      deodorizer: "Deodorizer",
      wheel: "Wheel",
      scale_inhibitor: "Scale Inhibitor",
      fluffing_roller: "Fluffing Roller",
      roller_mop_filter: "Roller Mop Filter",
      water_outlet_filter: "Water Outlet Filter",
      remaining: "remaining",
      reset: "Reset"
    },
    device_info: {
      title: "Device Info",
      firmware: "Firmware",
      total_area: "Total Cleaned Area",
      total_time: "Total Cleaning Time",
      total_cleans: "Total Cleanings",
      wifi_ssid: "Wi-Fi Network",
      wifi_signal: "Signal Strength",
      ip_address: "IP Address"
    },
    quick_settings: {
      title: "Quick Settings",
      child_lock: "Child Lock",
      child_lock_desc: "Disable physical buttons on device",
      resume_cleaning: "Resume Cleaning",
      resume_cleaning_desc: "Automatically resume cleaning after charging",
      dnd: "Do Not Disturb",
      dnd_desc: "Quiet hours with reduced activity",
      dnd_start: "Start Time",
      dnd_end: "End Time",
      dnd_disable_resume: "Disable Resume",
      dnd_disable_resume_desc: "Do not resume cleaning during DND",
      dnd_disable_auto_empty: "Disable Auto Empty",
      dnd_disable_auto_empty_desc: "Do not auto empty during DND",
      dnd_reduce_volume: "Reduce Volume",
      dnd_reduce_volume_desc: "Lower device volume during DND"
    },
    volume: {
      title: "Volume & Sound",
      volume: "Volume",
      test_sound: "Locate",
      muted: "Muted",
      voice_assistant: "Voice Assistant",
      voice_assistant_desc: "Enable voice announcements and feedback",
      voice_language: "Voice Language",
      voice_language_desc: "Language for voice announcements",
      streaming_voice_prompt: "Streaming Voice Prompt",
      streaming_voice_prompt_desc: "Real-time voice feedback during cleaning"
    },
    carpet: {
      title: "Carpet Settings",
      carpet_recognition: "Carpet Recognition",
      carpet_recognition_desc: "Detect carpets automatically",
      carpet_avoidance: "Carpet Avoidance",
      carpet_avoidance_desc: "Avoid carpets while mopping",
      clean_carpets_first: "Clean Carpets First",
      clean_carpets_first_desc: "Vacuum carpets before mopping floors",
      carpet_boost: "Carpet Boost",
      carpet_boost_desc: "Increase suction power on carpets",
      intensive_cleaning: "Intensive Cleaning",
      intensive_cleaning_desc: "Deep clean carpets with extra passes",
      side_brush_rotate: "Side Brush Rotate",
      side_brush_rotate_desc: "Rotate side brush on carpets",
      sensitivity: "Carpet Sensitivity",
      sensitivity_desc: "Detection sensitivity level",
      sensitivity_low: "Low",
      sensitivity_medium: "Medium",
      sensitivity_high: "High",
      cleaning_mode: "Carpet Cleaning",
      cleaning_mode_desc: "How to handle carpets during cleaning",
      mode_vacuum: "Vacuum",
      mode_vacuum_and_mop: "Vac & Mop",
      mode_avoidance: "Avoid",
      mode_ignore: "Ignore",
      vacuum_mode: "Vacuum Mode",
      vacuum_adaptation: "Mop Lift",
      vacuum_remove_mop: "Remove Mop"
    },
    floor: {
      title: "Floor Settings",
      obstacle_avoidance: "Obstacle Avoidance",
      obstacle_avoidance_desc: "Use sensors to avoid obstacles",
      collision_avoidance: "Collision Avoidance",
      collision_avoidance_desc: "Slow down near walls and furniture",
      auto_mount_mop: "Auto Mount Mop",
      auto_mount_mop_desc: "Automatically attach mop pad when needed",
      auto_recleaning: "Auto Re-Cleaning",
      auto_recleaning_desc: "Automatically re-clean missed areas",
      recleaning_off: "Off",
      recleaning_in_deep_mode: "In Deep Mode",
      recleaning_in_all_modes: "In All Modes",
      stain_avoidance: "Stain Avoidance",
      stain_avoidance_desc: "Avoid detected stains",
      tight_mopping: "Tight Mopping",
      tight_mopping_desc: "Mop closer to walls and edges",
      floor_direction_cleaning: "Floor Direction Cleaning",
      floor_direction_cleaning_desc: "Clean along the floor grain direction",
      large_particles_boost: "Large Particles Boost",
      large_particles_boost_desc: "Increase suction for large debris",
      pet_focused_cleaning: "Pet Focused Cleaning",
      pet_focused_cleaning_desc: "Extra cleaning in pet areas",
      low_lying_area_frequency: "Low-Lying Area Frequency",
      low_lying_area_frequency_desc: "How often to clean low-lying areas under furniture"
    },
    edge_corner: {
      title: "Edge & Corner",
      side_reach: "Side Reach",
      side_reach_desc: "Extend side brush to reach edges",
      mop_extend: "Mop Extend",
      mop_extend_desc: "Extend mop pad to clean edges and corners",
      gap_cleaning: "Gap Cleaning",
      gap_cleaning_desc: "Clean narrow gaps between furniture",
      mopping_under: "Mop Under Furniture",
      mopping_under_desc: "Extend mop to clean under low furniture",
      extend_frequency: "Extend Frequency",
      extend_frequency_desc: "How often to extend mop for edge cleaning",
      frequency_standard: "Standard",
      frequency_intelligent: "Intelligent",
      frequency_high: "High"
    },
    dock: {
      title: "Dock Settings",
      self_clean: "Self Clean",
      self_clean_desc: "Auto wash mop after cleaning",
      auto_empty_mode: "Auto Empty Mode",
      auto_empty_mode_desc: "When to automatically empty the dustbin",
      auto_empty_frequency: "Auto Empty Frequency",
      auto_empty_frequency_desc: "How many cleanings before auto-emptying",
      empty_off: "Off",
      empty_standard: "Standard",
      empty_high_frequency: "High Frequency",
      empty_low_frequency: "Low Frequency",
      auto_detergent: "Auto Add Detergent",
      auto_detergent_desc: "Automatically add detergent when washing",
      mop_washing_with_detergent: "Mop Washing With Detergent",
      mop_washing_with_detergent_desc: "Use detergent when washing mop pad",
      mopping_with_detergent: "Mopping With Detergent",
      mopping_with_detergent_desc: "Use detergent while mopping floors",
      water_electrolysis: "Water Electrolysis",
      water_electrolysis_desc: "Sterilize water using electrolysis",
      auto_water_refilling: "Auto Water Refilling",
      auto_water_refilling_desc: "Automatically refill clean water tank",
      auto_dust_collecting: "Auto Dust Collecting",
      auto_dust_collecting_desc: "Automatically empty dustbin after cleaning",
      smart_washing: "Smart Mop Washing",
      smart_washing_desc: "Intelligently adjust washing based on dirt level",
      mop_wash_level: "Mop Wash Level",
      mop_wash_level_desc: "Intensity of mop pad washing",
      washing_mode: "Washing Mode",
      washing_mode_desc: "Intensity of mop pad washing",
      washing_light: "Light",
      washing_standard: "Standard",
      washing_deep: "Deep",
      water_temperature: "Water Temperature",
      water_temperature_desc: "Temperature for mop washing",
      temp_normal: "Normal",
      temp_mild: "Mild",
      temp_warm: "Warm",
      temp_hot: "Hot",
      auto_drying: "Auto Drying",
      auto_drying_desc: "Automatically dry mop pad after cleaning",
      drying_time: "Drying Time",
      drying_time_desc: "Duration for mop pad drying",
      auto_rewashing: "Auto Rewashing",
      auto_rewashing_desc: "Automatically rewash mop when dirty",
      rewashing_off: "Off",
      rewashing_in_deep_mode: "In Deep Mode",
      rewashing_in_all_modes: "In All Modes",
      off_peak_charging: "Off-Peak Charging",
      off_peak_charging_desc: "Charge during off-peak hours to save energy",
      off_peak_charging_start: "Start Time",
      off_peak_charging_end: "End Time",
      station_cleaning: "Station Cleaning",
      station_cleaning_desc: "Clean the base station",
      clean_now: "Clean Now",
      self_repair: "Self Repair",
      self_repair_desc: "Run station self-repair diagnostics",
      repair_now: "Repair",
      scraper_frequency: "Scraper Frequency",
      scraper_frequency_desc: "How often to clean the rubber scraper"
    },
    ai_detection: {
      title: "AI & Detection",
      intelligent_recognition: "Intelligent Recognition",
      intelligent_recognition_desc: "AI-powered environment recognition",
      ai_obstacle_detection: "AI Obstacle Detection",
      ai_obstacle_detection_desc: "Use AI to identify and avoid obstacles",
      fuzzy_obstacle_detection: "Fuzzy Obstacle Detection",
      fuzzy_obstacle_detection_desc: "Detect soft or unclear obstacles",
      ai_obstacle_image_upload: "Obstacle Image Upload",
      ai_obstacle_image_upload_desc: "Upload obstacle images for analysis",
      ai_obstacle_picture: "Obstacle Picture",
      ai_obstacle_picture_desc: "Take pictures of detected obstacles",
      ai_pet_detection: "Pet Detection",
      ai_pet_detection_desc: "Detect and avoid pets",
      ai_pet_avoidance: "Pet Avoidance",
      ai_pet_avoidance_desc: "Actively avoid detected pets",
      pet_focused_detection: "Pet Focused Detection",
      pet_focused_detection_desc: "Enhanced detection for pet areas",
      pet_picture: "Pet Picture",
      pet_picture_desc: "Take pictures of detected pets",
      ai_human_detection: "Human Detection",
      ai_human_detection_desc: "Detect and avoid humans",
      human_follow: "Human Follow",
      human_follow_desc: "Follow humans for interactive cleaning",
      ai_furniture_detection: "Furniture Detection",
      ai_furniture_detection_desc: "Detect and navigate around furniture",
      ai_fluid_detection: "Fluid Detection",
      ai_fluid_detection_desc: "Detect and avoid liquids",
      fill_light: "Fill Light",
      fill_light_desc: "Use fill light for better detection",
      camera_light_auto: "Auto Camera Brightness",
      camera_light_auto_desc: "Automatically adjust camera light brightness",
      camera_light_brightness: "Camera Light Brightness",
      camera_light_brightness_desc: "Manual camera light brightness level"
    },
    station_controls: {
      title: "Station Controls",
      self_clean: "Self Clean",
      self_clean_desc: "Start mop pad washing cycle",
      manual_drying: "Manual Drying",
      manual_drying_desc: "Start mop pad drying cycle",
      water_tank_draining: "Drain Water Tank",
      water_tank_draining_desc: "Drain dirty water from tank",
      base_station_cleaning: "Clean Station",
      base_station_cleaning_desc: "Clean the base station",
      empty_water_tank: "Empty Water Tank",
      empty_water_tank_desc: "Empty the water collection tank",
      start_auto_empty: "Auto Empty",
      start_auto_empty_desc: "Start automatic dustbin emptying",
      start_recleaning: "Reclean",
      start_recleaning_desc: "Start recleaning missed areas",
      clear_warning: "Clear Warning",
      clear_warning_desc: "Clear current warning messages"
    },
    map: {
      title: "Map Settings",
      multi_floor: "Multi-Floor Map",
      multi_floor_desc: "Enable support for multiple floor maps",
      rotation: "Map Rotation",
      rotation_desc: "Rotate map orientation",
      mapping_actions: "Mapping Actions",
      start_mapping: "Start Mapping",
      start_fast_mapping: "Fast Mapping"
    }
  }
}, n1 = {
  // Common
  common: {
    run: "Ausführen",
    start: "Start",
    stop: "Stopp",
    cancel: "Abbrechen",
    save: "Speichern",
    apply: "Anwenden",
    reset: "Zurücksetzen"
  },
  // Room Selector
  room_selector: {
    title: "Räume auswählen",
    selected_count: "{{count}} ausgewählt"
  },
  // Map Selector
  map_selector: {
    unknown: "Unbekannte Karte"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "Keine Karte verfügbar",
    looking_for: "Suche nach: {{entity}}",
    room_overlay: "Klicken Sie auf Raumnummern, um Räume zum Reinigen auszuwählen",
    zone_overlay_create: "Klicken Sie auf die Karte, um eine Reinigungszone zu platzieren",
    zone_overlay_resize: "Ziehen Sie an den Ecken, um die Größe zu ändern, oder klicken Sie woanders, um neu zu positionieren",
    clear_zone: "Zone löschen",
    switch_to_list: "Zur Listenansicht wechseln",
    switch_to_map: "Zur Kartenansicht wechseln",
    room_list_overlay: "Räume antippen, um sie für die Reinigung auszuwählen",
    no_rooms: "Keine Räume verfügbar",
    zoom_in: "Vergrößern",
    zoom_out: "Verkleinern",
    zoom_reset: "Zoom zurücksetzen",
    lock_map: "Karte sperren",
    unlock_map: "Karte entsperren"
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
    stop_and_dock: "Stopp & Andocken",
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
    stopping_vacuum: "Saugroboter wird gestoppt",
    stopping_and_docking: "Stoppen und zur Basis zurückkehren",
    vacuum_docking: "Saugroboter kehrt zur Station zurück",
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
    repeats_tooltip: "Reinigungsdurchgänge",
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
    mop_pad_humidity_title: "Wischmopp-Feuchtigkeit",
    slightly_dry: "Leicht trocken",
    moist: "Feucht",
    wet: "Nass",
    water_volume_title: "Wassermenge",
    water_low: "Niedrig",
    water_medium: "Mittel",
    water_high: "Hoch",
    mop_washing_frequency_title: "Wischmopp-Waschfrequenz",
    route_title: "Route",
    mop_pressure_title: "Wischdruck",
    mop_temperature_title: "Wassertemperatur"
  },
  // Mop pressure levels
  mop_pressure: {
    light: "Leicht",
    normal: "Normal"
  },
  // Mop temperature levels
  mop_temperature: {
    normal: "Normal",
    warm: "Warm"
  },
  // Customize Cleaning Mode
  customize: {
    title: "Anpassen",
    description: "Personalisierte Saug- und Wischeinstellungen für jeden Bereich festlegen.",
    set_button: "Einstellen",
    vacuum: "Saugen",
    mop: "Wischen",
    vac_and_mop: "Saugen & Wischen",
    cycles: "Durchgänge",
    apply_to_all: "Auf alle Räume anwenden",
    click_room_hint: "Klicken Sie auf einen Bereich, um den Modus zu ändern.",
    intelligent_recommendation: "Intelligente Empfehlung",
    select_room: "Raum auswählen",
    settings_for: "{{room}} Einstellungen",
    no_rooms: "Keine Räume verfügbar"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Reinigungsmodus",
    deep_cleaning: "Tiefenreinigung"
  },
  // Header
  header: {
    battery: "Batterie",
    status: "Status",
    area: "Fläche",
    time: "Zeit"
  },
  // Units
  units: {
    square_meters: "m²",
    minutes: "min",
    minutes_short: "m",
    percent: "%",
    decibels: "dBm"
  },
  // Suction Levels (friendly names)
  suction_levels: {
    quiet: "Leise",
    standard: "Standard",
    strong: "Turbo",
    turbo: "Max"
  },
  // Mop Washing Frequency
  mop_washing_frequency: {
    by_room: "Nach Raum",
    by_area: "Nach Fläche",
    by_time: "Nach Zeit"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "Schnell",
    standard: "Standard",
    intensive: "Intensiv",
    deep: "Tief"
  },
  // Errors
  errors: {
    entity_not_found: "Entität nicht gefunden: {{entity}}",
    failed_to_load: "Entitätsdaten konnten nicht geladen werden",
    service_call_failed: "Befehl konnte nicht an den Staubsauger gesendet werden",
    entity_unavailable: "Staubsauger nicht verfügbar"
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
      mop_pad: "Wischpad",
      silver_ion: "Silberionen",
      detergent: "Reinigungsmittel",
      squeegee: "Abzieher",
      tank_filter: "Tankfilter",
      onboard_dirty_water_tank: "Onboard-Schmutzwassertank",
      dirty_water_channel: "Schmutzwasserkanal",
      deodorizer: "Deodorizer",
      wheel: "Rad",
      scale_inhibitor: "Kalkschutz",
      fluffing_roller: "Auflockerungswalze",
      roller_mop_filter: "Rollenmopp-Filter",
      water_outlet_filter: "Wasserauslassfilter",
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
    quick_settings: {
      title: "Schnelleinstellungen",
      child_lock: "Kindersicherung",
      child_lock_desc: "Tasten am Gerät deaktivieren",
      resume_cleaning: "Reinigung fortsetzen",
      resume_cleaning_desc: "Reinigung nach dem Laden automatisch fortsetzen",
      dnd: "Nicht stören",
      dnd_desc: "Ruhezeiten mit reduzierter Aktivität",
      dnd_start: "Startzeit",
      dnd_end: "Endzeit",
      dnd_disable_resume: "Fortsetzen deaktivieren",
      dnd_disable_resume_desc: "Reinigung während DND nicht fortsetzen",
      dnd_disable_auto_empty: "Auto-Entleerung deaktivieren",
      dnd_disable_auto_empty_desc: "Während DND nicht automatisch entleeren",
      dnd_reduce_volume: "Lautstärke reduzieren",
      dnd_reduce_volume_desc: "Gerätelautstärke während DND verringern"
    },
    volume: {
      title: "Lautstärke & Ton",
      volume: "Lautstärke",
      test_sound: "Finden",
      muted: "Stumm",
      voice_assistant: "Sprachassistent",
      voice_assistant_desc: "Sprachansagen und Feedback aktivieren",
      voice_language: "Sprachsprache",
      voice_language_desc: "Sprache für Ansagen",
      streaming_voice_prompt: "Streaming-Sprachansage",
      streaming_voice_prompt_desc: "Echtzeit-Sprachfeedback während der Reinigung"
    },
    carpet: {
      title: "Teppich-Einstellungen",
      carpet_recognition: "Teppicherkennung",
      carpet_recognition_desc: "Teppiche automatisch erkennen",
      carpet_avoidance: "Teppichvermeidung",
      carpet_avoidance_desc: "Teppiche beim Wischen vermeiden",
      clean_carpets_first: "Teppiche zuerst reinigen",
      clean_carpets_first_desc: "Teppiche vor dem Wischen saugen",
      carpet_boost: "Teppich-Boost",
      carpet_boost_desc: "Saugkraft auf Teppichen erhöhen",
      intensive_cleaning: "Intensivreinigung",
      intensive_cleaning_desc: "Teppiche mit extra Durchgängen reinigen",
      side_brush_rotate: "Seitenbürste drehen",
      side_brush_rotate_desc: "Seitenbürste auf Teppichen drehen",
      sensitivity: "Teppich-Empfindlichkeit",
      sensitivity_desc: "Erkennungsempfindlichkeit",
      sensitivity_low: "Niedrig",
      sensitivity_medium: "Mittel",
      sensitivity_high: "Hoch",
      cleaning_mode: "Teppichreinigung",
      cleaning_mode_desc: "Verhalten bei Teppichen während der Reinigung",
      mode_vacuum: "Saugen",
      mode_vacuum_and_mop: "Saug & Wisch",
      mode_avoidance: "Vermeiden",
      mode_ignore: "Ignorieren",
      vacuum_mode: "Saugmodus",
      vacuum_adaptation: "Mopp anheben",
      vacuum_remove_mop: "Mopp entfernen"
    },
    floor: {
      title: "Boden-Einstellungen",
      obstacle_avoidance: "Hindernisvermeidung",
      obstacle_avoidance_desc: "Sensoren zur Hindernisvermeidung verwenden",
      collision_avoidance: "Kollisionsvermeidung",
      collision_avoidance_desc: "Langsamer an Wänden und Möbeln",
      auto_mount_mop: "Auto-Mopp montieren",
      auto_mount_mop_desc: "Moppaufsatz automatisch anbringen",
      auto_recleaning: "Auto-Nachreinigung",
      auto_recleaning_desc: "Verpasste Bereiche automatisch nachreinigen",
      recleaning_off: "Aus",
      recleaning_in_deep_mode: "Im Tiefenmodus",
      recleaning_in_all_modes: "In allen Modi",
      stain_avoidance: "Fleckenvermeidung",
      stain_avoidance_desc: "Erkannte Flecken vermeiden",
      tight_mopping: "Gründliches Wischen",
      tight_mopping_desc: "Näher an Wänden und Kanten wischen",
      floor_direction_cleaning: "Bodenrichtungsreinigung",
      floor_direction_cleaning_desc: "Entlang der Bodenmaserung reinigen",
      large_particles_boost: "Großpartikel-Boost",
      large_particles_boost_desc: "Saugleistung für große Partikel erhöhen",
      pet_focused_cleaning: "Haustier-fokussierte Reinigung",
      pet_focused_cleaning_desc: "Extra Reinigung in Haustierbereichen",
      low_lying_area_frequency: "Niedrigbereich-Häufigkeit",
      low_lying_area_frequency_desc: "Wie oft niedrige Bereiche unter Möbeln gereinigt werden"
    },
    edge_corner: {
      title: "Kanten & Ecken",
      side_reach: "Seitenreichweite",
      side_reach_desc: "Seitenbürste für Kanten ausfahren",
      mop_extend: "Mopp ausfahren",
      mop_extend_desc: "Mopp für Kanten und Ecken ausfahren",
      gap_cleaning: "Spaltenreinigung",
      gap_cleaning_desc: "Enge Spalten zwischen Möbeln reinigen",
      mopping_under: "Unter Möbeln wischen",
      mopping_under_desc: "Mopp unter niedrige Möbel ausfahren",
      extend_frequency: "Ausfahrhäufigkeit",
      extend_frequency_desc: "Wie oft der Mopp für Kantenreinigung ausfahren soll",
      frequency_standard: "Standard",
      frequency_intelligent: "Intelligent",
      frequency_high: "Hoch"
    },
    dock: {
      title: "Dock-Einstellungen",
      self_clean: "Selbstreinigung",
      self_clean_desc: "Mopp nach Reinigung automatisch waschen",
      auto_empty_mode: "Auto-Entleerungsmodus",
      auto_empty_mode_desc: "Wann der Staubbehälter automatisch entleert werden soll",
      auto_empty_frequency: "Auto-Entleerungsfrequenz",
      auto_empty_frequency_desc: "Anzahl der Reinigungen vor automatischer Entleerung",
      empty_off: "Aus",
      empty_standard: "Standard",
      empty_high_frequency: "Hohe Frequenz",
      empty_low_frequency: "Niedrige Frequenz",
      auto_detergent: "Auto Reinigungsmittel",
      auto_detergent_desc: "Automatisch Reinigungsmittel beim Waschen hinzufügen",
      mop_washing_with_detergent: "Moppwäsche mit Reinigungsmittel",
      mop_washing_with_detergent_desc: "Reinigungsmittel beim Waschen des Mopps verwenden",
      mopping_with_detergent: "Wischen mit Reinigungsmittel",
      mopping_with_detergent_desc: "Reinigungsmittel beim Wischen des Bodens verwenden",
      water_electrolysis: "Wasserelektrolyse",
      water_electrolysis_desc: "Wasser durch Elektrolyse sterilisieren",
      auto_water_refilling: "Auto Wassernachfüllung",
      auto_water_refilling_desc: "Frischwassertank automatisch nachfüllen",
      auto_dust_collecting: "Auto Staubsammlung",
      auto_dust_collecting_desc: "Staubbehälter nach Reinigung automatisch entleeren",
      smart_washing: "Intelligentes Waschen",
      smart_washing_desc: "Waschen intelligent an Verschmutzung anpassen",
      mop_wash_level: "Mopp-Waschstufe",
      mop_wash_level_desc: "Intensität der Moppwäsche",
      washing_mode: "Waschmodus",
      washing_mode_desc: "Intensität der Moppwäsche",
      washing_light: "Leicht",
      washing_standard: "Standard",
      washing_deep: "Intensiv",
      water_temperature: "Wassertemperatur",
      water_temperature_desc: "Temperatur für die Moppwäsche",
      temp_normal: "Normal",
      temp_mild: "Mild",
      temp_warm: "Warm",
      temp_hot: "Heiß",
      auto_drying: "Auto-Trocknung",
      auto_drying_desc: "Mopp nach der Reinigung automatisch trocknen",
      drying_time: "Trocknungszeit",
      drying_time_desc: "Dauer der Mopptrocknung",
      auto_rewashing: "Auto-Nachwaschen",
      auto_rewashing_desc: "Mopp bei Verschmutzung automatisch nachwaschen",
      rewashing_off: "Aus",
      rewashing_in_deep_mode: "Im Tiefenmodus",
      rewashing_in_all_modes: "In allen Modi",
      off_peak_charging: "Schwachlastladen",
      off_peak_charging_desc: "Während Schwachlastzeiten laden um Energie zu sparen",
      off_peak_charging_start: "Startzeit",
      off_peak_charging_end: "Endzeit",
      station_cleaning: "Station reinigen",
      station_cleaning_desc: "Die Basisstation reinigen",
      clean_now: "Jetzt reinigen",
      self_repair: "Selbstreparatur",
      self_repair_desc: "Stations-Selbstdiagnose ausführen",
      repair_now: "Reparieren",
      scraper_frequency: "Schaber-Häufigkeit",
      scraper_frequency_desc: "Wie oft der Gummischaber gereinigt wird"
    },
    ai_detection: {
      title: "KI & Erkennung",
      intelligent_recognition: "Intelligente Erkennung",
      intelligent_recognition_desc: "KI-gestützte Umgebungserkennung",
      ai_obstacle_detection: "KI-Hinderniserkennung",
      ai_obstacle_detection_desc: "KI zur Erkennung und Vermeidung von Hindernissen nutzen",
      fuzzy_obstacle_detection: "Unscharfe Hinderniserkennung",
      fuzzy_obstacle_detection_desc: "Weiche oder undeutliche Hindernisse erkennen",
      ai_obstacle_image_upload: "Hindernis-Bilder hochladen",
      ai_obstacle_image_upload_desc: "Hindernisbilder zur Analyse hochladen",
      ai_obstacle_picture: "Hindernisbild",
      ai_obstacle_picture_desc: "Bilder von erkannten Hindernissen aufnehmen",
      ai_pet_detection: "Haustiererkennung",
      ai_pet_detection_desc: "Haustiere erkennen und vermeiden",
      ai_pet_avoidance: "Haustiervermeidung",
      ai_pet_avoidance_desc: "Erkannte Haustiere aktiv vermeiden",
      pet_focused_detection: "Haustier-fokussierte Erkennung",
      pet_focused_detection_desc: "Verbesserte Erkennung für Haustierbereiche",
      pet_picture: "Haustierbild",
      pet_picture_desc: "Bilder von erkannten Haustieren aufnehmen",
      ai_human_detection: "Personenerkennung",
      ai_human_detection_desc: "Personen erkennen und vermeiden",
      human_follow: "Person folgen",
      human_follow_desc: "Personen für interaktive Reinigung folgen",
      ai_furniture_detection: "Möbelerkennung",
      ai_furniture_detection_desc: "Möbel erkennen und umfahren",
      ai_fluid_detection: "Flüssigkeitserkennung",
      ai_fluid_detection_desc: "Flüssigkeiten erkennen und vermeiden",
      fill_light: "Zusatzlicht",
      fill_light_desc: "Zusatzlicht für bessere Erkennung nutzen",
      camera_light_auto: "Auto-Kamerahelligkeit",
      camera_light_auto_desc: "Kameralicht-Helligkeit automatisch anpassen",
      camera_light_brightness: "Kameralicht-Helligkeit",
      camera_light_brightness_desc: "Manuelle Kameralicht-Helligkeit"
    },
    station_controls: {
      title: "Stationssteuerung",
      self_clean: "Selbstreinigung",
      self_clean_desc: "Wischmoppwaschzyklus starten",
      manual_drying: "Manuelle Trocknung",
      manual_drying_desc: "Wischmopp-Trockenzyklus starten",
      water_tank_draining: "Wassertank entleeren",
      water_tank_draining_desc: "Schmutzwasser aus dem Tank ablassen",
      base_station_cleaning: "Station reinigen",
      base_station_cleaning_desc: "Die Basisstation reinigen",
      empty_water_tank: "Wassertank leeren",
      empty_water_tank_desc: "Den Wassersammelbehälter leeren",
      start_auto_empty: "Auto-Entleerung",
      start_auto_empty_desc: "Automatische Staubbehälter-Entleerung starten",
      start_recleaning: "Nachreinigung",
      start_recleaning_desc: "Nachreinigung verpasster Bereiche starten",
      clear_warning: "Warnung löschen",
      clear_warning_desc: "Aktuelle Warnmeldungen löschen"
    },
    map: {
      title: "Karten-Einstellungen",
      multi_floor: "Mehrere Etagen",
      multi_floor_desc: "Unterstützung für mehrere Etagenkarten aktivieren",
      rotation: "Kartenrotation",
      rotation_desc: "Kartenausrichtung drehen",
      mapping_actions: "Kartierungsaktionen",
      start_mapping: "Kartierung starten",
      start_fast_mapping: "Schnellkartierung"
    }
  }
}, a1 = {
  // Common
  common: {
    run: "Запустить",
    start: "Старт",
    stop: "Стоп",
    cancel: "Отмена",
    save: "Сохранить",
    apply: "Применить",
    reset: "Сбросить"
  },
  // Room Selector
  room_selector: {
    title: "Выбор комнат",
    selected_count: "{{count}} выбрано"
  },
  // Map Selector
  map_selector: {
    unknown: "Неизвестная карта"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "Нет доступной карты",
    looking_for: "Обнаружение: {{entity}}",
    room_overlay: "Кликните на номера комнат чтобы выбрать комнаты для убокри",
    zone_overlay_create: "Кликните на карту для добавления зоны уборки",
    zone_overlay_resize: "Потяните за углы для изменения размеры, кликните на любом месте для новой зоны",
    clear_zone: "Уборка зоны",
    switch_to_list: "Переключить на список",
    switch_to_map: "Переключить на карту",
    room_list_overlay: "Нажмите на комнаты для выбора уборки",
    no_rooms: "Нет доступных комнат",
    zoom_in: "Увеличить",
    zoom_out: "Уменьшить",
    zoom_reset: "Сбросить масштаб",
    lock_map: "Заблокировать карту",
    unlock_map: "Разблокировать карту"
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
    stop_and_dock: "Стоп и на базу",
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
    pausing_vacuum: "Приостановка пылесоса",
    stopping_vacuum: "Остановка пылесоса",
    stopping_and_docking: "Остановка и возврат на базу",
    vacuum_docking: "Пылесос возвращается на базу",
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
    repeats_tooltip: "Количество проходов",
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
    mop_pad_humidity_title: "Влажность швабры",
    slightly_dry: "Слегка сухая",
    moist: "Влажная",
    wet: "Мокрая",
    water_volume_title: "Объём воды",
    water_low: "Низкий",
    water_medium: "Средний",
    water_high: "Высокий",
    mop_washing_frequency_title: "Периодичность промывки швабры",
    route_title: "Маршрут",
    mop_pressure_title: "Давление швабры",
    mop_temperature_title: "Температура воды"
  },
  // Mop pressure levels
  mop_pressure: {
    light: "Лёгкое",
    normal: "Нормальное"
  },
  // Mop temperature levels
  mop_temperature: {
    normal: "Обычная",
    warm: "Тёплая"
  },
  // Customize Cleaning Mode
  customize: {
    title: "Настроить",
    description: "Установите персонализированные настройки всасывания и влажности для каждой зоны.",
    set_button: "Установить",
    vacuum: "Пылесос",
    mop: "Швабра",
    vac_and_mop: "Пылесос и швабра",
    cycles: "Циклы",
    apply_to_all: "Применить ко всем комнатам",
    click_room_hint: "Нажмите на зону, чтобы изменить режим.",
    intelligent_recommendation: "Умная рекомендация",
    select_room: "Выберите комнату",
    settings_for: "Настройки {{room}}",
    no_rooms: "Комнаты не найдены"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Режим уборки",
    deep_cleaning: "Тщательная уборка"
  },
  // Header
  header: {
    battery: "Батарея",
    status: "Статус",
    area: "Площадь",
    time: "Время"
  },
  // Units
  units: {
    square_meters: "м²",
    minutes: "мин",
    minutes_short: "м",
    percent: "%",
    decibels: "дБм"
  },
  // Suction Levels (friendly names)
  suction_levels: {
    quiet: "Тихий",
    standard: "Стандартный",
    strong: "Турбо",
    turbo: "Макс"
  },
  // Mop Washing Frequency
  mop_washing_frequency: {
    by_room: "По комнате",
    by_area: "По площади",
    by_time: "По времени"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "Быстрый",
    standard: "Стандартный",
    intensive: "Интенсивный",
    deep: "Глубокий"
  },
  // Errors
  errors: {
    entity_not_found: "Сущность не найдена: {{entity}}",
    failed_to_load: "Не удалось загрузить данные сущности",
    service_call_failed: "Не удалось отправить команду пылесосу",
    entity_unavailable: "Пылесос недоступен"
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
      mop_pad: "Моп",
      silver_ion: "Серебряный ион",
      detergent: "Моющее средство",
      squeegee: "Скребок",
      tank_filter: "Фильтр бака",
      onboard_dirty_water_tank: "Бортовой бак грязной воды",
      dirty_water_channel: "Канал грязной воды",
      deodorizer: "Дезодорант",
      wheel: "Колесо",
      scale_inhibitor: "Средство от накипи",
      fluffing_roller: "Взбивающий ролик",
      roller_mop_filter: "Фильтр роликового мопа",
      water_outlet_filter: "Фильтр выхода воды",
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
    quick_settings: {
      title: "Быстрые настройки",
      child_lock: "Блокировка от детей",
      child_lock_desc: "Отключить кнопки на устройстве",
      resume_cleaning: "Продолжить уборку",
      resume_cleaning_desc: "Автоматически продолжить уборку после зарядки",
      dnd: "Не беспокоить",
      dnd_desc: "Тихие часы с ограниченной активностью",
      dnd_start: "Время начала",
      dnd_end: "Время окончания",
      dnd_disable_resume: "Отключить продолжение",
      dnd_disable_resume_desc: "Не продолжать уборку в режиме DND",
      dnd_disable_auto_empty: "Отключить авто-опустошение",
      dnd_disable_auto_empty_desc: "Не опустошать автоматически в режиме DND",
      dnd_reduce_volume: "Уменьшить громкость",
      dnd_reduce_volume_desc: "Уменьшить громкость устройства в режиме DND"
    },
    volume: {
      title: "Громкость и звук",
      volume: "Громкость",
      test_sound: "Найти",
      muted: "Без звука",
      voice_assistant: "Голосовой помощник",
      voice_assistant_desc: "Включить голосовые объявления и обратную связь",
      voice_language: "Язык голоса",
      voice_language_desc: "Язык голосовых объявлений",
      streaming_voice_prompt: "Потоковые голосовые подсказки",
      streaming_voice_prompt_desc: "Голосовая обратная связь в реальном времени во время уборки"
    },
    carpet: {
      title: "Настройки ковров",
      carpet_recognition: "Распознавание ковров",
      carpet_recognition_desc: "Автоматически распознавать ковры",
      carpet_avoidance: "Избегание ковров",
      carpet_avoidance_desc: "Избегать ковров при влажной уборке",
      clean_carpets_first: "Сначала ковры",
      clean_carpets_first_desc: "Пылесосить ковры перед мытьём полов",
      carpet_boost: "Усиление на коврах",
      carpet_boost_desc: "Увеличить мощность всасывания на коврах",
      intensive_cleaning: "Интенсивная уборка",
      intensive_cleaning_desc: "Глубокая очистка ковров с доп. проходами",
      side_brush_rotate: "Вращение боковой щётки",
      side_brush_rotate_desc: "Вращать боковую щётку на коврах",
      sensitivity: "Чувствительность ковра",
      sensitivity_desc: "Уровень чувствительности распознавания",
      sensitivity_low: "Низкая",
      sensitivity_medium: "Средняя",
      sensitivity_high: "Высокая",
      cleaning_mode: "Уборка ковров",
      cleaning_mode_desc: "Поведение при уборке ковров",
      mode_vacuum: "Пылесос",
      mode_vacuum_and_mop: "Пыл. и швабра",
      mode_avoidance: "Избегать",
      mode_ignore: "Игнорировать",
      vacuum_mode: "Режим пылесоса",
      vacuum_adaptation: "Поднять швабру",
      vacuum_remove_mop: "Снять тряпку"
    },
    floor: {
      title: "Настройки пола",
      obstacle_avoidance: "Избегание препятствий",
      obstacle_avoidance_desc: "Использовать датчики для обхода препятствий",
      collision_avoidance: "Избегание столкновений",
      collision_avoidance_desc: "Замедление у стен и мебели",
      auto_mount_mop: "Авто-установка швабры",
      auto_mount_mop_desc: "Автоматически прикреплять насадку для мытья",
      auto_recleaning: "Авто-перечистка",
      auto_recleaning_desc: "Автоматически перечищать пропущенные участки",
      recleaning_off: "Выкл",
      recleaning_in_deep_mode: "В глубоком режиме",
      recleaning_in_all_modes: "Во всех режимах",
      stain_avoidance: "Избегание пятен",
      stain_avoidance_desc: "Обходить обнаруженные пятна",
      tight_mopping: "Тщательная мойка",
      tight_mopping_desc: "Мыть ближе к стенам и краям",
      floor_direction_cleaning: "Уборка по направлению пола",
      floor_direction_cleaning_desc: "Убирать вдоль направления волокон пола",
      large_particles_boost: "Усиление для крупных частиц",
      large_particles_boost_desc: "Увеличить всасывание для крупного мусора",
      pet_focused_cleaning: "Уборка в зонах питомцев",
      pet_focused_cleaning_desc: "Дополнительная уборка в местах обитания питомцев",
      low_lying_area_frequency: "Частота уборки низких зон",
      low_lying_area_frequency_desc: "Как часто убирать низкие зоны под мебелью"
    },
    edge_corner: {
      title: "Края и углы",
      side_reach: "Боковой охват",
      side_reach_desc: "Выдвижение боковой щётки для краёв",
      mop_extend: "Выдвижение швабры",
      mop_extend_desc: "Выдвижение швабры для краёв и углов",
      gap_cleaning: "Очистка щелей",
      gap_cleaning_desc: "Очистка узких щелей между мебелью",
      mopping_under: "Мытьё под мебелью",
      mopping_under_desc: "Выдвижение швабры под низкую мебель",
      extend_frequency: "Частота выдвижения",
      extend_frequency_desc: "Как часто выдвигать швабру для краёв",
      frequency_standard: "Стандартная",
      frequency_intelligent: "Умная",
      frequency_high: "Высокая"
    },
    dock: {
      title: "Настройки станции",
      self_clean: "Самоочистка",
      self_clean_desc: "Авто-мойка швабры после уборки",
      auto_empty_mode: "Авто-опустошение",
      auto_empty_mode_desc: "Когда автоматически опустошать пылесборник",
      auto_empty_frequency: "Частота авто-опустошения",
      auto_empty_frequency_desc: "Количество уборок перед авто-опустошением",
      empty_off: "Выкл",
      empty_standard: "Стандарт",
      empty_high_frequency: "Часто",
      empty_low_frequency: "Редко",
      auto_detergent: "Авто-моющее средство",
      auto_detergent_desc: "Автоматически добавлять моющее средство",
      mop_washing_with_detergent: "Мойка швабры с моющим средством",
      mop_washing_with_detergent_desc: "Использовать моющее средство при мойке швабры",
      mopping_with_detergent: "Уборка с моющим средством",
      mopping_with_detergent_desc: "Использовать моющее средство при влажной уборке",
      water_electrolysis: "Электролиз воды",
      water_electrolysis_desc: "Стерилизация воды с помощью электролиза",
      auto_water_refilling: "Авто-наполнение воды",
      auto_water_refilling_desc: "Автоматически наполнять бак чистой водой",
      auto_dust_collecting: "Авто-сбор пыли",
      auto_dust_collecting_desc: "Автоматически опустошать пылесборник после уборки",
      smart_washing: "Умная мойка",
      smart_washing_desc: "Умная настройка мойки по уровню загрязнения",
      mop_wash_level: "Уровень мойки швабры",
      mop_wash_level_desc: "Интенсивность мойки насадки",
      washing_mode: "Режим мойки",
      washing_mode_desc: "Интенсивность мойки насадки",
      washing_light: "Лёгкая",
      washing_standard: "Стандарт",
      washing_deep: "Глубокая",
      water_temperature: "Температура воды",
      water_temperature_desc: "Температура для мойки швабры",
      temp_normal: "Обычная",
      temp_mild: "Тёплая",
      temp_warm: "Горячая",
      temp_hot: "Очень горячая",
      auto_drying: "Авто-сушка",
      auto_drying_desc: "Автоматически сушить насадку после уборки",
      drying_time: "Время сушки",
      drying_time_desc: "Продолжительность сушки насадки",
      auto_rewashing: "Авто-перемывка",
      auto_rewashing_desc: "Автоматически перемывать швабру при загрязнении",
      rewashing_off: "Выкл",
      rewashing_in_deep_mode: "В глубоком режиме",
      rewashing_in_all_modes: "Во всех режимах",
      off_peak_charging: "Зарядка в непиковое время",
      off_peak_charging_desc: "Заряжать в непиковые часы для экономии энергии",
      off_peak_charging_start: "Время начала",
      off_peak_charging_end: "Время окончания",
      station_cleaning: "Очистка станции",
      station_cleaning_desc: "Очистить базовую станцию",
      clean_now: "Очистить",
      self_repair: "Самодиагностика",
      self_repair_desc: "Запустить диагностику станции",
      repair_now: "Диагностика",
      scraper_frequency: "Частота очистки скребка",
      scraper_frequency_desc: "Как часто очищать резиновый скребок"
    },
    ai_detection: {
      title: "ИИ и распознавание",
      intelligent_recognition: "Умное распознавание",
      intelligent_recognition_desc: "ИИ-распознавание окружающей среды",
      ai_obstacle_detection: "ИИ-распознавание препятствий",
      ai_obstacle_detection_desc: "Использовать ИИ для определения и обхода препятствий",
      fuzzy_obstacle_detection: "Нечёткое распознавание препятствий",
      fuzzy_obstacle_detection_desc: "Обнаружение мягких или нечётких препятствий",
      ai_obstacle_image_upload: "Загрузка изображений препятствий",
      ai_obstacle_image_upload_desc: "Загружать изображения препятствий для анализа",
      ai_obstacle_picture: "Фото препятствия",
      ai_obstacle_picture_desc: "Фотографировать обнаруженные препятствия",
      ai_pet_detection: "Распознавание питомцев",
      ai_pet_detection_desc: "Обнаружение и обход питомцев",
      ai_pet_avoidance: "Избегание питомцев",
      ai_pet_avoidance_desc: "Активно избегать обнаруженных питомцев",
      pet_focused_detection: "Фокусировка на питомцах",
      pet_focused_detection_desc: "Улучшенное распознавание зон питомцев",
      pet_picture: "Фото питомца",
      pet_picture_desc: "Фотографировать обнаруженных питомцев",
      ai_human_detection: "Распознавание людей",
      ai_human_detection_desc: "Обнаружение и обход людей",
      human_follow: "Следование за человеком",
      human_follow_desc: "Следовать за людьми для интерактивной уборки",
      ai_furniture_detection: "Распознавание мебели",
      ai_furniture_detection_desc: "Обнаружение и обход мебели",
      ai_fluid_detection: "Распознавание жидкостей",
      ai_fluid_detection_desc: "Обнаружение и обход жидкостей",
      fill_light: "Подсветка",
      fill_light_desc: "Использовать подсветку для лучшего распознавания",
      camera_light_auto: "Авто-яркость камеры",
      camera_light_auto_desc: "Автоматически настраивать яркость подсветки камеры",
      camera_light_brightness: "Яркость подсветки камеры",
      camera_light_brightness_desc: "Ручной уровень яркости подсветки камеры"
    },
    station_controls: {
      title: "Управление станцией",
      self_clean: "Самоочистка",
      self_clean_desc: "Запустить цикл мытья салфетки",
      manual_drying: "Ручная сушка",
      manual_drying_desc: "Запустить цикл сушки салфетки",
      water_tank_draining: "Слив воды",
      water_tank_draining_desc: "Слить грязную воду из бака",
      base_station_cleaning: "Очистка станции",
      base_station_cleaning_desc: "Очистить базовую станцию",
      empty_water_tank: "Опустошить бак",
      empty_water_tank_desc: "Опустошить бак для сбора воды",
      start_auto_empty: "Авто-опустошение",
      start_auto_empty_desc: "Запустить автоматическое опустошение пылесборника",
      start_recleaning: "Перечистка",
      start_recleaning_desc: "Запустить перечистку пропущенных участков",
      clear_warning: "Сбросить предупреждение",
      clear_warning_desc: "Сбросить текущие предупреждения"
    },
    map: {
      title: "Настройки карты",
      multi_floor: "Многоэтажная карта",
      multi_floor_desc: "Включить поддержку карт нескольких этажей",
      rotation: "Поворот карты",
      rotation_desc: "Повернуть ориентацию карты",
      mapping_actions: "Действия картографии",
      start_mapping: "Начать картографию",
      start_fast_mapping: "Быстрая картография"
    }
  }
}, i1 = {
  // Common (通用)
  common: {
    run: "运行",
    start: "开始",
    stop: "停止",
    cancel: "取消",
    save: "保存",
    apply: "应用",
    reset: "重置"
  },
  // Room Selector (房间选择器)
  room_selector: {
    title: "选择房间",
    selected_count: "已选 {{count}} 个"
  },
  // Map Selector (地图选择器)
  map_selector: {
    unknown: "未知地图"
  },
  // Vacuum Map (建图与地图交互)
  vacuum_map: {
    no_map: "暂无地图",
    looking_for: "正在寻找：{{entity}}",
    room_overlay: "请选择需要清洁的房间",
    zone_overlay_create: "点击地图添加划区清洁区域",
    zone_overlay_resize: "拖动边角调整大小，点击其他空白处重新放置",
    clear_zone: "清除选区",
    switch_to_list: "切换到列表视图",
    switch_to_map: "切换到地图视图",
    room_list_overlay: "点击房间进行选择",
    no_rooms: "暂无可用房间",
    zoom_in: "放大",
    zoom_out: "缩小",
    zoom_reset: "重置缩放",
    lock_map: "锁定地图",
    unlock_map: "解锁地图"
  },
  // Mode Tabs (模式切换标签)
  modes: {
    room: "选区",
    // 对应选定房间
    all: "全局",
    // 对应全屋
    zone: "划区"
    // 对应自定义区域
  },
  // Action Buttons (操作按钮)
  actions: {
    clean: "开始清洁",
    clean_all: "全屋清洁",
    clean_rooms: "清洁 {{count}} 个房间",
    clean_rooms_plural: "清洁 {{count}} 个房间",
    select_rooms: "选择房间",
    zone_clean: "划区清洁",
    pause: "暂停",
    resume: "继续",
    stop: "停止",
    stop_and_dock: "停止并回充",
    dock: "回充"
  },
  // Toast Messages (提示信息)
  toast: {
    selected_room: "已选择 {{name}}",
    deselected_room: "已取消选择 {{name}}",
    paused: "清洁已暂停",
    stopped: "清洁已停止",
    docked: "正在返回基站",
    cleaning_started: "开始清洁",
    resuming: "恢复清洁",
    starting_full_clean: "开始全屋清洁",
    pausing_vacuum: "扫地机器人已暂停",
    stopping_vacuum: "扫地机器人已停止",
    stopping_and_docking: "停止并返回基站",
    vacuum_docking: "扫地机正在返回基站",
    starting_room_clean: "开始清洁选中的 {{count}} 个房间",
    starting_room_clean_plural: "开始清洁选中的 {{count}} 个房间",
    starting_zone_clean: "开始划区清洁",
    select_rooms_first: "请先选择要清洁的房间",
    cannot_determine_map: "无法获取地图尺寸",
    select_zone_first: "请先在地图上划定一个区域"
  },
  // Room Selection Display (房间选择显示)
  room_display: {
    selected_rooms: "已选房间：",
    selected_label: "已选："
  },
  // Cleaning Mode Button (清洁模式按钮)
  cleaning_mode_button: {
    prefix_custom: "自定义：",
    prefix_cleangenius: "智能托管：",
    view_shortcuts: "查看快捷指令",
    repeats_tooltip: "清洁次数",
    vac_and_mop: "扫拖同步",
    mop_after_vac: "先扫后拖",
    vacuum: "单扫",
    mop: "单拖"
  },
  // Cleaning Mode Modal (清洁模式弹窗)
  cleaning_mode: {
    title: "清洁模式",
    clean_genius: "智能托管",
    custom: "自定义"
  },
  // Shortcuts Modal (快捷指令弹窗)
  shortcuts: {
    title: "快捷指令",
    no_shortcuts: "暂无快捷指令",
    create_hint: "请在 Dreame (追觅) App 中创建快捷指令，以便快速启动您常用的清洁任务"
  },
  // Custom Mode (自定义模式)
  custom_mode: {
    cleaning_mode_title: "清洁模式",
    suction_power_title: "吸力设置",
    max_plus_description: "吸力将提升至最高档位（该模式仅单次生效）。",
    wetness_title: "拖布水量",
    mop_pad_humidity_title: "拖布湿度",
    slightly_dry: "偏干",
    moist: "标准",
    wet: "偏湿",
    water_volume_title: "出水量",
    water_low: "低",
    water_medium: "中",
    water_high: "高",
    mop_washing_frequency_title: "拖布回洗频率",
    route_title: "路径设置",
    mop_pressure_title: "拖地压力",
    mop_temperature_title: "水温"
  },
  // 拖地压力选项
  mop_pressure: {
    light: "轻柔",
    normal: "标准"
  },
  // 水温选项
  mop_temperature: {
    normal: "常温",
    warm: "温水"
  },
  // 定制清洁模式
  customize: {
    title: "定制",
    description: "为每个区域设置个性化的吸力和拖地偏好。",
    set_button: "设置",
    vacuum: "吸尘",
    mop: "拖地",
    vac_and_mop: "吸拖",
    cycles: "清扫次数",
    apply_to_all: "应用到所有房间",
    click_room_hint: "点击区域以更改模式。",
    intelligent_recommendation: "智能推荐",
    select_room: "选择房间",
    settings_for: "{{room}}设置",
    no_rooms: "没有可用的房间"
  },
  // CleanGenius Mode (智能托管模式)
  cleangenius_mode: {
    cleaning_mode_title: "清洁模式",
    deep_cleaning: "深度清洁"
  },
  // Header (头部信息)
  header: {
    battery: "电量",
    status: "状态",
    area: "面积",
    time: "时间"
  },
  // Units (单位)
  units: {
    square_meters: "㎡",
    minutes: "分钟",
    minutes_short: "分",
    percent: "%",
    decibels: "dBm"
  },
  // Suction Levels (吸力档位)
  suction_levels: {
    quiet: "安静",
    standard: "标准",
    strong: "强劲",
    turbo: "超强"
  },
  // Mop Washing Frequency (拖布回洗频率)
  mop_washing_frequency: {
    by_room: "按房间",
    by_area: "按面积",
    by_time: "按时间"
  },
  // Cleaning Routes (清扫路线)
  cleaning_routes: {
    quick: "快速",
    standard: "标准",
    intensive: "强力",
    deep: "深度"
  },
  // Errors (错误提示)
  errors: {
    entity_not_found: "未找到实体：{{entity}}",
    failed_to_load: "加载实体数据失败",
    service_call_failed: "发送指令到扫地机失败",
    entity_unavailable: "扫地机不可用"
  },
  // Settings Panel (设置面板)
  settings: {
    title: "设置",
    consumables: {
      title: "耗材管理",
      main_brush: "主刷",
      side_brush: "边刷",
      filter: "滤网",
      sensor: "传感器",
      mop_pad: "拖布",
      silver_ion: "银离子",
      detergent: "清洁剂",
      squeegee: "刮水器",
      tank_filter: "水箱过滤器",
      onboard_dirty_water_tank: "内置污水箱",
      dirty_water_channel: "污水通道",
      deodorizer: "除臭剂",
      wheel: "轮子",
      scale_inhibitor: "防垢剂",
      fluffing_roller: "蓬松滚筒",
      roller_mop_filter: "滚筒拖布过滤器",
      water_outlet_filter: "出水过滤器",
      remaining: "剩余",
      reset: "复位"
    },
    device_info: {
      title: "设备信息",
      firmware: "固件版本",
      total_area: "累计清洁面积",
      total_time: "累计清洁时间",
      total_cleans: "累计清洁次数",
      wifi_ssid: "Wi-Fi 网络",
      wifi_signal: "信号强度",
      ip_address: "IP 地址"
    },
    quick_settings: {
      title: "快捷设置",
      child_lock: "童锁",
      child_lock_desc: "锁定设备按键以防误触",
      resume_cleaning: "断点续扫",
      resume_cleaning_desc: "充电后自动恢复清洁",
      dnd: "免打扰",
      dnd_desc: "在设定的安静时段内不主动执行任务",
      dnd_start: "开始时间",
      dnd_end: "结束时间",
      dnd_disable_resume: "禁用恢复",
      dnd_disable_resume_desc: "免打扰期间不恢复清洁",
      dnd_disable_auto_empty: "禁用自动集尘",
      dnd_disable_auto_empty_desc: "免打扰期间不自动集尘",
      dnd_reduce_volume: "降低音量",
      dnd_reduce_volume_desc: "免打扰期间降低设备音量"
    },
    volume: {
      title: "音量与语音",
      volume: "音量",
      test_sound: "寻找机器",
      muted: "已静音",
      voice_assistant: "语音助手",
      voice_assistant_desc: "启用语音播报和反馈",
      voice_language: "语音语言",
      voice_language_desc: "语音播报的语言",
      streaming_voice_prompt: "实时语音提示",
      streaming_voice_prompt_desc: "清洁过程中的实时语音反馈"
    },
    carpet: {
      title: "地毯设置",
      carpet_recognition: "地毯识别",
      carpet_recognition_desc: "自动识别地毯",
      carpet_avoidance: "避开地毯",
      carpet_avoidance_desc: "拖地时避开地毯",
      clean_carpets_first: "优先清洁地毯",
      clean_carpets_first_desc: "先吸尘地毯再拖地",
      carpet_boost: "地毯增压",
      carpet_boost_desc: "在地毯上自动提升吸力",
      intensive_cleaning: "深度清洁",
      intensive_cleaning_desc: "多次清扫深度清洁地毯",
      side_brush_rotate: "边刷旋转",
      side_brush_rotate_desc: "在地毯上旋转边刷",
      sensitivity: "地毯识别灵敏度",
      sensitivity_desc: "设置传感器检测地毯的灵敏程度",
      sensitivity_low: "低",
      sensitivity_medium: "中",
      sensitivity_high: "高",
      cleaning_mode: "地毯清洁",
      cleaning_mode_desc: "清洁时遇到地毯的处理方式",
      mode_vacuum: "吸尘",
      mode_vacuum_and_mop: "吸拖",
      mode_avoidance: "躲避",
      mode_ignore: "忽略",
      vacuum_mode: "吸尘模式",
      vacuum_adaptation: "抬升拖布",
      vacuum_remove_mop: "拆除拖布"
    },
    floor: {
      title: "地板设置",
      obstacle_avoidance: "障碍物避让",
      obstacle_avoidance_desc: "使用传感器避开障碍物",
      collision_avoidance: "碰撞避让",
      collision_avoidance_desc: "靠近墙壁和家具时减速",
      auto_mount_mop: "自动安装拖布",
      auto_mount_mop_desc: "需要时自动安装拖布垫",
      auto_recleaning: "自动复清",
      auto_recleaning_desc: "自动重新清洁遗漏区域",
      recleaning_off: "关闭",
      recleaning_in_deep_mode: "深度模式",
      recleaning_in_all_modes: "所有模式",
      stain_avoidance: "污渍躲避",
      stain_avoidance_desc: "自动避开识别到的顽固污渍",
      tight_mopping: "精细拖地",
      tight_mopping_desc: "更贴近墙壁和边缘拖地",
      floor_direction_cleaning: "顺向清洁",
      floor_direction_cleaning_desc: "沿地板纹理方向清洁",
      large_particles_boost: "大颗粒增压",
      large_particles_boost_desc: "增加吸力清理大颗粒杂物",
      pet_focused_cleaning: "宠物区域清洁",
      pet_focused_cleaning_desc: "在宠物活动区域加强清洁",
      low_lying_area_frequency: "低矮区域清洁频率",
      low_lying_area_frequency_desc: "多久清洁一次家具下方的低矮区域"
    },
    edge_corner: {
      title: "边角清洁",
      side_reach: "边刷延伸",
      side_reach_desc: "延伸边刷清洁边缘",
      mop_extend: "拖布延伸",
      mop_extend_desc: "延伸拖布清洁边角",
      gap_cleaning: "缝隙清洁",
      gap_cleaning_desc: "清洁家具之间的窄缝",
      mopping_under: "家具底部清洁",
      mopping_under_desc: "延伸拖布清洁低矮家具底部",
      extend_frequency: "延伸频率",
      extend_frequency_desc: "拖布延伸清洁边缘的频率",
      frequency_standard: "标准",
      frequency_intelligent: "智能",
      frequency_high: "高"
    },
    dock: {
      title: "基站设置",
      self_clean: "自动清洗",
      self_clean_desc: "清洁后自动清洗拖布",
      auto_empty_mode: "自动集尘模式",
      auto_empty_mode_desc: "何时自动清空尘盒",
      auto_empty_frequency: "自动集尘频率",
      auto_empty_frequency_desc: "多少次清洁后自动集尘",
      empty_off: "关闭",
      empty_standard: "标准",
      empty_high_frequency: "高频",
      empty_low_frequency: "低频",
      auto_detergent: "自动添加清洁剂",
      auto_detergent_desc: "清洗时自动添加清洁剂",
      mop_washing_with_detergent: "拖布清洗添加清洁剂",
      mop_washing_with_detergent_desc: "清洗拖布时使用清洁剂",
      mopping_with_detergent: "拖地使用清洁剂",
      mopping_with_detergent_desc: "拖地时使用清洁剂",
      water_electrolysis: "水电解",
      water_electrolysis_desc: "通过电解杀菌净化水质",
      auto_water_refilling: "自动加水",
      auto_water_refilling_desc: "自动补充清水箱",
      auto_dust_collecting: "自动集尘",
      auto_dust_collecting_desc: "清洁后自动清空尘盒",
      smart_washing: "智能洗拖布",
      smart_washing_desc: "根据脏污程度智能调整清洗",
      mop_wash_level: "拖布清洗等级",
      mop_wash_level_desc: "拖布清洗强度",
      washing_mode: "清洗模式",
      washing_mode_desc: "拖布清洗强度",
      washing_light: "轻度",
      washing_standard: "标准",
      washing_deep: "深度",
      water_temperature: "水温",
      water_temperature_desc: "清洗拖布的水温",
      temp_normal: "常温",
      temp_mild: "温和",
      temp_warm: "温热",
      temp_hot: "高温",
      auto_drying: "自动烘干",
      auto_drying_desc: "清洁后自动烘干拖布",
      drying_time: "烘干时间",
      drying_time_desc: "拖布烘干时长",
      auto_rewashing: "自动复洗",
      auto_rewashing_desc: "拖布脏污时自动复洗",
      rewashing_off: "关闭",
      rewashing_in_deep_mode: "深度模式",
      rewashing_in_all_modes: "所有模式",
      off_peak_charging: "低峰充电",
      off_peak_charging_desc: "低峰时段充电节省电费",
      off_peak_charging_start: "开始时间",
      off_peak_charging_end: "结束时间",
      station_cleaning: "基站清洁",
      station_cleaning_desc: "清洁基站",
      clean_now: "立即清洁",
      self_repair: "自检修复",
      self_repair_desc: "运行基站自检修复诊断",
      repair_now: "修复",
      scraper_frequency: "刮板清洁频率",
      scraper_frequency_desc: "多久清洁一次橡胶刮板"
    },
    ai_detection: {
      title: "AI 识别与避障",
      intelligent_recognition: "智能识别",
      intelligent_recognition_desc: "AI 驱动的环境识别",
      ai_obstacle_detection: "AI 障碍物识别",
      ai_obstacle_detection_desc: "使用 AI 视觉识别并避开障碍物",
      fuzzy_obstacle_detection: "模糊障碍物识别",
      fuzzy_obstacle_detection_desc: "检测软质或不清晰的障碍物",
      ai_obstacle_image_upload: "实景障碍物照片上传",
      ai_obstacle_image_upload_desc: "上传拍摄到的障碍物照片以供分析",
      ai_obstacle_picture: "障碍物照片",
      ai_obstacle_picture_desc: "拍摄检测到的障碍物照片",
      ai_pet_detection: "宠物识别",
      ai_pet_detection_desc: "识别并智能避让宠物",
      ai_pet_avoidance: "避让宠物",
      ai_pet_avoidance_desc: "主动避让检测到的宠物",
      pet_focused_detection: "宠物重点识别",
      pet_focused_detection_desc: "增强宠物区域检测",
      pet_picture: "宠物照片",
      pet_picture_desc: "拍摄检测到的宠物照片",
      ai_human_detection: "人员识别",
      ai_human_detection_desc: "识别并避让活动人员",
      human_follow: "人员跟随",
      human_follow_desc: "跟随人员进行互动清洁",
      ai_furniture_detection: "家具识别",
      ai_furniture_detection_desc: "识别家具并沿边清扫",
      ai_fluid_detection: "液体识别",
      ai_fluid_detection_desc: "识别并避开地面液体",
      fill_light: "自动补光灯",
      fill_light_desc: "暗光环境下自动开启以提升识别率",
      camera_light_auto: "自动相机亮度",
      camera_light_auto_desc: "自动调节相机补光灯亮度",
      camera_light_brightness: "相机补光亮度",
      camera_light_brightness_desc: "手动设置相机补光灯亮度"
    },
    station_controls: {
      title: "基站控制",
      self_clean: "自动清洗",
      self_clean_desc: "启动拖布清洗程序",
      manual_drying: "手动烘干",
      manual_drying_desc: "启动拖布烘干程序",
      water_tank_draining: "排水",
      water_tank_draining_desc: "排出污水箱中的脏水",
      base_station_cleaning: "清洁基站",
      base_station_cleaning_desc: "清洁充电基站",
      empty_water_tank: "清空水箱",
      empty_water_tank_desc: "清空集水箱",
      start_auto_empty: "自动集尘",
      start_auto_empty_desc: "启动自动集尘",
      start_recleaning: "重新清洁",
      start_recleaning_desc: "启动遗漏区域重新清洁",
      clear_warning: "清除警告",
      clear_warning_desc: "清除当前警告消息"
    },
    map: {
      title: "地图设置",
      multi_floor: "多层地图",
      multi_floor_desc: "启用多层地图支持",
      rotation: "地图旋转",
      rotation_desc: "旋转地图方向",
      mapping_actions: "建图操作",
      start_mapping: "开始建图",
      start_fast_mapping: "快速建图"
    }
  }
}, o1 = {
  // Common
  common: {
    run: "Ejecutar",
    start: "Iniciar",
    stop: "Detener",
    cancel: "Cancelar",
    save: "Guardar",
    apply: "Aplicar",
    reset: "Restablecer"
  },
  // Room Selector
  room_selector: {
    title: "Seleccionar Habitaciones",
    selected_count: "{{count}} seleccionadas"
  },
  // Map Selector
  map_selector: {
    unknown: "Mapa desconocido"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "No hay mapa disponible",
    looking_for: "Buscando: {{entity}}",
    room_overlay: "Haga clic en los números de las habitaciones para seleccionarlas para la limpieza",
    zone_overlay_create: "Haga clic en el mapa para colocar una zona de limpieza",
    zone_overlay_resize: "Arrastre las esquinas para cambiar el tamaño, haga clic en otro lugar para reposicionar",
    clear_zone: "Borrar zona",
    switch_to_list: "Cambiar a vista de lista",
    switch_to_map: "Cambiar a vista de mapa",
    room_list_overlay: "Toque las habitaciones para seleccionarlas para la limpieza",
    no_rooms: "No hay habitaciones disponibles",
    zoom_in: "Acercar",
    zoom_out: "Alejar",
    zoom_reset: "Restablecer zoom",
    lock_map: "Bloquear mapa",
    unlock_map: "Desbloquear mapa"
  },
  // Mode Tabs
  modes: {
    room: "Habitaciones",
    all: "Todo",
    zone: "Zona"
  },
  // Action Buttons
  actions: {
    clean: "Limpiar",
    clean_all: "Limpiar Todo",
    clean_rooms: "Limpiar {{count}} Habitación",
    clean_rooms_plural: "Limpiar {{count}} Habitaciones",
    select_rooms: "Seleccionar Habitaciones",
    zone_clean: "Limpiar Zona",
    pause: "Pausar",
    resume: "Reanudar",
    stop: "Detener",
    stop_and_dock: "Detener y volver",
    dock: "Base"
  },
  // Toast Messages
  toast: {
    selected_room: "{{name}} seleccionada",
    deselected_room: "{{name}} deseleccionada",
    paused: "Limpieza pausada",
    stopped: "Limpieza detenida",
    docked: "Volviendo a la base",
    cleaning_started: "Limpieza iniciada",
    resuming: "Reanudando limpieza",
    starting_full_clean: "Iniciando limpieza de toda la casa",
    pausing_vacuum: "Pausando aspirador",
    stopping_vacuum: "Deteniendo aspirador",
    stopping_and_docking: "Deteniendo y volviendo a la base",
    vacuum_docking: "Aspirador volviendo a la base",
    starting_room_clean: "Iniciando limpieza para {{count}} habitación seleccionada",
    starting_room_clean_plural: "Iniciando limpieza para {{count}} habitaciones seleccionadas",
    starting_zone_clean: "Iniciando limpieza de zona",
    select_rooms_first: "Por favor, seleccione primero las habitaciones a limpiar",
    cannot_determine_map: "No se pueden determinar las dimensiones del mapa",
    select_zone_first: "Por favor, seleccione una zona en el mapa"
  },
  // Room Selection Display
  room_display: {
    selected_rooms: "Habitaciones seleccionadas:",
    selected_label: "Seleccionadas:"
  },
  // Cleaning Mode Button
  cleaning_mode_button: {
    prefix_custom: "Personalizado: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "Ver accesos directos",
    repeats_tooltip: "Pasadas de limpieza",
    vac_and_mop: "Aspirar y Trapear",
    mop_after_vac: "Trapear después de aspirar",
    vacuum: "Aspirar",
    mop: "Trapear"
  },
  // Cleaning Mode Modal
  cleaning_mode: {
    title: "Modo de limpieza",
    clean_genius: "CleanGenius",
    custom: "Personalizado"
  },
  // Shortcuts Modal
  shortcuts: {
    title: "Accesos directos",
    no_shortcuts: "No hay accesos directos disponibles",
    create_hint: "Cree accesos directos en la aplicación Dreame para iniciar rápidamente sus rutinas de limpieza favoritas"
  },
  // Custom Mode
  custom_mode: {
    cleaning_mode_title: "Modo de limpieza",
    suction_power_title: "Potencia de succión",
    max_plus_description: "La potencia de succión se incrementará al máximo nivel, es un modo de un solo uso.",
    wetness_title: "Humedad",
    mop_pad_humidity_title: "Humedad de la mopa",
    slightly_dry: "Ligeramente seco",
    moist: "Húmedo",
    wet: "Mojado",
    water_volume_title: "Volumen de agua",
    water_low: "Bajo",
    water_medium: "Medio",
    water_high: "Alto",
    mop_washing_frequency_title: "Frecuencia de lavado de mopa",
    route_title: "Ruta",
    mop_pressure_title: "Presión de la mopa",
    mop_temperature_title: "Temperatura del agua"
  },
  // Mop pressure levels
  mop_pressure: {
    light: "Ligera",
    normal: "Normal"
  },
  // Mop temperature levels
  mop_temperature: {
    normal: "Normal",
    warm: "Templada"
  },
  // Customize Cleaning Mode
  customize: {
    title: "Personalizar",
    description: "Establece preferencias personalizadas de succión y fregado para cada área.",
    set_button: "Configurar",
    vacuum: "Aspirar",
    mop: "Fregar",
    vac_and_mop: "Aspirar y fregar",
    cycles: "Ciclos",
    apply_to_all: "Aplicar a todas las habitaciones",
    click_room_hint: "Haz clic en un área para cambiar el modo.",
    intelligent_recommendation: "Recomendación inteligente",
    select_room: "Seleccionar habitación",
    settings_for: "Ajustes de {{room}}",
    no_rooms: "No hay habitaciones disponibles"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Modo de limpieza",
    deep_cleaning: "Limpieza profunda"
  },
  // Header
  header: {
    battery: "Batería",
    status: "Estado",
    area: "Área",
    time: "Tiempo"
  },
  // Units
  units: {
    square_meters: "m²",
    minutes: "min",
    minutes_short: "m",
    percent: "%",
    decibels: "dBm"
  },
  // Suction Levels (friendly names)
  suction_levels: {
    quiet: "Silencioso",
    standard: "Estándar",
    strong: "Turbo",
    turbo: "Máximo"
  },
  // Mop Washing Frequency
  mop_washing_frequency: {
    by_room: "Por habitación",
    by_area: "Por área",
    by_time: "Por tiempo"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "Rápido",
    standard: "Estándar",
    intensive: "Intensivo",
    deep: "Profundo"
  },
  // Errors
  errors: {
    entity_not_found: "Entidad no encontrada: {{entity}}",
    failed_to_load: "Error al cargar datos de la entidad",
    service_call_failed: "Error al enviar comando a la aspiradora",
    entity_unavailable: "Aspiradora no disponible"
  },
  // Settings Panel
  settings: {
    title: "Ajustes",
    consumables: {
      title: "Consumibles",
      main_brush: "Cepillo principal",
      side_brush: "Cepillo lateral",
      filter: "Filtro",
      sensor: "Sensor",
      mop_pad: "Almohadilla de fregado",
      silver_ion: "Ion de plata",
      detergent: "Detergente",
      squeegee: "Escobilla",
      tank_filter: "Filtro del tanque",
      onboard_dirty_water_tank: "Tanque de agua sucia integrado",
      dirty_water_channel: "Canal de agua sucia",
      deodorizer: "Desodorizador",
      wheel: "Rueda",
      scale_inhibitor: "Inhibidor de cal",
      fluffing_roller: "Rodillo esponjador",
      roller_mop_filter: "Filtro de rodillo fregona",
      water_outlet_filter: "Filtro de salida de agua",
      remaining: "restante",
      reset: "Restablecer"
    },
    device_info: {
      title: "Información del dispositivo",
      firmware: "Firmware",
      total_area: "Área total limpiada",
      total_time: "Tiempo total de limpieza",
      total_cleans: "Limpiezas totales",
      wifi_ssid: "Red Wi-Fi",
      wifi_signal: "Intensidad de señal",
      ip_address: "Dirección IP"
    },
    quick_settings: {
      title: "Ajustes rápidos",
      child_lock: "Bloqueo infantil",
      child_lock_desc: "Desactivar botones físicos del dispositivo",
      resume_cleaning: "Reanudar limpieza",
      resume_cleaning_desc: "Reanudar automáticamente la limpieza después de cargar",
      dnd: "No molestar",
      dnd_desc: "Horas de silencio con actividad reducida",
      dnd_start: "Hora de inicio",
      dnd_end: "Hora de fin",
      dnd_disable_resume: "Desactivar reanudación",
      dnd_disable_resume_desc: "No reanudar limpieza durante No molestar",
      dnd_disable_auto_empty: "Desactivar vaciado auto",
      dnd_disable_auto_empty_desc: "No vaciar automáticamente durante No molestar",
      dnd_reduce_volume: "Reducir volumen",
      dnd_reduce_volume_desc: "Bajar volumen del dispositivo durante No molestar"
    },
    volume: {
      title: "Volumen y sonido",
      volume: "Volumen",
      test_sound: "Localizar",
      muted: "Silenciado",
      voice_assistant: "Asistente de voz",
      voice_assistant_desc: "Habilitar anuncios y retroalimentación por voz",
      voice_language: "Idioma de voz",
      voice_language_desc: "Idioma para los anuncios de voz",
      streaming_voice_prompt: "Avisos de voz en tiempo real",
      streaming_voice_prompt_desc: "Retroalimentación por voz en tiempo real durante la limpieza"
    },
    carpet: {
      title: "Configuración de alfombras",
      carpet_recognition: "Reconocimiento de alfombras",
      carpet_recognition_desc: "Detectar alfombras automáticamente",
      carpet_avoidance: "Evitar alfombras",
      carpet_avoidance_desc: "Evitar alfombras durante el fregado",
      clean_carpets_first: "Limpiar alfombras primero",
      clean_carpets_first_desc: "Aspirar alfombras antes de trapear",
      carpet_boost: "Potencia en alfombras",
      carpet_boost_desc: "Aumentar potencia de succión en alfombras",
      intensive_cleaning: "Limpieza intensiva",
      intensive_cleaning_desc: "Limpieza profunda con pasadas extra",
      side_brush_rotate: "Rotar cepillo lateral",
      side_brush_rotate_desc: "Rotar cepillo lateral en alfombras",
      sensitivity: "Sensibilidad de alfombras",
      sensitivity_desc: "Nivel de sensibilidad de detección",
      sensitivity_low: "Baja",
      sensitivity_medium: "Media",
      sensitivity_high: "Alta",
      cleaning_mode: "Limpieza de alfombras",
      cleaning_mode_desc: "Cómo manejar alfombras durante la limpieza",
      mode_vacuum: "Aspirar",
      mode_vacuum_and_mop: "Asp. y Trap.",
      mode_avoidance: "Evitar",
      mode_ignore: "Ignorar",
      vacuum_mode: "Modo aspirado",
      vacuum_adaptation: "Levantar mopa",
      vacuum_remove_mop: "Quitar mopa"
    },
    floor: {
      title: "Configuración de suelo",
      obstacle_avoidance: "Evitación de obstáculos",
      obstacle_avoidance_desc: "Usar sensores para evitar obstáculos",
      collision_avoidance: "Evitar colisiones",
      collision_avoidance_desc: "Reducir velocidad cerca de paredes y muebles",
      auto_mount_mop: "Montar mopa auto",
      auto_mount_mop_desc: "Montar automáticamente la almohadilla de mopa",
      auto_recleaning: "Re-limpieza auto",
      auto_recleaning_desc: "Volver a limpiar áreas perdidas automáticamente",
      recleaning_off: "Desactivado",
      recleaning_in_deep_mode: "En modo profundo",
      recleaning_in_all_modes: "En todos los modos",
      stain_avoidance: "Evitación de manchas",
      stain_avoidance_desc: "Evitar manchas detectadas",
      tight_mopping: "Fregado minucioso",
      tight_mopping_desc: "Fregar más cerca de paredes y bordes",
      floor_direction_cleaning: "Limpieza según dirección del suelo",
      floor_direction_cleaning_desc: "Limpiar siguiendo la veta del suelo",
      large_particles_boost: "Potencia para partículas grandes",
      large_particles_boost_desc: "Aumentar succión para residuos grandes",
      pet_focused_cleaning: "Limpieza enfocada en mascotas",
      pet_focused_cleaning_desc: "Limpieza extra en áreas de mascotas",
      low_lying_area_frequency: "Frecuencia de zonas bajas",
      low_lying_area_frequency_desc: "Con qué frecuencia limpiar zonas bajas bajo los muebles"
    },
    edge_corner: {
      title: "Bordes y Esquinas",
      side_reach: "Alcance lateral",
      side_reach_desc: "Extender cepillo lateral para bordes",
      mop_extend: "Extensión de mopa",
      mop_extend_desc: "Extender mopa para bordes y esquinas",
      gap_cleaning: "Limpieza de huecos",
      gap_cleaning_desc: "Limpiar espacios estrechos entre muebles",
      mopping_under: "Fregar bajo muebles",
      mopping_under_desc: "Extender mopa bajo muebles bajos",
      extend_frequency: "Frecuencia de extensión",
      extend_frequency_desc: "Frecuencia de extensión para limpieza de bordes",
      frequency_standard: "Estándar",
      frequency_intelligent: "Inteligente",
      frequency_high: "Alta"
    },
    dock: {
      title: "Configuración de base",
      self_clean: "Autolimpieza",
      self_clean_desc: "Lavar mopa automáticamente después de limpiar",
      auto_empty_mode: "Modo vaciado auto",
      auto_empty_mode_desc: "Cuándo vaciar automáticamente el depósito",
      auto_empty_frequency: "Frecuencia vaciado auto",
      auto_empty_frequency_desc: "Cuántas limpiezas antes del vaciado auto",
      empty_off: "Desactivado",
      empty_standard: "Estándar",
      empty_high_frequency: "Alta frecuencia",
      empty_low_frequency: "Baja frecuencia",
      auto_detergent: "Detergente auto",
      auto_detergent_desc: "Añadir detergente automáticamente al lavar",
      mop_washing_with_detergent: "Lavado de mopa con detergente",
      mop_washing_with_detergent_desc: "Usar detergente al lavar la mopa",
      mopping_with_detergent: "Fregado con detergente",
      mopping_with_detergent_desc: "Usar detergente al fregar el suelo",
      water_electrolysis: "Electrólisis de agua",
      water_electrolysis_desc: "Esterilizar agua mediante electrólisis",
      auto_water_refilling: "Rellenado auto de agua",
      auto_water_refilling_desc: "Rellenar automáticamente el tanque de agua limpia",
      auto_dust_collecting: "Recolección auto de polvo",
      auto_dust_collecting_desc: "Vaciar automáticamente el depósito después de limpiar",
      smart_washing: "Lavado inteligente",
      smart_washing_desc: "Ajustar lavado según nivel de suciedad",
      mop_wash_level: "Nivel lavado mopa",
      mop_wash_level_desc: "Intensidad del lavado de la mopa",
      washing_mode: "Modo lavado",
      washing_mode_desc: "Intensidad del lavado de la mopa",
      washing_light: "Ligero",
      washing_standard: "Estándar",
      washing_deep: "Profundo",
      water_temperature: "Temperatura del agua",
      water_temperature_desc: "Temperatura para lavar la mopa",
      temp_normal: "Normal",
      temp_mild: "Suave",
      temp_warm: "Templada",
      temp_hot: "Caliente",
      auto_drying: "Secado auto",
      auto_drying_desc: "Secar automáticamente la mopa después de limpiar",
      drying_time: "Tiempo de secado",
      drying_time_desc: "Duración del secado de la mopa",
      auto_rewashing: "Relavado automático",
      auto_rewashing_desc: "Relavar mopa automáticamente cuando esté sucia",
      rewashing_off: "Desactivado",
      rewashing_in_deep_mode: "En modo profundo",
      rewashing_in_all_modes: "En todos los modos",
      off_peak_charging: "Carga en horas valle",
      off_peak_charging_desc: "Cargar en horas valle para ahorrar energía",
      off_peak_charging_start: "Hora de inicio",
      off_peak_charging_end: "Hora de fin",
      station_cleaning: "Limpieza de estación",
      station_cleaning_desc: "Limpiar la estación base",
      clean_now: "Limpiar ahora",
      self_repair: "Auto-reparación",
      self_repair_desc: "Ejecutar diagnóstico de auto-reparación de la estación",
      repair_now: "Reparar",
      scraper_frequency: "Frecuencia del raspador",
      scraper_frequency_desc: "Con qué frecuencia limpiar el raspador de goma"
    },
    ai_detection: {
      title: "IA y detección",
      intelligent_recognition: "Reconocimiento inteligente",
      intelligent_recognition_desc: "Reconocimiento del entorno con IA",
      ai_obstacle_detection: "Detección de obstáculos con IA",
      ai_obstacle_detection_desc: "Usar IA para identificar y evitar obstáculos",
      fuzzy_obstacle_detection: "Detección de obstáculos difusos",
      fuzzy_obstacle_detection_desc: "Detectar obstáculos suaves o poco claros",
      ai_obstacle_image_upload: "Carga de imágenes de obstáculos",
      ai_obstacle_image_upload_desc: "Cargar imágenes de obstáculos para análisis",
      ai_obstacle_picture: "Foto de obstáculo",
      ai_obstacle_picture_desc: "Tomar fotos de obstáculos detectados",
      ai_pet_detection: "Detección de mascotas",
      ai_pet_detection_desc: "Detectar y evitar mascotas",
      ai_pet_avoidance: "Evitar mascotas",
      ai_pet_avoidance_desc: "Evitar activamente las mascotas detectadas",
      pet_focused_detection: "Detección enfocada en mascotas",
      pet_focused_detection_desc: "Detección mejorada para áreas de mascotas",
      pet_picture: "Foto de mascota",
      pet_picture_desc: "Tomar fotos de mascotas detectadas",
      ai_human_detection: "Detección de personas",
      ai_human_detection_desc: "Detectar y evitar personas",
      human_follow: "Seguir personas",
      human_follow_desc: "Seguir personas para limpieza interactiva",
      ai_furniture_detection: "Detección de muebles",
      ai_furniture_detection_desc: "Detectar y navegar alrededor de muebles",
      ai_fluid_detection: "Detección de líquidos",
      ai_fluid_detection_desc: "Detectar y evitar líquidos",
      fill_light: "Luz de relleno",
      fill_light_desc: "Usar luz de relleno para mejor detección",
      camera_light_auto: "Brillo automático de cámara",
      camera_light_auto_desc: "Ajustar automáticamente el brillo de la luz de la cámara",
      camera_light_brightness: "Brillo de luz de cámara",
      camera_light_brightness_desc: "Nivel de brillo manual de la luz de la cámara"
    },
    station_controls: {
      title: "Controles de estación",
      self_clean: "Autolimpieza",
      self_clean_desc: "Iniciar ciclo de lavado de mopa",
      manual_drying: "Secado manual",
      manual_drying_desc: "Iniciar ciclo de secado de mopa",
      water_tank_draining: "Vaciar tanque",
      water_tank_draining_desc: "Drenar agua sucia del tanque",
      base_station_cleaning: "Limpiar estación",
      base_station_cleaning_desc: "Limpiar la estación base",
      empty_water_tank: "Vaciar tanque de agua",
      empty_water_tank_desc: "Vaciar el tanque de recolección de agua",
      start_auto_empty: "Vaciado automático",
      start_auto_empty_desc: "Iniciar vaciado automático del depósito",
      start_recleaning: "Relimpieza",
      start_recleaning_desc: "Iniciar relimpieza de áreas perdidas",
      clear_warning: "Limpiar advertencia",
      clear_warning_desc: "Limpiar mensajes de advertencia actuales"
    },
    map: {
      title: "Configuración del mapa",
      multi_floor: "Mapa multi-piso",
      multi_floor_desc: "Habilitar soporte para mapas de múltiples pisos",
      rotation: "Rotación del mapa",
      rotation_desc: "Girar la orientación del mapa",
      mapping_actions: "Acciones de mapeo",
      start_mapping: "Iniciar mapeo",
      start_fast_mapping: "Mapeo rápido"
    }
  }
}, r1 = {
  // Common
  common: {
    run: "Uitvoeren",
    start: "Start",
    stop: "Stop",
    cancel: "Annuleren",
    save: "Opslaan",
    apply: "Toepassen",
    reset: "Resetten"
  },
  // Kamer Kiezer
  room_selector: {
    title: "Kamers Selecteren",
    selected_count: "{{count}} geselecteerd"
  },
  // Kaart Kiezer
  map_selector: {
    unknown: "Onbekende kaart"
  },
  // Stofzuiger Kaart
  vacuum_map: {
    no_map: "Geen kaart beschikbaar",
    looking_for: "Zoeken naar: {{entity}}",
    room_overlay: "Klik op kamernummers om kamers te selecteren voor reiniging",
    zone_overlay_create: "Klik op de kaart om een schoonmaakzone te plaatsen",
    zone_overlay_resize: "Sleep de hoeken om aan te passen, klik elders om te verplaatsen",
    clear_zone: "Zone wissen",
    switch_to_list: "Naar lijstweergave",
    switch_to_map: "Naar kaartweergave",
    room_list_overlay: "Tik op kamers om te selecteren voor reiniging",
    no_rooms: "Geen kamers beschikbaar",
    zoom_in: "Inzoomen",
    zoom_out: "Uitzoomen",
    zoom_reset: "Zoom resetten",
    lock_map: "Kaart vergrendelen",
    unlock_map: "Kaart ontgrendelen"
  },
  // Modus Tabbladen
  modes: {
    room: "Kamer",
    all: "Alles",
    zone: "Zone"
  },
  // Actieknoppen
  actions: {
    clean: "Schoonmaken",
    clean_all: "Alles Schoonmaken",
    clean_rooms: "Schoonmaken ({{count}} kamer)",
    clean_rooms_plural: "Schoonmaken ({{count}} kamers)",
    select_rooms: "Kamers Selecteren",
    zone_clean: "Zone Reinigen",
    pause: "Pauze",
    resume: "Hervatten",
    stop: "Stop",
    stop_and_dock: "Stop & Docken",
    dock: "Docken"
  },
  // Meldingen (Toasts)
  toast: {
    selected_room: "{{name}} geselecteerd",
    deselected_room: "{{name}} gedeselecteerd",
    paused: "Schoonmaken gepauzeerd",
    stopped: "Schoonmaken gestopt",
    docked: "Keert terug naar dock",
    cleaning_started: "Schoonmaken gestart",
    resuming: "Schoonmaken wordt hervat",
    starting_full_clean: "Start volledige reiniging van het huis",
    pausing_vacuum: "Stofzuiger pauzeren",
    stopping_vacuum: "Stofzuiger stoppen",
    stopping_and_docking: "Stoppen en terugkeren naar dock",
    vacuum_docking: "Stofzuiger keert terug naar dock",
    starting_room_clean: "Start reinigen van {{count}} geselecteerde kamer",
    starting_room_clean_plural: "Start reinigen van {{count}} geselecteerde kamers",
    starting_zone_clean: "Zone-reiniging gestart",
    select_rooms_first: "Selecteer eerst de kamers die je wilt schoonmaken",
    cannot_determine_map: "Kan afmetingen van de kaart niet bepalen",
    select_zone_first: "Selecteer eerst een zone op de kaart"
  },
  // Kamer Selectie Weergave
  room_display: {
    selected_rooms: "Geselecteerde Kamers:",
    selected_label: "Geselecteerd:"
  },
  // Schoonmaakmodus Knop
  cleaning_mode_button: {
    prefix_custom: "Aangepast: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "Snelkoppelingen bekijken",
    repeats_tooltip: "Reinigingspassen",
    vac_and_mop: "Stofzuigen & Dweilen",
    mop_after_vac: "Dweilen na Stofzuigen",
    vacuum: "Stofzuigen",
    mop: "Dweilen"
  },
  // Schoonmaakmodus Modal
  cleaning_mode: {
    title: "Schoonmaakmodus",
    clean_genius: "CleanGenius",
    custom: "Aangepast"
  },
  // Snelkoppelingen Modal
  shortcuts: {
    title: "Snelkoppelingen",
    no_shortcuts: "Geen snelkoppelingen beschikbaar",
    create_hint: "Maak snelkoppelingen aan in de Dreame app om snel je favoriete routines te starten"
  },
  // Aangepaste Modus
  custom_mode: {
    cleaning_mode_title: "Schoonmaakmodus",
    suction_power_title: "Zuigkracht",
    max_plus_description: "De zuigkracht wordt verhoogd naar het hoogste niveau (eenmalige modus).",
    wetness_title: "Vochtigheid",
    mop_pad_humidity_title: "Dweildoek Vochtigheid",
    slightly_dry: "Licht droog",
    moist: "Vochtig",
    wet: "Nat",
    water_volume_title: "Watervolume",
    water_low: "Laag",
    water_medium: "Gemiddeld",
    water_high: "Hoog",
    mop_washing_frequency_title: "Dweil-wasfrequentie",
    route_title: "Route",
    mop_pressure_title: "Dweildruk",
    mop_temperature_title: "Watertemperatuur"
  },
  // Mop pressure levels
  mop_pressure: {
    light: "Licht",
    normal: "Normaal"
  },
  // Mop temperature levels
  mop_temperature: {
    normal: "Normaal",
    warm: "Warm"
  },
  // Aanpassen Schoonmaakmodus
  customize: {
    title: "Aanpassen",
    description: "Stel gepersonaliseerde zuig- en dweilvoorkeuren in voor elk gebied.",
    set_button: "Instellen",
    vacuum: "Zuigen",
    mop: "Dweilen",
    vac_and_mop: "Zuigen & dweilen",
    cycles: "Cycli",
    apply_to_all: "Toepassen op alle kamers",
    click_room_hint: "Klik op een gebied om de modus te wijzigen.",
    intelligent_recommendation: "Intelligente aanbeveling",
    select_room: "Selecteer kamer",
    settings_for: "{{room}} instellingen",
    no_rooms: "Geen kamers beschikbaar"
  },
  // CleanGenius Modus
  cleangenius_mode: {
    cleaning_mode_title: "Schoonmaakmodus",
    deep_cleaning: "Grondige Reiniging"
  },
  // Header
  header: {
    battery: "Batterij",
    status: "Status",
    area: "Oppervlak",
    time: "Tijd"
  },
  // Units
  units: {
    square_meters: "m²",
    minutes: "min",
    minutes_short: "m",
    percent: "%",
    decibels: "dBm"
  },
  // Suction Levels (friendly names)
  suction_levels: {
    quiet: "Stil",
    standard: "Standaard",
    strong: "Turbo",
    turbo: "Max"
  },
  // Mop Washing Frequency
  mop_washing_frequency: {
    by_room: "Per kamer",
    by_area: "Per oppervlak",
    by_time: "Per tijd"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "Snel",
    standard: "Standaard",
    intensive: "Intensief",
    deep: "Diep"
  },
  // Fouten
  errors: {
    entity_not_found: "Entiteit niet gevonden: {{entity}}",
    failed_to_load: "Kan entiteitsgegevens niet laden",
    service_call_failed: "Kan opdracht niet naar stofzuiger sturen",
    entity_unavailable: "Stofzuiger niet beschikbaar"
  },
  // Instellingenpaneel
  settings: {
    title: "Instellingen",
    consumables: {
      title: "Onderdelen & Verbruik",
      main_brush: "Hoofdborstel",
      side_brush: "Zijborstel",
      filter: "Filter",
      sensor: "Sensor",
      mop_pad: "Dweilpad",
      silver_ion: "Zilverion",
      detergent: "Reinigingsmiddel",
      squeegee: "Trekker",
      tank_filter: "Tankfilter",
      onboard_dirty_water_tank: "Ingebouwde vuilwatertank",
      dirty_water_channel: "Vuilwaterkanaal",
      deodorizer: "Luchtverfrisser",
      wheel: "Wiel",
      scale_inhibitor: "Kalkremmer",
      fluffing_roller: "Pluizende roller",
      roller_mop_filter: "Rollermopfilter",
      water_outlet_filter: "Wateruitlaatfilter",
      remaining: "resterend",
      reset: "Resetten"
    },
    device_info: {
      title: "Apparaatinfo",
      firmware: "Firmware",
      total_area: "Totaal Gereinigd Oppervlak",
      total_time: "Totale Schoonmaaktijd",
      total_cleans: "Totaal Aantal Reinigingen",
      wifi_ssid: "Wifi-netwerk",
      wifi_signal: "Signaalsterkte",
      ip_address: "IP-adres"
    },
    quick_settings: {
      title: "Snelle Instellingen",
      child_lock: "Kinderslot",
      child_lock_desc: "Fysieke knoppen op het apparaat uitschakelen",
      resume_cleaning: "Reiniging hervatten",
      resume_cleaning_desc: "Automatisch reiniging hervatten na opladen",
      dnd: "Niet Storen",
      dnd_desc: "Stille uren met beperkte activiteit",
      dnd_start: "Starttijd",
      dnd_end: "Eindtijd",
      dnd_disable_resume: "Hervatten uitschakelen",
      dnd_disable_resume_desc: "Niet hervatten tijdens Niet Storen",
      dnd_disable_auto_empty: "Auto legen uitschakelen",
      dnd_disable_auto_empty_desc: "Niet automatisch legen tijdens Niet Storen",
      dnd_reduce_volume: "Volume verlagen",
      dnd_reduce_volume_desc: "Apparaatvolume verlagen tijdens Niet Storen"
    },
    volume: {
      title: "Volume & Geluid",
      volume: "Volume",
      test_sound: "Lokaliseren",
      muted: "Gedempt",
      voice_assistant: "Spraakassistent",
      voice_assistant_desc: "Spraakmeldingen en feedback inschakelen",
      voice_language: "Spraaktaal",
      voice_language_desc: "Taal voor spraakmeldingen",
      streaming_voice_prompt: "Realtime spraakprompt",
      streaming_voice_prompt_desc: "Realtime spraakfeedback tijdens reiniging"
    },
    carpet: {
      title: "Tapijtinstellingen",
      carpet_recognition: "Tapijtherkenning",
      carpet_recognition_desc: "Tapijten automatisch detecteren",
      carpet_avoidance: "Tapijt vermijden",
      carpet_avoidance_desc: "Tapijten vermijden tijdens dweilen",
      clean_carpets_first: "Tapijten eerst reinigen",
      clean_carpets_first_desc: "Tapijten stofzuigen voor het dweilen",
      carpet_boost: "Tapijtboost",
      carpet_boost_desc: "Zuigkracht verhogen op tapijt",
      intensive_cleaning: "Intensieve reiniging",
      intensive_cleaning_desc: "Dieptereiniging met extra passages",
      side_brush_rotate: "Zijborstel draaien",
      side_brush_rotate_desc: "Zijborstel draaien op tapijten",
      sensitivity: "Tapijtgevoeligheid",
      sensitivity_desc: "Gevoeligheidsniveau voor detectie",
      sensitivity_low: "Laag",
      sensitivity_medium: "Gemiddeld",
      sensitivity_high: "Hoog",
      cleaning_mode: "Tapijtreiniging",
      cleaning_mode_desc: "Hoe tapijten behandelen tijdens het reinigen",
      mode_vacuum: "Stofzuigen",
      mode_vacuum_and_mop: "Zuig & Dweil",
      mode_avoidance: "Vermijden",
      mode_ignore: "Negeren",
      vacuum_mode: "Stofzuigmodus",
      vacuum_adaptation: "Dweil optillen",
      vacuum_remove_mop: "Dweil verwijderen"
    },
    floor: {
      title: "Vloerinstellingen",
      obstacle_avoidance: "Obstakelvermijding",
      obstacle_avoidance_desc: "Sensoren gebruiken om obstakels te vermijden",
      collision_avoidance: "Botsing vermijden",
      collision_avoidance_desc: "Vertragen bij muren en meubels",
      auto_mount_mop: "Auto dweil monteren",
      auto_mount_mop_desc: "Automatisch dweilpad bevestigen wanneer nodig",
      auto_recleaning: "Auto her-reiniging",
      auto_recleaning_desc: "Automatisch gemiste gebieden opnieuw reinigen",
      recleaning_off: "Uit",
      recleaning_in_deep_mode: "In diepe modus",
      recleaning_in_all_modes: "In alle modi",
      stain_avoidance: "Vlekvermijding",
      stain_avoidance_desc: "Gedetecteerde vlekken vermijden",
      tight_mopping: "Grondig dweilen",
      tight_mopping_desc: "Dweilen dichter bij muren en randen",
      floor_direction_cleaning: "Vloerichting reiniging",
      floor_direction_cleaning_desc: "Reinigen langs de vloernerf",
      large_particles_boost: "Grote deeltjes boost",
      large_particles_boost_desc: "Zuigkracht verhogen voor groot vuil",
      pet_focused_cleaning: "Huisdier-gerichte reiniging",
      pet_focused_cleaning_desc: "Extra reiniging in huisdiergebieden",
      low_lying_area_frequency: "Lage-zonefrequentie",
      low_lying_area_frequency_desc: "Hoe vaak lage zones onder meubels reinigen"
    },
    edge_corner: {
      title: "Randen & Hoeken",
      side_reach: "Zijbereik",
      side_reach_desc: "Zijborstel uitschuiven voor randen",
      mop_extend: "Dweil uitschuiven",
      mop_extend_desc: "Dweil uitschuiven voor randen en hoeken",
      gap_cleaning: "Spleetreiniging",
      gap_cleaning_desc: "Smalle spleten tussen meubels reinigen",
      mopping_under: "Dweilen onder meubels",
      mopping_under_desc: "Dweil uitschuiven onder lage meubels",
      extend_frequency: "Uitschuiffrequentie",
      extend_frequency_desc: "Hoe vaak dweil uitschuiven voor randenreiniging",
      frequency_standard: "Standaard",
      frequency_intelligent: "Intelligent",
      frequency_high: "Hoog"
    },
    dock: {
      title: "Dock-instellingen",
      self_clean: "Zelfreiniging",
      self_clean_desc: "Auto dweil wassen na reiniging",
      auto_empty_mode: "Auto legen modus",
      auto_empty_mode_desc: "Wanneer automatisch de stofbak legen",
      auto_empty_frequency: "Auto legen frequentie",
      auto_empty_frequency_desc: "Hoeveel reinigingen voor auto legen",
      empty_off: "Uit",
      empty_standard: "Standaard",
      empty_high_frequency: "Hoge frequentie",
      empty_low_frequency: "Lage frequentie",
      auto_detergent: "Auto wasmiddel",
      auto_detergent_desc: "Automatisch wasmiddel toevoegen bij wassen",
      mop_washing_with_detergent: "Dweil wassen met wasmiddel",
      mop_washing_with_detergent_desc: "Wasmiddel gebruiken bij dweil wassen",
      mopping_with_detergent: "Dweilen met wasmiddel",
      mopping_with_detergent_desc: "Wasmiddel gebruiken tijdens het dweilen",
      water_electrolysis: "Water elektrolyse",
      water_electrolysis_desc: "Water steriliseren met elektrolyse",
      auto_water_refilling: "Auto water bijvullen",
      auto_water_refilling_desc: "Automatisch schoonwatertank bijvullen",
      auto_dust_collecting: "Auto stof verzamelen",
      auto_dust_collecting_desc: "Automatisch stofbak legen na reiniging",
      smart_washing: "Slim wassen",
      smart_washing_desc: "Wassen aanpassen op basis van vuilniveau",
      mop_wash_level: "Dweil wasniveau",
      mop_wash_level_desc: "Intensiteit van dweil wassen",
      washing_mode: "Wasmodus",
      washing_mode_desc: "Intensiteit van dweil wassen",
      washing_light: "Licht",
      washing_standard: "Standaard",
      washing_deep: "Diep",
      water_temperature: "Watertemperatuur",
      water_temperature_desc: "Temperatuur voor dweil wassen",
      temp_normal: "Normaal",
      temp_mild: "Mild",
      temp_warm: "Warm",
      temp_hot: "Heet",
      auto_drying: "Auto drogen",
      auto_drying_desc: "Automatisch dweil drogen na reiniging",
      drying_time: "Droogtijd",
      drying_time_desc: "Duur van dweil drogen",
      auto_rewashing: "Auto herwassen",
      auto_rewashing_desc: "Automatisch dweil herwassen wanneer vuil",
      rewashing_off: "Uit",
      rewashing_in_deep_mode: "In diepe modus",
      rewashing_in_all_modes: "In alle modi",
      off_peak_charging: "Daluren opladen",
      off_peak_charging_desc: "Opladen tijdens daluren om energie te besparen",
      off_peak_charging_start: "Starttijd",
      off_peak_charging_end: "Eindtijd",
      station_cleaning: "Station reiniging",
      station_cleaning_desc: "Het basisstation reinigen",
      clean_now: "Nu reinigen",
      self_repair: "Zelfreparatie",
      self_repair_desc: "Station zelfreparatie diagnose uitvoeren",
      repair_now: "Repareren",
      scraper_frequency: "Schraperfrequentie",
      scraper_frequency_desc: "Hoe vaak de rubberen schraper reinigen"
    },
    ai_detection: {
      title: "AI & Detectie",
      intelligent_recognition: "Intelligente herkenning",
      intelligent_recognition_desc: "AI-gestuurde omgevingsherkenning",
      ai_obstacle_detection: "AI-obstakeldetectie",
      ai_obstacle_detection_desc: "AI gebruiken om obstakels te herkennen en vermijden",
      fuzzy_obstacle_detection: "Vage obstakeldetectie",
      fuzzy_obstacle_detection_desc: "Zachte of onduidelijke obstakels detecteren",
      ai_obstacle_image_upload: "Obstakelfoto's uploaden",
      ai_obstacle_image_upload_desc: "Foto's van obstakels uploaden voor analyse",
      ai_obstacle_picture: "Obstakelfoto",
      ai_obstacle_picture_desc: "Foto's maken van gedetecteerde obstakels",
      ai_pet_detection: "Huisdierdetectie",
      ai_pet_detection_desc: "Huisdieren detecteren en vermijden",
      ai_pet_avoidance: "Huisdier vermijden",
      ai_pet_avoidance_desc: "Actief gedetecteerde huisdieren vermijden",
      pet_focused_detection: "Huisdier-gerichte detectie",
      pet_focused_detection_desc: "Verbeterde detectie voor huisdiergebieden",
      pet_picture: "Huisdierfoto",
      pet_picture_desc: "Foto's maken van gedetecteerde huisdieren",
      ai_human_detection: "Personendetectie",
      ai_human_detection_desc: "Personen detecteren en vermijden",
      human_follow: "Persoon volgen",
      human_follow_desc: "Personen volgen voor interactieve reiniging",
      ai_furniture_detection: "Meubeldetectie",
      ai_furniture_detection_desc: "Meubels detecteren en eromheen navigeren",
      ai_fluid_detection: "Vloeistofdetectie",
      ai_fluid_detection_desc: "Vloeistoffen detecteren en vermijden",
      fill_light: "Bijverlichting",
      fill_light_desc: "Bijverlichting gebruiken voor betere detectie",
      camera_light_auto: "Auto camerahelderheid",
      camera_light_auto_desc: "Cameralicht helderheid automatisch aanpassen",
      camera_light_brightness: "Cameralicht helderheid",
      camera_light_brightness_desc: "Handmatig cameralicht helderheidsniveau"
    },
    station_controls: {
      title: "Stationbediening",
      self_clean: "Zelfreiniging",
      self_clean_desc: "Start de dweilwascyclus",
      manual_drying: "Handmatig drogen",
      manual_drying_desc: "Start de dweildroogcyclus",
      water_tank_draining: "Watertank legen",
      water_tank_draining_desc: "Vuil water uit de tank laten lopen",
      base_station_cleaning: "Station reinigen",
      base_station_cleaning_desc: "Reinig het basisstation",
      empty_water_tank: "Watertank leegmaken",
      empty_water_tank_desc: "De wateropvangtank leegmaken",
      start_auto_empty: "Auto legen",
      start_auto_empty_desc: "Start automatisch stofbak legen",
      start_recleaning: "Her-reiniging",
      start_recleaning_desc: "Start her-reiniging van gemiste gebieden",
      clear_warning: "Waarschuwing wissen",
      clear_warning_desc: "Huidige waarschuwingsberichten wissen"
    },
    map: {
      title: "Kaartinstellingen",
      multi_floor: "Multi-verdiepingen kaart",
      multi_floor_desc: "Ondersteuning voor meerdere verdiepingskaarten inschakelen",
      rotation: "Kaartrotatie",
      rotation_desc: "Kaartoriëntatie draaien",
      mapping_actions: "Kaartacties",
      start_mapping: "Start kaartmaking",
      start_fast_mapping: "Snelle kaartmaking"
    }
  }
}, s1 = {
  // Common
  common: {
    run: "Esegui",
    start: "Avvia",
    stop: "Ferma",
    cancel: "Annulla",
    save: "Salva",
    apply: "Applica",
    reset: "Reimposta"
  },
  // Room Selector
  room_selector: {
    title: "Seleziona stanze",
    selected_count: "{{count}} selezionate"
  },
  // Map Selector
  map_selector: {
    unknown: "Mappa sconosciuta"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "Nessuna mappa disponibile",
    looking_for: "Ricerca di: {{entity}}",
    room_overlay: "Clicca sui numeri delle stanze per selezionarle per la pulizia",
    zone_overlay_create: "Clicca sulla mappa per posizionare una zona di pulizia",
    zone_overlay_resize: "Trascina gli angoli per ridimensionare, clicca altrove per riposizionare",
    clear_zone: "Cancella zona",
    switch_to_list: "Passa alla vista elenco",
    switch_to_map: "Passa alla vista mappa",
    room_list_overlay: "Tocca le stanze per selezionarle per la pulizia",
    no_rooms: "Nessuna stanza disponibile",
    zoom_in: "Ingrandisci",
    zoom_out: "Riduci",
    zoom_reset: "Reimposta zoom",
    lock_map: "Blocca mappa",
    unlock_map: "Sblocca mappa"
  },
  // Mode Tabs
  modes: {
    room: "Stanza",
    all: "Tutto",
    zone: "Zona"
  },
  // Action Buttons
  actions: {
    clean: "Pulisci",
    clean_all: "Pulisci tutto",
    clean_rooms: "Pulisci {{count}} stanza",
    clean_rooms_plural: "Pulisci {{count}} stanze",
    select_rooms: "Seleziona stanze",
    zone_clean: "Pulizia zona",
    pause: "Pausa",
    resume: "Riprendi",
    stop: "Stop",
    stop_and_dock: "Stop e rientra",
    dock: "Rientra alla base"
  },
  // Toast Messages
  toast: {
    selected_room: "{{name}} selezionata",
    deselected_room: "{{name}} deselezionata",
    paused: "Pulizia in pausa",
    stopped: "Pulizia interrotta",
    docked: "Rientro alla base in corso",
    cleaning_started: "Pulizia avviata",
    resuming: "Ripresa della pulizia",
    starting_full_clean: "Avvio pulizia completa della casa",
    pausing_vacuum: "Messa in pausa del robot",
    stopping_vacuum: "Arresto del robot",
    stopping_and_docking: "Arresto e rientro alla base",
    vacuum_docking: "Il robot sta rientrando alla base",
    starting_room_clean: "Avvio pulizia per {{count}} stanza selezionata",
    starting_room_clean_plural: "Avvio pulizia per {{count}} stanze selezionate",
    starting_zone_clean: "Avvio pulizia della zona",
    select_rooms_first: "Seleziona prima le stanze da pulire",
    cannot_determine_map: "Impossibile determinare le dimensioni della mappa",
    select_zone_first: "Seleziona una zona sulla mappa"
  },
  // Room Selection Display
  room_display: {
    selected_rooms: "Stanze selezionate:",
    selected_label: "Selezionate:"
  },
  // Cleaning Mode Button
  cleaning_mode_button: {
    prefix_custom: "Personalizzato: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "Visualizza scorciatoie",
    repeats_tooltip: "Passaggi di pulizia",
    vac_and_mop: "Aspirazione e lavaggio",
    mop_after_vac: "Lavaggio dopo aspirazione",
    vacuum: "Aspirazione",
    mop: "Lavaggio"
  },
  // Cleaning Mode Modal
  cleaning_mode: {
    title: "Modalità di pulizia",
    clean_genius: "CleanGenius",
    custom: "Personalizzata"
  },
  // Shortcuts Modal
  shortcuts: {
    title: "Scorciatoie",
    no_shortcuts: "Nessuna scorciatoia disponibile",
    create_hint: "Crea scorciatoie nell'app Dreame per avviare rapidamente le tue routine di pulizia preferite"
  },
  // Custom Mode
  custom_mode: {
    cleaning_mode_title: "Modalità di pulizia",
    suction_power_title: "Potenza di aspirazione",
    max_plus_description: "La potenza di aspirazione sarà aumentata al livello massimo. Modalità utilizzabile una sola volta.",
    wetness_title: "Livello di umidità",
    mop_pad_humidity_title: "Umidità del panno",
    slightly_dry: "Leggermente asciutto",
    moist: "Umido",
    wet: "Bagnato",
    water_volume_title: "Volume d'acqua",
    water_low: "Basso",
    water_medium: "Medio",
    water_high: "Alto",
    mop_washing_frequency_title: "Frequenza lavaggio mop",
    route_title: "Percorso",
    mop_pressure_title: "Pressione Mop",
    mop_temperature_title: "Temperatura dell'acqua"
  },
  // Mop pressure levels
  mop_pressure: {
    light: "Leggera",
    normal: "Normale"
  },
  // Mop temperature levels
  mop_temperature: {
    normal: "Normale",
    warm: "Calda"
  },
  // Customize Cleaning Mode
  customize: {
    title: "Personalizza",
    description: "Imposta preferenze personalizzate di aspirazione e lavaggio per ogni area.",
    set_button: "Imposta",
    vacuum: "Aspira",
    mop: "Lava",
    vac_and_mop: "Aspira e lava",
    cycles: "Cicli",
    apply_to_all: "Applica a tutte le stanze",
    click_room_hint: "Clicca su un'area per cambiare la modalità.",
    intelligent_recommendation: "Raccomandazione intelligente",
    select_room: "Seleziona stanza",
    settings_for: "Impostazioni di {{room}}",
    no_rooms: "Nessuna stanza disponibile"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Modalità di pulizia",
    deep_cleaning: "Pulizia profonda"
  },
  // Header
  header: {
    battery: "Batteria",
    status: "Stato",
    area: "Area",
    time: "Tempo"
  },
  // Units
  units: {
    square_meters: "m²",
    minutes: "min",
    minutes_short: "m",
    percent: "%",
    decibels: "dBm"
  },
  // Suction Levels (friendly names)
  suction_levels: {
    quiet: "Silenzioso",
    standard: "Standard",
    strong: "Turbo",
    turbo: "Max"
  },
  // Mop Washing Frequency
  mop_washing_frequency: {
    by_room: "Per stanza",
    by_area: "Per area",
    by_time: "Per tempo"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "Veloce",
    standard: "Standard",
    intensive: "Intensivo",
    deep: "Profondo"
  },
  // Errors
  errors: {
    entity_not_found: "Entità non trovata: {{entity}}",
    failed_to_load: "Impossibile caricare i dati entità",
    service_call_failed: "Impossibile inviare il comando all'aspirapolvere",
    entity_unavailable: "Aspirapolvere non disponibile"
  },
  // Settings Panel
  settings: {
    title: "Impostazioni",
    consumables: {
      title: "Materiali di consumo",
      main_brush: "Spazzola principale",
      side_brush: "Spazzola laterale",
      filter: "Filtro",
      sensor: "Sensore",
      mop_pad: "Panno lavapavimenti",
      silver_ion: "Ioni d'argento",
      detergent: "Detergente",
      squeegee: "Tergipavimento",
      tank_filter: "Filtro serbatoio",
      onboard_dirty_water_tank: "Serbatoio acqua sporca integrato",
      dirty_water_channel: "Canale acqua sporca",
      deodorizer: "Deodorante",
      wheel: "Ruota",
      scale_inhibitor: "Anticalcare",
      fluffing_roller: "Rullo spazzolatore",
      roller_mop_filter: "Filtro panno rotante",
      water_outlet_filter: "Filtro uscita acqua",
      remaining: "rimanente",
      reset: "Reimposta"
    },
    device_info: {
      title: "Informazioni dispositivo",
      firmware: "Firmware",
      total_area: "Area totale pulita",
      total_time: "Tempo totale di pulizia",
      total_cleans: "Pulizie totali",
      wifi_ssid: "Rete Wi-Fi",
      wifi_signal: "Potenza segnale",
      ip_address: "Indirizzo IP"
    },
    quick_settings: {
      title: "Impostazioni rapide",
      child_lock: "Blocco bambini",
      child_lock_desc: "Disabilita i pulsanti fisici del dispositivo",
      resume_cleaning: "Riprendi pulizia",
      resume_cleaning_desc: "Riprendi automaticamente la pulizia dopo la ricarica",
      dnd: "Non disturbare",
      dnd_desc: "Orari silenziosi con attività ridotta",
      dnd_start: "Ora di inizio",
      dnd_end: "Ora di fine",
      dnd_disable_resume: "Disabilita ripresa",
      dnd_disable_resume_desc: "Non riprendere la pulizia durante DND",
      dnd_disable_auto_empty: "Disabilita svuotamento auto",
      dnd_disable_auto_empty_desc: "Non svuotare automaticamente durante DND",
      dnd_reduce_volume: "Riduci volume",
      dnd_reduce_volume_desc: "Abbassa il volume del dispositivo durante DND"
    },
    volume: {
      title: "Volume e suoni",
      volume: "Volume",
      test_sound: "Individua",
      muted: "Disattivato",
      voice_assistant: "Assistente vocale",
      voice_assistant_desc: "Abilita annunci e feedback vocali",
      voice_language: "Lingua voce",
      voice_language_desc: "Lingua per gli annunci vocali",
      streaming_voice_prompt: "Prompt vocale in streaming",
      streaming_voice_prompt_desc: "Feedback vocale in tempo reale durante la pulizia"
    },
    carpet: {
      title: "Impostazioni tappeti",
      carpet_recognition: "Riconoscimento tappeti",
      carpet_recognition_desc: "Rileva automaticamente i tappeti",
      carpet_avoidance: "Evita tappeti",
      carpet_avoidance_desc: "Evita i tappeti durante il lavaggio",
      clean_carpets_first: "Pulisci tappeti prima",
      clean_carpets_first_desc: "Aspira i tappeti prima di lavare i pavimenti",
      carpet_boost: "Potenza tappeti",
      carpet_boost_desc: "Aumenta la potenza di aspirazione sui tappeti",
      intensive_cleaning: "Pulizia intensiva",
      intensive_cleaning_desc: "Pulizia profonda con passaggi extra",
      side_brush_rotate: "Rotazione spazzola laterale",
      side_brush_rotate_desc: "Ruota la spazzola laterale sui tappeti",
      sensitivity: "Sensibilità tappeti",
      sensitivity_desc: "Livello di sensibilità di rilevamento",
      sensitivity_low: "Bassa",
      sensitivity_medium: "Media",
      sensitivity_high: "Alta",
      cleaning_mode: "Pulizia tappeti",
      cleaning_mode_desc: "Come gestire i tappeti durante la pulizia",
      mode_vacuum: "Aspira",
      mode_vacuum_and_mop: "Asp. e Lava",
      mode_avoidance: "Evita",
      mode_ignore: "Ignora",
      vacuum_mode: "Modalità aspirazione",
      vacuum_adaptation: "Solleva panno",
      vacuum_remove_mop: "Rimuovi panno"
    },
    floor: {
      title: "Impostazioni pavimento",
      obstacle_avoidance: "Evitamento ostacoli",
      obstacle_avoidance_desc: "Usa i sensori per evitare ostacoli",
      collision_avoidance: "Evita collisioni",
      collision_avoidance_desc: "Rallenta vicino a pareti e mobili",
      auto_mount_mop: "Monta panno auto",
      auto_mount_mop_desc: "Montare automaticamente il panno quando necessario",
      auto_recleaning: "Ri-pulizia auto",
      auto_recleaning_desc: "Ri-pulire automaticamente le aree mancate",
      recleaning_off: "Disattivato",
      recleaning_in_deep_mode: "In modalità profonda",
      recleaning_in_all_modes: "In tutte le modalità",
      stain_avoidance: "Evitamento macchie",
      stain_avoidance_desc: "Evita le macchie rilevate",
      tight_mopping: "Lavaggio accurato",
      tight_mopping_desc: "Lava più vicino a pareti e bordi",
      floor_direction_cleaning: "Pulizia direzione pavimento",
      floor_direction_cleaning_desc: "Pulisce seguendo la direzione delle venature del pavimento",
      large_particles_boost: "Potenziamento particelle grandi",
      large_particles_boost_desc: "Aumenta l'aspirazione per detriti grandi",
      pet_focused_cleaning: "Pulizia aree animali",
      pet_focused_cleaning_desc: "Pulizia extra nelle aree degli animali domestici",
      low_lying_area_frequency: "Frequenza zone basse",
      low_lying_area_frequency_desc: "Quanto spesso pulire le zone basse sotto i mobili"
    },
    edge_corner: {
      title: "Bordi e Angoli",
      side_reach: "Portata laterale",
      side_reach_desc: "Estendere la spazzola laterale per i bordi",
      mop_extend: "Estensione panno",
      mop_extend_desc: "Estendere il panno per bordi e angoli",
      gap_cleaning: "Pulizia fessure",
      gap_cleaning_desc: "Pulire spazi stretti tra i mobili",
      mopping_under: "Lavaggio sotto mobili",
      mopping_under_desc: "Estendere il panno sotto mobili bassi",
      extend_frequency: "Frequenza estensione",
      extend_frequency_desc: "Frequenza di estensione per pulizia bordi",
      frequency_standard: "Standard",
      frequency_intelligent: "Intelligente",
      frequency_high: "Alta"
    },
    dock: {
      title: "Impostazioni base",
      self_clean: "Autopulizia",
      self_clean_desc: "Lavaggio automatico del panno dopo la pulizia",
      auto_empty_mode: "Svuotamento auto",
      auto_empty_mode_desc: "Quando svuotare automaticamente il contenitore",
      auto_empty_frequency: "Frequenza svuotamento auto",
      auto_empty_frequency_desc: "Quante pulizie prima dello svuotamento auto",
      empty_off: "Disattivato",
      empty_standard: "Standard",
      empty_high_frequency: "Alta frequenza",
      empty_low_frequency: "Bassa frequenza",
      auto_detergent: "Detergente auto",
      auto_detergent_desc: "Aggiungere automaticamente detergente durante il lavaggio",
      mop_washing_with_detergent: "Lavaggio panno con detergente",
      mop_washing_with_detergent_desc: "Usa detergente durante il lavaggio del panno",
      mopping_with_detergent: "Lavaggio con detergente",
      mopping_with_detergent_desc: "Usa detergente durante il lavaggio del pavimento",
      water_electrolysis: "Elettrolisi acqua",
      water_electrolysis_desc: "Sterilizza l'acqua tramite elettrolisi",
      auto_water_refilling: "Riempimento auto acqua",
      auto_water_refilling_desc: "Riempie automaticamente il serbatoio acqua pulita",
      auto_dust_collecting: "Raccolta auto polvere",
      auto_dust_collecting_desc: "Svuota automaticamente il contenitore dopo la pulizia",
      smart_washing: "Lavaggio intelligente",
      smart_washing_desc: "Regolare il lavaggio in base allo sporco",
      mop_wash_level: "Livello lavaggio panno",
      mop_wash_level_desc: "Intensità del lavaggio del panno",
      washing_mode: "Modalità lavaggio",
      washing_mode_desc: "Intensità del lavaggio del panno",
      washing_light: "Leggero",
      washing_standard: "Standard",
      washing_deep: "Profondo",
      water_temperature: "Temperatura dell'acqua",
      water_temperature_desc: "Temperatura per il lavaggio del panno",
      temp_normal: "Normale",
      temp_mild: "Mite",
      temp_warm: "Tiepida",
      temp_hot: "Calda",
      auto_drying: "Asciugatura auto",
      auto_drying_desc: "Asciugare automaticamente il panno dopo la pulizia",
      drying_time: "Tempo asciugatura",
      drying_time_desc: "Durata asciugatura del panno",
      auto_rewashing: "Rilavaggio automatico",
      auto_rewashing_desc: "Rilavare automaticamente il panno quando sporco",
      rewashing_off: "Disattivato",
      rewashing_in_deep_mode: "In modalità profonda",
      rewashing_in_all_modes: "In tutte le modalità",
      off_peak_charging: "Ricarica fuori picco",
      off_peak_charging_desc: "Ricaricare durante le ore non di punta per risparmiare energia",
      off_peak_charging_start: "Ora di inizio",
      off_peak_charging_end: "Ora di fine",
      station_cleaning: "Pulizia stazione",
      station_cleaning_desc: "Pulire la stazione base",
      clean_now: "Pulisci ora",
      self_repair: "Autoriparazione",
      self_repair_desc: "Esegui la diagnostica di autoriparazione della stazione",
      repair_now: "Ripara",
      scraper_frequency: "Frequenza raschietto",
      scraper_frequency_desc: "Quanto spesso pulire il raschietto in gomma"
    },
    ai_detection: {
      title: "AI e rilevamento",
      intelligent_recognition: "Riconoscimento intelligente",
      intelligent_recognition_desc: "Riconoscimento dell'ambiente basato su AI",
      ai_obstacle_detection: "Rilevamento ostacoli AI",
      ai_obstacle_detection_desc: "Usa l'AI per identificare ed evitare ostacoli",
      fuzzy_obstacle_detection: "Rilevamento ostacoli sfocati",
      fuzzy_obstacle_detection_desc: "Rileva ostacoli morbidi o poco chiari",
      ai_obstacle_image_upload: "Caricamento immagini ostacoli",
      ai_obstacle_image_upload_desc: "Carica immagini degli ostacoli per l'analisi",
      ai_obstacle_picture: "Foto ostacoli",
      ai_obstacle_picture_desc: "Scatta foto degli ostacoli rilevati",
      ai_pet_detection: "Rilevamento animali domestici",
      ai_pet_detection_desc: "Rileva ed evita animali domestici",
      ai_pet_avoidance: "Evita animali domestici",
      ai_pet_avoidance_desc: "Evita attivamente gli animali rilevati",
      pet_focused_detection: "Rilevamento focalizzato animali",
      pet_focused_detection_desc: "Rilevamento migliorato per le aree degli animali",
      pet_picture: "Foto animali",
      pet_picture_desc: "Scatta foto degli animali rilevati",
      ai_human_detection: "Rilevamento persone",
      ai_human_detection_desc: "Rileva ed evita persone",
      human_follow: "Segui persone",
      human_follow_desc: "Segui le persone per una pulizia interattiva",
      ai_furniture_detection: "Rilevamento mobili",
      ai_furniture_detection_desc: "Rileva e aggira i mobili",
      ai_fluid_detection: "Rilevamento liquidi",
      ai_fluid_detection_desc: "Rileva ed evita liquidi",
      fill_light: "Luce di riempimento",
      fill_light_desc: "Usa la luce di riempimento per un rilevamento migliore",
      camera_light_auto: "Luminosità camera automatica",
      camera_light_auto_desc: "Regola automaticamente la luminosità della luce della camera",
      camera_light_brightness: "Luminosità luce camera",
      camera_light_brightness_desc: "Livello di luminosità manuale della luce della camera"
    },
    station_controls: {
      title: "Controlli stazione",
      self_clean: "Autopulizia",
      self_clean_desc: "Avvia il ciclo di lavaggio del panno",
      manual_drying: "Asciugatura manuale",
      manual_drying_desc: "Avvia il ciclo di asciugatura del panno",
      water_tank_draining: "Svuota serbatoio",
      water_tank_draining_desc: "Scarica l'acqua sporca dal serbatoio",
      base_station_cleaning: "Pulisci stazione",
      base_station_cleaning_desc: "Pulisci la stazione base",
      empty_water_tank: "Svuota serbatoio acqua",
      empty_water_tank_desc: "Svuota il serbatoio di raccolta dell'acqua",
      start_auto_empty: "Svuotamento automatico",
      start_auto_empty_desc: "Avvia lo svuotamento automatico del contenitore",
      start_recleaning: "Ripulizia",
      start_recleaning_desc: "Avvia la ripulizia delle aree mancate",
      clear_warning: "Cancella avviso",
      clear_warning_desc: "Cancella i messaggi di avviso correnti"
    },
    map: {
      title: "Impostazioni mappa",
      multi_floor: "Mappa multipiano",
      multi_floor_desc: "Abilita il supporto per mappe a più piani",
      rotation: "Rotazione mappa",
      rotation_desc: "Ruota l'orientamento della mappa",
      mapping_actions: "Azioni mappatura",
      start_mapping: "Avvia mappatura",
      start_fast_mapping: "Mappatura veloce"
    }
  }
}, l1 = {
  // Common
  common: {
    run: "Uruchom",
    start: "Start",
    stop: "Stop",
    cancel: "Anuluj",
    save: "Zapisz",
    apply: "Zastosuj",
    reset: "Resetuj"
  },
  // Room Selector
  room_selector: {
    title: "Wybierz pokoje",
    selected_count: "Wybrano: {{count}}"
  },
  // Map Selector
  map_selector: {
    unknown: "Nieznana mapa"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "Mapa niedostępna",
    looking_for: "Szukanie: {{entity}}",
    room_overlay: "Kliknij numery pokojów, aby wybrać je do sprzątania",
    zone_overlay_create: "Kliknij na mapie, aby umieścić strefę sprzątania",
    zone_overlay_resize: "Przeciągnij rogi, aby zmienić rozmiar, kliknij obok, aby zmienić pozycję",
    clear_zone: "Wyczyść strefę",
    switch_to_list: "Przełącz na widok listy",
    switch_to_map: "Przełącz na widok mapy",
    room_list_overlay: "Dotknij pokoje, aby wybrać do sprzątania",
    no_rooms: "Brak dostępnych pokoi",
    zoom_in: "Powiększ",
    zoom_out: "Pomniejsz",
    zoom_reset: "Resetuj powiększenie",
    lock_map: "Zablokuj mapę",
    unlock_map: "Odblokuj mapę"
  },
  // Mode Tabs
  modes: {
    room: "Pokój",
    all: "Wszystko",
    zone: "Strefa"
  },
  // Action Buttons
  actions: {
    clean: "Sprzątaj",
    clean_all: "Sprzątaj wszystko",
    clean_rooms: "Sprzątaj {{count}} pokój",
    clean_rooms_plural: "Sprzątaj {{count}} pokoje/pokoi",
    select_rooms: "Wybierz pokoje",
    zone_clean: "Sprzątanie strefowe",
    pause: "Pauza",
    resume: "Wznów",
    stop: "Zatrzymaj",
    stop_and_dock: "Zatrzymaj i wróć",
    dock: "Baza"
  },
  // Toast Messages
  toast: {
    selected_room: "Wybrano {{name}}",
    deselected_room: "Odznaczono {{name}}",
    paused: "Wstrzymano sprzątanie",
    stopped: "Zatrzymano sprzątanie",
    docked: "Powrót do bazy",
    cleaning_started: "Rozpoczęto sprzątanie",
    resuming: "Wznawianie sprzątania",
    starting_full_clean: "Rozpoczynanie sprzątania całego domu",
    pausing_vacuum: "Wstrzymywanie odkurzacza",
    stopping_vacuum: "Zatrzymywanie odkurzacza",
    stopping_and_docking: "Zatrzymywanie i powrót do bazy",
    vacuum_docking: "Odkurzacz wraca do bazy",
    starting_room_clean: "Rozpoczynanie sprzątania {{count}} wybranego pokoju",
    starting_room_clean_plural: "Rozpoczynanie sprzątania {{count}} wybranych pokojów",
    starting_zone_clean: "Rozpoczynanie sprzątania strefowego",
    select_rooms_first: "Najpierw wybierz pokoje do sprzątania",
    cannot_determine_map: "Nie można określić wymiarów mapy",
    select_zone_first: "Najpierw wybierz strefę na mapie"
  },
  // Room Selection Display
  room_display: {
    selected_rooms: "Wybrane pokoje:",
    selected_label: "Wybrano:"
  },
  // Cleaning Mode Button
  cleaning_mode_button: {
    prefix_custom: "Własne: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "Pokaż skróty",
    repeats_tooltip: "Liczba przejść",
    vac_and_mop: "Odkurzanie i mopowanie",
    mop_after_vac: "Mopowanie po odkurzaniu",
    vacuum: "Odkurzanie",
    mop: "Mopowanie"
  },
  // Cleaning Mode Modal
  cleaning_mode: {
    title: "Tryb sprzątania",
    clean_genius: "CleanGenius",
    custom: "Własny"
  },
  // Shortcuts Modal
  shortcuts: {
    title: "Skróty",
    no_shortcuts: "Brak dostępnych skrótów",
    create_hint: "Utwórz skróty w aplikacji Dreame, aby szybko uruchamiać ulubione procedury sprzątania"
  },
  // Custom Mode
  custom_mode: {
    cleaning_mode_title: "Tryb sprzątania",
    suction_power_title: "Siła ssania",
    max_plus_description: "Siła ssania zostanie zwiększona do najwyższego poziomu (tryb jednorazowy).",
    wetness_title: "Wilgotność mopa",
    mop_pad_humidity_title: "Wilgotność nakładki mopa",
    slightly_dry: "Lekko suchy",
    moist: "Wilgotny",
    wet: "Mokry",
    water_volume_title: "Ilość wody",
    water_low: "Niska",
    water_medium: "Średnia",
    water_high: "Wysoka",
    mop_washing_frequency_title: "Częstotliwość mycia mopa",
    route_title: "Trasa",
    mop_pressure_title: "Siła nacisku mopa",
    mop_temperature_title: "Temperatura wody"
  },
  // Mop pressure levels
  mop_pressure: {
    light: "Lekki",
    normal: "Normalny"
  },
  // Mop temperature levels
  mop_temperature: {
    normal: "Normalna",
    warm: "Ciepła"
  },
  // Customize Cleaning Mode
  customize: {
    title: "Dostosuj",
    description: "Ustaw spersonalizowane preferencje ssania i mopowania dla każdego obszaru.",
    set_button: "Ustaw",
    vacuum: "Odkurzaj",
    mop: "Mopuj",
    vac_and_mop: "Odkurzaj i mopuj",
    cycles: "Cykle",
    apply_to_all: "Zastosuj do wszystkich pomieszczeń",
    click_room_hint: "Kliknij obszar, aby zmienić tryb.",
    intelligent_recommendation: "Inteligentna rekomendacja",
    select_room: "Wybierz pokój",
    settings_for: "Ustawienia {{room}}",
    no_rooms: "Brak dostępnych pokoi"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "Tryb sprzątania",
    deep_cleaning: "Głębokie czyszczenie"
  },
  // Header
  header: {
    battery: "Bateria",
    status: "Status",
    area: "Powierzchnia",
    time: "Czas"
  },
  // Units
  units: {
    square_meters: "m²",
    minutes: "min",
    minutes_short: "m",
    percent: "%",
    decibels: "dBm"
  },
  // Suction Levels (friendly names)
  suction_levels: {
    quiet: "Cichy",
    standard: "Standardowy",
    strong: "Turbo",
    turbo: "Max"
  },
  // Mop Washing Frequency
  mop_washing_frequency: {
    by_room: "Według pokoju",
    by_area: "Według powierzchni",
    by_time: "Według czasu"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "Szybki",
    standard: "Standardowy",
    intensive: "Intensywny",
    deep: "Głęboki"
  },
  // Errors
  errors: {
    entity_not_found: "Nie znaleziono encji: {{entity}}",
    failed_to_load: "Nie udało się załadować danych encji",
    service_call_failed: "Nie udało się wysłać polecenia do odkurzacza",
    entity_unavailable: "Odkurzacz niedostępny"
  },
  // Settings Panel
  settings: {
    title: "Ustawienia",
    consumables: {
      title: "Materiały eksploatacyjne",
      main_brush: "Szczotka główna",
      side_brush: "Szczotka boczna",
      filter: "Filtr",
      sensor: "Czujnik",
      mop_pad: "Nakładka mopująca",
      silver_ion: "Jony srebra",
      detergent: "Detergent",
      squeegee: "Ściągaczka",
      tank_filter: "Filtr zbiornika",
      onboard_dirty_water_tank: "Wbudowany zbiornik brudnej wody",
      dirty_water_channel: "Kanał brudnej wody",
      deodorizer: "Dezodorant",
      wheel: "Koło",
      scale_inhibitor: "Środek antywapniowy",
      fluffing_roller: "Wałek napuszający",
      roller_mop_filter: "Filtr mopa rolkowego",
      water_outlet_filter: "Filtr wylotu wody",
      remaining: "pozostało",
      reset: "Resetuj"
    },
    device_info: {
      title: "Informacje o urządzeniu",
      firmware: "Oprogramowanie układowe",
      total_area: "Całkowita powierzchnia sprzątania",
      total_time: "Całkowity czas sprzątania",
      total_cleans: "Liczba sprzątań",
      wifi_ssid: "Sieć Wi-Fi",
      wifi_signal: "Siła sygnału",
      ip_address: "Adres IP"
    },
    quick_settings: {
      title: "Szybkie ustawienia",
      child_lock: "Blokada rodzicielska",
      child_lock_desc: "Wyłącz przyciski fizyczne na urządzeniu",
      resume_cleaning: "Wznów sprzątanie",
      resume_cleaning_desc: "Automatycznie wznów sprzątanie po naładowaniu",
      dnd: "Nie przeszkadzać (DND)",
      dnd_desc: "Godziny ciszy z ograniczoną aktywnością",
      dnd_start: "Czas rozpoczęcia",
      dnd_end: "Czas zakończenia",
      dnd_disable_resume: "Wyłącz wznawianie",
      dnd_disable_resume_desc: "Nie wznawiaj sprzątania podczas DND",
      dnd_disable_auto_empty: "Wyłącz auto opróżnianie",
      dnd_disable_auto_empty_desc: "Nie opróżniaj automatycznie podczas DND",
      dnd_reduce_volume: "Zmniejsz głośność",
      dnd_reduce_volume_desc: "Zmniejsz głośność urządzenia podczas DND"
    },
    volume: {
      title: "Głośność i dźwięk",
      volume: "Głośność",
      test_sound: "Zlokalizuj urządzenie",
      muted: "Wyciszony",
      voice_assistant: "Asystent głosowy",
      voice_assistant_desc: "Włącz komunikaty głosowe i informacje zwrotne",
      voice_language: "Język głosu",
      voice_language_desc: "Język komunikatów głosowych",
      streaming_voice_prompt: "Komunikaty głosowe na żywo",
      streaming_voice_prompt_desc: "Informacje głosowe w czasie rzeczywistym podczas sprzątania"
    },
    carpet: {
      title: "Ustawienia dywanów",
      carpet_recognition: "Rozpoznawanie dywanów",
      carpet_recognition_desc: "Automatyczne rozpoznawanie dywanów",
      carpet_avoidance: "Unikanie dywanów",
      carpet_avoidance_desc: "Unikaj dywanów podczas mopowania",
      clean_carpets_first: "Najpierw dywany",
      clean_carpets_first_desc: "Odkurzaj dywany przed mopowaniem",
      carpet_boost: "Wzmocnienie na dywanie",
      carpet_boost_desc: "Zwiększ siłę ssania na dywanach",
      intensive_cleaning: "Intensywne czyszczenie",
      intensive_cleaning_desc: "Głębokie czyszczenie z dodatkowymi przejściami",
      side_brush_rotate: "Obracanie szczotki bocznej",
      side_brush_rotate_desc: "Obracaj szczotkę boczną na dywanach",
      sensitivity: "Czułość wykrywania dywanów",
      sensitivity_desc: "Poziom czułości wykrywania",
      sensitivity_low: "Niska",
      sensitivity_medium: "Średnia",
      sensitivity_high: "Wysoka",
      cleaning_mode: "Czyszczenie dywanów",
      cleaning_mode_desc: "Jak postępować z dywanami podczas sprzątania",
      mode_vacuum: "Odkurzanie",
      mode_vacuum_and_mop: "Odk. i Mop",
      mode_avoidance: "Unikaj",
      mode_ignore: "Ignoruj",
      vacuum_mode: "Tryb odkurzania",
      vacuum_adaptation: "Podnieś mop",
      vacuum_remove_mop: "Usuń mop"
    },
    floor: {
      title: "Ustawienia podłogi",
      obstacle_avoidance: "Omijanie przeszkód",
      obstacle_avoidance_desc: "Użyj czujników do omijania przeszkód",
      collision_avoidance: "Unikanie kolizji",
      collision_avoidance_desc: "Zwolnij przy ścianach i meblach",
      auto_mount_mop: "Auto montaż mopa",
      auto_mount_mop_desc: "Automatycznie zamontuj nakładkę mopa",
      auto_recleaning: "Automatyczne doczyszczanie",
      auto_recleaning_desc: "Automatycznie doczyszczaj pominięte obszary",
      recleaning_off: "Wył",
      recleaning_in_deep_mode: "W trybie głębokim",
      recleaning_in_all_modes: "We wszystkich trybach",
      stain_avoidance: "Omijanie plam",
      stain_avoidance_desc: "Omijaj wykryte plamy",
      tight_mopping: "Dokładne mopowanie",
      tight_mopping_desc: "Mopuj bliżej ścian i krawędzi",
      floor_direction_cleaning: "Czyszczenie wzdłuż podłogi",
      floor_direction_cleaning_desc: "Sprzątaj wzdłuż kierunku słojów podłogi",
      large_particles_boost: "Wzmocnienie dla dużych cząstek",
      large_particles_boost_desc: "Zwiększ siłę ssania dla dużych zanieczyszczeń",
      pet_focused_cleaning: "Sprzątanie stref zwierząt",
      pet_focused_cleaning_desc: "Dodatkowe sprzątanie w strefach zwierząt",
      low_lying_area_frequency: "Częstotliwość niskich stref",
      low_lying_area_frequency_desc: "Jak często sprzątać niskie obszary pod meblami"
    },
    edge_corner: {
      title: "Krawędzie i Rogi",
      side_reach: "Zasięg boczny",
      side_reach_desc: "Wysuń szczotkę boczną do krawędzi",
      mop_extend: "Wysunięcie mopa",
      mop_extend_desc: "Wysuń mop do krawędzi i rogów",
      gap_cleaning: "Czyszczenie szczelin",
      gap_cleaning_desc: "Czyść wąskie szczeliny między meblami",
      mopping_under: "Mopowanie pod meblami",
      mopping_under_desc: "Wysuń mop pod niskie meble",
      extend_frequency: "Częstotliwość wysuwania",
      extend_frequency_desc: "Jak często wysuwać mop do czyszczenia krawędzi",
      frequency_standard: "Standardowa",
      frequency_intelligent: "Inteligentna",
      frequency_high: "Wysoka"
    },
    dock: {
      title: "Ustawienia stacji",
      self_clean: "Samooczyszczanie",
      self_clean_desc: "Auto mycie mopa po sprzątaniu",
      auto_empty_mode: "Tryb auto opróżniania",
      auto_empty_mode_desc: "Kiedy automatycznie opróżniać pojemnik",
      auto_empty_frequency: "Częstotliwość auto opróżniania",
      auto_empty_frequency_desc: "Ile sprzątań przed auto opróżnianiem",
      empty_off: "Wył",
      empty_standard: "Standardowy",
      empty_high_frequency: "Wysoka częst.",
      empty_low_frequency: "Niska częst.",
      auto_detergent: "Auto detergent",
      auto_detergent_desc: "Automatycznie dodawaj detergent podczas mycia",
      mop_washing_with_detergent: "Mycie mopa z detergentem",
      mop_washing_with_detergent_desc: "Używaj detergentu podczas mycia mopa",
      mopping_with_detergent: "Mopowanie z detergentem",
      mopping_with_detergent_desc: "Używaj detergentu podczas mopowania",
      water_electrolysis: "Elektroliza wody",
      water_electrolysis_desc: "Sterylizacja wody za pomocą elektrolizy",
      auto_water_refilling: "Auto uzupełnianie wody",
      auto_water_refilling_desc: "Automatyczne uzupełnianie zbiornika czystej wody",
      auto_dust_collecting: "Auto zbieranie kurzu",
      auto_dust_collecting_desc: "Automatyczne opróżnianie pojemnika po sprzątaniu",
      smart_washing: "Inteligentne mycie",
      smart_washing_desc: "Dostosuj mycie do poziomu zabrudzenia",
      mop_wash_level: "Poziom mycia mopa",
      mop_wash_level_desc: "Intensywność mycia mopa",
      washing_mode: "Tryb mycia",
      washing_mode_desc: "Intensywność mycia mopa",
      washing_light: "Lekki",
      washing_standard: "Standardowy",
      washing_deep: "Głęboki",
      water_temperature: "Temperatura wody",
      water_temperature_desc: "Temperatura do mycia mopa",
      temp_normal: "Normalna",
      temp_mild: "Łagodna",
      temp_warm: "Ciepła",
      temp_hot: "Gorąca",
      auto_drying: "Auto suszenie",
      auto_drying_desc: "Automatycznie suszyć mop po czyszczeniu",
      drying_time: "Czas suszenia",
      drying_time_desc: "Czas suszenia mopa",
      auto_rewashing: "Auto ponowne mycie",
      auto_rewashing_desc: "Automatycznie myj mop gdy brudny",
      rewashing_off: "Wył",
      rewashing_in_deep_mode: "W trybie głębokim",
      rewashing_in_all_modes: "We wszystkich trybach",
      off_peak_charging: "Ładowanie poza szczytem",
      off_peak_charging_desc: "Ładuj poza godzinami szczytu, aby oszczędzać energię",
      off_peak_charging_start: "Czas rozpoczęcia",
      off_peak_charging_end: "Czas zakończenia",
      station_cleaning: "Czyszczenie stacji",
      station_cleaning_desc: "Wyczyść stację bazową",
      clean_now: "Wyczyść teraz",
      self_repair: "Samonaprawa",
      self_repair_desc: "Uruchom diagnostykę samonaprawy stacji",
      repair_now: "Napraw",
      scraper_frequency: "Częstotliwość skrobaka",
      scraper_frequency_desc: "Jak często czyścić gumowy skrobak"
    },
    ai_detection: {
      title: "AI i Wykrywanie",
      intelligent_recognition: "Inteligentne rozpoznawanie",
      intelligent_recognition_desc: "Rozpoznawanie otoczenia oparte na AI",
      ai_obstacle_detection: "Rozpoznawanie przeszkód AI",
      ai_obstacle_detection_desc: "Używaj AI do identyfikacji i omijania przeszkód",
      fuzzy_obstacle_detection: "Rozmyte wykrywanie przeszkód",
      fuzzy_obstacle_detection_desc: "Wykrywanie miękkich lub niewyraźnych przeszkód",
      ai_obstacle_image_upload: "Przesyłanie zdjęć przeszkód",
      ai_obstacle_image_upload_desc: "Przesyłaj zdjęcia przeszkód do analizy",
      ai_obstacle_picture: "Zdjęcie przeszkody",
      ai_obstacle_picture_desc: "Rób zdjęcia wykrytych przeszkód",
      ai_pet_detection: "Wykrywanie zwierząt",
      ai_pet_detection_desc: "Wykrywaj i omijaj zwierzęta domowe",
      ai_pet_avoidance: "Unikanie zwierząt",
      ai_pet_avoidance_desc: "Aktywnie omijaj wykryte zwierzęta",
      pet_focused_detection: "Wykrywanie skoncentrowane na zwierzętach",
      pet_focused_detection_desc: "Ulepszone wykrywanie dla obszarów ze zwierzętami",
      pet_picture: "Zdjęcie zwierzęcia",
      pet_picture_desc: "Rób zdjęcia wykrytych zwierząt",
      ai_human_detection: "Wykrywanie ludzi",
      ai_human_detection_desc: "Wykrywaj i omijaj ludzi",
      human_follow: "Podążanie za człowiekiem",
      human_follow_desc: "Podążaj za ludźmi do interaktywnego sprzątania",
      ai_furniture_detection: "Wykrywanie mebli",
      ai_furniture_detection_desc: "Wykrywaj i nawiguj wokół mebli",
      ai_fluid_detection: "Wykrywanie cieczy",
      ai_fluid_detection_desc: "Wykrywaj i omijaj rozlane płyny",
      fill_light: "Doświetlenie",
      fill_light_desc: "Użyj światła pomocniczego dla lepszego wykrywania",
      camera_light_auto: "Auto jasność kamery",
      camera_light_auto_desc: "Automatycznie dostosuj jasność światła kamery",
      camera_light_brightness: "Jasność światła kamery",
      camera_light_brightness_desc: "Ręczny poziom jasności światła kamery"
    },
    station_controls: {
      title: "Sterowanie stacją",
      self_clean: "Samooczyszczanie",
      self_clean_desc: "Rozpocznij cykl mycia mopa",
      manual_drying: "Ręczne suszenie",
      manual_drying_desc: "Rozpocznij cykl suszenia mopa",
      water_tank_draining: "Opróżnij zbiornik",
      water_tank_draining_desc: "Odprowadź brudną wodę ze zbiornika",
      base_station_cleaning: "Wyczyść stację",
      base_station_cleaning_desc: "Oczyść stację bazową",
      empty_water_tank: "Opróżnij zbiornik wody",
      empty_water_tank_desc: "Opróżnij zbiornik na wodę",
      start_auto_empty: "Auto opróżnianie",
      start_auto_empty_desc: "Rozpocznij automatyczne opróżnianie pojemnika",
      start_recleaning: "Ponowne sprzątanie",
      start_recleaning_desc: "Rozpocznij ponowne sprzątanie pominiętych obszarów",
      clear_warning: "Wyczyść ostrzeżenie",
      clear_warning_desc: "Wyczyść bieżące komunikaty ostrzegawcze"
    },
    map: {
      title: "Ustawienia mapy",
      multi_floor: "Mapa wielopiętrowa",
      multi_floor_desc: "Włącz obsługę map wielu pięter",
      rotation: "Obrót mapy",
      rotation_desc: "Obróć orientację mapy",
      mapping_actions: "Akcje mapowania",
      start_mapping: "Rozpocznij mapowanie",
      start_fast_mapping: "Szybkie mapowanie"
    }
  }
}, c1 = {
  // Common
  common: {
    run: "Exécuter",
    start: "Démarrer",
    stop: "Arrêter",
    cancel: "Annuler",
    save: "Enregistrer",
    apply: "Appliquer",
    reset: "Réinitialiser"
  },
  // Room selector
  room_selector: {
    title: "Sélectionner des pièces",
    selected_count: "{{count}} sélectionnée(s)"
  },
  // Map Selector
  map_selector: {
    unknown: "Carte inconnue"
  },
  // Vacuum map
  vacuum_map: {
    no_map: "Aucune carte disponible",
    looking_for: "Recherche de : {{entity}}",
    room_overlay: "Cliquez sur les numéros pour sélectionner les pièces à nettoyer",
    zone_overlay_create: "Cliquez sur la carte pour placer une zone de nettoyage",
    zone_overlay_resize: "Faites glisser les coins pour redimensionner, cliquez ailleurs pour repositionner",
    clear_zone: "Effacer la zone",
    switch_to_list: "Passer à la vue liste",
    switch_to_map: "Passer à la vue carte",
    room_list_overlay: "Appuyez sur les pièces pour les sélectionner",
    no_rooms: "Aucune pièce configurée",
    zoom_in: "Zoom avant",
    zoom_out: "Zoom arrière",
    zoom_reset: "Réinitialiser le zoom",
    lock_map: "Verrouiller la carte",
    unlock_map: "Déverrouiller la carte"
  },
  // Mode tabs
  modes: {
    room: "Pièce",
    all: "Tout",
    zone: "Zone"
  },
  // Action buttons
  actions: {
    clean: "Nettoyer",
    clean_all: "Tout nettoyer",
    clean_rooms: "Nettoyer {{count}} pièce",
    clean_rooms_plural: "Nettoyer {{count}} pièces",
    select_rooms: "Sélectionner des pièces",
    zone_clean: "Nettoyage de zone",
    pause: "Pause",
    resume: "Reprendre",
    stop: "Arrêter",
    stop_and_dock: "Arrêter et charger",
    dock: "Charger"
  },
  // Toast messages
  toast: {
    selected_room: "{{name}} sélectionné(e)",
    deselected_room: "{{name}} désélectionné(e)",
    paused: "Nettoyage mis en pause",
    stopped: "Nettoyage arrêté",
    docked: "Retour à la base",
    cleaning_started: "Nettoyage démarré",
    resuming: "Reprise du nettoyage",
    starting_full_clean: "Démarrage du nettoyage complet",
    pausing_vacuum: "Mise en pause de l'aspirateur",
    stopping_vacuum: "Arrêt de l'aspirateur",
    stopping_and_docking: "Arrêt et retour à la base",
    vacuum_docking: "L'aspirateur retourne à sa base",
    starting_room_clean: "Démarrage du nettoyage de la pièce sélectionnée",
    starting_room_clean_plural: "Démarrage du nettoyage des {{count}} pièces sélectionnées",
    starting_zone_clean: "Démarrage du nettoyage de zone",
    select_rooms_first: "Veuillez d'abord sélectionner des pièces",
    cannot_determine_map: "Impossible de déterminer les dimensions de la carte",
    select_zone_first: "Veuillez sélectionner une zone sur la carte"
  },
  // Room selection display
  room_display: {
    selected_rooms: "Pièces sélectionnées :",
    selected_label: "Sélection :"
  },
  // Cleaning mode button
  cleaning_mode_button: {
    prefix_custom: "Personnalisé : ",
    prefix_cleangenius: "CleanGenius : ",
    view_shortcuts: "Voir les raccourcis",
    repeats_tooltip: "Passages de nettoyage",
    vac_and_mop: "Aspi & Lavage",
    mop_after_vac: "Lavage après Aspi",
    vacuum: "Aspirateur",
    mop: "Serpillère"
  },
  // Cleaning mode modal
  cleaning_mode: {
    title: "Mode de nettoyage",
    clean_genius: "CleanGenius",
    custom: "Personnalisé"
  },
  // Shortcuts modal
  shortcuts: {
    title: "Raccourcis",
    no_shortcuts: "Aucun raccourci disponible",
    create_hint: "Créez des raccourcis dans l'application Dreame pour lancer rapidement vos routines préférées"
  },
  // Custom mode
  custom_mode: {
    cleaning_mode_title: "Mode de nettoyage",
    suction_power_title: "Puissance d'aspiration",
    max_plus_description: "La puissance sera augmentée au niveau maximum (usage unique).",
    wetness_title: "Débit d'eau",
    mop_pad_humidity_title: "Humidité de la serpillère",
    slightly_dry: "Sec",
    moist: "Standard",
    wet: "Humide",
    water_volume_title: "Volume d'eau",
    water_low: "Faible",
    water_medium: "Moyen",
    water_high: "Élevé",
    mop_washing_frequency_title: "Fréquence de lavage de serpillère",
    route_title: "Trajectoire de nettoyage",
    mop_pressure_title: "Pression de la serpillère",
    mop_temperature_title: "Température de l'eau"
  },
  // Niveaux de pression serpillère
  mop_pressure: {
    light: "Légère",
    normal: "Normale"
  },
  // Niveaux de température eau
  mop_temperature: {
    normal: "Normale",
    warm: "Tiède"
  },
  // Customize Cleaning Mode
  customize: {
    title: "Personnaliser",
    description: "Définir les préférences d'aspiration et de lavage pour chaque zone.",
    set_button: "Définir",
    vacuum: "Aspirateur",
    mop: "Serpillère",
    vac_and_mop: "Aspi & Lavage",
    cycles: "Cycles",
    apply_to_all: "Appliquer à toutes les pièces",
    click_room_hint: "Cliquez sur une zone pour changer le mode.",
    intelligent_recommendation: "Recommandation intelligente",
    select_room: "Sélectionner une pièce",
    settings_for: "Paramètres de {{room}}",
    no_rooms: "Aucune pièce disponible"
  },
  // CleanGenius mode
  cleangenius_mode: {
    cleaning_mode_title: "Mode de nettoyage",
    deep_cleaning: "Nettoyage approfondi"
  },
  // Header
  header: {
    battery: "Batterie",
    status: "Statut",
    area: "Surface",
    time: "Temps"
  },
  // Units
  units: {
    square_meters: "m²",
    minutes: "min",
    minutes_short: "m",
    percent: "%",
    decibels: "dBm"
  },
  // Suction levels
  suction_levels: {
    quiet: "Silencieux",
    standard: "Standard",
    strong: "Fort",
    turbo: "Turbo"
  },
  // Mop washing frequency
  mop_washing_frequency: {
    by_room: "Par pièce",
    by_area: "Par surface",
    by_time: "Par durée"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "Rapide",
    standard: "Standard",
    intensive: "Intensif",
    deep: "Profond"
  },
  // Errors
  errors: {
    entity_not_found: "Entité introuvable : {{entity}}",
    failed_to_load: "Échec du chargement des données de l'entité",
    service_call_failed: "Échec de l'envoi de la commande à l'aspirateur",
    entity_unavailable: "Aspirateur non disponible"
  },
  // Settings panel
  settings: {
    title: "Paramètres",
    consumables: {
      title: "Consommables",
      main_brush: "Brosse principale",
      side_brush: "Brosse latérale",
      filter: "Filtre",
      sensor: "Capteur",
      mop_pad: "Serpillière",
      silver_ion: "Ion argent",
      detergent: "Détergent",
      squeegee: "Raclette",
      tank_filter: "Filtre du réservoir",
      onboard_dirty_water_tank: "Réservoir d'eau sale embarqué",
      dirty_water_channel: "Canal d'eau sale",
      deodorizer: "Désodorisant",
      wheel: "Roue",
      scale_inhibitor: "Anti-calcaire",
      fluffing_roller: "Rouleau de brossage",
      roller_mop_filter: "Filtre de serpillière rotative",
      water_outlet_filter: "Filtre de sortie d'eau",
      remaining: "restant",
      reset: "Réinitialiser"
    },
    device_info: {
      title: "Infos appareil",
      firmware: "Version du firmware",
      total_area: "Surface totale nettoyée",
      total_time: "Temps total de nettoyage",
      total_cleans: "Nombre total de nettoyages",
      wifi_ssid: "Réseau Wi-Fi",
      wifi_signal: "Force du signal",
      ip_address: "Adresse IP"
    },
    quick_settings: {
      title: "Réglages rapides",
      child_lock: "Verrouillage enfant",
      child_lock_desc: "Désactiver les boutons physiques",
      resume_cleaning: "Reprendre le nettoyage",
      resume_cleaning_desc: "Reprendre automatiquement le nettoyage après la charge",
      dnd: "Ne pas déranger",
      dnd_desc: "Heures silencieuses avec activité réduite",
      dnd_start: "Heure de début",
      dnd_end: "Heure de fin",
      dnd_disable_resume: "Désactiver reprise",
      dnd_disable_resume_desc: "Ne pas reprendre le nettoyage en mode NPD",
      dnd_disable_auto_empty: "Désactiver vidage auto",
      dnd_disable_auto_empty_desc: "Ne pas vider automatiquement en mode NPD",
      dnd_reduce_volume: "Réduire le volume",
      dnd_reduce_volume_desc: "Baisser le volume en mode NPD"
    },
    volume: {
      title: "Volume & Son",
      volume: "Volume",
      test_sound: "Localiser l'aspirateur",
      muted: "Muet",
      voice_assistant: "Assistant vocal",
      voice_assistant_desc: "Activer les annonces et retours vocaux",
      voice_language: "Langue vocale",
      voice_language_desc: "Langue des annonces vocales",
      streaming_voice_prompt: "Annonces vocales en temps réel",
      streaming_voice_prompt_desc: "Retour vocal en direct pendant le nettoyage"
    },
    carpet: {
      title: "Paramètres tapis",
      carpet_recognition: "Reconnaissance des tapis",
      carpet_recognition_desc: "Détecter automatiquement les tapis",
      carpet_avoidance: "Évitement des tapis",
      carpet_avoidance_desc: "Éviter les tapis pendant le lavage",
      clean_carpets_first: "Nettoyer tapis en premier",
      clean_carpets_first_desc: "Aspirer les tapis avant de laver les sols",
      carpet_boost: "Boost tapis",
      carpet_boost_desc: "Puissance max sur les tapis",
      intensive_cleaning: "Nettoyage intensif",
      intensive_cleaning_desc: "Nettoyage en profondeur avec passages supplémentaires",
      side_brush_rotate: "Rotation brosse latérale",
      side_brush_rotate_desc: "Faire tourner la brosse latérale sur les tapis",
      sensitivity: "Sensibilité tapis",
      sensitivity_desc: "Niveau de sensibilité de détection",
      sensitivity_low: "Faible",
      sensitivity_medium: "Moyenne",
      sensitivity_high: "Élevée",
      cleaning_mode: "Nettoyage tapis",
      cleaning_mode_desc: "Comment gérer les tapis pendant le nettoyage",
      mode_vacuum: "Aspirer",
      mode_vacuum_and_mop: "Asp. & Lav.",
      mode_avoidance: "Éviter",
      mode_ignore: "Ignorer",
      vacuum_mode: "Mode aspiration",
      vacuum_adaptation: "Lever serpillère",
      vacuum_remove_mop: "Retirer serpillère"
    },
    floor: {
      title: "Paramètres sol",
      obstacle_avoidance: "Évitement d'obstacles",
      obstacle_avoidance_desc: "Utiliser les capteurs pour éviter les obstacles",
      collision_avoidance: "Évitement de collision",
      collision_avoidance_desc: "Ralentir près des murs et meubles",
      auto_mount_mop: "Montage auto serpillère",
      auto_mount_mop_desc: "Attacher automatiquement la serpillère",
      auto_recleaning: "Re-nettoyage auto",
      auto_recleaning_desc: "Re-nettoyer automatiquement les zones manquées",
      recleaning_off: "Désactivé",
      recleaning_in_deep_mode: "En mode profond",
      recleaning_in_all_modes: "Dans tous les modes",
      stain_avoidance: "Évitement des taches",
      stain_avoidance_desc: "Éviter les taches détectées",
      tight_mopping: "Lavage minutieux",
      tight_mopping_desc: "Laver plus près des murs et des bords",
      floor_direction_cleaning: "Nettoyage directionnel",
      floor_direction_cleaning_desc: "Nettoyer dans le sens du grain du sol",
      large_particles_boost: "Boost grosses particules",
      large_particles_boost_desc: "Augmenter l'aspiration pour les gros débris",
      pet_focused_cleaning: "Nettoyage zones animaux",
      pet_focused_cleaning_desc: "Nettoyage supplémentaire dans les zones des animaux",
      low_lying_area_frequency: "Fréquence zones basses",
      low_lying_area_frequency_desc: "Fréquence de nettoyage des zones basses sous les meubles"
    },
    edge_corner: {
      title: "Bords & Coins",
      side_reach: "Portée latérale",
      side_reach_desc: "Étendre la brosse latérale pour les bords",
      mop_extend: "Extension serpillère",
      mop_extend_desc: "Étendre la serpillère pour les bords et coins",
      gap_cleaning: "Nettoyage des interstices",
      gap_cleaning_desc: "Nettoyer les espaces étroits entre les meubles",
      mopping_under: "Lavage sous meubles",
      mopping_under_desc: "Étendre la serpillère sous les meubles bas",
      extend_frequency: "Fréquence d'extension",
      extend_frequency_desc: "Fréquence d'extension pour le nettoyage des bords",
      frequency_standard: "Standard",
      frequency_intelligent: "Intelligent",
      frequency_high: "Élevée"
    },
    dock: {
      title: "Paramètres station",
      self_clean: "Auto-nettoyage",
      self_clean_desc: "Démarrer le cycle de lavage de la serpillère",
      auto_empty_mode: "Mode vidage auto",
      auto_empty_mode_desc: "Quand vider automatiquement le bac à poussière",
      auto_empty_frequency: "Fréquence vidage auto",
      auto_empty_frequency_desc: "Nombre de vidages automatiques par cycle",
      empty_off: "Désactivé",
      empty_standard: "Standard",
      empty_high_frequency: "Fréquence élevée",
      empty_low_frequency: "Fréquence basse",
      auto_detergent: "Détergent auto",
      auto_detergent_desc: "Ajouter automatiquement du détergent lors du lavage",
      mop_washing_with_detergent: "Lavage serpillère avec détergent",
      mop_washing_with_detergent_desc: "Utiliser du détergent lors du lavage de la serpillère",
      mopping_with_detergent: "Lavage avec détergent",
      mopping_with_detergent_desc: "Utiliser du détergent lors du lavage du sol",
      water_electrolysis: "Électrolyse de l'eau",
      water_electrolysis_desc: "Stériliser l'eau par électrolyse",
      auto_water_refilling: "Remplissage auto eau",
      auto_water_refilling_desc: "Remplir automatiquement le réservoir d'eau propre",
      auto_dust_collecting: "Collecte auto poussière",
      auto_dust_collecting_desc: "Vider automatiquement le bac après nettoyage",
      smart_washing: "Lavage intelligent",
      smart_washing_desc: "Ajuster le lavage selon le niveau de saleté",
      mop_wash_level: "Niveau de lavage",
      mop_wash_level_desc: "Intensité du cycle de lavage de la serpillère",
      washing_mode: "Mode lavage",
      washing_mode_desc: "Intensité du lavage de la serpillère",
      washing_light: "Léger",
      washing_standard: "Standard",
      washing_deep: "Profond",
      water_temperature: "Température de l'eau",
      water_temperature_desc: "Température pour le lavage de la serpillère",
      temp_normal: "Normale",
      temp_mild: "Douce",
      temp_warm: "Tiède",
      temp_hot: "Chaude",
      auto_drying: "Séchage auto",
      auto_drying_desc: "Sécher automatiquement la serpillère après nettoyage",
      drying_time: "Temps de séchage",
      drying_time_desc: "Durée du séchage de la serpillère",
      station_cleaning: "Nettoyage station",
      station_cleaning_desc: "Nettoyer la station de base",
      clean_now: "Nettoyer",
      auto_rewashing: "Re-lavage auto",
      auto_rewashing_desc: "Re-laver automatiquement la serpillère si nécessaire",
      rewashing_off: "Désactivé",
      rewashing_in_deep_mode: "En mode profond",
      rewashing_in_all_modes: "Dans tous les modes",
      off_peak_charging: "Charge heures creuses",
      off_peak_charging_desc: "Charger pendant les heures creuses pour économiser",
      off_peak_charging_start: "Heure de début",
      off_peak_charging_end: "Heure de fin",
      self_repair: "Auto-réparation",
      self_repair_desc: "Diagnostic et réparation automatiques",
      repair_now: "Réparer",
      scraper_frequency: "Fréquence du racleur",
      scraper_frequency_desc: "Fréquence de nettoyage du racleur en caoutchouc"
    },
    ai_detection: {
      title: "IA & Détection",
      intelligent_recognition: "Reconnaissance intelligente",
      intelligent_recognition_desc: "Utiliser l'IA pour identifier les obstacles et les zones",
      ai_obstacle_detection: "Détection d'obstacles par IA",
      ai_obstacle_detection_desc: "Utiliser l'IA pour identifier les obstacles",
      fuzzy_obstacle_detection: "Détection floue",
      fuzzy_obstacle_detection_desc: "Détecter les obstacles partiellement visibles",
      ai_obstacle_image_upload: "Envoi d'images d'obstacles",
      ai_obstacle_image_upload_desc: "Envoyer les images pour analyse",
      ai_obstacle_picture: "Photo d'obstacles IA",
      ai_obstacle_picture_desc: "Prendre des photos des obstacles détectés",
      ai_pet_detection: "Détection d'animaux",
      ai_pet_detection_desc: "Détecter et éviter les animaux",
      ai_pet_avoidance: "Évitement des animaux",
      ai_pet_avoidance_desc: "Éviter activement les animaux détectés",
      pet_focused_detection: "Détection animaux ciblée",
      pet_focused_detection_desc: "Détection prioritaire des animaux",
      pet_picture: "Photo animaux",
      pet_picture_desc: "Prendre des photos des animaux détectés",
      ai_human_detection: "Détection humaine",
      ai_human_detection_desc: "Détecter et éviter les personnes",
      human_follow: "Suivi humain",
      human_follow_desc: "Suivre les personnes pendant le nettoyage",
      ai_furniture_detection: "Détection de meubles",
      ai_furniture_detection_desc: "Naviguer autour des meubles",
      ai_fluid_detection: "Détection de liquides",
      ai_fluid_detection_desc: "Détecter et éviter les flaques",
      fill_light: "Lumière d'appoint",
      fill_light_desc: "Utiliser la lumière pour une meilleure détection",
      camera_light_auto: "Lumière caméra auto",
      camera_light_auto_desc: "Ajuster automatiquement l'éclairage de la caméra",
      camera_light_brightness: "Luminosité caméra",
      camera_light_brightness_desc: "Niveau de luminosité de l'éclairage caméra"
    },
    station_controls: {
      title: "Contrôles de la station",
      self_clean: "Auto-nettoyage",
      self_clean_desc: "Démarrer le cycle de lavage de la serpillère",
      manual_drying: "Séchage manuel",
      manual_drying_desc: "Démarrer le cycle de séchage de la serpillère",
      water_tank_draining: "Vidange du réservoir",
      water_tank_draining_desc: "Vidanger l'eau sale du réservoir",
      base_station_cleaning: "Nettoyage de la station",
      base_station_cleaning_desc: "Nettoyer la station de base",
      empty_water_tank: "Vider le réservoir",
      empty_water_tank_desc: "Vider le réservoir de collecte d'eau",
      start_auto_empty: "Démarrer vidage auto",
      start_auto_empty_desc: "Vider automatiquement le bac à poussière",
      start_recleaning: "Démarrer re-nettoyage",
      start_recleaning_desc: "Re-nettoyer les zones manquées",
      clear_warning: "Effacer avertissement",
      clear_warning_desc: "Effacer les avertissements actuels"
    },
    map: {
      title: "Paramètres carte",
      multi_floor: "Carte multi-étages",
      multi_floor_desc: "Activer le support pour plusieurs cartes d'étages",
      rotation: "Rotation de la carte",
      rotation_desc: "Tourner l'orientation de la carte",
      mapping_actions: "Actions de cartographie",
      start_mapping: "Démarrer cartographie",
      start_fast_mapping: "Cartographie rapide"
    }
  }
}, u1 = {
  // Common
  common: {
    run: "הפעל",
    start: "התחל",
    stop: "עצור",
    cancel: "בטל",
    save: "שמור",
    apply: "החל",
    reset: "אפס"
  },
  // בחירת חדרים
  room_selector: {
    title: "בחר חדרים",
    selected_count: "{{count}} נבחרו"
  },
  // בחירת מפה
  map_selector: {
    unknown: "מפה לא ידועה"
  },
  // מפת שואב
  vacuum_map: {
    no_map: "אין מפה זמינה",
    looking_for: "מחפש את: {{entity}}",
    room_overlay: "לחץ על מספרי החדרים כדי לבחור חדרים לניקוי",
    zone_overlay_create: "לחץ על המפה כדי להוסיף אזור ניקוי",
    zone_overlay_resize: "גרור את הפינות לשינוי גודל, לחץ במקום אחר לשינוי מיקום",
    clear_zone: "נקה אזור",
    switch_to_list: "עבור לתצוגת רשימה",
    switch_to_map: "עבור לתצוגת מפה",
    room_list_overlay: "לחץ על חדרים כדי לבחור לניקוי",
    no_rooms: "אין חדרים זמינים",
    zoom_in: "הגדל",
    zoom_out: "הקטן",
    zoom_reset: "אפס זום",
    lock_map: "נעל מפה",
    unlock_map: "בטל נעילת מפה"
  },
  // לשוניות מצבים
  modes: {
    room: "חדר",
    all: "הכל",
    zone: "אזור"
  },
  // כפתורי פעולה
  actions: {
    clean: "נקה",
    clean_all: "נקה הכל",
    clean_rooms: "נקה חדר {{count}}",
    clean_rooms_plural: "נקה {{count}} חדרים",
    select_rooms: "בחר חדרים",
    zone_clean: "ניקוי אזור",
    pause: "השהה",
    resume: "המשך",
    stop: "עצור",
    stop_and_dock: "עצור וחזור",
    dock: "עמדת טעינה"
  },
  // הודעות קופצות (Toast)
  toast: {
    selected_room: "נבחר {{name}}",
    deselected_room: "בוטל {{name}}",
    paused: "הניקוי הושהה",
    stopped: "הניקוי הופסק",
    docked: "חוזר לעמדת טעינה",
    cleaning_started: "הניקוי התחיל",
    resuming: "ממשיך ניקוי",
    starting_full_clean: "מתחיל ניקוי של כל הבית",
    pausing_vacuum: "משהה שואב",
    stopping_vacuum: "עוצר שואב",
    stopping_and_docking: "עוצר וחוזר לתחנה",
    vacuum_docking: "השואב חוזר לעמדת טעינה",
    starting_room_clean: "מתחיל ניקוי עבור חדר {{count}} שנבחר",
    starting_room_clean_plural: "מתחיל ניקוי עבור {{count}} חדרים שנבחרו",
    starting_zone_clean: "מתחיל ניקוי אזור",
    select_rooms_first: "אנא בחר חדרים לניקוי תחילה",
    cannot_determine_map: "לא ניתן לקבוע את מידות המפה",
    select_zone_first: "אנא בחר אזור על המפה"
  },
  // תצוגת בחירת חדרים
  room_display: {
    selected_rooms: "חדרים שנבחרו:",
    selected_label: "נבחרו:"
  },
  // כפתור מצב ניקוי
  cleaning_mode_button: {
    prefix_custom: "מותאם אישית: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "צפה בקיצורי דרך",
    repeats_tooltip: "חזרות",
    vac_and_mop: "שאיבה ושטיפה",
    mop_after_vac: "שטיפה אחרי שאיבה",
    vacuum: "שאיבה",
    mop: "שטיפה"
  },
  // מודאל מצב ניקוי
  cleaning_mode: {
    title: "מצב ניקוי",
    clean_genius: "CleanGenius",
    custom: "מותאם אישית"
  },
  // מודאל קיצורי דרך
  shortcuts: {
    title: "קיצורי דרך",
    no_shortcuts: "אין קיצורי דרך זמינים",
    create_hint: "צור קיצורי דרך באפליקציית Dreame כדי להפעיל במהירות את תוכניות הניקוי המועדפות עליך"
  },
  // מצב מותאם אישית
  custom_mode: {
    cleaning_mode_title: "מצב ניקוי",
    suction_power_title: "עוצמת שאיבה",
    max_plus_description: "עוצמת השאיבה תוגבר לרמה הגבוהה ביותר, זהו מצב לשימוש חד-פעמי.",
    wetness_title: "רמת רטיבות",
    mop_pad_humidity_title: "לחות משטח הסמרטוט",
    slightly_dry: "מעט יבש",
    moist: "לח",
    wet: "רטוב",
    water_volume_title: "כמות מים",
    water_low: "נמוך",
    water_medium: "בינוני",
    water_high: "גבוה",
    mop_washing_frequency_title: "תדירות שטיפת סמרטוט",
    route_title: "מסלול",
    mop_pressure_title: "לחץ סמרטוט",
    mop_temperature_title: "טמפרטורת מים"
  },
  // רמות לחץ סמרטוט
  mop_pressure: {
    light: "קל",
    normal: "רגיל"
  },
  // רמות טמפרטורת מים
  mop_temperature: {
    normal: "רגיל",
    warm: "חם"
  },
  // מצב התאמה אישית
  customize: {
    title: "התאמה אישית",
    description: "הגדר העדפות שאיבה וניגוב מותאמות אישית לכל אזור.",
    set_button: "הגדר",
    vacuum: "שואב",
    mop: "מנגב",
    vac_and_mop: "שואב ומנגב",
    cycles: "מחזורים",
    apply_to_all: "החל על כל החדרים",
    click_room_hint: "לחץ על אזור כדי לשנות את המצב.",
    intelligent_recommendation: "המלצה חכמה",
    select_room: "בחר חדר",
    settings_for: "הגדרות {{room}}",
    no_rooms: "אין חדרים זמינים"
  },
  // מצב CleanGenius
  cleangenius_mode: {
    cleaning_mode_title: "מצב ניקוי",
    deep_cleaning: "ניקוי עמוק"
  },
  // כותרת (Header)
  header: {
    battery: "סוללה",
    status: "סטטוס",
    area: "שטח",
    time: "זמן"
  },
  // יחידות מידה
  units: {
    square_meters: 'מ"ר',
    minutes: "דק'",
    minutes_short: "ד'",
    percent: "%",
    decibels: "dBm"
  },
  // רמות שאיבה
  suction_levels: {
    quiet: "שקט",
    standard: "סטנדרטי",
    strong: "טורבו",
    turbo: "מקסימום"
  },
  // תדירות שטיפת סמרטוט
  mop_washing_frequency: {
    by_room: "לפי חדר",
    by_area: "לפי שטח",
    by_time: "לפי זמן"
  },
  // מסלולי ניקוי
  cleaning_routes: {
    quick: "מהיר",
    standard: "רגיל",
    intensive: "אינטנסיבי",
    deep: "עמוק"
  },
  // שגיאות
  errors: {
    entity_not_found: "ישות לא נמצאה: {{entity}}",
    failed_to_load: "שגיאה בטעינת נתוני הישות",
    service_call_failed: "שגיאה בשליחת פקודה לשואב",
    entity_unavailable: "השואב אינו זמין"
  },
  // פאנל הגדרות
  settings: {
    title: "הגדרות",
    consumables: {
      title: "חלקי חילוף",
      main_brush: "מברשת ראשית",
      side_brush: "מברשת צד",
      filter: "מסנן",
      sensor: "חיישן",
      mop_pad: "רפידת ניגוב",
      silver_ion: "יוני כסף",
      detergent: "חומר ניקוי",
      squeegee: "מגב",
      tank_filter: "מסנן מיכל",
      onboard_dirty_water_tank: "מיכל מים מלוכלכים מובנה",
      dirty_water_channel: "ערוץ מים מלוכלכים",
      deodorizer: "מטהר אוויר",
      wheel: "גלגל",
      scale_inhibitor: "נוגד אבנית",
      fluffing_roller: "רולר הפרדה",
      roller_mop_filter: "מסנן ספוג רולר",
      water_outlet_filter: "מסנן יציאת מים",
      remaining: "נותרו",
      reset: "איפוס"
    },
    device_info: {
      title: "מידע על המכשיר",
      firmware: "גרסת קושחה",
      total_area: 'סה"כ שטח שנוקה',
      total_time: 'סה"כ זמן ניקוי',
      total_cleans: 'סה"כ סבבי ניקוי',
      wifi_ssid: "רשת Wi-Fi",
      wifi_signal: "עוצמת אות",
      ip_address: "כתובת IP"
    },
    quick_settings: {
      title: "הגדרות מהירות",
      child_lock: "נעילת ילדים",
      child_lock_desc: "ביטול הלחצנים הפיזיים במכשיר",
      resume_cleaning: "המשך ניקוי",
      resume_cleaning_desc: "המשך ניקוי אוטומטית לאחר טעינה",
      dnd: "נא לא להפריע",
      dnd_desc: "שעות שקטות עם פעילות מופחתת",
      dnd_start: "שעת התחלה",
      dnd_end: "שעת סיום",
      dnd_disable_resume: "השבת המשך",
      dnd_disable_resume_desc: "אל תמשיך ניקוי במצב נא לא להפריע",
      dnd_disable_auto_empty: "השבת ריקון אוטומטי",
      dnd_disable_auto_empty_desc: "אל תרוקן אוטומטית במצב נא לא להפריע",
      dnd_reduce_volume: "הפחת עוצמת קול",
      dnd_reduce_volume_desc: "הפחת עוצמת קול המכשיר במצב נא לא להפריע"
    },
    volume: {
      title: "עוצמת קול וצליל",
      volume: "עוצמה",
      test_sound: "אתר מכשיר",
      muted: "מושתק",
      voice_assistant: "עוזר קולי",
      voice_assistant_desc: "הפעל הודעות קוליות ומשוב",
      voice_language: "שפת קול",
      voice_language_desc: "שפה להודעות קוליות",
      streaming_voice_prompt: "הנחיה קולית בזמן אמת",
      streaming_voice_prompt_desc: "משוב קולי בזמן אמת במהלך ניקוי"
    },
    carpet: {
      title: "הגדרות שטיחים",
      carpet_recognition: "זיהוי שטיחים",
      carpet_recognition_desc: "זיהוי אוטומטי של שטיחים",
      carpet_avoidance: "הימנעות משטיחים",
      carpet_avoidance_desc: "הימנעות משטיחים בזמן ניגוב",
      clean_carpets_first: "נקה שטיחים קודם",
      clean_carpets_first_desc: "שאוב שטיחים לפני שטיפת רצפות",
      carpet_boost: "הגברת שאיבה על שטיחים",
      carpet_boost_desc: "הגברת עוצמת השאיבה על שטיחים",
      intensive_cleaning: "ניקוי אינטנסיבי",
      intensive_cleaning_desc: "ניקוי עמוק עם מעברים נוספים",
      side_brush_rotate: "סיבוב מברשת צד",
      side_brush_rotate_desc: "סובב מברשת צד על שטיחים",
      sensitivity: "רגישות לזיהוי שטיחים",
      sensitivity_desc: "רמת רגישות הזיהוי",
      sensitivity_low: "נמוכה",
      sensitivity_medium: "בינונית",
      sensitivity_high: "גבוהה",
      cleaning_mode: "ניקוי שטיחים",
      cleaning_mode_desc: "כיצד לטפל בשטיחים במהלך הניקוי",
      mode_vacuum: "שאיבה",
      mode_vacuum_and_mop: "שאיבה ושטיפה",
      mode_avoidance: "הימנעות",
      mode_ignore: "התעלם",
      vacuum_mode: "מצב שאיבה",
      vacuum_adaptation: "הרמת מגב",
      vacuum_remove_mop: "הסר מגב"
    },
    floor: {
      title: "הגדרות רצפה",
      obstacle_avoidance: "הימנעות ממכשולים",
      obstacle_avoidance_desc: "השתמש בחיישנים להימנעות ממכשולים",
      collision_avoidance: "הימנעות מהתנגשות",
      collision_avoidance_desc: "האט ליד קירות ורהיטים",
      auto_mount_mop: "הרכבת מגב אוטומטית",
      auto_mount_mop_desc: "הרכב אוטומטית את כרית המגב בעת הצורך",
      auto_recleaning: "ניקוי חוזר אוטומטי",
      auto_recleaning_desc: "נקה אוטומטית אזורים שהוחמצו",
      recleaning_off: "כבוי",
      recleaning_in_deep_mode: "במצב עמוק",
      recleaning_in_all_modes: "בכל המצבים",
      stain_avoidance: "הימנעות מכתמים",
      stain_avoidance_desc: "הימנעות מכתמים שזוהו",
      tight_mopping: "שטיפה יסודית",
      tight_mopping_desc: "שטיפה קרובה יותר לקירות ולקצוות",
      floor_direction_cleaning: "ניקוי בכיוון הרצפה",
      floor_direction_cleaning_desc: "נקה לאורך כיוון סיבי הרצפה",
      large_particles_boost: "הגברה לחלקיקים גדולים",
      large_particles_boost_desc: "הגבר שאיבה לפסולת גדולה",
      pet_focused_cleaning: "ניקוי ממוקד חיות מחמד",
      pet_focused_cleaning_desc: "ניקוי נוסף באזורי חיות מחמד",
      low_lying_area_frequency: "תדירות אזורים נמוכים",
      low_lying_area_frequency_desc: "באיזו תדירות לנקות אזורים נמוכים מתחת לרהיטים"
    },
    edge_corner: {
      title: "קצוות ופינות",
      side_reach: "הגעה צדית",
      side_reach_desc: "הארך מברשת צד לקצוות",
      mop_extend: "הארכת מגב",
      mop_extend_desc: "הארך מגב לקצוות ופינות",
      gap_cleaning: "ניקוי מרווחים",
      gap_cleaning_desc: "נקה מרווחים צרים בין רהיטים",
      mopping_under: "שטיפה מתחת לרהיטים",
      mopping_under_desc: "הארך מגב מתחת לרהיטים נמוכים",
      extend_frequency: "תדירות הארכה",
      extend_frequency_desc: "באיזו תדירות להאריך מגב לניקוי קצוות",
      frequency_standard: "רגילה",
      frequency_intelligent: "חכמה",
      frequency_high: "גבוהה"
    },
    dock: {
      title: "הגדרות תחנה",
      self_clean: "ניקוי עצמי",
      self_clean_desc: "שטיפת מגב אוטומטית לאחר ניקוי",
      auto_empty_mode: "מצב ריקון אוטו",
      auto_empty_mode_desc: "מתי לרוקן אוטומטית את מיכל האבק",
      auto_empty_frequency: "תדירות ריקון אוטו",
      auto_empty_frequency_desc: "כמה ניקויים לפני ריקון אוטומטי",
      empty_off: "כבוי",
      empty_standard: "רגיל",
      empty_high_frequency: "תדירות גבוהה",
      empty_low_frequency: "תדירות נמוכה",
      auto_detergent: "חומר ניקוי אוטו",
      auto_detergent_desc: "הוסף אוטומטית חומר ניקוי בזמן שטיפה",
      mop_washing_with_detergent: "שטיפת מגב עם חומר ניקוי",
      mop_washing_with_detergent_desc: "שימוש בחומר ניקוי בשטיפת המגב",
      mopping_with_detergent: "ניגוב עם חומר ניקוי",
      mopping_with_detergent_desc: "שימוש בחומר ניקוי בזמן ניגוב",
      water_electrolysis: "אלקטרוליזה של מים",
      water_electrolysis_desc: "עיקור מים באמצעות אלקטרוליזה",
      auto_water_refilling: "מילוי מים אוטומטי",
      auto_water_refilling_desc: "מילוי אוטומטי של מיכל המים הנקיים",
      auto_dust_collecting: "איסוף אבק אוטומטי",
      auto_dust_collecting_desc: "ריקון אוטומטי של מיכל האבק לאחר ניקוי",
      smart_washing: "שטיפה חכמה",
      smart_washing_desc: "התאם שטיפה לפי רמת הלכלוך",
      mop_wash_level: "רמת שטיפת מגב",
      mop_wash_level_desc: "עוצמת שטיפת המגב",
      washing_mode: "מצב שטיפה",
      washing_mode_desc: "עוצמת שטיפת המגב",
      washing_light: "קל",
      washing_standard: "רגיל",
      washing_deep: "עמוק",
      water_temperature: "טמפרטורת מים",
      water_temperature_desc: "טמפרטורה לשטיפת המגב",
      temp_normal: "רגילה",
      temp_mild: "עדינה",
      temp_warm: "חמה",
      temp_hot: "חמה מאוד",
      auto_drying: "ייבוש אוטו",
      auto_drying_desc: "ייבש אוטומטית את המגב לאחר ניקוי",
      drying_time: "זמן ייבוש",
      drying_time_desc: "משך ייבוש המגב",
      auto_rewashing: "שטיפה חוזרת אוטומטית",
      auto_rewashing_desc: "שטוף מגב אוטומטית כשמלוכלך",
      rewashing_off: "כבוי",
      rewashing_in_deep_mode: "במצב עמוק",
      rewashing_in_all_modes: "בכל המצבים",
      off_peak_charging: "טעינה בשעות שפל",
      off_peak_charging_desc: "טען בשעות שפל לחיסכון באנרגיה",
      off_peak_charging_start: "שעת התחלה",
      off_peak_charging_end: "שעת סיום",
      station_cleaning: "ניקוי תחנה",
      station_cleaning_desc: "נקה את תחנת הבסיס",
      clean_now: "נקה עכשיו",
      self_repair: "תיקון עצמי",
      self_repair_desc: "הפעל אבחון תיקון עצמי של התחנה",
      repair_now: "תקן",
      scraper_frequency: "תדירות מגרד",
      scraper_frequency_desc: "באיזו תדירות לנקות את המגרד הגומי"
    },
    ai_detection: {
      title: "בינה מלאכותית וזיהוי",
      intelligent_recognition: "זיהוי חכם",
      intelligent_recognition_desc: "זיהוי סביבה מבוסס AI",
      ai_obstacle_detection: "זיהוי מכשולים מבוסס AI",
      ai_obstacle_detection_desc: "שימוש ב-AI לזיהוי והימנעות ממכשולים",
      fuzzy_obstacle_detection: "זיהוי מכשולים מטושטש",
      fuzzy_obstacle_detection_desc: "זיהוי מכשולים רכים או לא ברורים",
      ai_obstacle_image_upload: "העלאת תמונות מכשולים",
      ai_obstacle_image_upload_desc: "העלאת תמונות מכשולים לניתוח",
      ai_obstacle_picture: "תמונת מכשול",
      ai_obstacle_picture_desc: "צלם תמונות של מכשולים שזוהו",
      ai_pet_detection: "זיהוי חיות מחמד",
      ai_pet_detection_desc: "זיהוי והימנעות מחיות מחמד",
      ai_pet_avoidance: "הימנעות מחיות מחמד",
      ai_pet_avoidance_desc: "הימנעות פעילה מחיות מחמד שזוהו",
      pet_focused_detection: "זיהוי ממוקד חיות מחמד",
      pet_focused_detection_desc: "זיהוי משופר לאזורי חיות מחמד",
      pet_picture: "תמונת חיית מחמד",
      pet_picture_desc: "צלם תמונות של חיות מחמד שזוהו",
      ai_human_detection: "זיהוי בני אדם",
      ai_human_detection_desc: "זיהוי והימנעות מבני אדם",
      human_follow: "מעקב אחר אדם",
      human_follow_desc: "עקוב אחר אנשים לניקוי אינטראקטיבי",
      ai_furniture_detection: "זיהוי רהיטים",
      ai_furniture_detection_desc: "זיהוי וניווט סביב רהיטים",
      ai_fluid_detection: "זיהוי נוזלים",
      ai_fluid_detection_desc: "זיהוי והימנעות מנוזלים",
      fill_light: "תאורת עזר",
      fill_light_desc: "שימוש בתאורת עזר לזיהוי טוב יותר",
      camera_light_auto: "בהירות מצלמה אוטומטית",
      camera_light_auto_desc: "התאם אוטומטית את בהירות אור המצלמה",
      camera_light_brightness: "בהירות אור מצלמה",
      camera_light_brightness_desc: "רמת בהירות ידנית של אור המצלמה"
    },
    station_controls: {
      title: "בקרת תחנה",
      self_clean: "ניקוי עצמי",
      self_clean_desc: "התחל מחזור שטיפת מטלית",
      manual_drying: "ייבוש ידני",
      manual_drying_desc: "התחל מחזור ייבוש מטלית",
      water_tank_draining: "ריקון מיכל מים",
      water_tank_draining_desc: "נקז מים מלוכלכים מהמיכל",
      base_station_cleaning: "ניקוי תחנה",
      base_station_cleaning_desc: "נקה את תחנת הבסיס",
      empty_water_tank: "רוקן מיכל מים",
      empty_water_tank_desc: "רוקן את מיכל איסוף המים",
      start_auto_empty: "ריקון אוטומטי",
      start_auto_empty_desc: "התחל ריקון אוטומטי של מיכל האבק",
      start_recleaning: "ניקוי חוזר",
      start_recleaning_desc: "התחל ניקוי חוזר של אזורים שהוחמצו",
      clear_warning: "נקה אזהרה",
      clear_warning_desc: "נקה הודעות אזהרה נוכחיות"
    },
    map: {
      title: "הגדרות מפה",
      multi_floor: "מפת רב-קומות",
      multi_floor_desc: "הפעל תמיכה במפות מרובות קומות",
      rotation: "סיבוב מפה",
      rotation_desc: "סובב את כיוון המפה",
      mapping_actions: "פעולות מיפוי",
      start_mapping: "התחל מיפוי",
      start_fast_mapping: "מיפוי מהיר"
    }
  }
}, d1 = {
  // Common
  common: {
    run: "실행",
    start: "시작",
    stop: "정지",
    cancel: "취소",
    save: "저장",
    apply: "적용",
    reset: "초기화"
  },
  // Room Selector
  room_selector: {
    title: "방 선택",
    selected_count: "{{count}}개 선택됨"
  },
  // Map Selector
  map_selector: {
    unknown: "알 수 없는 맵"
  },
  // Vacuum Map
  vacuum_map: {
    no_map: "사용 가능한 맵이 없습니다",
    looking_for: "검색 중: {{entity}}",
    room_overlay: "방 번호를 클릭하여 청소할 방을 선택하세요",
    zone_overlay_create: "맵을 클릭하여 청소 구역을 지정하세요",
    zone_overlay_resize: "모서리를 드래그하여 크기를 조절하거나, 다른 곳을 클릭하여 위치를 이동하세요",
    clear_zone: "구역 지우기",
    switch_to_list: "목록 보기로 전환",
    switch_to_map: "맵 보기로 전환",
    room_list_overlay: "청소할 방을 탭하여 선택하세요",
    no_rooms: "사용 가능한 방이 없습니다",
    zoom_in: "확대",
    zoom_out: "축소",
    zoom_reset: "확대/축소 초기화",
    lock_map: "맵 잠금",
    unlock_map: "맵 잠금 해제"
  },
  // Mode Tabs
  modes: {
    room: "방",
    all: "전체",
    zone: "구역"
  },
  // Action Buttons
  actions: {
    clean: "청소",
    clean_all: "전체 청소",
    clean_rooms: "{{count}}개 방 청소",
    clean_rooms_plural: "{{count}}개 방 청소",
    select_rooms: "방 선택",
    zone_clean: "구역 청소",
    pause: "일시 정지",
    resume: "재개",
    stop: "중지",
    stop_and_dock: "중지 및 도크 복귀",
    dock: "도크 복귀"
  },
  // Toast Messages
  toast: {
    selected_room: "{{name}} 선택됨",
    deselected_room: "{{name}} 선택 해제됨",
    paused: "청소가 일시 정지되었습니다",
    stopped: "청소가 중지되었습니다",
    docked: "도크로 복귀 중입니다",
    cleaning_started: "청소를 시작했습니다",
    resuming: "청소를 재개합니다",
    starting_full_clean: "전체 집 청소를 시작합니다",
    pausing_vacuum: "청소기 일시 정지 중",
    stopping_vacuum: "청소기 중지 중",
    stopping_and_docking: "청소기 중지 및 도크 복귀 중",
    vacuum_docking: "청소기가 도크로 복귀 중입니다",
    starting_room_clean: "선택한 {{count}}개 방 청소를 시작합니다",
    starting_room_clean_plural: "선택한 {{count}}개 방 청소를 시작합니다",
    starting_zone_clean: "구역 청소를 시작합니다",
    select_rooms_first: "먼저 청소할 방을 선택해 주세요",
    cannot_determine_map: "맵 크기를 확인할 수 없습니다",
    select_zone_first: "먼저 맵에서 구역을 선택해 주세요"
  },
  // Room Selection Display
  room_display: {
    selected_rooms: "선택된 방:",
    selected_label: "선택 항목:"
  },
  // Cleaning Mode Button
  cleaning_mode_button: {
    prefix_custom: "맞춤: ",
    prefix_cleangenius: "CleanGenius: ",
    view_shortcuts: "단축키 보기",
    repeats_tooltip: "반복 횟수",
    vac_and_mop: "진공 및 물걸레",
    mop_after_vac: "진공 후 물걸레",
    vacuum: "진공",
    mop: "물걸레"
  },
  // Cleaning Mode Modal
  cleaning_mode: {
    title: "청소 모드",
    clean_genius: "CleanGenius",
    custom: "맞춤 설정"
  },
  // Shortcuts Modal
  shortcuts: {
    title: "단축키",
    no_shortcuts: "사용 가능한 단축키가 없습니다",
    create_hint: "Dreame 앱에서 단축키를 만들어 자주 사용하는 청소 루틴을 빠르게 시작하세요"
  },
  // Custom Mode
  custom_mode: {
    cleaning_mode_title: "청소 모드",
    suction_power_title: "흡입력",
    max_plus_description: "흡입력을 최고 수준으로 올립니다. 일회성 모드입니다.",
    wetness_title: "물걸레 습도",
    mop_pad_humidity_title: "물걸레 패드 습도",
    slightly_dry: "약간 건조",
    moist: "촉촉하게",
    wet: "젖음",
    water_volume_title: "물 양",
    water_low: "낮음",
    water_medium: "중간",
    water_high: "높음",
    mop_washing_frequency_title: "물걸레 세척 빈도",
    route_title: "경로",
    mop_pressure_title: "물걸레 압력",
    mop_temperature_title: "물 온도"
  },
  // 물걸레 압력 레벨
  mop_pressure: {
    light: "약하게",
    normal: "보통"
  },
  // 물 온도 레벨
  mop_temperature: {
    normal: "상온",
    warm: "따뜻하게"
  },
  // Customize Cleaning Mode
  customize: {
    title: "사용자 지정",
    description: "각 구역에 대한 흡입력 및 물걸레 설정을 지정하세요.",
    set_button: "설정",
    vacuum: "진공",
    mop: "물걸레",
    vac_and_mop: "진공 및 물걸레",
    cycles: "반복 횟수",
    apply_to_all: "모든 방에 적용",
    click_room_hint: "개별 구역을 클릭하여 모드를 변경하세요.",
    intelligent_recommendation: "지능형 추천",
    select_room: "방 선택",
    settings_for: "{{room}} 설정",
    no_rooms: "사용 가능한 방이 없습니다"
  },
  // CleanGenius Mode
  cleangenius_mode: {
    cleaning_mode_title: "청소 모드",
    deep_cleaning: "딥 클리닝"
  },
  // Header
  header: {
    battery: "배터리",
    status: "상태",
    area: "면적",
    time: "시간"
  },
  // Units
  units: {
    square_meters: "m²",
    minutes: "분",
    minutes_short: "분",
    percent: "%",
    decibels: "dBm"
  },
  // Suction Levels (friendly names)
  suction_levels: {
    quiet: "저소음",
    standard: "표준",
    strong: "터보",
    turbo: "최대"
  },
  // Mop Washing Frequency
  mop_washing_frequency: {
    by_room: "방별",
    by_area: "면적별",
    by_time: "시간별"
  },
  // Cleaning Routes
  cleaning_routes: {
    quick: "빠르게",
    standard: "표준",
    intensive: "집중",
    deep: "딥 클리닝"
  },
  // Errors
  errors: {
    entity_not_found: "엔티티를 찾을 수 없음: {{entity}}",
    failed_to_load: "엔티티 데이터를 불러오지 못했습니다",
    service_call_failed: "청소기에 명령을 보내지 못했습니다",
    entity_unavailable: "청소기를 사용할 수 없습니다"
  },
  // Settings Panel
  settings: {
    title: "설정",
    consumables: {
      title: "소모품",
      main_brush: "메인 브러시",
      side_brush: "사이드 브러시",
      filter: "필터",
      sensor: "센서",
      mop_pad: "물걸레 패드",
      silver_ion: "은이온",
      detergent: "세제",
      squeegee: "스퀴지",
      tank_filter: "탱크 필터",
      onboard_dirty_water_tank: "내장 오수 탱크",
      dirty_water_channel: "오수 채널",
      deodorizer: "탈취제",
      wheel: "바퀴",
      scale_inhibitor: "석회 억제제",
      fluffing_roller: "플러핑 롤러",
      roller_mop_filter: "롤러 물걸레 필터",
      water_outlet_filter: "물 배출 필터",
      remaining: "남음",
      reset: "초기화"
    },
    device_info: {
      title: "기기 정보",
      firmware: "펌웨어",
      total_area: "총 청소 면적",
      total_time: "총 청소 시간",
      total_cleans: "총 청소 횟수",
      wifi_ssid: "Wi-Fi 네트워크",
      wifi_signal: "신호 강도",
      ip_address: "IP 주소"
    },
    quick_settings: {
      title: "빠른 설정",
      child_lock: "차일드 락",
      child_lock_desc: "기기의 물리적 버튼을 비활성화합니다",
      resume_cleaning: "청소 재개",
      resume_cleaning_desc: "충전 후 자동으로 청소 재개",
      dnd: "방해 금지",
      dnd_desc: "활동을 줄여 조용한 시간을 가집니다",
      dnd_start: "시작 시간",
      dnd_end: "종료 시간",
      dnd_disable_resume: "재개 비활성화",
      dnd_disable_resume_desc: "방해 금지 모드에서 청소 재개 안 함",
      dnd_disable_auto_empty: "자동 비우기 비활성화",
      dnd_disable_auto_empty_desc: "방해 금지 모드에서 자동 비우기 안 함",
      dnd_reduce_volume: "볼륨 줄이기",
      dnd_reduce_volume_desc: "방해 금지 모드에서 기기 볼륨 줄이기"
    },
    volume: {
      title: "볼륨 및 사운드",
      volume: "볼륨",
      test_sound: "위치 찾기",
      muted: "음소거됨",
      voice_assistant: "음성 어시스턴트",
      voice_assistant_desc: "음성 안내 및 피드백 활성화",
      voice_language: "음성 언어",
      voice_language_desc: "음성 안내 언어",
      streaming_voice_prompt: "실시간 음성 안내",
      streaming_voice_prompt_desc: "청소 중 실시간 음성 피드백"
    },
    carpet: {
      title: "카펫 설정",
      carpet_recognition: "카펫 인식",
      carpet_recognition_desc: "카펫을 자동으로 감지합니다",
      carpet_avoidance: "카펫 회피",
      carpet_avoidance_desc: "물걸레질 중 카펫을 회피합니다",
      clean_carpets_first: "카펫 먼저 청소",
      clean_carpets_first_desc: "바닥 물걸레 전에 카펫 청소",
      carpet_boost: "카펫 부스트",
      carpet_boost_desc: "카펫 위에서 흡입력을 높입니다",
      intensive_cleaning: "집중 청소",
      intensive_cleaning_desc: "추가 패스로 카펫 심층 청소",
      side_brush_rotate: "사이드 브러시 회전",
      side_brush_rotate_desc: "카펫에서 사이드 브러시 회전",
      sensitivity: "카펫 민감도",
      sensitivity_desc: "감지 민감도 수준",
      sensitivity_low: "낮음",
      sensitivity_medium: "보통",
      sensitivity_high: "높음",
      cleaning_mode: "카펫 청소",
      cleaning_mode_desc: "청소 중 카펫 처리 방법",
      mode_vacuum: "청소",
      mode_vacuum_and_mop: "청소 & 물걸레",
      mode_avoidance: "회피",
      mode_ignore: "무시",
      vacuum_mode: "청소 모드",
      vacuum_adaptation: "물걸레 들어올림",
      vacuum_remove_mop: "물걸레 제거"
    },
    floor: {
      title: "바닥 설정",
      obstacle_avoidance: "장애물 회피",
      obstacle_avoidance_desc: "센서를 사용하여 장애물 회피",
      collision_avoidance: "충돌 회피",
      collision_avoidance_desc: "벽과 가구 근처에서 속도 줄임",
      auto_mount_mop: "자동 물걸레 장착",
      auto_mount_mop_desc: "필요시 자동으로 물걸레 패드 장착",
      auto_recleaning: "자동 재청소",
      auto_recleaning_desc: "놓친 영역 자동 재청소",
      recleaning_off: "끔",
      recleaning_in_deep_mode: "딥 모드에서",
      recleaning_in_all_modes: "모든 모드에서",
      stain_avoidance: "얼룩 회피",
      stain_avoidance_desc: "감지된 얼룩을 피합니다",
      tight_mopping: "꼼꼼한 물걸레질",
      tight_mopping_desc: "벽과 가장자리에 더 가깝게 닦습니다",
      floor_direction_cleaning: "바닥 방향 청소",
      floor_direction_cleaning_desc: "바닥 결 방향에 따라 청소",
      large_particles_boost: "대형 입자 부스트",
      large_particles_boost_desc: "큰 이물질에 대한 흡입력 증가",
      pet_focused_cleaning: "반려동물 구역 청소",
      pet_focused_cleaning_desc: "반려동물 구역에서 추가 청소",
      low_lying_area_frequency: "낮은 구역 청소 빈도",
      low_lying_area_frequency_desc: "가구 아래 낮은 구역을 얼마나 자주 청소할지"
    },
    edge_corner: {
      title: "가장자리 & 모서리",
      side_reach: "측면 도달",
      side_reach_desc: "가장자리를 위해 측면 브러시 확장",
      mop_extend: "물걸레 확장",
      mop_extend_desc: "가장자리와 모서리를 위해 물걸레 확장",
      gap_cleaning: "틈새 청소",
      gap_cleaning_desc: "가구 사이 좁은 틈새 청소",
      mopping_under: "가구 아래 청소",
      mopping_under_desc: "낮은 가구 아래로 물걸레 확장",
      extend_frequency: "확장 빈도",
      extend_frequency_desc: "가장자리 청소를 위한 물걸레 확장 빈도",
      frequency_standard: "표준",
      frequency_intelligent: "지능형",
      frequency_high: "높음"
    },
    dock: {
      title: "도크 설정",
      self_clean: "자가 세척",
      self_clean_desc: "청소 후 자동 물걸레 세척",
      auto_empty_mode: "자동 비우기 모드",
      auto_empty_mode_desc: "먼지통을 자동으로 비울 시기",
      auto_empty_frequency: "자동 비우기 빈도",
      auto_empty_frequency_desc: "주기당 자동 비우기 횟수",
      empty_off: "끔",
      empty_standard: "표준",
      empty_high_frequency: "고빈도",
      empty_low_frequency: "저빈도",
      auto_detergent: "자동 세제 추가",
      auto_detergent_desc: "세척 시 자동으로 세제 추가",
      mop_washing_with_detergent: "세제로 물걸레 세척",
      mop_washing_with_detergent_desc: "물걸레 세척 시 세제 사용",
      mopping_with_detergent: "세제로 물걸레질",
      mopping_with_detergent_desc: "바닥 물걸레질 시 세제 사용",
      water_electrolysis: "물 전기분해",
      water_electrolysis_desc: "전기분해로 물 살균",
      auto_water_refilling: "자동 물 보충",
      auto_water_refilling_desc: "깨끗한 물 탱크 자동 보충",
      auto_dust_collecting: "자동 먼지 수집",
      auto_dust_collecting_desc: "청소 후 자동으로 먼지통 비우기",
      smart_washing: "스마트 세척",
      smart_washing_desc: "오염 수준에 따라 세척 조정",
      mop_wash_level: "세척 수준",
      mop_wash_level_desc: "물걸레 세척 사이클 강도",
      washing_mode: "세척 모드",
      washing_mode_desc: "물걸레 세척 강도",
      washing_light: "가벼움",
      washing_standard: "표준",
      washing_deep: "심층",
      water_temperature: "물 온도",
      water_temperature_desc: "물걸레 세척 온도",
      temp_normal: "보통",
      temp_mild: "미온",
      temp_warm: "따뜻함",
      temp_hot: "뜨거움",
      auto_drying: "자동 건조",
      auto_drying_desc: "청소 후 자동으로 물걸레 건조",
      drying_time: "건조 시간",
      drying_time_desc: "물걸레 건조 시간",
      auto_rewashing: "자동 재세척",
      auto_rewashing_desc: "오염 시 자동으로 물걸레 재세척",
      rewashing_off: "끔",
      rewashing_in_deep_mode: "딥 모드에서",
      rewashing_in_all_modes: "모든 모드에서",
      off_peak_charging: "비피크 시간 충전",
      off_peak_charging_desc: "비피크 시간에 충전하여 에너지 절약",
      off_peak_charging_start: "시작 시간",
      off_peak_charging_end: "종료 시간",
      station_cleaning: "스테이션 청소",
      station_cleaning_desc: "베이스 스테이션 청소",
      clean_now: "지금 청소",
      self_repair: "자가 수리",
      self_repair_desc: "스테이션 자가 진단 실행",
      repair_now: "수리",
      scraper_frequency: "스크레이퍼 청소 빈도",
      scraper_frequency_desc: "고무 스크레이퍼를 얼마나 자주 청소할지"
    },
    ai_detection: {
      title: "AI 및 감지",
      intelligent_recognition: "지능형 인식",
      intelligent_recognition_desc: "AI 기반 환경 인식",
      ai_obstacle_detection: "AI 장애물 감지",
      ai_obstacle_detection_desc: "AI를 사용하여 장애물을 식별하고 피합니다",
      fuzzy_obstacle_detection: "퍼지 장애물 감지",
      fuzzy_obstacle_detection_desc: "부드럽거나 불명확한 장애물 감지",
      ai_obstacle_image_upload: "장애물 이미지 업로드",
      ai_obstacle_image_upload_desc: "분석을 위해 장애물 이미지를 업로드합니다",
      ai_obstacle_picture: "장애물 사진",
      ai_obstacle_picture_desc: "감지된 장애물 사진 촬영",
      ai_pet_detection: "반려동물 감지",
      ai_pet_detection_desc: "반려동물을 감지하고 피합니다",
      ai_pet_avoidance: "반려동물 회피",
      ai_pet_avoidance_desc: "감지된 반려동물을 적극적으로 회피",
      pet_focused_detection: "반려동물 집중 감지",
      pet_focused_detection_desc: "반려동물 영역 강화 감지",
      pet_picture: "반려동물 사진",
      pet_picture_desc: "감지된 반려동물 사진 촬영",
      ai_human_detection: "사람 감지",
      ai_human_detection_desc: "사람을 감지하고 피합니다",
      human_follow: "사람 따라가기",
      human_follow_desc: "인터랙티브 청소를 위해 사람 따라가기",
      ai_furniture_detection: "가구 감지",
      ai_furniture_detection_desc: "가구를 감지하고 주변을 탐색합니다",
      ai_fluid_detection: "액체 감지",
      ai_fluid_detection_desc: "액체를 감지하고 피합니다",
      fill_light: "보조 조명",
      fill_light_desc: "더 나은 감지를 위해 보조 조명을 사용합니다",
      camera_light_auto: "자동 카메라 밝기",
      camera_light_auto_desc: "카메라 조명 밝기 자동 조정",
      camera_light_brightness: "카메라 조명 밝기",
      camera_light_brightness_desc: "수동 카메라 조명 밝기 수준"
    },
    station_controls: {
      title: "스테이션 제어",
      self_clean: "자가 세척",
      self_clean_desc: "물걸레 패드 세척 사이클 시작",
      manual_drying: "수동 건조",
      manual_drying_desc: "물걸레 패드 건조 사이클 시작",
      water_tank_draining: "물탱크 배수",
      water_tank_draining_desc: "탱크에서 오수 배수",
      base_station_cleaning: "스테이션 청소",
      base_station_cleaning_desc: "베이스 스테이션 청소",
      empty_water_tank: "물탱크 비우기",
      empty_water_tank_desc: "물 수집 탱크 비우기",
      start_auto_empty: "자동 비우기",
      start_auto_empty_desc: "먼지통 자동 비우기 시작",
      start_recleaning: "재청소",
      start_recleaning_desc: "놓친 영역 재청소 시작",
      clear_warning: "경고 지우기",
      clear_warning_desc: "현재 경고 메시지 지우기"
    },
    map: {
      title: "지도 설정",
      multi_floor: "다층 지도",
      multi_floor_desc: "여러 층 지도 지원 활성화",
      rotation: "지도 회전",
      rotation_desc: "지도 방향 회전",
      mapping_actions: "매핑 작업",
      start_mapping: "매핑 시작",
      start_fast_mapping: "빠른 매핑"
    }
  }
}, xp = {
  en: t1,
  de: n1,
  ru: a1,
  zh: i1,
  es: o1,
  nl: r1,
  it: s1,
  pl: l1,
  fr_FR: c1,
  he: u1,
  ko: d1
};
function _1(n, a) {
  return a ? Object.entries(a).reduce((o, [s, l]) => o.replace(new RegExp(`{{${s}}}`, "g"), String(l)), n) : n;
}
function m1(n, a) {
  return a.split(".").reduce((o, s) => {
    if (o && typeof o == "object" && s in o)
      return o[s];
  }, n);
}
function f1(n = "en") {
  const a = xp[n] || xp.en;
  return function(s, l) {
    const d = m1(a, s);
    return typeof d != "string" ? (ne.warn(`Translation key not found: ${s}`), s) : _1(d, l);
  };
}
function p1(n, a) {
  return a === 0 ? n("actions.select_rooms") : n(a === 1 ? "actions.clean_rooms" : "actions.clean_rooms_plural", { count: String(a) });
}
const g1 = ["he"];
function Wg(n) {
  return g1.includes(n);
}
const Wu = D.createContext(null);
function Ie(n) {
  const a = D.useContext(Wu), o = n ?? a?.language ?? "en", s = D.useMemo(() => f1(o), [o]);
  return {
    t: s,
    getRoomCountTranslation: (l) => p1(s, l)
  };
}
function B(n, a, o) {
  function s(m, p) {
    if (m._zod || Object.defineProperty(m, "_zod", {
      value: {
        def: p,
        constr: _,
        traits: /* @__PURE__ */ new Set()
      },
      enumerable: !1
    }), m._zod.traits.has(n))
      return;
    m._zod.traits.add(n), a(m, p);
    const f = _.prototype, v = Object.keys(f);
    for (let y = 0; y < v.length; y++) {
      const w = v[y];
      w in m || (m[w] = f[w].bind(m));
    }
  }
  const l = o?.Parent ?? Object;
  class d extends l {
  }
  Object.defineProperty(d, "name", { value: n });
  function _(m) {
    var p;
    const f = o?.Parent ? new d() : this;
    s(f, m), (p = f._zod).deferred ?? (p.deferred = []);
    for (const v of f._zod.deferred)
      v();
    return f;
  }
  return Object.defineProperty(_, "init", { value: s }), Object.defineProperty(_, Symbol.hasInstance, {
    value: (m) => o?.Parent && m instanceof o.Parent ? !0 : m?._zod?.traits?.has(n)
  }), Object.defineProperty(_, "name", { value: n }), _;
}
class to extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
class $g extends Error {
  constructor(a) {
    super(`Encountered unidirectional transform during encode: ${a}`), this.name = "ZodEncodeError";
  }
}
const Qg = {};
function Ma(n) {
  return Qg;
}
function Jg(n) {
  const a = Object.values(n).filter((s) => typeof s == "number");
  return Object.entries(n).filter(([s, l]) => a.indexOf(+s) === -1).map(([s, l]) => l);
}
function Ru(n, a) {
  return typeof a == "bigint" ? a.toString() : a;
}
function $u(n) {
  return {
    get value() {
      {
        const a = n();
        return Object.defineProperty(this, "value", { value: a }), a;
      }
    }
  };
}
function Qu(n) {
  return n == null;
}
function Ju(n) {
  const a = n.startsWith("^") ? 1 : 0, o = n.endsWith("$") ? n.length - 1 : n.length;
  return n.slice(a, o);
}
function h1(n, a) {
  const o = (n.toString().split(".")[1] || "").length, s = a.toString();
  let l = (s.split(".")[1] || "").length;
  if (l === 0 && /\d?e-\d?/.test(s)) {
    const p = s.match(/\d?e-(\d?)/);
    p?.[1] && (l = Number.parseInt(p[1]));
  }
  const d = o > l ? o : l, _ = Number.parseInt(n.toFixed(d).replace(".", "")), m = Number.parseInt(a.toFixed(d).replace(".", ""));
  return _ % m / 10 ** d;
}
const Mp = /* @__PURE__ */ Symbol("evaluating");
function Ge(n, a, o) {
  let s;
  Object.defineProperty(n, a, {
    get() {
      if (s !== Mp)
        return s === void 0 && (s = Mp, s = o()), s;
    },
    set(l) {
      Object.defineProperty(n, a, {
        value: l
        // configurable: true,
      });
    },
    configurable: !0
  });
}
function di(n, a, o) {
  Object.defineProperty(n, a, {
    value: o,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function Da(...n) {
  const a = {};
  for (const o of n) {
    const s = Object.getOwnPropertyDescriptors(o);
    Object.assign(a, s);
  }
  return Object.defineProperties({}, a);
}
function Op(n) {
  return JSON.stringify(n);
}
function v1(n) {
  return n.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const eh = "captureStackTrace" in Error ? Error.captureStackTrace : (...n) => {
};
function Ps(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
const y1 = $u(() => {
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    const n = Function;
    return new n(""), !0;
  } catch {
    return !1;
  }
});
function no(n) {
  if (Ps(n) === !1)
    return !1;
  const a = n.constructor;
  if (a === void 0 || typeof a != "function")
    return !0;
  const o = a.prototype;
  return !(Ps(o) === !1 || Object.prototype.hasOwnProperty.call(o, "isPrototypeOf") === !1);
}
function th(n) {
  return no(n) ? { ...n } : Array.isArray(n) ? [...n] : n;
}
const b1 = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function ao(n) {
  return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ja(n, a, o) {
  const s = new n._zod.constr(a ?? n._zod.def);
  return (!a || o?.parent) && (s._zod.parent = n), s;
}
function re(n) {
  const a = n;
  if (!a)
    return {};
  if (typeof a == "string")
    return { error: () => a };
  if (a?.message !== void 0) {
    if (a?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    a.error = a.message;
  }
  return delete a.message, typeof a.error == "string" ? { ...a, error: () => a.error } : a;
}
function w1(n) {
  return Object.keys(n).filter((a) => n[a]._zod.optin === "optional" && n[a]._zod.optout === "optional");
}
const S1 = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function E1(n, a) {
  const o = n._zod.def, s = o.checks;
  if (s && s.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  const d = Da(n._zod.def, {
    get shape() {
      const _ = {};
      for (const m in a) {
        if (!(m in o.shape))
          throw new Error(`Unrecognized key: "${m}"`);
        a[m] && (_[m] = o.shape[m]);
      }
      return di(this, "shape", _), _;
    },
    checks: []
  });
  return ja(n, d);
}
function z1(n, a) {
  const o = n._zod.def, s = o.checks;
  if (s && s.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  const d = Da(n._zod.def, {
    get shape() {
      const _ = { ...n._zod.def.shape };
      for (const m in a) {
        if (!(m in o.shape))
          throw new Error(`Unrecognized key: "${m}"`);
        a[m] && delete _[m];
      }
      return di(this, "shape", _), _;
    },
    checks: []
  });
  return ja(n, d);
}
function k1(n, a) {
  if (!no(a))
    throw new Error("Invalid input to extend: expected a plain object");
  const o = n._zod.def.checks;
  if (o && o.length > 0) {
    const d = n._zod.def.shape;
    for (const _ in a)
      if (Object.getOwnPropertyDescriptor(d, _) !== void 0)
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  const l = Da(n._zod.def, {
    get shape() {
      const d = { ...n._zod.def.shape, ...a };
      return di(this, "shape", d), d;
    }
  });
  return ja(n, l);
}
function T1(n, a) {
  if (!no(a))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  const o = Da(n._zod.def, {
    get shape() {
      const s = { ...n._zod.def.shape, ...a };
      return di(this, "shape", s), s;
    }
  });
  return ja(n, o);
}
function A1(n, a) {
  const o = Da(n._zod.def, {
    get shape() {
      const s = { ...n._zod.def.shape, ...a._zod.def.shape };
      return di(this, "shape", s), s;
    },
    get catchall() {
      return a._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return ja(n, o);
}
function N1(n, a, o) {
  const l = a._zod.def.checks;
  if (l && l.length > 0)
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  const _ = Da(a._zod.def, {
    get shape() {
      const m = a._zod.def.shape, p = { ...m };
      if (o)
        for (const f in o) {
          if (!(f in m))
            throw new Error(`Unrecognized key: "${f}"`);
          o[f] && (p[f] = n ? new n({
            type: "optional",
            innerType: m[f]
          }) : m[f]);
        }
      else
        for (const f in m)
          p[f] = n ? new n({
            type: "optional",
            innerType: m[f]
          }) : m[f];
      return di(this, "shape", p), p;
    },
    checks: []
  });
  return ja(a, _);
}
function C1(n, a, o) {
  const s = Da(a._zod.def, {
    get shape() {
      const l = a._zod.def.shape, d = { ...l };
      if (o)
        for (const _ in o) {
          if (!(_ in d))
            throw new Error(`Unrecognized key: "${_}"`);
          o[_] && (d[_] = new n({
            type: "nonoptional",
            innerType: l[_]
          }));
        }
      else
        for (const _ in l)
          d[_] = new n({
            type: "nonoptional",
            innerType: l[_]
          });
      return di(this, "shape", d), d;
    }
  });
  return ja(a, s);
}
function Ji(n, a = 0) {
  if (n.aborted === !0)
    return !0;
  for (let o = a; o < n.issues.length; o++)
    if (n.issues[o]?.continue !== !0)
      return !0;
  return !1;
}
function eo(n, a) {
  return a.map((o) => {
    var s;
    return (s = o).path ?? (s.path = []), o.path.unshift(n), o;
  });
}
function Os(n) {
  return typeof n == "string" ? n : n?.message;
}
function Oa(n, a, o) {
  const s = { ...n, path: n.path ?? [] };
  if (!n.message) {
    const l = Os(n.inst?._zod.def?.error?.(n)) ?? Os(a?.error?.(n)) ?? Os(o.customError?.(n)) ?? Os(o.localeError?.(n)) ?? "Invalid input";
    s.message = l;
  }
  return delete s.inst, delete s.continue, a?.reportInput || delete s.input, s;
}
function ed(n) {
  return Array.isArray(n) ? "array" : typeof n == "string" ? "string" : "unknown";
}
function ar(...n) {
  const [a, o, s] = n;
  return typeof a == "string" ? {
    message: a,
    code: "custom",
    input: o,
    inst: s
  } : { ...a };
}
const nh = (n, a) => {
  n.name = "$ZodError", Object.defineProperty(n, "_zod", {
    value: n._zod,
    enumerable: !1
  }), Object.defineProperty(n, "issues", {
    value: a,
    enumerable: !1
  }), n.message = JSON.stringify(a, Ru, 2), Object.defineProperty(n, "toString", {
    value: () => n.message,
    enumerable: !1
  });
}, ah = B("$ZodError", nh), ih = B("$ZodError", nh, { Parent: Error });
function x1(n, a = (o) => o.message) {
  const o = {}, s = [];
  for (const l of n.issues)
    l.path.length > 0 ? (o[l.path[0]] = o[l.path[0]] || [], o[l.path[0]].push(a(l))) : s.push(a(l));
  return { formErrors: s, fieldErrors: o };
}
function M1(n, a = (o) => o.message) {
  const o = { _errors: [] }, s = (l) => {
    for (const d of l.issues)
      if (d.code === "invalid_union" && d.errors.length)
        d.errors.map((_) => s({ issues: _ }));
      else if (d.code === "invalid_key")
        s({ issues: d.issues });
      else if (d.code === "invalid_element")
        s({ issues: d.issues });
      else if (d.path.length === 0)
        o._errors.push(a(d));
      else {
        let _ = o, m = 0;
        for (; m < d.path.length; ) {
          const p = d.path[m];
          m === d.path.length - 1 ? (_[p] = _[p] || { _errors: [] }, _[p]._errors.push(a(d))) : _[p] = _[p] || { _errors: [] }, _ = _[p], m++;
        }
      }
  };
  return s(n), o;
}
const td = (n) => (a, o, s, l) => {
  const d = s ? Object.assign(s, { async: !1 }) : { async: !1 }, _ = a._zod.run({ value: o, issues: [] }, d);
  if (_ instanceof Promise)
    throw new to();
  if (_.issues.length) {
    const m = new (l?.Err ?? n)(_.issues.map((p) => Oa(p, d, Ma())));
    throw eh(m, l?.callee), m;
  }
  return _.value;
}, nd = (n) => async (a, o, s, l) => {
  const d = s ? Object.assign(s, { async: !0 }) : { async: !0 };
  let _ = a._zod.run({ value: o, issues: [] }, d);
  if (_ instanceof Promise && (_ = await _), _.issues.length) {
    const m = new (l?.Err ?? n)(_.issues.map((p) => Oa(p, d, Ma())));
    throw eh(m, l?.callee), m;
  }
  return _.value;
}, Fs = (n) => (a, o, s) => {
  const l = s ? { ...s, async: !1 } : { async: !1 }, d = a._zod.run({ value: o, issues: [] }, l);
  if (d instanceof Promise)
    throw new to();
  return d.issues.length ? {
    success: !1,
    error: new (n ?? ah)(d.issues.map((_) => Oa(_, l, Ma())))
  } : { success: !0, data: d.value };
}, O1 = /* @__PURE__ */ Fs(ih), Ws = (n) => async (a, o, s) => {
  const l = s ? Object.assign(s, { async: !0 }) : { async: !0 };
  let d = a._zod.run({ value: o, issues: [] }, l);
  return d instanceof Promise && (d = await d), d.issues.length ? {
    success: !1,
    error: new n(d.issues.map((_) => Oa(_, l, Ma())))
  } : { success: !0, data: d.value };
}, R1 = /* @__PURE__ */ Ws(ih), D1 = (n) => (a, o, s) => {
  const l = s ? Object.assign(s, { direction: "backward" }) : { direction: "backward" };
  return td(n)(a, o, l);
}, j1 = (n) => (a, o, s) => td(n)(a, o, s), L1 = (n) => async (a, o, s) => {
  const l = s ? Object.assign(s, { direction: "backward" }) : { direction: "backward" };
  return nd(n)(a, o, l);
}, U1 = (n) => async (a, o, s) => nd(n)(a, o, s), q1 = (n) => (a, o, s) => {
  const l = s ? Object.assign(s, { direction: "backward" }) : { direction: "backward" };
  return Fs(n)(a, o, l);
}, G1 = (n) => (a, o, s) => Fs(n)(a, o, s), I1 = (n) => async (a, o, s) => {
  const l = s ? Object.assign(s, { direction: "backward" }) : { direction: "backward" };
  return Ws(n)(a, o, l);
}, H1 = (n) => async (a, o, s) => Ws(n)(a, o, s), P1 = /^[cC][^\s-]{8,}$/, B1 = /^[0-9a-z]+$/, Z1 = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Y1 = /^[0-9a-vA-V]{20}$/, V1 = /^[A-Za-z0-9]{27}$/, K1 = /^[a-zA-Z0-9_-]{21}$/, X1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, F1 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Rp = (n) => n ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${n}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, W1 = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, $1 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Q1() {
  return new RegExp($1, "u");
}
const J1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, eS = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, tS = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, nS = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, aS = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, oh = /^[A-Za-z0-9_-]*$/, iS = /^\+[1-9]\d{6,14}$/, rh = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", oS = /* @__PURE__ */ new RegExp(`^${rh}$`);
function sh(n) {
  const a = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof n.precision == "number" ? n.precision === -1 ? `${a}` : n.precision === 0 ? `${a}:[0-5]\\d` : `${a}:[0-5]\\d\\.\\d{${n.precision}}` : `${a}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function rS(n) {
  return new RegExp(`^${sh(n)}$`);
}
function sS(n) {
  const a = sh({ precision: n.precision }), o = ["Z"];
  n.local && o.push(""), n.offset && o.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const s = `${a}(?:${o.join("|")})`;
  return new RegExp(`^${rh}T(?:${s})$`);
}
const lS = (n) => {
  const a = n ? `[\\s\\S]{${n?.minimum ?? 0},${n?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${a}$`);
}, cS = /^-?\d+$/, lh = /^-?\d+(?:\.\d+)?$/, uS = /^[^A-Z]*$/, dS = /^[^a-z]*$/, Bt = /* @__PURE__ */ B("$ZodCheck", (n, a) => {
  var o;
  n._zod ?? (n._zod = {}), n._zod.def = a, (o = n._zod).onattach ?? (o.onattach = []);
}), ch = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, uh = /* @__PURE__ */ B("$ZodCheckLessThan", (n, a) => {
  Bt.init(n, a);
  const o = ch[typeof a.value];
  n._zod.onattach.push((s) => {
    const l = s._zod.bag, d = (a.inclusive ? l.maximum : l.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    a.value < d && (a.inclusive ? l.maximum = a.value : l.exclusiveMaximum = a.value);
  }), n._zod.check = (s) => {
    (a.inclusive ? s.value <= a.value : s.value < a.value) || s.issues.push({
      origin: o,
      code: "too_big",
      maximum: typeof a.value == "object" ? a.value.getTime() : a.value,
      input: s.value,
      inclusive: a.inclusive,
      inst: n,
      continue: !a.abort
    });
  };
}), dh = /* @__PURE__ */ B("$ZodCheckGreaterThan", (n, a) => {
  Bt.init(n, a);
  const o = ch[typeof a.value];
  n._zod.onattach.push((s) => {
    const l = s._zod.bag, d = (a.inclusive ? l.minimum : l.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    a.value > d && (a.inclusive ? l.minimum = a.value : l.exclusiveMinimum = a.value);
  }), n._zod.check = (s) => {
    (a.inclusive ? s.value >= a.value : s.value > a.value) || s.issues.push({
      origin: o,
      code: "too_small",
      minimum: typeof a.value == "object" ? a.value.getTime() : a.value,
      input: s.value,
      inclusive: a.inclusive,
      inst: n,
      continue: !a.abort
    });
  };
}), _S = /* @__PURE__ */ B("$ZodCheckMultipleOf", (n, a) => {
  Bt.init(n, a), n._zod.onattach.push((o) => {
    var s;
    (s = o._zod.bag).multipleOf ?? (s.multipleOf = a.value);
  }), n._zod.check = (o) => {
    if (typeof o.value != typeof a.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof o.value == "bigint" ? o.value % a.value === BigInt(0) : h1(o.value, a.value) === 0) || o.issues.push({
      origin: typeof o.value,
      code: "not_multiple_of",
      divisor: a.value,
      input: o.value,
      inst: n,
      continue: !a.abort
    });
  };
}), mS = /* @__PURE__ */ B("$ZodCheckNumberFormat", (n, a) => {
  Bt.init(n, a), a.format = a.format || "float64";
  const o = a.format?.includes("int"), s = o ? "int" : "number", [l, d] = S1[a.format];
  n._zod.onattach.push((_) => {
    const m = _._zod.bag;
    m.format = a.format, m.minimum = l, m.maximum = d, o && (m.pattern = cS);
  }), n._zod.check = (_) => {
    const m = _.value;
    if (o) {
      if (!Number.isInteger(m)) {
        _.issues.push({
          expected: s,
          format: a.format,
          code: "invalid_type",
          continue: !1,
          input: m,
          inst: n
        });
        return;
      }
      if (!Number.isSafeInteger(m)) {
        m > 0 ? _.issues.push({
          input: m,
          code: "too_big",
          maximum: Number.MAX_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: n,
          origin: s,
          inclusive: !0,
          continue: !a.abort
        }) : _.issues.push({
          input: m,
          code: "too_small",
          minimum: Number.MIN_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: n,
          origin: s,
          inclusive: !0,
          continue: !a.abort
        });
        return;
      }
    }
    m < l && _.issues.push({
      origin: "number",
      input: m,
      code: "too_small",
      minimum: l,
      inclusive: !0,
      inst: n,
      continue: !a.abort
    }), m > d && _.issues.push({
      origin: "number",
      input: m,
      code: "too_big",
      maximum: d,
      inclusive: !0,
      inst: n,
      continue: !a.abort
    });
  };
}), fS = /* @__PURE__ */ B("$ZodCheckMaxLength", (n, a) => {
  var o;
  Bt.init(n, a), (o = n._zod.def).when ?? (o.when = (s) => {
    const l = s.value;
    return !Qu(l) && l.length !== void 0;
  }), n._zod.onattach.push((s) => {
    const l = s._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    a.maximum < l && (s._zod.bag.maximum = a.maximum);
  }), n._zod.check = (s) => {
    const l = s.value;
    if (l.length <= a.maximum)
      return;
    const _ = ed(l);
    s.issues.push({
      origin: _,
      code: "too_big",
      maximum: a.maximum,
      inclusive: !0,
      input: l,
      inst: n,
      continue: !a.abort
    });
  };
}), pS = /* @__PURE__ */ B("$ZodCheckMinLength", (n, a) => {
  var o;
  Bt.init(n, a), (o = n._zod.def).when ?? (o.when = (s) => {
    const l = s.value;
    return !Qu(l) && l.length !== void 0;
  }), n._zod.onattach.push((s) => {
    const l = s._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    a.minimum > l && (s._zod.bag.minimum = a.minimum);
  }), n._zod.check = (s) => {
    const l = s.value;
    if (l.length >= a.minimum)
      return;
    const _ = ed(l);
    s.issues.push({
      origin: _,
      code: "too_small",
      minimum: a.minimum,
      inclusive: !0,
      input: l,
      inst: n,
      continue: !a.abort
    });
  };
}), gS = /* @__PURE__ */ B("$ZodCheckLengthEquals", (n, a) => {
  var o;
  Bt.init(n, a), (o = n._zod.def).when ?? (o.when = (s) => {
    const l = s.value;
    return !Qu(l) && l.length !== void 0;
  }), n._zod.onattach.push((s) => {
    const l = s._zod.bag;
    l.minimum = a.length, l.maximum = a.length, l.length = a.length;
  }), n._zod.check = (s) => {
    const l = s.value, d = l.length;
    if (d === a.length)
      return;
    const _ = ed(l), m = d > a.length;
    s.issues.push({
      origin: _,
      ...m ? { code: "too_big", maximum: a.length } : { code: "too_small", minimum: a.length },
      inclusive: !0,
      exact: !0,
      input: s.value,
      inst: n,
      continue: !a.abort
    });
  };
}), $s = /* @__PURE__ */ B("$ZodCheckStringFormat", (n, a) => {
  var o, s;
  Bt.init(n, a), n._zod.onattach.push((l) => {
    const d = l._zod.bag;
    d.format = a.format, a.pattern && (d.patterns ?? (d.patterns = /* @__PURE__ */ new Set()), d.patterns.add(a.pattern));
  }), a.pattern ? (o = n._zod).check ?? (o.check = (l) => {
    a.pattern.lastIndex = 0, !a.pattern.test(l.value) && l.issues.push({
      origin: "string",
      code: "invalid_format",
      format: a.format,
      input: l.value,
      ...a.pattern ? { pattern: a.pattern.toString() } : {},
      inst: n,
      continue: !a.abort
    });
  }) : (s = n._zod).check ?? (s.check = () => {
  });
}), hS = /* @__PURE__ */ B("$ZodCheckRegex", (n, a) => {
  $s.init(n, a), n._zod.check = (o) => {
    a.pattern.lastIndex = 0, !a.pattern.test(o.value) && o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: o.value,
      pattern: a.pattern.toString(),
      inst: n,
      continue: !a.abort
    });
  };
}), vS = /* @__PURE__ */ B("$ZodCheckLowerCase", (n, a) => {
  a.pattern ?? (a.pattern = uS), $s.init(n, a);
}), yS = /* @__PURE__ */ B("$ZodCheckUpperCase", (n, a) => {
  a.pattern ?? (a.pattern = dS), $s.init(n, a);
}), bS = /* @__PURE__ */ B("$ZodCheckIncludes", (n, a) => {
  Bt.init(n, a);
  const o = ao(a.includes), s = new RegExp(typeof a.position == "number" ? `^.{${a.position}}${o}` : o);
  a.pattern = s, n._zod.onattach.push((l) => {
    const d = l._zod.bag;
    d.patterns ?? (d.patterns = /* @__PURE__ */ new Set()), d.patterns.add(s);
  }), n._zod.check = (l) => {
    l.value.includes(a.includes, a.position) || l.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: a.includes,
      input: l.value,
      inst: n,
      continue: !a.abort
    });
  };
}), wS = /* @__PURE__ */ B("$ZodCheckStartsWith", (n, a) => {
  Bt.init(n, a);
  const o = new RegExp(`^${ao(a.prefix)}.*`);
  a.pattern ?? (a.pattern = o), n._zod.onattach.push((s) => {
    const l = s._zod.bag;
    l.patterns ?? (l.patterns = /* @__PURE__ */ new Set()), l.patterns.add(o);
  }), n._zod.check = (s) => {
    s.value.startsWith(a.prefix) || s.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: a.prefix,
      input: s.value,
      inst: n,
      continue: !a.abort
    });
  };
}), SS = /* @__PURE__ */ B("$ZodCheckEndsWith", (n, a) => {
  Bt.init(n, a);
  const o = new RegExp(`.*${ao(a.suffix)}$`);
  a.pattern ?? (a.pattern = o), n._zod.onattach.push((s) => {
    const l = s._zod.bag;
    l.patterns ?? (l.patterns = /* @__PURE__ */ new Set()), l.patterns.add(o);
  }), n._zod.check = (s) => {
    s.value.endsWith(a.suffix) || s.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: a.suffix,
      input: s.value,
      inst: n,
      continue: !a.abort
    });
  };
}), ES = /* @__PURE__ */ B("$ZodCheckOverwrite", (n, a) => {
  Bt.init(n, a), n._zod.check = (o) => {
    o.value = a.tx(o.value);
  };
});
class zS {
  constructor(a = []) {
    this.content = [], this.indent = 0, this && (this.args = a);
  }
  indented(a) {
    this.indent += 1, a(this), this.indent -= 1;
  }
  write(a) {
    if (typeof a == "function") {
      a(this, { execution: "sync" }), a(this, { execution: "async" });
      return;
    }
    const s = a.split(`
`).filter((_) => _), l = Math.min(...s.map((_) => _.length - _.trimStart().length)), d = s.map((_) => _.slice(l)).map((_) => " ".repeat(this.indent * 2) + _);
    for (const _ of d)
      this.content.push(_);
  }
  compile() {
    const a = Function, o = this?.args, l = [...(this?.content ?? [""]).map((d) => `  ${d}`)];
    return new a(...o, l.join(`
`));
  }
}
const kS = {
  major: 4,
  minor: 3,
  patch: 6
}, et = /* @__PURE__ */ B("$ZodType", (n, a) => {
  var o;
  n ?? (n = {}), n._zod.def = a, n._zod.bag = n._zod.bag || {}, n._zod.version = kS;
  const s = [...n._zod.def.checks ?? []];
  n._zod.traits.has("$ZodCheck") && s.unshift(n);
  for (const l of s)
    for (const d of l._zod.onattach)
      d(n);
  if (s.length === 0)
    (o = n._zod).deferred ?? (o.deferred = []), n._zod.deferred?.push(() => {
      n._zod.run = n._zod.parse;
    });
  else {
    const l = (_, m, p) => {
      let f = Ji(_), v;
      for (const y of m) {
        if (y._zod.def.when) {
          if (!y._zod.def.when(_))
            continue;
        } else if (f)
          continue;
        const w = _.issues.length, E = y._zod.check(_);
        if (E instanceof Promise && p?.async === !1)
          throw new to();
        if (v || E instanceof Promise)
          v = (v ?? Promise.resolve()).then(async () => {
            await E, _.issues.length !== w && (f || (f = Ji(_, w)));
          });
        else {
          if (_.issues.length === w)
            continue;
          f || (f = Ji(_, w));
        }
      }
      return v ? v.then(() => _) : _;
    }, d = (_, m, p) => {
      if (Ji(_))
        return _.aborted = !0, _;
      const f = l(m, s, p);
      if (f instanceof Promise) {
        if (p.async === !1)
          throw new to();
        return f.then((v) => n._zod.parse(v, p));
      }
      return n._zod.parse(f, p);
    };
    n._zod.run = (_, m) => {
      if (m.skipChecks)
        return n._zod.parse(_, m);
      if (m.direction === "backward") {
        const f = n._zod.parse({ value: _.value, issues: [] }, { ...m, skipChecks: !0 });
        return f instanceof Promise ? f.then((v) => d(v, _, m)) : d(f, _, m);
      }
      const p = n._zod.parse(_, m);
      if (p instanceof Promise) {
        if (m.async === !1)
          throw new to();
        return p.then((f) => l(f, s, m));
      }
      return l(p, s, m);
    };
  }
  Ge(n, "~standard", () => ({
    validate: (l) => {
      try {
        const d = O1(n, l);
        return d.success ? { value: d.data } : { issues: d.error?.issues };
      } catch {
        return R1(n, l).then((_) => _.success ? { value: _.data } : { issues: _.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
}), ad = /* @__PURE__ */ B("$ZodString", (n, a) => {
  et.init(n, a), n._zod.pattern = [...n?._zod.bag?.patterns ?? []].pop() ?? lS(n._zod.bag), n._zod.parse = (o, s) => {
    if (a.coerce)
      try {
        o.value = String(o.value);
      } catch {
      }
    return typeof o.value == "string" || o.issues.push({
      expected: "string",
      code: "invalid_type",
      input: o.value,
      inst: n
    }), o;
  };
}), Fe = /* @__PURE__ */ B("$ZodStringFormat", (n, a) => {
  $s.init(n, a), ad.init(n, a);
}), TS = /* @__PURE__ */ B("$ZodGUID", (n, a) => {
  a.pattern ?? (a.pattern = F1), Fe.init(n, a);
}), AS = /* @__PURE__ */ B("$ZodUUID", (n, a) => {
  if (a.version) {
    const s = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[a.version];
    if (s === void 0)
      throw new Error(`Invalid UUID version: "${a.version}"`);
    a.pattern ?? (a.pattern = Rp(s));
  } else
    a.pattern ?? (a.pattern = Rp());
  Fe.init(n, a);
}), NS = /* @__PURE__ */ B("$ZodEmail", (n, a) => {
  a.pattern ?? (a.pattern = W1), Fe.init(n, a);
}), CS = /* @__PURE__ */ B("$ZodURL", (n, a) => {
  Fe.init(n, a), n._zod.check = (o) => {
    try {
      const s = o.value.trim(), l = new URL(s);
      a.hostname && (a.hostname.lastIndex = 0, a.hostname.test(l.hostname) || o.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: a.hostname.source,
        input: o.value,
        inst: n,
        continue: !a.abort
      })), a.protocol && (a.protocol.lastIndex = 0, a.protocol.test(l.protocol.endsWith(":") ? l.protocol.slice(0, -1) : l.protocol) || o.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: a.protocol.source,
        input: o.value,
        inst: n,
        continue: !a.abort
      })), a.normalize ? o.value = l.href : o.value = s;
      return;
    } catch {
      o.issues.push({
        code: "invalid_format",
        format: "url",
        input: o.value,
        inst: n,
        continue: !a.abort
      });
    }
  };
}), xS = /* @__PURE__ */ B("$ZodEmoji", (n, a) => {
  a.pattern ?? (a.pattern = Q1()), Fe.init(n, a);
}), MS = /* @__PURE__ */ B("$ZodNanoID", (n, a) => {
  a.pattern ?? (a.pattern = K1), Fe.init(n, a);
}), OS = /* @__PURE__ */ B("$ZodCUID", (n, a) => {
  a.pattern ?? (a.pattern = P1), Fe.init(n, a);
}), RS = /* @__PURE__ */ B("$ZodCUID2", (n, a) => {
  a.pattern ?? (a.pattern = B1), Fe.init(n, a);
}), DS = /* @__PURE__ */ B("$ZodULID", (n, a) => {
  a.pattern ?? (a.pattern = Z1), Fe.init(n, a);
}), jS = /* @__PURE__ */ B("$ZodXID", (n, a) => {
  a.pattern ?? (a.pattern = Y1), Fe.init(n, a);
}), LS = /* @__PURE__ */ B("$ZodKSUID", (n, a) => {
  a.pattern ?? (a.pattern = V1), Fe.init(n, a);
}), US = /* @__PURE__ */ B("$ZodISODateTime", (n, a) => {
  a.pattern ?? (a.pattern = sS(a)), Fe.init(n, a);
}), qS = /* @__PURE__ */ B("$ZodISODate", (n, a) => {
  a.pattern ?? (a.pattern = oS), Fe.init(n, a);
}), GS = /* @__PURE__ */ B("$ZodISOTime", (n, a) => {
  a.pattern ?? (a.pattern = rS(a)), Fe.init(n, a);
}), IS = /* @__PURE__ */ B("$ZodISODuration", (n, a) => {
  a.pattern ?? (a.pattern = X1), Fe.init(n, a);
}), HS = /* @__PURE__ */ B("$ZodIPv4", (n, a) => {
  a.pattern ?? (a.pattern = J1), Fe.init(n, a), n._zod.bag.format = "ipv4";
}), PS = /* @__PURE__ */ B("$ZodIPv6", (n, a) => {
  a.pattern ?? (a.pattern = eS), Fe.init(n, a), n._zod.bag.format = "ipv6", n._zod.check = (o) => {
    try {
      new URL(`http://[${o.value}]`);
    } catch {
      o.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: o.value,
        inst: n,
        continue: !a.abort
      });
    }
  };
}), BS = /* @__PURE__ */ B("$ZodCIDRv4", (n, a) => {
  a.pattern ?? (a.pattern = tS), Fe.init(n, a);
}), ZS = /* @__PURE__ */ B("$ZodCIDRv6", (n, a) => {
  a.pattern ?? (a.pattern = nS), Fe.init(n, a), n._zod.check = (o) => {
    const s = o.value.split("/");
    try {
      if (s.length !== 2)
        throw new Error();
      const [l, d] = s;
      if (!d)
        throw new Error();
      const _ = Number(d);
      if (`${_}` !== d)
        throw new Error();
      if (_ < 0 || _ > 128)
        throw new Error();
      new URL(`http://[${l}]`);
    } catch {
      o.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: o.value,
        inst: n,
        continue: !a.abort
      });
    }
  };
});
function _h(n) {
  if (n === "")
    return !0;
  if (n.length % 4 !== 0)
    return !1;
  try {
    return atob(n), !0;
  } catch {
    return !1;
  }
}
const YS = /* @__PURE__ */ B("$ZodBase64", (n, a) => {
  a.pattern ?? (a.pattern = aS), Fe.init(n, a), n._zod.bag.contentEncoding = "base64", n._zod.check = (o) => {
    _h(o.value) || o.issues.push({
      code: "invalid_format",
      format: "base64",
      input: o.value,
      inst: n,
      continue: !a.abort
    });
  };
});
function VS(n) {
  if (!oh.test(n))
    return !1;
  const a = n.replace(/[-_]/g, (s) => s === "-" ? "+" : "/"), o = a.padEnd(Math.ceil(a.length / 4) * 4, "=");
  return _h(o);
}
const KS = /* @__PURE__ */ B("$ZodBase64URL", (n, a) => {
  a.pattern ?? (a.pattern = oh), Fe.init(n, a), n._zod.bag.contentEncoding = "base64url", n._zod.check = (o) => {
    VS(o.value) || o.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: o.value,
      inst: n,
      continue: !a.abort
    });
  };
}), XS = /* @__PURE__ */ B("$ZodE164", (n, a) => {
  a.pattern ?? (a.pattern = iS), Fe.init(n, a);
});
function FS(n, a = null) {
  try {
    const o = n.split(".");
    if (o.length !== 3)
      return !1;
    const [s] = o;
    if (!s)
      return !1;
    const l = JSON.parse(atob(s));
    return !("typ" in l && l?.typ !== "JWT" || !l.alg || a && (!("alg" in l) || l.alg !== a));
  } catch {
    return !1;
  }
}
const WS = /* @__PURE__ */ B("$ZodJWT", (n, a) => {
  Fe.init(n, a), n._zod.check = (o) => {
    FS(o.value, a.alg) || o.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: o.value,
      inst: n,
      continue: !a.abort
    });
  };
}), mh = /* @__PURE__ */ B("$ZodNumber", (n, a) => {
  et.init(n, a), n._zod.pattern = n._zod.bag.pattern ?? lh, n._zod.parse = (o, s) => {
    if (a.coerce)
      try {
        o.value = Number(o.value);
      } catch {
      }
    const l = o.value;
    if (typeof l == "number" && !Number.isNaN(l) && Number.isFinite(l))
      return o;
    const d = typeof l == "number" ? Number.isNaN(l) ? "NaN" : Number.isFinite(l) ? void 0 : "Infinity" : void 0;
    return o.issues.push({
      expected: "number",
      code: "invalid_type",
      input: l,
      inst: n,
      ...d ? { received: d } : {}
    }), o;
  };
}), $S = /* @__PURE__ */ B("$ZodNumberFormat", (n, a) => {
  mS.init(n, a), mh.init(n, a);
}), QS = /* @__PURE__ */ B("$ZodUnknown", (n, a) => {
  et.init(n, a), n._zod.parse = (o) => o;
}), JS = /* @__PURE__ */ B("$ZodNever", (n, a) => {
  et.init(n, a), n._zod.parse = (o, s) => (o.issues.push({
    expected: "never",
    code: "invalid_type",
    input: o.value,
    inst: n
  }), o);
});
function Dp(n, a, o) {
  n.issues.length && a.issues.push(...eo(o, n.issues)), a.value[o] = n.value;
}
const eE = /* @__PURE__ */ B("$ZodArray", (n, a) => {
  et.init(n, a), n._zod.parse = (o, s) => {
    const l = o.value;
    if (!Array.isArray(l))
      return o.issues.push({
        expected: "array",
        code: "invalid_type",
        input: l,
        inst: n
      }), o;
    o.value = Array(l.length);
    const d = [];
    for (let _ = 0; _ < l.length; _++) {
      const m = l[_], p = a.element._zod.run({
        value: m,
        issues: []
      }, s);
      p instanceof Promise ? d.push(p.then((f) => Dp(f, o, _))) : Dp(p, o, _);
    }
    return d.length ? Promise.all(d).then(() => o) : o;
  };
});
function Bs(n, a, o, s, l) {
  if (n.issues.length) {
    if (l && !(o in s))
      return;
    a.issues.push(...eo(o, n.issues));
  }
  n.value === void 0 ? o in s && (a.value[o] = void 0) : a.value[o] = n.value;
}
function fh(n) {
  const a = Object.keys(n.shape);
  for (const s of a)
    if (!n.shape?.[s]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${s}": expected a Zod schema`);
  const o = w1(n.shape);
  return {
    ...n,
    keys: a,
    keySet: new Set(a),
    numKeys: a.length,
    optionalKeys: new Set(o)
  };
}
function ph(n, a, o, s, l, d) {
  const _ = [], m = l.keySet, p = l.catchall._zod, f = p.def.type, v = p.optout === "optional";
  for (const y in a) {
    if (m.has(y))
      continue;
    if (f === "never") {
      _.push(y);
      continue;
    }
    const w = p.run({ value: a[y], issues: [] }, s);
    w instanceof Promise ? n.push(w.then((E) => Bs(E, o, y, a, v))) : Bs(w, o, y, a, v);
  }
  return _.length && o.issues.push({
    code: "unrecognized_keys",
    keys: _,
    input: a,
    inst: d
  }), n.length ? Promise.all(n).then(() => o) : o;
}
const tE = /* @__PURE__ */ B("$ZodObject", (n, a) => {
  if (et.init(n, a), !Object.getOwnPropertyDescriptor(a, "shape")?.get) {
    const m = a.shape;
    Object.defineProperty(a, "shape", {
      get: () => {
        const p = { ...m };
        return Object.defineProperty(a, "shape", {
          value: p
        }), p;
      }
    });
  }
  const s = $u(() => fh(a));
  Ge(n._zod, "propValues", () => {
    const m = a.shape, p = {};
    for (const f in m) {
      const v = m[f]._zod;
      if (v.values) {
        p[f] ?? (p[f] = /* @__PURE__ */ new Set());
        for (const y of v.values)
          p[f].add(y);
      }
    }
    return p;
  });
  const l = Ps, d = a.catchall;
  let _;
  n._zod.parse = (m, p) => {
    _ ?? (_ = s.value);
    const f = m.value;
    if (!l(f))
      return m.issues.push({
        expected: "object",
        code: "invalid_type",
        input: f,
        inst: n
      }), m;
    m.value = {};
    const v = [], y = _.shape;
    for (const w of _.keys) {
      const E = y[w], z = E._zod.optout === "optional", N = E._zod.run({ value: f[w], issues: [] }, p);
      N instanceof Promise ? v.push(N.then((j) => Bs(j, m, w, f, z))) : Bs(N, m, w, f, z);
    }
    return d ? ph(v, f, m, p, s.value, n) : v.length ? Promise.all(v).then(() => m) : m;
  };
}), nE = /* @__PURE__ */ B("$ZodObjectJIT", (n, a) => {
  tE.init(n, a);
  const o = n._zod.parse, s = $u(() => fh(a)), l = (w) => {
    const E = new zS(["shape", "payload", "ctx"]), z = s.value, N = (Y) => {
      const P = Op(Y);
      return `shape[${P}]._zod.run({ value: input[${P}], issues: [] }, ctx)`;
    };
    E.write("const input = payload.value;");
    const j = /* @__PURE__ */ Object.create(null);
    let R = 0;
    for (const Y of z.keys)
      j[Y] = `key_${R++}`;
    E.write("const newResult = {};");
    for (const Y of z.keys) {
      const P = j[Y], I = Op(Y), V = w[Y]?._zod?.optout === "optional";
      E.write(`const ${P} = ${N(Y)};`), V ? E.write(`
        if (${P}.issues.length) {
          if (${I} in input) {
            payload.issues = payload.issues.concat(${P}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${I}, ...iss.path] : [${I}]
            })));
          }
        }
        
        if (${P}.value === undefined) {
          if (${I} in input) {
            newResult[${I}] = undefined;
          }
        } else {
          newResult[${I}] = ${P}.value;
        }
        
      `) : E.write(`
        if (${P}.issues.length) {
          payload.issues = payload.issues.concat(${P}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${I}, ...iss.path] : [${I}]
          })));
        }
        
        if (${P}.value === undefined) {
          if (${I} in input) {
            newResult[${I}] = undefined;
          }
        } else {
          newResult[${I}] = ${P}.value;
        }
        
      `);
    }
    E.write("payload.value = newResult;"), E.write("return payload;");
    const U = E.compile();
    return (Y, P) => U(w, Y, P);
  };
  let d;
  const _ = Ps, m = !Qg.jitless, f = m && y1.value, v = a.catchall;
  let y;
  n._zod.parse = (w, E) => {
    y ?? (y = s.value);
    const z = w.value;
    return _(z) ? m && f && E?.async === !1 && E.jitless !== !0 ? (d || (d = l(a.shape)), w = d(w, E), v ? ph([], z, w, E, y, n) : w) : o(w, E) : (w.issues.push({
      expected: "object",
      code: "invalid_type",
      input: z,
      inst: n
    }), w);
  };
});
function jp(n, a, o, s) {
  for (const d of n)
    if (d.issues.length === 0)
      return a.value = d.value, a;
  const l = n.filter((d) => !Ji(d));
  return l.length === 1 ? (a.value = l[0].value, l[0]) : (a.issues.push({
    code: "invalid_union",
    input: a.value,
    inst: o,
    errors: n.map((d) => d.issues.map((_) => Oa(_, s, Ma())))
  }), a);
}
const aE = /* @__PURE__ */ B("$ZodUnion", (n, a) => {
  et.init(n, a), Ge(n._zod, "optin", () => a.options.some((l) => l._zod.optin === "optional") ? "optional" : void 0), Ge(n._zod, "optout", () => a.options.some((l) => l._zod.optout === "optional") ? "optional" : void 0), Ge(n._zod, "values", () => {
    if (a.options.every((l) => l._zod.values))
      return new Set(a.options.flatMap((l) => Array.from(l._zod.values)));
  }), Ge(n._zod, "pattern", () => {
    if (a.options.every((l) => l._zod.pattern)) {
      const l = a.options.map((d) => d._zod.pattern);
      return new RegExp(`^(${l.map((d) => Ju(d.source)).join("|")})$`);
    }
  });
  const o = a.options.length === 1, s = a.options[0]._zod.run;
  n._zod.parse = (l, d) => {
    if (o)
      return s(l, d);
    let _ = !1;
    const m = [];
    for (const p of a.options) {
      const f = p._zod.run({
        value: l.value,
        issues: []
      }, d);
      if (f instanceof Promise)
        m.push(f), _ = !0;
      else {
        if (f.issues.length === 0)
          return f;
        m.push(f);
      }
    }
    return _ ? Promise.all(m).then((p) => jp(p, l, n, d)) : jp(m, l, n, d);
  };
}), iE = /* @__PURE__ */ B("$ZodIntersection", (n, a) => {
  et.init(n, a), n._zod.parse = (o, s) => {
    const l = o.value, d = a.left._zod.run({ value: l, issues: [] }, s), _ = a.right._zod.run({ value: l, issues: [] }, s);
    return d instanceof Promise || _ instanceof Promise ? Promise.all([d, _]).then(([p, f]) => Lp(o, p, f)) : Lp(o, d, _);
  };
});
function Du(n, a) {
  if (n === a)
    return { valid: !0, data: n };
  if (n instanceof Date && a instanceof Date && +n == +a)
    return { valid: !0, data: n };
  if (no(n) && no(a)) {
    const o = Object.keys(a), s = Object.keys(n).filter((d) => o.indexOf(d) !== -1), l = { ...n, ...a };
    for (const d of s) {
      const _ = Du(n[d], a[d]);
      if (!_.valid)
        return {
          valid: !1,
          mergeErrorPath: [d, ..._.mergeErrorPath]
        };
      l[d] = _.data;
    }
    return { valid: !0, data: l };
  }
  if (Array.isArray(n) && Array.isArray(a)) {
    if (n.length !== a.length)
      return { valid: !1, mergeErrorPath: [] };
    const o = [];
    for (let s = 0; s < n.length; s++) {
      const l = n[s], d = a[s], _ = Du(l, d);
      if (!_.valid)
        return {
          valid: !1,
          mergeErrorPath: [s, ..._.mergeErrorPath]
        };
      o.push(_.data);
    }
    return { valid: !0, data: o };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Lp(n, a, o) {
  const s = /* @__PURE__ */ new Map();
  let l;
  for (const m of a.issues)
    if (m.code === "unrecognized_keys") {
      l ?? (l = m);
      for (const p of m.keys)
        s.has(p) || s.set(p, {}), s.get(p).l = !0;
    } else
      n.issues.push(m);
  for (const m of o.issues)
    if (m.code === "unrecognized_keys")
      for (const p of m.keys)
        s.has(p) || s.set(p, {}), s.get(p).r = !0;
    else
      n.issues.push(m);
  const d = [...s].filter(([, m]) => m.l && m.r).map(([m]) => m);
  if (d.length && l && n.issues.push({ ...l, keys: d }), Ji(n))
    return n;
  const _ = Du(a.value, o.value);
  if (!_.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(_.mergeErrorPath)}`);
  return n.value = _.data, n;
}
const oE = /* @__PURE__ */ B("$ZodRecord", (n, a) => {
  et.init(n, a), n._zod.parse = (o, s) => {
    const l = o.value;
    if (!no(l))
      return o.issues.push({
        expected: "record",
        code: "invalid_type",
        input: l,
        inst: n
      }), o;
    const d = [], _ = a.keyType._zod.values;
    if (_) {
      o.value = {};
      const m = /* @__PURE__ */ new Set();
      for (const f of _)
        if (typeof f == "string" || typeof f == "number" || typeof f == "symbol") {
          m.add(typeof f == "number" ? f.toString() : f);
          const v = a.valueType._zod.run({ value: l[f], issues: [] }, s);
          v instanceof Promise ? d.push(v.then((y) => {
            y.issues.length && o.issues.push(...eo(f, y.issues)), o.value[f] = y.value;
          })) : (v.issues.length && o.issues.push(...eo(f, v.issues)), o.value[f] = v.value);
        }
      let p;
      for (const f in l)
        m.has(f) || (p = p ?? [], p.push(f));
      p && p.length > 0 && o.issues.push({
        code: "unrecognized_keys",
        input: l,
        inst: n,
        keys: p
      });
    } else {
      o.value = {};
      for (const m of Reflect.ownKeys(l)) {
        if (m === "__proto__")
          continue;
        let p = a.keyType._zod.run({ value: m, issues: [] }, s);
        if (p instanceof Promise)
          throw new Error("Async schemas not supported in object keys currently");
        if (typeof m == "string" && lh.test(m) && p.issues.length) {
          const y = a.keyType._zod.run({ value: Number(m), issues: [] }, s);
          if (y instanceof Promise)
            throw new Error("Async schemas not supported in object keys currently");
          y.issues.length === 0 && (p = y);
        }
        if (p.issues.length) {
          a.mode === "loose" ? o.value[m] = l[m] : o.issues.push({
            code: "invalid_key",
            origin: "record",
            issues: p.issues.map((y) => Oa(y, s, Ma())),
            input: m,
            path: [m],
            inst: n
          });
          continue;
        }
        const v = a.valueType._zod.run({ value: l[m], issues: [] }, s);
        v instanceof Promise ? d.push(v.then((y) => {
          y.issues.length && o.issues.push(...eo(m, y.issues)), o.value[p.value] = y.value;
        })) : (v.issues.length && o.issues.push(...eo(m, v.issues)), o.value[p.value] = v.value);
      }
    }
    return d.length ? Promise.all(d).then(() => o) : o;
  };
}), rE = /* @__PURE__ */ B("$ZodEnum", (n, a) => {
  et.init(n, a);
  const o = Jg(a.entries), s = new Set(o);
  n._zod.values = s, n._zod.pattern = new RegExp(`^(${o.filter((l) => b1.has(typeof l)).map((l) => typeof l == "string" ? ao(l) : l.toString()).join("|")})$`), n._zod.parse = (l, d) => {
    const _ = l.value;
    return s.has(_) || l.issues.push({
      code: "invalid_value",
      values: o,
      input: _,
      inst: n
    }), l;
  };
}), sE = /* @__PURE__ */ B("$ZodLiteral", (n, a) => {
  if (et.init(n, a), a.values.length === 0)
    throw new Error("Cannot create literal schema with no valid values");
  const o = new Set(a.values);
  n._zod.values = o, n._zod.pattern = new RegExp(`^(${a.values.map((s) => typeof s == "string" ? ao(s) : s ? ao(s.toString()) : String(s)).join("|")})$`), n._zod.parse = (s, l) => {
    const d = s.value;
    return o.has(d) || s.issues.push({
      code: "invalid_value",
      values: a.values,
      input: d,
      inst: n
    }), s;
  };
}), lE = /* @__PURE__ */ B("$ZodTransform", (n, a) => {
  et.init(n, a), n._zod.parse = (o, s) => {
    if (s.direction === "backward")
      throw new $g(n.constructor.name);
    const l = a.transform(o.value, o);
    if (s.async)
      return (l instanceof Promise ? l : Promise.resolve(l)).then((_) => (o.value = _, o));
    if (l instanceof Promise)
      throw new to();
    return o.value = l, o;
  };
});
function Up(n, a) {
  return n.issues.length && a === void 0 ? { issues: [], value: void 0 } : n;
}
const gh = /* @__PURE__ */ B("$ZodOptional", (n, a) => {
  et.init(n, a), n._zod.optin = "optional", n._zod.optout = "optional", Ge(n._zod, "values", () => a.innerType._zod.values ? /* @__PURE__ */ new Set([...a.innerType._zod.values, void 0]) : void 0), Ge(n._zod, "pattern", () => {
    const o = a.innerType._zod.pattern;
    return o ? new RegExp(`^(${Ju(o.source)})?$`) : void 0;
  }), n._zod.parse = (o, s) => {
    if (a.innerType._zod.optin === "optional") {
      const l = a.innerType._zod.run(o, s);
      return l instanceof Promise ? l.then((d) => Up(d, o.value)) : Up(l, o.value);
    }
    return o.value === void 0 ? o : a.innerType._zod.run(o, s);
  };
}), cE = /* @__PURE__ */ B("$ZodExactOptional", (n, a) => {
  gh.init(n, a), Ge(n._zod, "values", () => a.innerType._zod.values), Ge(n._zod, "pattern", () => a.innerType._zod.pattern), n._zod.parse = (o, s) => a.innerType._zod.run(o, s);
}), uE = /* @__PURE__ */ B("$ZodNullable", (n, a) => {
  et.init(n, a), Ge(n._zod, "optin", () => a.innerType._zod.optin), Ge(n._zod, "optout", () => a.innerType._zod.optout), Ge(n._zod, "pattern", () => {
    const o = a.innerType._zod.pattern;
    return o ? new RegExp(`^(${Ju(o.source)}|null)$`) : void 0;
  }), Ge(n._zod, "values", () => a.innerType._zod.values ? /* @__PURE__ */ new Set([...a.innerType._zod.values, null]) : void 0), n._zod.parse = (o, s) => o.value === null ? o : a.innerType._zod.run(o, s);
}), dE = /* @__PURE__ */ B("$ZodDefault", (n, a) => {
  et.init(n, a), n._zod.optin = "optional", Ge(n._zod, "values", () => a.innerType._zod.values), n._zod.parse = (o, s) => {
    if (s.direction === "backward")
      return a.innerType._zod.run(o, s);
    if (o.value === void 0)
      return o.value = a.defaultValue, o;
    const l = a.innerType._zod.run(o, s);
    return l instanceof Promise ? l.then((d) => qp(d, a)) : qp(l, a);
  };
});
function qp(n, a) {
  return n.value === void 0 && (n.value = a.defaultValue), n;
}
const _E = /* @__PURE__ */ B("$ZodPrefault", (n, a) => {
  et.init(n, a), n._zod.optin = "optional", Ge(n._zod, "values", () => a.innerType._zod.values), n._zod.parse = (o, s) => (s.direction === "backward" || o.value === void 0 && (o.value = a.defaultValue), a.innerType._zod.run(o, s));
}), mE = /* @__PURE__ */ B("$ZodNonOptional", (n, a) => {
  et.init(n, a), Ge(n._zod, "values", () => {
    const o = a.innerType._zod.values;
    return o ? new Set([...o].filter((s) => s !== void 0)) : void 0;
  }), n._zod.parse = (o, s) => {
    const l = a.innerType._zod.run(o, s);
    return l instanceof Promise ? l.then((d) => Gp(d, n)) : Gp(l, n);
  };
});
function Gp(n, a) {
  return !n.issues.length && n.value === void 0 && n.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: n.value,
    inst: a
  }), n;
}
const fE = /* @__PURE__ */ B("$ZodCatch", (n, a) => {
  et.init(n, a), Ge(n._zod, "optin", () => a.innerType._zod.optin), Ge(n._zod, "optout", () => a.innerType._zod.optout), Ge(n._zod, "values", () => a.innerType._zod.values), n._zod.parse = (o, s) => {
    if (s.direction === "backward")
      return a.innerType._zod.run(o, s);
    const l = a.innerType._zod.run(o, s);
    return l instanceof Promise ? l.then((d) => (o.value = d.value, d.issues.length && (o.value = a.catchValue({
      ...o,
      error: {
        issues: d.issues.map((_) => Oa(_, s, Ma()))
      },
      input: o.value
    }), o.issues = []), o)) : (o.value = l.value, l.issues.length && (o.value = a.catchValue({
      ...o,
      error: {
        issues: l.issues.map((d) => Oa(d, s, Ma()))
      },
      input: o.value
    }), o.issues = []), o);
  };
}), pE = /* @__PURE__ */ B("$ZodPipe", (n, a) => {
  et.init(n, a), Ge(n._zod, "values", () => a.in._zod.values), Ge(n._zod, "optin", () => a.in._zod.optin), Ge(n._zod, "optout", () => a.out._zod.optout), Ge(n._zod, "propValues", () => a.in._zod.propValues), n._zod.parse = (o, s) => {
    if (s.direction === "backward") {
      const d = a.out._zod.run(o, s);
      return d instanceof Promise ? d.then((_) => Rs(_, a.in, s)) : Rs(d, a.in, s);
    }
    const l = a.in._zod.run(o, s);
    return l instanceof Promise ? l.then((d) => Rs(d, a.out, s)) : Rs(l, a.out, s);
  };
});
function Rs(n, a, o) {
  return n.issues.length ? (n.aborted = !0, n) : a._zod.run({ value: n.value, issues: n.issues }, o);
}
const gE = /* @__PURE__ */ B("$ZodReadonly", (n, a) => {
  et.init(n, a), Ge(n._zod, "propValues", () => a.innerType._zod.propValues), Ge(n._zod, "values", () => a.innerType._zod.values), Ge(n._zod, "optin", () => a.innerType?._zod?.optin), Ge(n._zod, "optout", () => a.innerType?._zod?.optout), n._zod.parse = (o, s) => {
    if (s.direction === "backward")
      return a.innerType._zod.run(o, s);
    const l = a.innerType._zod.run(o, s);
    return l instanceof Promise ? l.then(Ip) : Ip(l);
  };
});
function Ip(n) {
  return n.value = Object.freeze(n.value), n;
}
const hE = /* @__PURE__ */ B("$ZodCustom", (n, a) => {
  Bt.init(n, a), et.init(n, a), n._zod.parse = (o, s) => o, n._zod.check = (o) => {
    const s = o.value, l = a.fn(s);
    if (l instanceof Promise)
      return l.then((d) => Hp(d, o, s, n));
    Hp(l, o, s, n);
  };
});
function Hp(n, a, o, s) {
  if (!n) {
    const l = {
      code: "custom",
      input: o,
      inst: s,
      // incorporates params.error into issue reporting
      path: [...s._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !s._zod.def.abort
      // params: inst._zod.def.params,
    };
    s._zod.def.params && (l.params = s._zod.def.params), a.issues.push(ar(l));
  }
}
var Pp;
class vE {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(a, ...o) {
    const s = o[0];
    return this._map.set(a, s), s && typeof s == "object" && "id" in s && this._idmap.set(s.id, a), this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(a) {
    const o = this._map.get(a);
    return o && typeof o == "object" && "id" in o && this._idmap.delete(o.id), this._map.delete(a), this;
  }
  get(a) {
    const o = a._zod.parent;
    if (o) {
      const s = { ...this.get(o) ?? {} };
      delete s.id;
      const l = { ...s, ...this._map.get(a) };
      return Object.keys(l).length ? l : void 0;
    }
    return this._map.get(a);
  }
  has(a) {
    return this._map.has(a);
  }
}
function yE() {
  return new vE();
}
(Pp = globalThis).__zod_globalRegistry ?? (Pp.__zod_globalRegistry = yE());
const nr = globalThis.__zod_globalRegistry;
// @__NO_SIDE_EFFECTS__
function bE(n, a) {
  return new n({
    type: "string",
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function wE(n, a) {
  return new n({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function Bp(n, a) {
  return new n({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function SE(n, a) {
  return new n({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function EE(n, a) {
  return new n({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function zE(n, a) {
  return new n({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function kE(n, a) {
  return new n({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function TE(n, a) {
  return new n({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function AE(n, a) {
  return new n({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function NE(n, a) {
  return new n({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function CE(n, a) {
  return new n({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function xE(n, a) {
  return new n({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function ME(n, a) {
  return new n({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function OE(n, a) {
  return new n({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function RE(n, a) {
  return new n({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function DE(n, a) {
  return new n({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function jE(n, a) {
  return new n({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function LE(n, a) {
  return new n({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function UE(n, a) {
  return new n({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function qE(n, a) {
  return new n({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function GE(n, a) {
  return new n({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function IE(n, a) {
  return new n({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function HE(n, a) {
  return new n({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function PE(n, a) {
  return new n({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function BE(n, a) {
  return new n({
    type: "string",
    format: "date",
    check: "string_format",
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function ZE(n, a) {
  return new n({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function YE(n, a) {
  return new n({
    type: "string",
    format: "duration",
    check: "string_format",
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function VE(n, a) {
  return new n({
    type: "number",
    checks: [],
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function KE(n, a) {
  return new n({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function XE(n) {
  return new n({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function FE(n, a) {
  return new n({
    type: "never",
    ...re(a)
  });
}
// @__NO_SIDE_EFFECTS__
function Zp(n, a) {
  return new uh({
    check: "less_than",
    ...re(a),
    value: n,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function wu(n, a) {
  return new uh({
    check: "less_than",
    ...re(a),
    value: n,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function Yp(n, a) {
  return new dh({
    check: "greater_than",
    ...re(a),
    value: n,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function Su(n, a) {
  return new dh({
    check: "greater_than",
    ...re(a),
    value: n,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function Vp(n, a) {
  return new _S({
    check: "multiple_of",
    ...re(a),
    value: n
  });
}
// @__NO_SIDE_EFFECTS__
function hh(n, a) {
  return new fS({
    check: "max_length",
    ...re(a),
    maximum: n
  });
}
// @__NO_SIDE_EFFECTS__
function Zs(n, a) {
  return new pS({
    check: "min_length",
    ...re(a),
    minimum: n
  });
}
// @__NO_SIDE_EFFECTS__
function vh(n, a) {
  return new gS({
    check: "length_equals",
    ...re(a),
    length: n
  });
}
// @__NO_SIDE_EFFECTS__
function WE(n, a) {
  return new hS({
    check: "string_format",
    format: "regex",
    ...re(a),
    pattern: n
  });
}
// @__NO_SIDE_EFFECTS__
function $E(n) {
  return new vS({
    check: "string_format",
    format: "lowercase",
    ...re(n)
  });
}
// @__NO_SIDE_EFFECTS__
function QE(n) {
  return new yS({
    check: "string_format",
    format: "uppercase",
    ...re(n)
  });
}
// @__NO_SIDE_EFFECTS__
function JE(n, a) {
  return new bS({
    check: "string_format",
    format: "includes",
    ...re(a),
    includes: n
  });
}
// @__NO_SIDE_EFFECTS__
function ez(n, a) {
  return new wS({
    check: "string_format",
    format: "starts_with",
    ...re(a),
    prefix: n
  });
}
// @__NO_SIDE_EFFECTS__
function tz(n, a) {
  return new SS({
    check: "string_format",
    format: "ends_with",
    ...re(a),
    suffix: n
  });
}
// @__NO_SIDE_EFFECTS__
function oo(n) {
  return new ES({
    check: "overwrite",
    tx: n
  });
}
// @__NO_SIDE_EFFECTS__
function nz(n) {
  return /* @__PURE__ */ oo((a) => a.normalize(n));
}
// @__NO_SIDE_EFFECTS__
function az() {
  return /* @__PURE__ */ oo((n) => n.trim());
}
// @__NO_SIDE_EFFECTS__
function iz() {
  return /* @__PURE__ */ oo((n) => n.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function oz() {
  return /* @__PURE__ */ oo((n) => n.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function rz() {
  return /* @__PURE__ */ oo((n) => v1(n));
}
// @__NO_SIDE_EFFECTS__
function sz(n, a, o) {
  return new n({
    type: "array",
    element: a,
    // get element() {
    //   return element;
    // },
    ...re(o)
  });
}
// @__NO_SIDE_EFFECTS__
function lz(n, a, o) {
  return new n({
    type: "custom",
    check: "custom",
    fn: a,
    ...re(o)
  });
}
// @__NO_SIDE_EFFECTS__
function cz(n) {
  const a = /* @__PURE__ */ uz((o) => (o.addIssue = (s) => {
    if (typeof s == "string")
      o.issues.push(ar(s, o.value, a._zod.def));
    else {
      const l = s;
      l.fatal && (l.continue = !1), l.code ?? (l.code = "custom"), l.input ?? (l.input = o.value), l.inst ?? (l.inst = a), l.continue ?? (l.continue = !a._zod.def.abort), o.issues.push(ar(l));
    }
  }, n(o.value, o)));
  return a;
}
// @__NO_SIDE_EFFECTS__
function uz(n, a) {
  const o = new Bt({
    check: "custom",
    ...re(a)
  });
  return o._zod.check = n, o;
}
function yh(n) {
  let a = n?.target ?? "draft-2020-12";
  return a === "draft-4" && (a = "draft-04"), a === "draft-7" && (a = "draft-07"), {
    processors: n.processors ?? {},
    metadataRegistry: n?.metadata ?? nr,
    target: a,
    unrepresentable: n?.unrepresentable ?? "throw",
    override: n?.override ?? (() => {
    }),
    io: n?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: n?.cycles ?? "ref",
    reused: n?.reused ?? "inline",
    external: n?.external ?? void 0
  };
}
function ct(n, a, o = { path: [], schemaPath: [] }) {
  var s;
  const l = n._zod.def, d = a.seen.get(n);
  if (d)
    return d.count++, o.schemaPath.includes(n) && (d.cycle = o.path), d.schema;
  const _ = { schema: {}, count: 1, cycle: void 0, path: o.path };
  a.seen.set(n, _);
  const m = n._zod.toJSONSchema?.();
  if (m)
    _.schema = m;
  else {
    const v = {
      ...o,
      schemaPath: [...o.schemaPath, n],
      path: o.path
    };
    if (n._zod.processJSONSchema)
      n._zod.processJSONSchema(a, _.schema, v);
    else {
      const w = _.schema, E = a.processors[l.type];
      if (!E)
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${l.type}`);
      E(n, a, w, v);
    }
    const y = n._zod.parent;
    y && (_.ref || (_.ref = y), ct(y, a, v), a.seen.get(y).isParent = !0);
  }
  const p = a.metadataRegistry.get(n);
  return p && Object.assign(_.schema, p), a.io === "input" && xt(n) && (delete _.schema.examples, delete _.schema.default), a.io === "input" && _.schema._prefault && ((s = _.schema).default ?? (s.default = _.schema._prefault)), delete _.schema._prefault, a.seen.get(n).schema;
}
function bh(n, a) {
  const o = n.seen.get(a);
  if (!o)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const s = /* @__PURE__ */ new Map();
  for (const _ of n.seen.entries()) {
    const m = n.metadataRegistry.get(_[0])?.id;
    if (m) {
      const p = s.get(m);
      if (p && p !== _[0])
        throw new Error(`Duplicate schema id "${m}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      s.set(m, _[0]);
    }
  }
  const l = (_) => {
    const m = n.target === "draft-2020-12" ? "$defs" : "definitions";
    if (n.external) {
      const y = n.external.registry.get(_[0])?.id, w = n.external.uri ?? ((z) => z);
      if (y)
        return { ref: w(y) };
      const E = _[1].defId ?? _[1].schema.id ?? `schema${n.counter++}`;
      return _[1].defId = E, { defId: E, ref: `${w("__shared")}#/${m}/${E}` };
    }
    if (_[1] === o)
      return { ref: "#" };
    const f = `#/${m}/`, v = _[1].schema.id ?? `__schema${n.counter++}`;
    return { defId: v, ref: f + v };
  }, d = (_) => {
    if (_[1].schema.$ref)
      return;
    const m = _[1], { ref: p, defId: f } = l(_);
    m.def = { ...m.schema }, f && (m.defId = f);
    const v = m.schema;
    for (const y in v)
      delete v[y];
    v.$ref = p;
  };
  if (n.cycles === "throw")
    for (const _ of n.seen.entries()) {
      const m = _[1];
      if (m.cycle)
        throw new Error(`Cycle detected: #/${m.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (const _ of n.seen.entries()) {
    const m = _[1];
    if (a === _[0]) {
      d(_);
      continue;
    }
    if (n.external) {
      const f = n.external.registry.get(_[0])?.id;
      if (a !== _[0] && f) {
        d(_);
        continue;
      }
    }
    if (n.metadataRegistry.get(_[0])?.id) {
      d(_);
      continue;
    }
    if (m.cycle) {
      d(_);
      continue;
    }
    if (m.count > 1 && n.reused === "ref") {
      d(_);
      continue;
    }
  }
}
function wh(n, a) {
  const o = n.seen.get(a);
  if (!o)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const s = (_) => {
    const m = n.seen.get(_);
    if (m.ref === null)
      return;
    const p = m.def ?? m.schema, f = { ...p }, v = m.ref;
    if (m.ref = null, v) {
      s(v);
      const w = n.seen.get(v), E = w.schema;
      if (E.$ref && (n.target === "draft-07" || n.target === "draft-04" || n.target === "openapi-3.0") ? (p.allOf = p.allOf ?? [], p.allOf.push(E)) : Object.assign(p, E), Object.assign(p, f), _._zod.parent === v)
        for (const N in p)
          N === "$ref" || N === "allOf" || N in f || delete p[N];
      if (E.$ref && w.def)
        for (const N in p)
          N === "$ref" || N === "allOf" || N in w.def && JSON.stringify(p[N]) === JSON.stringify(w.def[N]) && delete p[N];
    }
    const y = _._zod.parent;
    if (y && y !== v) {
      s(y);
      const w = n.seen.get(y);
      if (w?.schema.$ref && (p.$ref = w.schema.$ref, w.def))
        for (const E in p)
          E === "$ref" || E === "allOf" || E in w.def && JSON.stringify(p[E]) === JSON.stringify(w.def[E]) && delete p[E];
    }
    n.override({
      zodSchema: _,
      jsonSchema: p,
      path: m.path ?? []
    });
  };
  for (const _ of [...n.seen.entries()].reverse())
    s(_[0]);
  const l = {};
  if (n.target === "draft-2020-12" ? l.$schema = "https://json-schema.org/draft/2020-12/schema" : n.target === "draft-07" ? l.$schema = "http://json-schema.org/draft-07/schema#" : n.target === "draft-04" ? l.$schema = "http://json-schema.org/draft-04/schema#" : n.target, n.external?.uri) {
    const _ = n.external.registry.get(a)?.id;
    if (!_)
      throw new Error("Schema is missing an `id` property");
    l.$id = n.external.uri(_);
  }
  Object.assign(l, o.def ?? o.schema);
  const d = n.external?.defs ?? {};
  for (const _ of n.seen.entries()) {
    const m = _[1];
    m.def && m.defId && (d[m.defId] = m.def);
  }
  n.external || Object.keys(d).length > 0 && (n.target === "draft-2020-12" ? l.$defs = d : l.definitions = d);
  try {
    const _ = JSON.parse(JSON.stringify(l));
    return Object.defineProperty(_, "~standard", {
      value: {
        ...a["~standard"],
        jsonSchema: {
          input: Ys(a, "input", n.processors),
          output: Ys(a, "output", n.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), _;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function xt(n, a) {
  const o = a ?? { seen: /* @__PURE__ */ new Set() };
  if (o.seen.has(n))
    return !1;
  o.seen.add(n);
  const s = n._zod.def;
  if (s.type === "transform")
    return !0;
  if (s.type === "array")
    return xt(s.element, o);
  if (s.type === "set")
    return xt(s.valueType, o);
  if (s.type === "lazy")
    return xt(s.getter(), o);
  if (s.type === "promise" || s.type === "optional" || s.type === "nonoptional" || s.type === "nullable" || s.type === "readonly" || s.type === "default" || s.type === "prefault")
    return xt(s.innerType, o);
  if (s.type === "intersection")
    return xt(s.left, o) || xt(s.right, o);
  if (s.type === "record" || s.type === "map")
    return xt(s.keyType, o) || xt(s.valueType, o);
  if (s.type === "pipe")
    return xt(s.in, o) || xt(s.out, o);
  if (s.type === "object") {
    for (const l in s.shape)
      if (xt(s.shape[l], o))
        return !0;
    return !1;
  }
  if (s.type === "union") {
    for (const l of s.options)
      if (xt(l, o))
        return !0;
    return !1;
  }
  if (s.type === "tuple") {
    for (const l of s.items)
      if (xt(l, o))
        return !0;
    return !!(s.rest && xt(s.rest, o));
  }
  return !1;
}
const dz = (n, a = {}) => (o) => {
  const s = yh({ ...o, processors: a });
  return ct(n, s), bh(s, n), wh(s, n);
}, Ys = (n, a, o = {}) => (s) => {
  const { libraryOptions: l, target: d } = s ?? {}, _ = yh({ ...l ?? {}, target: d, io: a, processors: o });
  return ct(n, _), bh(_, n), wh(_, n);
}, _z = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
}, mz = (n, a, o, s) => {
  const l = o;
  l.type = "string";
  const { minimum: d, maximum: _, format: m, patterns: p, contentEncoding: f } = n._zod.bag;
  if (typeof d == "number" && (l.minLength = d), typeof _ == "number" && (l.maxLength = _), m && (l.format = _z[m] ?? m, l.format === "" && delete l.format, m === "time" && delete l.format), f && (l.contentEncoding = f), p && p.size > 0) {
    const v = [...p];
    v.length === 1 ? l.pattern = v[0].source : v.length > 1 && (l.allOf = [
      ...v.map((y) => ({
        ...a.target === "draft-07" || a.target === "draft-04" || a.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: y.source
      }))
    ]);
  }
}, fz = (n, a, o, s) => {
  const l = o, { minimum: d, maximum: _, format: m, multipleOf: p, exclusiveMaximum: f, exclusiveMinimum: v } = n._zod.bag;
  typeof m == "string" && m.includes("int") ? l.type = "integer" : l.type = "number", typeof v == "number" && (a.target === "draft-04" || a.target === "openapi-3.0" ? (l.minimum = v, l.exclusiveMinimum = !0) : l.exclusiveMinimum = v), typeof d == "number" && (l.minimum = d, typeof v == "number" && a.target !== "draft-04" && (v >= d ? delete l.minimum : delete l.exclusiveMinimum)), typeof f == "number" && (a.target === "draft-04" || a.target === "openapi-3.0" ? (l.maximum = f, l.exclusiveMaximum = !0) : l.exclusiveMaximum = f), typeof _ == "number" && (l.maximum = _, typeof f == "number" && a.target !== "draft-04" && (f <= _ ? delete l.maximum : delete l.exclusiveMaximum)), typeof p == "number" && (l.multipleOf = p);
}, pz = (n, a, o, s) => {
  o.not = {};
}, gz = (n, a, o, s) => {
}, hz = (n, a, o, s) => {
  const l = n._zod.def, d = Jg(l.entries);
  d.every((_) => typeof _ == "number") && (o.type = "number"), d.every((_) => typeof _ == "string") && (o.type = "string"), o.enum = d;
}, vz = (n, a, o, s) => {
  const l = n._zod.def, d = [];
  for (const _ of l.values)
    if (_ === void 0) {
      if (a.unrepresentable === "throw")
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
    } else if (typeof _ == "bigint") {
      if (a.unrepresentable === "throw")
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      d.push(Number(_));
    } else
      d.push(_);
  if (d.length !== 0) if (d.length === 1) {
    const _ = d[0];
    o.type = _ === null ? "null" : typeof _, a.target === "draft-04" || a.target === "openapi-3.0" ? o.enum = [_] : o.const = _;
  } else
    d.every((_) => typeof _ == "number") && (o.type = "number"), d.every((_) => typeof _ == "string") && (o.type = "string"), d.every((_) => typeof _ == "boolean") && (o.type = "boolean"), d.every((_) => _ === null) && (o.type = "null"), o.enum = d;
}, yz = (n, a, o, s) => {
  if (a.unrepresentable === "throw")
    throw new Error("Custom types cannot be represented in JSON Schema");
}, bz = (n, a, o, s) => {
  if (a.unrepresentable === "throw")
    throw new Error("Transforms cannot be represented in JSON Schema");
}, wz = (n, a, o, s) => {
  const l = o, d = n._zod.def, { minimum: _, maximum: m } = n._zod.bag;
  typeof _ == "number" && (l.minItems = _), typeof m == "number" && (l.maxItems = m), l.type = "array", l.items = ct(d.element, a, { ...s, path: [...s.path, "items"] });
}, Sz = (n, a, o, s) => {
  const l = o, d = n._zod.def;
  l.type = "object", l.properties = {};
  const _ = d.shape;
  for (const f in _)
    l.properties[f] = ct(_[f], a, {
      ...s,
      path: [...s.path, "properties", f]
    });
  const m = new Set(Object.keys(_)), p = new Set([...m].filter((f) => {
    const v = d.shape[f]._zod;
    return a.io === "input" ? v.optin === void 0 : v.optout === void 0;
  }));
  p.size > 0 && (l.required = Array.from(p)), d.catchall?._zod.def.type === "never" ? l.additionalProperties = !1 : d.catchall ? d.catchall && (l.additionalProperties = ct(d.catchall, a, {
    ...s,
    path: [...s.path, "additionalProperties"]
  })) : a.io === "output" && (l.additionalProperties = !1);
}, Ez = (n, a, o, s) => {
  const l = n._zod.def, d = l.inclusive === !1, _ = l.options.map((m, p) => ct(m, a, {
    ...s,
    path: [...s.path, d ? "oneOf" : "anyOf", p]
  }));
  d ? o.oneOf = _ : o.anyOf = _;
}, zz = (n, a, o, s) => {
  const l = n._zod.def, d = ct(l.left, a, {
    ...s,
    path: [...s.path, "allOf", 0]
  }), _ = ct(l.right, a, {
    ...s,
    path: [...s.path, "allOf", 1]
  }), m = (f) => "allOf" in f && Object.keys(f).length === 1, p = [
    ...m(d) ? d.allOf : [d],
    ...m(_) ? _.allOf : [_]
  ];
  o.allOf = p;
}, kz = (n, a, o, s) => {
  const l = o, d = n._zod.def;
  l.type = "object";
  const _ = d.keyType, p = _._zod.bag?.patterns;
  if (d.mode === "loose" && p && p.size > 0) {
    const v = ct(d.valueType, a, {
      ...s,
      path: [...s.path, "patternProperties", "*"]
    });
    l.patternProperties = {};
    for (const y of p)
      l.patternProperties[y.source] = v;
  } else
    (a.target === "draft-07" || a.target === "draft-2020-12") && (l.propertyNames = ct(d.keyType, a, {
      ...s,
      path: [...s.path, "propertyNames"]
    })), l.additionalProperties = ct(d.valueType, a, {
      ...s,
      path: [...s.path, "additionalProperties"]
    });
  const f = _._zod.values;
  if (f) {
    const v = [...f].filter((y) => typeof y == "string" || typeof y == "number");
    v.length > 0 && (l.required = v);
  }
}, Tz = (n, a, o, s) => {
  const l = n._zod.def, d = ct(l.innerType, a, s), _ = a.seen.get(n);
  a.target === "openapi-3.0" ? (_.ref = l.innerType, o.nullable = !0) : o.anyOf = [d, { type: "null" }];
}, Az = (n, a, o, s) => {
  const l = n._zod.def;
  ct(l.innerType, a, s);
  const d = a.seen.get(n);
  d.ref = l.innerType;
}, Nz = (n, a, o, s) => {
  const l = n._zod.def;
  ct(l.innerType, a, s);
  const d = a.seen.get(n);
  d.ref = l.innerType, o.default = JSON.parse(JSON.stringify(l.defaultValue));
}, Cz = (n, a, o, s) => {
  const l = n._zod.def;
  ct(l.innerType, a, s);
  const d = a.seen.get(n);
  d.ref = l.innerType, a.io === "input" && (o._prefault = JSON.parse(JSON.stringify(l.defaultValue)));
}, xz = (n, a, o, s) => {
  const l = n._zod.def;
  ct(l.innerType, a, s);
  const d = a.seen.get(n);
  d.ref = l.innerType;
  let _;
  try {
    _ = l.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  o.default = _;
}, Mz = (n, a, o, s) => {
  const l = n._zod.def, d = a.io === "input" ? l.in._zod.def.type === "transform" ? l.out : l.in : l.out;
  ct(d, a, s);
  const _ = a.seen.get(n);
  _.ref = d;
}, Oz = (n, a, o, s) => {
  const l = n._zod.def;
  ct(l.innerType, a, s);
  const d = a.seen.get(n);
  d.ref = l.innerType, o.readOnly = !0;
}, Sh = (n, a, o, s) => {
  const l = n._zod.def;
  ct(l.innerType, a, s);
  const d = a.seen.get(n);
  d.ref = l.innerType;
}, Rz = /* @__PURE__ */ B("ZodISODateTime", (n, a) => {
  US.init(n, a), $e.init(n, a);
});
function Dz(n) {
  return /* @__PURE__ */ PE(Rz, n);
}
const jz = /* @__PURE__ */ B("ZodISODate", (n, a) => {
  qS.init(n, a), $e.init(n, a);
});
function Lz(n) {
  return /* @__PURE__ */ BE(jz, n);
}
const Uz = /* @__PURE__ */ B("ZodISOTime", (n, a) => {
  GS.init(n, a), $e.init(n, a);
});
function qz(n) {
  return /* @__PURE__ */ ZE(Uz, n);
}
const Gz = /* @__PURE__ */ B("ZodISODuration", (n, a) => {
  IS.init(n, a), $e.init(n, a);
});
function Iz(n) {
  return /* @__PURE__ */ YE(Gz, n);
}
const Hz = (n, a) => {
  ah.init(n, a), n.name = "ZodError", Object.defineProperties(n, {
    format: {
      value: (o) => M1(n, o)
      // enumerable: false,
    },
    flatten: {
      value: (o) => x1(n, o)
      // enumerable: false,
    },
    addIssue: {
      value: (o) => {
        n.issues.push(o), n.message = JSON.stringify(n.issues, Ru, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (o) => {
        n.issues.push(...o), n.message = JSON.stringify(n.issues, Ru, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return n.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, vn = B("ZodError", Hz, {
  Parent: Error
}), Pz = /* @__PURE__ */ td(vn), Bz = /* @__PURE__ */ nd(vn), Zz = /* @__PURE__ */ Fs(vn), Yz = /* @__PURE__ */ Ws(vn), Vz = /* @__PURE__ */ D1(vn), Kz = /* @__PURE__ */ j1(vn), Xz = /* @__PURE__ */ L1(vn), Fz = /* @__PURE__ */ U1(vn), Wz = /* @__PURE__ */ q1(vn), $z = /* @__PURE__ */ G1(vn), Qz = /* @__PURE__ */ I1(vn), Jz = /* @__PURE__ */ H1(vn), tt = /* @__PURE__ */ B("ZodType", (n, a) => (et.init(n, a), Object.assign(n["~standard"], {
  jsonSchema: {
    input: Ys(n, "input"),
    output: Ys(n, "output")
  }
}), n.toJSONSchema = dz(n, {}), n.def = a, n.type = a.type, Object.defineProperty(n, "_def", { value: a }), n.check = (...o) => n.clone(Da(a, {
  checks: [
    ...a.checks ?? [],
    ...o.map((s) => typeof s == "function" ? { _zod: { check: s, def: { check: "custom" }, onattach: [] } } : s)
  ]
}), {
  parent: !0
}), n.with = n.check, n.clone = (o, s) => ja(n, o, s), n.brand = () => n, n.register = ((o, s) => (o.add(n, s), n)), n.parse = (o, s) => Pz(n, o, s, { callee: n.parse }), n.safeParse = (o, s) => Zz(n, o, s), n.parseAsync = async (o, s) => Bz(n, o, s, { callee: n.parseAsync }), n.safeParseAsync = async (o, s) => Yz(n, o, s), n.spa = n.safeParseAsync, n.encode = (o, s) => Vz(n, o, s), n.decode = (o, s) => Kz(n, o, s), n.encodeAsync = async (o, s) => Xz(n, o, s), n.decodeAsync = async (o, s) => Fz(n, o, s), n.safeEncode = (o, s) => Wz(n, o, s), n.safeDecode = (o, s) => $z(n, o, s), n.safeEncodeAsync = async (o, s) => Qz(n, o, s), n.safeDecodeAsync = async (o, s) => Jz(n, o, s), n.refine = (o, s) => n.check(Fk(o, s)), n.superRefine = (o) => n.check(Wk(o)), n.overwrite = (o) => n.check(/* @__PURE__ */ oo(o)), n.optional = () => Wp(n), n.exactOptional = () => Lk(n), n.nullable = () => $p(n), n.nullish = () => Wp($p(n)), n.nonoptional = (o) => Pk(n, o), n.array = () => ju(n), n.or = (o) => Tk([n, o]), n.and = (o) => Nk(n, o), n.transform = (o) => Qp(n, Dk(o)), n.default = (o) => Gk(n, o), n.prefault = (o) => Hk(n, o), n.catch = (o) => Zk(n, o), n.pipe = (o) => Qp(n, o), n.readonly = () => Kk(n), n.describe = (o) => {
  const s = n.clone();
  return nr.add(s, { description: o }), s;
}, Object.defineProperty(n, "description", {
  get() {
    return nr.get(n)?.description;
  },
  configurable: !0
}), n.meta = (...o) => {
  if (o.length === 0)
    return nr.get(n);
  const s = n.clone();
  return nr.add(s, o[0]), s;
}, n.isOptional = () => n.safeParse(void 0).success, n.isNullable = () => n.safeParse(null).success, n.apply = (o) => o(n), n)), Eh = /* @__PURE__ */ B("_ZodString", (n, a) => {
  ad.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (s, l, d) => mz(n, s, l);
  const o = n._zod.bag;
  n.format = o.format ?? null, n.minLength = o.minimum ?? null, n.maxLength = o.maximum ?? null, n.regex = (...s) => n.check(/* @__PURE__ */ WE(...s)), n.includes = (...s) => n.check(/* @__PURE__ */ JE(...s)), n.startsWith = (...s) => n.check(/* @__PURE__ */ ez(...s)), n.endsWith = (...s) => n.check(/* @__PURE__ */ tz(...s)), n.min = (...s) => n.check(/* @__PURE__ */ Zs(...s)), n.max = (...s) => n.check(/* @__PURE__ */ hh(...s)), n.length = (...s) => n.check(/* @__PURE__ */ vh(...s)), n.nonempty = (...s) => n.check(/* @__PURE__ */ Zs(1, ...s)), n.lowercase = (s) => n.check(/* @__PURE__ */ $E(s)), n.uppercase = (s) => n.check(/* @__PURE__ */ QE(s)), n.trim = () => n.check(/* @__PURE__ */ az()), n.normalize = (...s) => n.check(/* @__PURE__ */ nz(...s)), n.toLowerCase = () => n.check(/* @__PURE__ */ iz()), n.toUpperCase = () => n.check(/* @__PURE__ */ oz()), n.slugify = () => n.check(/* @__PURE__ */ rz());
}), ek = /* @__PURE__ */ B("ZodString", (n, a) => {
  ad.init(n, a), Eh.init(n, a), n.email = (o) => n.check(/* @__PURE__ */ wE(tk, o)), n.url = (o) => n.check(/* @__PURE__ */ TE(nk, o)), n.jwt = (o) => n.check(/* @__PURE__ */ HE(hk, o)), n.emoji = (o) => n.check(/* @__PURE__ */ AE(ak, o)), n.guid = (o) => n.check(/* @__PURE__ */ Bp(Kp, o)), n.uuid = (o) => n.check(/* @__PURE__ */ SE(Ds, o)), n.uuidv4 = (o) => n.check(/* @__PURE__ */ EE(Ds, o)), n.uuidv6 = (o) => n.check(/* @__PURE__ */ zE(Ds, o)), n.uuidv7 = (o) => n.check(/* @__PURE__ */ kE(Ds, o)), n.nanoid = (o) => n.check(/* @__PURE__ */ NE(ik, o)), n.guid = (o) => n.check(/* @__PURE__ */ Bp(Kp, o)), n.cuid = (o) => n.check(/* @__PURE__ */ CE(ok, o)), n.cuid2 = (o) => n.check(/* @__PURE__ */ xE(rk, o)), n.ulid = (o) => n.check(/* @__PURE__ */ ME(sk, o)), n.base64 = (o) => n.check(/* @__PURE__ */ qE(fk, o)), n.base64url = (o) => n.check(/* @__PURE__ */ GE(pk, o)), n.xid = (o) => n.check(/* @__PURE__ */ OE(lk, o)), n.ksuid = (o) => n.check(/* @__PURE__ */ RE(ck, o)), n.ipv4 = (o) => n.check(/* @__PURE__ */ DE(uk, o)), n.ipv6 = (o) => n.check(/* @__PURE__ */ jE(dk, o)), n.cidrv4 = (o) => n.check(/* @__PURE__ */ LE(_k, o)), n.cidrv6 = (o) => n.check(/* @__PURE__ */ UE(mk, o)), n.e164 = (o) => n.check(/* @__PURE__ */ IE(gk, o)), n.datetime = (o) => n.check(Dz(o)), n.date = (o) => n.check(Lz(o)), n.time = (o) => n.check(qz(o)), n.duration = (o) => n.check(Iz(o));
});
function pn(n) {
  return /* @__PURE__ */ bE(ek, n);
}
const $e = /* @__PURE__ */ B("ZodStringFormat", (n, a) => {
  Fe.init(n, a), Eh.init(n, a);
}), tk = /* @__PURE__ */ B("ZodEmail", (n, a) => {
  NS.init(n, a), $e.init(n, a);
}), Kp = /* @__PURE__ */ B("ZodGUID", (n, a) => {
  TS.init(n, a), $e.init(n, a);
}), Ds = /* @__PURE__ */ B("ZodUUID", (n, a) => {
  AS.init(n, a), $e.init(n, a);
}), nk = /* @__PURE__ */ B("ZodURL", (n, a) => {
  CS.init(n, a), $e.init(n, a);
}), ak = /* @__PURE__ */ B("ZodEmoji", (n, a) => {
  xS.init(n, a), $e.init(n, a);
}), ik = /* @__PURE__ */ B("ZodNanoID", (n, a) => {
  MS.init(n, a), $e.init(n, a);
}), ok = /* @__PURE__ */ B("ZodCUID", (n, a) => {
  OS.init(n, a), $e.init(n, a);
}), rk = /* @__PURE__ */ B("ZodCUID2", (n, a) => {
  RS.init(n, a), $e.init(n, a);
}), sk = /* @__PURE__ */ B("ZodULID", (n, a) => {
  DS.init(n, a), $e.init(n, a);
}), lk = /* @__PURE__ */ B("ZodXID", (n, a) => {
  jS.init(n, a), $e.init(n, a);
}), ck = /* @__PURE__ */ B("ZodKSUID", (n, a) => {
  LS.init(n, a), $e.init(n, a);
}), uk = /* @__PURE__ */ B("ZodIPv4", (n, a) => {
  HS.init(n, a), $e.init(n, a);
}), dk = /* @__PURE__ */ B("ZodIPv6", (n, a) => {
  PS.init(n, a), $e.init(n, a);
}), _k = /* @__PURE__ */ B("ZodCIDRv4", (n, a) => {
  BS.init(n, a), $e.init(n, a);
}), mk = /* @__PURE__ */ B("ZodCIDRv6", (n, a) => {
  ZS.init(n, a), $e.init(n, a);
}), fk = /* @__PURE__ */ B("ZodBase64", (n, a) => {
  YS.init(n, a), $e.init(n, a);
}), pk = /* @__PURE__ */ B("ZodBase64URL", (n, a) => {
  KS.init(n, a), $e.init(n, a);
}), gk = /* @__PURE__ */ B("ZodE164", (n, a) => {
  XS.init(n, a), $e.init(n, a);
}), hk = /* @__PURE__ */ B("ZodJWT", (n, a) => {
  WS.init(n, a), $e.init(n, a);
}), zh = /* @__PURE__ */ B("ZodNumber", (n, a) => {
  mh.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (s, l, d) => fz(n, s, l), n.gt = (s, l) => n.check(/* @__PURE__ */ Yp(s, l)), n.gte = (s, l) => n.check(/* @__PURE__ */ Su(s, l)), n.min = (s, l) => n.check(/* @__PURE__ */ Su(s, l)), n.lt = (s, l) => n.check(/* @__PURE__ */ Zp(s, l)), n.lte = (s, l) => n.check(/* @__PURE__ */ wu(s, l)), n.max = (s, l) => n.check(/* @__PURE__ */ wu(s, l)), n.int = (s) => n.check(Xp(s)), n.safe = (s) => n.check(Xp(s)), n.positive = (s) => n.check(/* @__PURE__ */ Yp(0, s)), n.nonnegative = (s) => n.check(/* @__PURE__ */ Su(0, s)), n.negative = (s) => n.check(/* @__PURE__ */ Zp(0, s)), n.nonpositive = (s) => n.check(/* @__PURE__ */ wu(0, s)), n.multipleOf = (s, l) => n.check(/* @__PURE__ */ Vp(s, l)), n.step = (s, l) => n.check(/* @__PURE__ */ Vp(s, l)), n.finite = () => n;
  const o = n._zod.bag;
  n.minValue = Math.max(o.minimum ?? Number.NEGATIVE_INFINITY, o.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, n.maxValue = Math.min(o.maximum ?? Number.POSITIVE_INFINITY, o.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, n.isInt = (o.format ?? "").includes("int") || Number.isSafeInteger(o.multipleOf ?? 0.5), n.isFinite = !0, n.format = o.format ?? null;
});
function vk(n) {
  return /* @__PURE__ */ VE(zh, n);
}
const yk = /* @__PURE__ */ B("ZodNumberFormat", (n, a) => {
  $S.init(n, a), zh.init(n, a);
});
function Xp(n) {
  return /* @__PURE__ */ KE(yk, n);
}
const bk = /* @__PURE__ */ B("ZodUnknown", (n, a) => {
  QS.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => gz();
});
function Fp() {
  return /* @__PURE__ */ XE(bk);
}
const wk = /* @__PURE__ */ B("ZodNever", (n, a) => {
  JS.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => pz(n, o, s);
});
function Sk(n) {
  return /* @__PURE__ */ FE(wk, n);
}
const Ek = /* @__PURE__ */ B("ZodArray", (n, a) => {
  eE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => wz(n, o, s, l), n.element = a.element, n.min = (o, s) => n.check(/* @__PURE__ */ Zs(o, s)), n.nonempty = (o) => n.check(/* @__PURE__ */ Zs(1, o)), n.max = (o, s) => n.check(/* @__PURE__ */ hh(o, s)), n.length = (o, s) => n.check(/* @__PURE__ */ vh(o, s)), n.unwrap = () => n.element;
});
function ju(n, a) {
  return /* @__PURE__ */ sz(Ek, n, a);
}
const zk = /* @__PURE__ */ B("ZodObject", (n, a) => {
  nE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Sz(n, o, s, l), Ge(n, "shape", () => a.shape), n.keyof = () => oi(Object.keys(n._zod.def.shape)), n.catchall = (o) => n.clone({ ...n._zod.def, catchall: o }), n.passthrough = () => n.clone({ ...n._zod.def, catchall: Fp() }), n.loose = () => n.clone({ ...n._zod.def, catchall: Fp() }), n.strict = () => n.clone({ ...n._zod.def, catchall: Sk() }), n.strip = () => n.clone({ ...n._zod.def, catchall: void 0 }), n.extend = (o) => k1(n, o), n.safeExtend = (o) => T1(n, o), n.merge = (o) => A1(n, o), n.pick = (o) => E1(n, o), n.omit = (o) => z1(n, o), n.partial = (...o) => N1(kh, n, o[0]), n.required = (...o) => C1(Th, n, o[0]);
});
function id(n, a) {
  const o = {
    type: "object",
    shape: n ?? {},
    ...re(a)
  };
  return new zk(o);
}
const kk = /* @__PURE__ */ B("ZodUnion", (n, a) => {
  aE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Ez(n, o, s, l), n.options = a.options;
});
function Tk(n, a) {
  return new kk({
    type: "union",
    options: n,
    ...re(a)
  });
}
const Ak = /* @__PURE__ */ B("ZodIntersection", (n, a) => {
  iE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => zz(n, o, s, l);
});
function Nk(n, a) {
  return new Ak({
    type: "intersection",
    left: n,
    right: a
  });
}
const Ck = /* @__PURE__ */ B("ZodRecord", (n, a) => {
  oE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => kz(n, o, s, l), n.keyType = a.keyType, n.valueType = a.valueType;
});
function xk(n, a, o) {
  return new Ck({
    type: "record",
    keyType: n,
    valueType: a,
    ...re(o)
  });
}
const Lu = /* @__PURE__ */ B("ZodEnum", (n, a) => {
  rE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (s, l, d) => hz(n, s, l), n.enum = a.entries, n.options = Object.values(a.entries);
  const o = new Set(Object.keys(a.entries));
  n.extract = (s, l) => {
    const d = {};
    for (const _ of s)
      if (o.has(_))
        d[_] = a.entries[_];
      else
        throw new Error(`Key ${_} not found in enum`);
    return new Lu({
      ...a,
      checks: [],
      ...re(l),
      entries: d
    });
  }, n.exclude = (s, l) => {
    const d = { ...a.entries };
    for (const _ of s)
      if (o.has(_))
        delete d[_];
      else
        throw new Error(`Key ${_} not found in enum`);
    return new Lu({
      ...a,
      checks: [],
      ...re(l),
      entries: d
    });
  };
});
function oi(n, a) {
  const o = Array.isArray(n) ? Object.fromEntries(n.map((s) => [s, s])) : n;
  return new Lu({
    type: "enum",
    entries: o,
    ...re(a)
  });
}
const Mk = /* @__PURE__ */ B("ZodLiteral", (n, a) => {
  sE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => vz(n, o, s), n.values = new Set(a.values), Object.defineProperty(n, "value", {
    get() {
      if (a.values.length > 1)
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return a.values[0];
    }
  });
});
function Ok(n, a) {
  return new Mk({
    type: "literal",
    values: Array.isArray(n) ? n : [n],
    ...re(a)
  });
}
const Rk = /* @__PURE__ */ B("ZodTransform", (n, a) => {
  lE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => bz(n, o), n._zod.parse = (o, s) => {
    if (s.direction === "backward")
      throw new $g(n.constructor.name);
    o.addIssue = (d) => {
      if (typeof d == "string")
        o.issues.push(ar(d, o.value, a));
      else {
        const _ = d;
        _.fatal && (_.continue = !1), _.code ?? (_.code = "custom"), _.input ?? (_.input = o.value), _.inst ?? (_.inst = n), o.issues.push(ar(_));
      }
    };
    const l = a.transform(o.value, o);
    return l instanceof Promise ? l.then((d) => (o.value = d, o)) : (o.value = l, o);
  };
});
function Dk(n) {
  return new Rk({
    type: "transform",
    transform: n
  });
}
const kh = /* @__PURE__ */ B("ZodOptional", (n, a) => {
  gh.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Sh(n, o, s, l), n.unwrap = () => n._zod.def.innerType;
});
function Wp(n) {
  return new kh({
    type: "optional",
    innerType: n
  });
}
const jk = /* @__PURE__ */ B("ZodExactOptional", (n, a) => {
  cE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Sh(n, o, s, l), n.unwrap = () => n._zod.def.innerType;
});
function Lk(n) {
  return new jk({
    type: "optional",
    innerType: n
  });
}
const Uk = /* @__PURE__ */ B("ZodNullable", (n, a) => {
  uE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Tz(n, o, s, l), n.unwrap = () => n._zod.def.innerType;
});
function $p(n) {
  return new Uk({
    type: "nullable",
    innerType: n
  });
}
const qk = /* @__PURE__ */ B("ZodDefault", (n, a) => {
  dE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Nz(n, o, s, l), n.unwrap = () => n._zod.def.innerType, n.removeDefault = n.unwrap;
});
function Gk(n, a) {
  return new qk({
    type: "default",
    innerType: n,
    get defaultValue() {
      return typeof a == "function" ? a() : th(a);
    }
  });
}
const Ik = /* @__PURE__ */ B("ZodPrefault", (n, a) => {
  _E.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Cz(n, o, s, l), n.unwrap = () => n._zod.def.innerType;
});
function Hk(n, a) {
  return new Ik({
    type: "prefault",
    innerType: n,
    get defaultValue() {
      return typeof a == "function" ? a() : th(a);
    }
  });
}
const Th = /* @__PURE__ */ B("ZodNonOptional", (n, a) => {
  mE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Az(n, o, s, l), n.unwrap = () => n._zod.def.innerType;
});
function Pk(n, a) {
  return new Th({
    type: "nonoptional",
    innerType: n,
    ...re(a)
  });
}
const Bk = /* @__PURE__ */ B("ZodCatch", (n, a) => {
  fE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => xz(n, o, s, l), n.unwrap = () => n._zod.def.innerType, n.removeCatch = n.unwrap;
});
function Zk(n, a) {
  return new Bk({
    type: "catch",
    innerType: n,
    catchValue: typeof a == "function" ? a : () => a
  });
}
const Yk = /* @__PURE__ */ B("ZodPipe", (n, a) => {
  pE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Mz(n, o, s, l), n.in = a.in, n.out = a.out;
});
function Qp(n, a) {
  return new Yk({
    type: "pipe",
    in: n,
    out: a
    // ...util.normalizeParams(params),
  });
}
const Vk = /* @__PURE__ */ B("ZodReadonly", (n, a) => {
  gE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => Oz(n, o, s, l), n.unwrap = () => n._zod.def.innerType;
});
function Kk(n) {
  return new Vk({
    type: "readonly",
    innerType: n
  });
}
const Xk = /* @__PURE__ */ B("ZodCustom", (n, a) => {
  hE.init(n, a), tt.init(n, a), n._zod.processJSONSchema = (o, s, l) => yz(n, o);
});
function Fk(n, a = {}) {
  return /* @__PURE__ */ lz(Xk, n, a);
}
function Wk(n) {
  return /* @__PURE__ */ cz(n);
}
function je(n, a) {
  return typeof n == typeof a ? n : a;
}
function $k(n) {
  return typeof n == "string";
}
function Na(n) {
  return typeof n == "number";
}
const Qk = /^[a-z][a-z0-9_]*\.[a-z0-9][a-z0-9_]*$/, Ah = pn().regex(Qk, "Invalid entity ID format. Expected: domain.object_id"), Jk = Ah.refine((n) => n.startsWith("vacuum."), {
  message: "Expected vacuum.* entity"
}), eT = Ah.refine((n) => n.startsWith("camera."), {
  message: "Expected camera.* entity"
}), tT = id({
  type: Ok("stop"),
  action: oi(["stop", "stop_and_dock"])
}), nT = id({
  primary: pn().optional(),
  accent: pn().optional(),
  background: pn().optional(),
  surface: pn().optional(),
  text: pn().optional(),
  textSecondary: pn().optional()
}).optional(), aT = id({
  type: pn(),
  entity: Jk,
  map_entity: eT.optional(),
  title: pn().optional(),
  theme: oi(["light", "dark", "custom"]).optional(),
  custom_theme: nT,
  language: oi(["en", "de", "ru", "pl", "it", "nl", "es", "zh", "he", "fr_FR", "ko"]).optional(),
  default_mode: oi(["room", "all", "zone"]).optional(),
  default_room_view: oi(["map", "list"]).optional(),
  buttons: ju(tT).optional(),
  map_overlays: ju(oi(["vacuum", "charger", "room_labels"])).optional(),
  room_names: xk(pn(), pn()).optional(),
  room_label_scale: vk().positive().optional(),
  map_height: pn().optional()
});
function iT(n) {
  const a = aT.safeParse(n);
  return a.success ? {
    valid: !0,
    errors: [],
    warnings: [],
    data: a.data
  } : {
    valid: !1,
    errors: a.error.issues.map((s) => {
      const l = s.path.join(".");
      return l ? `${l}: ${s.message}` : s.message;
    }),
    warnings: []
  };
}
function Jp(n, a, o) {
  const s = o.scale || 1, l = o.padding || [0, 0, 0, 0], d = o.crop || [0, 0, 0, 0], _ = o.left, m = o.top, p = o.height, f = o.grid_size, v = (n + d[0] - l[0]) / s * f + _, y = m + (p * f - 1) - (a + d[1] - l[1]) / s * f;
  return { x: Math.round(v), y: Math.round(y) };
}
function oT(n, a, o, s) {
  const l = lT(a);
  if (ne.debug("ZoneConverter", "Input:", { uiZone: n, imageWidth: o, imageHeight: s, hasDimensions: !!l }), !l) {
    const w = sT(a);
    return ne.debug("ZoneConverter", "Using calibration fallback, points:", w?.length ?? 0), rT(n, w, o, s);
  }
  ne.debug("ZoneConverter", "Map dimensions:", l);
  const d = n.x1 / 100 * o, _ = n.y1 / 100 * s, m = n.x2 / 100 * o, p = n.y2 / 100 * s;
  ne.debug("ZoneConverter", "Pixel coords:", { px1: d, py1: _, px2: m, py2: p });
  const f = Jp(d, _, l), v = Jp(m, p, l), y = {
    x1: f.x,
    y1: f.y,
    x2: v.x,
    y2: v.y
  };
  return ne.debug("ZoneConverter", "Output vacuum coords:", y), y;
}
function rT(n, a, o, s) {
  if (!a || a.length < 3)
    return {
      x1: Math.round(n.x1 / 100 * 12e3 - 6e3),
      y1: Math.round(n.y1 / 100 * 12e3 - 6e3),
      x2: Math.round(n.x2 / 100 * 12e3 - 6e3),
      y2: Math.round(n.y2 / 100 * 12e3 - 6e3)
    };
  const l = n.x1 / 100 * o, d = n.y1 / 100 * s, _ = n.x2 / 100 * o, m = n.y2 / 100 * s, p = a[0], f = a[1], v = a[2], y = (f.vacuum.x - p.vacuum.x) / (f.map.x - p.map.x || 1), w = (v.vacuum.y - p.vacuum.y) / (v.map.y - p.map.y || 1), E = Math.round(p.vacuum.x + (l - p.map.x) * y), z = Math.round(p.vacuum.y + (d - p.map.y) * w), N = Math.round(p.vacuum.x + (_ - p.map.x) * y), j = Math.round(p.vacuum.y + (m - p.map.y) * w);
  return {
    x1: E,
    y1: z,
    x2: N,
    y2: j
  };
}
function sT(n) {
  const a = n?.attributes?.calibration_points;
  return !a || !Array.isArray(a) || a.length < 3 ? null : a.map((o) => {
    const s = o;
    return {
      vacuum: { x: s.vacuum?.x ?? 0, y: s.vacuum?.y ?? 0 },
      map: { x: s.map?.x ?? 0, y: s.map?.y ?? 0 }
    };
  });
}
function lT(n) {
  const a = n?.attributes;
  if (!a)
    return null;
  const o = Na(a.top) ? a.top : void 0, s = Na(a.left) ? a.left : void 0, l = Na(a.height) ? a.height : void 0, d = Na(a.width) ? a.width : void 0, _ = Na(a.grid_size) ? a.grid_size : void 0;
  if (o !== void 0 && s !== void 0 && l && d && _) {
    const m = Na(a.scale) ? a.scale : 1, p = Array.isArray(a.padding) ? a.padding : [0, 0, 0, 0], f = Array.isArray(a.crop) ? a.crop : [0, 0, 0, 0];
    return {
      top: o,
      left: s,
      height: l,
      width: d,
      grid_size: _,
      scale: m,
      padding: p,
      crop: f
    };
  }
  return null;
}
async function Aa(n, a, o, s, l, d) {
  try {
    return await n.callService(a, o, s), !0;
  } catch (_) {
    return ne.error(`Service call failed: ${a}.${o}`, _), l && d && l(d), !1;
  }
}
function cT({ hass: n, entityId: a, mapEntityId: o, onSuccess: s, onError: l }) {
  const { t: d } = Ie(), _ = D.useCallback(async () => {
    ne.debug("Vacuum", "Start full clean", a), await Aa(
      n,
      "vacuum",
      "start",
      { entity_id: a },
      l,
      d("errors.service_call_failed")
    ) && s?.(d("toast.starting_full_clean"));
  }, [n, a, s, l, d]), m = D.useCallback(async () => {
    ne.debug("Vacuum", "Pause", a), await Aa(
      n,
      "vacuum",
      "pause",
      { entity_id: a },
      l,
      d("errors.service_call_failed")
    ) && s?.(d("toast.pausing_vacuum"));
  }, [n, a, s, l, d]), p = D.useCallback(
    async (z = "stop") => {
      ne.debug("Vacuum", "Stop", { action: z, entityId: a }), await Aa(
        n,
        "vacuum",
        "stop",
        { entity_id: a },
        l,
        d("errors.service_call_failed")
      ) && (z === "stop_and_dock" ? (await Aa(
        n,
        "vacuum",
        "return_to_base",
        { entity_id: a },
        l,
        d("errors.service_call_failed")
      ), s?.(d("toast.stopping_and_docking"))) : s?.(d("toast.stopping_vacuum")));
    },
    [n, a, s, l, d]
  ), f = D.useCallback(async () => {
    ne.debug("Vacuum", "Return to dock", a), await Aa(
      n,
      "vacuum",
      "return_to_base",
      { entity_id: a },
      l,
      d("errors.service_call_failed")
    ) && s?.(d("toast.vacuum_docking"));
  }, [n, a, s, l, d]), v = D.useCallback(
    async (z, N, j = 1) => {
      ne.debug("Vacuum", "Clean segments", { entityId: a, segments: z, count: N, repeats: j }), await Aa(
        n,
        "dreame_vacuum",
        "vacuum_clean_segment",
        {
          entity_id: a,
          segments: z,
          repeats: j
        },
        l,
        d("errors.service_call_failed")
      ) && s?.(d(N === 1 ? "toast.starting_room_clean" : "toast.starting_room_clean_plural", { count: String(N) }));
    },
    [n, a, s, l, d]
  ), y = D.useCallback(
    async (z) => {
      if (z.length === 0) {
        ne.debug("Vacuum", "No room configs provided");
        return;
      }
      const N = z.map((P) => P.roomId), j = z.map((P) => P.cycles), R = z.map((P) => P.suctionLevel), U = z.map((P) => P.mopWetness);
      if (ne.debug("Vacuum", "Clean segments with custom config", {
        entityId: a,
        segments: N,
        repeats: j,
        suctionLevels: R,
        waterVolumes: U,
        roomConfigs: z
      }), await Aa(
        n,
        "dreame_vacuum",
        "vacuum_clean_segment",
        {
          entity_id: a,
          segments: N,
          repeats: j,
          suction_level: R,
          water_volume: U
        },
        l,
        d("errors.service_call_failed")
      )) {
        const P = z.length;
        s?.(d(P === 1 ? "toast.starting_room_clean" : "toast.starting_room_clean_plural", { count: String(P) }));
      }
    },
    [n, a, s, l, d]
  ), w = D.useCallback(
    async (z, N, j, R = 1) => {
      const U = n.states[o];
      ne.debug("Vacuum", "Clean zone - input:", {
        uiZone: z,
        imageWidth: N,
        imageHeight: j,
        mapEntityId: o,
        repeats: R,
        calibrationPoints: U?.attributes?.calibration_points
      });
      const Y = oT(z, U, N, j);
      ne.debug("Vacuum", "Clean zone - converted:", Y), await Aa(
        n,
        "dreame_vacuum",
        "vacuum_clean_zone",
        {
          entity_id: a,
          zone: [Y.x1, Y.y1, Y.x2, Y.y2],
          repeats: R
        },
        l,
        d("errors.service_call_failed")
      ) && s?.(d("toast.starting_zone_clean"));
    },
    [n, a, o, s, l, d]
  ), E = D.useCallback(
    (z, N, j, R, U, Y = 1, P) => {
      switch (ne.debug("Vacuum", "Handle clean", {
        mode: z,
        selectedRooms: Array.from(N.entries()),
        selectedZone: j,
        imageWidth: R,
        imageHeight: U,
        repeats: Y,
        customizeMode: !!P
      }), z) {
        case "all":
          P && P.length > 0 ? y(P) : _();
          break;
        case "room":
          if (N.size > 0)
            if (P && P.length > 0) {
              const I = P.filter((F) => N.has(F.roomId));
              I.length > 0 ? y(I) : v(Array.from(N.keys()), N.size, Y);
            } else
              v(Array.from(N.keys()), N.size, Y);
          else
            ne.debug("Vacuum", "No rooms selected"), s?.(d("toast.select_rooms_first"));
          break;
        case "zone":
          j && R && U ? w(j, R, U, Y) : j ? (ne.debug("Vacuum", "Zone selected but no image dimensions"), s?.(d("toast.cannot_determine_map"))) : (ne.debug("Vacuum", "No zone selected"), s?.(d("toast.select_zone_first")));
          break;
      }
    },
    [_, v, y, w, s, d]
  );
  return {
    handleStart: _,
    handlePause: m,
    handleStop: p,
    handleDock: f,
    handleCleanSegments: v,
    handleCleanSegmentsCustomized: y,
    handleCleanZone: w,
    handleClean: E
  };
}
function uT(n = 3e3) {
  const [a, o] = D.useState(null);
  D.useEffect(() => {
    if (a) {
      const d = setTimeout(() => o(null), n);
      return () => clearTimeout(d);
    }
  }, [a, n]);
  const s = D.useCallback((d) => {
    o(d);
  }, []), l = D.useCallback(() => {
    o(null);
  }, []);
  return {
    toast: a,
    showToast: s,
    hideToast: l
  };
}
const Uu = {
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
    accentBg: "rgba(0, 122, 255, 0.2)",
    accentBgHover: "rgba(0, 122, 255, 0.3)",
    accentBgSecondary: "rgba(0, 122, 255, 0.1)",
    accentBgSecondaryHover: "rgba(0, 122, 255, 0.2)",
    accentBgTransparent: "rgba(0, 122, 255, 0.2)",
    accentShadow: "rgba(0, 122, 255, 0.4)",
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
}, Nh = {
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
function dT(n, a) {
  switch (n) {
    case "light":
      return Uu;
    case "dark":
      return Nh;
    case "custom":
      return _T(a || {});
    default:
      return Uu;
  }
}
function _T(n) {
  return {
    name: "custom",
    colors: {
      ...(n.base === "dark" ? Nh : Uu).colors,
      ...n
    }
  };
}
function mT(n) {
  return {
    "--card-bg": n.cardBg,
    "--surface-bg": n.surfaceBg,
    "--surface-secondary": n.surfaceSecondary,
    "--surface-tertiary": n.surfaceTertiary,
    "--surface-bg-hover": n.surfaceBgHover,
    "--text-primary": n.textPrimary,
    "--text-primary-invert": n.textPrimaryInvert,
    "--text-secondary": n.textSecondary,
    "--text-tertiary": n.textTertiary,
    "--accent-color": n.accentColor,
    "--accent-color-hover": n.accentColorHover,
    "--accent-bg": n.accentBg,
    "--accent-bg-hover": n.accentBgHover,
    "--accent-bg-secondary": n.accentBgSecondary,
    "--accent-bg-secondary-hover": n.accentBgSecondaryHover,
    "--accent-bg-transparent": n.accentBgTransparent,
    "--accent-shadow": n.accentShadow,
    "--accent-color-shadow-color": n.accentColorShadowColor,
    "--warning-color": n.warningColor,
    "--warning-shadow": n.warningShadow,
    "--error-color": n.errorColor,
    "--error-color-hover": n.errorColorHover,
    "--error-shadow": n.errorShadow,
    "--border-color": n.borderColor,
    "--overlay-bg": n.overlayBg,
    "--card-shadow": n.cardShadow,
    "--card-shadow-hover": n.cardShadowHover,
    "--handle-shadow": n.handleShadow,
    "--handle-bg": n.handleBg,
    "--backdrop-bg": n.backdropBg,
    "--toggle-active": n.toggleActive,
    "--toggle-active-border": n.toggleActiveBorder,
    "--toggle-active-shadow-color": n.toggleActiveShadowColor
  };
}
function fT(n, a) {
  const o = mT(a.colors);
  Object.entries(o).forEach(([s, l]) => {
    n.style.setProperty(s, l);
  });
}
function pT({ themeType: n = "light", customThemeConfig: a, containerRef: o }) {
  const s = D.useMemo(() => dT(n, a), [n, a]);
  return D.useEffect(() => {
    o?.current && fT(o.current, s);
  }, [s, o]), s;
}
function gT({ hass: n, entity: a, config: o, language: s, children: l }) {
  const d = D.useMemo(() => Wg(s), [s]), _ = kT(n, a), m = D.useMemo(
    () => ({ hass: n, entity: a, config: o, language: s, isRtl: d, machineState: _ }),
    [n, a, o, s, d, _]
  );
  return /* @__PURE__ */ h.jsx(Wu.Provider, { value: m, children: l });
}
function sr() {
  const n = D.useContext(Wu);
  if (!n)
    throw new Error("useVacuumCardContext must be used within VacuumCardProvider");
  return n;
}
function Rt() {
  return sr().hass;
}
function Zt() {
  return sr().entity;
}
function Qs() {
  return sr().config;
}
function od() {
  return Rt().config?.unit_system?.area ?? "m²";
}
function rd() {
  return sr().isRtl;
}
function Rn() {
  return sr().machineState;
}
function hT() {
  const n = Qs();
  return { getStopAction: D.useCallback(() => n.buttons?.find((s) => s.type === "stop")?.action ?? "stop", [n.buttons]) };
}
function vT({ hass: n, baseEntityId: a, rooms: o }) {
  const s = D.useMemo(() => o.map((v) => ({
    roomId: v.id,
    roomName: v.name,
    suctionEntityId: Mt("select", a, v.id, mn.SUCTION_LEVEL.key),
    wetnessEntityId: Mt("number", a, v.id, xu.WETNESS_LEVEL.key),
    cleaningTimesEntityId: Mt(
      "select",
      a,
      v.id,
      mn.CLEANING_TIMES.key
    ),
    mopPressureEntityId: Mt(
      "select",
      a,
      v.id,
      mn.MOP_PRESSURE.key
    ),
    mopTemperatureEntityId: Mt(
      "select",
      a,
      v.id,
      mn.MOP_TEMPERATURE.key
    )
  })), [a, o]), l = D.useMemo(() => {
    const v = /* @__PURE__ */ new Map();
    for (const y of s) {
      const w = n.states[y.suctionEntityId], E = n.states[y.wetnessEntityId], z = n.states[y.cleaningTimesEntityId], N = n.states[y.mopPressureEntityId], j = n.states[y.mopTemperatureEntityId], R = !!(w || E || z || N || j);
      v.set(y.roomId, {
        roomId: y.roomId,
        roomName: y.roomName,
        // Suction level
        suctionLevel: w?.state ?? null,
        suctionLevelOptions: w?.attributes?.options ?? [],
        // Wetness level
        wetnessLevel: E ? parseFloat(E.state) : null,
        wetnessMin: E?.attributes?.min ?? 1,
        wetnessMax: E?.attributes?.max ?? 32,
        // Cleaning times
        cleaningTimes: z?.state ?? null,
        cleaningTimesOptions: z?.attributes?.options ?? [],
        // Mop pressure
        mopPressure: N?.state ?? null,
        mopPressureOptions: N?.attributes?.options ?? [],
        // Mop temperature
        mopTemperature: j?.state ?? null,
        mopTemperatureOptions: j?.attributes?.options ?? [],
        hasEntities: R
      });
    }
    return v;
  }, [n.states, s]), d = D.useCallback(
    (v, y) => {
      const w = Mt("select", a, v, mn.SUCTION_LEVEL.key);
      ne.debug("RoomSettings", "Setting suction level:", { roomId: v, value: y, entityId: w }), n.callService("select", "select_option", {
        entity_id: w,
        option: y
      });
    },
    [n, a]
  ), _ = D.useCallback(
    (v, y) => {
      const w = Mt("number", a, v, xu.WETNESS_LEVEL.key);
      ne.debug("RoomSettings", "Setting wetness level:", { roomId: v, value: y, entityId: w }), n.callService("number", "set_value", {
        entity_id: w,
        value: y
      });
    },
    [n, a]
  ), m = D.useCallback(
    (v, y) => {
      const w = Mt("select", a, v, mn.CLEANING_TIMES.key);
      ne.debug("RoomSettings", "Setting cleaning times:", { roomId: v, value: y, entityId: w }), n.callService("select", "select_option", {
        entity_id: w,
        option: y
      });
    },
    [n, a]
  ), p = D.useCallback(
    (v, y) => {
      const w = Mt("select", a, v, mn.MOP_PRESSURE.key);
      ne.debug("RoomSettings", "Setting mop pressure:", { roomId: v, value: y, entityId: w }), n.callService("select", "select_option", {
        entity_id: w,
        option: y
      });
    },
    [n, a]
  ), f = D.useCallback(
    (v, y) => {
      const w = Mt("select", a, v, mn.MOP_TEMPERATURE.key);
      ne.debug("RoomSettings", "Setting mop temperature:", { roomId: v, value: y, entityId: w }), n.callService("select", "select_option", {
        entity_id: w,
        option: y
      });
    },
    [n, a]
  );
  return {
    roomSettings: l,
    setSuctionLevel: d,
    setWetnessLevel: _,
    setCleaningTimes: m,
    setMopPressure: p,
    setMopTemperature: f
  };
}
function yt(n, a) {
  const o = a ? n.states[a] : void 0, s = !!o, l = o ? o.state !== "unavailable" : !1, d = s && !l;
  return {
    entity: o,
    exists: s,
    available: l,
    state: o?.state,
    isOn: o?.state === "on",
    disabled: !s || !l,
    unavailable: d,
    attributes: o?.attributes ?? {}
  };
}
function Ch(n, a, o) {
  const s = `switch.${a}_${o}`;
  return { entityId: s, ...yt(n, s) };
}
function xh(n, a, o) {
  const s = `select.${a}_${o}`;
  return { entityId: s, ...yt(n, s) };
}
function yT(n, a, o) {
  const s = `number.${a}_${o}`, l = yt(n, s), d = l.state ? parseFloat(l.state) : 0;
  return { entityId: s, ...l, numericValue: d };
}
function bT(n, a, o) {
  const s = `button.${a}_${o}`;
  return { entityId: s, ...yt(n, s) };
}
function wT(n, a, o) {
  const s = `time.${a}_${o}`, l = yt(n, s), d = l.state ? l.state.substring(0, 5) : "00:00";
  return { entityId: s, ...l, timeValue: d };
}
function lr() {
  const n = Zt();
  return D.useMemo(() => {
    const a = n.attributes.capabilities ?? [], o = new Set(a);
    return {
      raw: a,
      has: (s) => o.has(s),
      hasAny: (...s) => s.some((l) => o.has(l)),
      hasAll: (...s) => s.every((l) => o.has(l))
    };
  }, [n.attributes.capabilities]);
}
function ST(n, a) {
  return n && Tp[n] ? Tp[n] : a && Np[a] ? Np[a] : Bw;
}
function ET(n) {
  return n && Ap[n] ? Ap[n] : Zw;
}
function zT(n, a, o) {
  const s = n === "cleaning", l = n === "paused", d = s || l, _ = a === he.MOPPING, m = a === he.SWEEPING, p = a === he.MOPPING_AFTER_SWEEPING;
  return {
    canChangeCleaningMode: n === "idle" || d && !p,
    canChangeSuctionPower: !_ && !o,
    canChangeWetness: !m && !o,
    canChangeRoute: !d,
    canChangeMopFrequency: !d,
    canToggleMaxPower: (m || p) && !o,
    canStartCleaning: !d && n !== "returning" && n !== "error",
    canPause: s,
    canResume: l,
    canStop: d,
    canDock: n !== "returning" && n !== "maintenance"
  };
}
function kT(n, a) {
  return D.useMemo(() => {
    const o = Ku(a.entity_id), s = vt("sensor", o, Te.STATE.key), l = yt(n, s), d = l.state ?? a.state ?? "unknown", _ = ST(l.state, a.state), m = ET(l.state), p = a.attributes.cleaning_mode ?? he.SWEEPING_AND_MOPPING, f = a.attributes.customized_cleaning === !0, v = zT(_, p, f);
    return {
      phase: _,
      task: m,
      rawState: d,
      cleaningMode: p,
      isCustomizedCleaning: f,
      controls: v
    };
  }, [n, a]);
}
const eg = {
  [he.SWEEPING_AND_MOPPING]: "cleaning_mode_button.vac_and_mop",
  [he.MOPPING_AFTER_SWEEPING]: "cleaning_mode_button.mop_after_vac",
  [he.SWEEPING]: "cleaning_mode_button.vacuum",
  [he.MOPPING]: "cleaning_mode_button.mop",
  [he.CUSTOMIZE]: "customize.title"
}, TT = {
  [he.SWEEPING_AND_MOPPING]: "Vac & Mop",
  [he.MOPPING_AFTER_SWEEPING]: "Mop after Vac",
  [he.SWEEPING]: "Vac",
  [he.MOPPING]: "Mop",
  [he.CUSTOMIZE]: "Customize"
};
function AT(n, a) {
  return a && eg[n] ? a(eg[n]) : TT[n] ?? n;
}
const tg = {
  [Tn.VACUUM_AND_MOP]: "cleaning_mode_button.vac_and_mop",
  [Tn.MOP_AFTER_VACUUM]: "cleaning_mode_button.mop_after_vac"
}, NT = {
  [Tn.VACUUM_AND_MOP]: "Vac & Mop",
  [Tn.MOP_AFTER_VACUUM]: "Mop after Vac"
};
function CT(n, a) {
  return a && tg[n] ? a(tg[n]) : NT[n] ?? n;
}
function xT(n, a) {
  const o = n.toLowerCase();
  return o.includes("quiet") || o.includes("silent") ? a ? a("suction_levels.quiet") : "Quiet" : o.includes("standard") ? a ? a("suction_levels.standard") : "Standard" : o.includes("strong") ? a ? a("suction_levels.strong") : "Turbo" : o.includes("turbo") ? a ? a("suction_levels.turbo") : "Max" : n;
}
function MT(n) {
  switch (n) {
    case he.SWEEPING:
      return Zg;
    case he.MOPPING:
      return Yg;
    case he.SWEEPING_AND_MOPPING:
      return Hs;
    case he.MOPPING_AFTER_SWEEPING:
      return Zu;
    case he.CUSTOMIZE:
      return Kg;
    default:
      return "";
  }
}
function OT(n) {
  switch (n) {
    case Tn.VACUUM_AND_MOP:
      return Hs;
    case Tn.MOP_AFTER_VACUUM:
      return Zu;
    default:
      return "";
  }
}
function RT(n) {
  switch (n) {
    case Qi.QUIET:
    case Qi.SILENT:
      return Mu;
    case Qi.STANDARD:
      return Yu;
    case Qi.STRONG:
      return Vg;
    case Qi.TURBO:
      return Ou;
  }
}
function DT(n) {
  switch (n) {
    case si.QUICK:
      return Gw;
    case si.STANDARD:
      return Iw;
    case si.INTENSIVE:
      return Hw;
    case si.DEEP:
      return Pw;
  }
}
function jT(n) {
  switch (n) {
    case ci.BY_AREA:
      return Lw;
    case ci.BY_TIME:
      return Uw;
    case ci.BY_ROOM:
      return qw;
    default:
      return "⚙️";
  }
}
function LT(n) {
  return Xg;
}
function UT(n, a) {
  if (a)
    switch (n) {
      case Us.LOW:
        return a("custom_mode.water_low");
      case Us.MEDIUM:
        return a("custom_mode.water_medium");
      case Us.HIGH:
        return a("custom_mode.water_high");
      default:
        return n;
    }
  return n;
}
function qT(n) {
  return Xg;
}
function GT(n, a) {
  if (a)
    switch (n) {
      case ui.SLIGHTLY_DRY:
        return a("custom_mode.slightly_dry");
      case ui.MOIST:
        return a("custom_mode.moist");
      case ui.WET:
        return a("custom_mode.wet");
      default:
        return n;
    }
  return n;
}
const ng = 0.05, ag = 2e4, ig = 1e4;
function IT(n, a, o, s = 0) {
  const l = n.filter(
    (R) => R.x0 !== void 0 && R.y0 !== void 0 && R.x1 !== void 0 && R.y1 !== void 0
  );
  if (l.length === 0)
    return [];
  const d = l.flatMap((R) => [R.x0, R.x1]), _ = l.flatMap((R) => [R.y0, R.y1]), m = Math.min(...d), p = Math.max(...d), f = Math.min(..._), v = Math.max(..._);
  if (m === p || f === v)
    return ne.warn("RoomParser", "Degenerate room bounds, cannot auto-calibrate"), [];
  const y = a * ng, w = o * ng, E = y, z = a - y, N = w, j = o - w;
  switch (ne.debug("RoomParser", "Auto-calibrating from rooms:", {
    rotation: s,
    vacuumBounds: { minX: m, maxX: p, minY: f, maxY: v },
    imageBounds: { width: a, height: o }
  }), s) {
    case 90:
      return [
        { vacuum: { x: m, y: f }, map: { x: E, y: N } },
        { vacuum: { x: p, y: f }, map: { x: E, y: j } },
        { vacuum: { x: m, y: v }, map: { x: z, y: N } }
      ];
    case 180:
      return [
        { vacuum: { x: m, y: f }, map: { x: z, y: N } },
        { vacuum: { x: p, y: f }, map: { x: E, y: N } },
        { vacuum: { x: m, y: v }, map: { x: z, y: j } }
      ];
    case 270:
      return [
        { vacuum: { x: m, y: f }, map: { x: z, y: j } },
        { vacuum: { x: p, y: f }, map: { x: z, y: N } },
        { vacuum: { x: m, y: v }, map: { x: E, y: j } }
      ];
    default:
      return [
        { vacuum: { x: m, y: f }, map: { x: E, y: j } },
        { vacuum: { x: p, y: f }, map: { x: z, y: j } },
        { vacuum: { x: m, y: v }, map: { x: E, y: N } }
      ];
  }
}
function Mh(n, a, o) {
  return o ? o[String(n)] ?? o[a] ?? a : a;
}
function Oh(n, a, o) {
  const s = n.states[a];
  if (!s?.attributes?.rooms)
    return ne.debug("RoomParser", "No rooms found in camera entity:", a), [];
  const l = s.attributes.rooms;
  return Object.values(l).map((d) => ({
    id: d.room_id,
    name: Mh(d.room_id, d.name, o),
    icon: d.icon,
    visibility: d.visibility,
    x0: d.x0,
    y0: d.y0,
    x1: d.x1,
    y1: d.y1,
    x: d.x,
    y: d.y
  }));
}
function Js(n, a, o, s, l, d, _ = 0) {
  const m = o && o.length >= 3;
  let p = o;
  if (!m && d && d.length > 0 && (p = IT(d, s, l, _)), !p || p.length < 3) {
    const j = (n + ig) / ag, R = (a + ig) / ag;
    return {
      x: j * s,
      y: R * l
    };
  }
  const f = p[0], v = p[1], y = p[2], w = (v.map.x - f.map.x) / (v.vacuum.x - f.vacuum.x || 1), E = (y.map.y - f.map.y) / (y.vacuum.y - f.vacuum.y || 1), z = f.map.x + (n - f.vacuum.x) * w, N = f.map.y + (a - f.vacuum.y) * E;
  return { x: z, y: N };
}
function HT(n, a, o, s, l, d = 0) {
  if (n.x0 === void 0 || n.y0 === void 0 || n.x1 === void 0 || n.y1 === void 0)
    return ne.warn("Room missing coordinates:", n), "";
  const _ = (y, w) => Js(y, w, a, o, s, l, d), m = _(n.x0, n.y0), p = _(n.x1, n.y0), f = _(n.x1, n.y1), v = _(n.x0, n.y1);
  return `M ${m.x} ${m.y} L ${p.x} ${p.y} L ${f.x} ${f.y} L ${v.x} ${v.y} Z`;
}
function PT(n, a, o) {
  if (o)
    return o;
  const l = `camera.${a.split(".")[1]}_map`;
  if (og(n.states[l]))
    return l;
  for (const d of Object.keys(n.states))
    if (!(!d.startsWith("camera.") || !d.endsWith("_map") || d.includes("_map_")) && og(n.states[d]))
      return d;
  return l;
}
function og(n) {
  const a = n?.attributes;
  return a ? "rooms" in a || "vacuum_position" in a || "calibration_points" in a || "charger_position" in a : !1;
}
function BT(n, a, o) {
  if (!n)
    return null;
  const s = a.title || n.attributes?.friendly_name || "Dreame Vacuum", l = a.map_entity || `camera.${a.entity.split(".")[1]}_map`, d = n.attributes?.selected_map || "", _ = n.attributes?.rooms?.[d], m = Array.isArray(_) ? _.map((p) => ({
    id: p.id,
    name: p.name,
    x: 50,
    y: 50,
    icon: p.icon
  })) : [];
  return {
    deviceName: s,
    mapEntityId: l,
    rooms: m
  };
}
function ZT(n, a) {
  const o = je(n.attributes.status, ""), s = n.attributes.segment_cleaning || !1, l = n.attributes.zone_cleaning || !1;
  if (n.attributes.started) {
    if (s || o.toLowerCase().includes("room"))
      return "room";
    if (l || o.toLowerCase().includes("zone"))
      return "zone";
  }
  return a;
}
function YT(n, a, o, s) {
  const l = n.states[a], d = n.states[o], _ = /* @__PURE__ */ new Map();
  if (!l) return _;
  const m = l.attributes.segment_cleaning === !0, p = l.attributes.active_segments;
  if (!m || !p || !Array.isArray(p))
    return _;
  const f = d?.attributes?.rooms, v = /* @__PURE__ */ new Map();
  f && Object.values(f).forEach((y) => {
    v.set(y.room_id, Mh(y.room_id, y.name, s));
  });
  for (const y of p) {
    const w = v.get(y) || `Room ${y}`;
    _.set(y, w);
  }
  return _;
}
function VT({ deviceName: n, onSettingsClick: a }) {
  const { t: o } = Ie(), s = od(), l = Zt(), { rawState: d } = Rn(), _ = d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g, " "), m = je(l.attributes.cleaned_area, 0), p = je(l.attributes.cleaning_time, 0), f = je(l.attributes.battery, 0), v = () => {
    const w = l.attributes.battery;
    return Na(w) ? w >= 80 ? Tw : w >= 60 ? kw : w >= 20 ? zw : Ew : null;
  }, y = je(l.attributes.cleaning_progress, 0) || je(l.attributes.drying_progress, 0);
  return /* @__PURE__ */ h.jsxs("div", { className: "header", children: [
    /* @__PURE__ */ h.jsxs("div", { className: "header__top", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "header__title-wrapper", children: [
        /* @__PURE__ */ h.jsx("h2", { className: "header__title", children: n }),
        /* @__PURE__ */ h.jsx("p", { className: "header__status", children: _ })
      ] }),
      a && /* @__PURE__ */ h.jsx("button", { className: "header__settings-btn", onClick: a, type: "button", "aria-label": "Settings", children: /* @__PURE__ */ h.jsx(W0, {}) })
    ] }),
    d !== "sleeping" && y > 0 && /* @__PURE__ */ h.jsx("div", { className: "header__progress", children: /* @__PURE__ */ h.jsx("div", { className: "header__progress-bar", children: /* @__PURE__ */ h.jsx("div", { className: "header__progress-fill", style: { width: `${y}%` } }) }) }),
    /* @__PURE__ */ h.jsxs("div", { className: "header__stats", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "header__stat", children: [
        /* @__PURE__ */ h.jsx("span", { className: "header__stat-icon", children: Nw }),
        /* @__PURE__ */ h.jsxs("span", { className: "header__stat-value", children: [
          m,
          " ",
          s
        ] })
      ] }),
      /* @__PURE__ */ h.jsxs("div", { className: "header__stat", children: [
        /* @__PURE__ */ h.jsx("span", { className: "header__stat-icon", children: Aw }),
        /* @__PURE__ */ h.jsxs("span", { className: "header__stat-value--cleaning-time", children: [
          p,
          " ",
          o("units.minutes")
        ] })
      ] }),
      /* @__PURE__ */ h.jsxs("div", { className: "header__stat", children: [
        /* @__PURE__ */ h.jsx("span", { className: "header__stat-icon", children: v() }),
        /* @__PURE__ */ h.jsxs("span", { className: "header__stat-value", children: [
          f,
          " ",
          o("units.percent")
        ] })
      ] })
    ] })
  ] });
}
function KT() {
  const { t: n } = Ie(), a = Zt(), o = Rt(), s = Qs(), [l, d] = D.useState(!1), _ = D.useRef(null), m = a.attributes, p = D.useMemo(() => m.maps ?? [], [m.maps]), f = m.selected_map_id ?? m.selected_map, v = s.entity?.split(".")[1] ?? "", y = vt("select", v, Mn.SELECTED_MAP.key), E = xh(o, v, "selected_map").unavailable, z = D.useMemo(() => p.find((R) => R.id === f), [p, f]), N = z?.custom_name || z?.name || n("map_selector.unknown"), j = D.useCallback(
    (R) => {
      o.callService("select", "select_option", {
        entity_id: y,
        option: R.name
      }), d(!1);
    },
    [o, y]
  );
  return D.useEffect(() => {
    function R(U) {
      const Y = U.composedPath();
      _.current && !Y.includes(_.current) && d(!1);
    }
    if (l)
      return document.addEventListener("mousedown", R), () => document.removeEventListener("mousedown", R);
  }, [l]), D.useEffect(() => {
    function R(U) {
      U.key === "Escape" && d(!1);
    }
    if (l)
      return document.addEventListener("keydown", R), () => document.removeEventListener("keydown", R);
  }, [l]), /* @__PURE__ */ h.jsxs("div", { className: "map-selector", ref: _, children: [
    /* @__PURE__ */ h.jsxs(
      "button",
      {
        className: `map-selector__button ${l ? "map-selector__button--open" : ""} ${E ? "map-selector__button--disabled" : ""}`,
        onClick: () => !E && d(!l),
        type: "button",
        disabled: E,
        "aria-expanded": l,
        "aria-haspopup": "listbox",
        children: [
          /* @__PURE__ */ h.jsx("span", { className: "map-selector__icon", children: /* @__PURE__ */ h.jsx(Pu, { size: 16 }) }),
          /* @__PURE__ */ h.jsx("span", { className: "map-selector__label", children: N }),
          /* @__PURE__ */ h.jsx(xg, { className: `map-selector__chevron ${l ? "map-selector__chevron--open" : ""}` })
        ]
      }
    ),
    l && /* @__PURE__ */ h.jsx("div", { className: "map-selector__dropdown", role: "listbox", children: p.map((R) => {
      const U = R.id === f, Y = R.custom_name || R.name;
      return /* @__PURE__ */ h.jsxs(
        "button",
        {
          className: `map-selector__option ${U ? "map-selector__option--selected" : ""}`,
          onClick: () => j(R),
          type: "button",
          role: "option",
          "aria-selected": U,
          children: [
            /* @__PURE__ */ h.jsx("span", { className: "map-selector__option-name", children: Y }),
            U && /* @__PURE__ */ h.jsx(Cg, { className: "map-selector__option-check" })
          ]
        },
        R.id
      );
    }) })
  ] });
}
function XT({
  cleaningMode: n,
  cleanGeniusMode: a,
  cleangenius: o,
  onClick: s,
  onShortcutsClick: l,
  onRepeatClick: d,
  repeatCount: _ = 1
}) {
  const { t: m } = Ie(), { phase: p, isCustomizedCleaning: f } = Rn(), y = p === "cleaning" || p === "paused" || f, w = (U) => f ? Kg : U === he.SWEEPING ? Zg : U === he.MOPPING ? Yg : U === he.SWEEPING_AND_MOPPING ? Hs : U === he.MOPPING_AFTER_SWEEPING ? Zu : Hs, E = (U) => U === Tn.VACUUM_AND_MOP ? m("cleaning_mode_button.vac_and_mop") : U === Tn.MOP_AFTER_VACUUM ? m("cleaning_mode_button.mop_after_vac") : "", z = (U) => f ? m("customize.title") : U === he.MOPPING_AFTER_SWEEPING ? m("cleaning_mode_button.mop_after_vac") : U === he.SWEEPING_AND_MOPPING ? m("cleaning_mode_button.vac_and_mop") : U === he.SWEEPING ? m("cleaning_mode_button.vacuum") : U === he.MOPPING ? m("cleaning_mode_button.mop") : "", N = () => m(o === "Off" ? "cleaning_mode_button.prefix_custom" : "cleaning_mode_button.prefix_cleangenius"), j = (U) => {
    U.stopPropagation(), l?.();
  }, R = (U) => {
    U.stopPropagation(), d?.();
  };
  return /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-button-wrapper", children: [
    /* @__PURE__ */ h.jsxs("button", { onClick: s, className: "cleaning-mode-button", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-button__content", children: [
        /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-button__icon", children: w(n) }),
        /* @__PURE__ */ h.jsxs("span", { className: "cleaning-mode-button__text", children: [
          N(),
          o === "Off" ? z(n) : E(a)
        ] })
      ] }),
      /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-button__arrow", children: "›" })
    ] }),
    d && /* @__PURE__ */ h.jsxs(
      "button",
      {
        className: `cleaning-mode-button-wrapper__repeats ${y ? "cleaning-mode-button-wrapper__repeats--disabled" : ""}`,
        onClick: R,
        title: m("cleaning_mode_button.repeats_tooltip"),
        disabled: y,
        children: [
          "x",
          _
        ]
      }
    ),
    o === "Off" && l && /* @__PURE__ */ h.jsx(
      "button",
      {
        className: `cleaning-mode-button-wrapper__shortcuts ${y ? "cleaning-mode-button-wrapper__shortcuts--disabled" : ""}`,
        onClick: j,
        title: m("cleaning_mode_button.view_shortcuts"),
        disabled: y,
        children: Dw
      }
    )
  ] });
}
var li = function(n, a) {
  return Number(n.toFixed(a));
}, FT = function(n, a) {
  return a;
}, Re = function(n, a, o) {
  o && typeof o == "function" && o(n, a);
}, WT = function(n) {
  return -Math.cos(n * Math.PI) / 2 + 0.5;
}, $T = function(n) {
  return n;
}, QT = function(n) {
  return n * n;
}, JT = function(n) {
  return n * (2 - n);
}, eA = function(n) {
  return n < 0.5 ? 2 * n * n : -1 + (4 - 2 * n) * n;
}, tA = function(n) {
  return n * n * n;
}, nA = function(n) {
  return --n * n * n + 1;
}, aA = function(n) {
  return n < 0.5 ? 4 * n * n * n : (n - 1) * (2 * n - 2) * (2 * n - 2) + 1;
}, iA = function(n) {
  return n * n * n * n;
}, oA = function(n) {
  return 1 - --n * n * n * n;
}, rA = function(n) {
  return n < 0.5 ? 8 * n * n * n * n : 1 - 8 * --n * n * n * n;
}, sA = function(n) {
  return n * n * n * n * n;
}, lA = function(n) {
  return 1 + --n * n * n * n * n;
}, cA = function(n) {
  return n < 0.5 ? 16 * n * n * n * n * n : 1 + 16 * --n * n * n * n * n;
}, Rh = {
  easeOut: WT,
  linear: $T,
  easeInQuad: QT,
  easeOutQuad: JT,
  easeInOutQuad: eA,
  easeInCubic: tA,
  easeOutCubic: nA,
  easeInOutCubic: aA,
  easeInQuart: iA,
  easeOutQuart: oA,
  easeInOutQuart: rA,
  easeInQuint: sA,
  easeOutQuint: lA,
  easeInOutQuint: cA
}, Dh = function(n) {
  typeof n == "number" && cancelAnimationFrame(n);
}, kn = function(n) {
  n.mounted && (Dh(n.animation), n.isAnimating = !1, n.animation = null, n.velocity = null);
};
function jh(n, a, o, s) {
  if (n.mounted) {
    var l = (/* @__PURE__ */ new Date()).getTime(), d = 1;
    kn(n), n.animation = function() {
      if (!n.mounted)
        return Dh(n.animation);
      var _ = (/* @__PURE__ */ new Date()).getTime() - l, m = _ / o, p = Rh[a], f = p(m);
      _ >= o ? (s(d), n.animation = null) : n.animation && (s(f), requestAnimationFrame(n.animation));
    }, requestAnimationFrame(n.animation);
  }
}
function uA(n) {
  var a = n.scale, o = n.positionX, s = n.positionY;
  return !(Number.isNaN(a) || Number.isNaN(o) || Number.isNaN(s));
}
function La(n, a, o, s) {
  var l = uA(a);
  if (!(!n.mounted || !l)) {
    var d = n.setState, _ = n.state, m = _.scale, p = _.positionX, f = _.positionY, v = a.scale - m, y = a.positionX - p, w = a.positionY - f;
    o === 0 ? d(a.scale, a.positionX, a.positionY) : jh(n, s, o, function(E) {
      E !== 1 ? n.isAnimating = !0 : n.isAnimating = !1;
      var z = m + v * E, N = p + y * E, j = f + w * E;
      d(z, N, j);
    });
  }
}
function dA(n, a, o) {
  var s = n.offsetWidth, l = n.offsetHeight, d = a.offsetWidth, _ = a.offsetHeight, m = d * o, p = _ * o, f = s - m, v = l - p;
  return {
    wrapperWidth: s,
    wrapperHeight: l,
    newContentWidth: m,
    newDiffWidth: f,
    newContentHeight: p,
    newDiffHeight: v
  };
}
var _A = function(n, a, o, s, l, d, _) {
  var m = n > a ? o * (_ ? 0.5 : 1) : 0, p = s > l ? d * (_ ? 0.5 : 1) : 0, f = n - a - m, v = m, y = s - l - p, w = p;
  return {
    minPositionX: f,
    maxPositionX: v,
    minPositionY: y,
    maxPositionY: w,
    scaleWidthFactor: m,
    scaleHeightFactor: p
  };
}, sd = function(n, a) {
  var o = n.wrapperComponent, s = n.contentComponent, l = n.setup, d = l.centerZoomedOut, _ = l.disablePadding;
  if (!o || !s)
    throw new Error("Components are not mounted");
  var m = dA(o, s, a), p = m.wrapperWidth, f = m.wrapperHeight, v = m.newContentWidth, y = m.newContentHeight, w = m.newDiffWidth, E = m.newDiffHeight, z = _A(p, v, w, f, y, E, !!d), N = p >= v && f >= y;
  _ && N && !d && (z.minPositionX = 0, z.maxPositionX = 0, z.minPositionY = 0, z.maxPositionY = 0);
  var j = n.setup, R = j.minPositionX, U = j.maxPositionX, Y = j.minPositionY, P = j.maxPositionY;
  return R != null && (z.minPositionX = p * (1 - a) + R * a), U != null && (z.maxPositionX = U * a), Y != null && (z.minPositionY = f * (1 - a) + Y * a), P != null && (z.maxPositionY = P * a), z;
}, ir = function(n, a, o, s) {
  return s ? n < a ? li(a, 2) : n > o ? li(o, 2) : li(n, 2) : li(n, 2);
}, io = function(n, a) {
  var o = sd(n, a);
  return n.bounds = o, o;
};
function cr(n, a, o, s, l, d, _) {
  var m = o.minPositionX, p = o.minPositionY, f = o.maxPositionX, v = o.maxPositionY, y = 0, w = 0;
  _ && (y = l, w = d);
  var E = ir(n, m - y, f + y, s), z = ir(a, p - w, v + w, s);
  return { x: E, y: z };
}
function el(n, a, o, s, l, d) {
  var _ = n.state, m = _.scale, p = _.positionX, f = _.positionY, v = s - m;
  if (typeof a != "number" || typeof o != "number")
    return console.error("Mouse X and Y position were not provided!"), { x: p, y: f };
  var y = p - a * v, w = f - o * v, E = cr(y, w, l, d, 0, 0, null);
  return E;
}
var rg = 1e-7;
function ur(n, a, o, s, l) {
  var d = l ? s : 0, _ = Math.max(a - d, rg), m = o + d;
  return !Number.isNaN(o) && n >= m ? m : !Number.isNaN(a) && n <= _ ? _ : Math.max(n, rg);
}
var sg = function(n, a) {
  var o = n.setup.panning.excluded, s = n.isInitialized, l = n.wrapperComponent, d = a.target, _ = "shadowRoot" in d && "composedPath" in a, m = _ ? a.composedPath().some(function(v) {
    return v instanceof Element ? l?.contains(v) : !1;
  }) : l?.contains(d), p = s && d && m;
  if (!p)
    return !1;
  var f = dr(d, o);
  return !(f || d.getAttribute("draggable") === "true" || d.getAttribute("contenteditable") === "true" || d.isContentEditable);
}, lg = function(n) {
  var a = n.isInitialized, o = n.isPanning, s = n.setup, l = s.panning.disabled, d = a && o && !l;
  return !!d;
}, mA = function(n, a) {
  var o = n.state, s = o.positionX, l = o.positionY;
  n.isPanning = !0;
  var d = a.clientX, _ = a.clientY;
  n.startCoords = { x: d - s, y: _ - l };
}, fA = function(n, a) {
  var o = a.touches, s = n.state, l = s.positionX, d = s.positionY;
  n.isPanning = !0;
  var _ = o.length === 1;
  if (_) {
    var m = o[0].clientX, p = o[0].clientY;
    n.startCoords = { x: m - l, y: p - d };
  }
};
function pA(n) {
  var a = n.state, o = a.positionX, s = a.positionY, l = a.scale, d = n.setup, _ = d.disabled, m = d.limitToBounds, p = d.centerZoomedOut, f = n.wrapperComponent;
  if (!(_ || !f || !n.bounds)) {
    var v = n.bounds, y = v.maxPositionX, w = v.minPositionX, E = v.maxPositionY, z = v.minPositionY, N = o > y || o < w, j = s > E || s < z, R = o > y ? f.offsetWidth : n.setup.minPositionX || 0, U = s > E ? f.offsetHeight : n.setup.minPositionY || 0, Y = el(n, R, U, l, n.bounds, m || p), P = Y.x, I = Y.y;
    return {
      scale: l,
      positionX: N ? P : o,
      positionY: j ? I : s
    };
  }
}
function Lh(n, a, o, s, l) {
  var d = n.setup.limitToBounds, _ = n.wrapperComponent, m = n.bounds, p = n.state, f = p.scale, v = p.positionX, y = p.positionY;
  if (!(_ === null || m === null || a === v && o === y)) {
    var w = cr(a, o, m, d, s, l, _), E = w.x, z = w.y;
    n.setState(f, E, z);
  }
}
var gA = function(n, a, o) {
  var s = n.startCoords, l = n.state, d = n.setup.panning, _ = d.lockAxisX, m = d.lockAxisY, p = l.positionX, f = l.positionY;
  if (!s)
    return { x: p, y: f };
  var v = a - s.x, y = o - s.y, w = _ ? p : v, E = m ? f : y;
  return { x: w, y: E };
}, Ra = function(n, a, o) {
  var s = n.setup, l = n.state, d = s.minScale, _ = s.disablePadding, m = s.centerZoomedOut, p = o ?? l.scale;
  return a > 0 && p >= d && !_ && !m ? a : 0;
}, Ca;
(function(n) {
  n.TRACK_PAD = "track_pad", n.MOUSE = "mouse", n.TOUCH = "touch";
})(Ca || (Ca = {}));
var hA = function(n) {
  var a = n.mounted, o = n.wrapperComponent, s = n.contentComponent, l = n.setup, d = l.disabled, _ = l.velocityAnimation, m = l.limitToBounds, p = n.state.scale, f = _.disabled;
  if (f || d || !a || !o || !s)
    return !1;
  if (!m)
    return !0;
  var v = o.offsetWidth < s.offsetWidth * p || o.offsetHeight < s.offsetHeight * p;
  return v;
}, vA = function(n) {
  var a = n.mounted, o = n.velocity, s = n.bounds, l = n.setup, d = l.disabled, _ = l.velocityAnimation, m = _.disabled, p = !m && !d && a;
  return !(!p || !o || !s);
};
function yA(n, a) {
  var o = n.setup.velocityAnimation, s = o.animationTime, l = o.maxAnimationTime, d = o.inertia;
  return Math.min(s * Math.max(1, Math.abs(a / d)), l);
}
function cg(n, a, o, s, l, d, _, m, p, f) {
  if (l) {
    if (a > _ && o > _) {
      var v = _ + (n - _) * f;
      return v > p ? p : v < _ ? _ : v;
    }
    if (a < d && o < d) {
      var v = d + (n - d) * f;
      return v < m ? m : v > d ? d : v;
    }
  }
  return s ? a : ir(n, d, _, l);
}
function bA(n) {
  var a = 1, o = n.offsetWidth / window.innerWidth;
  return Number.isNaN(o) ? a : Math.min(a, o);
}
var Eu = function(n, a, o) {
  var s = 0, l = n * o;
  return Number.isNaN(l) ? s : n < 0 ? Math.max(l, -a) : Math.min(l, a);
};
function wA(n, a, o) {
  var s, l, d = hA(n);
  if (d) {
    var _ = n.lastMousePosition, m = n.velocityTime, p = n.setup, f = n.wrapperComponent, v = p.velocityAnimation, y = v.maxStrengthMouse, w = v.maxStrengthTouch, E = v.sensitivityTouch, z = v.sensitivityMouse, N = Date.now();
    if (_ && m && f) {
      var j = bA(f), R = (s = {}, s[Ca.TOUCH] = E, s[Ca.MOUSE] = z, s)[o], U = (l = {}, l[Ca.TOUCH] = w, l[Ca.MOUSE] = y, l)[o], Y = a.x - _.x, P = a.y - _.y, I = Eu(Y / j, U, R), F = Eu(P / j, U, R), V = N - m, W = Y * Y + P * P, J = Eu(Math.sqrt(W) / V, U, R);
      n.velocity = { velocityX: I, velocityY: F, total: J };
    }
    n.lastMousePosition = a, n.velocityTime = N;
  }
}
function SA(n) {
  var a = n.velocity, o = n.bounds, s = n.setup, l = n.wrapperComponent, d = vA(n);
  if (!(!d || !a || !o || !l)) {
    var _ = a.velocityX, m = a.velocityY, p = a.total, f = o.maxPositionX, v = o.minPositionX, y = o.maxPositionY, w = o.minPositionY, E = s.limitToBounds, z = s.autoAlignment, N = s.zoomAnimation, j = s.panning, R = j.lockAxisY, U = j.lockAxisX, Y = N.animationType, P = z.sizeX, I = z.sizeY, F = z.velocityAlignmentTime, V = F, W = yA(n, p), J = Math.max(W, V), se = Ra(n, P), _e = Ra(n, I), ie = se * l.offsetWidth / 100, Ce = _e * l.offsetHeight / 100, we = f + ie, xe = v - ie, M = y + Ce, K = w - Ce, Q = n.state, me = (/* @__PURE__ */ new Date()).getTime();
    jh(n, Y, J, function(pe) {
      var k = n.state, q = k.scale, X = k.positionX, $ = k.positionY, te = (/* @__PURE__ */ new Date()).getTime() - me, le = te / V, ve = Rh[z.animationType], Ye = 1 - ve(Math.min(1, le)), Le = 1 - pe, kt = X + _ * Le, tn = $ + m * Le, Dt = cg(kt, Q.positionX, X, U, E, v, f, xe, we, Ye), yn = cg(tn, Q.positionY, $, R, E, w, y, K, M, Ye);
      if (X !== kt || $ !== tn) {
        n.setState(q, Dt, yn);
        var Tt = n.props.onPanning;
        Tt && Tt(Ne(n), {});
      }
    });
  }
}
function ug(n, a) {
  var o = n.state, s = o.scale, l = o.positionX, d = o.positionY;
  n.panStartPosition = { x: l, y: d }, kn(n), io(n, s), window.TouchEvent !== void 0 && a instanceof TouchEvent ? fA(n, a) : mA(n, a);
}
function Uh(n, a) {
  var o = n.state.scale, s = n.setup, l = s.minScale, d = s.autoAlignment, _ = d.disabled, m = d.sizeX, p = d.sizeY, f = d.animationTime, v = d.animationType, y = _ || o < l || !m && !p;
  if (!y) {
    var w = pA(n);
    w && La(n, w, f, v);
  }
}
function dg(n, a, o, s) {
  var l = n.startCoords, d = n.setup, _ = d.autoAlignment, m = _.sizeX, p = _.sizeY;
  if (l) {
    var f = gA(n, a, o), v = f.x, y = f.y, w = Ra(n, m), E = Ra(n, p);
    wA(n, { x: v, y }, s), Lh(n, v, y, w, E);
  }
}
function EA(n, a) {
  if (n.isPanning) {
    var o = n.velocity, s = n.wrapperComponent, l = n.contentComponent;
    n.isPanning = !1;
    var d = n.state, _ = d.positionX, m = d.positionY, p = d.scale, f = n.panStartPosition;
    if (n.panStartPosition = null, f) {
      var v = _ - f.x, y = m - f.y;
      if (v * v + y * y <= 25)
        return;
    }
    n.isAnimating = !1, n.animation = null;
    var w = s?.offsetWidth || 0, E = s?.offsetHeight || 0, z = (l?.offsetWidth || 0) * p, N = (l?.offsetHeight || 0) * p, j = !n.setup.limitToBounds || w < z || E < N, R = !a && o && o.total > 0.1 && j;
    R ? SA(n) : Uh(n);
  }
}
function ld(n, a, o, s) {
  var l = n.setup, d = l.minScale, _ = l.maxScale, m = l.limitToBounds, p = ur(li(a, 2), d, _, 0, !1), f = io(n, p), v = el(n, o, s, p, f, m), y = v.x, w = v.y;
  return { scale: p, positionX: y, positionY: w };
}
function cd(n, a, o) {
  var s = n.state.scale, l = n.wrapperComponent, d = n.setup, _ = d.minScale, m = d.maxScale, p = d.limitToBounds, f = d.zoomAnimation, v = f.disabled, y = f.animationTime, w = f.animationType, E = s >= _ && s <= m, z = v || E;
  if ((s >= 1 || p) && Uh(n), !(z || !l || !n.mounted)) {
    var N = a || l.offsetWidth / 2, j = o || l.offsetHeight / 2, R = s < _ ? _ : m, U = ld(n, R, N, j);
    U && La(n, U, y, w);
  }
}
var hn = function() {
  return hn = Object.assign || function(a) {
    for (var o, s = 1, l = arguments.length; s < l; s++) {
      o = arguments[s];
      for (var d in o) Object.prototype.hasOwnProperty.call(o, d) && (a[d] = o[d]);
    }
    return a;
  }, hn.apply(this, arguments);
};
function _g(n, a, o) {
  for (var s = 0, l = a.length, d; s < l; s++)
    (d || !(s in a)) && (d || (d = Array.prototype.slice.call(a, 0, s)), d[s] = a[s]);
  return n.concat(d || Array.prototype.slice.call(a));
}
var zu = {
  scale: 1,
  positionX: 0,
  positionY: 0
}, ri = {
  disabled: !1,
  minPositionX: null,
  maxPositionX: null,
  minPositionY: null,
  maxPositionY: null,
  minScale: 1,
  maxScale: 8,
  limitToBounds: !0,
  centerZoomedOut: !1,
  centerOnInit: !1,
  disablePadding: !1,
  smooth: !0,
  detached: !1,
  wheel: {
    step: 0.015,
    disabled: !1,
    wheelDisabled: !1,
    touchPadDisabled: !1,
    activationKeys: [],
    excluded: []
  },
  trackPadPanning: {
    disabled: !0,
    velocityDisabled: !1,
    lockAxisX: !1,
    lockAxisY: !1,
    activationKeys: [],
    excluded: []
  },
  panning: {
    disabled: !1,
    velocityDisabled: !1,
    lockAxisX: !1,
    lockAxisY: !1,
    allowLeftClickPan: !0,
    allowMiddleClickPan: !0,
    allowRightClickPan: !0,
    activationKeys: [],
    excluded: []
  },
  pinch: {
    step: 5,
    disabled: !1,
    allowPanning: !0,
    excluded: []
  },
  doubleClick: {
    disabled: !1,
    step: 0.7,
    mode: "zoomIn",
    animationType: "easeOut",
    animationTime: 200,
    excluded: []
  },
  zoomAnimation: {
    disabled: !1,
    size: 0.4,
    animationTime: 200,
    animationType: "easeOut"
  },
  autoAlignment: {
    disabled: !1,
    sizeX: 100,
    sizeY: 100,
    animationTime: 200,
    velocityAlignmentTime: 400,
    animationType: "easeOut"
  },
  velocityAnimation: {
    disabled: !1,
    sensitivityMouse: 1,
    sensitivityTouch: 1.2,
    maxStrengthMouse: 20,
    maxStrengthTouch: 40,
    inertia: 1,
    animationTime: 300,
    maxAnimationTime: 800,
    animationType: "easeOut"
  }
}, qu = {
  wrapperClass: "react-transform-wrapper",
  contentClass: "react-transform-component"
}, qh = function(n) {
  var a, o, s, l, d, _, m, p, f, v = Math.max((a = n.minScale) !== null && a !== void 0 ? a : ri.minScale, 1e-7), y = (o = n.maxScale) !== null && o !== void 0 ? o : ri.maxScale, w = (s = n.initialScale) !== null && s !== void 0 ? s : zu.scale, E = Math.min(Math.max(w, v), y), z = ir((l = n.initialPositionX) !== null && l !== void 0 ? l : zu.positionX, (d = n.minPositionX) !== null && d !== void 0 ? d : -1 / 0, (_ = n.maxPositionX) !== null && _ !== void 0 ? _ : 1 / 0, n.minPositionX != null || n.maxPositionX != null), N = ir((m = n.initialPositionY) !== null && m !== void 0 ? m : zu.positionY, (p = n.minPositionY) !== null && p !== void 0 ? p : -1 / 0, (f = n.maxPositionY) !== null && f !== void 0 ? f : 1 / 0, n.minPositionY != null || n.maxPositionY != null);
  return {
    previousScale: E,
    scale: E,
    positionX: z,
    positionY: N
  };
}, mg = function(n) {
  var a = hn({}, ri);
  return Object.keys(n).forEach(function(o) {
    var s = o, l = typeof n[s] < "u", d = typeof ri[s] < "u";
    if (d && l) {
      var _ = Object.prototype.toString.call(ri[s]), m = _ === "[object Object]", p = _ === "[object Array]";
      m ? a[s] = hn(hn({}, ri[s]), n[s]) : p ? a[s] = _g(_g([], ri[s], !0), n[s]) : a[s] = n[s];
    }
  }), a.minScale <= 0 && (a.minScale = 1e-7), a;
}, Gh = function(n, a, o) {
  var s = n.state.scale, l = n.wrapperComponent, d = n.setup, _ = d.maxScale, m = d.minScale, p = d.zoomAnimation, f = d.smooth, v = p.size;
  if (!l)
    throw new Error("Wrapper is not mounted");
  var y = f ? s * Math.exp(a * o) : s + a * o, w = ur(li(y, 3), m, _, v, !1);
  return w;
};
function Ih(n, a, o, s, l) {
  var d, _, m = n.wrapperComponent, p = n.state, f = p.scale, v = p.positionX, y = p.positionY, w = n.setup.zoomAnimation;
  if (!m)
    return console.error("No WrapperComponent found");
  var E = w.disabled ? 0 : s, z = m.offsetWidth, N = m.offsetHeight, j = (z / 2 - v) / f, R = (N / 2 - y) / f, U = Gh(n, a, o), Y = ld(n, U, j, R);
  if (!Y)
    return console.error("Error during zoom event. New transformation state was not calculated.");
  var P = n.props, I = P.onZoomStart, F = P.onZoom, V = P.onZoomStop, W = new MouseEvent("mousemove", { bubbles: !0 }), J = Ne(n);
  Re(J, W, I), Re(J, W, F), La(n, Y, E, l);
  var se = (_ = (d = m.ownerDocument) === null || d === void 0 ? void 0 : d.defaultView) !== null && _ !== void 0 ? _ : typeof window < "u" ? window : null;
  se && se.setTimeout(function() {
    n.mounted && Re(Ne(n), W, V);
  }, E);
}
function Hh(n, a, o, s) {
  var l, d, _ = n.setup, m = n.wrapperComponent, p = n.contentComponent, f = _.limitToBounds, v = _.centerOnInit, y = qh(n.props), w = n.state, E = w.scale, z = w.positionX, N = w.positionY;
  if (m) {
    var j = y.positionX, R = y.positionY;
    if (v && p) {
      var U = ud(y.scale, m, p);
      j = U.positionX, R = U.positionY;
    }
    var Y = sd(n, y.scale), P = cr(j, R, Y, f, 0, 0, m), I = {
      scale: y.scale,
      positionX: P.x,
      positionY: P.y
    };
    if (!(E === y.scale && z === y.positionX && N === y.positionY)) {
      s?.();
      var F = n.props, V = F.onZoomStart, W = F.onZoom, J = F.onZoomStop, se = new MouseEvent("mousemove", { bubbles: !0 }), _e = Ne(n);
      Re(_e, se, V), Re(_e, se, W), La(n, I, a, o);
      var ie = (d = (l = m.ownerDocument) === null || l === void 0 ? void 0 : l.defaultView) !== null && d !== void 0 ? d : typeof window < "u" ? window : null;
      ie && ie.setTimeout(function() {
        n.mounted && Re(Ne(n), se, J);
      }, a);
    }
  }
}
function zA(n, a, o, s) {
  var l = n.getBoundingClientRect(), d = a.getBoundingClientRect(), _ = o.getBoundingClientRect(), m = d.x * s.scale, p = d.y * s.scale;
  return {
    x: (l.x - _.x + m) / s.scale,
    y: (l.y - _.y + p) / s.scale
  };
}
function kA(n, a, o, s, l) {
  s === void 0 && (s = 0), l === void 0 && (l = 0);
  var d = n.wrapperComponent, _ = n.contentComponent, m = n.state, p = n.setup, f = p.limitToBounds, v = p.minScale, y = p.maxScale;
  if (!d || !_)
    return m;
  var w = d.getBoundingClientRect(), E = a.getBoundingClientRect(), z = zA(a, d, _, m), N = z.x, j = z.y, R = E.width / m.scale, U = E.height / m.scale, Y = d.offsetWidth / R, P = d.offsetHeight / U, I = ur(o || Math.min(Y, P), v, y, 0, !1), F = (w.width - R * I) / 2, V = (w.height - U * I) / 2, W = (w.left - N) * I + F + s, J = (w.top - j) * I + V + l, se = sd(n, I), _e = cr(W, J, se, f, 0, 0, d), ie = _e.x, Ce = _e.y;
  return { positionX: ie, positionY: Ce, scale: I };
}
var TA = function(n) {
  return function(a, o, s) {
    a === void 0 && (a = 0.5), o === void 0 && (o = 300), s === void 0 && (s = "easeOut"), Ih(n, 1, a, o, s);
  };
}, AA = function(n) {
  return function(a, o, s) {
    a === void 0 && (a = 0.5), o === void 0 && (o = 300), s === void 0 && (s = "easeOut"), Ih(n, -1, a, o, s);
  };
}, NA = function(n) {
  return function(a, o, s, l, d) {
    l === void 0 && (l = 300), d === void 0 && (d = "easeOut");
    var _ = n.state, m = _.positionX, p = _.positionY, f = _.scale, v = n.wrapperComponent, y = n.contentComponent, w = n.setup.disabled;
    if (!(w || !v || !y)) {
      var E = {
        positionX: Number.isNaN(a) ? m : a,
        positionY: Number.isNaN(o) ? p : o,
        scale: Number.isNaN(s) ? f : s
      };
      La(n, E, l, d);
    }
  };
}, CA = function(n) {
  return function(a, o) {
    a === void 0 && (a = 200), o === void 0 && (o = "easeOut"), Hh(n, a, o);
  };
}, xA = function(n) {
  return function(a, o, s) {
    o === void 0 && (o = 200), s === void 0 && (s = "easeOut");
    var l = n.state, d = n.wrapperComponent, _ = n.contentComponent;
    if (d && _) {
      var m = ud(a || l.scale, d, _);
      La(n, m, o, s);
    }
  };
}, MA = function(n) {
  return function(a, o, s, l, d, _) {
    s === void 0 && (s = 600), l === void 0 && (l = "easeOut"), d === void 0 && (d = 0), _ === void 0 && (_ = 0), kn(n);
    var m = n.wrapperComponent, p = typeof a == "string" ? document.getElementById(a) : a;
    if (m && p && m.contains(p)) {
      var f = kA(n, p, o, d, _);
      La(n, f, s, l);
    }
  };
}, Vs = function(n) {
  return {
    instance: n,
    state: n.state,
    zoomIn: TA(n),
    zoomOut: AA(n),
    setTransform: NA(n),
    resetTransform: CA(n),
    centerView: xA(n),
    zoomToElement: MA(n)
  };
}, Ph = function(n) {
  return {
    instance: n,
    state: n.state
  };
}, Ne = function(n) {
  var a = {};
  return Object.assign(a, Ph(n)), Object.assign(a, Vs(n)), a;
}, ku = !1;
function Tu() {
  try {
    var n = {
      get passive() {
        return ku = !0, !1;
      }
    };
    return n;
  } catch {
    return ku = !1, ku;
  }
}
var js = ".".concat(qu.wrapperClass), dr = function(n, a) {
  return a.some(function(o) {
    return n.matches("".concat(js, " ").concat(o, ", ").concat(js, " .").concat(o, ", ").concat(js, " ").concat(o, " *, ").concat(js, " .").concat(o, " *"));
  });
}, or = function(n) {
  n && clearTimeout(n);
}, OA = function(n) {
  return Number.parseFloat(n.toFixed(8));
}, Bh = function(n, a, o) {
  var s = OA(o);
  return "translate(".concat(n, "px, ").concat(a, "px) scale(").concat(s, ")");
}, ud = function(n, a, o) {
  var s = o.offsetWidth * n, l = o.offsetHeight * n, d = (a.offsetWidth - s) / 2, _ = (a.offsetHeight - l) / 2;
  return {
    scale: n,
    positionX: d,
    positionY: _
  };
};
function RA(n, a) {
  n != null && (typeof n == "function" ? n(a) : n.current = a);
}
function DA(n) {
  return function(a) {
    n.forEach(function(o) {
      typeof o == "function" ? o(a) : o != null && (o.current = a);
    });
  };
}
var Zh = function(n, a) {
  var o = n.setup.wheel, s = o.disabled, l = o.wheelDisabled, d = o.touchPadDisabled, _ = o.excluded, m = n.isInitialized, p = n.isPanning, f = a.target, v = m && !p && !s && f;
  if (!v || l && !a.ctrlKey || d && a.ctrlKey)
    return !1;
  var y = dr(f, _);
  if (y)
    return !1;
  var w = n.isPressingKeys(n.setup.wheel.activationKeys);
  return !!w;
}, jA = function(n, a) {
  var o = n.setup, s = o.disabled, l = o.trackPadPanning, d = l.activationKeys, _ = l.excluded;
  if (!n.wrapperComponent || !n.contentComponent || s || l.disabled || a.ctrlKey)
    return !1;
  var m = Zh(n, a);
  if (m)
    return !1;
  var p = a.target, f = dr(p, _);
  if (f)
    return !1;
  var v = n.isPressingKeys(d);
  return !!v;
}, LA = function(n) {
  return n ? n.deltaY < 0 ? 1 : -1 : 0;
};
function UA(n, a) {
  var o = LA(n), s = FT(a, o);
  return s;
}
function Yh(n, a, o) {
  var s = a.getBoundingClientRect(), l = 0, d = 0;
  if ("clientX" in n)
    l = (n.clientX - s.left) / o, d = (n.clientY - s.top) / o;
  else {
    var _ = n.touches[0];
    l = (_.clientX - s.left) / o, d = (_.clientY - s.top) / o;
  }
  return (Number.isNaN(l) || Number.isNaN(d)) && console.error("No mouse or touch offset found"), {
    x: l,
    y: d
  };
}
var qA = function(n, a, o, s, l) {
  var d = n.state.scale, _ = n.wrapperComponent, m = n.setup, p = m.maxScale, f = m.minScale, v = m.zoomAnimation, y = m.disablePadding, w = v.size, E = v.disabled;
  if (!_)
    throw new Error("Wrapper is not mounted");
  var z = d + a * o, N = s ? !1 : !E, j = ur(z, f, p, w, N && !y);
  return j;
}, Vh = function(n, a) {
  var o = n.previousWheelEvent, s = n.state.scale, l = n.setup, d = l.maxScale, _ = l.minScale;
  return o ? s < d || s > _ || Math.sign(o.deltaY) !== Math.sign(a.deltaY) || o.deltaY > 0 && o.deltaY < a.deltaY || o.deltaY < 0 && o.deltaY > a.deltaY || Math.sign(o.deltaY) !== Math.sign(a.deltaY) : !1;
}, GA = function(n, a) {
  var o = n.setup.pinch, s = o.disabled, l = o.excluded, d = n.isInitialized, _ = a.target, m = d && !s && _;
  if (!m)
    return !1;
  var p = dr(_, l);
  return !p;
}, IA = function(n) {
  var a = n.setup.pinch.disabled, o = n.isInitialized, s = n.pinchStartDistance, l = o && !a && s !== null;
  return !!l;
}, HA = function(n, a, o) {
  var s = o.getBoundingClientRect(), l = n.touches, d = l[0].clientX - s.left, _ = l[0].clientY - s.top, m = l[1].clientX - s.left, p = l[1].clientY - s.top;
  return {
    x: (d + m) / 2 / a,
    y: (_ + p) / 2 / a
  };
}, Kh = function(n) {
  return Math.sqrt(Math.pow(n.touches[0].pageX - n.touches[1].pageX, 2) + Math.pow(n.touches[0].pageY - n.touches[1].pageY, 2));
}, PA = 5, BA = function(n, a) {
  var o = n.pinchStartScale, s = n.pinchStartDistance, l = n.setup, d = l.maxScale, _ = l.minScale, m = l.zoomAnimation, p = l.disablePadding, f = l.pinch, v = m.size, y = m.disabled, w = f.step;
  if (!o || s === null)
    throw new Error("Pinch touches distance was not provided");
  if (a < 0)
    return n.state.scale;
  var E = a / s, z = E * o, N = (z - o) * (w / PA), j = o + N, R = j === 1 / 0 ? 0 : li(j, 10);
  return ur(R, _, d, v, !y && !p);
}, Xh = 160, Fh = 100, ZA = function(n, a) {
  var o = n.props, s = o.onWheelStart, l = o.onZoomStart;
  n.wheelStopEventTimer || (kn(n), Re(Ne(n), a, s), Re(Ne(n), a, l));
}, YA = function(n, a) {
  var o = n.props, s = o.onWheel, l = o.onZoom, d = n.contentComponent, _ = n.setup, m = n.state, p = m.scale, f = _.limitToBounds, v = _.centerZoomedOut, y = _.zoomAnimation, w = _.wheel, E = _.disablePadding, z = _.smooth, N = y.size, j = y.disabled, R = w.step;
  if (!d)
    throw new Error("Component not mounted");
  a.preventDefault(), a.stopPropagation();
  var U = UA(a, null), Y = z ? R * Math.abs(a.deltaY) : R, P = qA(n, U, Y, !a.ctrlKey);
  if (p !== P) {
    var I = io(n, P), F = Yh(a, d, p), V = j || N === 0 || v || E, W = f && V, J = el(n, F.x, F.y, P, I, W), se = J.x, _e = J.y;
    n.previousWheelEvent = a, n.setState(P, se, _e), Re(Ne(n), a, s), Re(Ne(n), a, l);
  }
}, VA = function(n, a) {
  var o = n.props, s = o.onWheelStop, l = o.onZoomStop;
  or(n.wheelAnimationTimer), n.wheelAnimationTimer = setTimeout(function() {
    n.mounted && (cd(n, a.x, a.y), n.wheelAnimationTimer = null);
  }, Fh);
  var d = Vh(n, a);
  d && (or(n.wheelStopEventTimer), n.wheelStopEventTimer = setTimeout(function() {
    n.mounted && (n.wheelStopEventTimer = null, Re(Ne(n), a, s), Re(Ne(n), a, l));
  }, Xh));
}, KA = function(n, a) {
  var o = n.props, s = o.onWheelStart, l = o.onPanningStart;
  n.wheelStopEventTimer || (kn(n), Re(Ne(n), a, s), Re(Ne(n), a, l));
}, XA = function(n, a) {
  var o = n.props, s = o.onWheelStop, l = o.onPanningStop;
  or(n.wheelAnimationTimer), n.wheelAnimationTimer = setTimeout(function() {
    n.mounted && (cd(n, a.x, a.y), n.wheelAnimationTimer = null);
  }, Fh);
  var d = Vh(n, a);
  d && (or(n.wheelStopEventTimer), n.wheelStopEventTimer = setTimeout(function() {
    n.mounted && (n.wheelStopEventTimer = null, Re(Ne(n), a, s), Re(Ne(n), a, l));
  }, Xh));
}, Wh = function(n) {
  for (var a = 0, o = 0, s = 0; s < 2; s += 1)
    a += n.touches[s].clientX, o += n.touches[s].clientY;
  var l = a / 2, d = o / 2;
  return { x: l, y: d };
}, FA = function(n, a) {
  var o = Kh(a);
  n.pinchStartDistance = o, n.lastDistance = o, n.pinchStartScale = n.state.scale, n.isPanning = !1, n.isPinching = !0, n.pinchPreviousCenter = Wh(a), kn(n);
}, WA = function(n, a) {
  var o = n.contentComponent, s = n.pinchStartDistance, l = n.wrapperComponent, d = n.pinchPreviousCenter, _ = n.state.scale, m = n.setup, p = m.limitToBounds, f = m.centerZoomedOut, v = m.zoomAnimation, y = m.autoAlignment, w = m.pinch, E = m.panning, z = v.disabled, N = v.size, j = w.allowPanning;
  if (!(s === null || !o)) {
    var R = HA(a, _, o);
    if (!(!Number.isFinite(R.x) || !Number.isFinite(R.y))) {
      var U = Kh(a), Y = BA(n, U), P = Wh(a), I = _ / Y, F = (P.x - (d?.x || 0)) * I, V = (P.y - (d?.y || 0)) * I;
      if (!(Y === _ && F === 0 && V === 0)) {
        n.pinchPreviousCenter = P;
        var W = io(n, Y), J = z || N === 0 || f, se = p && J, _e = el(n, R.x, R.y, Y, W, se), ie = _e.x, Ce = _e.y;
        if (n.pinchMidpoint = R, n.lastDistance = U, E.disabled || !j)
          n.setState(Y, ie, Ce);
        else {
          var we = y.sizeX, xe = y.sizeY, M = Ra(n, we, Y), K = Ra(n, xe, Y), Q = ie + F, me = Ce + V, pe = cr(Q, me, W, p, M, K, l), k = pe.x, q = pe.y;
          n.setState(Y, k, q);
        }
      }
    }
  }
}, $A = function(n) {
  var a = n.pinchMidpoint;
  n.velocity = null, n.lastDistance = null, n.pinchMidpoint = null, n.pinchStartScale = null, n.pinchStartDistance = null, n.isPinching = !1, cd(n, a?.x, a?.y);
}, $h = function(n, a) {
  var o = n.props.onZoomStop, s = n.setup.doubleClick.animationTime;
  or(n.doubleClickStopEventTimer), n.doubleClickStopEventTimer = setTimeout(function() {
    n.doubleClickStopEventTimer = null, Re(Ne(n), a, o);
  }, s);
}, QA = function(n, a) {
  var o = n.props, s = o.onZoomStart, l = o.onZoom, d = n.setup.doubleClick, _ = d.animationTime, m = d.animationType;
  Re(Ne(n), a, s), Hh(n, _, m, function() {
    return Re(Ne(n), a, l);
  }), $h(n, a);
};
function JA(n, a) {
  return n === "toggle" ? a === 1 ? 1 : -1 : n === "zoomOut" ? -1 : 1;
}
function eN(n, a) {
  var o = n.setup, s = n.doubleClickStopEventTimer, l = n.state, d = n.contentComponent, _ = l.scale, m = n.props, p = m.onZoomStart, f = m.onZoom, v = o.doubleClick, y = v.disabled, w = v.mode, E = v.step, z = v.animationTime, N = v.animationType;
  if (!y && !s) {
    if (w === "reset")
      return QA(n, a);
    if (!d)
      return console.error("No ContentComponent found");
    var j = JA(w, n.state.scale), R = Gh(n, j, E);
    if (_ !== R) {
      Re(Ne(n), a, p);
      var U = Yh(a, d, _), Y = ld(n, R, U.x, U.y);
      if (!Y)
        return console.error("Error during zoom event. New transformation state was not calculated.");
      Re(Ne(n), a, f), La(n, Y, z, N), $h(n, a);
    }
  }
}
var tN = function(n, a) {
  var o = n.isInitialized, s = n.setup, l = n.wrapperComponent, d = s.doubleClick, _ = d.disabled, m = d.excluded, p = a.target, f = l?.contains(p), v = o && p && f && !_;
  if (!v)
    return !1;
  var y = dr(p, m);
  return !y;
}, nN = (
  /** @class */
  /* @__PURE__ */ (function() {
    function n(a) {
      var o = this;
      this.mounted = !0, this.onChangeCallbacks = /* @__PURE__ */ new Set(), this.onInitCallbacks = /* @__PURE__ */ new Set(), this.onTransformCallbacks = /* @__PURE__ */ new Set(), this.wrapperComponent = null, this.contentComponent = null, this.isInitialized = !1, this.bounds = null, this.previousWheelEvent = null, this.wheelStopEventTimer = null, this.wheelAnimationTimer = null, this.isPanning = !1, this.isWheelPanning = !1, this.startCoords = null, this.panStartPosition = null, this.lastTouch = null, this.isPinching = !1, this.distance = null, this.lastDistance = null, this.pinchStartDistance = null, this.pinchStartScale = null, this.pinchMidpoint = null, this.pinchPreviousCenter = null, this.doubleClickStopEventTimer = null, this.velocity = null, this.velocityTime = null, this.lastMousePosition = null, this.isAnimating = !1, this.animation = null, this.pressedKeys = {}, this.mount = function() {
        o.initializeWindowEvents();
      }, this.unmount = function() {
        o.cleanupWindowEvents();
      }, this.update = function(s) {
        o.props = s, o.wrapperComponent && o.contentComponent && io(o, o.state.scale), o.setup = mg(s);
      }, this.initializeWindowEvents = function() {
        var s, l, d, _, m = Tu(), p = (s = o.wrapperComponent) === null || s === void 0 ? void 0 : s.ownerDocument, f = p?.defaultView;
        (l = o.wrapperComponent) === null || l === void 0 || l.addEventListener("wheel", o.onWheelPanning, m), (d = o.wrapperComponent) === null || d === void 0 || d.addEventListener("keyup", o.setKeyUnPressed, m), (_ = o.wrapperComponent) === null || _ === void 0 || _.addEventListener("keydown", o.setKeyPressed, m), f?.addEventListener("mousedown", o.onPanningStart, m), f?.addEventListener("mousemove", o.onPanning, m), f?.addEventListener("mouseup", o.onPanningStop, m), p?.addEventListener("mouseleave", o.clearPanning, m), f?.addEventListener("keyup", o.setKeyUnPressed, m), f?.addEventListener("keydown", o.setKeyPressed, m), f?.addEventListener("blur", o.handleWindowBlur);
      }, this.cleanupWindowEvents = function() {
        var s, l, d, _, m, p = Tu(), f = (s = o.wrapperComponent) === null || s === void 0 ? void 0 : s.ownerDocument, v = f?.defaultView;
        v?.removeEventListener("mousedown", o.onPanningStart, p), v?.removeEventListener("mousemove", o.onPanning, p), v?.removeEventListener("mouseup", o.onPanningStop, p), f?.removeEventListener("mouseleave", o.clearPanning, p), v?.removeEventListener("keyup", o.setKeyUnPressed, p), v?.removeEventListener("keydown", o.setKeyPressed, p), v?.removeEventListener("blur", o.handleWindowBlur), document.removeEventListener("mouseleave", o.clearPanning, p), (l = o.wrapperComponent) === null || l === void 0 || l.removeEventListener("wheel", o.onWheelPanning, p), (d = o.wrapperComponent) === null || d === void 0 || d.removeEventListener("keyup", o.setKeyUnPressed, p), (_ = o.wrapperComponent) === null || _ === void 0 || _.removeEventListener("keydown", o.setKeyPressed, p), kn(o), (m = o.observer) === null || m === void 0 || m.disconnect();
      }, this.handleInitializeWrapperEvents = function(s) {
        var l = Tu();
        s.addEventListener("wheel", o.onWheelZoom, l), s.addEventListener("dblclick", o.onDoubleClick, l), s.addEventListener("touchstart", o.onTouchPanningStart, l), s.addEventListener("touchmove", o.onTouchPanning, l), s.addEventListener("touchend", o.onTouchPanningStop, l);
      }, this.handleInitialize = function(s) {
        var l = o.setup.centerOnInit;
        o.applyTransformation(), o.onInitCallbacks.forEach(function(d) {
          return d(Ne(o));
        }), l && (o.setCenter(), o.observer = new ResizeObserver(function() {
          var d, _ = s.offsetWidth, m = s.offsetHeight;
          (_ > 0 || m > 0) && (o.onInitCallbacks.forEach(function(p) {
            return p(Ne(o));
          }), o.setCenter(), (d = o.observer) === null || d === void 0 || d.disconnect());
        }), setTimeout(function() {
          var d;
          (d = o.observer) === null || d === void 0 || d.disconnect();
        }, 5e3), o.observer.observe(s));
      }, this.onWheelZoom = function(s) {
        var l = o.setup.disabled;
        if (!l) {
          o.syncModifierKeys(s);
          var d = Zh(o, s);
          d && (ZA(o, s), YA(o, s), VA(o, s));
        }
      }, this.onWheelPanning = function(s) {
        var l = o.props.onPanning, d = o.setup.trackPadPanning, _ = d.lockAxisX, m = d.lockAxisY;
        o.syncModifierKeys(s);
        var p = jA(o, s);
        if (p) {
          s.preventDefault(), s.stopPropagation();
          var f = o.state, v = f.positionX, y = f.positionY, w = v - s.deltaX, E = y - s.deltaY, z = _ ? v : w, N = m ? y : E, j = o.setup.autoAlignment, R = j.sizeX, U = j.sizeY, Y = Ra(o, R), P = Ra(o, U);
          z === v && N === y || (KA(o, s), Lh(o, z, N, Y, P), Re(Ne(o), s, l), XA(o, s));
        }
      }, this.onPanningStart = function(s) {
        var l = o.setup.disabled, d = o.props.onPanningStart;
        if (!l) {
          o.syncModifierKeys(s);
          var _ = sg(o, s);
          if (_) {
            var m = o.isPressingKeys(o.setup.panning.activationKeys);
            m && (s.button === 0 && !o.setup.panning.allowLeftClickPan || s.button === 1 && !o.setup.panning.allowMiddleClickPan || s.button === 2 && !o.setup.panning.allowRightClickPan || (s.preventDefault(), s.stopPropagation(), kn(o), ug(o, s), Re(Ne(o), s, d)));
          }
        }
      }, this.onPanning = function(s) {
        var l = o.setup.disabled, d = o.props.onPanning;
        if (!l) {
          if (o.syncModifierKeys(s), o.isPanning && s.buttons === 0) {
            o.clearPanning(s);
            return;
          }
          var _ = lg(o);
          if (_) {
            var m = o.isPressingKeys(o.setup.panning.activationKeys);
            m && (s.preventDefault(), s.stopPropagation(), dg(o, s.clientX, s.clientY, Ca.MOUSE), Re(Ne(o), s, d));
          }
        }
      }, this.onPanningStop = function(s) {
        var l = o.setup.panning.velocityDisabled, d = o.props.onPanningStop;
        o.isPanning && (EA(o, l), Re(Ne(o), s, d));
      }, this.onPinchStart = function(s) {
        var l = o.setup.disabled, d = o.props.onPinchStart;
        if (!l) {
          var _ = GA(o, s);
          _ && (FA(o, s), kn(o), Re(Ne(o), s, d));
        }
      }, this.onPinch = function(s) {
        var l = o.setup.disabled, d = o.props.onPinch;
        if (!l) {
          var _ = IA(o);
          _ && (s.preventDefault(), s.stopPropagation(), WA(o, s), Re(Ne(o), s, d));
        }
      }, this.onPinchStop = function(s) {
        var l = o.props.onPinchStop;
        o.pinchStartScale && ($A(o), Re(Ne(o), s, l));
      }, this.onTouchPanningStart = function(s) {
        var l = o.setup, d = l.disabled, _ = l.doubleClick, m = o.props.onPanningStart;
        if (!d) {
          var p = !_?.disabled, f = o.lastTouch && +/* @__PURE__ */ new Date() - o.lastTouch < 200;
          if (p && f && s.touches.length === 1)
            o.onDoubleClick(s);
          else {
            o.lastTouch = +/* @__PURE__ */ new Date(), kn(o);
            var v = s.touches, y = v.length === 1, w = v.length === 2, E = sg(o, s);
            if (y) {
              if (!E)
                return;
              kn(o), ug(o, s), Re(Ne(o), s, m);
            }
            w && o.onPinchStart(s);
          }
        }
      }, this.onTouchPanning = function(s) {
        var l = o.setup.disabled, d = o.props.onPanning;
        if (o.isPanning && s.touches.length === 1) {
          if (l)
            return;
          var _ = lg(o);
          if (!_)
            return;
          s.cancelable && s.preventDefault(), s.stopPropagation();
          var m = s.touches[0];
          dg(o, m.clientX, m.clientY, Ca.TOUCH), Re(Ne(o), s, d);
        } else s.touches.length > 1 && o.onPinch(s);
      }, this.onTouchPanningStop = function(s) {
        o.onPanningStop(s), o.onPinchStop(s);
      }, this.onDoubleClick = function(s) {
        var l = o.setup.disabled;
        if (!l) {
          var d = tN(o, s);
          d && eN(o, s);
        }
      }, this.clearPanning = function(s) {
        o.isPanning && o.onPanningStop(s);
      }, this.handleWindowBlur = function() {
        o.pressedKeys = {}, o.isPanning && (o.isPanning = !1, o.startCoords = null);
      }, this.syncModifierKeys = function(s) {
        var l = s.ctrlKey, d = s.metaKey, _ = s.shiftKey, m = s.altKey;
        typeof l == "boolean" && (o.pressedKeys.Control = l), typeof d == "boolean" && (o.pressedKeys.Meta = d), typeof _ == "boolean" && (o.pressedKeys.Shift = _), typeof m == "boolean" && (o.pressedKeys.Alt = m);
      }, this.setKeyPressed = function(s) {
        o.pressedKeys[s.key] = !0;
      }, this.setKeyUnPressed = function(s) {
        o.pressedKeys[s.key] = !1;
      }, this.isPressingKeys = function(s) {
        return typeof s == "function" ? s(Object.entries(o.pressedKeys).filter(function(l) {
          var d = l[1];
          return d;
        }).map(function(l) {
          var d = l[0];
          return d;
        })) : s.length ? !!s.every(function(l) {
          return o.pressedKeys[l];
        }) : !0;
      }, this.setCenter = function() {
        if (o.wrapperComponent && o.contentComponent) {
          var s = ud(o.state.scale, o.wrapperComponent, o.contentComponent);
          o.setState(s.scale, s.positionX, s.positionY);
        }
      }, this.handleTransformStyles = function(s, l, d) {
        return o.props.customTransform ? o.props.customTransform(s, l, d) : Bh(s, l, d);
      }, this.getContext = function() {
        return Ne(o);
      }, this.applyTransformation = function() {
        if (!(!o.mounted || !o.contentComponent)) {
          var s = o.state, l = s.scale, d = s.positionX, _ = s.positionY, m = o.handleTransformStyles(d, _, l);
          o.props.detached || (o.contentComponent.style.transform = m), o.onTransformCallbacks.forEach(function(p) {
            return p({
              scale: l,
              positionX: d,
              positionY: _,
              previousScale: o.state.previousScale,
              ref: Ne(o)
            });
          });
        }
      }, this.setState = function(s, l, d) {
        var _ = o.props.onTransform;
        if (!Number.isNaN(s) && !Number.isNaN(l) && !Number.isNaN(d)) {
          var m = Math.max(s, 1e-7);
          m !== o.state.scale && (o.state.previousScale = o.state.scale, o.state.scale = m), o.state.positionX = l, o.state.positionY = d, o.applyTransformation();
          var p = Ne(o);
          o.onChangeCallbacks.forEach(function(f) {
            return f(p);
          }), Re(p, { scale: o.state.scale, positionX: l, positionY: d }, _);
        } else
          console.error("Detected NaN set state values");
      }, this.onTransform = function(s) {
        return o.onTransformCallbacks.has(s) || o.onTransformCallbacks.add(s), function() {
          o.onTransformCallbacks.delete(s);
        };
      }, this.onChange = function(s) {
        return o.onChangeCallbacks.has(s) || o.onChangeCallbacks.add(s), function() {
          o.onChangeCallbacks.delete(s);
        };
      }, this.onInit = function(s) {
        return o.onInitCallbacks.has(s) || o.onInitCallbacks.add(s), function() {
          o.onInitCallbacks.delete(s);
        };
      }, this.init = function(s, l) {
        o.cleanupWindowEvents(), o.wrapperComponent = s, o.contentComponent = l, io(o, o.state.scale), o.handleInitializeWrapperEvents(s), o.handleInitialize(l), o.initializeWindowEvents(), o.isInitialized = !0;
        var d = Ne(o);
        Re(d, void 0, o.props.onInit), RA(o.props.ref, d);
      }, this.props = a, this.setup = mg(this.props), this.state = qh(this.props);
    }
    return n;
  })()
), _r = xa.createContext(null), aN = function(n, a) {
  return typeof n == "function" ? n(a) : n;
}, iN = xa.forwardRef(function(n, a) {
  var o = D.useRef(new nN(n)).current, s = aN(n.children, Vs(o));
  return D.useImperativeHandle(a, function() {
    return Vs(o);
  }, [o]), D.useEffect(function() {
    o.update(n);
  }, [o, n]), h.jsx(_r.Provider, hn({ value: o }, { children: s }));
});
xa.forwardRef(function(n, a) {
  var o = D.useRef(null), s = D.useContext(_r);
  return D.useEffect(function() {
    return s.onChange(function(l) {
      if (o.current) {
        var d = 0, _ = 0;
        o.current.style.transform = s.handleTransformStyles(d, _, 1 / l.instance.state.scale);
      }
    });
  }, [s]), h.jsx("div", hn({}, n, { ref: DA([o, a]) }));
});
function oN(n, a) {
  a === void 0 && (a = {});
  var o = a.insertAt;
  if (!(typeof document > "u")) {
    var s = document.head || document.getElementsByTagName("head")[0], l = document.createElement("style");
    l.type = "text/css", o === "top" && s.firstChild ? s.insertBefore(l, s.firstChild) : s.appendChild(l), l.styleSheet ? l.styleSheet.cssText = n : l.appendChild(document.createTextNode(n));
  }
}
var rN = `.transform-component-module_wrapper__SPB86 {
  position: relative;
  width: -moz-fit-content;
  width: fit-content;
  height: -moz-fit-content;
  height: fit-content;
  overflow: hidden;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  margin: 0;
  padding: 0;
  transform: translate3d(0, 0, 0);
}
.transform-component-module_content__FBWxo {
  display: flex;
  flex-wrap: wrap;
  width: -moz-fit-content;
  width: fit-content;
  height: -moz-fit-content;
  height: fit-content;
  margin: 0;
  padding: 0;
  transform-origin: 0% 0%;
}
.transform-component-module_content__FBWxo img {
  pointer-events: none;
}
.transform-component-module_infiniteGrid__Z-aP3 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.12) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
  background-position: 0 0;
}
`, Au = { wrapper: "transform-component-module_wrapper__SPB86", content: "transform-component-module_content__FBWxo", infiniteGrid: "transform-component-module_infiniteGrid__Z-aP3" };
oN(rN);
var sN = function(n) {
  var a = n.children, o = n.wrapperClass, s = o === void 0 ? "" : o, l = n.contentClass, d = l === void 0 ? "" : l, _ = n.wrapperStyle, m = n.contentStyle, p = n.wrapperProps, f = p === void 0 ? {} : p, v = n.contentProps, y = v === void 0 ? {} : v, w = n.infinite, E = w === void 0 ? !1 : w, z = D.useContext(_r), N = z.init, j = z.cleanupWindowEvents, R = D.useRef(null), U = D.useRef(null), Y = D.useRef(null);
  return D.useEffect(function() {
    var P = R.current, I = U.current;
    return P !== null && I !== null && N && N?.(P, I), function() {
      j?.();
    };
  }, []), D.useEffect(function() {
    if (E) {
      var P = Y.current;
      if (P) {
        var I = function() {
          var F = z.state, V = F.positionX, W = F.positionY;
          P.style.backgroundPosition = "".concat(V, "px ").concat(W, "px");
        };
        return I(), z.onChange(I);
      }
    }
  }, [E, z]), h.jsxs("div", hn({}, f, { ref: R, className: "".concat(qu.wrapperClass, " ").concat(Au.wrapper, " ").concat(s), style: _ }, { children: [E && h.jsx("div", { ref: Y, className: Au.infiniteGrid, "aria-hidden": !0 }), h.jsx("div", hn({}, y, { ref: U, className: "".concat(qu.contentClass, " ").concat(Au.content, " ").concat(d), style: hn(hn({}, m), { transform: Bh(z.state.positionX, z.state.positionY, z.state.scale) }) }, { children: a }))] }));
};
function lN(n, a) {
  var o = Math.max(0, Math.min(n.x + n.width, a.x + a.width) - Math.max(n.x, a.x)), s = Math.max(0, Math.min(n.y + n.height, a.y + a.height) - Math.max(n.y, a.y));
  return o * s;
}
function cN(n) {
  var a = n.elementX, o = n.elementY, s = n.elementWidth, l = n.elementHeight, d = n.scale, _ = n.positionX, m = n.positionY, p = n.viewportWidth, f = n.viewportHeight, v = n.margin, y = v === void 0 ? 0 : v, w = n.threshold, E = w === void 0 ? 0 : w, z = {
    x: -y,
    y: -y,
    width: p + 2 * y,
    height: f + 2 * y
  }, N = {
    x: a * d + _,
    y: o * d + m,
    width: s * d,
    height: l * d
  };
  if (E <= 0) {
    var j = N.x < z.x + z.width && N.x + N.width > z.x, R = N.y < z.y + z.height && N.y + N.height > z.y;
    return j && R;
  }
  var U = N.width * N.height;
  if (U <= 0)
    return !1;
  var Y = lN(z, N);
  return Y / U >= E;
}
xa.forwardRef(function(n, a) {
  var o = n.x, s = n.y, l = n.width, d = n.height, _ = n.margin, m = _ === void 0 ? 0 : _, p = n.threshold, f = p === void 0 ? 0 : p, v = n.placeholder, y = v === void 0 ? null : v, w = n.onShow, E = n.onHide, z = n.children, N = n.className, j = n.style, R = D.useContext(_r), U = D.useState(!1), Y = U[0], P = U[1], I = D.useRef(!1), F = D.useRef(w), V = D.useRef(E);
  return F.current = w, V.current = E, D.useEffect(function() {
    var W = function() {
      var _e, ie, Ce = R.wrapperComponent;
      if (Ce) {
        var we = cN({
          elementX: o,
          elementY: s,
          elementWidth: l,
          elementHeight: d,
          scale: R.state.scale,
          positionX: R.state.positionX,
          positionY: R.state.positionY,
          viewportWidth: Ce.offsetWidth,
          viewportHeight: Ce.offsetHeight,
          margin: m,
          threshold: f
        });
        we !== I.current && (I.current = we, P(we), we ? (_e = F.current) === null || _e === void 0 || _e.call(F) : (ie = V.current) === null || ie === void 0 || ie.call(V));
      }
    };
    W();
    var J = R.onChange(W), se;
    return R.wrapperComponent || (se = R.onInit(function() {
      return W();
    })), function() {
      J(), se?.();
    };
  }, [R, o, s, l, d, m, f]), Y ? h.jsx("div", hn({ ref: a, className: N, style: j }, { children: z })) : y ? h.jsx(h.Fragment, { children: y }) : null;
});
var dd = function() {
  var n = D.useContext(_r);
  if (!n)
    throw new Error("Transform context must be placed inside TransformWrapper");
  return n;
}, uN = function() {
  var n = dd();
  return Vs(n);
}, dN = function(n) {
  var a = dd();
  D.useEffect(function() {
    var o, s = a.onChange(function(l) {
      o = n(Ph(l.instance));
    });
    return function() {
      s(), o?.();
    };
  }, [n, a]);
};
function _N(n, a, o) {
  return Math.max(a, Math.min(n, o));
}
const zt = {
  toVector(n, a) {
    return n === void 0 && (n = a), Array.isArray(n) ? n : [n, n];
  },
  add(n, a) {
    return [n[0] + a[0], n[1] + a[1]];
  },
  sub(n, a) {
    return [n[0] - a[0], n[1] - a[1]];
  },
  addTo(n, a) {
    n[0] += a[0], n[1] += a[1];
  },
  subTo(n, a) {
    n[0] -= a[0], n[1] -= a[1];
  }
};
function fg(n, a, o) {
  return a === 0 || Math.abs(a) === 1 / 0 ? Math.pow(n, o * 5) : n * a * o / (a + o * n);
}
function pg(n, a, o, s = 0.15) {
  return s === 0 ? _N(n, a, o) : n < a ? -fg(a - n, o - a, s) + a : n > o ? +fg(n - o, o - a, s) + o : n;
}
function mN(n, [a, o], [s, l]) {
  const [[d, _], [m, p]] = n;
  return [pg(a, d, _, s), pg(o, m, p, l)];
}
function fN(n, a) {
  if (typeof n != "object" || n === null) return n;
  var o = n[Symbol.toPrimitive];
  if (o !== void 0) {
    var s = o.call(n, a);
    if (typeof s != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(n);
}
function pN(n) {
  var a = fN(n, "string");
  return typeof a == "symbol" ? a : String(a);
}
function Pt(n, a, o) {
  return a = pN(a), a in n ? Object.defineProperty(n, a, {
    value: o,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : n[a] = o, n;
}
function gg(n, a) {
  var o = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(n);
    a && (s = s.filter(function(l) {
      return Object.getOwnPropertyDescriptor(n, l).enumerable;
    })), o.push.apply(o, s);
  }
  return o;
}
function We(n) {
  for (var a = 1; a < arguments.length; a++) {
    var o = arguments[a] != null ? arguments[a] : {};
    a % 2 ? gg(Object(o), !0).forEach(function(s) {
      Pt(n, s, o[s]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(o)) : gg(Object(o)).forEach(function(s) {
      Object.defineProperty(n, s, Object.getOwnPropertyDescriptor(o, s));
    });
  }
  return n;
}
const Qh = {
  pointer: {
    start: "down",
    change: "move",
    end: "up"
  },
  mouse: {
    start: "down",
    change: "move",
    end: "up"
  },
  touch: {
    start: "start",
    change: "move",
    end: "end"
  },
  gesture: {
    start: "start",
    change: "change",
    end: "end"
  }
};
function hg(n) {
  return n ? n[0].toUpperCase() + n.slice(1) : "";
}
const gN = ["enter", "leave"];
function hN(n = !1, a) {
  return n && !gN.includes(a);
}
function vN(n, a = "", o = !1) {
  const s = Qh[n], l = s && s[a] || a;
  return "on" + hg(n) + hg(l) + (hN(o, l) ? "Capture" : "");
}
const yN = ["gotpointercapture", "lostpointercapture"];
function bN(n) {
  let a = n.substring(2).toLowerCase();
  const o = !!~a.indexOf("passive");
  o && (a = a.replace("passive", ""));
  const s = yN.includes(a) ? "capturecapture" : "capture", l = !!~a.indexOf(s);
  return l && (a = a.replace("capture", "")), {
    device: a,
    capture: l,
    passive: o
  };
}
function wN(n, a = "") {
  const o = Qh[n], s = o && o[a] || a;
  return n + s;
}
function tl(n) {
  return "touches" in n;
}
function Jh(n) {
  return tl(n) ? "touch" : "pointerType" in n ? n.pointerType : "mouse";
}
function SN(n) {
  return Array.from(n.touches).filter((a) => {
    var o, s;
    return a.target === n.currentTarget || ((o = n.currentTarget) === null || o === void 0 || (s = o.contains) === null || s === void 0 ? void 0 : s.call(o, a.target));
  });
}
function EN(n) {
  return n.type === "touchend" || n.type === "touchcancel" ? n.changedTouches : n.targetTouches;
}
function ev(n) {
  return tl(n) ? EN(n)[0] : n;
}
function zN(n) {
  return SN(n).map((a) => a.identifier);
}
function Nu(n) {
  const a = ev(n);
  return tl(n) ? a.identifier : a.pointerId;
}
function vg(n) {
  const a = ev(n);
  return [a.clientX, a.clientY];
}
function kN(n) {
  const a = {};
  if ("buttons" in n && (a.buttons = n.buttons), "shiftKey" in n) {
    const {
      shiftKey: o,
      altKey: s,
      metaKey: l,
      ctrlKey: d
    } = n;
    Object.assign(a, {
      shiftKey: o,
      altKey: s,
      metaKey: l,
      ctrlKey: d
    });
  }
  return a;
}
function Ks(n, ...a) {
  return typeof n == "function" ? n(...a) : n;
}
function TN() {
}
function AN(...n) {
  return n.length === 0 ? TN : n.length === 1 ? n[0] : function() {
    let a;
    for (const o of n)
      a = o.apply(this, arguments) || a;
    return a;
  };
}
function yg(n, a) {
  return Object.assign({}, a, n || {});
}
const NN = 32;
class CN {
  constructor(a, o, s) {
    this.ctrl = a, this.args = o, this.key = s, this.state || (this.state = {}, this.computeValues([0, 0]), this.computeInitial(), this.init && this.init(), this.reset());
  }
  get state() {
    return this.ctrl.state[this.key];
  }
  set state(a) {
    this.ctrl.state[this.key] = a;
  }
  get shared() {
    return this.ctrl.state.shared;
  }
  get eventStore() {
    return this.ctrl.gestureEventStores[this.key];
  }
  get timeoutStore() {
    return this.ctrl.gestureTimeoutStores[this.key];
  }
  get config() {
    return this.ctrl.config[this.key];
  }
  get sharedConfig() {
    return this.ctrl.config.shared;
  }
  get handler() {
    return this.ctrl.handlers[this.key];
  }
  reset() {
    const {
      state: a,
      shared: o,
      ingKey: s,
      args: l
    } = this;
    o[s] = a._active = a.active = a._blocked = a._force = !1, a._step = [!1, !1], a.intentional = !1, a._movement = [0, 0], a._distance = [0, 0], a._direction = [0, 0], a._delta = [0, 0], a._bounds = [[-1 / 0, 1 / 0], [-1 / 0, 1 / 0]], a.args = l, a.axis = void 0, a.memo = void 0, a.elapsedTime = a.timeDelta = 0, a.direction = [0, 0], a.distance = [0, 0], a.overflow = [0, 0], a._movementBound = [!1, !1], a.velocity = [0, 0], a.movement = [0, 0], a.delta = [0, 0], a.timeStamp = 0;
  }
  start(a) {
    const o = this.state, s = this.config;
    o._active || (this.reset(), this.computeInitial(), o._active = !0, o.target = a.target, o.currentTarget = a.currentTarget, o.lastOffset = s.from ? Ks(s.from, o) : o.offset, o.offset = o.lastOffset, o.startTime = o.timeStamp = a.timeStamp);
  }
  computeValues(a) {
    const o = this.state;
    o._values = a, o.values = this.config.transform(a);
  }
  computeInitial() {
    const a = this.state;
    a._initial = a._values, a.initial = a.values;
  }
  compute(a) {
    const {
      state: o,
      config: s,
      shared: l
    } = this;
    o.args = this.args;
    let d = 0;
    if (a && (o.event = a, s.preventDefault && a.cancelable && o.event.preventDefault(), o.type = a.type, l.touches = this.ctrl.pointerIds.size || this.ctrl.touchIds.size, l.locked = !!document.pointerLockElement, Object.assign(l, kN(a)), l.down = l.pressed = l.buttons % 2 === 1 || l.touches > 0, d = a.timeStamp - o.timeStamp, o.timeStamp = a.timeStamp, o.elapsedTime = o.timeStamp - o.startTime), o._active) {
      const F = o._delta.map(Math.abs);
      zt.addTo(o._distance, F);
    }
    this.axisIntent && this.axisIntent(a);
    const [_, m] = o._movement, [p, f] = s.threshold, {
      _step: v,
      values: y
    } = o;
    if (s.hasCustomTransform ? (v[0] === !1 && (v[0] = Math.abs(_) >= p && y[0]), v[1] === !1 && (v[1] = Math.abs(m) >= f && y[1])) : (v[0] === !1 && (v[0] = Math.abs(_) >= p && Math.sign(_) * p), v[1] === !1 && (v[1] = Math.abs(m) >= f && Math.sign(m) * f)), o.intentional = v[0] !== !1 || v[1] !== !1, !o.intentional) return;
    const w = [0, 0];
    if (s.hasCustomTransform) {
      const [F, V] = y;
      w[0] = v[0] !== !1 ? F - v[0] : 0, w[1] = v[1] !== !1 ? V - v[1] : 0;
    } else
      w[0] = v[0] !== !1 ? _ - v[0] : 0, w[1] = v[1] !== !1 ? m - v[1] : 0;
    this.restrictToAxis && !o._blocked && this.restrictToAxis(w);
    const E = o.offset, z = o._active && !o._blocked || o.active;
    z && (o.first = o._active && !o.active, o.last = !o._active && o.active, o.active = l[this.ingKey] = o._active, a && (o.first && ("bounds" in s && (o._bounds = Ks(s.bounds, o)), this.setup && this.setup()), o.movement = w, this.computeOffset()));
    const [N, j] = o.offset, [[R, U], [Y, P]] = o._bounds;
    o.overflow = [N < R ? -1 : N > U ? 1 : 0, j < Y ? -1 : j > P ? 1 : 0], o._movementBound[0] = o.overflow[0] ? o._movementBound[0] === !1 ? o._movement[0] : o._movementBound[0] : !1, o._movementBound[1] = o.overflow[1] ? o._movementBound[1] === !1 ? o._movement[1] : o._movementBound[1] : !1;
    const I = o._active ? s.rubberband || [0, 0] : [0, 0];
    if (o.offset = mN(o._bounds, o.offset, I), o.delta = zt.sub(o.offset, E), this.computeMovement(), z && (!o.last || d > NN)) {
      o.delta = zt.sub(o.offset, E);
      const F = o.delta.map(Math.abs);
      zt.addTo(o.distance, F), o.direction = o.delta.map(Math.sign), o._direction = o._delta.map(Math.sign), !o.first && d > 0 && (o.velocity = [F[0] / d, F[1] / d], o.timeDelta = d);
    }
  }
  emit() {
    const a = this.state, o = this.shared, s = this.config;
    if (a._active || this.clean(), (a._blocked || !a.intentional) && !a._force && !s.triggerAllEvents) return;
    const l = this.handler(We(We(We({}, o), a), {}, {
      [this.aliasKey]: a.values
    }));
    l !== void 0 && (a.memo = l);
  }
  clean() {
    this.eventStore.clean(), this.timeoutStore.clean();
  }
}
function xN([n, a], o) {
  const s = Math.abs(n), l = Math.abs(a);
  if (s > l && s > o)
    return "x";
  if (l > s && l > o)
    return "y";
}
class MN extends CN {
  constructor(...a) {
    super(...a), Pt(this, "aliasKey", "xy");
  }
  reset() {
    super.reset(), this.state.axis = void 0;
  }
  init() {
    this.state.offset = [0, 0], this.state.lastOffset = [0, 0];
  }
  computeOffset() {
    this.state.offset = zt.add(this.state.lastOffset, this.state.movement);
  }
  computeMovement() {
    this.state.movement = zt.sub(this.state.offset, this.state.lastOffset);
  }
  axisIntent(a) {
    const o = this.state, s = this.config;
    if (!o.axis && a) {
      const l = typeof s.axisThreshold == "object" ? s.axisThreshold[Jh(a)] : s.axisThreshold;
      o.axis = xN(o._movement, l);
    }
    o._blocked = (s.lockDirection || !!s.axis) && !o.axis || !!s.axis && s.axis !== o.axis;
  }
  restrictToAxis(a) {
    if (this.config.axis || this.config.lockDirection)
      switch (this.state.axis) {
        case "x":
          a[1] = 0;
          break;
        case "y":
          a[0] = 0;
          break;
      }
  }
}
const ON = (n) => n, bg = 0.15, tv = {
  enabled(n = !0) {
    return n;
  },
  eventOptions(n, a, o) {
    return We(We({}, o.shared.eventOptions), n);
  },
  preventDefault(n = !1) {
    return n;
  },
  triggerAllEvents(n = !1) {
    return n;
  },
  rubberband(n = 0) {
    switch (n) {
      case !0:
        return [bg, bg];
      case !1:
        return [0, 0];
      default:
        return zt.toVector(n);
    }
  },
  from(n) {
    if (typeof n == "function") return n;
    if (n != null) return zt.toVector(n);
  },
  transform(n, a, o) {
    const s = n || o.shared.transform;
    return this.hasCustomTransform = !!s, s || ON;
  },
  threshold(n) {
    return zt.toVector(n, 0);
  }
}, RN = 0, mr = We(We({}, tv), {}, {
  axis(n, a, {
    axis: o
  }) {
    if (this.lockDirection = o === "lock", !this.lockDirection) return o;
  },
  axisThreshold(n = RN) {
    return n;
  },
  bounds(n = {}) {
    if (typeof n == "function")
      return (d) => mr.bounds(n(d));
    if ("current" in n)
      return () => n.current;
    if (typeof HTMLElement == "function" && n instanceof HTMLElement)
      return n;
    const {
      left: a = -1 / 0,
      right: o = 1 / 0,
      top: s = -1 / 0,
      bottom: l = 1 / 0
    } = n;
    return [[a, o], [s, l]];
  }
}), wg = {
  ArrowRight: (n, a = 1) => [n * a, 0],
  ArrowLeft: (n, a = 1) => [-1 * n * a, 0],
  ArrowUp: (n, a = 1) => [0, -1 * n * a],
  ArrowDown: (n, a = 1) => [0, n * a]
};
class DN extends MN {
  constructor(...a) {
    super(...a), Pt(this, "ingKey", "dragging");
  }
  reset() {
    super.reset();
    const a = this.state;
    a._pointerId = void 0, a._pointerActive = !1, a._keyboardActive = !1, a._preventScroll = !1, a._delayed = !1, a.swipe = [0, 0], a.tap = !1, a.canceled = !1, a.cancel = this.cancel.bind(this);
  }
  setup() {
    const a = this.state;
    if (a._bounds instanceof HTMLElement) {
      const o = a._bounds.getBoundingClientRect(), s = a.currentTarget.getBoundingClientRect(), l = {
        left: o.left - s.left + a.offset[0],
        right: o.right - s.right + a.offset[0],
        top: o.top - s.top + a.offset[1],
        bottom: o.bottom - s.bottom + a.offset[1]
      };
      a._bounds = mr.bounds(l);
    }
  }
  cancel() {
    const a = this.state;
    a.canceled || (a.canceled = !0, a._active = !1, setTimeout(() => {
      this.compute(), this.emit();
    }, 0));
  }
  setActive() {
    this.state._active = this.state._pointerActive || this.state._keyboardActive;
  }
  clean() {
    this.pointerClean(), this.state._pointerActive = !1, this.state._keyboardActive = !1, super.clean();
  }
  pointerDown(a) {
    const o = this.config, s = this.state;
    if (a.buttons != null && (Array.isArray(o.pointerButtons) ? !o.pointerButtons.includes(a.buttons) : o.pointerButtons !== -1 && o.pointerButtons !== a.buttons)) return;
    const l = this.ctrl.setEventIds(a);
    o.pointerCapture && a.target.setPointerCapture(a.pointerId), !(l && l.size > 1 && s._pointerActive) && (this.start(a), this.setupPointer(a), s._pointerId = Nu(a), s._pointerActive = !0, this.computeValues(vg(a)), this.computeInitial(), o.preventScrollAxis && Jh(a) !== "mouse" ? (s._active = !1, this.setupScrollPrevention(a)) : o.delay > 0 ? (this.setupDelayTrigger(a), o.triggerAllEvents && (this.compute(a), this.emit())) : this.startPointerDrag(a));
  }
  startPointerDrag(a) {
    const o = this.state;
    o._active = !0, o._preventScroll = !0, o._delayed = !1, this.compute(a), this.emit();
  }
  pointerMove(a) {
    const o = this.state, s = this.config;
    if (!o._pointerActive) return;
    const l = Nu(a);
    if (o._pointerId !== void 0 && l !== o._pointerId) return;
    const d = vg(a);
    if (document.pointerLockElement === a.target ? o._delta = [a.movementX, a.movementY] : (o._delta = zt.sub(d, o._values), this.computeValues(d)), zt.addTo(o._movement, o._delta), this.compute(a), o._delayed && o.intentional) {
      this.timeoutStore.remove("dragDelay"), o.active = !1, this.startPointerDrag(a);
      return;
    }
    if (s.preventScrollAxis && !o._preventScroll)
      if (o.axis)
        if (o.axis === s.preventScrollAxis || s.preventScrollAxis === "xy") {
          o._active = !1, this.clean();
          return;
        } else {
          this.timeoutStore.remove("startPointerDrag"), this.startPointerDrag(a);
          return;
        }
      else
        return;
    this.emit();
  }
  pointerUp(a) {
    this.ctrl.setEventIds(a);
    try {
      this.config.pointerCapture && a.target.hasPointerCapture(a.pointerId) && a.target.releasePointerCapture(a.pointerId);
    } catch {
    }
    const o = this.state, s = this.config;
    if (!o._active || !o._pointerActive) return;
    const l = Nu(a);
    if (o._pointerId !== void 0 && l !== o._pointerId) return;
    this.state._pointerActive = !1, this.setActive(), this.compute(a);
    const [d, _] = o._distance;
    if (o.tap = d <= s.tapsThreshold && _ <= s.tapsThreshold, o.tap && s.filterTaps)
      o._force = !0;
    else {
      const [m, p] = o._delta, [f, v] = o._movement, [y, w] = s.swipe.velocity, [E, z] = s.swipe.distance, N = s.swipe.duration;
      if (o.elapsedTime < N) {
        const j = Math.abs(m / o.timeDelta), R = Math.abs(p / o.timeDelta);
        j > y && Math.abs(f) > E && (o.swipe[0] = Math.sign(m)), R > w && Math.abs(v) > z && (o.swipe[1] = Math.sign(p));
      }
    }
    this.emit();
  }
  pointerClick(a) {
    !this.state.tap && a.detail > 0 && (a.preventDefault(), a.stopPropagation());
  }
  setupPointer(a) {
    const o = this.config, s = o.device;
    o.pointerLock && a.currentTarget.requestPointerLock(), o.pointerCapture || (this.eventStore.add(this.sharedConfig.window, s, "change", this.pointerMove.bind(this)), this.eventStore.add(this.sharedConfig.window, s, "end", this.pointerUp.bind(this)), this.eventStore.add(this.sharedConfig.window, s, "cancel", this.pointerUp.bind(this)));
  }
  pointerClean() {
    this.config.pointerLock && document.pointerLockElement === this.state.currentTarget && document.exitPointerLock();
  }
  preventScroll(a) {
    this.state._preventScroll && a.cancelable && a.preventDefault();
  }
  setupScrollPrevention(a) {
    this.state._preventScroll = !1, jN(a);
    const o = this.eventStore.add(this.sharedConfig.window, "touch", "change", this.preventScroll.bind(this), {
      passive: !1
    });
    this.eventStore.add(this.sharedConfig.window, "touch", "end", o), this.eventStore.add(this.sharedConfig.window, "touch", "cancel", o), this.timeoutStore.add("startPointerDrag", this.startPointerDrag.bind(this), this.config.preventScrollDelay, a);
  }
  setupDelayTrigger(a) {
    this.state._delayed = !0, this.timeoutStore.add("dragDelay", () => {
      this.state._step = [0, 0], this.startPointerDrag(a);
    }, this.config.delay);
  }
  keyDown(a) {
    const o = wg[a.key];
    if (o) {
      const s = this.state, l = a.shiftKey ? 10 : a.altKey ? 0.1 : 1;
      this.start(a), s._delta = o(this.config.keyboardDisplacement, l), s._keyboardActive = !0, zt.addTo(s._movement, s._delta), this.compute(a), this.emit();
    }
  }
  keyUp(a) {
    a.key in wg && (this.state._keyboardActive = !1, this.setActive(), this.compute(a), this.emit());
  }
  bind(a) {
    const o = this.config.device;
    a(o, "start", this.pointerDown.bind(this)), this.config.pointerCapture && (a(o, "change", this.pointerMove.bind(this)), a(o, "end", this.pointerUp.bind(this)), a(o, "cancel", this.pointerUp.bind(this)), a("lostPointerCapture", "", this.pointerUp.bind(this))), this.config.keys && (a("key", "down", this.keyDown.bind(this)), a("key", "up", this.keyUp.bind(this))), this.config.filterTaps && a("click", "", this.pointerClick.bind(this), {
      capture: !0,
      passive: !1
    });
  }
}
function jN(n) {
  "persist" in n && typeof n.persist == "function" && n.persist();
}
const fr = typeof window < "u" && window.document && window.document.createElement;
function nv() {
  return fr && "ontouchstart" in window;
}
function LN() {
  return nv() || fr && window.navigator.maxTouchPoints > 1;
}
function UN() {
  return fr && "onpointerdown" in window;
}
function qN() {
  return fr && "exitPointerLock" in window.document;
}
function GN() {
  try {
    return "constructor" in GestureEvent;
  } catch {
    return !1;
  }
}
const gn = {
  isBrowser: fr,
  gesture: GN(),
  touch: nv(),
  touchscreen: LN(),
  pointer: UN(),
  pointerLock: qN()
}, IN = 250, HN = 180, PN = 0.5, BN = 50, ZN = 250, YN = 10, Sg = {
  mouse: 0,
  touch: 0,
  pen: 8
}, VN = We(We({}, mr), {}, {
  device(n, a, {
    pointer: {
      touch: o = !1,
      lock: s = !1,
      mouse: l = !1
    } = {}
  }) {
    return this.pointerLock = s && gn.pointerLock, gn.touch && o ? "touch" : this.pointerLock ? "mouse" : gn.pointer && !l ? "pointer" : gn.touch ? "touch" : "mouse";
  },
  preventScrollAxis(n, a, {
    preventScroll: o
  }) {
    if (this.preventScrollDelay = typeof o == "number" ? o : o || o === void 0 && n ? IN : void 0, !(!gn.touchscreen || o === !1))
      return n || (o !== void 0 ? "y" : void 0);
  },
  pointerCapture(n, a, {
    pointer: {
      capture: o = !0,
      buttons: s = 1,
      keys: l = !0
    } = {}
  }) {
    return this.pointerButtons = s, this.keys = l, !this.pointerLock && this.device === "pointer" && o;
  },
  threshold(n, a, {
    filterTaps: o = !1,
    tapsThreshold: s = 3,
    axis: l = void 0
  }) {
    const d = zt.toVector(n, o ? s : l ? 1 : 0);
    return this.filterTaps = o, this.tapsThreshold = s, d;
  },
  swipe({
    velocity: n = PN,
    distance: a = BN,
    duration: o = ZN
  } = {}) {
    return {
      velocity: this.transform(zt.toVector(n)),
      distance: this.transform(zt.toVector(a)),
      duration: o
    };
  },
  delay(n = 0) {
    switch (n) {
      case !0:
        return HN;
      case !1:
        return 0;
      default:
        return n;
    }
  },
  axisThreshold(n) {
    return n ? We(We({}, Sg), n) : Sg;
  },
  keyboardDisplacement(n = YN) {
    return n;
  }
});
We(We({}, tv), {}, {
  device(n, a, {
    shared: o,
    pointer: {
      touch: s = !1
    } = {}
  }) {
    if (o.target && !gn.touch && gn.gesture) return "gesture";
    if (gn.touch && s) return "touch";
    if (gn.touchscreen) {
      if (gn.pointer) return "pointer";
      if (gn.touch) return "touch";
    }
  },
  bounds(n, a, {
    scaleBounds: o = {},
    angleBounds: s = {}
  }) {
    const l = (_) => {
      const m = yg(Ks(o, _), {
        min: -1 / 0,
        max: 1 / 0
      });
      return [m.min, m.max];
    }, d = (_) => {
      const m = yg(Ks(s, _), {
        min: -1 / 0,
        max: 1 / 0
      });
      return [m.min, m.max];
    };
    return typeof o != "function" && typeof s != "function" ? [l(), d()] : (_) => [l(_), d(_)];
  },
  threshold(n, a, o) {
    return this.lockDirection = o.axis === "lock", zt.toVector(n, this.lockDirection ? [0.1, 3] : 0);
  },
  modifierKey(n) {
    return n === void 0 ? "ctrlKey" : n;
  },
  pinchOnWheel(n = !0) {
    return n;
  }
});
We(We({}, mr), {}, {
  mouseOnly: (n = !0) => n
});
We(We({}, mr), {}, {
  mouseOnly: (n = !0) => n
});
const av = /* @__PURE__ */ new Map(), Gu = /* @__PURE__ */ new Map();
function KN(n) {
  av.set(n.key, n.engine), Gu.set(n.key, n.resolver);
}
const XN = {
  key: "drag",
  engine: DN,
  resolver: VN
};
function FN(n, a) {
  if (n == null) return {};
  var o = {}, s = Object.keys(n), l, d;
  for (d = 0; d < s.length; d++)
    l = s[d], !(a.indexOf(l) >= 0) && (o[l] = n[l]);
  return o;
}
function WN(n, a) {
  if (n == null) return {};
  var o = FN(n, a), s, l;
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(n);
    for (l = 0; l < d.length; l++)
      s = d[l], !(a.indexOf(s) >= 0) && Object.prototype.propertyIsEnumerable.call(n, s) && (o[s] = n[s]);
  }
  return o;
}
const $N = {
  target(n) {
    if (n)
      return () => "current" in n ? n.current : n;
  },
  enabled(n = !0) {
    return n;
  },
  window(n = gn.isBrowser ? window : void 0) {
    return n;
  },
  eventOptions({
    passive: n = !0,
    capture: a = !1
  } = {}) {
    return {
      passive: n,
      capture: a
    };
  },
  transform(n) {
    return n;
  }
}, QN = ["target", "eventOptions", "window", "enabled", "transform"];
function qs(n = {}, a) {
  const o = {};
  for (const [s, l] of Object.entries(a))
    switch (typeof l) {
      case "function":
        o[s] = l.call(o, n[s], s, n);
        break;
      case "object":
        o[s] = qs(n[s], l);
        break;
      case "boolean":
        l && (o[s] = n[s]);
        break;
    }
  return o;
}
function JN(n, a, o = {}) {
  const s = n, {
    target: l,
    eventOptions: d,
    window: _,
    enabled: m,
    transform: p
  } = s, f = WN(s, QN);
  if (o.shared = qs({
    target: l,
    eventOptions: d,
    window: _,
    enabled: m,
    transform: p
  }, $N), a) {
    const v = Gu.get(a);
    o[a] = qs(We({
      shared: o.shared
    }, f), v);
  } else
    for (const v in f) {
      const y = Gu.get(v);
      y && (o[v] = qs(We({
        shared: o.shared
      }, f[v]), y));
    }
  return o;
}
class iv {
  constructor(a, o) {
    Pt(this, "_listeners", /* @__PURE__ */ new Set()), this._ctrl = a, this._gestureKey = o;
  }
  add(a, o, s, l, d) {
    const _ = this._listeners, m = wN(o, s), p = this._gestureKey ? this._ctrl.config[this._gestureKey].eventOptions : {}, f = We(We({}, p), d);
    a.addEventListener(m, l, f);
    const v = () => {
      a.removeEventListener(m, l, f), _.delete(v);
    };
    return _.add(v), v;
  }
  clean() {
    this._listeners.forEach((a) => a()), this._listeners.clear();
  }
}
class e2 {
  constructor() {
    Pt(this, "_timeouts", /* @__PURE__ */ new Map());
  }
  add(a, o, s = 140, ...l) {
    this.remove(a), this._timeouts.set(a, window.setTimeout(o, s, ...l));
  }
  remove(a) {
    const o = this._timeouts.get(a);
    o && window.clearTimeout(o);
  }
  clean() {
    this._timeouts.forEach((a) => {
      window.clearTimeout(a);
    }), this._timeouts.clear();
  }
}
class t2 {
  constructor(a) {
    Pt(this, "gestures", /* @__PURE__ */ new Set()), Pt(this, "_targetEventStore", new iv(this)), Pt(this, "gestureEventStores", {}), Pt(this, "gestureTimeoutStores", {}), Pt(this, "handlers", {}), Pt(this, "config", {}), Pt(this, "pointerIds", /* @__PURE__ */ new Set()), Pt(this, "touchIds", /* @__PURE__ */ new Set()), Pt(this, "state", {
      shared: {
        shiftKey: !1,
        metaKey: !1,
        ctrlKey: !1,
        altKey: !1
      }
    }), n2(this, a);
  }
  setEventIds(a) {
    if (tl(a))
      return this.touchIds = new Set(zN(a)), this.touchIds;
    if ("pointerId" in a)
      return a.type === "pointerup" || a.type === "pointercancel" ? this.pointerIds.delete(a.pointerId) : a.type === "pointerdown" && this.pointerIds.add(a.pointerId), this.pointerIds;
  }
  applyHandlers(a, o) {
    this.handlers = a, this.nativeHandlers = o;
  }
  applyConfig(a, o) {
    this.config = JN(a, o, this.config);
  }
  clean() {
    this._targetEventStore.clean();
    for (const a of this.gestures)
      this.gestureEventStores[a].clean(), this.gestureTimeoutStores[a].clean();
  }
  effect() {
    return this.config.shared.target && this.bind(), () => this._targetEventStore.clean();
  }
  bind(...a) {
    const o = this.config.shared, s = {};
    let l;
    if (!(o.target && (l = o.target(), !l))) {
      if (o.enabled) {
        for (const _ of this.gestures) {
          const m = this.config[_], p = Eg(s, m.eventOptions, !!l);
          if (m.enabled) {
            const f = av.get(_);
            new f(this, a, _).bind(p);
          }
        }
        const d = Eg(s, o.eventOptions, !!l);
        for (const _ in this.nativeHandlers)
          d(_, "", (m) => this.nativeHandlers[_](We(We({}, this.state.shared), {}, {
            event: m,
            args: a
          })), void 0, !0);
      }
      for (const d in s)
        s[d] = AN(...s[d]);
      if (!l) return s;
      for (const d in s) {
        const {
          device: _,
          capture: m,
          passive: p
        } = bN(d);
        this._targetEventStore.add(l, _, "", s[d], {
          capture: m,
          passive: p
        });
      }
    }
  }
}
function $i(n, a) {
  n.gestures.add(a), n.gestureEventStores[a] = new iv(n, a), n.gestureTimeoutStores[a] = new e2();
}
function n2(n, a) {
  a.drag && $i(n, "drag"), a.wheel && $i(n, "wheel"), a.scroll && $i(n, "scroll"), a.move && $i(n, "move"), a.pinch && $i(n, "pinch"), a.hover && $i(n, "hover");
}
const Eg = (n, a, o) => (s, l, d, _ = {}, m = !1) => {
  var p, f;
  const v = (p = _.capture) !== null && p !== void 0 ? p : a.capture, y = (f = _.passive) !== null && f !== void 0 ? f : a.passive;
  let w = m ? s : vN(s, l, v);
  o && y && (w += "Passive"), n[w] = n[w] || [], n[w].push(d);
};
function a2(n, a = {}, o, s) {
  const l = xa.useMemo(() => new t2(n), []);
  if (l.applyHandlers(n, s), l.applyConfig(a, o), xa.useEffect(l.effect.bind(l)), xa.useEffect(() => l.clean.bind(l), []), a.target === void 0)
    return l.bind.bind(l);
}
function i2(n, a) {
  return KN(XN), a2({
    drag: n
  }, a || {}, "drag");
}
const o2 = 10;
function r2({ room: n, path: a, isSelected: o, isBusy: s, onRoomToggle: l }) {
  const d = D.useRef(null);
  return i2(
    (_) => {
      _.tap && (ne.debug("RoomSegments", "Tap on room:", n.id, n.name), l(n.id, n.name));
    },
    {
      target: d,
      filterTaps: !0,
      tapsThreshold: o2
    }
  ), /* @__PURE__ */ h.jsx(
    "path",
    {
      ref: d,
      d: a,
      className: `vacuum-map__room-segment ${o ? "vacuum-map__room-segment--selected" : ""}`,
      fill: o ? "var(--accent-bg, rgba(212, 175, 55, 0.3))" : "transparent",
      stroke: !s && o ? "var(--accent-color, #D4AF37)" : "rgba(255, 255, 255, 0.2)",
      strokeWidth: "2",
      style: { cursor: "pointer", transition: "all 0.2s ease", touchAction: "none" },
      "data-room-id": n.id,
      "data-room-name": n.name,
      children: /* @__PURE__ */ h.jsx("title", { children: n.name })
    }
  );
}
function s2({
  rooms: n,
  selectedRooms: a,
  onRoomToggle: o,
  calibrationPoints: s,
  imageWidth: l,
  imageHeight: d,
  rotation: _ = 0
}) {
  const { phase: m } = Rn(), p = m !== "idle";
  ne.debug("RoomSegments", "Render, selectedRooms:", Array.from(a.keys()));
  const f = D.useMemo(() => n.filter((v) => v.visibility !== "Hidden").sort((v, y) => {
    const w = Math.abs(((v.x1 ?? 0) - (v.x0 ?? 0)) * ((v.y1 ?? 0) - (v.y0 ?? 0)));
    return Math.abs(((y.x1 ?? 0) - (y.x0 ?? 0)) * ((y.y1 ?? 0) - (y.y0 ?? 0))) - w;
  }).map((v) => ({
    room: v,
    path: HT(v, s, l, d, n, _)
  })), [n, s, l, d, _]);
  return !l || !d ? null : /* @__PURE__ */ h.jsx(
    "svg",
    {
      className: "vacuum-map__room-segments",
      viewBox: `0 0 ${l} ${d}`,
      preserveAspectRatio: "xMidYMid meet",
      children: f.map(({ room: v, path: y }) => {
        const w = a.has(v.id);
        return y ? /* @__PURE__ */ h.jsx(
          r2,
          {
            room: v,
            path: y,
            isSelected: w,
            isBusy: p,
            onRoomToggle: o
          },
          v.id
        ) : (ne.warn("No path for room:", v.id, v.name), null);
      })
    }
  );
}
const l2 = D.memo(s2);
function c2({
  viewMode: n,
  onViewToggle: a,
  onZoomIn: o,
  onZoomOut: s,
  onZoomReset: l,
  showViewToggle: d = !1,
  showZoomControls: _ = !0,
  isMapLocked: m,
  onToggleLock: p
}) {
  const { t: f } = Ie(), v = n === "map", y = n === "list", w = f(v ? "vacuum_map.switch_to_list" : "vacuum_map.switch_to_map"), E = v ? k0 : Pu, z = f(m ? "vacuum_map.unlock_map" : "vacuum_map.lock_map"), N = m ? C0 : A0;
  return /* @__PURE__ */ h.jsxs("div", { className: "map-controls", children: [
    d && a && /* @__PURE__ */ h.jsx("button", { className: "map-controls__button", onClick: a, "aria-label": w, title: w, children: /* @__PURE__ */ h.jsx(E, { size: 18 }) }),
    _ && !m && !y && /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      /* @__PURE__ */ h.jsx(
        "button",
        {
          className: "map-controls__button",
          onClick: o,
          "aria-label": f("vacuum_map.zoom_in"),
          title: f("vacuum_map.zoom_in"),
          children: /* @__PURE__ */ h.jsx(Mg, { size: 18 })
        }
      ),
      /* @__PURE__ */ h.jsx(
        "button",
        {
          className: "map-controls__button",
          onClick: s,
          "aria-label": f("vacuum_map.zoom_out"),
          title: f("vacuum_map.zoom_out"),
          children: /* @__PURE__ */ h.jsx(O0, { size: 18 })
        }
      ),
      /* @__PURE__ */ h.jsx(
        "button",
        {
          className: "map-controls__button",
          onClick: l,
          "aria-label": f("vacuum_map.zoom_reset"),
          title: f("vacuum_map.zoom_reset"),
          children: /* @__PURE__ */ h.jsx(B0, { size: 16 })
        }
      )
    ] }),
    !y && /* @__PURE__ */ h.jsx(
      "button",
      {
        className: `map-controls__button map-controls__button--lock${m ? " map-controls__button--locked" : ""}`,
        onClick: p,
        "aria-label": z,
        title: z,
        children: /* @__PURE__ */ h.jsx(N, { size: 16 })
      }
    )
  ] });
}
function u2({ rooms: n, selectedRooms: a, onRoomToggle: o }) {
  const { t: s } = Ie();
  return n.length === 0 ? /* @__PURE__ */ h.jsx("div", { className: "room-list-view", children: /* @__PURE__ */ h.jsx("div", { className: "room-list-view__empty", children: s("vacuum_map.no_rooms") }) }) : /* @__PURE__ */ h.jsxs("div", { className: "room-list-view", children: [
    /* @__PURE__ */ h.jsx("div", { className: "room-list-view__header", children: s("vacuum_map.room_list_overlay") }),
    /* @__PURE__ */ h.jsx("div", { className: "room-list-view__list", children: n.map((l) => {
      const d = a.has(l.id);
      return /* @__PURE__ */ h.jsxs(
        "button",
        {
          className: `room-list-view__item ${d ? "room-list-view__item--selected" : ""}`,
          onClick: () => o(l.id, l.name),
          children: [
            /* @__PURE__ */ h.jsx("span", { className: "room-list-view__item-name", children: l.name }),
            /* @__PURE__ */ h.jsx("span", { className: "room-list-view__item-check", children: d && /* @__PURE__ */ h.jsx(Cg, { size: 18 }) })
          ]
        },
        l.id
      );
    }) })
  ] });
}
function d2({ zone: n, onZoneChange: a, clearZoneLabel: o, contentRef: s }) {
  const l = dd(), { phase: d } = Rn(), _ = d === "cleaning" || d === "paused", [m, p] = D.useState(null), [f, v] = D.useState(l.state.scale);
  dN(
    D.useCallback((I) => {
      v(I.state.scale);
    }, [])
  );
  const y = 1 / f, [w, E] = D.useState(null), z = D.useCallback(
    (I, F) => {
      const V = s.current;
      if (!V) return null;
      const W = V.getBoundingClientRect(), { scale: J } = l.state, se = (I - W.left) / J, _e = (F - W.top) / J, ie = W.width / J, Ce = W.height / J, we = Math.max(0, Math.min(100, se / ie * 100)), xe = Math.max(0, Math.min(100, _e / Ce * 100));
      return { x: we, y: xe };
    },
    [s, l]
  ), N = D.useCallback(
    (I) => {
      if (m) return;
      I.stopPropagation();
      const F = z(I.clientX, I.clientY);
      if (!F) return;
      const V = 15, W = {
        x1: Math.max(0, F.x - V / 2),
        y1: Math.max(0, F.y - V / 2),
        x2: Math.min(100, F.x + V / 2),
        y2: Math.min(100, F.y + V / 2)
      };
      ne.debug("Zone", "Created at click:", F, W), a(W);
    },
    [z, a, m]
  ), j = (I, F) => {
    I.stopPropagation(), I.preventDefault(), n && (p(F), E(n));
  }, R = (I) => "touches" in I && I.touches.length > 0 ? { clientX: I.touches[0].clientX, clientY: I.touches[0].clientY } : { clientX: I.clientX, clientY: I.clientY }, U = D.useCallback(
    (I) => {
      if (!m || !w) return;
      const { clientX: F, clientY: V } = R(I), W = z(F, V);
      if (!W) return;
      const J = { ...w }, se = 5;
      switch (m) {
        case "top":
          J.y1 = Math.min(W.y, w.y2 - se);
          break;
        case "bottom":
          J.y2 = Math.max(W.y, w.y1 + se);
          break;
        case "left":
          J.x1 = Math.min(W.x, w.x2 - se);
          break;
        case "right":
          J.x2 = Math.max(W.x, w.x1 + se);
          break;
      }
      a(J);
    },
    [m, w, z, a]
  ), Y = D.useCallback(() => {
    p(null), E(null);
  }, []), P = (I) => {
    I.stopPropagation(), a(null), p(null), E(null);
  };
  return /* @__PURE__ */ h.jsx(
    "div",
    {
      className: "vacuum-map__zone-container",
      onClick: N,
      onMouseMove: U,
      onMouseUp: Y,
      onMouseLeave: Y,
      onTouchMove: U,
      onTouchEnd: Y,
      onTouchCancel: Y,
      children: n && /* @__PURE__ */ h.jsx(
        "div",
        {
          className: "vacuum-map__zone",
          style: {
            left: `${n.x1}%`,
            top: `${n.y1}%`,
            width: `${n.x2 - n.x1}%`,
            height: `${n.y2 - n.y1}%`
          },
          onClick: (I) => I.stopPropagation(),
          children: !_ && /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
            /* @__PURE__ */ h.jsx(
              "div",
              {
                className: "vacuum-map__zone-handle vacuum-map__zone-handle--top",
                style: { transform: `translateX(-50%) scale(${y})` },
                onMouseDown: (I) => j(I, "top"),
                onTouchStart: (I) => j(I, "top"),
                title: "Resize"
              }
            ),
            /* @__PURE__ */ h.jsx(
              "div",
              {
                className: "vacuum-map__zone-handle vacuum-map__zone-handle--right",
                style: { transform: `translateY(-50%) scale(${y})` },
                onMouseDown: (I) => j(I, "right"),
                onTouchStart: (I) => j(I, "right"),
                title: "Resize"
              }
            ),
            /* @__PURE__ */ h.jsx(
              "div",
              {
                className: "vacuum-map__zone-handle vacuum-map__zone-handle--bottom",
                style: { transform: `translateX(-50%) scale(${y})` },
                onMouseDown: (I) => j(I, "bottom"),
                onTouchStart: (I) => j(I, "bottom"),
                title: "Resize"
              }
            ),
            /* @__PURE__ */ h.jsx(
              "div",
              {
                className: "vacuum-map__zone-handle vacuum-map__zone-handle--left",
                style: { transform: `translateY(-50%) scale(${y})` },
                onMouseDown: (I) => j(I, "left"),
                onTouchStart: (I) => j(I, "left"),
                title: "Resize"
              }
            ),
            /* @__PURE__ */ h.jsx(
              "button",
              {
                className: "vacuum-map__zone-clear",
                style: { transform: `scale(${y})` },
                onClick: P,
                title: o,
                children: "×"
              }
            )
          ] })
        }
      )
    }
  );
}
const _2 = "M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z";
function m2({
  position: n,
  calibrationPoints: a,
  imageWidth: o,
  imageHeight: s,
  isCleaning: l = !1
}) {
  const d = D.useMemo(() => Js(n.x, n.y, a, o, s), [n.x, n.y, a, o, s]), _ = Math.max(o, s) * 0.05, m = _ / 2;
  return /* @__PURE__ */ h.jsx(
    "svg",
    {
      className: `vacuum-position-marker${l ? " vacuum-position-marker--cleaning" : ""}`,
      viewBox: `0 0 ${o} ${s}`,
      preserveAspectRatio: "xMidYMid meet",
      children: /* @__PURE__ */ h.jsxs("g", { transform: `translate(${d.x - m}, ${d.y - m})`, children: [
        /* @__PURE__ */ h.jsx("circle", { cx: m, cy: m, r: m * 0.9, className: "vacuum-position-marker__bg" }),
        /* @__PURE__ */ h.jsx("g", { transform: `scale(${_ / 24})`, children: /* @__PURE__ */ h.jsx("path", { d: _2, className: "vacuum-position-marker__icon" }) })
      ] })
    }
  );
}
const f2 = "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.66C6,21.4 6.6,22 7.33,22H16.66C17.4,22 18,21.4 18,20.67V5.33C18,4.6 17.4,4 16.67,4M11,20V14.5H9L13,7V12.5H15";
function p2({ position: n, calibrationPoints: a, imageWidth: o, imageHeight: s }) {
  const l = D.useMemo(() => Js(n.x, n.y, a, o, s), [n.x, n.y, a, o, s]), d = Math.max(o, s) * 0.04, _ = d / 2;
  return /* @__PURE__ */ h.jsx("svg", { className: "charger-marker", viewBox: `0 0 ${o} ${s}`, preserveAspectRatio: "xMidYMid meet", children: /* @__PURE__ */ h.jsxs("g", { transform: `translate(${l.x - _}, ${l.y - _})`, children: [
    /* @__PURE__ */ h.jsx("circle", { cx: _, cy: _, r: _ * 0.9, className: "charger-marker__bg" }),
    /* @__PURE__ */ h.jsx("g", { transform: `scale(${d / 24})`, children: /* @__PURE__ */ h.jsx("path", { d: f2, className: "charger-marker__icon" }) })
  ] }) });
}
const g2 = 0.025, h2 = 0.2, v2 = 3;
function y2({ rooms: n, calibrationPoints: a, imageWidth: o, imageHeight: s, scale: l = 1 }) {
  const d = Number.isFinite(l) ? Math.min(Math.max(l, h2), v2) : 1, _ = Math.max(o, s) * g2 * d, m = _ * 0.6, p = _ * 0.4, f = _ * 0.5, v = D.useMemo(() => n.filter((y) => y.visibility !== "Hidden").filter((y) => {
    const w = y.x !== void 0 && y.y !== void 0, E = y.x0 !== void 0 && y.y0 !== void 0 && y.x1 !== void 0 && y.y1 !== void 0;
    return w || E;
  }).map((y) => {
    const w = y.x ?? (y.x0 + y.x1) / 2, E = y.y ?? (y.y0 + y.y1) / 2, z = Js(w, E, a, o, s);
    return { id: y.id, name: y.name, x: z.x, y: z.y };
  }), [n, a, o, s]);
  return /* @__PURE__ */ h.jsx("svg", { className: "room-labels", viewBox: `0 0 ${o} ${s}`, preserveAspectRatio: "xMidYMid meet", children: v.map((y) => {
    const E = y.name.length * _ * 0.6 + m * 2, z = _ + p * 2;
    return /* @__PURE__ */ h.jsxs("g", { transform: `translate(${y.x}, ${y.y})`, children: [
      /* @__PURE__ */ h.jsx(
        "rect",
        {
          className: "room-labels__bg",
          x: -E / 2,
          y: -z / 2,
          width: E,
          height: z,
          rx: f
        }
      ),
      /* @__PURE__ */ h.jsx("text", { className: "room-labels__text", textAnchor: "middle", dominantBaseline: "middle", fontSize: _, children: y.name })
    ] }, y.id);
  }) });
}
function b2({
  showViewToggle: n,
  showZoomControls: a,
  viewMode: o,
  onViewToggle: s,
  isMapLocked: l,
  onToggleLock: d,
  onResetTransformReady: _
}) {
  const { zoomIn: m, zoomOut: p, resetTransform: f } = uN();
  return D.useEffect(() => {
    _(f);
  }, [f, _]), /* @__PURE__ */ h.jsx(
    c2,
    {
      showViewToggle: n,
      showZoomControls: a,
      viewMode: o,
      onViewToggle: s,
      onZoomIn: () => m(),
      onZoomOut: () => p(),
      onZoomReset: () => f(),
      isMapLocked: l,
      onToggleLock: d
    }
  );
}
function w2({
  mapEntityId: n,
  selectedMode: a,
  selectedRooms: o,
  onRoomToggle: s,
  zone: l,
  onZoneChange: d,
  onImageDimensionsChange: _,
  defaultRoomView: m = "map"
}) {
  const { t: p } = Ie(), f = Rt(), v = Qs(), { phase: y } = Rn(), w = y === "cleaning" || y === "paused", E = f.states[n], z = E?.attributes?.entity_picture, N = D.useRef(null), j = D.useRef(null), R = D.useRef(null), [U, Y] = D.useState({ width: 0, height: 0 }), [P, I] = D.useState(m), [F, V] = D.useState(() => {
    try {
      const te = localStorage.getItem(Cp.MAP_LOCKED);
      return te === null ? !0 : te === "true";
    } catch {
      return !0;
    }
  }), W = D.useCallback((te) => {
    R.current = te;
  }, []), J = D.useCallback(() => {
    const te = !F;
    te && R.current && R.current(), V(te);
    try {
      localStorage.setItem(Cp.MAP_LOCKED, String(te));
    } catch {
    }
  }, [F]), se = a === "room" ? P : m, _e = D.useMemo(
    () => Oh(f, n, v.room_names),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [f.states[n]?.attributes?.rooms, n, v.room_names]
  ), ie = E?.attributes?.calibration_points ?? [], Ce = E?.attributes?.rotation ?? 0, we = E?.attributes?.vacuum_position, xe = E?.attributes?.charger_position, M = y === "cleaning", K = v.map_overlays ?? [], Q = U.width > 0 && U.height > 0, me = K.includes("vacuum") && we && Q, pe = K.includes("charger") && xe && Q, k = K.includes("room_labels") && Q, q = D.useCallback(
    (te) => {
      const le = te.currentTarget;
      le.naturalWidth && le.naturalHeight && (Y({ width: le.naturalWidth, height: le.naturalHeight }), _?.(le.naturalWidth, le.naturalHeight));
    },
    [_]
  ), X = !F && a !== "zone", $ = `vacuum-map${F ? " vacuum-map--locked" : ""}`;
  return /* @__PURE__ */ h.jsxs("div", { className: $, ref: N, children: [
    E && z ? /* @__PURE__ */ h.jsxs(
      iN,
      {
        initialScale: 1,
        minScale: 0.5,
        maxScale: 4,
        centerOnInit: !0,
        centerZoomedOut: !1,
        limitToBounds: !1,
        wheel: {
          step: 0.05,
          disabled: F
        },
        pinch: {
          step: 0.5,
          disabled: F
        },
        panning: {
          disabled: !X,
          velocityDisabled: !0,
          excluded: ["vacuum-map__room-segment"]
        },
        doubleClick: { disabled: !0 },
        children: [
          /* @__PURE__ */ h.jsx(
            b2,
            {
              showViewToggle: a === "room",
              showZoomControls: a !== "room" || se === "map",
              viewMode: se,
              onViewToggle: () => I((te) => te === "map" ? "list" : "map"),
              isMapLocked: F,
              onToggleLock: J,
              onResetTransformReady: W
            }
          ),
          /* @__PURE__ */ h.jsx(
            sN,
            {
              wrapperStyle: {
                width: "100%",
                height: "100%"
              },
              contentStyle: {
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ h.jsxs("div", { className: "vacuum-map__content", ref: j, children: [
                /* @__PURE__ */ h.jsx(
                  "img",
                  {
                    src: f.hassUrl(z),
                    alt: "Vacuum Map",
                    className: "vacuum-map__image",
                    onLoad: q,
                    draggable: !1
                  }
                ),
                pe && /* @__PURE__ */ h.jsx(
                  p2,
                  {
                    position: xe,
                    calibrationPoints: ie,
                    imageWidth: U.width,
                    imageHeight: U.height
                  }
                ),
                me && /* @__PURE__ */ h.jsx(
                  m2,
                  {
                    position: we,
                    calibrationPoints: ie,
                    imageWidth: U.width,
                    imageHeight: U.height,
                    isCleaning: M
                  }
                ),
                k && /* @__PURE__ */ h.jsx(
                  y2,
                  {
                    rooms: _e,
                    calibrationPoints: ie,
                    imageWidth: U.width,
                    imageHeight: U.height,
                    scale: v.room_label_scale
                  }
                ),
                a === "room" && se === "map" && !w && U.width > 0 && U.height > 0 && /* @__PURE__ */ h.jsx(
                  l2,
                  {
                    rooms: _e,
                    selectedRooms: o,
                    onRoomToggle: s,
                    calibrationPoints: ie,
                    imageWidth: U.width,
                    imageHeight: U.height,
                    rotation: Ce
                  }
                ),
                a === "zone" && /* @__PURE__ */ h.jsx(
                  d2,
                  {
                    zone: l,
                    onZoneChange: d,
                    clearZoneLabel: p("vacuum_map.clear_zone"),
                    contentRef: j
                  }
                )
              ] })
            }
          )
        ]
      }
    ) : /* @__PURE__ */ h.jsxs("div", { className: "vacuum-map__placeholder", children: [
      p("vacuum_map.no_map"),
      /* @__PURE__ */ h.jsx("br", {}),
      /* @__PURE__ */ h.jsx("small", { children: p("vacuum_map.looking_for", { entity: n }) })
    ] }),
    a === "room" && /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      se === "map" && !w && /* @__PURE__ */ h.jsx("div", { className: "vacuum-map__overlay", children: p("vacuum_map.room_overlay") }),
      se === "list" && /* @__PURE__ */ h.jsx(u2, { rooms: _e, selectedRooms: o, onRoomToggle: s })
    ] }),
    a === "zone" && /* @__PURE__ */ h.jsx("div", { className: "vacuum-map__overlay", children: p(l ? "vacuum_map.zone_overlay_resize" : "vacuum_map.zone_overlay_create") })
  ] });
}
function S2({ selectedMode: n, onModeChange: a }) {
  const { t: o } = Ie(), { phase: s } = Rn(), l = s === "cleaning" || s === "paused", d = [
    { value: "room", label: o("modes.room") },
    { value: "all", label: o("modes.all") },
    { value: "zone", label: o("modes.zone") }
  ];
  return /* @__PURE__ */ h.jsx("div", { className: `mode-tabs ${l ? "mode-tabs--disabled" : ""}`, children: d.map((_) => /* @__PURE__ */ h.jsx(
    "button",
    {
      onClick: () => a(_.value),
      className: `mode-tabs__button ${n === _.value ? "mode-tabs__button--active" : ""}`,
      disabled: l,
      children: _.label
    },
    _.value
  )) });
}
function E2({ onClick: n, text: a, disabled: o = !1 }) {
  return /* @__PURE__ */ h.jsxs(
    "button",
    {
      onClick: n,
      className: `action-buttons__clean ${o ? "action-buttons__clean--disabled" : ""}`,
      disabled: o,
      children: [
        /* @__PURE__ */ h.jsx("span", { className: "action-buttons__icon", children: Cw }),
        /* @__PURE__ */ h.jsx("span", { children: a })
      ]
    }
  );
}
function z2({ onClick: n, disabled: a = !1 }) {
  const { t: o } = Ie();
  return /* @__PURE__ */ h.jsxs(
    "button",
    {
      onClick: n,
      className: `action-buttons__pause ${a ? "action-buttons__pause--disabled" : ""}`,
      disabled: a,
      children: [
        /* @__PURE__ */ h.jsx("span", { className: "action-buttons__icon", children: xw }),
        /* @__PURE__ */ h.jsx("span", { children: o("actions.pause") })
      ]
    }
  );
}
function k2({ onClick: n, disabled: a = !1 }) {
  const { t: o } = Ie();
  return /* @__PURE__ */ h.jsxs(
    "button",
    {
      onClick: n,
      className: `action-buttons__resume ${a ? "action-buttons__resume--disabled" : ""}`,
      disabled: a,
      children: [
        /* @__PURE__ */ h.jsx("span", { className: "action-buttons__icon", children: Mw }),
        /* @__PURE__ */ h.jsx("span", { children: o("actions.resume") })
      ]
    }
  );
}
function zg({ onClick: n, action: a, disabled: o = !1 }) {
  const { t: s } = Ie(), l = s(a === "stop_and_dock" ? "actions.stop_and_dock" : "actions.stop");
  return /* @__PURE__ */ h.jsxs(
    "button",
    {
      onClick: n,
      className: `action-buttons__stop ${o ? "action-buttons__stop--disabled" : ""}`,
      disabled: o,
      children: [
        /* @__PURE__ */ h.jsx("span", { className: "action-buttons__icon", children: Ow }),
        /* @__PURE__ */ h.jsx("span", { children: l })
      ]
    }
  );
}
function T2({ onClick: n, disabled: a = !1 }) {
  const { t: o } = Ie();
  return /* @__PURE__ */ h.jsxs(
    "button",
    {
      onClick: n,
      className: `action-buttons__dock ${a ? "action-buttons__dock--disabled" : ""}`,
      disabled: a,
      children: [
        /* @__PURE__ */ h.jsx("span", { className: "action-buttons__icon", children: Rw }),
        /* @__PURE__ */ h.jsx("span", { children: o("actions.dock") })
      ]
    }
  );
}
function A2({
  selectedMode: n,
  selectedRoomsCount: a,
  onClean: o,
  onPause: s,
  onResume: l,
  onStop: d,
  onDock: _
}) {
  const { t: m, getRoomCountTranslation: p } = Ie(), { getStopAction: f } = hT(), { phase: v, controls: y } = Rn(), w = f(), E = () => {
    switch (n) {
      case "room":
        return p(a);
      case "all":
        return m("actions.clean_all");
      case "zone":
        return m("actions.zone_clean");
      default:
        return m("actions.clean");
    }
  }, z = () => d(w);
  return v === "cleaning" ? /* @__PURE__ */ h.jsxs("div", { className: "action-buttons", children: [
    /* @__PURE__ */ h.jsx(z2, { onClick: s, disabled: !y.canPause }),
    /* @__PURE__ */ h.jsx(zg, { onClick: z, action: w, disabled: !y.canStop })
  ] }) : v === "paused" ? /* @__PURE__ */ h.jsxs("div", { className: "action-buttons", children: [
    /* @__PURE__ */ h.jsx(k2, { onClick: l, disabled: !y.canResume }),
    /* @__PURE__ */ h.jsx(zg, { onClick: z, action: w, disabled: !y.canStop })
  ] }) : /* @__PURE__ */ h.jsxs("div", { className: "action-buttons", children: [
    /* @__PURE__ */ h.jsx(E2, { onClick: o, text: E(), disabled: !y.canStartCleaning }),
    /* @__PURE__ */ h.jsx(T2, { onClick: _, disabled: !y.canDock })
  ] });
}
function zn({ title: n, icon: a, defaultOpen: o = !1, children: s }) {
  const [l, d] = D.useState(o), _ = D.useCallback(() => {
    d((m) => !m);
  }, []);
  return /* @__PURE__ */ h.jsxs("div", { className: `accordion ${l ? "accordion--open" : ""}`, children: [
    /* @__PURE__ */ h.jsxs("button", { className: "accordion__header", onClick: _, type: "button", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "accordion__title-wrapper", children: [
        a && /* @__PURE__ */ h.jsx("span", { className: "accordion__icon", children: a }),
        /* @__PURE__ */ h.jsx("span", { className: "accordion__title", children: n })
      ] }),
      /* @__PURE__ */ h.jsx(xg, { className: "accordion__chevron" })
    ] }),
    /* @__PURE__ */ h.jsx("div", { className: "accordion__content", children: /* @__PURE__ */ h.jsx("div", { className: "accordion__content-inner", children: s }) })
  ] });
}
function _d({ checked: n = !1, onChange: a, disabled: o = !1 }) {
  const s = (l) => {
    a && !o && a(l.target.checked);
  };
  return /* @__PURE__ */ h.jsxs("label", { className: `toggle ${o ? "toggle--disabled" : ""}`, children: [
    /* @__PURE__ */ h.jsx("input", { type: "checkbox", className: "toggle__input", checked: n, onChange: s, disabled: o }),
    /* @__PURE__ */ h.jsx("span", { className: "toggle__slider", children: /* @__PURE__ */ h.jsx("span", { className: "toggle__knob" }) })
  ] });
}
function Qn({
  icon: n,
  label: a,
  selected: o = !1,
  onClick: s,
  size: l = "medium",
  iconStyle: d,
  disabled: _ = !1
}) {
  return /* @__PURE__ */ h.jsxs("div", { className: `circular-button ${_ ? "circular-button--disabled" : ""}`, children: [
    /* @__PURE__ */ h.jsx(
      "button",
      {
        className: `circular-button__circle circular-button__circle--${l} ${o ? "circular-button__circle--selected" : ""}`,
        onClick: s,
        disabled: _,
        children: typeof n == "string" ? /* @__PURE__ */ h.jsx("span", { className: "circular-button__icon", style: d, children: n }) : n
      }
    ),
    a && /* @__PURE__ */ h.jsx("span", { className: "circular-button__label", children: a })
  ] });
}
function md({ opened: n, onClose: a, children: o }) {
  return n ? /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    /* @__PURE__ */ h.jsx("div", { className: "modal__backdrop", onClick: a }),
    /* @__PURE__ */ h.jsxs("div", { className: "modal", children: [
      /* @__PURE__ */ h.jsx("div", { className: "modal__handle" }),
      /* @__PURE__ */ h.jsx("div", { className: "modal__content", children: o })
    ] })
  ] }) : null;
}
function ov({ options: n, value: a, onChange: o, disabled: s = !1 }) {
  return /* @__PURE__ */ h.jsx("div", { className: `segmented-control ${s ? "segmented-control--disabled" : ""}`, children: n.map((l) => /* @__PURE__ */ h.jsx(
    "button",
    {
      className: `segmented-control__button ${a === l.value ? "segmented-control__button--active" : ""}`,
      onClick: () => !s && o(l.value),
      disabled: s,
      children: l.label
    },
    l.value
  )) });
}
function N2({ message: n, onClose: a }) {
  return /* @__PURE__ */ h.jsxs("div", { className: "toast", children: [
    /* @__PURE__ */ h.jsx("span", { className: "toast__message", children: n }),
    /* @__PURE__ */ h.jsx("button", { className: "toast__close", onClick: a, "aria-label": "Close", children: "×" })
  ] });
}
class C2 extends D.Component {
  constructor(a) {
    super(a), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(a) {
    return { hasError: !0, error: a };
  }
  componentDidCatch(a, o) {
    ne.error("Caught error:", a), ne.error("Component stack:", o.componentStack);
  }
  handleRetry = () => {
    this.setState({ hasError: !1, error: null });
  };
  render() {
    return this.state.hasError ? this.props.fallback ? this.props.fallback : /* @__PURE__ */ h.jsx("div", { className: "error-boundary", children: /* @__PURE__ */ h.jsxs("div", { className: "error-boundary__content", children: [
      /* @__PURE__ */ h.jsx("div", { className: "error-boundary__icon", children: "!" }),
      /* @__PURE__ */ h.jsx("h3", { className: "error-boundary__title", children: "Something went wrong" }),
      /* @__PURE__ */ h.jsx("p", { className: "error-boundary__message", children: "The card encountered an error. Try refreshing the page." }),
      /* @__PURE__ */ h.jsx("button", { className: "error-boundary__retry", onClick: this.handleRetry, children: "Try Again" })
    ] }) }) : this.props.children;
  }
}
function x2({
  cleangeniusMode: n,
  cleangeniusModeList: a,
  cleangenius: o,
  baseEntityId: s
}) {
  const l = Rt(), { phase: d } = Rn(), { setSelectOption: _ } = Vu(l), { t: m } = Ie(), p = Xu(s), f = d === "cleaning" || d === "paused", v = yt(l, p.cleangenius), y = yt(l, p.cleaningRoute), w = yt(l, p.cleangeniusMode), E = f || w.unavailable, z = f || v.unavailable, N = (j) => {
    const R = j ? On.DEEP_CLEANING : On.ROUTINE_CLEANING, U = j ? si.DEEP : si.STANDARD;
    _(p.cleangenius, Fg(R)), y.available && _(p.cleaningRoute, rr(U));
  };
  return /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__content", children: [
    /* @__PURE__ */ h.jsxs("section", { className: "cleaning-mode-modal__section", children: [
      /* @__PURE__ */ h.jsx("h3", { className: "cleaning-mode-modal__section-title", children: m("cleangenius_mode.cleaning_mode_title") }),
      /* @__PURE__ */ h.jsx(
        "div",
        {
          className: `cleaning-mode-modal__mode-grid ${E ? "cleaning-mode-modal__mode-grid--disabled" : ""}`,
          children: a.map((j, R) => {
            const U = j, Y = j === "Vacuum and mop";
            return /* @__PURE__ */ h.jsxs(
              "div",
              {
                className: `cleaning-mode-modal__mode-card ${j === n ? "cleaning-mode-modal__mode-card--selected" : ""} ${E ? "cleaning-mode-modal__mode-card--disabled" : ""}`,
                onClick: () => !E && _(p.cleangeniusMode, Fw(U)),
                style: { cursor: E ? "not-allowed" : "pointer" },
                children: [
                  /* @__PURE__ */ h.jsx(
                    "div",
                    {
                      className: `cleaning-mode-modal__mode-icon cleaning-mode-modal__mode-icon--${Y ? "vac-mop" : "mop-after"}`,
                      children: OT(U)
                    }
                  ),
                  /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__mode-label", children: CT(U, m) }),
                  j === n && /* @__PURE__ */ h.jsx("div", { className: "cleaning-mode-modal__mode-checkmark", children: /* @__PURE__ */ h.jsx("span", { children: "✓" }) })
                ]
              },
              R
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ h.jsxs(
      "div",
      {
        className: `cleaning-mode-modal__setting ${z ? "cleaning-mode-modal__setting--disabled" : ""}`,
        children: [
          /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__setting-label", children: m("cleangenius_mode.deep_cleaning") }),
          /* @__PURE__ */ h.jsx(
            _d,
            {
              checked: o === On.DEEP_CLEANING,
              onChange: N,
              disabled: z
            }
          )
        ]
      }
    )
  ] });
}
function M2({
  cleaningMode: n,
  cleaningModeList: a,
  onSelect: o,
  entityId: s,
  t: l,
  disabled: d = !1,
  customizeSelected: _ = !1,
  hideCustomize: m = !1
}) {
  const p = m ? a.filter((f) => f !== he.CUSTOMIZE) : a;
  return /* @__PURE__ */ h.jsx("div", { className: `cleaning-mode-modal__power-grid ${d ? "cleaning-mode-modal__power-grid--disabled" : ""}`, children: p.map((f, v) => {
    const y = f === he.CUSTOMIZE ? _ : f === n && !_;
    return /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__mode-option", children: [
      /* @__PURE__ */ h.jsx(
        Qn,
        {
          size: "small",
          selected: y,
          onClick: () => {
            if (d) return;
            const w = f === he.CUSTOMIZE ? he.CUSTOMIZE : Xw(f);
            o(s, w);
          },
          icon: MT(f)
        }
      ),
      /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__mode-option-label", children: AT(f, l) })
    ] }, v);
  }) });
}
const O2 = ["Quiet", "Standard", "Strong", "Turbo"];
function R2({
  suctionLevel: n,
  suctionLevelList: a,
  maxSuctionPower: o,
  onSelectSuctionLevel: s,
  onToggleMaxPower: l,
  suctionLevelEntityId: d,
  maxSuctionPowerEntityId: _,
  maxPlusDescription: m,
  t: p,
  suctionLevelDisabled: f = !1,
  maxPowerDisabled: v = !1,
  hideMaxPower: y = !1
}) {
  const w = a.length > 0 ? a : O2, E = f || !y && o;
  return /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    /* @__PURE__ */ h.jsx(
      "div",
      {
        className: `cleaning-mode-modal__power-grid ${E ? "cleaning-mode-modal__power-grid--disabled" : ""}`,
        children: w.map((z, N) => /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__power-option", children: [
          /* @__PURE__ */ h.jsx(
            Qn,
            {
              size: "small",
              selected: !o && z === n,
              onClick: () => !E && s(d, rr(z)),
              icon: RT(z),
              disabled: E
            }
          ),
          /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__power-label", children: xT(z, p) })
        ] }, N))
      }
    ),
    !y && /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__max-plus", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__max-plus-header", children: [
        /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__max-plus-title", children: "Max+" }),
        /* @__PURE__ */ h.jsx(
          _d,
          {
            checked: o,
            disabled: v,
            onChange: (z) => l(_, z)
          }
        )
      ] }),
      /* @__PURE__ */ h.jsx("p", { className: "cleaning-mode-modal__max-plus-description", children: m })
    ] })
  ] });
}
function D2({
  wetnessLevel: n,
  mopPadHumidity: a,
  onChangeWetness: o,
  entityId: s,
  slightlyDryLabel: l,
  moistLabel: d,
  wetLabel: _,
  disabled: m = !1
}) {
  const [p, f] = D.useState(n), v = rd();
  D.useEffect(() => {
    f(n);
  }, [n]);
  const { MIN: y, MAX: w } = Yw.WETNESS, E = (p - y) / (w - y) * 100, z = 20, N = `calc(${E}% + ${z / 2 - E * z / 100}px)`, j = (P) => {
    m || f(parseInt(P.target.value));
  }, R = () => {
    !m && p !== n && o(s, p);
  }, U = v ? "to left" : "to right", Y = [
    { humidity: ui.SLIGHTLY_DRY, text: l },
    { humidity: ui.MOIST, text: d },
    { humidity: ui.WET, text: _ }
  ];
  return /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    /* @__PURE__ */ h.jsx(
      "div",
      {
        className: `cleaning-mode-modal__slider-container ${m ? "cleaning-mode-modal__slider-container--disabled" : ""}`,
        children: /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__slider-wrapper", children: [
          /* @__PURE__ */ h.jsx(
            "input",
            {
              type: "range",
              min: y,
              max: w,
              value: p,
              onChange: j,
              onMouseUp: R,
              onTouchEnd: R,
              disabled: m,
              className: "cleaning-mode-modal__slider",
              style: {
                background: `linear-gradient(${U}, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${E}%, var(--accent-bg-secondary-hover) ${E}%, var(--accent-bg-secondary-hover) 100%)`
              }
            }
          ),
          /* @__PURE__ */ h.jsx(
            "div",
            {
              className: "cleaning-mode-modal__slider-tooltip",
              style: v ? { right: N } : { left: N },
              children: p
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ h.jsx("div", { className: "cleaning-mode-modal__slider-labels", children: Y.map(({ humidity: P, text: I }) => /* @__PURE__ */ h.jsx(
      "span",
      {
        className: `cleaning-mode-modal__slider-label cleaning-mode-modal__slider-label--${a === P ? "active" : "inactive"}`,
        children: I
      },
      P
    )) })
  ] });
}
const j2 = ["Low", "Medium", "High"];
function L2({
  waterVolume: n,
  waterVolumeList: a,
  onSelect: o,
  entityId: s,
  t: l,
  disabled: d = !1
}) {
  const _ = a.length > 0 ? a : j2;
  return /* @__PURE__ */ h.jsx("div", { className: `cleaning-mode-modal__power-grid ${d ? "cleaning-mode-modal__power-grid--disabled" : ""}`, children: _.map((m, p) => /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__power-option", children: [
    /* @__PURE__ */ h.jsx(
      Qn,
      {
        size: "small",
        selected: m === n,
        onClick: () => !d && o(s, rr(m)),
        icon: LT(),
        disabled: d
      }
    ),
    /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__power-label", children: UT(m, l) })
  ] }, p)) });
}
const U2 = ["Slightly dry", "Moist", "Wet"];
function q2({
  mopPadHumidity: n,
  mopPadHumidityList: a,
  onSelect: o,
  entityId: s,
  t: l,
  disabled: d = !1
}) {
  const _ = a.length > 0 ? a : U2;
  return /* @__PURE__ */ h.jsx("div", { className: `cleaning-mode-modal__power-grid ${d ? "cleaning-mode-modal__power-grid--disabled" : ""}`, children: _.map((m, p) => /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__power-option", children: [
    /* @__PURE__ */ h.jsx(
      Qn,
      {
        size: "small",
        selected: m === n,
        onClick: () => !d && o(s, rr(m)),
        icon: qT(),
        disabled: d
      }
    ),
    /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__power-label", children: GT(m, l) })
  ] }, p)) });
}
const kg = {
  "By room": "mop_washing_frequency.by_room",
  "By area": "mop_washing_frequency.by_area",
  "By time": "mop_washing_frequency.by_time"
};
function G2(n, a) {
  return a && kg[n] ? a(kg[n]) : n;
}
function I2({
  selfCleanFrequency: n,
  selfCleanFrequencyList: a,
  selfCleanArea: o,
  selfCleanAreaMin: s,
  selfCleanAreaMax: l,
  selfCleanTime: d,
  selfCleanTimeMin: _,
  selfCleanTimeMax: m,
  onSelectFrequency: p,
  onChangeArea: f,
  onChangeTime: v,
  frequencyEntityId: y,
  areaEntityId: w,
  timeEntityId: E,
  t: z,
  frequencyDisabled: N = !1,
  areaDisabled: j = !1,
  timeDisabled: R = !1
}) {
  const [U, Y] = D.useState(o), [P, I] = D.useState(d), F = od(), V = rd();
  D.useEffect(() => {
    Y(o);
  }, [o]), D.useEffect(() => {
    I(d);
  }, [d]);
  const W = n === "By area", J = n === "By time", se = W || J, _e = W ? U : P, ie = W ? s : _, Ce = W ? l : m, we = (_e - ie) / (Ce - ie) * 100, xe = 20, M = `calc(${we}% + ${xe / 2 - we * xe / 100}px)`, K = z ? z("units.minutes_short") : "m", Q = V ? "to left" : "to right", me = W ? j : R, pe = (q) => {
    if (me) return;
    const X = parseInt(q.target.value);
    W ? Y(X) : I(X);
  }, k = () => {
    me || (W && U !== o ? f(w, U) : J && P !== d && v(E, P));
  };
  return /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    /* @__PURE__ */ h.jsx(
      "div",
      {
        className: `cleaning-mode-modal__horizontal-scroll ${N ? "cleaning-mode-modal__horizontal-scroll--disabled" : ""}`,
        children: a.map((q, X) => /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__mode-option", children: [
          /* @__PURE__ */ h.jsx(
            Qn,
            {
              size: "small",
              selected: q === n,
              onClick: () => !N && p(y, Ww(q)),
              icon: jT(q),
              disabled: N
            }
          ),
          /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__mode-option-label", children: G2(q, z) })
        ] }, X))
      }
    ),
    se && /* @__PURE__ */ h.jsx(
      "div",
      {
        className: `cleaning-mode-modal__slider-container ${me ? "cleaning-mode-modal__slider-container--disabled" : ""}`,
        style: { marginTop: "1rem" },
        children: /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__slider-wrapper", children: [
          /* @__PURE__ */ h.jsx(
            "input",
            {
              type: "range",
              min: ie,
              max: Ce,
              value: _e,
              onChange: pe,
              onMouseUp: k,
              onTouchEnd: k,
              disabled: me,
              className: "cleaning-mode-modal__slider",
              style: {
                background: `linear-gradient(${Q}, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${we}%, var(--accent-bg-secondary-hover) ${we}%, var(--accent-bg-secondary-hover) 100%)`
              }
            }
          ),
          /* @__PURE__ */ h.jsx(
            "div",
            {
              className: "cleaning-mode-modal__slider-tooltip",
              style: V ? { right: M } : { left: M },
              children: W ? `${U}${F}` : `${P}${K}`
            }
          )
        ] })
      }
    )
  ] });
}
function H2(n, a) {
  const o = `cleaning_routes.${n.toLowerCase()}`, s = a(o);
  return s === o ? n : s;
}
function P2({
  cleaningRoute: n,
  cleaningRouteList: a,
  onSelect: o,
  entityId: s,
  disabled: l = !1
}) {
  const { t: d } = Ie();
  return /* @__PURE__ */ h.jsx("div", { className: `cleaning-mode-modal__route-grid ${l ? "cleaning-mode-modal__route-grid--disabled" : ""}`, children: a.map((_, m) => /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__route-option", children: [
    /* @__PURE__ */ h.jsx(
      Qn,
      {
        size: "small",
        selected: _ === n,
        onClick: () => !l && o(s, rr(_)),
        icon: DT(_),
        disabled: l
      }
    ),
    /* @__PURE__ */ h.jsx("span", { className: "cleaning-mode-modal__route-label", children: H2(_, d) })
  ] }, m)) });
}
function B2({
  cleaningMode: n,
  cleaningModeList: a,
  suctionLevel: o,
  suctionLevelList: s,
  wetnessLevel: l,
  mopPadHumidity: d,
  mopPadHumidityList: _,
  waterVolume: m,
  waterVolumeList: p,
  cleaningRoute: f,
  cleaningRouteList: v,
  maxSuctionPower: y,
  selfCleanArea: w,
  selfCleanFrequency: E,
  selfCleanFrequencyList: z,
  selfCleanAreaMin: N,
  selfCleanAreaMax: j,
  selfCleanTime: R,
  selfCleanTimeMin: U,
  selfCleanTimeMax: Y,
  baseEntityId: P,
  onCleaningModeSelect: I,
  showOnlyCleaningModeSelector: F = !1
}) {
  const V = Rt(), W = Zt(), { controls: J, phase: se, isCustomizedCleaning: _e } = Rn(), { setSelectOption: ie, setSwitch: Ce, setNumber: we, setFanSpeed: xe } = Vu(V), M = Xu(P), { t: K } = Ie(), Q = lr(), me = Q.has(it.MAX_SUCTION_POWER), pe = Q.has(it.WETNESS_LEVEL), k = Q.has(it.SELF_CLEAN_FREQUENCY), q = Q.has(it.CLEANING_ROUTE), X = Q.has(it.SELF_WASH_BASE), $ = !pe && !X && p.length > 0, te = X && !pe && _.length > 0, le = yt(V, M.cleaningMode), ve = se === "cleaning" || se === "paused", Ye = I ?? ie, Le = D.useCallback(
    (tn, Dt) => {
      if (ve && !_e) {
        const yn = {
          quiet: "silent",
          standard: "standard",
          strong: "strong",
          turbo: "turbo"
        };
        xe(W.entity_id, yn[Dt] ?? Dt);
      } else ve || ie(M.suctionLevel, Dt);
    },
    [ve, _e, xe, ie, W.entity_id, M.suctionLevel]
  ), kt = ve || !F && le.unavailable;
  return /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__content", children: [
    /* @__PURE__ */ h.jsxs("section", { className: "cleaning-mode-modal__section", children: [
      /* @__PURE__ */ h.jsx("h3", { className: "cleaning-mode-modal__section-title", children: K("custom_mode.cleaning_mode_title") }),
      /* @__PURE__ */ h.jsx(
        M2,
        {
          cleaningMode: n,
          cleaningModeList: a,
          onSelect: Ye,
          entityId: M.cleaningMode,
          t: K,
          customizeSelected: F,
          hideCustomize: ve,
          disabled: kt
        }
      )
    ] }),
    !F && /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      /* @__PURE__ */ h.jsxs("section", { className: "cleaning-mode-modal__section", children: [
        /* @__PURE__ */ h.jsx("h3", { className: "cleaning-mode-modal__section-title", children: K("custom_mode.suction_power_title") }),
        /* @__PURE__ */ h.jsx(
          R2,
          {
            suctionLevel: o,
            suctionLevelList: s,
            maxSuctionPower: y,
            onSelectSuctionLevel: Le,
            onToggleMaxPower: Ce,
            suctionLevelEntityId: M.suctionLevel,
            maxSuctionPowerEntityId: M.maxSuctionPower,
            maxPlusDescription: K("custom_mode.max_plus_description"),
            t: K,
            suctionLevelDisabled: !J.canChangeSuctionPower,
            maxPowerDisabled: !J.canToggleMaxPower,
            hideMaxPower: !me
          }
        )
      ] }),
      $ && n !== he.SWEEPING && /* @__PURE__ */ h.jsxs("section", { className: "cleaning-mode-modal__section", children: [
        /* @__PURE__ */ h.jsx("h3", { className: "cleaning-mode-modal__section-title", children: K("custom_mode.water_volume_title") }),
        /* @__PURE__ */ h.jsx(
          L2,
          {
            waterVolume: m,
            waterVolumeList: p,
            onSelect: ie,
            entityId: M.waterVolume,
            t: K,
            disabled: !J.canChangeWetness
          }
        )
      ] }),
      pe && n !== he.SWEEPING && /* @__PURE__ */ h.jsxs("section", { className: "cleaning-mode-modal__section", children: [
        /* @__PURE__ */ h.jsx("h3", { className: "cleaning-mode-modal__section-title", children: K("custom_mode.wetness_title") }),
        /* @__PURE__ */ h.jsx(
          D2,
          {
            wetnessLevel: l,
            mopPadHumidity: d,
            onChangeWetness: we,
            entityId: M.wetnessLevel,
            slightlyDryLabel: K("custom_mode.slightly_dry"),
            moistLabel: K("custom_mode.moist"),
            wetLabel: K("custom_mode.wet"),
            disabled: !J.canChangeWetness
          }
        )
      ] }),
      te && n !== he.SWEEPING && /* @__PURE__ */ h.jsxs("section", { className: "cleaning-mode-modal__section", children: [
        /* @__PURE__ */ h.jsx("h3", { className: "cleaning-mode-modal__section-title", children: K("custom_mode.mop_pad_humidity_title") }),
        /* @__PURE__ */ h.jsx(
          q2,
          {
            mopPadHumidity: d,
            mopPadHumidityList: _,
            onSelect: ie,
            entityId: M.mopPadHumidity,
            t: K,
            disabled: !J.canChangeWetness
          }
        )
      ] }),
      k && /* @__PURE__ */ h.jsxs("section", { className: "cleaning-mode-modal__section", children: [
        /* @__PURE__ */ h.jsx("h3", { className: "cleaning-mode-modal__section-title", children: K("custom_mode.mop_washing_frequency_title") }),
        /* @__PURE__ */ h.jsx(
          I2,
          {
            selfCleanFrequency: E,
            selfCleanFrequencyList: z,
            selfCleanArea: w,
            selfCleanAreaMin: N,
            selfCleanAreaMax: j,
            selfCleanTime: R,
            selfCleanTimeMin: U,
            selfCleanTimeMax: Y,
            onSelectFrequency: ie,
            onChangeArea: we,
            onChangeTime: we,
            frequencyEntityId: M.selfCleanFrequency,
            areaEntityId: M.selfCleanArea,
            timeEntityId: M.selfCleanTime,
            t: K,
            frequencyDisabled: !J.canChangeMopFrequency,
            areaDisabled: !1,
            timeDisabled: !1
          }
        )
      ] }),
      q && v.length > 0 && /* @__PURE__ */ h.jsxs("section", { className: "cleaning-mode-modal__section", children: [
        /* @__PURE__ */ h.jsx("div", { className: "cleaning-mode-modal__section-header", children: /* @__PURE__ */ h.jsx("h3", { className: "cleaning-mode-modal__section-title", children: K("custom_mode.route_title") }) }),
        /* @__PURE__ */ h.jsx(
          P2,
          {
            cleaningRoute: f,
            cleaningRouteList: v,
            onSelect: ie,
            entityId: M.cleaningRoute,
            disabled: !J.canChangeRoute
          }
        )
      ] })
    ] })
  ] });
}
const Z2 = {
  quiet: Mu,
  silent: Mu,
  standard: Yu,
  strong: Vg,
  turbo: Ou,
  max: Ou
}, Y2 = {
  light: /* @__PURE__ */ h.jsx(Gs, { size: 18, strokeWidth: 1.5 }),
  normal: /* @__PURE__ */ h.jsx(Gs, { size: 18, strokeWidth: 2.5 })
}, V2 = {
  normal: /* @__PURE__ */ h.jsx(Cu, { size: 18, strokeWidth: 1.5 }),
  warm: /* @__PURE__ */ h.jsx(Cu, { size: 18, strokeWidth: 2.5 })
}, K2 = {
  quiet: "Q",
  silent: "Q",
  standard: "S",
  strong: "T",
  turbo: "T",
  max: "M"
};
function X2(n) {
  return n ? K2[n] ?? n.charAt(0).toUpperCase() : "-";
}
function F2(n, a, o) {
  if (n === null) return "-";
  const s = (o - a) / 3;
  return n <= a + s ? "D" : n <= a + s * 2 ? "M" : "W";
}
function W2({
  value: n,
  min: a,
  max: o,
  onChange: s,
  slightlyDryLabel: l,
  moistLabel: d,
  wetLabel: _,
  disabled: m = !1
}) {
  const [p, f] = D.useState(n), v = rd();
  D.useEffect(() => {
    f(n);
  }, [n]);
  const y = (p - a) / (o - a) * 100, w = 20, E = `calc(${y}% + ${w / 2 - y * w / 100}px)`, z = (P) => {
    m || f(parseInt(P.target.value));
  }, N = () => {
    !m && p !== n && s(p);
  }, j = v ? "to left" : "to right", R = (o - a) / 3, U = p <= a + R ? "dry" : p <= a + R * 2 ? "moist" : "wet", Y = [
    { key: "dry", text: l },
    { key: "moist", text: d },
    { key: "wet", text: _ }
  ];
  return /* @__PURE__ */ h.jsxs("div", { className: `customize-mode__wetness-slider ${m ? "customize-mode__wetness-slider--disabled" : ""}`, children: [
    /* @__PURE__ */ h.jsx("div", { className: "cleaning-mode-modal__slider-container", children: /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal__slider-wrapper", children: [
      /* @__PURE__ */ h.jsx(
        "input",
        {
          type: "range",
          min: a,
          max: o,
          value: p,
          onChange: z,
          onMouseUp: N,
          onTouchEnd: N,
          disabled: m,
          className: "cleaning-mode-modal__slider",
          style: {
            background: `linear-gradient(${j}, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${y}%, var(--accent-bg-secondary-hover) ${y}%, var(--accent-bg-secondary-hover) 100%)`
          }
        }
      ),
      /* @__PURE__ */ h.jsx(
        "div",
        {
          className: "cleaning-mode-modal__slider-tooltip",
          style: v ? { right: E } : { left: E },
          children: p
        }
      )
    ] }) }),
    /* @__PURE__ */ h.jsx("div", { className: "cleaning-mode-modal__slider-labels", children: Y.map(({ key: P, text: I }) => /* @__PURE__ */ h.jsx(
      "span",
      {
        className: `cleaning-mode-modal__slider-label cleaning-mode-modal__slider-label--${U === P ? "active" : "inactive"}`,
        children: I
      },
      P
    )) })
  ] });
}
function $2({
  setting: n,
  setSuctionLevel: a,
  setWetnessLevel: o,
  setCleaningTimes: s,
  setMopPressure: l,
  setMopTemperature: d,
  t: _,
  suctionDisabled: m = !1,
  wetnessDisabled: p = !1,
  cleaningTimesDisabled: f = !1,
  mopPressureDisabled: v = !1,
  mopTemperatureDisabled: y = !1
}) {
  return /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__room-settings-content", children: [
    n.suctionLevelOptions.length > 0 && /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__setting-group", children: [
      /* @__PURE__ */ h.jsx("span", { className: "customize-mode__setting-label", children: _("custom_mode.suction_power_title") }),
      /* @__PURE__ */ h.jsx("div", { className: `customize-mode__options ${m ? "customize-mode__options--disabled" : ""}`, children: n.suctionLevelOptions.map((w) => /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__option", children: [
        /* @__PURE__ */ h.jsx(
          Qn,
          {
            size: "small",
            selected: n.suctionLevel === w,
            onClick: () => !m && a(n.roomId, w),
            icon: Z2[w] || Yu,
            disabled: m
          }
        ),
        /* @__PURE__ */ h.jsx("span", { className: "customize-mode__option-label", children: _(`suction_levels.${w.toLowerCase()}`) })
      ] }, w)) })
    ] }),
    n.wetnessLevel !== null && /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__setting-group", children: [
      /* @__PURE__ */ h.jsx("span", { className: "customize-mode__setting-label", children: _("custom_mode.wetness_title") }),
      /* @__PURE__ */ h.jsx(
        W2,
        {
          value: n.wetnessLevel,
          min: n.wetnessMin,
          max: n.wetnessMax,
          onChange: (w) => o(n.roomId, w),
          slightlyDryLabel: _("custom_mode.slightly_dry"),
          moistLabel: _("custom_mode.moist"),
          wetLabel: _("custom_mode.wet"),
          disabled: p
        }
      )
    ] }),
    n.mopPressureOptions.length > 0 && /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__setting-group", children: [
      /* @__PURE__ */ h.jsx("span", { className: "customize-mode__setting-label", children: _("custom_mode.mop_pressure_title") }),
      /* @__PURE__ */ h.jsx("div", { className: `customize-mode__options ${v ? "customize-mode__options--disabled" : ""}`, children: n.mopPressureOptions.map((w) => /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__option", children: [
        /* @__PURE__ */ h.jsx(
          Qn,
          {
            size: "small",
            selected: n.mopPressure === w,
            onClick: () => !v && l(n.roomId, w),
            icon: Y2[w.toLowerCase()] || /* @__PURE__ */ h.jsx(Gs, { size: 18 }),
            disabled: v
          }
        ),
        /* @__PURE__ */ h.jsx("span", { className: "customize-mode__option-label", children: _(`mop_pressure.${w.toLowerCase()}`) })
      ] }, w)) })
    ] }),
    n.mopTemperatureOptions.length > 0 && /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__setting-group", children: [
      /* @__PURE__ */ h.jsx("span", { className: "customize-mode__setting-label", children: _("custom_mode.mop_temperature_title") }),
      /* @__PURE__ */ h.jsx(
        "div",
        {
          className: `customize-mode__options ${y ? "customize-mode__options--disabled" : ""}`,
          children: n.mopTemperatureOptions.map((w) => /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__option", children: [
            /* @__PURE__ */ h.jsx(
              Qn,
              {
                size: "small",
                selected: n.mopTemperature === w,
                onClick: () => !y && d(n.roomId, w),
                icon: V2[w.toLowerCase()] || /* @__PURE__ */ h.jsx(Cu, { size: 18 }),
                disabled: y
              }
            ),
            /* @__PURE__ */ h.jsx("span", { className: "customize-mode__option-label", children: _(`mop_temperature.${w.toLowerCase()}`) })
          ] }, w))
        }
      )
    ] }),
    n.cleaningTimesOptions.length > 0 && /* @__PURE__ */ h.jsxs("div", { className: "customize-mode__setting-group", children: [
      /* @__PURE__ */ h.jsx("span", { className: "customize-mode__setting-label", children: _("customize.cycles") }),
      /* @__PURE__ */ h.jsx(
        "div",
        {
          className: `customize-mode__options customize-mode__options--pills ${f ? "customize-mode__options--disabled" : ""}`,
          children: n.cleaningTimesOptions.map((w) => /* @__PURE__ */ h.jsx(
            "button",
            {
              className: `customize-mode__pill customize-mode__pill--cycle ${n.cleaningTimes === w ? "customize-mode__pill--selected" : ""}`,
              onClick: () => !f && s(n.roomId, w),
              disabled: f,
              children: w
            },
            w
          ))
        }
      )
    ] })
  ] });
}
function Q2({ baseEntityId: n }) {
  const { t: a } = Ie(), o = Rt(), s = Qs(), l = vt("camera", n, Sw.MAP.key), d = Oh(o, l, s.room_names), { roomSettings: _, setSuctionLevel: m, setWetnessLevel: p, setCleaningTimes: f, setMopPressure: v, setMopTemperature: y } = vT({
    hass: o,
    baseEntityId: n,
    rooms: d.map((E) => ({ id: E.id, name: E.name }))
  });
  if (d.length === 0)
    return /* @__PURE__ */ h.jsx("div", { className: "customize-mode", children: /* @__PURE__ */ h.jsx("div", { className: "customize-mode__empty", children: /* @__PURE__ */ h.jsx("p", { children: a("customize.no_rooms") }) }) });
  const w = d.filter((E) => _.get(E.id)?.hasEntities);
  return w.length === 0 ? /* @__PURE__ */ h.jsx("div", { className: "customize-mode", children: /* @__PURE__ */ h.jsx("div", { className: "customize-mode__empty", children: /* @__PURE__ */ h.jsx("p", { children: a("customize.no_rooms") }) }) }) : /* @__PURE__ */ h.jsx("div", { className: "customize-mode", children: /* @__PURE__ */ h.jsx("div", { className: "customize-mode__room-accordions", children: w.map((E) => {
    const z = _.get(E.id);
    if (!z) return null;
    const N = Mt(
      "select",
      n,
      E.id,
      mn.SUCTION_LEVEL.key
    ), j = Mt(
      "number",
      n,
      E.id,
      xu.WETNESS_LEVEL.key
    ), R = Mt(
      "select",
      n,
      E.id,
      mn.CLEANING_TIMES.key
    ), U = Mt(
      "select",
      n,
      E.id,
      mn.MOP_PRESSURE.key
    ), Y = Mt(
      "select",
      n,
      E.id,
      mn.MOP_TEMPERATURE.key
    ), P = yt(o, N), I = yt(o, j), F = yt(o, R), V = yt(o, U), W = yt(o, Y), J = [];
    return z.suctionLevel && J.push(X2(z.suctionLevel)), z.wetnessLevel !== null && J.push(F2(z.wetnessLevel, z.wetnessMin, z.wetnessMax)), z.cleaningTimes && J.push(`${z.cleaningTimes}`), /* @__PURE__ */ h.jsx(
      zn,
      {
        title: E.name,
        icon: /* @__PURE__ */ h.jsx("span", { className: "customize-mode__badges", children: J.map((se, _e) => /* @__PURE__ */ h.jsx("span", { className: "customize-mode__badge", children: se }, _e)) }),
        children: /* @__PURE__ */ h.jsx(
          $2,
          {
            setting: z,
            setSuctionLevel: m,
            setWetnessLevel: p,
            setCleaningTimes: f,
            setMopPressure: v,
            setMopTemperature: y,
            t: a,
            suctionDisabled: P.unavailable,
            wetnessDisabled: I.unavailable,
            cleaningTimesDisabled: F.unavailable,
            mopPressureDisabled: V.unavailable,
            mopTemperatureDisabled: W.unavailable
          }
        )
      },
      E.id
    );
  }) }) });
}
function J2({ opened: n, onClose: a }) {
  const { t: o } = Ie(), s = Zt(), l = Rt(), { phase: d, isCustomizedCleaning: _ } = Rn(), m = Ku(s.entity_id), { setSelectOption: p } = Vu(l), f = Xu(m), y = lr().has(it.CLEANGENIUS), w = d === "cleaning" || d === "paused", E = vt("switch", m, Bu.CUSTOMIZED_CLEANING.key), z = yt(l, f.cleangenius), N = (wt, bn) => {
    const ea = s.attributes[wt];
    return Array.isArray(ea) ? ea : bn;
  }, j = z.state?.toLowerCase(), R = je(s.attributes.cleangenius, On.OFF), Y = j && j !== "unavailable" && j !== "unknown" ? j !== "off" : R !== On.OFF, P = R, I = je(s.attributes.cleaning_mode, Et.CLEANING_MODE), F = je(s.attributes.cleangenius_mode, Et.CLEANGENIUS_MODE), V = je(s.attributes.suction_level, Et.SUCTION_LEVEL), W = je(s.attributes.wetness_level, Et.WETNESS_LEVEL), J = je(s.attributes.water_volume, Et.WATER_VOLUME), se = je(s.attributes.cleaning_route, Et.CLEANING_ROUTE), _e = je(s.attributes.max_suction_power, Et.MAX_SUCTION_POWER), ie = je(s.attributes.self_clean_area, Et.SELF_CLEAN_AREA), Ce = je(s.attributes.self_clean_frequency, Et.SELF_CLEAN_FREQUENCY), we = je(s.attributes.mop_pad_humidity, Et.MOP_PAD_HUMIDITY), xe = N("self_clean_frequency_list", []), M = xe.length > 0 ? xe : ["By area", "By time", "By room"], K = je(s.attributes.self_clean_area_min, Et.SELF_CLEAN_AREA_MIN), Q = je(s.attributes.self_clean_area_max, Et.SELF_CLEAN_AREA_MAX), me = je(s.attributes.previous_self_clean_time, Et.SELF_CLEAN_TIME), pe = je(s.attributes.self_clean_time_min, Et.SELF_CLEAN_TIME_MIN), k = je(s.attributes.self_clean_time_max, Et.SELF_CLEAN_TIME_MAX), q = [
    { value: tr.CLEANGENIUS, label: o("cleaning_mode.clean_genius") },
    { value: tr.CUSTOM, label: o("cleaning_mode.custom") }
  ], X = N("cleaning_mode_list", []), te = [...X.length > 0 ? X : ["Sweeping", "Mopping", "Sweeping and mopping", "Mopping after sweeping"], he.CUSTOMIZE], le = N("cleangenius_mode_list", []), ve = le.length > 0 ? le : ["Vacuum and mop", "Mop after vacuum"], Ye = N("suction_level_list", []), Le = Ye.length > 0 ? Ye : ["Quiet", "Standard", "Strong", "Turbo"], kt = N("water_volume_list", []), tn = kt.length > 0 ? kt : ["Low", "Medium", "High"], Dt = N("mop_pad_humidity_list", []), yn = Dt.length > 0 ? Dt : ["Slightly dry", "Moist", "Wet"], Tt = N("cleaning_route_list", []), Ua = Tt.length > 0 ? Tt : ["Quick", "Standard", "Intensive", "Deep"], qa = w || z.unavailable, Ga = y && Y, _i = (wt) => {
    const bn = wt === tr.CLEANGENIUS;
    bn && _ && l.callService("switch", "turn_off", { entity_id: E });
    const ea = bn ? On.ROUTINE_CLEANING : On.OFF;
    p(f.cleangenius, Fg(ea));
  }, bt = (wt, bn) => {
    if (bn === he.CUSTOMIZE) {
      ne.debug("CleaningModeModal", "Enabling customized cleaning"), l.callService("switch", "turn_on", { entity_id: E });
      return;
    }
    _ ? (ne.debug("CleaningModeModal", "Disabling customized cleaning"), l.callService("switch", "turn_off", { entity_id: E }), setTimeout(() => p(wt, bn), 300)) : p(wt, bn);
  }, At = !Ga && _;
  return /* @__PURE__ */ h.jsx(md, { opened: n, onClose: a, children: /* @__PURE__ */ h.jsxs("div", { className: "cleaning-mode-modal", children: [
    y && /* @__PURE__ */ h.jsx("div", { className: "cleaning-mode-modal__header", children: /* @__PURE__ */ h.jsx(
      ov,
      {
        value: Ga ? tr.CLEANGENIUS : tr.CUSTOM,
        onChange: _i,
        options: q,
        disabled: qa
      }
    ) }),
    /* @__PURE__ */ h.jsx("div", { className: "cleaning-mode-modal__content-wrapper", children: Ga ? /* @__PURE__ */ h.jsx(
      x2,
      {
        cleangeniusMode: F,
        cleangeniusModeList: ve,
        cleangenius: P,
        baseEntityId: m
      }
    ) : /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      /* @__PURE__ */ h.jsx(
        B2,
        {
          cleaningMode: _ ? he.CUSTOMIZE : I,
          cleaningModeList: te,
          suctionLevel: V,
          suctionLevelList: Le,
          wetnessLevel: W,
          mopPadHumidity: we,
          mopPadHumidityList: yn,
          waterVolume: J,
          waterVolumeList: tn,
          cleaningRoute: se,
          cleaningRouteList: Ua,
          maxSuctionPower: _e,
          selfCleanArea: ie,
          selfCleanFrequency: Ce,
          selfCleanFrequencyList: M,
          selfCleanAreaMin: K,
          selfCleanAreaMax: Q,
          selfCleanTime: me,
          selfCleanTimeMin: pe,
          selfCleanTimeMax: k,
          baseEntityId: m,
          onCleaningModeSelect: bt,
          showOnlyCleaningModeSelector: At
        }
      ),
      At && /* @__PURE__ */ h.jsx(Q2, { baseEntityId: m })
    ] }) })
  ] }) });
}
function eC({ opened: n, onClose: a }) {
  const { t: o } = Ie(), s = Zt(), l = Rt(), d = s.attributes.shortcuts || {}, _ = Object.entries(d).map(([v, y]) => ({
    id: parseInt(v),
    ...y
  })), p = yt(l, s.entity_id).disabled, f = (v) => {
    p || (l.callService("dreame_vacuum", "vacuum_start_shortcut", {
      entity_id: s.entity_id,
      shortcut_id: v
    }), a());
  };
  return /* @__PURE__ */ h.jsx(md, { opened: n, onClose: a, children: /* @__PURE__ */ h.jsxs("div", { className: "shortcuts-modal", children: [
    /* @__PURE__ */ h.jsx("h2", { className: "shortcuts-modal__title", children: o("shortcuts.title") }),
    _.length === 0 ? /* @__PURE__ */ h.jsxs("div", { className: "shortcuts-modal__empty", children: [
      /* @__PURE__ */ h.jsx("p", { children: o("shortcuts.no_shortcuts") }),
      /* @__PURE__ */ h.jsx("p", { className: "shortcuts-modal__empty-hint", children: o("shortcuts.create_hint") })
    ] }) : /* @__PURE__ */ h.jsx("div", { className: "shortcuts-modal__list", children: _.map((v) => /* @__PURE__ */ h.jsxs(
      "button",
      {
        className: `shortcuts-modal__item ${p ? "shortcuts-modal__item--disabled" : ""}`,
        onClick: () => f(v.id),
        disabled: p,
        children: [
          /* @__PURE__ */ h.jsx("span", { className: "shortcuts-modal__item-icon", children: jw }),
          /* @__PURE__ */ h.jsx("span", { className: "shortcuts-modal__item-name", children: v.name })
        ]
      },
      v.id
    )) })
  ] }) });
}
function tC({ definition: n, isChild: a = !1 }) {
  const { t: o } = Ie(), s = Zt(), l = Rt(), d = s.entity_id.split(".")[1] ?? "", _ = Ch(l, d, n.key), m = D.useCallback(
    (p) => {
      l.callService("switch", p ? "turn_on" : "turn_off", {
        entity_id: _.entityId
      });
    },
    [l, _.entityId]
  );
  return _.disabled ? null : /* @__PURE__ */ h.jsxs("div", { className: `entity-item ${a ? "entity-item--child" : ""}`, children: [
    /* @__PURE__ */ h.jsxs("div", { className: "entity-item__info", children: [
      /* @__PURE__ */ h.jsx("span", { className: "entity-item__label", children: o(n.labelKey) }),
      n.descriptionKey && /* @__PURE__ */ h.jsx("span", { className: "entity-item__description", children: o(n.descriptionKey) })
    ] }),
    /* @__PURE__ */ h.jsx(_d, { checked: _.isOn, disabled: _.unavailable, onChange: m })
  ] });
}
function Tg(n) {
  return n.split("_").map((a) => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()).join(" ");
}
function nC({ definition: n, isChild: a = !1 }) {
  const { t: o } = Ie(), s = Zt(), l = Rt(), d = s.entity_id.split(".")[1] ?? "", _ = `select.${d}_${n.key}`, m = xh(l, d, n.key), p = m.attributes.options ?? [], f = D.useCallback(
    (y) => {
      l.callService("select", "select_option", {
        entity_id: _,
        option: y
      });
    },
    [l, _]
  );
  if (m.disabled || p.length === 0) return null;
  const v = m.state ?? p[0] ?? "";
  if (n.useSegmentedControl) {
    const y = p.map((w) => ({
      value: w,
      label: Tg(w)
    }));
    return /* @__PURE__ */ h.jsxs("div", { className: `entity-item entity-item--segmented ${a ? "entity-item--child" : ""}`, children: [
      /* @__PURE__ */ h.jsxs("div", { className: "entity-item__info", children: [
        /* @__PURE__ */ h.jsx("span", { className: "entity-item__label", children: o(n.labelKey) }),
        n.descriptionKey && /* @__PURE__ */ h.jsx("span", { className: "entity-item__description", children: o(n.descriptionKey) })
      ] }),
      /* @__PURE__ */ h.jsx(
        ov,
        {
          options: y,
          value: v,
          onChange: f,
          disabled: m.unavailable
        }
      )
    ] });
  }
  return /* @__PURE__ */ h.jsxs("div", { className: `entity-item entity-item--select ${a ? "entity-item--child" : ""}`, children: [
    /* @__PURE__ */ h.jsxs("div", { className: "entity-item__info", children: [
      /* @__PURE__ */ h.jsx("span", { className: "entity-item__label", children: o(n.labelKey) }),
      n.descriptionKey && /* @__PURE__ */ h.jsx("span", { className: "entity-item__description", children: o(n.descriptionKey) })
    ] }),
    /* @__PURE__ */ h.jsx(
      "select",
      {
        className: "entity-item__select",
        value: v,
        disabled: m.unavailable,
        onChange: (y) => f(y.target.value),
        children: p.map((y) => /* @__PURE__ */ h.jsx("option", { value: y, children: Tg(y) }, y))
      }
    )
  ] });
}
function aC({ definition: n, isChild: a = !1 }) {
  const { t: o } = Ie(), s = Zt(), l = Rt(), d = s.entity_id.split(".")[1] ?? "", _ = yT(l, d, n.key), m = n.min ?? _.attributes.min ?? 0, p = n.max ?? _.attributes.max ?? 100, f = n.step ?? _.attributes.step ?? 1, [v, y] = D.useState(_.numericValue), [w, E] = D.useState(_.numericValue);
  _.numericValue !== w && (E(_.numericValue), y(_.numericValue));
  const z = D.useCallback(() => {
    v !== _.numericValue && l.callService("number", "set_value", {
      entity_id: _.entityId,
      value: v
    });
  }, [l, _.entityId, _.numericValue, v]);
  if (_.disabled) return null;
  const N = n.renderHint ?? "slider", j = N === "volume" ? "entity-item__slider--volume" : N === "brightness" ? "entity-item__slider--brightness" : "";
  return /* @__PURE__ */ h.jsxs("div", { className: `entity-item entity-item--slider ${a ? "entity-item--child" : ""}`, children: [
    /* @__PURE__ */ h.jsxs("div", { className: "entity-item__info", children: [
      /* @__PURE__ */ h.jsx("span", { className: "entity-item__label", children: o(n.labelKey) }),
      n.descriptionKey && /* @__PURE__ */ h.jsx("span", { className: "entity-item__description", children: o(n.descriptionKey) })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: `entity-item__slider-container ${j}`, children: [
      /* @__PURE__ */ h.jsx(
        "input",
        {
          type: "range",
          className: "entity-item__slider",
          min: m,
          max: p,
          step: f,
          value: v,
          disabled: _.unavailable,
          onChange: (R) => y(Number(R.target.value)),
          onMouseUp: z,
          onTouchEnd: z,
          onKeyUp: z,
          onBlur: z
        }
      ),
      /* @__PURE__ */ h.jsxs("span", { className: "entity-item__slider-value", children: [
        Math.round(v),
        N === "volume" || N === "brightness" ? "%" : ""
      ] })
    ] })
  ] });
}
function iC({ definition: n, isChild: a = !1, buttonLabel: o }) {
  const { t: s } = Ie(), l = Zt(), d = Rt(), _ = l.entity_id.split(".")[1] ?? "", m = bT(d, _, n.key), p = D.useCallback(() => {
    d.callService("button", "press", {
      entity_id: m.entityId
    });
  }, [d, m.entityId]);
  return m.disabled ? null : /* @__PURE__ */ h.jsxs("div", { className: `entity-item ${a ? "entity-item--child" : ""}`, children: [
    /* @__PURE__ */ h.jsxs("div", { className: "entity-item__info", children: [
      /* @__PURE__ */ h.jsx("span", { className: "entity-item__label", children: s(n.labelKey) }),
      n.descriptionKey && /* @__PURE__ */ h.jsx("span", { className: "entity-item__description", children: s(n.descriptionKey) })
    ] }),
    /* @__PURE__ */ h.jsx("button", { className: "entity-item__button", disabled: m.unavailable, onClick: p, children: o ?? s("common.run") })
  ] });
}
function oC({ definition: n, isChild: a = !1 }) {
  const { t: o } = Ie(), s = Zt(), l = Rt(), d = s.entity_id.split(".")[1] ?? "", _ = wT(l, d, n.key), m = D.useCallback(
    (p) => {
      l.callService("time", "set_value", {
        entity_id: _.entityId,
        time: p
      });
    },
    [l, _.entityId]
  );
  return _.disabled ? null : /* @__PURE__ */ h.jsxs("div", { className: `entity-item entity-item--time ${a ? "entity-item--child" : ""}`, children: [
    /* @__PURE__ */ h.jsxs("div", { className: "entity-item__info", children: [
      /* @__PURE__ */ h.jsx("span", { className: "entity-item__label", children: o(n.labelKey) }),
      n.descriptionKey && /* @__PURE__ */ h.jsx("span", { className: "entity-item__description", children: o(n.descriptionKey) })
    ] }),
    /* @__PURE__ */ h.jsx(
      "input",
      {
        type: "time",
        className: "entity-item__time-input",
        value: _.timeValue,
        disabled: _.unavailable,
        onChange: (p) => m(p.target.value)
      }
    )
  ] });
}
function rC({ definition: n, isChild: a = !1 }) {
  const o = Zt(), s = Rt(), l = o.entity_id.split(".")[1] ?? "", d = lr();
  if (n.capability && !d.has(n.capability) || n.parentKey && !Ch(s, l, n.parentKey).isOn)
    return null;
  const _ = a || !!n.parentKey;
  switch (n.platform) {
    case "switch":
      return /* @__PURE__ */ h.jsx(tC, { definition: n, isChild: _ });
    case "select":
      return /* @__PURE__ */ h.jsx(nC, { definition: n, isChild: _ });
    case "number":
      return /* @__PURE__ */ h.jsx(aC, { definition: n, isChild: _ });
    case "button":
      return /* @__PURE__ */ h.jsx(iC, { definition: n, isChild: _ });
    case "time":
      return /* @__PURE__ */ h.jsx(oC, { definition: n, isChild: _ });
    default:
      return null;
  }
}
function Jn({ section: n, className: a }) {
  const o = lr();
  if (n.capabilities && n.capabilities.length > 0 && !n.capabilities.some((_) => o.has(_)))
    return null;
  const s = n.entities.map((d) => /* @__PURE__ */ h.jsx(rC, { definition: d }, d.key));
  return s.some((d) => d !== null) ? /* @__PURE__ */ h.jsx("div", { className: `data-driven-section ${a ?? ""}`, children: s }) : null;
}
function sC() {
  return /* @__PURE__ */ h.jsx(Jn, { section: Pg, className: "ai-detection-section" });
}
function lC() {
  return /* @__PURE__ */ h.jsx(Jn, { section: Ug, className: "carpet-settings-section" });
}
const cC = [
  {
    key: "main_brush",
    labelKey: "settings.consumables.main_brush",
    percentKey: Te.MAIN_BRUSH_LEFT.key,
    hoursKey: Te.MAIN_BRUSH_TIME_LEFT.key,
    consumableKey: "main_brush"
  },
  {
    key: "side_brush",
    labelKey: "settings.consumables.side_brush",
    percentKey: Te.SIDE_BRUSH_LEFT.key,
    hoursKey: Te.SIDE_BRUSH_TIME_LEFT.key,
    consumableKey: "side_brush"
  },
  {
    key: "filter",
    labelKey: "settings.consumables.filter",
    percentKey: Te.FILTER_LEFT.key,
    hoursKey: Te.FILTER_TIME_LEFT.key,
    consumableKey: "filter"
  },
  {
    key: "sensor",
    labelKey: "settings.consumables.sensor",
    percentKey: Te.SENSOR_DIRTY_LEFT.key,
    hoursKey: Te.SENSOR_DIRTY_TIME_LEFT.key,
    consumableKey: "sensor"
  },
  {
    key: "mop_pad",
    labelKey: "settings.consumables.mop_pad",
    percentKey: Te.MOP_PAD_LEFT.key,
    hoursKey: Te.MOP_PAD_TIME_LEFT.key,
    consumableKey: "mop_pad"
  },
  {
    key: "silver_ion",
    labelKey: "settings.consumables.silver_ion",
    percentKey: Te.SILVER_ION_LEFT.key,
    hoursKey: Te.SILVER_ION_TIME_LEFT.key,
    consumableKey: "silver_ion"
  },
  {
    key: "detergent",
    labelKey: "settings.consumables.detergent",
    percentKey: Te.DETERGENT_LEFT.key,
    hoursKey: Te.DETERGENT_TIME_LEFT.key,
    consumableKey: "detergent"
  },
  {
    key: "squeegee",
    labelKey: "settings.consumables.squeegee",
    percentKey: Te.SQUEEGEE_LEFT.key,
    hoursKey: Te.SQUEEGEE_TIME_LEFT.key,
    consumableKey: "squeegee"
  },
  {
    key: "tank_filter",
    labelKey: "settings.consumables.tank_filter",
    percentKey: Te.TANK_FILTER_LEFT.key,
    hoursKey: Te.TANK_FILTER_TIME_LEFT.key,
    consumableKey: "tank_filter"
  },
  {
    key: "onboard_dirty_water_tank",
    labelKey: "settings.consumables.onboard_dirty_water_tank",
    percentKey: Te.ONBOARD_DIRTY_WATER_TANK_LEFT.key,
    hoursKey: Te.ONBOARD_DIRTY_WATER_TANK_TIME_LEFT.key,
    consumableKey: "onboard_dirty_water_tank"
  },
  {
    key: "dirty_water_channel",
    labelKey: "settings.consumables.dirty_water_channel",
    percentKey: Te.DIRTY_WATER_CHANNEL_DIRTY_LEFT.key,
    hoursKey: Te.DIRTY_WATER_CHANNEL_DIRTY_TIME_LEFT.key,
    consumableKey: "dirty_water_channel"
  },
  {
    key: "deodorizer",
    labelKey: "settings.consumables.deodorizer",
    percentKey: Te.DEODORIZER_LEFT.key,
    hoursKey: Te.DEODORIZER_TIME_LEFT.key,
    consumableKey: "deodorizer"
  },
  {
    key: "wheel",
    labelKey: "settings.consumables.wheel",
    percentKey: Te.WHEEL_DIRTY_LEFT.key,
    hoursKey: Te.WHEEL_DIRTY_TIME_LEFT.key,
    consumableKey: "wheel"
  },
  {
    key: "scale_inhibitor",
    labelKey: "settings.consumables.scale_inhibitor",
    percentKey: Te.SCALE_INHIBITOR_LEFT.key,
    hoursKey: Te.SCALE_INHIBITOR_TIME_LEFT.key,
    consumableKey: "scale_inhibitor"
  },
  {
    key: "fluffing_roller",
    labelKey: "settings.consumables.fluffing_roller",
    percentKey: Te.FLUFFING_ROLLER_DIRTY_LEFT.key,
    hoursKey: Te.FLUFFING_ROLLER_DIRTY_TIME_LEFT.key,
    consumableKey: "fluffing_roller"
  },
  {
    key: "roller_mop_filter",
    labelKey: "settings.consumables.roller_mop_filter",
    percentKey: Te.ROLLER_MOP_FILTER_DIRTY_LEFT.key,
    hoursKey: Te.ROLLER_MOP_FILTER_DIRTY_TIME_LEFT.key,
    consumableKey: "roller_mop_filter"
  },
  {
    key: "water_outlet_filter",
    labelKey: "settings.consumables.water_outlet_filter",
    percentKey: Te.WATER_OUTLET_FILTER_DIRTY_LEFT.key,
    hoursKey: Te.WATER_OUTLET_FILTER_DIRTY_TIME_LEFT.key,
    consumableKey: "water_outlet_filter"
  }
];
function uC() {
  const { t: n } = Ie(), a = Zt(), o = Rt(), s = a.attributes, l = D.useCallback(
    (m) => {
      o.callService(kp.VACUUM_RESET_CONSUMABLE.domain, kp.VACUUM_RESET_CONSUMABLE.key, {
        entity_id: a.entity_id,
        consumable: m
      });
    },
    [o, a.entity_id]
  ), d = (m) => m >= 50 ? "var(--consumable-good, #34c759)" : m >= 20 ? "var(--consumable-warning, #ff9500)" : "var(--consumable-critical, #ff3b30)", _ = cC.filter((m) => {
    const p = s[m.percentKey];
    return p != null;
  });
  return _.length === 0 ? null : /* @__PURE__ */ h.jsx("div", { className: "consumables-section", children: _.map((m) => {
    const p = je(s[m.percentKey], 0), f = je(s[m.hoursKey], 0), v = d(p);
    return /* @__PURE__ */ h.jsxs("div", { className: "consumables-section__item", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "consumables-section__info", children: [
        /* @__PURE__ */ h.jsx("span", { className: "consumables-section__label", children: n(m.labelKey) }),
        /* @__PURE__ */ h.jsxs("span", { className: "consumables-section__stats", children: [
          p,
          "% · ",
          f,
          "h ",
          n("settings.consumables.remaining")
        ] })
      ] }),
      /* @__PURE__ */ h.jsx("div", { className: "consumables-section__progress", children: /* @__PURE__ */ h.jsx(
        "div",
        {
          className: "consumables-section__progress-bar",
          style: {
            width: `${p}%`,
            backgroundColor: v
          }
        }
      ) }),
      /* @__PURE__ */ h.jsx(
        "button",
        {
          className: "consumables-section__reset",
          onClick: () => l(m.consumableKey),
          type: "button",
          children: n("settings.consumables.reset")
        }
      )
    ] }, m.key);
  }) });
}
function dC() {
  const { t: n } = Ie(), a = od(), s = Zt().attributes, l = s.firmware_version, d = $k(l) || Na(l) ? l : "-", _ = je(s.total_cleaned_area, 0), m = je(s.total_cleaning_time, 0), p = je(s.cleaning_count, 0), f = s.ap, v = f?.ssid ?? "-", y = f?.rssi ?? "-", w = f?.ip ?? "-", E = [
    { labelKey: "settings.device_info.firmware", value: d },
    { labelKey: "settings.device_info.total_area", value: _, unit: a },
    { labelKey: "settings.device_info.total_time", value: m, unit: n("units.minutes") },
    { labelKey: "settings.device_info.total_cleans", value: p },
    { labelKey: "settings.device_info.wifi_ssid", value: v },
    { labelKey: "settings.device_info.wifi_signal", value: y, unit: n("units.decibels") },
    { labelKey: "settings.device_info.ip_address", value: w }
  ];
  return /* @__PURE__ */ h.jsx("div", { className: "device-info-section", children: E.map((z) => /* @__PURE__ */ h.jsxs("div", { className: "device-info-section__item", children: [
    /* @__PURE__ */ h.jsx("span", { className: "device-info-section__label", children: n(z.labelKey) }),
    /* @__PURE__ */ h.jsxs("span", { className: "device-info-section__value", children: [
      z.value,
      z.unit && ` ${z.unit}`
    ] })
  ] }, z.labelKey)) });
}
function _C() {
  return /* @__PURE__ */ h.jsx(Jn, { section: Hg, className: "dock-settings-section" });
}
function mC() {
  return /* @__PURE__ */ h.jsx(Jn, { section: Gg, className: "edge-corner-section" });
}
function fC() {
  return /* @__PURE__ */ h.jsx(Jn, { section: qg, className: "floor-settings-section" });
}
function pC() {
  return /* @__PURE__ */ h.jsx(Jn, { section: Bg, className: "map-settings-section" });
}
function gC() {
  return /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    /* @__PURE__ */ h.jsx(Jn, { section: jg, className: "quick-settings-section" }),
    /* @__PURE__ */ h.jsx(
      Jn,
      {
        section: Lg,
        className: "quick-settings-section quick-settings-section--actions"
      }
    )
  ] });
}
function hC() {
  return /* @__PURE__ */ h.jsx(Jn, { section: Ig, className: "volume-section" });
}
function vC({ opened: n, onClose: a }) {
  const { t: o } = Ie(), s = lr(), l = s.has(it.CARPET_RECOGNITION), d = s.has(it.AI_DETECTION), _ = s.hasAny(
    it.MOP_PAD_LIFTING,
    it.SIDE_REACH,
    it.MOP_PAD_SWING
  ), m = s.hasAny(
    it.AUTO_EMPTY_BASE,
    it.SELF_WASH_BASE,
    it.AUTO_ADD_DETERGENT,
    it.SMART_MOP_WASHING,
    it.WASHING_MODE,
    it.HOT_WASHING,
    it.OFF_PEAK_CHARGING,
    it.STATION_CLEANING,
    it.AUTO_REWASHING
  );
  return /* @__PURE__ */ h.jsx(md, { opened: n, onClose: a, children: /* @__PURE__ */ h.jsxs("div", { className: "settings-panel", children: [
    /* @__PURE__ */ h.jsx("h2", { className: "settings-panel__title", children: o("settings.title") }),
    /* @__PURE__ */ h.jsx("div", { className: "settings-panel__scroll-wrapper", children: /* @__PURE__ */ h.jsxs("div", { className: "settings-panel__sections", children: [
      /* @__PURE__ */ h.jsx(zn, { title: o("settings.consumables.title"), icon: /* @__PURE__ */ h.jsx(Gs, {}), children: /* @__PURE__ */ h.jsx(uC, {}) }),
      /* @__PURE__ */ h.jsx(zn, { title: o("settings.quick_settings.title"), icon: /* @__PURE__ */ h.jsx(X0, {}), children: /* @__PURE__ */ h.jsx(gC, {}) }),
      l && /* @__PURE__ */ h.jsx(zn, { title: o("settings.carpet.title"), icon: /* @__PURE__ */ h.jsx(E0, {}), children: /* @__PURE__ */ h.jsx(lC, {}) }),
      /* @__PURE__ */ h.jsx(zn, { title: o("settings.floor.title"), icon: /* @__PURE__ */ h.jsx(f0, {}), children: /* @__PURE__ */ h.jsx(fC, {}) }),
      _ && /* @__PURE__ */ h.jsx(zn, { title: o("settings.edge_corner.title"), icon: /* @__PURE__ */ h.jsx(c0, {}), children: /* @__PURE__ */ h.jsx(mC, {}) }),
      /* @__PURE__ */ h.jsx(zn, { title: o("settings.volume.title"), icon: /* @__PURE__ */ h.jsx(pw, {}), children: /* @__PURE__ */ h.jsx(hC, {}) }),
      m && /* @__PURE__ */ h.jsx(zn, { title: o("settings.dock.title"), icon: /* @__PURE__ */ h.jsx(d0, {}), children: /* @__PURE__ */ h.jsx(_C, {}) }),
      d && /* @__PURE__ */ h.jsx(zn, { title: o("settings.ai_detection.title"), icon: /* @__PURE__ */ h.jsx(n0, {}), children: /* @__PURE__ */ h.jsx(sC, {}) }),
      /* @__PURE__ */ h.jsx(zn, { title: o("settings.map.title"), icon: /* @__PURE__ */ h.jsx(Pu, {}), children: /* @__PURE__ */ h.jsx(pC, {}) }),
      /* @__PURE__ */ h.jsx(zn, { title: o("settings.device_info.title"), icon: /* @__PURE__ */ h.jsx(w0, {}), children: /* @__PURE__ */ h.jsx(dC, {}) })
    ] }) })
  ] }) });
}
function yC({ selectedRooms: n }) {
  const { t: a } = Ie();
  if (n.size === 0)
    return null;
  const o = Array.from(n.values()).join(", ");
  return /* @__PURE__ */ h.jsxs("div", { className: "room-selection-display", children: [
    /* @__PURE__ */ h.jsx("span", { className: "room-selection-display__label", children: a("room_display.selected_label") }),
    /* @__PURE__ */ h.jsx("span", { className: "room-selection-display__rooms", children: o })
  ] });
}
function bC({ hass: n, config: a }) {
  const o = n.states[a.entity];
  ne.debug("DreameVacuumCard", "Loaded entity", o);
  const s = a.theme || "light", l = a.language || "en", d = Wg(l), { t: _ } = Ie(l), m = D.useRef(null), p = pT({
    themeType: s,
    customThemeConfig: a.custom_theme,
    containerRef: m
  }), [f, v] = D.useState(null), {
    selectedMode: y,
    selectedRooms: w,
    selectedZone: E,
    modalOpened: z,
    shortcutsModalOpened: N,
    settingsPanelOpened: j,
    repeatCount: R,
    setSelectedMode: U,
    setSelectedRooms: Y,
    setSelectedZone: P,
    setModalOpened: I,
    setShortcutsModalOpened: F,
    setSettingsPanelOpened: V,
    handleModeChange: W,
    handleRoomToggle: J,
    cycleRepeatCount: se,
    resetRepeatCount: _e
  } = e1({ defaultMode: a.default_mode }), ie = PT(n, a.entity, a.map_entity), Ce = o ? o.state === "cleaning" || je(o.attributes.started, !1) : !1, we = o ? o.attributes.segment_cleaning === !0 : !1;
  D.useEffect(() => {
    if (!we) return;
    const bt = YT(n, a.entity, ie, a.room_names);
    if (bt.size > 0) {
      const At = Array.from(w.keys()).sort(), wt = Array.from(bt.keys()).sort();
      (At.length !== wt.length || At.some((ea, Nt) => ea !== wt[Nt])) && (ne.debug("DreameVacuumCard", "Syncing room selection with active segments", wt), Y(bt), U("room"));
    }
  }, [
    we,
    n,
    a.entity,
    a.room_names,
    ie,
    w,
    Y,
    U
  ]), D.useEffect(() => {
    Ce || _e();
  }, [Ce, _e]);
  const { toast: xe, showToast: M, hideToast: K } = uT(), Q = D.useCallback(
    (bt) => {
      M(bt);
    },
    [M]
  ), { handlePause: me, handleStop: pe, handleDock: k, handleClean: q } = cT({
    hass: n,
    entityId: a.entity,
    mapEntityId: ie,
    onSuccess: M,
    onError: Q
  }), X = D.useCallback(
    (bt, At) => {
      const wt = w.has(bt);
      J(bt, At), M(
        wt ? _("toast.deselected_room", { name: At }) : _("toast.selected_room", { name: At })
      );
    },
    [w, J, M, _]
  ), $ = D.useCallback(() => {
    q(
      y,
      w,
      E,
      f?.width,
      f?.height,
      R
    );
  }, [y, w, E, f, R, q]), te = D.useCallback(() => {
    n.callService("vacuum", "start", { entity_id: a.entity }), M(_("toast.resuming"));
  }, [n, a.entity, M, _]), le = D.useCallback(() => V(!0), [V]), ve = D.useCallback(() => V(!1), [V]), Ye = D.useCallback(() => I(!0), [I]), Le = D.useCallback(() => I(!1), [I]), kt = D.useCallback(() => F(!0), [F]), tn = D.useCallback(() => F(!1), [F]), Dt = D.useCallback(
    (bt, At) => v({ width: bt, height: At }),
    []
  );
  if (!o)
    return /* @__PURE__ */ h.jsx("div", { className: "dreame-vacuum-card__error", children: _("errors.entity_not_found", { entity: a.entity }) });
  if (o.state === "unavailable" || o.state === "unknown")
    return /* @__PURE__ */ h.jsx("div", { className: "dreame-vacuum-card__error dreame-vacuum-card__error--unavailable", children: _("errors.entity_unavailable") });
  const yn = BT(o, a);
  if (!yn)
    return /* @__PURE__ */ h.jsx("div", { className: "dreame-vacuum-card__error", children: _("errors.failed_to_load") });
  const { deviceName: Tt, mapEntityId: Ua } = yn, qa = Ua || ie, Ga = ZT(o, y), _i = (o.attributes.capabilities ?? []).includes(it.SHORTCUTS);
  return /* @__PURE__ */ h.jsx(gT, { hass: n, entity: o, config: a, language: l, children: /* @__PURE__ */ h.jsxs(
    "div",
    {
      ref: m,
      className: `dreame-vacuum-card dreame-vacuum-card--${p.name}`,
      dir: d ? "rtl" : "ltr",
      style: a.map_height ? { "--map-max-height": a.map_height } : void 0,
      children: [
        /* @__PURE__ */ h.jsxs("div", { className: "dreame-vacuum-card__container", children: [
          /* @__PURE__ */ h.jsx(VT, { deviceName: Tt, onSettingsClick: le }),
          /* @__PURE__ */ h.jsx(KT, {}),
          /* @__PURE__ */ h.jsx(
            w2,
            {
              mapEntityId: qa,
              selectedMode: y,
              selectedRooms: w,
              onRoomToggle: X,
              zone: E,
              onZoneChange: P,
              onImageDimensionsChange: Dt,
              defaultRoomView: a.default_room_view
            }
          ),
          /* @__PURE__ */ h.jsx(
            XT,
            {
              cleanGeniusMode: je(o.attributes.cleangenius_mode, ""),
              cleaningMode: je(o.attributes.cleaning_mode, "Sweeping and mopping"),
              cleangenius: je(o.attributes.cleangenius, "Off"),
              onClick: Ye,
              onShortcutsClick: _i ? kt : void 0,
              onRepeatClick: se,
              repeatCount: R
            }
          ),
          /* @__PURE__ */ h.jsxs("div", { className: "dreame-vacuum-card__controls", children: [
            y === "room" && /* @__PURE__ */ h.jsx(yC, { selectedRooms: w }),
            /* @__PURE__ */ h.jsx(S2, { selectedMode: Ga, onModeChange: W }),
            /* @__PURE__ */ h.jsx(
              A2,
              {
                selectedMode: y,
                selectedRoomsCount: w.size,
                onClean: $,
                onPause: me,
                onResume: te,
                onStop: pe,
                onDock: k
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ h.jsx(J2, { opened: z, onClose: Le }),
        /* @__PURE__ */ h.jsx(eC, { opened: N, onClose: tn }),
        /* @__PURE__ */ h.jsx(vC, { opened: j, onClose: ve }),
        xe && /* @__PURE__ */ h.jsx(N2, { message: xe, onClose: K })
      ]
    }
  ) });
}
const wC = `.accordion{border-radius:.75rem;background:var(--card-bg, rgba(255, 255, 255, .8));overflow:hidden;margin-bottom:.5rem}.accordion__header{display:flex;align-items:center;justify-content:space-between;width:100%;padding:.875rem 1rem;background:none;border:none;cursor:pointer;color:var(--text-primary, #000);font-size:.9375rem;font-weight:500;text-align:left}[dir=rtl] .accordion__header{text-align:right}.accordion__header{transition:background-color .2s ease}.accordion__header:hover{background:var(--hover-bg, rgba(0, 0, 0, .03))}.accordion__header:active{background:var(--active-bg, rgba(0, 0, 0, .06))}.accordion__title-wrapper{display:flex;align-items:center;gap:.625rem}.accordion__icon{display:flex;align-items:center;justify-content:center;color:var(--accent-color, #007aff)}.accordion__icon svg{width:1.25rem;height:1.25rem}.accordion__title{font-weight:500}.accordion__chevron{width:1.25rem;height:1.25rem;color:var(--text-secondary, #666);transition:transform .3s ease}.accordion__content{max-height:0;overflow:hidden;transition:max-height .3s ease}.accordion__content-inner{padding:0 1rem 1rem}.accordion--open .accordion__chevron{transform:rotate(180deg)}.accordion--open .accordion__content{max-height:1000px}.toggle{position:relative;display:inline-block;width:3.1875rem;height:1.9375rem}.toggle__input{opacity:0;width:0;height:0}.toggle__slider{position:absolute;cursor:pointer;inset:0;background-color:var(--surface-tertiary, #e0e0e0);transition:.4s;border-radius:1.9375rem}.toggle__knob{position:absolute;height:1.6875rem;width:1.6875rem;left:.125rem}[dir=rtl] .toggle__knob{left:auto;right:.125rem}.toggle__knob{bottom:.125rem;background-color:var(--surface-bg, white);transition:.4s;border-radius:50%;box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .2))}.toggle__input:checked+.toggle__slider{background-color:var(--toggle-active);border:.125rem solid var(--toggle-active-border);box-shadow:0 0 0 .25rem var(--toggle-active-shadow-color)}.toggle__input:checked+.toggle__slider .toggle__knob{transform:translate(1.25rem)}[dir=rtl] .toggle__input:checked+.toggle__slider .toggle__knob{transform:translate(-1.25rem)}.toggle--disabled{opacity:.5;pointer-events:none}.circular-button{display:flex;flex-direction:column;align-items:center;gap:.5rem}.circular-button:hover:not(.circular-button--disabled){transform:translateY(-.125rem)}.circular-button--disabled{opacity:.5;pointer-events:none}.circular-button__circle{border-radius:50%;background:var(--surface-secondary, #f5f5f5);display:flex;align-items:center;justify-content:center;cursor:pointer;border:.0625rem solid var(--text-primary, black);transition:all .2s ease;color:var(--text-primary)}[dir=rtl] .circular-button__circle>:nth-child(2):not(:last-child){rotate:180deg}.circular-button__circle--small{width:3.5rem;height:3.5rem;font-size:1.5rem}.circular-button__circle--medium{width:4.5rem;height:4.5rem;font-size:1.75rem}.circular-button__circle--large{width:5.5rem;height:5.5rem;font-size:2rem}.circular-button__circle--selected{background:var(--toggle-active);border:.1875rem solid var(--toggle-active-border);box-shadow:0 0 0 .25rem var(--toggle-active-shadow-color);color:var(--text-primary)}.circular-button__circle:hover:not(.circular-button__circle--selected){background:var(--surface-tertiary, #ebebeb)}.circular-button__circle:active{transform:scale(.95)}.circular-button__icon{display:flex;align-items:center;justify-content:center}.circular-button__icon--svg{width:100%;height:100%;color:var(--text-primary, #1a1a1a)}.circular-button__icon--svg svg{width:100%;height:100%;display:block}.circular-button__circle--selected .circular-button__icon--svg{color:#fff}.circular-button__label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center;line-height:1.2}.modal{position:absolute;inset:20% 0 0;background:var(--surface-bg, #f5f5f7);border-radius:1.25rem 1.25rem 0 0;padding:0 1.25rem 1.25rem;z-index:1000;max-height:80vh;overflow-y:hidden;color:var(--text-primary, black)}.modal::-webkit-scrollbar{display:none}.modal__backdrop{position:absolute;inset:0;background:var(--backdrop-bg, rgba(0, 0, 0, .4));z-index:999;border-radius:1.25rem}.modal__handle{width:2.25rem;height:.3125rem;background:var(--handle-bg, rgba(0, 0, 0, .15));border-radius:.1875rem;margin:.75rem auto 1.25rem}.modal__content{height:90%}.segmented-control{display:flex;gap:.5rem;background:var(--surface-tertiary, #e8e8e8);border-radius:.75rem;padding:.25rem}.segmented-control--disabled{opacity:.5;pointer-events:none}.segmented-control__button{flex:1;border:none;border-radius:.625rem;padding:.75rem;font-size:.9375rem;font-weight:500;cursor:pointer;background-color:transparent;color:var(--text-primary, #1a1a1a);transition:all .2s}.segmented-control__button--active{background-color:var(--surface-bg, white);box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .08))}.segmented-control__button:hover:not(.segmented-control__button--active){background-color:var(--surface-bg-hover, rgba(255, 255, 255, .5))}.toast{position:absolute;top:1.25rem;left:50%;transform:translate(-50%);background:var(--surface-bg, #ffffff);border:.0625rem solid var(--border-color, #e0e0e0);border-radius:.5rem;padding:.75rem 1rem;display:flex;align-items:center;gap:.75rem;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12));animation:toast-slide-down .3s ease-out;z-index:1000;max-width:90%}@keyframes toast-slide-down{0%{transform:translate(-50%) translateY(-1.25rem);opacity:0}to{transform:translate(-50%) translateY(0);opacity:1}}.toast__message{color:var(--text-primary, #1a1a1a);font-size:.875rem}.toast__close{background:none;border:none;color:var(--text-secondary, #666666);font-size:1.5rem;cursor:pointer;padding:0;width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;line-height:1;transition:color .2s}.toast__close:hover{color:var(--text-primary, #1a1a1a)}.error-boundary{display:flex;align-items:center;justify-content:center;min-height:200px;padding:1.5rem;background:var(--surface-bg, #f5f5f5);border-radius:.75rem}.error-boundary__content{text-align:center;max-width:300px}.error-boundary__icon{width:48px;height:48px;margin:0 auto 1rem;background:var(--error-color, #ff3b30);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700}.error-boundary__title{margin:0 0 .5rem;font-size:1.125rem;font-weight:600;color:var(--text-primary, #1a1a1a)}.error-boundary__message{margin:0 0 1rem;font-size:.875rem;color:var(--text-secondary, #666);line-height:1.4}.error-boundary__retry{padding:.5rem 1rem;background:var(--accent-color, #007aff);color:#fff;border:none;border-radius:.5rem;font-size:.875rem;font-weight:500;cursor:pointer;transition:background .2s ease}.error-boundary__retry:hover{background:var(--accent-color-hover, #0056b3)}.header{padding:1.25rem 1.25rem .625rem;text-align:center;padding-bottom:unset}.header__top{display:flex;justify-content:space-between;align-items:flex-start}.header__title-wrapper{flex:1;text-align:center;padding-left:2rem}[dir=rtl] .header__title-wrapper{padding-left:0;padding-right:2rem}.header__settings-btn{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;padding:0;background:none;border:none;color:var(--text-secondary, #666);cursor:pointer;border-radius:.5rem;transition:all .2s ease}.header__settings-btn svg{width:1.25rem;height:1.25rem}.header__settings-btn:hover{background:var(--hover-bg, rgba(0, 0, 0, .05));color:var(--text-primary, #1a1a1a)}.header__settings-btn:active{background:var(--active-bg, rgba(0, 0, 0, .1))}.header__title{margin:0;font-size:1rem;font-weight:600;color:var(--text-primary, #1a1a1a)}.header__status{margin:0;font-size:.875rem;color:var(--text-secondary, #666)}.header__progress{margin:0 auto;max-width:12.5rem}.header__progress-bar{width:100%;height:.25rem;background-color:var(--surface-tertiary, #e8e8e8);border-radius:.25rem;overflow:hidden}.header__progress-fill{height:100%;background-color:var(--accent-color, #007aff);transition:width .3s ease}.header__progress-text{margin:.25rem 0 0;font-size:.75rem;color:var(--text-tertiary, #999)}.header__stats{display:flex;justify-content:center;gap:1.25rem;font-size:1rem;color:var(--text-primary, #1a1a1a);margin-top:.875rem;align-items:center}.header__stat{display:flex;align-items:center;gap:.25rem}.header__stat-icon{display:flex;color:var(--accent-color)}.header__stat-icon--cleaning-time,.header__stat-icon--area{display:flex}.header__stat-icon--cleaning-time svg,.header__stat-icon--area svg{scale:.8}.header__stat-value{display:flex;font-weight:500;unicode-bidi:plaintext}.header__stat-value--cleaning-time{unicode-bidi:unset}.map-selector{position:relative;display:flex;justify-content:center}.map-selector__button{display:inline-flex;align-items:center;gap:.375rem;padding:.375rem .75rem;background:var(--surface-bg, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:1.25rem;color:var(--text-primary, #1a1a1a);font-size:.8125rem;font-weight:500;cursor:pointer;transition:all .2s ease}.map-selector__button:hover{background:var(--surface-bg-hover, #ebebeb)}.map-selector__button--open{background:var(--surface-bg-hover, #ebebeb);border-color:var(--accent-color, #007aff)}.map-selector__button--disabled,.map-selector__button:disabled{opacity:.5;cursor:not-allowed}.map-selector__icon{display:flex;align-items:center;color:var(--text-secondary, #666)}.map-selector__icon svg{width:1rem;height:1rem}.map-selector__label{max-width:8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.map-selector__chevron{width:1rem;height:1rem;color:var(--text-secondary, #666);transition:transform .2s ease}.map-selector__chevron--open{transform:rotate(180deg)}.map-selector__dropdown{position:absolute;top:calc(100% + .25rem);left:50%;transform:translate(-50%);min-width:10rem;max-width:14rem;background:var(--surface-bg, #fff);border:1px solid var(--border-color, #e0e0e0);border-radius:.75rem;box-shadow:var(--card-shadow, 0 4px 12px rgba(0, 0, 0, .1));overflow:hidden;z-index:100;animation:map-selector-dropdown-fade-in .15s ease}.map-selector__option{display:flex;align-items:center;justify-content:space-between;width:100%;padding:.625rem .875rem;background:transparent;border:none;color:var(--text-primary, #1a1a1a);font-size:.875rem;text-align:start;cursor:pointer;transition:background .15s ease}.map-selector__option:hover{background:var(--surface-bg-hover, #f5f5f5)}.map-selector__option--selected{color:var(--accent-color, #007aff);font-weight:500}.map-selector__option:not(:last-child){border-bottom:1px solid var(--border-color, #e8e8e8)}.map-selector__option-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:.5rem}[dir=rtl] .map-selector__option-name{padding-right:0;padding-left:.5rem}.map-selector__option-check{width:1rem;height:1rem;color:var(--accent-color, #007aff);flex-shrink:0}@keyframes map-selector-dropdown-fade-in{0%{opacity:0;transform:translate(-50%) translateY(-.25rem)}to{opacity:1;transform:translate(-50%) translateY(0)}}.mode-tabs{display:flex;gap:.25rem;background:var(--surface-tertiary, #e8e8e8);border-radius:.9375rem;padding:.25rem;margin-bottom:.9375rem}.mode-tabs--disabled{opacity:.5;pointer-events:none}.mode-tabs__button{flex:1;display:flex;align-items:center;justify-content:center;border:none;border-radius:.6875rem;padding:.625rem;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .2s;background-color:transparent;color:var(--text-secondary, #666)}.mode-tabs__button-icon svg{scale:.5;color:var(--text-secondary, #666)}.mode-tabs__button--active{background-color:var(--surface-bg, white);color:var(--text-primary, #000);box-shadow:0 .125rem .25rem var(--card-shadow, rgba(0, 0, 0, .1))}.mode-tabs__button:hover:not(.mode-tabs__button--active):not(:disabled){background-color:var(--surface-bg-hover, rgba(255, 255, 255, .5))}.mode-tabs__button:disabled{cursor:not-allowed}.action-buttons{display:flex;gap:.75rem;margin-top:.9375rem}.action-buttons__clean,.action-buttons__dock,.action-buttons__pause,.action-buttons__resume,.action-buttons__stop{flex:1;background:var(--accent-bg);border:.0625rem solid var(--accent-bg);border-radius:.875rem;padding:.575rem;font-size:.9375rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;transition:all .3s cubic-bezier(.16,1,.3,1);color:var(--text-primary)}.action-buttons__clean--selected,.action-buttons__dock--selected,.action-buttons__pause--selected,.action-buttons__resume--selected,.action-buttons__stop--selected{transform:translateY(-.125rem);border:.0625rem solid var(--toggle-active-border);box-shadow:0 .625rem 1.25rem #0006,0 0 .75rem #5865f240,inset 0 .0625rem .0625rem #ffffff1a!important}.action-buttons__clean{color:#fff;background:var(--accent-color)}.action-buttons__pause{color:var(--accent-color);border-color:var(--accent-color-hover)}.action-buttons__resume{color:#32d74b;border-color:#32d74b80}.action-buttons__stop{color:#ff453a;border-color:#ff453a80}.action-buttons__dock{background:var(--surface-secondary);color:var(--text-secondary)}.cleaning-mode-button-wrapper{margin:.625rem 1.25rem;width:calc(100% - 2.5rem);display:flex;align-items:center;gap:.5rem;margin-bottom:unset}.cleaning-mode-button-wrapper__repeats{background:var(--accent-color, #007aff);color:#fff;border:none;border-radius:50%;width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.9rem;font-weight:600;flex-shrink:0;transition:transform .2s,opacity .2s;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-button-wrapper__repeats:hover:not(:disabled){transform:scale(1.1);opacity:.9;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button-wrapper__repeats:active:not(:disabled){transform:scale(.95)}.cleaning-mode-button-wrapper__repeats:disabled{opacity:.5;cursor:not-allowed}.cleaning-mode-button-wrapper__shortcuts{background:var(--accent-color, #007aff);color:#fff;border:none;border-radius:50%;width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;flex-shrink:0;transition:transform .2s,opacity .2s;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-button-wrapper__shortcuts svg{scale:.8}.cleaning-mode-button-wrapper__shortcuts:hover:not(:disabled){transform:scale(1.1);opacity:.9;box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button-wrapper__shortcuts:active:not(:disabled){transform:scale(.95)}.cleaning-mode-button-wrapper__shortcuts:disabled{opacity:.5;cursor:not-allowed}.cleaning-mode-button{flex:1;background:var(--surface-bg, #fff);border:none;border-radius:.75rem;padding:.75rem 1rem .75rem .5rem;box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .08));color:var(--text-primary, #1a1a1a);font-weight:400;font-size:.9375rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:transform .1s ease}.cleaning-mode-button:hover:not(:disabled){box-shadow:0 .25rem .75rem var(--card-shadow-hover, rgba(0, 0, 0, .12))}.cleaning-mode-button:active:not(:disabled){transform:scale(.98)}.cleaning-mode-button--disabled,.cleaning-mode-button:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.cleaning-mode-button__content{display:flex;align-items:center}.cleaning-mode-button__icon{scale:.7;display:flex}.cleaning-mode-button__text{font-weight:400;font-size:.8rem}.cleaning-mode-button__arrow{font-size:1.25rem;color:var(--text-tertiary, #999)}.vacuum-position-marker{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10}.vacuum-position-marker__bg{fill:var(--vacuum-marker-bg, rgba(255, 255, 255, .9));stroke:var(--vacuum-marker-stroke, #4caf50);stroke-width:2;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}.vacuum-position-marker__icon{fill:var(--vacuum-marker-color, #4caf50)}.vacuum-position-marker--cleaning .vacuum-position-marker__bg{animation:vacuum-pulse 1.5s ease-in-out infinite}.charger-marker{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5}.charger-marker__bg{fill:var(--charger-marker-bg, rgba(255, 255, 255, .9));stroke:var(--charger-marker-stroke, #ffc107);stroke-width:2;filter:drop-shadow(0 1px 3px rgba(0,0,0,.25))}.charger-marker__icon{fill:var(--charger-marker-color, #ffc107)}@keyframes vacuum-pulse{0%{opacity:1}50%{opacity:.7}to{opacity:1}}.vacuum-map{position:relative;margin:0 1.25rem;border-radius:.9375rem;overflow:hidden;background:var(--surface-bg, #fff);box-shadow:0 .25rem .9375rem var(--card-shadow, rgba(0, 0, 0, .1));min-height:18.75rem;--map-max-height-fallback: none}@media(orientation:landscape){.vacuum-map{--map-max-height-fallback: calc(100vh - 280px) ;min-height:min(18.75rem,100vh - 280px)}@supports (height: 100dvh){.vacuum-map{--map-max-height-fallback: calc(100dvh - 280px) }}}.vacuum-map--locked .react-transform-wrapper{touch-action:pan-y}.vacuum-map__content{position:relative;display:inline-block;width:100%;height:100%}.vacuum-map__image{display:block;width:100%;height:auto;max-height:var(--map-max-height, var(--map-max-height-fallback, none));object-fit:contain;border-radius:.9375rem;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}.dreame-vacuum-card--dark .vacuum-map .vacuum-map__image{filter:brightness(.8) contrast(.9) saturate(.85)}.vacuum-map__placeholder{color:#666;text-align:center;font-size:.875rem}.vacuum-map__placeholder small{font-size:.75rem;color:#999}.vacuum-map__overlay{position:absolute;inset:0;background:#0000000d;border-radius:.9375rem;display:flex;align-items:center;justify-content:center;font-size:.875rem;color:#666;pointer-events:none}.vacuum-map__cycles{position:absolute;right:1rem}[dir=rtl] .vacuum-map__cycles{right:auto;left:1rem}.vacuum-map__cycles{bottom:1rem;width:2.5rem;height:2.5rem;border-radius:25%;border-radius:.375rem}.vacuum-map__zone{position:absolute;border:.1875rem solid #007aff;background:repeating-linear-gradient(45deg,#007aff1a,#007aff1a .625rem,#007aff0d .625rem 1.25rem);pointer-events:auto;border-radius:.5rem;box-shadow:0 .125rem .75rem #007aff4d}.vacuum-map__zone-container{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto}.vacuum-map__zone-handle{position:absolute;background:#007aff;border:.125rem solid white;border-radius:.25rem;pointer-events:auto;box-shadow:0 .125rem .25rem #0003;transition:background .2s ease;z-index:10;touch-action:none}.vacuum-map__zone-handle:before{content:"";position:absolute;inset:-.5rem}.vacuum-map__zone-handle:hover{background:#0051d5}.vacuum-map__zone-handle:active{background:#003d99}.vacuum-map__zone-handle--top,.vacuum-map__zone-handle--bottom{width:2.5rem;height:.5rem;left:50%;cursor:ns-resize}.vacuum-map__zone-handle--top{top:-.25rem}.vacuum-map__zone-handle--bottom{bottom:-.25rem}.vacuum-map__zone-handle--left,.vacuum-map__zone-handle--right{width:.5rem;height:2.5rem;top:50%;cursor:ew-resize}.vacuum-map__zone-handle--left{left:-.25rem}[dir=rtl] .vacuum-map__zone-handle--left{left:auto;right:-.25rem}.vacuum-map__zone-handle--right{right:-.25rem}[dir=rtl] .vacuum-map__zone-handle--right{right:auto;left:-.25rem}.vacuum-map__zone-clear{position:absolute;top:-.75rem;right:-.75rem}[dir=rtl] .vacuum-map__zone-clear{right:auto;left:-.75rem}.vacuum-map__zone-clear{width:1.5rem;height:1.5rem;border-radius:50%;background:#ff3b30;color:#fff;border:.125rem solid white;font-size:1.125rem;font-weight:700;cursor:pointer;pointer-events:auto;display:flex;align-items:center;justify-content:center;box-shadow:0 .125rem .5rem #ff3b3066;transition:background .2s ease;line-height:1;padding:0;z-index:11}.vacuum-map__zone-clear:hover{background:#ff1f0f}.vacuum-map__zone-clear:active{background:#c00}.vacuum-map__room-segments{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.vacuum-map__room-segments path{pointer-events:auto}.vacuum-map__room-segment{cursor:pointer;transition:all .2s ease}.vacuum-map__room-segment:hover:not(.vacuum-map__room-segment--selected){fill:#ffffff26;stroke:#ffffffe6;stroke-width:3;filter:drop-shadow(0 0 8px rgba(255,255,255,.6))}.vacuum-map__room-segment--selected{fill:var(--accent-bg, rgba(212, 175, 55, .3));stroke:var(--accent-color, #d4af37);stroke-width:3}.vacuum-map__room-segment--selected:hover{fill:var(--accent-bg-hover, rgba(212, 175, 55, .45));filter:drop-shadow(0 0 6px var(--accent-color-shadow-color, rgba(212, 175, 55, .5)))}.vacuum-map__rooms{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.vacuum-map__room{position:absolute;transform:translate(-50%,-50%);width:2rem;height:2rem;border-radius:50%;background:#ffffffe6;border:.125rem solid var(--border-color, #e0e0e0);display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:600;color:var(--text-primary, #1a1a1a);cursor:pointer;pointer-events:auto;transition:all .2s ease;box-shadow:0 .125rem .25rem #0000001a;z-index:2}.vacuum-map__room:hover{transform:translate(-50%,-50%) scale(1.1);background:#fff;box-shadow:0 .25rem .5rem #00000026}.vacuum-map__room--selected{background:var(--accent-color, #d4af37);color:#fff;border-color:var(--accent-color, #d4af37);box-shadow:0 .125rem .5rem var(--accent-color-shadow-color, rgba(212, 175, 55, .4))}.vacuum-map__room--selected:hover{transform:translate(-50%,-50%) scale(1.1);box-shadow:0 .25rem .75rem var(--accent-color-shadow-color, rgba(212, 175, 55, .5))}.room-list-view{position:absolute;inset:0;background:var(--surface-bg, #fff);border-radius:.9375rem;display:flex;flex-direction:column;overflow:hidden}.room-list-view__header{padding:.75rem 3.5rem .75rem 1rem}[dir=rtl] .room-list-view__header{padding-right:0;padding-left:3.5rem}.room-list-view__header{padding-left:1rem}[dir=rtl] .room-list-view__header{padding-left:0;padding-right:1rem}.room-list-view__header{font-size:.875rem;color:var(--text-secondary, #666);background:var(--surface-secondary, #f5f5f5);border-bottom:1px solid var(--border-color, #e0e0e0);flex-shrink:0}.room-list-view__list{flex:1;overflow-y:auto;padding:.5rem;display:flex;flex-direction:column;gap:.5rem}.room-list-view__list::-webkit-scrollbar{width:.25rem}.room-list-view__list::-webkit-scrollbar-track{background:transparent}.room-list-view__list::-webkit-scrollbar-thumb{background:var(--surface-tertiary, #ccc);border-radius:.125rem}.room-list-view__empty{flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-tertiary, #999);font-size:.875rem}.room-list-view__item{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:var(--surface-secondary, #f5f5f5);border:2px solid transparent;border-radius:.75rem;cursor:pointer;transition:all .2s ease;width:100%;text-align:left}[dir=rtl] .room-list-view__item{text-align:right}.room-list-view__item:hover{background:var(--surface-tertiary, #ebebeb)}.room-list-view__item:active{transform:scale(.98)}.room-list-view__item--selected{background:var(--accent-bg-transparent, rgba(212, 175, 55, .1));border-color:var(--accent-color, #d4af37)}.room-list-view__item--selected:hover{background:var(--accent-bg-transparent, rgba(212, 175, 55, .15))}.room-list-view__item-name{flex:1;font-size:.9375rem;font-weight:500;color:var(--text-primary, #1a1a1a);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.room-list-view__item-check{width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--accent-color, #d4af37)}.map-controls{position:absolute;top:.75rem;right:.75rem}[dir=rtl] .map-controls{right:auto;left:.75rem}.map-controls{display:flex;flex-direction:column;gap:.25rem;z-index:10}.map-controls__button{width:2.25rem;height:2.25rem;border-radius:.5rem;background:var(--surface-bg, #fff);border:1px solid var(--border-color, #e0e0e0);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-primary, #1a1a1a);box-shadow:0 .125rem .5rem var(--card-shadow, rgba(0, 0, 0, .1));transition:all .2s ease}.map-controls__button:hover{background:var(--surface-secondary, #f5f5f5);transform:scale(1.05)}.map-controls__button:active{transform:scale(.95)}.map-controls__button svg{transition:transform .2s ease}.map-controls__button--lock{margin-top:.25rem}.map-controls__button--locked{background:var(--accent-color, #007aff);border-color:var(--accent-color, #007aff);color:#fff}.map-controls__button--locked:hover{background:var(--accent-hover, #0066d6);border-color:var(--accent-hover, #0066d6)}.room-labels{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:8}.room-labels__bg{fill:var(--room-label-bg, rgba(0, 0, 0, .7))}.room-labels__text{fill:var(--room-label-color, #fff);font-weight:500;font-family:inherit}.cleaning-mode-modal{height:100%}.cleaning-mode-modal__header{margin-bottom:1.5rem}.cleaning-mode-modal__content-wrapper{height:100%;overflow-y:auto;width:100%;overflow-x:hidden}.cleaning-mode-modal__content-wrapper::-webkit-scrollbar{display:none}.cleaning-mode-modal__section{margin-bottom:1.5rem}.cleaning-mode-modal__section-title{font-size:.9375rem;color:var(--text-primary, #1a1a1a);font-weight:500;margin:0 0 .75rem}.cleaning-mode-modal__section-header{display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem}.cleaning-mode-modal__help-icon{display:inline-flex;align-items:center;justify-content:center;width:1rem;height:1rem;border-radius:50%;border:.09375rem solid var(--text-tertiary, #999);font-size:.6875rem;color:var(--text-tertiary, #999);font-weight:600}.cleaning-mode-modal__room-map{background:var(--surface-bg, white);border-radius:.75rem;padding:1rem;display:flex;align-items:center;justify-content:center;min-height:7.5rem}.cleaning-mode-modal__placeholder{font-size:.8125rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.cleaning-mode-modal__mode-grid--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__mode-card{position:relative;border:.125rem solid var(--border-color, #e0e0e0);border-radius:1rem;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-bg, white);padding:1.5rem 1rem;transition:all .2s ease}.cleaning-mode-modal__mode-card:hover:not(.cleaning-mode-modal__mode-card--disabled){transform:translateY(-.125rem);box-shadow:0 .25rem .75rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-modal__mode-card--selected{border:.1875rem solid var(--accent-color, #d4af37);box-shadow:0 0 0 .25rem var(--accent-color-shadow-color, rgba(212, 175, 55, .15))}.cleaning-mode-modal__mode-card--selected:hover:not(.cleaning-mode-modal__mode-card--disabled){transform:translateY(-.125rem);box-shadow:0 0 0 .25rem var(--accent-color-shadow-color, rgba(88, 101, 242, .25)),0 .25rem .75rem var(--card-shadow, rgba(0, 0, 0, .08))}.cleaning-mode-modal__mode-card--disabled{cursor:not-allowed;opacity:.5}.cleaning-mode-modal__mode-icon{border-radius:50%;margin-bottom:.75rem;display:flex;align-items:center;justify-content:center;font-size:1.75rem}[dir=rtl] .cleaning-mode-modal__mode-icon--mop-after>:nth-child(2),[dir=rtl] .cleaning-mode-modal__mode-icon--vac-mop>:nth-child(2){rotate:180deg}.cleaning-mode-modal__mode-label{font-size:.875rem;font-weight:500;color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__mode-checkmark{position:absolute;top:.75rem;right:.75rem}[dir=rtl] .cleaning-mode-modal__mode-checkmark{right:auto;left:.75rem}.cleaning-mode-modal__mode-checkmark{width:1.5rem;height:1.5rem;border-radius:50%;background:var(--accent-color, #d4af37);display:flex;align-items:center;justify-content:center;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .15));color:#fff;font-size:.875rem}.cleaning-mode-modal__horizontal-scroll{display:flex;justify-content:flex-start;overflow-x:auto;padding-bottom:.5rem;padding-top:.5rem;gap:2rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar{height:.25rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-track{background:var(--surface-secondary, #f1f1f1);border-radius:.125rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-thumb{background:var(--surface-tertiary, #ccc);border-radius:.125rem}.cleaning-mode-modal__horizontal-scroll::-webkit-scrollbar-thumb:hover{background:var(--border-color, #bbb)}.cleaning-mode-modal__mode-option{min-width:4.375rem;display:flex;flex-direction:column;align-items:center;gap:.375rem}.cleaning-mode-modal__mode-option-label{font-size:.75rem;color:var(--text-secondary, #666);text-align:center;line-height:1.2}.cleaning-mode-modal__power-grid{display:flex;justify-content:flex-start;gap:2rem;overflow-x:auto;padding:.5rem 0}.cleaning-mode-modal__power-grid--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__power-option{min-width:4.375rem;display:flex;flex-direction:column;align-items:center;gap:.375rem}.cleaning-mode-modal__power-label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center}.cleaning-mode-modal__max-plus{background:var(--surface-bg, white);border-radius:.75rem;padding:1rem}.cleaning-mode-modal__max-plus-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}.cleaning-mode-modal__max-plus-title{font-size:.9375rem;color:var(--text-primary, #1a1a1a);font-weight:500}.cleaning-mode-modal__max-plus-description{font-size:.8125rem;color:var(--text-tertiary, #999);margin:0;line-height:1.4}.cleaning-mode-modal__slider-container{position:relative;padding:0 .5rem;margin-bottom:.75rem}.cleaning-mode-modal__slider-container--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__slider-wrapper{position:relative;padding-top:2rem}.cleaning-mode-modal__slider{width:100%;height:.375rem;border-radius:.1875rem;outline:none;-webkit-appearance:none;appearance:none;cursor:pointer}.cleaning-mode-modal__slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:1.25rem;height:1.25rem;border-radius:50%;background:var(--accent-color, #d4af37);cursor:pointer;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider::-moz-range-thumb{width:1.25rem;height:1.25rem;border-radius:50%;background:var(--accent-color, #d4af37);cursor:pointer;border:none;box-shadow:0 .125rem .25rem var(--handle-shadow, rgba(0, 0, 0, .2))}.cleaning-mode-modal__slider-tooltip{position:absolute;top:-.5rem;transform:translate(-50%);background:var(--accent-color, #d4af37);color:#fff;padding:.25rem .5rem;border-radius:.375rem;font-size:.85rem;font-weight:600;white-space:nowrap;pointer-events:none;box-shadow:0 .125rem .375rem var(--accent-shadow, rgba(0, 0, 0, .2))}[dir=rtl] .cleaning-mode-modal__slider-tooltip{transform:translate(50%)}.cleaning-mode-modal__slider-tooltip:after{content:"";position:absolute;top:100%;left:50%;transform:translate(-50%);width:0;height:0;border-left:.3125rem solid transparent;border-right:.3125rem solid transparent;border-top:.3125rem solid var(--accent-color, #d4af37)}.cleaning-mode-modal__slider-value{position:absolute;top:-2rem;transform:translate(-50%);background:var(--accent-color, #d4af37);border-radius:50%;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:600;color:#fff;box-shadow:0 .125rem .5rem var(--accent-color-shadow-color, rgba(88, 101, 242, .25));pointer-events:none}.cleaning-mode-modal__slider-labels{display:flex;justify-content:space-between;padding:0 .5rem;margin-top:1.5rem}.cleaning-mode-modal__slider-label{font-size:.8125rem}.cleaning-mode-modal__slider-label--inactive{color:var(--text-tertiary, #999)}.cleaning-mode-modal__slider-label--active{color:var(--text-primary, #1a1a1a);font-weight:500}.cleaning-mode-modal__setting{display:flex;align-items:center;justify-content:space-between;padding:1rem;background:var(--surface-bg, white);border-radius:.75rem;margin-bottom:1rem}.cleaning-mode-modal__setting--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__setting--clickable{cursor:pointer;transition:background .2s ease}.cleaning-mode-modal__setting--clickable:hover{background:var(--surface-secondary, #f8f8f8)}.cleaning-mode-modal__setting--clickable:active{background:var(--surface-tertiary, #f0f0f0)}.cleaning-mode-modal__setting-label{font-size:.9375rem;color:var(--text-primary, #1a1a1a)}.cleaning-mode-modal__setting-value{display:flex;align-items:center;gap:.5rem;font-size:.875rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__setting-arrow{font-size:1.125rem;color:var(--text-tertiary, #999)}.cleaning-mode-modal__route-grid{display:flex;justify-content:flex-start;overflow-x:auto;padding-bottom:.5rem;padding-top:.5rem;gap:2rem}.cleaning-mode-modal__route-grid--disabled{opacity:.5;pointer-events:none}.cleaning-mode-modal__route-option{min-width:4.375rem;display:flex;flex-direction:column;align-items:center;gap:.375rem}.cleaning-mode-modal__route-label{font-size:.8125rem;color:var(--text-primary, #1a1a1a);text-align:center}.customize-mode{display:flex;flex-direction:column;gap:.5rem}.customize-mode__empty{display:flex;align-items:center;justify-content:center;padding:2rem;color:var(--text-secondary);font-size:.875rem}.customize-mode__empty p{margin:0}.customize-mode__room-accordions{display:flex;flex-direction:column;gap:.25rem}.customize-mode__badges{display:flex;gap:.25rem}.customize-mode__badge{display:inline-flex;align-items:center;justify-content:center;min-width:1.25rem;padding:.125rem .25rem;border-radius:.25rem;background:var(--accent-bg);font-size:.8rem;font-weight:600;color:var(--accent-color);text-transform:uppercase}.customize-mode__badge:nth-child(3){text-transform:unset}.customize-mode__room-settings-content{display:flex;flex-direction:column;gap:1rem}.customize-mode__setting-group{display:flex;flex-direction:column;gap:.5rem}.customize-mode__setting-label{font-size:.75rem;font-weight:500;color:var(--text-secondary)}.customize-mode__options{display:flex;justify-content:flex-start;overflow-x:auto;padding-bottom:.5rem;padding-top:.5rem;gap:2rem}.customize-mode__options--pills{gap:1rem}.customize-mode__option{display:flex;flex-direction:column;align-items:center;gap:2rem}.customize-mode__option-label{font-size:.8rem;color:var(--text-secondary);text-align:center}.customize-mode__pill{padding:.375rem .75rem;border:1.5px solid var(--surface-border);border-radius:1.25rem;background:var(--surface-bg);color:var(--text-secondary);font-size:1rem;font-weight:500;cursor:pointer;transition:all .15s ease;min-width:3.5rem}.customize-mode__pill:hover{border-color:var(--accent-color);background:var(--accent-bg-secondary)}.customize-mode__pill--selected{border-color:var(--accent-color);background:var(--accent-color);color:var(--accent-bg-secondary);color:#fff}.customize-mode__pill--cycle{font-weight:600}.customize-mode__wetness-slider{display:flex;flex-direction:column;gap:.25rem}.room-selection-display{padding:.75rem 1rem;background:var(--accent-bg, #e3f2fd);border-radius:.5rem;margin-bottom:.75rem;font-size:.875rem;color:var(--text-primary, #1a1a1a)}.room-selection-display__label{font-weight:600;margin-right:.5rem}[dir=rtl] .room-selection-display__label{margin-right:0;margin-left:.5rem}.room-selection-display__label{color:var(--accent-color, #007aff)}.room-selection-display__rooms{color:var(--text-secondary, #666666)}.shortcuts-modal{padding:0}.shortcuts-modal__title{font-size:1.3rem;font-weight:600;margin:0 0 1rem;padding:1.5rem 1.5rem 0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__empty{padding:2rem 1.5rem;text-align:center;color:var(--text-secondary, #666)}.shortcuts-modal__empty p{margin:.5rem 0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__empty-hint{font-size:.9rem;color:var(--text-tertiary, #888)}.shortcuts-modal__list{max-height:35rem;overflow-y:auto;padding:.5rem 0;gap:.5rem;display:flex;flex-direction:column}.shortcuts-modal__item{display:flex;align-items:center;gap:1rem;padding:.75rem 1.5rem;margin:.25rem 1rem;background:var(--surface-bg, #fff);border:2px solid var(--accent-color);border-radius:.75rem;box-shadow:0 .125rem .5rem var(--accent-shadow);transition:all .2s;width:90%}.shortcuts-modal__item:hover{box-shadow:0 .25rem .75rem var(--accent-shadow);transform:translateY(-.0625rem)}.shortcuts-modal__item-info{flex:1;min-width:0;display:flex;align-items:center;gap:.75rem}.shortcuts-modal__item-icon{display:flex;font-size:1.3rem;flex-shrink:0;color:var(--text-primary, #1a1a1a)}.shortcuts-modal__item-icon svg{scale:.8}.shortcuts-modal__item-name{font-size:1rem;font-weight:500;color:var(--text-primary, #1a1a1a)}.entity-item{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--divider-color, rgba(0, 0, 0, .1));gap:16px}.entity-item:last-child{border-bottom:none}.entity-item--child{padding-left:16px;opacity:.9}.entity-item__info{display:flex;flex-direction:column;flex:1;min-width:0}.entity-item__label{font-size:14px;font-weight:500;color:var(--text-primary, #000)}.entity-item__description{font-size:12px;color:var(--text-secondary, #666);margin-top:2px}.entity-item--select{flex-direction:column;align-items:stretch;gap:8px}.entity-item--select .entity-item__info{flex:none}.entity-item--segmented{flex-direction:column;align-items:stretch;gap:8px}.entity-item--segmented .entity-item__info{flex:none}.entity-item--slider{flex-direction:column;align-items:stretch;gap:8px}.entity-item--slider .entity-item__info{flex:none}.entity-item__select{padding:8px 12px;border-radius:8px;border:1px solid var(--divider-color, rgba(0, 0, 0, .2));background:var(--surface-bg, #fff);color:var(--text-primary, #000);font-size:14px;cursor:pointer;min-width:120px}.entity-item__select:disabled{opacity:.5;cursor:not-allowed}.entity-item__button{padding:8px 16px;border-radius:8px;border:none;background:var(--accent-color, #007aff);color:#fff;font-size:14px;font-weight:500;cursor:pointer;transition:opacity .2s ease}.entity-item__button:hover:not(:disabled){opacity:.9}.entity-item__button:active:not(:disabled){opacity:.8}.entity-item__button:disabled{opacity:.5;cursor:not-allowed}.entity-item__slider-container{display:flex;align-items:center;gap:12px}.entity-item__slider{flex:1;height:6px;border-radius:3px;appearance:none;background:var(--divider-color, rgba(0, 0, 0, .2));cursor:pointer}.entity-item__slider::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer}.entity-item__slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--accent-color, #007aff);border:none;cursor:pointer}.entity-item__slider:disabled{opacity:.5;cursor:not-allowed}.entity-item__slider:disabled::-webkit-slider-thumb{cursor:not-allowed}.entity-item__slider:disabled::-moz-range-thumb{cursor:not-allowed}.entity-item__slider-value{font-size:14px;font-weight:500;color:var(--text-primary, #000);min-width:40px;text-align:right}.entity-item__slider--volume .entity-item__slider::-webkit-slider-thumb,.entity-item__slider--brightness .entity-item__slider::-webkit-slider-thumb{background:var(--accent-color, #007aff)}.entity-item__time-input{padding:8px 12px;border-radius:8px;border:1px solid var(--divider-color, rgba(0, 0, 0, .2));background:var(--surface-bg, #fff);color:var(--text-primary, #000);font-size:14px;font-family:inherit;cursor:pointer;min-width:100px}.entity-item__time-input:disabled{opacity:.5;cursor:not-allowed}.entity-item__time-input::-webkit-calendar-picker-indicator{cursor:pointer;filter:var(--time-picker-filter, none)}.ai-detection-section{display:flex;flex-direction:column;gap:.75rem}.ai-detection-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.ai-detection-section__item--slider{flex-direction:column;align-items:stretch;gap:.5rem}.ai-detection-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.ai-detection-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.ai-detection-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.ai-detection-section__slider-container{display:flex;align-items:center;gap:.75rem}.ai-detection-section__slider{flex:1;height:4px;appearance:none;background:var(--surface-secondary, #e0e0e0);border-radius:2px;cursor:pointer}.ai-detection-section__slider::-webkit-slider-thumb{appearance:none;width:16px;height:16px;background:var(--accent-color, #007aff);border-radius:50%;cursor:pointer}.ai-detection-section__slider:disabled{opacity:.5;cursor:not-allowed}.ai-detection-section__slider-value{font-size:.75rem;font-weight:500;color:var(--text-primary, #333);min-width:36px;text-align:right}.carpet-settings-section{display:flex;flex-direction:column;gap:.75rem}.carpet-settings-section__mode-selector{display:flex;flex-direction:column;gap:.75rem;padding-bottom:.5rem;border-bottom:1px solid var(--border-color, #e0e0e0);margin-bottom:.25rem}.carpet-settings-section__sub-options{display:flex;flex-direction:column;gap:.5rem;padding-left:.25rem}.carpet-settings-section__sub-label{font-size:.75rem;color:var(--text-secondary, #666);font-weight:500}.carpet-settings-section__sub-buttons{display:flex;gap:.5rem}.carpet-settings-section__sub-button{flex:1;padding:.5rem .75rem;font-size:.8125rem;font-weight:500;border:1px solid var(--border-color, #e0e0e0);border-radius:.5rem;background:var(--surface-secondary, #f5f5f5);color:var(--text-primary, #333);cursor:pointer;transition:all .2s ease}.carpet-settings-section__sub-button:hover:not(.carpet-settings-section__sub-button--active){background:var(--surface-tertiary, #eee)}.carpet-settings-section__sub-button--active{background:var(--accent-color, #007aff);border-color:var(--accent-color, #007aff);color:#fff}.carpet-settings-section__sub-button:disabled{opacity:.5;cursor:not-allowed}.carpet-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.carpet-settings-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.carpet-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.carpet-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.carpet-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.carpet-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.carpet-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.carpet-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.carpet-settings-section__select:disabled{opacity:.5;cursor:not-allowed}.consumables-section{display:flex;flex-direction:column;gap:1rem}.consumables-section__item{display:flex;flex-direction:column;gap:.375rem}.consumables-section__info{display:flex;justify-content:space-between;align-items:center}.consumables-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #000)}.consumables-section__stats{font-size:.75rem;color:var(--text-secondary, #666)}.consumables-section__progress{height:.375rem;background:var(--progress-bg, rgba(0, 0, 0, .1));border-radius:.1875rem;overflow:hidden}.consumables-section__progress-bar{height:100%;border-radius:.1875rem;transition:width .3s ease}.consumables-section__reset{align-self:flex-end;padding:.25rem .75rem;font-size:.75rem;font-weight:500;color:var(--accent-color, #007aff);background:none;border:1px solid var(--accent-color, #007aff);border-radius:.375rem;cursor:pointer;transition:all .2s ease}.consumables-section__reset:hover{background:var(--accent-color, #007aff);color:#fff}.consumables-section__reset:active{opacity:.8}.device-info-section{display:flex;flex-direction:column;gap:.75rem}.device-info-section__item{display:flex;justify-content:space-between;align-items:center;padding:.25rem 0;border-bottom:1px solid var(--divider-color, rgba(0, 0, 0, .06))}.device-info-section__item:last-child{border-bottom:none}.device-info-section__label{font-size:.875rem;color:var(--text-secondary, #666)}.device-info-section__value{font-size:.875rem;font-weight:500;color:var(--text-primary, #000);unicode-bidi:plaintext}.quick-settings-section{display:flex;flex-direction:column;gap:.75rem}.quick-settings-section__item{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 0}.quick-settings-section__item--child{margin-left:1rem;padding-left:.75rem;border-left:2px solid var(--accent-color, #007aff)}.quick-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.quick-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.quick-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.quick-settings-section__actions{display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem;padding-top:.75rem;border-top:1px solid var(--border-color, #e0e0e0)}.quick-settings-section__actions-label{font-size:.75rem;font-weight:500;color:var(--text-secondary, #666);text-transform:uppercase;letter-spacing:.5px}.quick-settings-section__actions-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:.5rem}.quick-settings-section__action-button{display:flex;flex-direction:column;align-items:center;gap:.375rem;padding:.75rem .5rem;background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:.5rem;cursor:pointer;transition:all .2s ease}.quick-settings-section__action-button:hover{background:var(--surface-tertiary, #eee);border-color:var(--accent-color, #007aff)}.quick-settings-section__action-button:active{transform:scale(.98)}.quick-settings-section__action-icon{display:flex;align-items:center;justify-content:center;color:var(--accent-color, #007aff)}.quick-settings-section__action-label{font-size:.75rem;font-weight:500;color:var(--text-primary, #333);text-align:center;line-height:1.2}.volume-section{display:flex;flex-direction:column;gap:.75rem}.volume-section__row{display:flex;flex-direction:row;gap:1rem}.volume-section__item{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 0}.volume-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.volume-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.volume-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.volume-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.volume-section__select{width:100%;padding:.5rem 2.5rem .5rem .75rem;font-size:.875rem;font-weight:500;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:.5rem;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right .75rem center;background-size:1rem}.volume-section__select:hover{border-color:var(--accent-color, #007aff)}.volume-section__select:focus{outline:none;border-color:var(--accent-color, #007aff);box-shadow:0 0 0 2px #007aff33}.volume-section__select:disabled{opacity:.5;cursor:not-allowed}.volume-section__control{display:flex;align-items:center;gap:.75rem;flex:1}.volume-section__icon{display:flex;align-items:center;justify-content:center;color:var(--text-secondary, #666);flex-shrink:0}.volume-section__slider-container{flex:1;padding-top:1.5rem;margin-top:1rem}.volume-section__slider-wrapper{position:relative;width:100%}.volume-section__slider{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;outline:none;cursor:pointer}.volume-section__slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer;box-shadow:0 2px 4px #0003;transition:transform .1s ease}.volume-section__slider::-webkit-slider-thumb:hover{transform:scale(1.1)}.volume-section__slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--accent-color, #007aff);cursor:pointer;border:none;box-shadow:0 2px 4px #0003;transition:transform .1s ease}.volume-section__slider::-moz-range-thumb:hover{transform:scale(1.1)}.volume-section__tooltip{position:absolute;top:-1.75rem;transform:translate(-50%);background:var(--accent-color, #007aff);color:#fff;padding:.25rem .5rem;border-radius:4px;font-size:.75rem;font-weight:500;white-space:nowrap;pointer-events:none}[dir=rtl] .volume-section__tooltip{transform:translate(50%)}.volume-section__tooltip:after{content:"";position:absolute;top:100%;left:50%;transform:translate(-50%);border:4px solid transparent;border-top-color:var(--accent-color, #007aff)}.volume-section__test-button{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.625rem 1rem;background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;color:var(--text-primary, #333);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.volume-section__test-button:hover{background:var(--surface-tertiary, #eee)}.volume-section__test-button:active{transform:scale(.98)}.volume-section__test-button svg{color:var(--accent-color, #007aff)}.floor-settings-section{display:flex;flex-direction:column;gap:.75rem}.floor-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.floor-settings-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.floor-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.floor-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.floor-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.floor-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.floor-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.floor-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.floor-settings-section__select:disabled{opacity:.5;cursor:not-allowed}.edge-corner-section{display:flex;flex-direction:column;gap:.75rem}.edge-corner-section__sub-settings{display:flex;flex-direction:column;gap:.5rem;margin-top:-.25rem}.edge-corner-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.edge-corner-section__item--indented{padding-left:1rem;border-left:2px solid var(--border-color, #e0e0e0);margin-left:.5rem}.edge-corner-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.edge-corner-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.edge-corner-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.edge-corner-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.edge-corner-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.edge-corner-section__select:focus{border-color:var(--accent-color, #007aff)}.edge-corner-section__select:hover{background:var(--surface-tertiary, #eee)}.edge-corner-section__select:disabled{opacity:.5;cursor:not-allowed}.dock-settings-section{display:flex;flex-direction:column;gap:.75rem}.dock-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.dock-settings-section__item--select,.dock-settings-section__item--segmented{flex-direction:column;align-items:stretch;gap:.5rem}.dock-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.dock-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.dock-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.dock-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.dock-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.dock-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.dock-settings-section__select:disabled{opacity:.5;cursor:not-allowed}.dock-settings-section__button{padding:.5rem 1rem;font-size:.8125rem;font-weight:500;border:1px solid var(--accent-color, #007aff);border-radius:.5rem;background:var(--accent-color, #007aff);color:#fff;cursor:pointer;transition:all .2s ease;white-space:nowrap}.dock-settings-section__button:hover:not(:disabled){background:var(--accent-color-hover, #0056b3)}.dock-settings-section__button:disabled{opacity:.5;cursor:not-allowed}.map-settings-section{display:flex;flex-direction:column;gap:.75rem}.map-settings-section__item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.5rem 0}.map-settings-section__item--select{flex-direction:column;align-items:stretch;gap:.5rem}.map-settings-section__info{display:flex;flex-direction:column;gap:.125rem;flex:1;min-width:0}.map-settings-section__label{font-size:.875rem;font-weight:500;color:var(--text-primary, #333)}.map-settings-section__description{font-size:.75rem;color:var(--text-secondary, #666);line-height:1.3}.map-settings-section__select{width:100%;padding:.625rem .75rem;font-size:.875rem;color:var(--text-primary, #333);background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:8px;cursor:pointer;outline:none;transition:border-color .2s ease}.map-settings-section__select:focus{border-color:var(--accent-color, #007aff)}.map-settings-section__select:hover{background:var(--surface-tertiary, #eee)}.map-settings-section__select:disabled{opacity:.5;cursor:not-allowed}.map-settings-section__actions{display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem;padding-top:.75rem;border-top:1px solid var(--border-color, #e0e0e0)}.map-settings-section__actions-label{font-size:.75rem;font-weight:500;color:var(--text-secondary, #666);text-transform:uppercase;letter-spacing:.5px}.map-settings-section__actions-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:.5rem}.map-settings-section__action-button{display:flex;flex-direction:column;align-items:center;gap:.375rem;padding:.75rem .5rem;background:var(--surface-secondary, #f5f5f5);border:1px solid var(--border-color, #e0e0e0);border-radius:.5rem;cursor:pointer;transition:all .2s ease}.map-settings-section__action-button:hover{background:var(--surface-tertiary, #eee);border-color:var(--accent-color, #007aff)}.map-settings-section__action-button:active{transform:scale(.98)}.map-settings-section__action-button:disabled{opacity:.5;cursor:not-allowed}.map-settings-section__action-icon{display:flex;align-items:center;justify-content:center;color:var(--accent-color, #007aff)}.map-settings-section__action-label{font-size:.75rem;font-weight:500;color:var(--text-primary, #333);text-align:center;line-height:1.2}.settings-panel{height:100%}.settings-panel__title{font-size:1.25rem;font-weight:600;margin:0 0 1rem;text-align:center;color:var(--text-primary, #000)}.settings-panel__scroll-wrapper{height:90%;overflow-y:auto}.settings-panel__sections{display:flex;flex-direction:column;gap:.25rem;padding-right:.25rem}[dir=rtl] .settings-panel__sections{padding-right:0;padding-left:.25rem}.settings-panel__sections::-webkit-scrollbar{width:4px}.settings-panel__sections::-webkit-scrollbar-track{background:transparent}.settings-panel__sections::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb, rgba(0, 0, 0, .2));border-radius:2px}.dreame-vacuum-card{position:relative;background:var(--card-bg, #f5f5f7);border-radius:1.25rem;overflow:hidden;box-shadow:0 .125rem 1.25rem var(--card-shadow, rgba(0, 0, 0, .08));font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.dreame-vacuum-card__error{padding:1.25rem;color:var(--error-color, #ff3b30);text-align:center;font-size:.875rem}.dreame-vacuum-card__container{display:flex;flex-direction:column;gap:1rem}.dreame-vacuum-card__controls{padding:0 1.25rem 1.25rem}`;
Kw();
class SC extends HTMLElement {
  _root = null;
  _hass;
  _config;
  constructor() {
    super(), this.attachShadow({ mode: "open" });
    const a = document.createElement("style");
    a.textContent = wC, this.shadowRoot.appendChild(a);
  }
  setConfig(a) {
    const o = iT(a);
    if (!o.valid)
      throw new Error(`Invalid configuration: ${o.errors.join("; ")}`);
    o.warnings.length > 0 && ne.warn("Configuration warnings:", o.warnings), this._config = a, this.render();
  }
  set hass(a) {
    this._hass = a, this.render();
  }
  render() {
    if (!this._hass || !this._config || !this.shadowRoot) return;
    let a = this.shadowRoot.querySelector("#react-root");
    a || (a = document.createElement("div"), a.id = "react-root", this.shadowRoot.appendChild(a)), this._root || (this._root = Lb.createRoot(a)), this._root.render(
      /* @__PURE__ */ h.jsx(xa.StrictMode, { children: /* @__PURE__ */ h.jsx(C2, { children: /* @__PURE__ */ h.jsx(bC, { hass: this._hass, config: this._config }) }) })
    );
  }
  getCardSize() {
    return 4;
  }
  static getStubConfig() {
    return {
      type: "custom:dreame-vacuum-map-card",
      entity: "vacuum.dreame_vacuum",
      title: "Dreame Vacuum"
    };
  }
}
customElements.define("dreame-vacuum-map-card", SC);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "dreame-vacuum-map-card",
  name: "Dreame Vacuum Map Card",
  description: "Custom vacuum map card for Dreame vacuum cleaners"
});
ne.info("Dreame Vacuum Map Card (React) loaded");
export {
  SC as default
};
