import { html } from './util/htmlTemplate';

export const ALL_ICONS = {
  search: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
      />
    </svg>
  `,

  refresh: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z"
      />
    </svg>
  `,

  save: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z"
      />
    </svg>
  `,

  add: html`
    <svg viewBox="0 0 24 24">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  `,

  delete: html`
    <svg viewBox="0 0 24 24">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  `,

  edit: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
    </svg>
  `,

  copy: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z"
      />
    </svg>
  `,

  move: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z"
      />
    </svg>
  `,
  cut: html`<svg viewBox="0 0 24 24">
    <path
      class="dg-icon-fill"
      d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z"
    />

    <!-- Top blade tip -->
    <path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" />
  </svg>`,

  upload: html`
    <svg viewBox="0 0 24 24">
      <!-- Excel file -->
      <path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />

      <!-- File corner -->
      <path class="dg-icon-fill icon-corner" d="M14 2V8H20" />

      <!-- Upload arrow -->
      <path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" />

      <path
        class="dg-icon-fill-stroke"
        d="M9.5 13.5L12 11L14.5 13.5"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,

  download: html`
    <svg viewBox="0 0 24 24">
      <!-- Excel file -->
      <path
        class="dg-icon-fill"
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
      ></path>

      <!-- File corner -->
      <path class="dg-icon-fill icon-corner" d="M14 2V8H20" />

      <!-- Download arrow -->
      <path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path>

      <path
        class="dg-icon-fill-stroke"
        d="M9.5 13.5L12 16L14.5 13.5"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  `,

  mapping: html`
    <svg viewBox="0 0 16 16">
      <!-- Left -->
      <rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" />

      <!-- Right Top -->
      <rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" />

      <!-- Right Bottom -->
      <rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" />

      <!-- Connection -->
      <path
        class="dg-icon-stroke"
        d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Arrow -->
      <path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />

      <path
        class="dg-icon-stroke"
        d="M9 6.8L10.5 8L9 9.2"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,

  preview: html`
    <svg viewBox="0 0 24 24">
      <!-- Eye -->
      <path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" />

      <!-- Iris -->
      <circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" />

      <!-- Pupil -->
      <circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" />
    </svg>
  `,

  permission: html`
    <svg viewBox="0 0 24 24">
      <!-- User -->
      <circle class="dg-icon-fill" cx="8" cy="9" r="3" />

      <path
        class="dg-icon-fill"
        d="
      M3 19
      c0-2.8 2.3-5 5-5
      s5 2.2 5 5
      Z
    "
      />

      <!-- Shield -->
      <path
        class="dg-icon-fill"
        d="
      M17 3
      l4 1.5
      V10
      c0 3.4-2.1 6-5 7.5
      c-2.9-1.5-5-4.1-5-7.5
      V4.5
      Z
    "
      />

      <!-- Check -->
      <path
        class="dg-icon-stroke"
        d="
      M15.6 9.5
      l1.2 1.2
      l2.4-2.4
    "
        fill="none"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,

  parameter: html`
    <svg viewBox="0 0 24 24">
      <!-- Left brace -->
      <path
        d="
        M10 3
        H8
        C6.9 3 6 3.9 6 5
        V8
        C6 9.2 5.4 10 4 10
        V14
        C5.4 14 6 14.8 6 16
        V19
        C6 20.1 6.9 21 8 21
        H10
        V19
        H8V16
        C8 14.8 7.4 13.8 6.3 13.2
        C7.4 12.6 8 11.6 8 10.4
        V5H10
        Z"
      />

      <rect x="10" y="10" width="4" height="1.8" rx=".9" />
      <rect x="10" y="13" width="4" height="1.8" rx=".9" />

      <!-- Right brace -->
      <path
        d="
        M14 3
        H16
        C17.1 3 18 3.9 18 5
        V8
        C18 9.2 18.6 10 20 10
        V14
        C18.6 14 18 14.8 18 16
        V19
        C18 20.1 17.1 21 16 21
        H14
        V19
        H16V16
        C16 14.8 16.6 13.8 17.7 13.2
        C16.6 12.6 16 11.6 16 10.4
        V5H14
        Z"
      />
    </svg>
  `,

  start: html`
    <svg viewBox="0 0 24 24">
      <path
        d="
        M8.5 5.5
        C8.5 4.9 9.2 4.5 9.8 4.9
        L18 10.3
        C18.7 10.8 18.7 13.2 18 13.7
        L9.8 19.1
        C9.2 19.5 8.5 19.1 8.5 18.5
        Z
      "
      />
    </svg>
  `,

  stop: html`
    <svg viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
    </svg>
  `,

  pause: html`
    <svg viewBox="0 0 24 24">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  `,

  restart: html`
    <svg viewBox="0 0 24 24">
      <path
        d="
      M12 4
      c-4.42 0-8 3.58-8 8
      s3.58 8 8 8
      c3.73 0 6.86-2.55 7.74-6H17.6
      c-.77 2.3-2.94 4-5.6 4
      a6 6 0 1 1 4.24-10.24
      L13 11h7V4l-2.34 2.34
      A7.95 7.95 0 0 0 12 4Z"
      />
    </svg>
  `,

  terminate: html`
    <svg viewBox="0 0 24 24">
      <path
        d="
      M13 3v8h-2V3h2Zm5.7 2.3
      1.4 1.4A8.97 8.97 0 0 1 21 12
      a9 9 0 1 1-18 0
      c0-2.5 1-4.8 2.9-6.4
      l1.4 1.4
      A7 7 0 1 0 17.3 7
      l1.4-1.7Z"
      />
    </svg>
  `,

  help: html`<svg class="dg-header-help" viewBox="0 0 100 100">
    <g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g>
  </svg>`,

  scrollUp: html`<svg viewBox="0 0 1024 1024" style="fill: currentColor;">
    <path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path>
  </svg>`,

  scrollDown: html`<svg viewBox="0 0 1024 1024" style="fill: currentColor;">
    <path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path>
  </svg>`,

  scrollLeft: html`<svg viewBox="0 0 1024 1024" style="fill: currentColor;">
    <path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path>
  </svg>`,

  scrollRight: html`<svg viewBox="0 0 1024 1024" style="fill: currentColor;">
    <path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path>
  </svg>`,

  headerSort: html`<svg width="12" height="12" viewBox="0 0 12 12">
    <path
      class="dg-asc"
      d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z"
    />
    <path
      class="dg-desc"
      d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z"
    />
  </svg>`,

  sortup:
    '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="50,0 0,100 100,100" fill="#737171"></polygon></g></svg>',
  sortdown:
    '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="0,0 100,0 50,90" fill="#737171"></polygon></g></svg>',
};
