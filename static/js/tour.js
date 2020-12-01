function quitGuide() {
  window.endTour();
}

function takeGuide() {
  window.continueTour();
}

window.tourHeading = (url) => `
  <div class="guide-container guide-heading">
    <div>
      <span>Esto es</span>
      <div>
        <img
          alt="Mapa de El Salvador con una señal que marca la magnitud de un sismo"
          src="${url}"
        />
      </div>
    </div>
  </div>
`;

window.tourFirstTime = `
  <div class="guide-container guide-first-time">
    <span>Parece ser que es la primera vez que nos visitias.<br/> ¿Quieres una visita guiada?</span>
    <div class="buttons">
      <a class="waves-effect waves-light btn green ">Si!</a>
      <a class="waves-effect waves-light btn red" onclick="quitGuide()">No</a>
    </div>
  </div>
  `;

window.toolbarGuide = `
  <div >
    <span>
      
    </span>
  </div>
`;
