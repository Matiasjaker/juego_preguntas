function icon(name,className=""){
 return `<svg class="icon${className?" "+className:""}" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
}
