// AOS
AOS.init({
  duration: 1200,
  offset: 160
});

// const AOS = {
//   init: function(options) {
//     const settings = Object.assign({
//       duration: 400,
//       offset: 120
//     }, options)

//     const aosEls = document.querySelectorAll('[data-aos]');
//     aosEls.forEach(function(el) {
//       // const offset = el.getAttribute('data-aos-offset');
//       const offset = el.dataset.aosOffset;
//     })

//     console.log(settings.duration);
//   }
// }

// AOS.init({
//   duration: 1200
// });


// LazyLoad
const lazyImgEl = document.querySelectorAll('img.js-lazy');
lazyImgEl.forEach(function(el) {
  // https://png-pixel.com/
  el.setAttribute(
    'src',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  );
});

const lazyload = new LazyLoad({
  // 自訂義 BEM class
  elements_selector: '.js-lazy',
  // 設定距離可視區(視窗)底部多遠觸發，官方預設是 300
  threshold: 500,
  callback_loaded: function() {
    // 因為有的圖片沒設定 aspect 或固定高的話，當懶加在進入圖片高度比載入前高
    // 會影響滾軸高度，但 aos 不知道，所以要在這邊做刷新 aos
    AOS.refresh();
  }
});


// Nav
const burgerEl = document.querySelector('.o-burger');
const navEl = document.querySelector('.c-nav');

let menuIsOpened = false;
burgerEl.addEventListener('click', function() {
  // if (menuIsOpened) menuIsOpened = false;
  // else menuIsOpened = true;

  // toggle 開關
  menuIsOpened = !menuIsOpened

  if (menuIsOpened) {
    // this 會指向 burgerEl
    this.classList.add('is-opened');
    navEl.classList.add('is-opened');
  } else {
    this.classList.remove('is-opened');
    navEl.classList.remove('is-opened');
  }

  console.log(menuIsOpened);
});


// Lenis
const lenis = new Lenis({
  autoRaf: true,
});


// 抓取檔名 Nav Active
// pathname 網址路徑
const pathname = window.location.pathname;
const aEl = document.querySelectorAll('a');
aEl.forEach(function(el) {
  console.log('text => ', el.textContent); // 當前網址
  console.log('pathname => ', pathname); // 當前網址
  console.log('el.pathname => ', el.pathname); // 不包含 hash 所以會比對錯誤
  console.log('el.hash => ', el.hash); // 不包含 hash 所以會比對錯誤
  console.log('el.href => ', el.href); // 完整路徑（含網域）
  console.log('-----------------');

  // ---- 不夠精準
  // 檢查 el.pathname 有沒有存在 pathname 裡面
  // if (pathname.includes(el.pathname)) {
  //   el.classList.add('is-active');
  // }

  // 檢查 pathname 有沒有存在 el.href 裡面
  // if (el.href.includes(pathname)) {
  //   el.classList.add('is-active');
  // }
  // ---- 不夠精準

  // 檢查 el.pathname + el.hash  有沒有存在 pathname 裡面
  if ((pathname).includes(el.pathname + el.hash)) {
    el.classList.add('is-active');
  }
});

// 確保圖片都載入後在初始化視差滾動
window.addEventListener('load', function() {
  // 圖片視差滾動
  gsap.registerPlugin(ScrollTrigger);
  
  // gsap.to('[data-parallax-offset]') 只會選擇到個元素，類似 querySelector
  // gsap.utils.toArray 類似 querySelectorAll
  gsap.utils.toArray('[data-parallax-offset]').forEach(maskEl => {
    // 只抓 maskEl 裡的 img 標籤（不是用 document）
    const imgEl = maskEl.querySelector('img');
    
    // willChange 宣告有哪些元素會動畫，用來優化效能
    imgEl.style.willChange = 'transform';
  
    // timeline 也常用來做公共設定
    const tl = gsap.timeline({
      defaults: { ease: 'linear' },
      // 觸發器
      scrollTrigger: {
        trigger: maskEl,
        start: 'top bottom', // 元素頂部碰到視窗底部開始動畫
        end: 'bottom top', // 元素底部碰到視窗頂部結束動畫
        scrub: true // 要不要隨滑鼠動畫
      }
    });
  
    const offset = Number(maskEl.dataset.parallaxOffset); // Number() 字串轉數字
    // Math.abs() 取絕對值，就是絕對正數
    imgEl.style.setProperty('--parallax-offset', Math.abs(offset));
  
    if (offset > 0) {
      tl.fromTo(imgEl, { y: -1 * offset }, { y: 0 });
    } else {
      tl.fromTo(imgEl, { y: 0 }, { y: offset });
    }
  });
});
