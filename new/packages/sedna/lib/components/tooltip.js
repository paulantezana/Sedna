export let SnTooltip = function(options) {
    var delay = options.delay || 0,
        dist  = options.distance || 10;

    document.body.addEventListener("mouseover", function(e) {
        if (!e.target.hasAttribute('data-tooltip')) return;

        let tooltip = document.createElement("div");
        tooltip.className = `.${window.classPrefix}TabTooltip`;
        tooltip.innerHTML = e.target.getAttribute('data-tooltip');

        document.body.appendChild(tooltip);

        let pos = e.target.getAttribute('data-position') || "center top",
            posHorizontal = pos.split(" ")[0],
            posVertical = pos.split(" ")[1];

        positionAt(e.target, tooltip, posHorizontal, posVertical);
    });

    document.body.addEventListener("mouseout", function(e) {
        if (e.target.hasAttribute('data-tooltip')) {
            setTimeout(function() {
                document.body.removeChild(document.querySelector(`.${window.classPrefix}Tooltip`));
            }, delay);
        }
    });

    function positionAt(parent, tooltip, posHorizontal, posVertical) {
        let parentCoords = parent.getBoundingClientRect(), left, top;

        switch (posHorizontal) {
            case "left":
                left = parseInt(parentCoords.left) - dist - tooltip.offsetWidth;
                if (parseInt(parentCoords.left) - tooltip.offsetWidth < 0) {
                    left = dist;
                } 
                break;
                
            case "right":
                left = parentCoords.right + dist;
                if (parseInt(parentCoords.right) + tooltip.offsetWidth > document.documentElement.clientWidth) {
                    left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
                }
                break;

            default:
            case "center":
                left = parseInt(parentCoords.left) + ((parent.offsetWidth - tooltip.offsetWidth) / 2);
        }
        
        switch (posVertical) {
            case "center":
                top = (parseInt(parentCoords.top) + parseInt(parentCoords.bottom)) / 2 - tooltip.offsetHeight / 2;
                break;
                
            case "bottom":
                top = parseInt(parentCoords.bottom) + dist;
                break;

            default:
            case "top":
                top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
        }       

        left = (left < 0) ? parseInt(parentCoords.left) : left;
        top  = (top < 0) ? parseInt(parentCoords.bottom) + dist : top;

        tooltip.style.left = left + "px";
        tooltip.style.top  = top + pageYOffset + "px";
    }
};
