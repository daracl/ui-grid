/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
function dc(n, e, t, r) {
  const s = URL.createObjectURL(n), i = document.createElement("a"), a = e.trim() || t;
  i.href = s, i.download = a.toLowerCase().endsWith(`.${r}`) ? a : `${a}.${r}`, i.style.display = "none";
  try {
    document.body.appendChild(i), i.click();
  } finally {
    i.remove(), setTimeout(() => URL.revokeObjectURL(s), 0);
  }
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function xc(n) {
  return n instanceof Uint8Array || ArrayBuffer.isView(n) && n.constructor.name === "Uint8Array";
}
function xo(n, ...e) {
  if (!xc(n))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + n.length);
}
const bc = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", pc = /* @__PURE__ */ Array.from({ length: 256 }, (n, e) => e.toString(16).padStart(2, "0"));
function bo(n) {
  if (xo(n), bc)
    return n.toHex();
  let e = "";
  for (let t = 0; t < n.length; t++)
    e += pc[n[t]];
  return e;
}
function p0(...n) {
  let e = 0;
  for (let r = 0; r < n.length; r++) {
    const s = n[r];
    xo(s), e += s.length;
  }
  const t = new Uint8Array(e);
  for (let r = 0, s = 0; r < n.length; r++) {
    const i = n[r];
    t.set(i, s), s += i.length;
  }
  return t;
}
var da = {}, gc = function(n, e, t, r, s) {
  var i = new Worker(da[e] || (da[e] = URL.createObjectURL(new Blob([
    n + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
  ], { type: "text/javascript" }))));
  return i.onmessage = function(a) {
    var o = a.data, l = o.$e$;
    if (l) {
      var f = new Error(l[0]);
      f.code = l[1], f.stack = l[2], s(f, null);
    } else
      s(null, o);
  }, i.postMessage(t, r), i;
}, ze = Uint8Array, r0 = Uint16Array, Vn = Int32Array, Mr = new ze([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), Lr = new ze([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), vn = new ze([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), po = function(n, e) {
  for (var t = new r0(31), r = 0; r < 31; ++r)
    t[r] = e += 1 << n[r - 1];
  for (var s = new Vn(t[30]), r = 1; r < 30; ++r)
    for (var i = t[r]; i < t[r + 1]; ++i)
      s[i] = i - t[r] << 5 | r;
  return { b: t, r: s };
}, go = po(Mr, 2), mi = go.b, Zs = go.r;
mi[28] = 258, Zs[258] = 28;
var mo = po(Lr, 0), Ao = mo.b, xa = mo.r, yn = new r0(32768);
for (var Te = 0; Te < 32768; ++Te) {
  var Y0 = (Te & 43690) >> 1 | (Te & 21845) << 1;
  Y0 = (Y0 & 52428) >> 2 | (Y0 & 13107) << 2, Y0 = (Y0 & 61680) >> 4 | (Y0 & 3855) << 4, yn[Te] = ((Y0 & 65280) >> 8 | (Y0 & 255) << 8) >> 1;
}
var g0 = function(n, e, t) {
  for (var r = n.length, s = 0, i = new r0(e); s < r; ++s)
    n[s] && ++i[n[s] - 1];
  var a = new r0(e);
  for (s = 1; s < e; ++s)
    a[s] = a[s - 1] + i[s - 1] << 1;
  var o;
  if (t) {
    o = new r0(1 << e);
    var l = 15 - e;
    for (s = 0; s < r; ++s)
      if (n[s])
        for (var f = s << 4 | n[s], u = e - n[s], c = a[n[s] - 1]++ << u, x = c | (1 << u) - 1; c <= x; ++c)
          o[yn[c] >> l] = f;
  } else
    for (o = new r0(r), s = 0; s < r; ++s)
      n[s] && (o[s] = yn[a[n[s] - 1]++] >> 15 - n[s]);
  return o;
}, dt = new ze(288);
for (var Te = 0; Te < 144; ++Te)
  dt[Te] = 8;
for (var Te = 144; Te < 256; ++Te)
  dt[Te] = 9;
for (var Te = 256; Te < 280; ++Te)
  dt[Te] = 7;
for (var Te = 280; Te < 288; ++Te)
  dt[Te] = 8;
var Pr = new ze(32);
for (var Te = 0; Te < 32; ++Te)
  Pr[Te] = 5;
var mc = /* @__PURE__ */ g0(dt, 9, 0), wo = /* @__PURE__ */ g0(dt, 9, 1), Ac = /* @__PURE__ */ g0(Pr, 5, 0), vo = /* @__PURE__ */ g0(Pr, 5, 1), fn = function(n) {
  for (var e = n[0], t = 1; t < n.length; ++t)
    n[t] > e && (e = n[t]);
  return e;
}, f0 = function(n, e, t) {
  var r = e / 8 | 0;
  return (n[r] | n[r + 1] << 8) >> (e & 7) & t;
}, un = function(n, e) {
  var t = e / 8 | 0;
  return (n[t] | n[t + 1] << 8 | n[t + 2] << 16) >> (e & 7);
}, _n = function(n) {
  return (n + 7) / 8 | 0;
}, Ai = function(n, e, t) {
  return (e == null || e < 0) && (e = 0), (t == null || t > n.length) && (t = n.length), new ze(n.subarray(e, t));
}, yo = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], a0 = function(n, e, t) {
  var r = new Error(e || yo[n]);
  if (r.code = n, Error.captureStackTrace && Error.captureStackTrace(r, a0), !t)
    throw r;
  return r;
}, wi = function(n, e, t, r) {
  var s = n.length, i = r ? r.length : 0;
  if (!s || e.f && !e.l)
    return t || new ze(0);
  var a = !t, o = a || e.i != 2, l = e.i;
  a && (t = new ze(s * 3));
  var f = function(O) {
    var Y = t.length;
    if (O > Y) {
      var Q = new ze(Math.max(Y * 2, O));
      Q.set(t), t = Q;
    }
  }, u = e.f || 0, c = e.p || 0, x = e.b || 0, g = e.l, m = e.d, v = e.m, E = e.n, C = s * 8;
  do {
    if (!g) {
      u = f0(n, c, 1);
      var y = f0(n, c + 1, 3);
      if (c += 3, y)
        if (y == 1)
          g = wo, m = vo, v = 9, E = 5;
        else if (y == 2) {
          var D = f0(n, c, 31) + 257, M = f0(n, c + 10, 15) + 4, I = D + f0(n, c + 5, 31) + 1;
          c += 14;
          for (var B = new ze(I), N = new ze(19), V = 0; V < M; ++V)
            N[vn[V]] = f0(n, c + V * 3, 7);
          c += M * 3;
          for (var j = fn(N), J = (1 << j) - 1, q = g0(N, j, 1), V = 0; V < I; ) {
            var $ = q[f0(n, c, J)];
            c += $ & 15;
            var A = $ >> 4;
            if (A < 16)
              B[V++] = A;
            else {
              var K = 0, W = 0;
              for (A == 16 ? (W = 3 + f0(n, c, 3), c += 2, K = B[V - 1]) : A == 17 ? (W = 3 + f0(n, c, 7), c += 3) : A == 18 && (W = 11 + f0(n, c, 127), c += 7); W--; )
                B[V++] = K;
            }
          }
          var ee = B.subarray(0, D), Z = B.subarray(D);
          v = fn(ee), E = fn(Z), g = g0(ee, v, 1), m = g0(Z, E, 1);
        } else
          a0(1);
      else {
        var A = _n(c) + 4, k = n[A - 4] | n[A - 3] << 8, p = A + k;
        if (p > s) {
          l && a0(0);
          break;
        }
        o && f(x + k), t.set(n.subarray(A, p), x), e.b = x += k, e.p = c = p * 8, e.f = u;
        continue;
      }
      if (c > C) {
        l && a0(0);
        break;
      }
    }
    o && f(x + 131072);
    for (var ae = (1 << v) - 1, be = (1 << E) - 1, ge = c; ; ge = c) {
      var K = g[un(n, c) & ae], Be = K >> 4;
      if (c += K & 15, c > C) {
        l && a0(0);
        break;
      }
      if (K || a0(2), Be < 256)
        t[x++] = Be;
      else if (Be == 256) {
        ge = c, g = null;
        break;
      } else {
        var Oe = Be - 254;
        if (Be > 264) {
          var V = Be - 257, Ae = Mr[V];
          Oe = f0(n, c, (1 << Ae) - 1) + mi[V], c += Ae;
        }
        var Le = m[un(n, c) & be], qe = Le >> 4;
        Le || a0(3), c += Le & 15;
        var Z = Ao[qe];
        if (qe > 3) {
          var Ae = Lr[qe];
          Z += un(n, c) & (1 << Ae) - 1, c += Ae;
        }
        if (c > C) {
          l && a0(0);
          break;
        }
        o && f(x + 131072);
        var z = x + Oe;
        if (x < Z) {
          var R = i - Z, L = Math.min(Z, z);
          for (R + x < 0 && a0(3); x < L; ++x)
            t[x] = r[R + x];
        }
        for (; x < z; ++x)
          t[x] = t[x - Z];
      }
    }
    e.l = g, e.p = ge, e.b = x, e.f = u, g && (u = 1, e.m = v, e.d = m, e.n = E);
  } while (!u);
  return x != t.length && a ? Ai(t, 0, x) : t.subarray(0, x);
}, U0 = function(n, e, t) {
  t <<= e & 7;
  var r = e / 8 | 0;
  n[r] |= t, n[r + 1] |= t >> 8;
}, hr = function(n, e, t) {
  t <<= e & 7;
  var r = e / 8 | 0;
  n[r] |= t, n[r + 1] |= t >> 8, n[r + 2] |= t >> 16;
}, gs = function(n, e) {
  for (var t = [], r = 0; r < n.length; ++r)
    n[r] && t.push({ s: r, f: n[r] });
  var s = t.length, i = t.slice();
  if (!s)
    return { t: So, l: 0 };
  if (s == 1) {
    var a = new ze(t[0].s + 1);
    return a[t[0].s] = 1, { t: a, l: 1 };
  }
  t.sort(function(p, D) {
    return p.f - D.f;
  }), t.push({ s: -1, f: 25001 });
  var o = t[0], l = t[1], f = 0, u = 1, c = 2;
  for (t[0] = { s: -1, f: o.f + l.f, l: o, r: l }; u != s - 1; )
    o = t[t[f].f < t[c].f ? f++ : c++], l = t[f != u && t[f].f < t[c].f ? f++ : c++], t[u++] = { s: -1, f: o.f + l.f, l: o, r: l };
  for (var x = i[0].s, r = 1; r < s; ++r)
    i[r].s > x && (x = i[r].s);
  var g = new r0(x + 1), m = Js(t[u - 1], g, 0);
  if (m > e) {
    var r = 0, v = 0, E = m - e, C = 1 << E;
    for (i.sort(function(D, M) {
      return g[M.s] - g[D.s] || D.f - M.f;
    }); r < s; ++r) {
      var y = i[r].s;
      if (g[y] > e)
        v += C - (1 << m - g[y]), g[y] = e;
      else
        break;
    }
    for (v >>= E; v > 0; ) {
      var A = i[r].s;
      g[A] < e ? v -= 1 << e - g[A]++ - 1 : ++r;
    }
    for (; r >= 0 && v; --r) {
      var k = i[r].s;
      g[k] == e && (--g[k], ++v);
    }
    m = e;
  }
  return { t: new ze(g), l: m };
}, Js = function(n, e, t) {
  return n.s == -1 ? Math.max(Js(n.l, e, t + 1), Js(n.r, e, t + 1)) : e[n.s] = t;
}, ba = function(n) {
  for (var e = n.length; e && !n[--e]; )
    ;
  for (var t = new r0(++e), r = 0, s = n[0], i = 1, a = function(l) {
    t[r++] = l;
  }, o = 1; o <= e; ++o)
    if (n[o] == s && o != e)
      ++i;
    else {
      if (!s && i > 2) {
        for (; i > 138; i -= 138)
          a(32754);
        i > 2 && (a(i > 10 ? i - 11 << 5 | 28690 : i - 3 << 5 | 12305), i = 0);
      } else if (i > 3) {
        for (a(s), --i; i > 6; i -= 6)
          a(8304);
        i > 2 && (a(i - 3 << 5 | 8208), i = 0);
      }
      for (; i--; )
        a(s);
      i = 1, s = n[o];
    }
  return { c: t.subarray(0, r), n: e };
}, dr = function(n, e) {
  for (var t = 0, r = 0; r < e.length; ++r)
    t += n[r] * e[r];
  return t;
}, Co = function(n, e, t) {
  var r = t.length, s = _n(e + 2);
  n[s] = r & 255, n[s + 1] = r >> 8, n[s + 2] = n[s] ^ 255, n[s + 3] = n[s + 1] ^ 255;
  for (var i = 0; i < r; ++i)
    n[s + i + 4] = t[i];
  return (s + 4 + r) * 8;
}, pa = function(n, e, t, r, s, i, a, o, l, f, u) {
  U0(e, u++, t), ++s[256];
  for (var c = gs(s, 15), x = c.t, g = c.l, m = gs(i, 15), v = m.t, E = m.l, C = ba(x), y = C.c, A = C.n, k = ba(v), p = k.c, D = k.n, M = new r0(19), I = 0; I < y.length; ++I)
    ++M[y[I] & 31];
  for (var I = 0; I < p.length; ++I)
    ++M[p[I] & 31];
  for (var B = gs(M, 7), N = B.t, V = B.l, j = 19; j > 4 && !N[vn[j - 1]]; --j)
    ;
  var J = f + 5 << 3, q = dr(s, dt) + dr(i, Pr) + a, $ = dr(s, x) + dr(i, v) + a + 14 + 3 * j + dr(M, N) + 2 * M[16] + 3 * M[17] + 7 * M[18];
  if (l >= 0 && J <= q && J <= $)
    return Co(e, u, n.subarray(l, l + f));
  var K, W, ee, Z;
  if (U0(e, u, 1 + ($ < q)), u += 2, $ < q) {
    K = g0(x, g, 0), W = x, ee = g0(v, E, 0), Z = v;
    var ae = g0(N, V, 0);
    U0(e, u, A - 257), U0(e, u + 5, D - 1), U0(e, u + 10, j - 4), u += 14;
    for (var I = 0; I < j; ++I)
      U0(e, u + 3 * I, N[vn[I]]);
    u += 3 * j;
    for (var be = [y, p], ge = 0; ge < 2; ++ge)
      for (var Be = be[ge], I = 0; I < Be.length; ++I) {
        var Oe = Be[I] & 31;
        U0(e, u, ae[Oe]), u += N[Oe], Oe > 15 && (U0(e, u, Be[I] >> 5 & 127), u += Be[I] >> 12);
      }
  } else
    K = mc, W = dt, ee = Ac, Z = Pr;
  for (var I = 0; I < o; ++I) {
    var Ae = r[I];
    if (Ae > 255) {
      var Oe = Ae >> 18 & 31;
      hr(e, u, K[Oe + 257]), u += W[Oe + 257], Oe > 7 && (U0(e, u, Ae >> 23 & 31), u += Mr[Oe]);
      var Le = Ae & 31;
      hr(e, u, ee[Le]), u += Z[Le], Le > 3 && (hr(e, u, Ae >> 5 & 8191), u += Lr[Le]);
    } else
      hr(e, u, K[Ae]), u += W[Ae];
  }
  return hr(e, u, K[256]), u + W[256];
}, wc = /* @__PURE__ */ new Vn([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), So = /* @__PURE__ */ new ze(0), vc = function(n, e, t, r, s, i) {
  var a = i.z || n.length, o = new ze(r + a + 5 * (1 + Math.ceil(a / 7e3)) + s), l = o.subarray(r, o.length - s), f = i.l, u = (i.r || 0) & 7;
  if (e) {
    u && (l[0] = i.r >> 3);
    for (var c = wc[e - 1], x = c >> 13, g = c & 8191, m = (1 << t) - 1, v = i.p || new r0(32768), E = i.h || new r0(m + 1), C = Math.ceil(t / 3), y = 2 * C, A = function(te) {
      return (n[te] ^ n[te + 1] << C ^ n[te + 2] << y) & m;
    }, k = new Vn(25e3), p = new r0(288), D = new r0(32), M = 0, I = 0, B = i.i || 0, N = 0, V = i.w || 0, j = 0; B + 2 < a; ++B) {
      var J = A(B), q = B & 32767, $ = E[J];
      if (v[q] = $, E[J] = q, V <= B) {
        var K = a - B;
        if ((M > 7e3 || N > 24576) && (K > 423 || !f)) {
          u = pa(n, l, 0, k, p, D, I, N, j, B - j, u), N = M = I = 0, j = B;
          for (var W = 0; W < 286; ++W)
            p[W] = 0;
          for (var W = 0; W < 30; ++W)
            D[W] = 0;
        }
        var ee = 2, Z = 0, ae = g, be = q - $ & 32767;
        if (K > 2 && J == A(B - be))
          for (var ge = Math.min(x, K) - 1, Be = Math.min(32767, B), Oe = Math.min(258, K); be <= Be && --ae && q != $; ) {
            if (n[B + ee] == n[B + ee - be]) {
              for (var Ae = 0; Ae < Oe && n[B + Ae] == n[B + Ae - be]; ++Ae)
                ;
              if (Ae > ee) {
                if (ee = Ae, Z = be, Ae > ge)
                  break;
                for (var Le = Math.min(be, Ae - 2), qe = 0, W = 0; W < Le; ++W) {
                  var z = B - be + W & 32767, R = v[z], L = z - R & 32767;
                  L > qe && (qe = L, $ = z);
                }
              }
            }
            q = $, $ = v[q], be += q - $ & 32767;
          }
        if (Z) {
          k[N++] = 268435456 | Zs[ee] << 18 | xa[Z];
          var O = Zs[ee] & 31, Y = xa[Z] & 31;
          I += Mr[O] + Lr[Y], ++p[257 + O], ++D[Y], V = B + ee, ++M;
        } else
          k[N++] = n[B], ++p[n[B]];
      }
    }
    for (B = Math.max(B, V); B < a; ++B)
      k[N++] = n[B], ++p[n[B]];
    u = pa(n, l, f, k, p, D, I, N, j, B - j, u), f || (i.r = u & 7 | l[u / 8 | 0] << 3, u -= 7, i.h = E, i.p = v, i.i = B, i.w = V);
  } else {
    for (var B = i.w || 0; B < a + f; B += 65535) {
      var Q = B + 65535;
      Q >= a && (l[u / 8 | 0] = f, Q = a), u = Co(l, u + 1, n.subarray(B, Q));
    }
    i.i = a;
  }
  return Ai(o, 0, r + _n(u) + s);
}, ko = function() {
  var n = 1, e = 0;
  return {
    p: function(t) {
      for (var r = n, s = e, i = t.length | 0, a = 0; a != i; ) {
        for (var o = Math.min(a + 2655, i); a < o; ++a)
          s += r += t[a];
        r = (r & 65535) + 15 * (r >> 16), s = (s & 65535) + 15 * (s >> 16);
      }
      n = r, e = s;
    },
    d: function() {
      return n %= 65521, e %= 65521, (n & 255) << 24 | (n & 65280) << 8 | (e & 255) << 8 | e >> 8;
    }
  };
}, yc = function(n, e, t, r, s) {
  if (!s && (s = { l: 1 }, e.dictionary)) {
    var i = e.dictionary.subarray(-32768), a = new ze(i.length + n.length);
    a.set(i), a.set(n, i.length), n = a, s.w = i.length;
  }
  return vc(n, e.level == null ? 6 : e.level, e.mem == null ? s.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(n.length))) * 1.5) : 20 : 12 + e.mem, t, r, s);
}, Cc = function(n, e) {
  var t = {};
  for (var r in n)
    t[r] = n[r];
  for (var r in e)
    t[r] = e[r];
  return t;
}, ga = function(n, e, t) {
  for (var r = n(), s = n.toString(), i = s.slice(s.indexOf("[") + 1, s.lastIndexOf("]")).replace(/\s+/g, "").split(","), a = 0; a < r.length; ++a) {
    var o = r[a], l = i[a];
    if (typeof o == "function") {
      e += ";" + l + "=";
      var f = o.toString();
      if (o.prototype)
        if (f.indexOf("[native code]") != -1) {
          var u = f.indexOf(" ", 8) + 1;
          e += f.slice(u, f.indexOf("(", u));
        } else {
          e += f;
          for (var c in o.prototype)
            e += ";" + l + ".prototype." + c + "=" + o.prototype[c].toString();
        }
      else
        e += f;
    } else
      t[l] = o;
  }
  return e;
}, jr = [], Sc = function(n) {
  var e = [];
  for (var t in n)
    n[t].buffer && e.push((n[t] = new n[t].constructor(n[t])).buffer);
  return e;
}, kc = function(n, e, t, r) {
  if (!jr[t]) {
    for (var s = "", i = {}, a = n.length - 1, o = 0; o < a; ++o)
      s = ga(n[o], s, i);
    jr[t] = { c: ga(n[a], s, i), e: i };
  }
  var l = Cc({}, jr[t].e);
  return gc(jr[t].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + e.toString() + "}", t, l, Sc(l), r);
}, Pc = function() {
  return [ze, r0, Vn, Mr, Lr, vn, mi, Ao, wo, vo, yn, yo, g0, fn, f0, un, _n, Ai, a0, wi, Fc, Po, To];
}, Tc = function() {
  return [Eo];
}, Po = function(n) {
  return postMessage(n, [n.buffer]);
}, To = function(n) {
  return n && {
    out: n.size && new ze(n.size),
    dictionary: n.dictionary
  };
}, Ic = function(n, e, t, r, s, i) {
  var a = kc(t, r, s, function(o, l) {
    a.terminate(), i(o, l);
  });
  return a.postMessage([n, e], e.consume ? [n.buffer] : []), function() {
    a.terminate();
  };
}, Io = function(n, e, t) {
  for (; t; ++e)
    n[e] = t, t >>>= 8;
}, Ec = function(n, e) {
  var t = e.level, r = t == 0 ? 0 : t < 6 ? 1 : t == 9 ? 3 : 2;
  if (n[0] = 120, n[1] = r << 6 | (e.dictionary && 32), n[1] |= 31 - (n[0] << 8 | n[1]) % 31, e.dictionary) {
    var s = ko();
    s.p(e.dictionary), Io(n, 2, s.d());
  }
}, Eo = function(n, e) {
  return ((n[0] & 15) != 8 || n[0] >> 4 > 7 || (n[0] << 8 | n[1]) % 31) && a0(6, "invalid zlib data"), (n[1] >> 5 & 1) == +!e && a0(6, "invalid zlib data: " + (n[1] & 32 ? "need" : "unexpected") + " dictionary"), (n[1] >> 3 & 4) + 2;
};
function Fc(n, e) {
  return wi(n, { i: 2 }, e && e.out, e && e.dictionary);
}
function Bc(n, e) {
  e || (e = {});
  var t = ko();
  t.p(n);
  var r = yc(n, e, e.dictionary ? 6 : 2, 4);
  return Ec(r, e), Io(r, r.length - 4, t.d()), r;
}
function Oc(n, e, t) {
  return t || (t = e, e = {}), typeof t != "function" && a0(7), Ic(n, e, [
    Pc,
    Tc,
    function() {
      return [ma];
    }
  ], function(r) {
    return Po(ma(r.data[0], To(r.data[1])));
  }, 5, t);
}
function ma(n, e) {
  return wi(n.subarray(Eo(n, e && e.dictionary), -4), { i: 2 }, e && e.out, e && e.dictionary);
}
var Dc = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), Mc = 0;
try {
  Dc.decode(So, { stream: !0 }), Mc = 1;
} catch {
}
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
function Lc(n) {
  return n instanceof Uint8Array || ArrayBuffer.isView(n) && n.constructor.name === "Uint8Array";
}
function k0(n, ...e) {
  if (!Lc(n))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + n.length);
}
function F0(n) {
  return new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4));
}
function Bt(...n) {
  for (let e = 0; e < n.length; e++)
    n[e].fill(0);
}
const Rc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Uc(n, e) {
  return n.buffer === e.buffer && // best we can do, may fail with an obscure Proxy
  n.byteOffset < e.byteOffset + e.byteLength && // a starts before b end
  e.byteOffset < n.byteOffset + n.byteLength;
}
function vi(n, e) {
  if (Uc(n, e) && n.byteOffset < e.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
const Fo = /* @__NO_SIDE_EFFECTS__ */ (n, e) => {
  function t(r, ...s) {
    if (k0(r), !Rc)
      throw new Error("Non little-endian hardware is not yet supported");
    if (n.nonceLength !== void 0) {
      const u = s[0];
      if (!u)
        throw new Error("nonce / iv required");
      n.varSizeNonce ? k0(u) : k0(u, n.nonceLength);
    }
    const i = n.tagLength;
    i && s[1] !== void 0 && k0(s[1]);
    const a = e(r, ...s), o = (u, c) => {
      if (c !== void 0) {
        if (u !== 2)
          throw new Error("cipher output not supported");
        k0(c);
      }
    };
    let l = !1;
    return {
      encrypt(u, c) {
        if (l)
          throw new Error("cannot encrypt() twice with same key + nonce");
        return l = !0, k0(u), o(a.encrypt.length, c), a.encrypt(u, c);
      },
      decrypt(u, c) {
        if (k0(u), i && u.length < i)
          throw new Error("invalid ciphertext length: smaller than tagLength=" + i);
        return o(a.decrypt.length, c), a.decrypt(u, c);
      }
    };
  }
  return Object.assign(t, n), t;
};
function yi(n, e, t = !0) {
  if (e === void 0)
    return new Uint8Array(n);
  if (e.length !== n)
    throw new Error("invalid output length, expected " + n + ", got: " + e.length);
  if (t && !Tt(e))
    throw new Error("invalid output, must be aligned");
  return e;
}
function Tt(n) {
  return n.byteOffset % 4 === 0;
}
function er(n) {
  return Uint8Array.from(n);
}
const ft = 16, Nc = 283;
function Ci(n) {
  return n << 1 ^ Nc & -(n >> 7);
}
function jt(n, e) {
  let t = 0;
  for (; e > 0; e >>= 1)
    t ^= n & -(e & 1), n = Ci(n);
  return t;
}
const Qs = /* @__PURE__ */ (() => {
  const n = new Uint8Array(256);
  for (let t = 0, r = 1; t < 256; t++, r ^= Ci(r))
    n[t] = r;
  const e = new Uint8Array(256);
  e[0] = 99;
  for (let t = 0; t < 255; t++) {
    let r = n[255 - t];
    r |= r << 8, e[n[t]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
  }
  return Bt(n), e;
})(), zc = /* @__PURE__ */ Qs.map((n, e) => Qs.indexOf(e)), Gc = (n) => n << 24 | n >>> 8, ms = (n) => n << 8 | n >>> 24;
function Bo(n, e) {
  if (n.length !== 256)
    throw new Error("Wrong sbox length");
  const t = new Uint32Array(256).map((f, u) => e(n[u])), r = t.map(ms), s = r.map(ms), i = s.map(ms), a = new Uint32Array(256 * 256), o = new Uint32Array(256 * 256), l = new Uint16Array(256 * 256);
  for (let f = 0; f < 256; f++)
    for (let u = 0; u < 256; u++) {
      const c = f * 256 + u;
      a[c] = t[f] ^ r[u], o[c] = s[f] ^ i[u], l[c] = n[f] << 8 | n[u];
    }
  return { sbox: n, sbox2: l, T0: t, T1: r, T2: s, T3: i, T01: a, T23: o };
}
const Si = /* @__PURE__ */ Bo(Qs, (n) => jt(n, 3) << 24 | n << 16 | n << 8 | jt(n, 2)), Oo = /* @__PURE__ */ Bo(zc, (n) => jt(n, 11) << 24 | jt(n, 13) << 16 | jt(n, 9) << 8 | jt(n, 14)), Hc = /* @__PURE__ */ (() => {
  const n = new Uint8Array(16);
  for (let e = 0, t = 1; e < 16; e++, t = Ci(t))
    n[e] = t;
  return n;
})();
function ki(n) {
  k0(n);
  const e = n.length;
  if (![16, 24, 32].includes(e))
    throw new Error("aes: invalid key size, should be 16, 24 or 32, got " + e);
  const { sbox2: t } = Si, r = [];
  Tt(n) || r.push(n = er(n));
  const s = F0(n), i = s.length, a = (l) => B0(t, l, l, l, l), o = new Uint32Array(e + 28);
  o.set(s);
  for (let l = i; l < o.length; l++) {
    let f = o[l - 1];
    l % i === 0 ? f = a(Gc(f)) ^ Hc[l / i - 1] : i > 6 && l % i === 4 && (f = a(f)), o[l] = o[l - i] ^ f;
  }
  return Bt(...r), o;
}
function Do(n) {
  const e = ki(n), t = e.slice(), r = e.length, { sbox2: s } = Si, { T0: i, T1: a, T2: o, T3: l } = Oo;
  for (let f = 0; f < r; f += 4)
    for (let u = 0; u < 4; u++)
      t[f + u] = e[r - f - 4 + u];
  Bt(e);
  for (let f = 4; f < r - 4; f++) {
    const u = t[f], c = B0(s, u, u, u, u);
    t[f] = i[c & 255] ^ a[c >>> 8 & 255] ^ o[c >>> 16 & 255] ^ l[c >>> 24];
  }
  return t;
}
function ot(n, e, t, r, s, i) {
  return n[t << 8 & 65280 | r >>> 8 & 255] ^ e[s >>> 8 & 65280 | i >>> 24 & 255];
}
function B0(n, e, t, r, s) {
  return n[e & 255 | t & 65280] | n[r >>> 16 & 255 | s >>> 16 & 65280] << 16;
}
function Cn(n, e, t, r, s) {
  const { sbox2: i, T01: a, T23: o } = Si;
  let l = 0;
  e ^= n[l++], t ^= n[l++], r ^= n[l++], s ^= n[l++];
  const f = n.length / 4 - 2;
  for (let m = 0; m < f; m++) {
    const v = n[l++] ^ ot(a, o, e, t, r, s), E = n[l++] ^ ot(a, o, t, r, s, e), C = n[l++] ^ ot(a, o, r, s, e, t), y = n[l++] ^ ot(a, o, s, e, t, r);
    e = v, t = E, r = C, s = y;
  }
  const u = n[l++] ^ B0(i, e, t, r, s), c = n[l++] ^ B0(i, t, r, s, e), x = n[l++] ^ B0(i, r, s, e, t), g = n[l++] ^ B0(i, s, e, t, r);
  return { s0: u, s1: c, s2: x, s3: g };
}
function Mo(n, e, t, r, s) {
  const { sbox2: i, T01: a, T23: o } = Oo;
  let l = 0;
  e ^= n[l++], t ^= n[l++], r ^= n[l++], s ^= n[l++];
  const f = n.length / 4 - 2;
  for (let m = 0; m < f; m++) {
    const v = n[l++] ^ ot(a, o, e, s, r, t), E = n[l++] ^ ot(a, o, t, e, s, r), C = n[l++] ^ ot(a, o, r, t, e, s), y = n[l++] ^ ot(a, o, s, r, t, e);
    e = v, t = E, r = C, s = y;
  }
  const u = n[l++] ^ B0(i, e, s, r, t), c = n[l++] ^ B0(i, t, e, s, r), x = n[l++] ^ B0(i, r, t, e, s), g = n[l++] ^ B0(i, s, r, t, e);
  return { s0: u, s1: c, s2: x, s3: g };
}
function Lo(n) {
  if (k0(n), n.length % ft !== 0)
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + ft);
}
function Ro(n, e, t) {
  k0(n);
  let r = n.length;
  const s = r % ft;
  if (!e && s !== 0)
    throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  Tt(n) || (n = er(n));
  const i = F0(n);
  if (e) {
    let o = ft - s;
    o || (o = ft), r = r + o;
  }
  t = yi(r, t), vi(n, t);
  const a = F0(t);
  return { b: i, o: a, out: t };
}
function Uo(n, e) {
  if (!e)
    return n;
  const t = n.length;
  if (!t)
    throw new Error("aes/pcks5: empty ciphertext not allowed");
  const r = n[t - 1];
  if (r <= 0 || r > 16)
    throw new Error("aes/pcks5: wrong padding");
  const s = n.subarray(0, -r);
  for (let i = 0; i < r; i++)
    if (n[t - i - 1] !== r)
      throw new Error("aes/pcks5: wrong padding");
  return s;
}
function No(n) {
  const e = new Uint8Array(16), t = F0(e);
  e.set(n);
  const r = ft - n.length;
  for (let s = ft - r; s < ft; s++)
    e[s] = r;
  return t;
}
const Wc = /* @__PURE__ */ Fo({ blockSize: 16 }, function(e, t = {}) {
  const r = !t.disablePadding;
  return {
    encrypt(s, i) {
      const { b: a, o, out: l } = Ro(s, r, i), f = ki(e);
      let u = 0;
      for (; u + 4 <= a.length; ) {
        const { s0: c, s1: x, s2: g, s3: m } = Cn(f, a[u + 0], a[u + 1], a[u + 2], a[u + 3]);
        o[u++] = c, o[u++] = x, o[u++] = g, o[u++] = m;
      }
      if (r) {
        const c = No(s.subarray(u * 4)), { s0: x, s1: g, s2: m, s3: v } = Cn(f, c[0], c[1], c[2], c[3]);
        o[u++] = x, o[u++] = g, o[u++] = m, o[u++] = v;
      }
      return Bt(f), l;
    },
    decrypt(s, i) {
      Lo(s);
      const a = Do(e);
      i = yi(s.length, i);
      const o = [a];
      Tt(s) || o.push(s = er(s)), vi(s, i);
      const l = F0(s), f = F0(i);
      for (let u = 0; u + 4 <= l.length; ) {
        const { s0: c, s1: x, s2: g, s3: m } = Mo(a, l[u + 0], l[u + 1], l[u + 2], l[u + 3]);
        f[u++] = c, f[u++] = x, f[u++] = g, f[u++] = m;
      }
      return Bt(...o), Uo(i, r);
    }
  };
}), Vc = /* @__PURE__ */ Fo({ blockSize: 16, nonceLength: 16 }, function(e, t, r = {}) {
  const s = !r.disablePadding;
  return {
    encrypt(i, a) {
      const o = ki(e), { b: l, o: f, out: u } = Ro(i, s, a);
      let c = t;
      const x = [o];
      Tt(c) || x.push(c = er(c));
      const g = F0(c);
      let m = g[0], v = g[1], E = g[2], C = g[3], y = 0;
      for (; y + 4 <= l.length; )
        m ^= l[y + 0], v ^= l[y + 1], E ^= l[y + 2], C ^= l[y + 3], { s0: m, s1: v, s2: E, s3: C } = Cn(o, m, v, E, C), f[y++] = m, f[y++] = v, f[y++] = E, f[y++] = C;
      if (s) {
        const A = No(i.subarray(y * 4));
        m ^= A[0], v ^= A[1], E ^= A[2], C ^= A[3], { s0: m, s1: v, s2: E, s3: C } = Cn(o, m, v, E, C), f[y++] = m, f[y++] = v, f[y++] = E, f[y++] = C;
      }
      return Bt(...x), u;
    },
    decrypt(i, a) {
      Lo(i);
      const o = Do(e);
      let l = t;
      const f = [o];
      Tt(l) || f.push(l = er(l));
      const u = F0(l);
      a = yi(i.length, a), Tt(i) || f.push(i = er(i)), vi(i, a);
      const c = F0(i), x = F0(a);
      let g = u[0], m = u[1], v = u[2], E = u[3];
      for (let C = 0; C + 4 <= c.length; ) {
        const y = g, A = m, k = v, p = E;
        g = c[C + 0], m = c[C + 1], v = c[C + 2], E = c[C + 3];
        const { s0: D, s1: M, s2: I, s3: B } = Mo(o, g, m, v, E);
        x[C++] = D ^ y, x[C++] = M ^ A, x[C++] = I ^ k, x[C++] = B ^ p;
      }
      return Bt(...f), Uo(a, s);
    }
  };
}), _c = {
  utf16le: "utf-16le",
  ucs2: "utf-16le",
  utf16be: "utf-16be"
};
class We {
  constructor(e) {
    this.buffer = e, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength), this.pos = 0, this.length = this.buffer.length;
  }
  readString(e, t = "ascii") {
    t = _c[t] || t;
    let r = this.readBuffer(e);
    try {
      return new TextDecoder(t).decode(r);
    } catch {
      return r;
    }
  }
  readBuffer(e) {
    return this.buffer.slice(this.pos, this.pos += e);
  }
  readUInt24BE() {
    return (this.readUInt16BE() << 8) + this.readUInt8();
  }
  readUInt24LE() {
    return this.readUInt16LE() + (this.readUInt8() << 16);
  }
  readInt24BE() {
    return (this.readInt16BE() << 8) + this.readUInt8();
  }
  readInt24LE() {
    return this.readUInt16LE() + (this.readInt8() << 16);
  }
}
We.TYPES = {
  UInt8: 1,
  UInt16: 2,
  UInt24: 3,
  UInt32: 4,
  Int8: 1,
  Int16: 2,
  Int24: 3,
  Int32: 4,
  Float: 4,
  Double: 8
};
for (let n of Object.getOwnPropertyNames(DataView.prototype))
  if (n.slice(0, 3) === "get") {
    let e = n.slice(3).replace("Ui", "UI");
    e === "Float32" ? e = "Float" : e === "Float64" && (e = "Double");
    let t = We.TYPES[e];
    We.prototype["read" + e + (t === 1 ? "" : "BE")] = function() {
      const r = this.view[n](this.pos, !1);
      return this.pos += t, r;
    }, t !== 1 && (We.prototype["read" + e + "LE"] = function() {
      const r = this.view[n](this.pos, !0);
      return this.pos += t, r;
    });
  }
const qc = new TextEncoder(), Aa = new Uint8Array(new Uint16Array([4660]).buffer)[0] == 18;
class Sn {
  constructor(e) {
    this.buffer = e, this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength), this.pos = 0;
  }
  writeBuffer(e) {
    this.buffer.set(e, this.pos), this.pos += e.length;
  }
  writeString(e, t = "ascii") {
    let r;
    switch (t) {
      case "utf16le":
      case "utf16-le":
      case "ucs2":
        r = wa(e, Aa);
        break;
      case "utf16be":
      case "utf16-be":
        r = wa(e, !Aa);
        break;
      case "utf8":
        r = qc.encode(e);
        break;
      case "ascii":
        r = $c(e);
        break;
      default:
        throw new Error(`Unsupported encoding: ${t}`);
    }
    this.writeBuffer(r);
  }
  writeUInt24BE(e) {
    this.buffer[this.pos++] = e >>> 16 & 255, this.buffer[this.pos++] = e >>> 8 & 255, this.buffer[this.pos++] = e & 255;
  }
  writeUInt24LE(e) {
    this.buffer[this.pos++] = e & 255, this.buffer[this.pos++] = e >>> 8 & 255, this.buffer[this.pos++] = e >>> 16 & 255;
  }
  writeInt24BE(e) {
    e >= 0 ? this.writeUInt24BE(e) : this.writeUInt24BE(e + 16777215 + 1);
  }
  writeInt24LE(e) {
    e >= 0 ? this.writeUInt24LE(e) : this.writeUInt24LE(e + 16777215 + 1);
  }
  fill(e, t) {
    if (t < this.buffer.length)
      this.buffer.fill(e, this.pos, this.pos + t), this.pos += t;
    else {
      const r = new Uint8Array(t);
      r.fill(e), this.writeBuffer(r);
    }
  }
}
function wa(n, e) {
  let t = new Uint16Array(n.length);
  for (let r = 0; r < n.length; r++) {
    let s = n.charCodeAt(r);
    e && (s = s >> 8 | (s & 255) << 8), t[r] = s;
  }
  return new Uint8Array(t.buffer);
}
function $c(n) {
  let e = new Uint8Array(n.length);
  for (let t = 0; t < n.length; t++)
    e[t] = n.charCodeAt(t);
  return e;
}
for (let n of Object.getOwnPropertyNames(DataView.prototype))
  if (n.slice(0, 3) === "set") {
    let e = n.slice(3).replace("Ui", "UI");
    e === "Float32" ? e = "Float" : e === "Float64" && (e = "Double");
    let t = We.TYPES[e];
    Sn.prototype["write" + e + (t === 1 ? "" : "BE")] = function(r) {
      this.view[n](this.pos, r, !1), this.pos += t;
    }, t !== 1 && (Sn.prototype["write" + e + "LE"] = function(r) {
      this.view[n](this.pos, r, !0), this.pos += t;
    });
  }
class $0 {
  fromBuffer(e) {
    let t = new We(e);
    return this.decode(t);
  }
  toBuffer(e) {
    let t = this.size(e), r = new Uint8Array(t), s = new Sn(r);
    return this.encode(s, e), r;
  }
}
class ye extends $0 {
  constructor(e, t = "BE") {
    super(), this.type = e, this.endian = t, this.fn = this.type, this.type[this.type.length - 1] !== "8" && (this.fn += this.endian);
  }
  size() {
    return We.TYPES[this.type];
  }
  decode(e) {
    return e[`read${this.fn}`]();
  }
  encode(e, t) {
    return e[`write${this.fn}`](t);
  }
}
const H = new ye("UInt8"), Xc = new ye("UInt16", "BE"), h = Xc;
new ye("UInt16", "LE");
const jc = new ye("UInt24", "BE"), ut = jc;
new ye("UInt24", "LE");
const Yc = new ye("UInt32", "BE"), T = Yc;
new ye("UInt32", "LE");
const Ue = new ye("Int8"), Kc = new ye("Int16", "BE"), U = Kc;
new ye("Int16", "LE");
new ye("Int24", "BE");
new ye("Int24", "LE");
const Zc = new ye("Int32", "BE"), Ct = Zc;
new ye("Int32", "LE");
new ye("Float", "BE");
new ye("Float", "LE");
new ye("Double", "BE");
new ye("Double", "LE");
class Ot extends ye {
  constructor(e, t, r = e >> 1) {
    super(`Int${e}`, t), this._point = 1 << r;
  }
  decode(e) {
    return super.decode(e) / this._point;
  }
  encode(e, t) {
    return super.encode(e, t * this._point | 0);
  }
}
const Jc = new Ot(16, "BE"), Qc = Jc;
new Ot(16, "LE");
const e2 = new Ot(32, "BE"), De = e2;
new Ot(32, "LE");
function M0(n, e, t) {
  let r;
  if (typeof n == "number" ? r = n : typeof n == "function" ? r = n.call(t, t) : t && typeof n == "string" ? r = t[n] : e && n instanceof ye && (r = n.decode(e)), isNaN(r))
    throw new Error("Not a fixed size");
  return r;
}
class Pi {
  constructor(e = {}) {
    this.enumerable = !0, this.configurable = !0;
    for (let t in e) {
      const r = e[t];
      this[t] = r;
    }
  }
}
class S extends $0 {
  constructor(e, t, r = "count") {
    super(), this.type = e, this.length = t, this.lengthType = r;
  }
  decode(e, t) {
    let r;
    const { pos: s } = e, i = [];
    let a = t;
    if (this.length != null && (r = M0(this.length, e, t)), this.length instanceof ye && (Object.defineProperties(i, {
      parent: { value: t },
      _startOffset: { value: s },
      _currentOffset: { value: 0, writable: !0 },
      _length: { value: r }
    }), a = i), r == null || this.lengthType === "bytes") {
      const o = r != null ? e.pos + r : t != null && t._length ? t._startOffset + t._length : e.length;
      for (; e.pos < o; )
        i.push(this.type.decode(e, a));
    } else
      for (let o = 0, l = r; o < l; o++)
        i.push(this.type.decode(e, a));
    return i;
  }
  size(e, t, r = !0) {
    if (!e)
      return this.type.size(null, t) * M0(this.length, null, t);
    let s = 0;
    this.length instanceof ye && (s += this.length.size(), t = { parent: t, pointerSize: 0 });
    for (let i of e)
      s += this.type.size(i, t);
    return t && r && this.length instanceof ye && (s += t.pointerSize), s;
  }
  encode(e, t, r) {
    let s = r;
    this.length instanceof ye && (s = {
      pointers: [],
      startOffset: e.pos,
      parent: r
    }, s.pointerOffset = e.pos + this.size(t, s, !1), this.length.encode(e, t.length));
    for (let i of t)
      this.type.encode(e, i, s);
    if (this.length instanceof ye) {
      let i = 0;
      for (; i < s.pointers.length; ) {
        const a = s.pointers[i++];
        a.type.encode(e, a.val, a.parent);
      }
    }
  }
}
class ke extends S {
  decode(e, t) {
    const { pos: r } = e, s = M0(this.length, e, t);
    this.length instanceof ye && (t = {
      parent: t,
      _startOffset: r,
      _currentOffset: 0,
      _length: s
    });
    const i = new As(this.type, s, e, t);
    return e.pos += s * this.type.size(null, t), i;
  }
  size(e, t) {
    return e instanceof As && (e = e.toArray()), super.size(e, t);
  }
  encode(e, t, r) {
    return t instanceof As && (t = t.toArray()), super.encode(e, t, r);
  }
}
class As {
  constructor(e, t, r, s) {
    this.type = e, this.length = t, this.stream = r, this.ctx = s, this.base = this.stream.pos, this.items = [];
  }
  get(e) {
    if (!(e < 0 || e >= this.length)) {
      if (this.items[e] == null) {
        const { pos: t } = this.stream;
        this.stream.pos = this.base + this.type.size(null, this.ctx) * e, this.items[e] = this.type.decode(this.stream, this.ctx), this.stream.pos = t;
      }
      return this.items[e];
    }
  }
  toArray() {
    const e = [];
    for (let t = 0, r = this.length; t < r; t++)
      e.push(this.get(t));
    return e;
  }
}
class m0 extends $0 {
  constructor(e, t = []) {
    super(), this.type = e, this.flags = t;
  }
  decode(e) {
    const t = this.type.decode(e), r = {};
    for (let s = 0; s < this.flags.length; s++) {
      const i = this.flags[s];
      i != null && (r[i] = !!(t & 1 << s));
    }
    return r;
  }
  size() {
    return this.type.size();
  }
  encode(e, t) {
    let r = 0;
    for (let s = 0; s < this.flags.length; s++) {
      const i = this.flags[s];
      i != null && t[i] && (r |= 1 << s);
    }
    return this.type.encode(e, r);
  }
}
class D0 extends $0 {
  constructor(e) {
    super(), this.length = e;
  }
  decode(e, t) {
    const r = M0(this.length, e, t);
    return e.readBuffer(r);
  }
  size(e, t) {
    if (!e)
      return M0(this.length, null, t);
    let r = e.length;
    return this.length instanceof ye && (r += this.length.size()), r;
  }
  encode(e, t, r) {
    return this.length instanceof ye && this.length.encode(e, t.length), e.writeBuffer(t);
  }
}
class kn extends $0 {
  constructor(e, t = !0) {
    super(), this.type = e, this.condition = t;
  }
  decode(e, t) {
    let { condition: r } = this;
    if (typeof r == "function" && (r = r.call(t, t)), r)
      return this.type.decode(e, t);
  }
  size(e, t) {
    let { condition: r } = this;
    return typeof r == "function" && (r = r.call(t, t)), r ? this.type.size(e, t) : 0;
  }
  encode(e, t, r) {
    let { condition: s } = this;
    if (typeof s == "function" && (s = s.call(r, r)), s)
      return this.type.encode(e, t, r);
  }
}
class Ie extends $0 {
  constructor(e, t = 1) {
    super(), this.type = e, this.count = t;
  }
  decode(e, t) {
    e.pos += this.size(null, t);
  }
  size(e, t) {
    const r = M0(this.count, null, t);
    return this.type.size() * r;
  }
  encode(e, t, r) {
    return e.fill(0, this.size(t, r));
  }
}
class Se extends $0 {
  constructor(e, t = "ascii") {
    super(), this.length = e, this.encoding = t;
  }
  decode(e, t) {
    let r, s, { encoding: i } = this;
    typeof i == "function" && (i = i.call(t, t) || "ascii");
    let a = ws(i);
    if (this.length != null)
      r = M0(this.length, e, t);
    else {
      let l;
      for ({ buffer: l, length: r, pos: s } = e; s < r - a + 1 && (l[s] !== 0 || a === 2 && l[s + 1] !== 0); )
        s += a;
      r = s - e.pos;
    }
    const o = e.readString(r, i);
    return this.length == null && e.pos < e.length && (e.pos += a), o;
  }
  size(e, t) {
    if (e == null)
      return M0(this.length, null, t);
    let { encoding: r } = this;
    typeof r == "function" && (r = r.call(t != null ? t.val : void 0, t != null ? t.val : void 0) || "ascii"), r === "utf16be" && (r = "utf16le");
    let s = va(e, r);
    return this.length instanceof ye && (s += this.length.size()), this.length == null && (s += ws(r)), s;
  }
  encode(e, t, r) {
    let { encoding: s } = this;
    if (typeof s == "function" && (s = s.call(r != null ? r.val : void 0, r != null ? r.val : void 0) || "ascii"), this.length instanceof ye && this.length.encode(e, va(t, s)), e.writeString(t, s), this.length == null)
      return ws(s) == 2 ? e.writeUInt16LE(0) : e.writeUInt8(0);
  }
}
function ws(n) {
  switch (n) {
    case "ascii":
    case "utf8":
      return 1;
    case "utf16le":
    case "utf16-le":
    case "utf-16be":
    case "utf-16le":
    case "utf16be":
    case "utf16-be":
    case "ucs2":
      return 2;
    default:
      return 1;
  }
}
function va(n, e) {
  switch (e) {
    case "ascii":
      return n.length;
    case "utf8":
      let t = 0;
      for (let r = 0; r < n.length; r++) {
        let s = n.charCodeAt(r);
        if (s >= 55296 && s <= 56319 && r < n.length - 1) {
          let i = n.charCodeAt(++r);
          (i & 64512) === 56320 ? s = ((s & 1023) << 10) + (i & 1023) + 65536 : r--;
        }
        s & 4294967168 ? s & 4294965248 ? s & 4294901760 ? s & 4292870144 || (t += 4) : t += 3 : t += 2 : t++;
      }
      return t;
    case "utf16le":
    case "utf16-le":
    case "utf16be":
    case "utf16-be":
    case "ucs2":
      return n.length * 2;
    default:
      throw new Error("Unknown encoding " + e);
  }
}
class F extends $0 {
  constructor(e = {}) {
    super(), this.fields = e;
  }
  decode(e, t, r = 0) {
    const s = this._setup(e, t, r);
    return this._parseFields(e, s, this.fields), this.process != null && this.process.call(s, e), s;
  }
  _setup(e, t, r) {
    const s = {};
    return Object.defineProperties(s, {
      parent: { value: t },
      _startOffset: { value: e.pos },
      _currentOffset: { value: 0, writable: !0 },
      _length: { value: r }
    }), s;
  }
  _parseFields(e, t, r) {
    for (let i in r) {
      var s;
      const a = r[i];
      typeof a == "function" ? s = a.call(t, t) : s = a.decode(e, t), s !== void 0 && (s instanceof Pi ? Object.defineProperty(t, i, s) : t[i] = s), t._currentOffset = e.pos - t._startOffset;
    }
  }
  size(e, t, r = !0) {
    e == null && (e = {});
    const s = {
      parent: t,
      val: e,
      pointerSize: 0
    };
    this.preEncode != null && this.preEncode.call(e);
    let i = 0;
    for (let a in this.fields) {
      const o = this.fields[a];
      o.size != null && (i += o.size(e[a], s));
    }
    return r && (i += s.pointerSize), i;
  }
  encode(e, t, r) {
    let s;
    this.preEncode != null && this.preEncode.call(t, e);
    const i = {
      pointers: [],
      startOffset: e.pos,
      parent: r,
      val: t,
      pointerSize: 0
    };
    i.pointerOffset = e.pos + this.size(t, i, !1);
    for (let o in this.fields)
      s = this.fields[o], s.encode != null && s.encode(e, t[o], i);
    let a = 0;
    for (; a < i.pointers.length; ) {
      const o = i.pointers[a++];
      o.type.encode(e, o.val, o.parent);
    }
  }
}
const t2 = (n, e) => e.reduce((t, r) => t && t[r], n);
class fe extends F {
  constructor(e, t = {}) {
    super(), this.type = e, this.versions = t, typeof e == "string" && (this.versionPath = e.split("."));
  }
  decode(e, t, r = 0) {
    const s = this._setup(e, t, r);
    typeof this.type == "string" ? s.version = t2(t, this.versionPath) : s.version = this.type.decode(e), this.versions.header && this._parseFields(e, s, this.versions.header);
    const i = this.versions[s.version];
    if (i == null)
      throw new Error(`Unknown version ${s.version}`);
    return i instanceof fe ? i.decode(e, t) : (this._parseFields(e, s, i), this.process != null && this.process.call(s, e), s);
  }
  size(e, t, r = !0) {
    let s, i;
    if (!e)
      throw new Error("Not a fixed size");
    this.preEncode != null && this.preEncode.call(e);
    const a = {
      parent: t,
      val: e,
      pointerSize: 0
    };
    let o = 0;
    if (typeof this.type != "string" && (o += this.type.size(e.version, a)), this.versions.header)
      for (s in this.versions.header)
        i = this.versions.header[s], i.size != null && (o += i.size(e[s], a));
    const l = this.versions[e.version];
    if (l == null)
      throw new Error(`Unknown version ${e.version}`);
    for (s in l)
      i = l[s], i.size != null && (o += i.size(e[s], a));
    return r && (o += a.pointerSize), o;
  }
  encode(e, t, r) {
    let s, i;
    this.preEncode != null && this.preEncode.call(t, e);
    const a = {
      pointers: [],
      startOffset: e.pos,
      parent: r,
      val: t,
      pointerSize: 0
    };
    if (a.pointerOffset = e.pos + this.size(t, a, !1), typeof this.type != "string" && this.type.encode(e, t.version), this.versions.header)
      for (s in this.versions.header)
        i = this.versions.header[s], i.encode != null && i.encode(e, t[s], a);
    const o = this.versions[t.version];
    for (s in o)
      i = o[s], i.encode != null && i.encode(e, t[s], a);
    let l = 0;
    for (; l < a.pointers.length; ) {
      const f = a.pointers[l++];
      f.type.encode(e, f.val, f.parent);
    }
  }
}
class P extends $0 {
  constructor(e, t, r = {}) {
    if (super(), this.offsetType = e, this.type = t, this.options = r, this.type === "void" && (this.type = null), this.options.type == null && (this.options.type = "local"), this.options.allowNull == null && (this.options.allowNull = !0), this.options.nullValue == null && (this.options.nullValue = 0), this.options.lazy == null && (this.options.lazy = !1), this.options.relativeTo) {
      if (typeof this.options.relativeTo != "function")
        throw new Error("relativeTo option must be a function");
      this.relativeToGetter = r.relativeTo;
    }
  }
  decode(e, t) {
    const r = this.offsetType.decode(e, t);
    if (r === this.options.nullValue && this.options.allowNull)
      return null;
    let s;
    switch (this.options.type) {
      case "local":
        s = t._startOffset;
        break;
      case "immediate":
        s = e.pos - this.offsetType.size();
        break;
      case "parent":
        s = t.parent._startOffset;
        break;
      default:
        for (var i = t; i.parent; )
          i = i.parent;
        s = i._startOffset || 0;
    }
    this.options.relativeTo && (s += this.relativeToGetter(t));
    const a = r + s;
    if (this.type != null) {
      let o = null;
      const l = () => {
        if (o != null)
          return o;
        const { pos: f } = e;
        return e.pos = a, o = this.type.decode(e, t), e.pos = f, o;
      };
      return this.options.lazy ? new Pi({
        get: l
      }) : l();
    } else
      return a;
  }
  size(e, t) {
    const r = t;
    switch (this.options.type) {
      case "local":
      case "immediate":
        break;
      case "parent":
        t = t.parent;
        break;
      default:
        for (; t.parent; )
          t = t.parent;
    }
    let { type: s } = this;
    if (s == null) {
      if (!(e instanceof ei))
        throw new Error("Must be a VoidPointer");
      ({ type: s } = e), e = e.value;
    }
    if (e && t) {
      let i = s.size(e, r);
      t.pointerSize += i;
    }
    return this.offsetType.size();
  }
  encode(e, t, r) {
    let s;
    const i = r;
    if (t == null) {
      this.offsetType.encode(e, this.options.nullValue);
      return;
    }
    switch (this.options.type) {
      case "local":
        s = r.startOffset;
        break;
      case "immediate":
        s = e.pos + this.offsetType.size(t, i);
        break;
      case "parent":
        r = r.parent, s = r.startOffset;
        break;
      default:
        for (s = 0; r.parent; )
          r = r.parent;
    }
    this.options.relativeTo && (s += this.relativeToGetter(i.val)), this.offsetType.encode(e, r.pointerOffset - s);
    let { type: a } = this;
    if (a == null) {
      if (!(t instanceof ei))
        throw new Error("Must be a VoidPointer");
      ({ type: a } = t), t = t.value;
    }
    return r.pointers.push({
      type: a,
      val: t,
      parent: i
    }), r.pointerOffset += a.size(t, i);
  }
}
class ei {
  constructor(e, t) {
    this.type = e, this.value = t;
  }
}
function n0(n, e, t) {
  return e in n ? Object.defineProperty(n, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : n[e] = t, n;
}
function Ve(n, e, t, r) {
  var s = arguments.length, i = s < 3 ? e : r === null ? r = Object.getOwnPropertyDescriptor(e, t) : r, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(n, e, t, r);
  else for (var o = n.length - 1; o >= 0; o--) (a = n[o]) && (i = (s < 3 ? a(i) : s > 3 ? a(e, t, i) : a(e, t)) || i);
  return s > 3 && i && Object.defineProperty(e, t, i), i;
}
function Dt(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var r2 = function n(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var r, s, i;
    if (Array.isArray(e)) {
      if (r = e.length, r != t.length) return !1;
      for (s = r; s-- !== 0; )
        if (!n(e[s], t[s])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
    if (i = Object.keys(e), r = i.length, r !== Object.keys(t).length) return !1;
    for (s = r; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, i[s])) return !1;
    for (s = r; s-- !== 0; ) {
      var a = i[s];
      if (!n(e[a], t[a])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
};
const ya = /* @__PURE__ */ Dt(r2);
var Rr = {};
Rr.byteLength = i2;
Rr.toByteArray = o2;
Rr.fromByteArray = f2;
var I0 = [], u0 = [], n2 = typeof Uint8Array < "u" ? Uint8Array : Array, vs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var zt = 0, s2 = vs.length; zt < s2; ++zt)
  I0[zt] = vs[zt], u0[vs.charCodeAt(zt)] = zt;
u0[45] = 62;
u0[95] = 63;
function zo(n) {
  var e = n.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var t = n.indexOf("=");
  t === -1 && (t = e);
  var r = t === e ? 0 : 4 - t % 4;
  return [t, r];
}
function i2(n) {
  var e = zo(n), t = e[0], r = e[1];
  return (t + r) * 3 / 4 - r;
}
function a2(n, e, t) {
  return (e + t) * 3 / 4 - t;
}
function o2(n) {
  var e, t = zo(n), r = t[0], s = t[1], i = new n2(a2(n, r, s)), a = 0, o = s > 0 ? r - 4 : r, l;
  for (l = 0; l < o; l += 4)
    e = u0[n.charCodeAt(l)] << 18 | u0[n.charCodeAt(l + 1)] << 12 | u0[n.charCodeAt(l + 2)] << 6 | u0[n.charCodeAt(l + 3)], i[a++] = e >> 16 & 255, i[a++] = e >> 8 & 255, i[a++] = e & 255;
  return s === 2 && (e = u0[n.charCodeAt(l)] << 2 | u0[n.charCodeAt(l + 1)] >> 4, i[a++] = e & 255), s === 1 && (e = u0[n.charCodeAt(l)] << 10 | u0[n.charCodeAt(l + 1)] << 4 | u0[n.charCodeAt(l + 2)] >> 2, i[a++] = e >> 8 & 255, i[a++] = e & 255), i;
}
function l2(n) {
  return I0[n >> 18 & 63] + I0[n >> 12 & 63] + I0[n >> 6 & 63] + I0[n & 63];
}
function c2(n, e, t) {
  for (var r, s = [], i = e; i < t; i += 3)
    r = (n[i] << 16 & 16711680) + (n[i + 1] << 8 & 65280) + (n[i + 2] & 255), s.push(l2(r));
  return s.join("");
}
function f2(n) {
  for (var e, t = n.length, r = t % 3, s = [], i = 16383, a = 0, o = t - r; a < o; a += i)
    s.push(c2(n, a, a + i > o ? o : a + i));
  return r === 1 ? (e = n[t - 1], s.push(
    I0[e >> 2] + I0[e << 4 & 63] + "=="
  )) : r === 2 && (e = (n[t - 2] << 8) + n[t - 1], s.push(
    I0[e >> 10] + I0[e >> 4 & 63] + I0[e << 2 & 63] + "="
  )), s.join("");
}
var Ti = 0, Go = -3;
function Tr() {
  this.table = new Uint16Array(16), this.trans = new Uint16Array(288);
}
function u2(n, e) {
  this.source = n, this.sourceIndex = 0, this.tag = 0, this.bitcount = 0, this.dest = e, this.destLen = 0, this.ltree = new Tr(), this.dtree = new Tr();
}
var Ho = new Tr(), Wo = new Tr(), Ii = new Uint8Array(30), Ei = new Uint16Array(30), Vo = new Uint8Array(30), _o = new Uint16Array(30), h2 = new Uint8Array([
  16,
  17,
  18,
  0,
  8,
  7,
  9,
  6,
  10,
  5,
  11,
  4,
  12,
  3,
  13,
  2,
  14,
  1,
  15
]), Ca = new Tr(), y0 = new Uint8Array(320);
function qo(n, e, t, r) {
  var s, i;
  for (s = 0; s < t; ++s) n[s] = 0;
  for (s = 0; s < 30 - t; ++s) n[s + t] = s / t | 0;
  for (i = r, s = 0; s < 30; ++s)
    e[s] = i, i += 1 << n[s];
}
function d2(n, e) {
  var t;
  for (t = 0; t < 7; ++t) n.table[t] = 0;
  for (n.table[7] = 24, n.table[8] = 152, n.table[9] = 112, t = 0; t < 24; ++t) n.trans[t] = 256 + t;
  for (t = 0; t < 144; ++t) n.trans[24 + t] = t;
  for (t = 0; t < 8; ++t) n.trans[168 + t] = 280 + t;
  for (t = 0; t < 112; ++t) n.trans[176 + t] = 144 + t;
  for (t = 0; t < 5; ++t) e.table[t] = 0;
  for (e.table[5] = 32, t = 0; t < 32; ++t) e.trans[t] = t;
}
var Sa = new Uint16Array(16);
function ys(n, e, t, r) {
  var s, i;
  for (s = 0; s < 16; ++s) n.table[s] = 0;
  for (s = 0; s < r; ++s) n.table[e[t + s]]++;
  for (n.table[0] = 0, i = 0, s = 0; s < 16; ++s)
    Sa[s] = i, i += n.table[s];
  for (s = 0; s < r; ++s)
    e[t + s] && (n.trans[Sa[e[t + s]]++] = s);
}
function x2(n) {
  n.bitcount-- || (n.tag = n.source[n.sourceIndex++], n.bitcount = 7);
  var e = n.tag & 1;
  return n.tag >>>= 1, e;
}
function P0(n, e, t) {
  if (!e)
    return t;
  for (; n.bitcount < 24; )
    n.tag |= n.source[n.sourceIndex++] << n.bitcount, n.bitcount += 8;
  var r = n.tag & 65535 >>> 16 - e;
  return n.tag >>>= e, n.bitcount -= e, r + t;
}
function ti(n, e) {
  for (; n.bitcount < 24; )
    n.tag |= n.source[n.sourceIndex++] << n.bitcount, n.bitcount += 8;
  var t = 0, r = 0, s = 0, i = n.tag;
  do
    r = 2 * r + (i & 1), i >>>= 1, ++s, t += e.table[s], r -= e.table[s];
  while (r >= 0);
  return n.tag = i, n.bitcount -= s, e.trans[t + r];
}
function b2(n, e, t) {
  var r, s, i, a, o, l;
  for (r = P0(n, 5, 257), s = P0(n, 5, 1), i = P0(n, 4, 4), a = 0; a < 19; ++a) y0[a] = 0;
  for (a = 0; a < i; ++a) {
    var f = P0(n, 3, 0);
    y0[h2[a]] = f;
  }
  for (ys(Ca, y0, 0, 19), o = 0; o < r + s; ) {
    var u = ti(n, Ca);
    switch (u) {
      case 16:
        var c = y0[o - 1];
        for (l = P0(n, 2, 3); l; --l)
          y0[o++] = c;
        break;
      case 17:
        for (l = P0(n, 3, 3); l; --l)
          y0[o++] = 0;
        break;
      case 18:
        for (l = P0(n, 7, 11); l; --l)
          y0[o++] = 0;
        break;
      default:
        y0[o++] = u;
        break;
    }
  }
  ys(e, y0, 0, r), ys(t, y0, r, s);
}
function ka(n, e, t) {
  for (; ; ) {
    var r = ti(n, e);
    if (r === 256)
      return Ti;
    if (r < 256)
      n.dest[n.destLen++] = r;
    else {
      var s, i, a, o;
      for (r -= 257, s = P0(n, Ii[r], Ei[r]), i = ti(n, t), a = n.destLen - P0(n, Vo[i], _o[i]), o = a; o < a + s; ++o)
        n.dest[n.destLen++] = n.dest[o];
    }
  }
}
function p2(n) {
  for (var e, t, r; n.bitcount > 8; )
    n.sourceIndex--, n.bitcount -= 8;
  if (e = n.source[n.sourceIndex + 1], e = 256 * e + n.source[n.sourceIndex], t = n.source[n.sourceIndex + 3], t = 256 * t + n.source[n.sourceIndex + 2], e !== (~t & 65535))
    return Go;
  for (n.sourceIndex += 4, r = e; r; --r)
    n.dest[n.destLen++] = n.source[n.sourceIndex++];
  return n.bitcount = 0, Ti;
}
function g2(n, e) {
  var t = new u2(n, e), r, s, i;
  do {
    switch (r = x2(t), s = P0(t, 2, 0), s) {
      case 0:
        i = p2(t);
        break;
      case 1:
        i = ka(t, Ho, Wo);
        break;
      case 2:
        b2(t, t.ltree, t.dtree), i = ka(t, t.ltree, t.dtree);
        break;
      default:
        i = Go;
    }
    if (i !== Ti)
      throw new Error("Data error");
  } while (!r);
  return t.destLen < t.dest.length ? typeof t.dest.slice == "function" ? t.dest.slice(0, t.destLen) : t.dest.subarray(0, t.destLen) : t.dest;
}
d2(Ho, Wo);
qo(Ii, Ei, 4, 3);
qo(Vo, _o, 2, 1);
Ii[28] = 0;
Ei[28] = 258;
var $o = g2;
const m2 = /* @__PURE__ */ Dt($o), A2 = new Uint8Array(new Uint32Array([305419896]).buffer)[0] === 18, Pa = (n, e, t) => {
  let r = n[e];
  n[e] = n[t], n[t] = r;
}, w2 = (n) => {
  const e = n.length;
  for (let t = 0; t < e; t += 4)
    Pa(n, t, t + 3), Pa(n, t + 1, t + 2);
}, v2 = (n) => {
  A2 && w2(n);
};
var y2 = {
  swap32LE: v2
};
const Ta = $o, { swap32LE: C2 } = y2, Fi = 11, It = 5, S2 = Fi - It, k2 = 65536 >> Fi, P2 = 1 << S2, T2 = P2 - 1, hn = 2, I2 = 1 << It, Cs = I2 - 1, Xo = 65536 >> It, E2 = 1024 >> It, F2 = Xo + E2, B2 = F2, O2 = 32, D2 = B2 + O2, M2 = 1 << hn;
class L2 {
  constructor(e) {
    const t = typeof e.readUInt32BE == "function" && typeof e.slice == "function";
    if (t || e instanceof Uint8Array) {
      let r;
      if (t)
        this.highStart = e.readUInt32LE(0), this.errorValue = e.readUInt32LE(4), r = e.readUInt32LE(8), e = e.slice(12);
      else {
        const s = new DataView(e.buffer);
        this.highStart = s.getUint32(0, !0), this.errorValue = s.getUint32(4, !0), r = s.getUint32(8, !0), e = e.subarray(12);
      }
      e = Ta(e, new Uint8Array(r)), e = Ta(e, new Uint8Array(r)), C2(e), this.data = new Uint32Array(e.buffer);
    } else
      ({ data: this.data, highStart: this.highStart, errorValue: this.errorValue } = e);
  }
  get(e) {
    let t;
    return e < 0 || e > 1114111 ? this.errorValue : e < 55296 || e > 56319 && e <= 65535 ? (t = (this.data[e >> It] << hn) + (e & Cs), this.data[t]) : e <= 65535 ? (t = (this.data[Xo + (e - 55296 >> It)] << hn) + (e & Cs), this.data[t]) : e < this.highStart ? (t = this.data[D2 - k2 + (e >> Fi)], t = this.data[t + (e >> It & T2)], t = (t << hn) + (e & Cs), this.data[t]) : this.data[this.data.length - M2];
  }
}
var R2 = L2;
const Ur = /* @__PURE__ */ Dt(R2);
function Mt(n) {
  return n && n.__esModule ? n.default : n;
}
var gt = {};
gt = JSON.parse('{"categories":["Cc","Zs","Po","Sc","Ps","Pe","Sm","Pd","Nd","Lu","Sk","Pc","Ll","So","Lo","Pi","Cf","No","Pf","Lt","Lm","Mn","Me","Mc","Nl","Zl","Zp","Cs","Co"],"combiningClasses":["Not_Reordered","Above","Above_Right","Below","Attached_Above_Right","Attached_Below","Overlay","Iota_Subscript","Double_Below","Double_Above","Below_Right","Above_Left","CCC10","CCC11","CCC12","CCC13","CCC14","CCC15","CCC16","CCC17","CCC18","CCC19","CCC20","CCC21","CCC22","CCC23","CCC24","CCC25","CCC30","CCC31","CCC32","CCC27","CCC28","CCC29","CCC33","CCC34","CCC35","CCC36","Nukta","Virama","CCC84","CCC91","CCC103","CCC107","CCC118","CCC122","CCC129","CCC130","CCC132","Attached_Above","Below_Left","Left","Kana_Voicing","CCC26","Right"],"scripts":["Common","Latin","Bopomofo","Inherited","Greek","Coptic","Cyrillic","Armenian","Hebrew","Arabic","Syriac","Thaana","Nko","Samaritan","Mandaic","Devanagari","Bengali","Gurmukhi","Gujarati","Oriya","Tamil","Telugu","Kannada","Malayalam","Sinhala","Thai","Lao","Tibetan","Myanmar","Georgian","Hangul","Ethiopic","Cherokee","Canadian_Aboriginal","Ogham","Runic","Tagalog","Hanunoo","Buhid","Tagbanwa","Khmer","Mongolian","Limbu","Tai_Le","New_Tai_Lue","Buginese","Tai_Tham","Balinese","Sundanese","Batak","Lepcha","Ol_Chiki","Braille","Glagolitic","Tifinagh","Han","Hiragana","Katakana","Yi","Lisu","Vai","Bamum","Syloti_Nagri","Phags_Pa","Saurashtra","Kayah_Li","Rejang","Javanese","Cham","Tai_Viet","Meetei_Mayek","null","Linear_B","Lycian","Carian","Old_Italic","Gothic","Old_Permic","Ugaritic","Old_Persian","Deseret","Shavian","Osmanya","Osage","Elbasan","Caucasian_Albanian","Linear_A","Cypriot","Imperial_Aramaic","Palmyrene","Nabataean","Hatran","Phoenician","Lydian","Meroitic_Hieroglyphs","Meroitic_Cursive","Kharoshthi","Old_South_Arabian","Old_North_Arabian","Manichaean","Avestan","Inscriptional_Parthian","Inscriptional_Pahlavi","Psalter_Pahlavi","Old_Turkic","Old_Hungarian","Hanifi_Rohingya","Old_Sogdian","Sogdian","Elymaic","Brahmi","Kaithi","Sora_Sompeng","Chakma","Mahajani","Sharada","Khojki","Multani","Khudawadi","Grantha","Newa","Tirhuta","Siddham","Modi","Takri","Ahom","Dogra","Warang_Citi","Nandinagari","Zanabazar_Square","Soyombo","Pau_Cin_Hau","Bhaiksuki","Marchen","Masaram_Gondi","Gunjala_Gondi","Makasar","Cuneiform","Egyptian_Hieroglyphs","Anatolian_Hieroglyphs","Mro","Bassa_Vah","Pahawh_Hmong","Medefaidrin","Miao","Tangut","Nushu","Duployan","SignWriting","Nyiakeng_Puachue_Hmong","Wancho","Mende_Kikakui","Adlam"],"eaw":["N","Na","A","W","H","F"]}');
const Bi = new Ur(Rr.toByteArray("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")), U2 = Math.log2 || ((n) => Math.log(n) / Math.LN2), qn = (n) => U2(n) + 1 | 0, N2 = qn((/* @__PURE__ */ Mt(gt)).categories.length - 1), jo = qn((/* @__PURE__ */ Mt(gt)).combiningClasses.length - 1), Oi = qn((/* @__PURE__ */ Mt(gt)).scripts.length - 1), Di = qn((/* @__PURE__ */ Mt(gt)).eaw.length - 1), Mi = 10, z2 = jo + Oi + Di + Mi, G2 = Oi + Di + Mi, H2 = Di + Mi, W2 = (1 << N2) - 1, V2 = (1 << jo) - 1, _2 = (1 << Oi) - 1;
function $n(n) {
  const e = Bi.get(n);
  return (/* @__PURE__ */ Mt(gt)).categories[e >> z2 & W2];
}
function q2(n) {
  const e = Bi.get(n);
  return (/* @__PURE__ */ Mt(gt)).combiningClasses[e >> G2 & V2];
}
function Yo(n) {
  const e = Bi.get(n);
  return (/* @__PURE__ */ Mt(gt)).scripts[e >> H2 & _2];
}
function Ia(n) {
  return $n(n) === "Nd";
}
function Ko(n) {
  const e = $n(n);
  return e === "Mn" || e === "Me" || e === "Mc";
}
var Ss = 1, ks = 0;
class $2 {
  constructor(e) {
    this.stateTable = e.stateTable, this.accepting = e.accepting, this.tags = e.tags;
  }
  /**
   * Returns an iterable object that yields pattern matches over the input sequence.
   * Matches are of the form [startIndex, endIndex, tags].
   */
  match(e) {
    var t = this;
    return {
      *[Symbol.iterator]() {
        for (var r = Ss, s = null, i = null, a = null, o = 0; o < e.length; o++) {
          var l = e[o];
          a = r, r = t.stateTable[r][l], r === ks && (s != null && i != null && i >= s && (yield [s, i, t.tags[a]]), r = t.stateTable[Ss][l], s = null), r !== ks && s == null && (s = o), t.accepting[r] && (i = o), r === ks && (r = Ss);
        }
        s != null && i != null && i >= s && (yield [s, i, t.tags[r]]);
      }
    };
  }
  /**
   * For each match over the input sequence, action functions matching
   * the tag definitions in the input pattern are called with the startIndex,
   * endIndex, and sub-match sequence.
   */
  apply(e, t) {
    for (var [r, s, i] of this.match(e))
      for (var a of i)
        typeof t[a] == "function" && t[a](r, s, e.slice(r, s + 1));
  }
}
var X2 = $2;
const Zo = /* @__PURE__ */ Dt(X2);
var Jo = { exports: {} };
(function(n) {
  var e = function() {
    function t(x, g) {
      return g != null && x instanceof g;
    }
    var r;
    try {
      r = Map;
    } catch {
      r = function() {
      };
    }
    var s;
    try {
      s = Set;
    } catch {
      s = function() {
      };
    }
    var i;
    try {
      i = Promise;
    } catch {
      i = function() {
      };
    }
    function a(x, g, m, v, E) {
      typeof g == "object" && (m = g.depth, v = g.prototype, E = g.includeNonEnumerable, g = g.circular);
      var C = [], y = [], A = typeof Buffer < "u";
      typeof g > "u" && (g = !0), typeof m > "u" && (m = 1 / 0);
      function k(p, D) {
        if (p === null)
          return null;
        if (D === 0)
          return p;
        var M, I;
        if (typeof p != "object")
          return p;
        if (t(p, r))
          M = new r();
        else if (t(p, s))
          M = new s();
        else if (t(p, i))
          M = new i(function(W, ee) {
            p.then(function(Z) {
              W(k(Z, D - 1));
            }, function(Z) {
              ee(k(Z, D - 1));
            });
          });
        else if (a.__isArray(p))
          M = [];
        else if (a.__isRegExp(p))
          M = new RegExp(p.source, c(p)), p.lastIndex && (M.lastIndex = p.lastIndex);
        else if (a.__isDate(p))
          M = new Date(p.getTime());
        else {
          if (A && Buffer.isBuffer(p))
            return Buffer.allocUnsafe ? M = Buffer.allocUnsafe(p.length) : M = new Buffer(p.length), p.copy(M), M;
          t(p, Error) ? M = Object.create(p) : typeof v > "u" ? (I = Object.getPrototypeOf(p), M = Object.create(I)) : (M = Object.create(v), I = v);
        }
        if (g) {
          var B = C.indexOf(p);
          if (B != -1)
            return y[B];
          C.push(p), y.push(M);
        }
        t(p, r) && p.forEach(function(W, ee) {
          var Z = k(ee, D - 1), ae = k(W, D - 1);
          M.set(Z, ae);
        }), t(p, s) && p.forEach(function(W) {
          var ee = k(W, D - 1);
          M.add(ee);
        });
        for (var N in p) {
          var V;
          I && (V = Object.getOwnPropertyDescriptor(I, N)), !(V && V.set == null) && (M[N] = k(p[N], D - 1));
        }
        if (Object.getOwnPropertySymbols)
          for (var j = Object.getOwnPropertySymbols(p), N = 0; N < j.length; N++) {
            var J = j[N], q = Object.getOwnPropertyDescriptor(p, J);
            q && !q.enumerable && !E || (M[J] = k(p[J], D - 1), q.enumerable || Object.defineProperty(M, J, {
              enumerable: !1
            }));
          }
        if (E)
          for (var $ = Object.getOwnPropertyNames(p), N = 0; N < $.length; N++) {
            var K = $[N], q = Object.getOwnPropertyDescriptor(p, K);
            q && q.enumerable || (M[K] = k(p[K], D - 1), Object.defineProperty(M, K, {
              enumerable: !1
            }));
          }
        return M;
      }
      return k(x, m);
    }
    a.clonePrototype = function(g) {
      if (g === null)
        return null;
      var m = function() {
      };
      return m.prototype = g, new m();
    };
    function o(x) {
      return Object.prototype.toString.call(x);
    }
    a.__objToStr = o;
    function l(x) {
      return typeof x == "object" && o(x) === "[object Date]";
    }
    a.__isDate = l;
    function f(x) {
      return typeof x == "object" && o(x) === "[object Array]";
    }
    a.__isArray = f;
    function u(x) {
      return typeof x == "object" && o(x) === "[object RegExp]";
    }
    a.__isRegExp = u;
    function c(x) {
      var g = "";
      return x.global && (g += "g"), x.ignoreCase && (g += "i"), x.multiline && (g += "m"), g;
    }
    return a.__getRegExpFlags = c, a;
  }();
  n.exports && (n.exports = e);
})(Jo);
var j2 = Jo.exports;
const Ps = /* @__PURE__ */ Dt(j2);
var xr = {}, Pn = {};
function Qo(n) {
  this.buffer = n, this.pos = 0;
}
Qo.prototype.read = function(n, e, t) {
  this.pos + t > this.buffer.length && (t = this.buffer.length - this.pos);
  for (var r = 0; r < t; r++)
    n[e + r] = this.buffer[this.pos + r];
  return this.pos += t, t;
};
Pn.BrotliInput = Qo;
function el(n) {
  this.buffer = n, this.pos = 0;
}
el.prototype.write = function(n, e) {
  if (this.pos + e > this.buffer.length)
    throw new Error("Output buffer is not large enough");
  return this.buffer.set(n.subarray(0, e), this.pos), this.pos += e, e;
};
Pn.BrotliOutput = el;
var St = 4096, Y2 = 2 * St + 32, tl = 2 * St - 1, K2 = new Uint32Array([
  0,
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255,
  511,
  1023,
  2047,
  4095,
  8191,
  16383,
  32767,
  65535,
  131071,
  262143,
  524287,
  1048575,
  2097151,
  4194303,
  8388607,
  16777215
]);
function Lt(n) {
  this.buf_ = new Uint8Array(Y2), this.input_ = n, this.reset();
}
Lt.READ_SIZE = St;
Lt.IBUF_MASK = tl;
Lt.prototype.reset = function() {
  this.buf_ptr_ = 0, this.val_ = 0, this.pos_ = 0, this.bit_pos_ = 0, this.bit_end_pos_ = 0, this.eos_ = 0, this.readMoreInput();
  for (var n = 0; n < 4; n++)
    this.val_ |= this.buf_[this.pos_] << 8 * n, ++this.pos_;
  return this.bit_end_pos_ > 0;
};
Lt.prototype.readMoreInput = function() {
  if (!(this.bit_end_pos_ > 256))
    if (this.eos_) {
      if (this.bit_pos_ > this.bit_end_pos_)
        throw new Error("Unexpected end of input " + this.bit_pos_ + " " + this.bit_end_pos_);
    } else {
      var n = this.buf_ptr_, e = this.input_.read(this.buf_, n, St);
      if (e < 0)
        throw new Error("Unexpected end of input");
      if (e < St) {
        this.eos_ = 1;
        for (var t = 0; t < 32; t++)
          this.buf_[n + e + t] = 0;
      }
      if (n === 0) {
        for (var t = 0; t < 32; t++)
          this.buf_[(St << 1) + t] = this.buf_[t];
        this.buf_ptr_ = St;
      } else
        this.buf_ptr_ = 0;
      this.bit_end_pos_ += e << 3;
    }
};
Lt.prototype.fillBitWindow = function() {
  for (; this.bit_pos_ >= 8; )
    this.val_ >>>= 8, this.val_ |= this.buf_[this.pos_ & tl] << 24, ++this.pos_, this.bit_pos_ = this.bit_pos_ - 8 >>> 0, this.bit_end_pos_ = this.bit_end_pos_ - 8 >>> 0;
};
Lt.prototype.readBits = function(n) {
  32 - this.bit_pos_ < n && this.fillBitWindow();
  var e = this.val_ >>> this.bit_pos_ & K2[n];
  return this.bit_pos_ += n, e;
};
var Z2 = Lt, K0 = {}, Ts = {}, Is, Ea;
function J2() {
  return Ea || (Ea = 1, Is = "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"), Is;
}
var Fa;
function Q2() {
  if (Fa) return Ts;
  Fa = 1;
  var n = Rr;
  return Ts.init = function() {
    var e = nl().BrotliDecompressBuffer, t = n.toByteArray(J2());
    return e(t);
  }, Ts;
}
var Ba;
function rl() {
  if (Ba) return K0;
  Ba = 1;
  var n = Q2();
  return K0.init = function() {
    K0.dictionary = n.init();
  }, K0.offsetsByLength = new Uint32Array([
    0,
    0,
    0,
    0,
    0,
    4096,
    9216,
    21504,
    35840,
    44032,
    53248,
    63488,
    74752,
    87040,
    93696,
    100864,
    104704,
    106752,
    108928,
    113536,
    115968,
    118528,
    119872,
    121280,
    122016
  ]), K0.sizeBitsByLength = new Uint8Array([
    0,
    0,
    0,
    0,
    10,
    10,
    11,
    11,
    10,
    10,
    10,
    10,
    10,
    9,
    9,
    8,
    7,
    7,
    8,
    7,
    7,
    6,
    6,
    5,
    5
  ]), K0.minDictionaryWordLength = 4, K0.maxDictionaryWordLength = 24, K0;
}
var Tn = {};
function Yt(n, e) {
  this.bits = n, this.value = e;
}
Tn.HuffmanCode = Yt;
var _t = 15;
function Oa(n, e) {
  for (var t = 1 << e - 1; n & t; )
    t >>= 1;
  return (n & t - 1) + t;
}
function Da(n, e, t, r, s) {
  do
    r -= t, n[e + r] = new Yt(s.bits, s.value);
  while (r > 0);
}
function ef(n, e, t) {
  for (var r = 1 << e - t; e < _t && (r -= n[e], !(r <= 0)); )
    ++e, r <<= 1;
  return e - t;
}
Tn.BrotliBuildHuffmanTable = function(n, e, t, r, s) {
  var i = e, a, o, l, f, u, c, x, g, m, v, E, C = new Int32Array(_t + 1), y = new Int32Array(_t + 1);
  for (E = new Int32Array(s), l = 0; l < s; l++)
    C[r[l]]++;
  for (y[1] = 0, o = 1; o < _t; o++)
    y[o + 1] = y[o] + C[o];
  for (l = 0; l < s; l++)
    r[l] !== 0 && (E[y[r[l]]++] = l);
  if (g = t, m = 1 << g, v = m, y[_t] === 1) {
    for (f = 0; f < v; ++f)
      n[e + f] = new Yt(0, E[0] & 65535);
    return v;
  }
  for (f = 0, l = 0, o = 1, u = 2; o <= t; ++o, u <<= 1)
    for (; C[o] > 0; --C[o])
      a = new Yt(o & 255, E[l++] & 65535), Da(n, e + f, u, m, a), f = Oa(f, o);
  for (x = v - 1, c = -1, o = t + 1, u = 2; o <= _t; ++o, u <<= 1)
    for (; C[o] > 0; --C[o])
      (f & x) !== c && (e += m, g = ef(C, o, t), m = 1 << g, v += m, c = f & x, n[i + c] = new Yt(g + t & 255, e - i - c & 65535)), a = new Yt(o - t & 255, E[l++] & 65535), Da(n, e + (f >> t), u, m, a), f = Oa(f, o);
  return v;
};
var Li = {};
Li.lookup = new Uint8Array([
  /* CONTEXT_UTF8, last byte. */
  /* ASCII range. */
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  4,
  4,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  8,
  12,
  16,
  12,
  12,
  20,
  12,
  16,
  24,
  28,
  12,
  12,
  32,
  12,
  36,
  12,
  44,
  44,
  44,
  44,
  44,
  44,
  44,
  44,
  44,
  44,
  32,
  32,
  24,
  40,
  28,
  12,
  12,
  48,
  52,
  52,
  52,
  48,
  52,
  52,
  52,
  48,
  52,
  52,
  52,
  52,
  52,
  48,
  52,
  52,
  52,
  52,
  52,
  48,
  52,
  52,
  52,
  52,
  52,
  24,
  12,
  28,
  12,
  12,
  12,
  56,
  60,
  60,
  60,
  56,
  60,
  60,
  60,
  56,
  60,
  60,
  60,
  60,
  60,
  56,
  60,
  60,
  60,
  60,
  60,
  56,
  60,
  60,
  60,
  60,
  60,
  24,
  12,
  28,
  12,
  0,
  /* UTF8 continuation byte range. */
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  /* UTF8 lead byte range. */
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  2,
  3,
  /* CONTEXT_UTF8 second last byte. */
  /* ASCII range. */
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  1,
  1,
  1,
  1,
  1,
  1,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  1,
  1,
  1,
  1,
  0,
  /* UTF8 continuation byte range. */
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  /* UTF8 lead byte range. */
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  /* CONTEXT_SIGNED, second last byte. */
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  7,
  /* CONTEXT_SIGNED, last byte, same as the above values shifted by 3 bits. */
  0,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  32,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  40,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  48,
  56,
  /* CONTEXT_LSB6, last byte. */
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  /* CONTEXT_MSB6, last byte. */
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  6,
  6,
  6,
  6,
  7,
  7,
  7,
  7,
  8,
  8,
  8,
  8,
  9,
  9,
  9,
  9,
  10,
  10,
  10,
  10,
  11,
  11,
  11,
  11,
  12,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  14,
  14,
  14,
  14,
  15,
  15,
  15,
  15,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  22,
  22,
  22,
  22,
  23,
  23,
  23,
  23,
  24,
  24,
  24,
  24,
  25,
  25,
  25,
  25,
  26,
  26,
  26,
  26,
  27,
  27,
  27,
  27,
  28,
  28,
  28,
  28,
  29,
  29,
  29,
  29,
  30,
  30,
  30,
  30,
  31,
  31,
  31,
  31,
  32,
  32,
  32,
  32,
  33,
  33,
  33,
  33,
  34,
  34,
  34,
  34,
  35,
  35,
  35,
  35,
  36,
  36,
  36,
  36,
  37,
  37,
  37,
  37,
  38,
  38,
  38,
  38,
  39,
  39,
  39,
  39,
  40,
  40,
  40,
  40,
  41,
  41,
  41,
  41,
  42,
  42,
  42,
  42,
  43,
  43,
  43,
  43,
  44,
  44,
  44,
  44,
  45,
  45,
  45,
  45,
  46,
  46,
  46,
  46,
  47,
  47,
  47,
  47,
  48,
  48,
  48,
  48,
  49,
  49,
  49,
  49,
  50,
  50,
  50,
  50,
  51,
  51,
  51,
  51,
  52,
  52,
  52,
  52,
  53,
  53,
  53,
  53,
  54,
  54,
  54,
  54,
  55,
  55,
  55,
  55,
  56,
  56,
  56,
  56,
  57,
  57,
  57,
  57,
  58,
  58,
  58,
  58,
  59,
  59,
  59,
  59,
  60,
  60,
  60,
  60,
  61,
  61,
  61,
  61,
  62,
  62,
  62,
  62,
  63,
  63,
  63,
  63,
  /* CONTEXT_{M,L}SB6, second last byte, */
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
]);
Li.lookupOffsets = new Uint16Array([
  /* CONTEXT_LSB6 */
  1024,
  1536,
  /* CONTEXT_MSB6 */
  1280,
  1536,
  /* CONTEXT_UTF8 */
  0,
  256,
  /* CONTEXT_SIGNED */
  768,
  512
]);
var sr = {};
function _(n, e) {
  this.offset = n, this.nbits = e;
}
sr.kBlockLengthPrefixCode = [
  new _(1, 2),
  new _(5, 2),
  new _(9, 2),
  new _(13, 2),
  new _(17, 3),
  new _(25, 3),
  new _(33, 3),
  new _(41, 3),
  new _(49, 4),
  new _(65, 4),
  new _(81, 4),
  new _(97, 4),
  new _(113, 5),
  new _(145, 5),
  new _(177, 5),
  new _(209, 5),
  new _(241, 6),
  new _(305, 6),
  new _(369, 7),
  new _(497, 8),
  new _(753, 9),
  new _(1265, 10),
  new _(2289, 11),
  new _(4337, 12),
  new _(8433, 13),
  new _(16625, 24)
];
sr.kInsertLengthPrefixCode = [
  new _(0, 0),
  new _(1, 0),
  new _(2, 0),
  new _(3, 0),
  new _(4, 0),
  new _(5, 0),
  new _(6, 1),
  new _(8, 1),
  new _(10, 2),
  new _(14, 2),
  new _(18, 3),
  new _(26, 3),
  new _(34, 4),
  new _(50, 4),
  new _(66, 5),
  new _(98, 5),
  new _(130, 6),
  new _(194, 7),
  new _(322, 8),
  new _(578, 9),
  new _(1090, 10),
  new _(2114, 12),
  new _(6210, 14),
  new _(22594, 24)
];
sr.kCopyLengthPrefixCode = [
  new _(2, 0),
  new _(3, 0),
  new _(4, 0),
  new _(5, 0),
  new _(6, 0),
  new _(7, 0),
  new _(8, 0),
  new _(9, 0),
  new _(10, 1),
  new _(12, 1),
  new _(14, 2),
  new _(18, 2),
  new _(22, 3),
  new _(30, 3),
  new _(38, 4),
  new _(54, 4),
  new _(70, 5),
  new _(102, 5),
  new _(134, 6),
  new _(198, 7),
  new _(326, 8),
  new _(582, 9),
  new _(1094, 10),
  new _(2118, 24)
];
sr.kInsertRangeLut = [
  0,
  0,
  8,
  8,
  0,
  16,
  8,
  16,
  16
];
sr.kCopyRangeLut = [
  0,
  8,
  0,
  8,
  16,
  0,
  16,
  8,
  16
];
var br = {}, Ma;
function tf() {
  if (Ma) return br;
  Ma = 1;
  var n = rl(), e = 0, t = 1, r = 2, s = 3, i = 4, a = 5, o = 6, l = 7, f = 8, u = 9, c = 10, x = 11, g = 12, m = 13, v = 14, E = 15, C = 16, y = 17, A = 18, k = 20;
  function p(I, B, N) {
    this.prefix = new Uint8Array(I.length), this.transform = B, this.suffix = new Uint8Array(N.length);
    for (var V = 0; V < I.length; V++)
      this.prefix[V] = I.charCodeAt(V);
    for (var V = 0; V < N.length; V++)
      this.suffix[V] = N.charCodeAt(V);
  }
  var D = [
    new p("", e, ""),
    new p("", e, " "),
    new p(" ", e, " "),
    new p("", g, ""),
    new p("", c, " "),
    new p("", e, " the "),
    new p(" ", e, ""),
    new p("s ", e, " "),
    new p("", e, " of "),
    new p("", c, ""),
    new p("", e, " and "),
    new p("", m, ""),
    new p("", t, ""),
    new p(", ", e, " "),
    new p("", e, ", "),
    new p(" ", c, " "),
    new p("", e, " in "),
    new p("", e, " to "),
    new p("e ", e, " "),
    new p("", e, '"'),
    new p("", e, "."),
    new p("", e, '">'),
    new p("", e, `
`),
    new p("", s, ""),
    new p("", e, "]"),
    new p("", e, " for "),
    new p("", v, ""),
    new p("", r, ""),
    new p("", e, " a "),
    new p("", e, " that "),
    new p(" ", c, ""),
    new p("", e, ". "),
    new p(".", e, ""),
    new p(" ", e, ", "),
    new p("", E, ""),
    new p("", e, " with "),
    new p("", e, "'"),
    new p("", e, " from "),
    new p("", e, " by "),
    new p("", C, ""),
    new p("", y, ""),
    new p(" the ", e, ""),
    new p("", i, ""),
    new p("", e, ". The "),
    new p("", x, ""),
    new p("", e, " on "),
    new p("", e, " as "),
    new p("", e, " is "),
    new p("", l, ""),
    new p("", t, "ing "),
    new p("", e, `
	`),
    new p("", e, ":"),
    new p(" ", e, ". "),
    new p("", e, "ed "),
    new p("", k, ""),
    new p("", A, ""),
    new p("", o, ""),
    new p("", e, "("),
    new p("", c, ", "),
    new p("", f, ""),
    new p("", e, " at "),
    new p("", e, "ly "),
    new p(" the ", e, " of "),
    new p("", a, ""),
    new p("", u, ""),
    new p(" ", c, ", "),
    new p("", c, '"'),
    new p(".", e, "("),
    new p("", x, " "),
    new p("", c, '">'),
    new p("", e, '="'),
    new p(" ", e, "."),
    new p(".com/", e, ""),
    new p(" the ", e, " of the "),
    new p("", c, "'"),
    new p("", e, ". This "),
    new p("", e, ","),
    new p(".", e, " "),
    new p("", c, "("),
    new p("", c, "."),
    new p("", e, " not "),
    new p(" ", e, '="'),
    new p("", e, "er "),
    new p(" ", x, " "),
    new p("", e, "al "),
    new p(" ", x, ""),
    new p("", e, "='"),
    new p("", x, '"'),
    new p("", c, ". "),
    new p(" ", e, "("),
    new p("", e, "ful "),
    new p(" ", c, ". "),
    new p("", e, "ive "),
    new p("", e, "less "),
    new p("", x, "'"),
    new p("", e, "est "),
    new p(" ", c, "."),
    new p("", x, '">'),
    new p(" ", e, "='"),
    new p("", c, ","),
    new p("", e, "ize "),
    new p("", x, "."),
    new p("Â ", e, ""),
    new p(" ", e, ","),
    new p("", c, '="'),
    new p("", x, '="'),
    new p("", e, "ous "),
    new p("", x, ", "),
    new p("", c, "='"),
    new p(" ", c, ","),
    new p(" ", x, '="'),
    new p(" ", x, ", "),
    new p("", x, ","),
    new p("", x, "("),
    new p("", x, ". "),
    new p(" ", x, "."),
    new p("", x, "='"),
    new p(" ", x, ". "),
    new p(" ", c, '="'),
    new p(" ", x, "='"),
    new p(" ", c, "='")
  ];
  br.kTransforms = D, br.kNumTransforms = D.length;
  function M(I, B) {
    return I[B] < 192 ? (I[B] >= 97 && I[B] <= 122 && (I[B] ^= 32), 1) : I[B] < 224 ? (I[B + 1] ^= 32, 2) : (I[B + 2] ^= 5, 3);
  }
  return br.transformDictionaryWord = function(I, B, N, V, j) {
    var J = D[j].prefix, q = D[j].suffix, $ = D[j].transform, K = $ < g ? 0 : $ - (g - 1), W = 0, ee = B, Z;
    K > V && (K = V);
    for (var ae = 0; ae < J.length; )
      I[B++] = J[ae++];
    for (N += K, V -= K, $ <= u && (V -= $), W = 0; W < V; W++)
      I[B++] = n.dictionary[N + W];
    if (Z = B - V, $ === c)
      M(I, Z);
    else if ($ === x)
      for (; V > 0; ) {
        var be = M(I, Z);
        Z += be, V -= be;
      }
    for (var ge = 0; ge < q.length; )
      I[B++] = q[ge++];
    return B - ee;
  }, br;
}
var La;
function nl() {
  if (La) return xr;
  La = 1;
  var n = Pn.BrotliInput, e = Pn.BrotliOutput, t = Z2, r = rl(), s = Tn.HuffmanCode, i = Tn.BrotliBuildHuffmanTable, a = Li, o = sr, l = tf(), f = 8, u = 16, c = 256, x = 704, g = 26, m = 6, v = 2, E = 8, C = 255, y = 1080, A = 18, k = new Uint8Array([
    1,
    2,
    3,
    4,
    0,
    5,
    17,
    6,
    16,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15
  ]), p = 16, D = new Uint8Array([
    3,
    2,
    1,
    0,
    3,
    3,
    3,
    3,
    3,
    3,
    2,
    2,
    2,
    2,
    2,
    2
  ]), M = new Int8Array([
    0,
    0,
    0,
    0,
    -1,
    1,
    -2,
    2,
    -3,
    3,
    -1,
    1,
    -2,
    2,
    -3,
    3
  ]), I = new Uint16Array([
    256,
    402,
    436,
    468,
    500,
    534,
    566,
    598,
    630,
    662,
    694,
    726,
    758,
    790,
    822,
    854,
    886,
    920,
    952,
    984,
    1016,
    1048,
    1080
  ]);
  function B(z) {
    var R;
    return z.readBits(1) === 0 ? 16 : (R = z.readBits(3), R > 0 ? 17 + R : (R = z.readBits(3), R > 0 ? 8 + R : 17));
  }
  function N(z) {
    if (z.readBits(1)) {
      var R = z.readBits(3);
      return R === 0 ? 1 : z.readBits(R) + (1 << R);
    }
    return 0;
  }
  function V() {
    this.meta_block_length = 0, this.input_end = 0, this.is_uncompressed = 0, this.is_metadata = !1;
  }
  function j(z) {
    var R = new V(), L, O, Y;
    if (R.input_end = z.readBits(1), R.input_end && z.readBits(1))
      return R;
    if (L = z.readBits(2) + 4, L === 7) {
      if (R.is_metadata = !0, z.readBits(1) !== 0)
        throw new Error("Invalid reserved bit");
      if (O = z.readBits(2), O === 0)
        return R;
      for (Y = 0; Y < O; Y++) {
        var Q = z.readBits(8);
        if (Y + 1 === O && O > 1 && Q === 0)
          throw new Error("Invalid size byte");
        R.meta_block_length |= Q << Y * 8;
      }
    } else
      for (Y = 0; Y < L; ++Y) {
        var te = z.readBits(4);
        if (Y + 1 === L && L > 4 && te === 0)
          throw new Error("Invalid size nibble");
        R.meta_block_length |= te << Y * 4;
      }
    return ++R.meta_block_length, !R.input_end && !R.is_metadata && (R.is_uncompressed = z.readBits(1)), R;
  }
  function J(z, R, L) {
    var O;
    return L.fillBitWindow(), R += L.val_ >>> L.bit_pos_ & C, O = z[R].bits - E, O > 0 && (L.bit_pos_ += E, R += z[R].value, R += L.val_ >>> L.bit_pos_ & (1 << O) - 1), L.bit_pos_ += z[R].bits, z[R].value;
  }
  function q(z, R, L, O) {
    for (var Y = 0, Q = f, te = 0, se = 0, he = 32768, oe = [], X = 0; X < 32; X++)
      oe.push(new s(0, 0));
    for (i(oe, 0, 5, z, A); Y < R && he > 0; ) {
      var we = 0, Ge;
      if (O.readMoreInput(), O.fillBitWindow(), we += O.val_ >>> O.bit_pos_ & 31, O.bit_pos_ += oe[we].bits, Ge = oe[we].value & 255, Ge < u)
        te = 0, L[Y++] = Ge, Ge !== 0 && (Q = Ge, he -= 32768 >> Ge);
      else {
        var s0 = Ge - 14, Ee, Ne, Re = 0;
        if (Ge === u && (Re = Q), se !== Re && (te = 0, se = Re), Ee = te, te > 0 && (te -= 2, te <<= s0), te += O.readBits(s0) + 3, Ne = te - Ee, Y + Ne > R)
          throw new Error("[ReadHuffmanCodeLengths] symbol + repeat_delta > num_symbols");
        for (var Qe = 0; Qe < Ne; Qe++)
          L[Y + Qe] = se;
        Y += Ne, se !== 0 && (he -= Ne << 15 - se);
      }
    }
    if (he !== 0)
      throw new Error("[ReadHuffmanCodeLengths] space = " + he);
    for (; Y < R; Y++)
      L[Y] = 0;
  }
  function $(z, R, L, O) {
    var Y = 0, Q, te = new Uint8Array(z);
    if (O.readMoreInput(), Q = O.readBits(2), Q === 1) {
      for (var se, he = z - 1, oe = 0, X = new Int32Array(4), we = O.readBits(2) + 1; he; )
        he >>= 1, ++oe;
      for (se = 0; se < we; ++se)
        X[se] = O.readBits(oe) % z, te[X[se]] = 2;
      switch (te[X[0]] = 1, we) {
        case 1:
          break;
        case 3:
          if (X[0] === X[1] || X[0] === X[2] || X[1] === X[2])
            throw new Error("[ReadHuffmanCode] invalid symbols");
          break;
        case 2:
          if (X[0] === X[1])
            throw new Error("[ReadHuffmanCode] invalid symbols");
          te[X[1]] = 1;
          break;
        case 4:
          if (X[0] === X[1] || X[0] === X[2] || X[0] === X[3] || X[1] === X[2] || X[1] === X[3] || X[2] === X[3])
            throw new Error("[ReadHuffmanCode] invalid symbols");
          O.readBits(1) ? (te[X[2]] = 3, te[X[3]] = 3) : te[X[0]] = 2;
          break;
      }
    } else {
      var se, Ge = new Uint8Array(A), s0 = 32, Ee = 0, Ne = [
        new s(2, 0),
        new s(2, 4),
        new s(2, 3),
        new s(3, 2),
        new s(2, 0),
        new s(2, 4),
        new s(2, 3),
        new s(4, 1),
        new s(2, 0),
        new s(2, 4),
        new s(2, 3),
        new s(3, 2),
        new s(2, 0),
        new s(2, 4),
        new s(2, 3),
        new s(4, 5)
      ];
      for (se = Q; se < A && s0 > 0; ++se) {
        var Re = k[se], Qe = 0, c0;
        O.fillBitWindow(), Qe += O.val_ >>> O.bit_pos_ & 15, O.bit_pos_ += Ne[Qe].bits, c0 = Ne[Qe].value, Ge[Re] = c0, c0 !== 0 && (s0 -= 32 >> c0, ++Ee);
      }
      if (!(Ee === 1 || s0 === 0))
        throw new Error("[ReadHuffmanCode] invalid num_codes or space");
      q(Ge, z, te, O);
    }
    if (Y = i(R, L, E, te, z), Y === 0)
      throw new Error("[ReadHuffmanCode] BuildHuffmanTable failed: ");
    return Y;
  }
  function K(z, R, L) {
    var O, Y;
    return O = J(z, R, L), Y = o.kBlockLengthPrefixCode[O].nbits, o.kBlockLengthPrefixCode[O].offset + L.readBits(Y);
  }
  function W(z, R, L) {
    var O;
    return z < p ? (L += D[z], L &= 3, O = R[L] + M[z]) : O = z - p + 1, O;
  }
  function ee(z, R) {
    for (var L = z[R], O = R; O; --O) z[O] = z[O - 1];
    z[0] = L;
  }
  function Z(z, R) {
    var L = new Uint8Array(256), O;
    for (O = 0; O < 256; ++O)
      L[O] = O;
    for (O = 0; O < R; ++O) {
      var Y = z[O];
      z[O] = L[Y], Y && ee(L, Y);
    }
  }
  function ae(z, R) {
    this.alphabet_size = z, this.num_htrees = R, this.codes = new Array(R + R * I[z + 31 >>> 5]), this.htrees = new Uint32Array(R);
  }
  ae.prototype.decode = function(z) {
    var R, L, O = 0;
    for (R = 0; R < this.num_htrees; ++R)
      this.htrees[R] = O, L = $(this.alphabet_size, this.codes, O, z), O += L;
  };
  function be(z, R) {
    var L = { num_htrees: null, context_map: null }, O, Y = 0, Q, te;
    R.readMoreInput();
    var se = L.num_htrees = N(R) + 1, he = L.context_map = new Uint8Array(z);
    if (se <= 1)
      return L;
    for (O = R.readBits(1), O && (Y = R.readBits(4) + 1), Q = [], te = 0; te < y; te++)
      Q[te] = new s(0, 0);
    for ($(se + Y, Q, 0, R), te = 0; te < z; ) {
      var oe;
      if (R.readMoreInput(), oe = J(Q, 0, R), oe === 0)
        he[te] = 0, ++te;
      else if (oe <= Y)
        for (var X = 1 + (1 << oe) + R.readBits(oe); --X; ) {
          if (te >= z)
            throw new Error("[DecodeContextMap] i >= context_map_size");
          he[te] = 0, ++te;
        }
      else
        he[te] = oe - Y, ++te;
    }
    return R.readBits(1) && Z(he, z), L;
  }
  function ge(z, R, L, O, Y, Q, te) {
    var se = L * 2, he = L, oe = J(R, L * y, te), X;
    oe === 0 ? X = Y[se + (Q[he] & 1)] : oe === 1 ? X = Y[se + (Q[he] - 1 & 1)] + 1 : X = oe - 2, X >= z && (X -= z), O[L] = X, Y[se + (Q[he] & 1)] = X, ++Q[he];
  }
  function Be(z, R, L, O, Y, Q) {
    var te = Y + 1, se = L & Y, he = Q.pos_ & t.IBUF_MASK, oe;
    if (R < 8 || Q.bit_pos_ + (R << 3) < Q.bit_end_pos_) {
      for (; R-- > 0; )
        Q.readMoreInput(), O[se++] = Q.readBits(8), se === te && (z.write(O, te), se = 0);
      return;
    }
    if (Q.bit_end_pos_ < 32)
      throw new Error("[CopyUncompressedBlockToOutput] br.bit_end_pos_ < 32");
    for (; Q.bit_pos_ < 32; )
      O[se] = Q.val_ >>> Q.bit_pos_, Q.bit_pos_ += 8, ++se, --R;
    if (oe = Q.bit_end_pos_ - Q.bit_pos_ >> 3, he + oe > t.IBUF_MASK) {
      for (var X = t.IBUF_MASK + 1 - he, we = 0; we < X; we++)
        O[se + we] = Q.buf_[he + we];
      oe -= X, se += X, R -= X, he = 0;
    }
    for (var we = 0; we < oe; we++)
      O[se + we] = Q.buf_[he + we];
    if (se += oe, R -= oe, se >= te) {
      z.write(O, te), se -= te;
      for (var we = 0; we < se; we++)
        O[we] = O[te + we];
    }
    for (; se + R >= te; ) {
      if (oe = te - se, Q.input_.read(O, se, oe) < oe)
        throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");
      z.write(O, te), R -= oe, se = 0;
    }
    if (Q.input_.read(O, se, R) < R)
      throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");
    Q.reset();
  }
  function Oe(z) {
    var R = z.bit_pos_ + 7 & -8, L = z.readBits(R - z.bit_pos_);
    return L == 0;
  }
  function Ae(z) {
    var R = new n(z), L = new t(R);
    B(L);
    var O = j(L);
    return O.meta_block_length;
  }
  xr.BrotliDecompressedSize = Ae;
  function Le(z, R) {
    var L = new n(z);
    R == null && (R = Ae(z));
    var O = new Uint8Array(R), Y = new e(O);
    return qe(L, Y), Y.pos < Y.buffer.length && (Y.buffer = Y.buffer.subarray(0, Y.pos)), Y.buffer;
  }
  xr.BrotliDecompressBuffer = Le;
  function qe(z, R) {
    var L, O = 0, Y = 0, Q = 0, te, se = 0, he, oe, X, we, Ge = [16, 15, 11, 4], s0 = 0, Ee = 0, Ne = 0, Re = [new ae(0, 0), new ae(0, 0), new ae(0, 0)], Qe, c0, de, fc = 128 + t.READ_SIZE;
    de = new t(z), Q = B(de), te = (1 << Q) - 16, he = 1 << Q, oe = he - 1, X = new Uint8Array(he + fc + r.maxDictionaryWordLength), we = he, Qe = [], c0 = [];
    for (var Wr = 0; Wr < 3 * y; Wr++)
      Qe[Wr] = new s(0, 0), c0[Wr] = new s(0, 0);
    for (; !Y; ) {
      var He = 0, Yi, v0 = [1 << 28, 1 << 28, 1 << 28], j0 = [0], d0 = [1, 1, 1], as = [0, 1, 0, 1, 0, 1], Vr = [0], Rt, or, Ki, Zi, Ji = null, _r = null, Qi, ea = null, ta, ra = 0, os = null, na = 0, sa = 0, ls = null, ia = 0, cs = 0, fs = 0, Ut, us;
      for (L = 0; L < 3; ++L)
        Re[L].codes = null, Re[L].htrees = null;
      de.readMoreInput();
      var qr = j(de);
      if (He = qr.meta_block_length, O + He > R.buffer.length) {
        var aa = new Uint8Array(O + He);
        aa.set(R.buffer), R.buffer = aa;
      }
      if (Y = qr.input_end, Yi = qr.is_uncompressed, qr.is_metadata) {
        for (Oe(de); He > 0; --He)
          de.readMoreInput(), de.readBits(8);
        continue;
      }
      if (He !== 0) {
        if (Yi) {
          de.bit_pos_ = de.bit_pos_ + 7 & -8, Be(
            R,
            He,
            O,
            X,
            oe,
            de
          ), O += He;
          continue;
        }
        for (L = 0; L < 3; ++L)
          d0[L] = N(de) + 1, d0[L] >= 2 && ($(d0[L] + 2, Qe, L * y, de), $(g, c0, L * y, de), v0[L] = K(c0, L * y, de), Vr[L] = 1);
        for (de.readMoreInput(), Rt = de.readBits(2), or = p + (de.readBits(4) << Rt), Ki = (1 << Rt) - 1, Zi = or + (48 << Rt), _r = new Uint8Array(d0[0]), L = 0; L < d0[0]; ++L)
          de.readMoreInput(), _r[L] = de.readBits(2) << 1;
        var oa = be(d0[0] << m, de);
        Qi = oa.num_htrees, Ji = oa.context_map;
        var la = be(d0[2] << v, de);
        for (ta = la.num_htrees, ea = la.context_map, Re[0] = new ae(c, Qi), Re[1] = new ae(x, d0[1]), Re[2] = new ae(Zi, ta), L = 0; L < 3; ++L)
          Re[L].decode(de);
        for (os = 0, ls = 0, Ut = _r[j0[0]], cs = a.lookupOffsets[Ut], fs = a.lookupOffsets[Ut + 1], us = Re[1].htrees[0]; He > 0; ) {
          var $r, lr, hs, ds, xs, e0, i0, R0, cr, Nt, fr;
          for (de.readMoreInput(), v0[1] === 0 && (ge(
            d0[1],
            Qe,
            1,
            j0,
            as,
            Vr,
            de
          ), v0[1] = K(c0, y, de), us = Re[1].htrees[j0[1]]), --v0[1], $r = J(Re[1].codes, us, de), lr = $r >> 6, lr >= 2 ? (lr -= 2, i0 = -1) : i0 = 0, hs = o.kInsertRangeLut[lr] + ($r >> 3 & 7), ds = o.kCopyRangeLut[lr] + ($r & 7), xs = o.kInsertLengthPrefixCode[hs].offset + de.readBits(o.kInsertLengthPrefixCode[hs].nbits), e0 = o.kCopyLengthPrefixCode[ds].offset + de.readBits(o.kCopyLengthPrefixCode[ds].nbits), Ee = X[O - 1 & oe], Ne = X[O - 2 & oe], Nt = 0; Nt < xs; ++Nt)
            de.readMoreInput(), v0[0] === 0 && (ge(
              d0[0],
              Qe,
              0,
              j0,
              as,
              Vr,
              de
            ), v0[0] = K(c0, 0, de), ra = j0[0] << m, os = ra, Ut = _r[j0[0]], cs = a.lookupOffsets[Ut], fs = a.lookupOffsets[Ut + 1]), cr = a.lookup[cs + Ee] | a.lookup[fs + Ne], na = Ji[os + cr], --v0[0], Ne = Ee, Ee = J(Re[0].codes, Re[0].htrees[na], de), X[O & oe] = Ee, (O & oe) === oe && R.write(X, he), ++O;
          if (He -= xs, He <= 0) break;
          if (i0 < 0) {
            var cr;
            if (de.readMoreInput(), v0[2] === 0 && (ge(
              d0[2],
              Qe,
              2,
              j0,
              as,
              Vr,
              de
            ), v0[2] = K(c0, 2 * y, de), sa = j0[2] << v, ls = sa), --v0[2], cr = (e0 > 4 ? 3 : e0 - 2) & 255, ia = ea[ls + cr], i0 = J(Re[2].codes, Re[2].htrees[ia], de), i0 >= or) {
              var bs, ca, ur;
              i0 -= or, ca = i0 & Ki, i0 >>= Rt, bs = (i0 >> 1) + 1, ur = (2 + (i0 & 1) << bs) - 4, i0 = or + (ur + de.readBits(bs) << Rt) + ca;
            }
          }
          if (R0 = W(i0, Ge, s0), R0 < 0)
            throw new Error("[BrotliDecompress] invalid distance");
          if (O < te && se !== te ? se = O : se = te, fr = O & oe, R0 > se)
            if (e0 >= r.minDictionaryWordLength && e0 <= r.maxDictionaryWordLength) {
              var ur = r.offsetsByLength[e0], fa = R0 - se - 1, ua = r.sizeBitsByLength[e0], uc = (1 << ua) - 1, hc = fa & uc, ha = fa >> ua;
              if (ur += hc * e0, ha < l.kNumTransforms) {
                var ps = l.transformDictionaryWord(X, fr, ur, e0, ha);
                if (fr += ps, O += ps, He -= ps, fr >= we) {
                  R.write(X, he);
                  for (var Xr = 0; Xr < fr - we; Xr++)
                    X[Xr] = X[we + Xr];
                }
              } else
                throw new Error("Invalid backward reference. pos: " + O + " distance: " + R0 + " len: " + e0 + " bytes left: " + He);
            } else
              throw new Error("Invalid backward reference. pos: " + O + " distance: " + R0 + " len: " + e0 + " bytes left: " + He);
          else {
            if (i0 > 0 && (Ge[s0 & 3] = R0, ++s0), e0 > He)
              throw new Error("Invalid backward reference. pos: " + O + " distance: " + R0 + " len: " + e0 + " bytes left: " + He);
            for (Nt = 0; Nt < e0; ++Nt)
              X[O & oe] = X[O - R0 & oe], (O & oe) === oe && R.write(X, he), ++O, --He;
          }
          Ee = X[O - 1 & oe], Ne = X[O - 2 & oe];
        }
        O &= 1073741823;
      }
    }
    R.write(X, O & oe);
  }
  return xr.BrotliDecompress = qe, r.init(), xr;
}
var rf = nl().BrotliDecompressBuffer;
const nf = /* @__PURE__ */ Dt(rf);
function Nr(n, e, t, r) {
  Object.defineProperty(n, e, { get: t, set: r, enumerable: !0, configurable: !0 });
}
function Xn(n) {
  return n && n.__esModule ? n.default : n;
}
var zr = {};
Nr(zr, "logErrors", () => sf);
Nr(zr, "registerFormat", () => ir);
Nr(zr, "create", () => ni);
Nr(zr, "defaultLanguage", () => In);
Nr(zr, "setDefaultLanguage", () => af);
let sf = !1, ri = [];
function ir(n) {
  ri.push(n);
}
function ni(n, e) {
  for (let t = 0; t < ri.length; t++) {
    let r = ri[t];
    if (r.probe(n)) {
      let s = new r(new We(n));
      return e ? s.getFont(e) : s;
    }
  }
  throw new Error("Unknown font format");
}
let In = "en";
function af(n = "en") {
  In = n;
}
function _e(n, e, t) {
  if (t.get) {
    let r = t.get;
    t.get = function() {
      let s = r.call(this);
      return Object.defineProperty(this, e, {
        value: s
      }), s;
    };
  } else if (typeof t.value == "function") {
    let r = t.value;
    return {
      get() {
        let s = /* @__PURE__ */ new Map();
        function i(...a) {
          let o = a.length > 0 ? a[0] : "value";
          if (s.has(o)) return s.get(o);
          let l = r.apply(this, a);
          return s.set(o, l), l;
        }
        return Object.defineProperty(this, e, {
          value: i
        }), i;
      }
    };
  }
}
let of = new F({
  firstCode: h,
  entryCount: h,
  idDelta: U,
  idRangeOffset: h
}), Es = new F({
  startCharCode: T,
  endCharCode: T,
  glyphID: T
}), lf = new F({
  startUnicodeValue: ut,
  additionalCount: H
}), cf = new F({
  unicodeValue: ut,
  glyphID: h
}), ff = new S(lf, T), uf = new S(cf, T), hf = new F({
  varSelector: ut,
  defaultUVS: new P(T, ff, {
    type: "parent"
  }),
  nonDefaultUVS: new P(T, uf, {
    type: "parent"
  })
}), df = new fe(h, {
  0: {
    length: h,
    language: h,
    codeMap: new ke(H, 256)
  },
  2: {
    length: h,
    language: h,
    subHeaderKeys: new S(h, 256),
    subHeaderCount: (n) => Math.max.apply(Math, n.subHeaderKeys),
    subHeaders: new ke(of, "subHeaderCount"),
    glyphIndexArray: new ke(h, "subHeaderCount")
  },
  4: {
    length: h,
    language: h,
    segCountX2: h,
    segCount: (n) => n.segCountX2 >> 1,
    searchRange: h,
    entrySelector: h,
    rangeShift: h,
    endCode: new ke(h, "segCount"),
    reservedPad: new Ie(h),
    startCode: new ke(h, "segCount"),
    idDelta: new ke(U, "segCount"),
    idRangeOffset: new ke(h, "segCount"),
    glyphIndexArray: new ke(h, (n) => (n.length - n._currentOffset) / 2)
  },
  6: {
    length: h,
    language: h,
    firstCode: h,
    entryCount: h,
    glyphIndices: new ke(h, "entryCount")
  },
  8: {
    reserved: new Ie(h),
    length: T,
    language: h,
    is32: new ke(H, 8192),
    nGroups: T,
    groups: new ke(Es, "nGroups")
  },
  10: {
    reserved: new Ie(h),
    length: T,
    language: T,
    firstCode: T,
    entryCount: T,
    glyphIndices: new ke(h, "numChars")
  },
  12: {
    reserved: new Ie(h),
    length: T,
    language: T,
    nGroups: T,
    groups: new ke(Es, "nGroups")
  },
  13: {
    reserved: new Ie(h),
    length: T,
    language: T,
    nGroups: T,
    groups: new ke(Es, "nGroups")
  },
  14: {
    length: T,
    numRecords: T,
    varSelectors: new ke(hf, "numRecords")
  }
}), xf = new F({
  platformID: h,
  encodingID: h,
  table: new P(T, df, {
    type: "parent",
    lazy: !0
  })
});
var bf = new F({
  version: h,
  numSubtables: h,
  tables: new S(xf, "numSubtables")
}), pf = new F({
  version: Ct,
  revision: Ct,
  checkSumAdjustment: T,
  magicNumber: T,
  flags: h,
  unitsPerEm: h,
  created: new S(Ct, 2),
  modified: new S(Ct, 2),
  xMin: U,
  yMin: U,
  xMax: U,
  yMax: U,
  macStyle: new m0(h, [
    "bold",
    "italic",
    "underline",
    "outline",
    "shadow",
    "condensed",
    "extended"
  ]),
  lowestRecPPEM: h,
  fontDirectionHint: U,
  indexToLocFormat: U,
  glyphDataFormat: U
  // 0 for current format
}), gf = new F({
  version: Ct,
  ascent: U,
  descent: U,
  lineGap: U,
  advanceWidthMax: h,
  minLeftSideBearing: U,
  minRightSideBearing: U,
  xMaxExtent: U,
  caretSlopeRise: U,
  caretSlopeRun: U,
  caretOffset: U,
  reserved: new Ie(U, 4),
  metricDataFormat: U,
  numberOfMetrics: h
  // Number of advance widths in 'hmtx' table
});
let mf = new F({
  advance: h,
  bearing: U
});
var Af = new F({
  metrics: new ke(mf, (n) => n.parent.hhea.numberOfMetrics),
  bearings: new ke(U, (n) => n.parent.maxp.numGlyphs - n.parent.hhea.numberOfMetrics)
}), wf = new F({
  version: Ct,
  numGlyphs: h,
  maxPoints: h,
  maxContours: h,
  maxComponentPoints: h,
  maxComponentContours: h,
  maxZones: h,
  maxTwilightPoints: h,
  maxStorage: h,
  maxFunctionDefs: h,
  maxInstructionDefs: h,
  maxStackElements: h,
  maxSizeOfInstructions: h,
  maxComponentElements: h,
  maxComponentDepth: h
  // Maximum levels of recursion; 1 for simple components
});
function sl(n, e, t = 0) {
  return n === 1 && Ra[t] ? Ra[t] : Sf[n][e];
}
const vf = /* @__PURE__ */ new Set([
  "x-mac-roman",
  "x-mac-cyrillic",
  "iso-8859-6",
  "iso-8859-8"
]), yf = {
  "x-mac-croatian": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ",
  "x-mac-gaelic": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæøṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ",
  "x-mac-greek": "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ­",
  "x-mac-icelandic": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ",
  "x-mac-inuit": "ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł",
  "x-mac-ce": "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ",
  "x-mac-romanian": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ",
  "x-mac-turkish": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ"
}, Fs = /* @__PURE__ */ new Map();
function Cf(n) {
  let e = Fs.get(n);
  if (e) return e;
  let t = yf[n];
  if (t) {
    let r = /* @__PURE__ */ new Map();
    for (let s = 0; s < t.length; s++) r.set(t.charCodeAt(s), 128 + s);
    return Fs.set(n, r), r;
  }
  if (vf.has(n)) {
    let r = new TextDecoder(n), s = new Uint8Array(128);
    for (let o = 0; o < 128; o++) s[o] = 128 + o;
    let i = /* @__PURE__ */ new Map(), a = r.decode(s);
    for (let o = 0; o < 128; o++) i.set(a.charCodeAt(o), 128 + o);
    return Fs.set(n, i), i;
  }
}
const Sf = [
  // unicode
  [
    "utf-16be",
    "utf-16be",
    "utf-16be",
    "utf-16be",
    "utf-16be",
    "utf-16be",
    "utf-16be"
  ],
  // macintosh
  // Mappings available at http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/
  // 0	Roman                 17	Malayalam
  // 1	Japanese	            18	Sinhalese
  // 2	Traditional Chinese	  19	Burmese
  // 3	Korean	              20	Khmer
  // 4	Arabic	              21	Thai
  // 5	Hebrew	              22	Laotian
  // 6	Greek	                23	Georgian
  // 7	Russian	              24	Armenian
  // 8	RSymbol	              25	Simplified Chinese
  // 9	Devanagari	          26	Tibetan
  // 10	Gurmukhi	            27	Mongolian
  // 11	Gujarati	            28	Geez
  // 12	Oriya	                29	Slavic
  // 13	Bengali	              30	Vietnamese
  // 14	Tamil	                31	Sindhi
  // 15	Telugu	              32	(Uninterpreted)
  // 16	Kannada
  [
    "x-mac-roman",
    "shift-jis",
    "big5",
    "euc-kr",
    "iso-8859-6",
    "iso-8859-8",
    "x-mac-greek",
    "x-mac-cyrillic",
    "x-mac-symbol",
    "x-mac-devanagari",
    "x-mac-gurmukhi",
    "x-mac-gujarati",
    "Oriya",
    "Bengali",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Sinhalese",
    "Burmese",
    "Khmer",
    "iso-8859-11",
    "Laotian",
    "Georgian",
    "Armenian",
    "gbk",
    "Tibetan",
    "Mongolian",
    "Geez",
    "x-mac-ce",
    "Vietnamese",
    "Sindhi"
  ],
  // ISO (deprecated)
  [
    "ascii",
    null,
    "iso-8859-1"
  ],
  // windows
  // Docs here: http://msdn.microsoft.com/en-us/library/system.text.encoding(v=vs.110).aspx
  [
    "symbol",
    "utf-16be",
    "shift-jis",
    "gb18030",
    "big5",
    "euc-kr",
    "johab",
    null,
    null,
    null,
    "utf-16be"
  ]
], Ra = {
  15: "x-mac-icelandic",
  17: "x-mac-turkish",
  18: "x-mac-croatian",
  24: "x-mac-ce",
  25: "x-mac-ce",
  26: "x-mac-ce",
  27: "x-mac-ce",
  28: "x-mac-ce",
  30: "x-mac-icelandic",
  37: "x-mac-romanian",
  38: "x-mac-ce",
  39: "x-mac-ce",
  40: "x-mac-ce",
  143: "x-mac-inuit",
  146: "x-mac-gaelic"
}, kf = [
  // unicode
  [],
  {
    0: "en",
    30: "fo",
    60: "ks",
    90: "rw",
    1: "fr",
    31: "fa",
    61: "ku",
    91: "rn",
    2: "de",
    32: "ru",
    62: "sd",
    92: "ny",
    3: "it",
    33: "zh",
    63: "bo",
    93: "mg",
    4: "nl",
    34: "nl-BE",
    64: "ne",
    94: "eo",
    5: "sv",
    35: "ga",
    65: "sa",
    128: "cy",
    6: "es",
    36: "sq",
    66: "mr",
    129: "eu",
    7: "da",
    37: "ro",
    67: "bn",
    130: "ca",
    8: "pt",
    38: "cz",
    68: "as",
    131: "la",
    9: "no",
    39: "sk",
    69: "gu",
    132: "qu",
    10: "he",
    40: "si",
    70: "pa",
    133: "gn",
    11: "ja",
    41: "yi",
    71: "or",
    134: "ay",
    12: "ar",
    42: "sr",
    72: "ml",
    135: "tt",
    13: "fi",
    43: "mk",
    73: "kn",
    136: "ug",
    14: "el",
    44: "bg",
    74: "ta",
    137: "dz",
    15: "is",
    45: "uk",
    75: "te",
    138: "jv",
    16: "mt",
    46: "be",
    76: "si",
    139: "su",
    17: "tr",
    47: "uz",
    77: "my",
    140: "gl",
    18: "hr",
    48: "kk",
    78: "km",
    141: "af",
    19: "zh-Hant",
    49: "az-Cyrl",
    79: "lo",
    142: "br",
    20: "ur",
    50: "az-Arab",
    80: "vi",
    143: "iu",
    21: "hi",
    51: "hy",
    81: "id",
    144: "gd",
    22: "th",
    52: "ka",
    82: "tl",
    145: "gv",
    23: "ko",
    53: "mo",
    83: "ms",
    146: "ga",
    24: "lt",
    54: "ky",
    84: "ms-Arab",
    147: "to",
    25: "pl",
    55: "tg",
    85: "am",
    148: "el-polyton",
    26: "hu",
    56: "tk",
    86: "ti",
    149: "kl",
    27: "es",
    57: "mn-CN",
    87: "om",
    150: "az",
    28: "lv",
    58: "mn",
    88: "so",
    151: "nn",
    29: "se",
    59: "ps",
    89: "sw"
  },
  // ISO (deprecated)
  [],
  {
    1078: "af",
    16393: "en-IN",
    1159: "rw",
    1074: "tn",
    1052: "sq",
    6153: "en-IE",
    1089: "sw",
    1115: "si",
    1156: "gsw",
    8201: "en-JM",
    1111: "kok",
    1051: "sk",
    1118: "am",
    17417: "en-MY",
    1042: "ko",
    1060: "sl",
    5121: "ar-DZ",
    5129: "en-NZ",
    1088: "ky",
    11274: "es-AR",
    15361: "ar-BH",
    13321: "en-PH",
    1108: "lo",
    16394: "es-BO",
    3073: "ar",
    18441: "en-SG",
    1062: "lv",
    13322: "es-CL",
    2049: "ar-IQ",
    7177: "en-ZA",
    1063: "lt",
    9226: "es-CO",
    11265: "ar-JO",
    11273: "en-TT",
    2094: "dsb",
    5130: "es-CR",
    13313: "ar-KW",
    2057: "en-GB",
    1134: "lb",
    7178: "es-DO",
    12289: "ar-LB",
    1033: "en",
    1071: "mk",
    12298: "es-EC",
    4097: "ar-LY",
    12297: "en-ZW",
    2110: "ms-BN",
    17418: "es-SV",
    6145: "ary",
    1061: "et",
    1086: "ms",
    4106: "es-GT",
    8193: "ar-OM",
    1080: "fo",
    1100: "ml",
    18442: "es-HN",
    16385: "ar-QA",
    1124: "fil",
    1082: "mt",
    2058: "es-MX",
    1025: "ar-SA",
    1035: "fi",
    1153: "mi",
    19466: "es-NI",
    10241: "ar-SY",
    2060: "fr-BE",
    1146: "arn",
    6154: "es-PA",
    7169: "aeb",
    3084: "fr-CA",
    1102: "mr",
    15370: "es-PY",
    14337: "ar-AE",
    1036: "fr",
    1148: "moh",
    10250: "es-PE",
    9217: "ar-YE",
    5132: "fr-LU",
    1104: "mn",
    20490: "es-PR",
    1067: "hy",
    6156: "fr-MC",
    2128: "mn-CN",
    3082: "es",
    1101: "as",
    4108: "fr-CH",
    1121: "ne",
    1034: "es",
    2092: "az-Cyrl",
    1122: "fy",
    1044: "nb",
    21514: "es-US",
    1068: "az",
    1110: "gl",
    2068: "nn",
    14346: "es-UY",
    1133: "ba",
    1079: "ka",
    1154: "oc",
    8202: "es-VE",
    1069: "eu",
    3079: "de-AT",
    1096: "or",
    2077: "sv-FI",
    1059: "be",
    1031: "de",
    1123: "ps",
    1053: "sv",
    2117: "bn",
    5127: "de-LI",
    1045: "pl",
    1114: "syr",
    1093: "bn-IN",
    4103: "de-LU",
    1046: "pt",
    1064: "tg",
    8218: "bs-Cyrl",
    2055: "de-CH",
    2070: "pt-PT",
    2143: "tzm",
    5146: "bs",
    1032: "el",
    1094: "pa",
    1097: "ta",
    1150: "br",
    1135: "kl",
    1131: "qu-BO",
    1092: "tt",
    1026: "bg",
    1095: "gu",
    2155: "qu-EC",
    1098: "te",
    1027: "ca",
    1128: "ha",
    3179: "qu",
    1054: "th",
    3076: "zh-HK",
    1037: "he",
    1048: "ro",
    1105: "bo",
    5124: "zh-MO",
    1081: "hi",
    1047: "rm",
    1055: "tr",
    2052: "zh",
    1038: "hu",
    1049: "ru",
    1090: "tk",
    4100: "zh-SG",
    1039: "is",
    9275: "smn",
    1152: "ug",
    1028: "zh-TW",
    1136: "ig",
    4155: "smj-NO",
    1058: "uk",
    1155: "co",
    1057: "id",
    5179: "smj",
    1070: "hsb",
    1050: "hr",
    1117: "iu",
    3131: "se-FI",
    1056: "ur",
    4122: "hr-BA",
    2141: "iu-Latn",
    1083: "se",
    2115: "uz-Cyrl",
    1029: "cs",
    2108: "ga",
    2107: "se-SE",
    1091: "uz",
    1030: "da",
    1076: "xh",
    8251: "sms",
    1066: "vi",
    1164: "prs",
    1077: "zu",
    6203: "sma-NO",
    1106: "cy",
    1125: "dv",
    1040: "it",
    7227: "sms",
    1160: "wo",
    2067: "nl-BE",
    2064: "it-CH",
    1103: "sa",
    1157: "sah",
    1043: "nl",
    1041: "ja",
    7194: "sr-Cyrl-BA",
    1144: "ii",
    3081: "en-AU",
    1099: "kn",
    3098: "sr",
    1130: "yo",
    10249: "en-BZ",
    1087: "kk",
    6170: "sr-Latn-BA",
    4105: "en-CA",
    1107: "km",
    2074: "sr-Latn",
    9225: "en-029",
    1158: "quc",
    1132: "nso"
  }
];
let Ua = new F({
  platformID: h,
  encodingID: h,
  languageID: h,
  nameID: h,
  length: h,
  string: new P(h, new Se("length", (n) => sl(n.platformID, n.encodingID, n.languageID)), {
    type: "parent",
    relativeTo: (n) => n.parent.stringOffset,
    allowNull: !1
  })
}), Pf = new F({
  length: h,
  tag: new P(h, new Se("length", "utf16be"), {
    type: "parent",
    relativeTo: (n) => n.stringOffset
  })
});
var En = new fe(h, {
  0: {
    count: h,
    stringOffset: h,
    records: new S(Ua, "count")
  },
  1: {
    count: h,
    stringOffset: h,
    records: new S(Ua, "count"),
    langTagCount: h,
    langTags: new S(Pf, "langTagCount")
  }
}), Tf = En;
const si = [
  "copyright",
  "fontFamily",
  "fontSubfamily",
  "uniqueSubfamily",
  "fullName",
  "version",
  "postscriptName",
  "trademark",
  "manufacturer",
  "designer",
  "description",
  "vendorURL",
  "designerURL",
  "license",
  "licenseURL",
  null,
  "preferredFamily",
  "preferredSubfamily",
  "compatibleFull",
  "sampleText",
  "postscriptCIDFontName",
  "wwsFamilyName",
  "wwsSubfamilyName"
];
En.process = function(n) {
  var e = {};
  for (let t of this.records) {
    let r = kf[t.platformID][t.languageID];
    r == null && this.langTags != null && t.languageID >= 32768 && (r = this.langTags[t.languageID - 32768].tag), r == null && (r = t.platformID + "-" + t.languageID);
    let s = t.nameID >= 256 ? "fontFeatures" : si[t.nameID] || t.nameID;
    e[s] == null && (e[s] = {});
    let i = e[s];
    t.nameID >= 256 && (i = i[t.nameID] || (i[t.nameID] = {})), (typeof t.string == "string" || typeof i[r] != "string") && (i[r] = t.string);
  }
  this.records = e;
};
En.preEncode = function() {
  if (Array.isArray(this.records)) return;
  this.version = 0;
  let n = [];
  for (let e in this.records) {
    let t = this.records[e];
    e !== "fontFeatures" && (n.push({
      platformID: 3,
      encodingID: 1,
      languageID: 1033,
      nameID: si.indexOf(e),
      length: t.en.length * 2,
      string: t.en
    }), e === "postscriptName" && n.push({
      platformID: 1,
      encodingID: 0,
      languageID: 0,
      nameID: si.indexOf(e),
      length: t.en.length,
      string: t.en
    }));
  }
  this.records = n, this.count = n.length, this.stringOffset = En.size(this, null, !1);
};
var il = new fe(h, {
  header: {
    xAvgCharWidth: U,
    usWeightClass: h,
    usWidthClass: h,
    fsType: new m0(h, [
      null,
      "noEmbedding",
      "viewOnly",
      "editable",
      null,
      null,
      null,
      null,
      "noSubsetting",
      "bitmapOnly"
    ]),
    ySubscriptXSize: U,
    ySubscriptYSize: U,
    ySubscriptXOffset: U,
    ySubscriptYOffset: U,
    ySuperscriptXSize: U,
    ySuperscriptYSize: U,
    ySuperscriptXOffset: U,
    ySuperscriptYOffset: U,
    yStrikeoutSize: U,
    yStrikeoutPosition: U,
    sFamilyClass: U,
    panose: new S(H, 10),
    ulCharRange: new S(T, 4),
    vendorID: new Se(4),
    fsSelection: new m0(h, [
      "italic",
      "underscore",
      "negative",
      "outlined",
      "strikeout",
      "bold",
      "regular",
      "useTypoMetrics",
      "wws",
      "oblique"
    ]),
    usFirstCharIndex: h,
    usLastCharIndex: h
    // The maximum Unicode index in this font
  },
  // The Apple version of this table ends here, but the Microsoft one continues on...
  0: {},
  1: {
    typoAscender: U,
    typoDescender: U,
    typoLineGap: U,
    winAscent: h,
    winDescent: h,
    codePageRange: new S(T, 2)
  },
  2: {
    // these should be common with version 1 somehow
    typoAscender: U,
    typoDescender: U,
    typoLineGap: U,
    winAscent: h,
    winDescent: h,
    codePageRange: new S(T, 2),
    xHeight: U,
    capHeight: U,
    defaultChar: h,
    breakChar: h,
    maxContent: h
  },
  5: {
    typoAscender: U,
    typoDescender: U,
    typoLineGap: U,
    winAscent: h,
    winDescent: h,
    codePageRange: new S(T, 2),
    xHeight: U,
    capHeight: U,
    defaultChar: h,
    breakChar: h,
    maxContent: h,
    usLowerOpticalPointSize: h,
    usUpperOpticalPointSize: h
  }
});
let Bs = il.versions;
Bs[3] = Bs[4] = Bs[2];
var If = il, Ef = new fe(De, {
  header: {
    italicAngle: De,
    underlinePosition: U,
    underlineThickness: U,
    isFixedPitch: T,
    minMemType42: T,
    maxMemType42: T,
    minMemType1: T,
    maxMemType1: T
    // Maximum memory usage when a TrueType font is downloaded as a Type 1 font
  },
  1: {},
  2: {
    numberOfGlyphs: h,
    glyphNameIndex: new S(h, "numberOfGlyphs"),
    names: new S(new Se(H))
  },
  2.5: {
    numberOfGlyphs: h,
    offsets: new S(H, "numberOfGlyphs")
  },
  3: {},
  4: {
    map: new S(T, (n) => n.parent.maxp.numGlyphs)
  }
}), Ff = new F({
  controlValues: new S(U)
}), Bf = new F({
  instructions: new S(H)
});
let Ri = new fe("head.indexToLocFormat", {
  0: {
    offsets: new S(h)
  },
  1: {
    offsets: new S(T)
  }
});
Ri.process = function() {
  if (this.version === 0 && !this._processed) {
    for (let n = 0; n < this.offsets.length; n++) this.offsets[n] <<= 1;
    this._processed = !0;
  }
};
Ri.preEncode = function() {
  if (this.version === 0 && this._processed !== !1) {
    for (let n = 0; n < this.offsets.length; n++) this.offsets[n] >>>= 1;
    this._processed = !1;
  }
};
var Of = Ri, Df = new F({
  controlValueProgram: new S(H)
}), Mf = new S(new D0());
class E0 {
  getCFFVersion(e) {
    for (; e && !e.hdrSize; ) e = e.parent;
    return e ? e.version : -1;
  }
  decode(e, t) {
    let s = this.getCFFVersion(t) >= 2 ? e.readUInt32BE() : e.readUInt16BE();
    if (s === 0) return [];
    let i = e.readUInt8(), a;
    if (i === 1) a = H;
    else if (i === 2) a = h;
    else if (i === 3) a = ut;
    else if (i === 4) a = T;
    else throw new Error(`Bad offset size in CFFIndex: ${i} ${e.pos}`);
    let o = [], l = e.pos + (s + 1) * i - 1, f = a.decode(e);
    for (let u = 0; u < s; u++) {
      let c = a.decode(e);
      if (this.type != null) {
        let x = e.pos;
        e.pos = l + f, t.length = c - f, o.push(this.type.decode(e, t)), e.pos = x;
      } else o.push({
        offset: l + f,
        length: c - f
      });
      f = c;
    }
    return e.pos = l + f, o;
  }
  size(e, t) {
    let r = 2;
    if (e.length === 0) return r;
    let s = this.type || new D0(), i = 1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      i += s.size(l, t);
    }
    let a;
    if (i <= 255) a = H;
    else if (i <= 65535) a = h;
    else if (i <= 16777215) a = ut;
    else if (i <= 4294967295) a = T;
    else throw new Error("Bad offset in CFFIndex");
    return r += 1 + a.size() * (e.length + 1), r += i - 1, r;
  }
  encode(e, t, r) {
    if (e.writeUInt16BE(t.length), t.length === 0) return;
    let s = this.type || new D0(), i = [], a = 1;
    for (let l of t) {
      let f = s.size(l, r);
      i.push(f), a += f;
    }
    let o;
    if (a <= 255) o = H;
    else if (a <= 65535) o = h;
    else if (a <= 16777215) o = ut;
    else if (a <= 4294967295) o = T;
    else throw new Error("Bad offset in CFFIndex");
    e.writeUInt8(o.size()), a = 1, o.encode(e, a);
    for (let l of i)
      a += l, o.encode(e, a);
    for (let l of t) s.encode(e, l, r);
  }
  constructor(e) {
    this.type = e;
  }
}
const pr = 15, Na = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "E",
  "E-",
  null,
  "-"
], za = {
  ".": 10,
  E: 11,
  "E-": 12,
  "-": 14
};
class Os {
  static decode(e, t) {
    if (32 <= t && t <= 246) return t - 139;
    if (247 <= t && t <= 250) return (t - 247) * 256 + e.readUInt8() + 108;
    if (251 <= t && t <= 254) return -(t - 251) * 256 - e.readUInt8() - 108;
    if (t === 28) return e.readInt16BE();
    if (t === 29) return e.readInt32BE();
    if (t === 30) {
      let r = "";
      for (; ; ) {
        let s = e.readUInt8(), i = s >> 4;
        if (i === pr) break;
        r += Na[i];
        let a = s & 15;
        if (a === pr) break;
        r += Na[a];
      }
      return parseFloat(r);
    }
    return null;
  }
  static size(e) {
    if (e.forceLarge && (e = 32768), (e | 0) !== e) {
      let t = "" + e;
      return 1 + Math.ceil((t.length + 1) / 2);
    } else return -107 <= e && e <= 107 ? 1 : 108 <= e && e <= 1131 || -1131 <= e && e <= -108 ? 2 : -32768 <= e && e <= 32767 ? 3 : 5;
  }
  static encode(e, t) {
    let r = Number(t);
    if (t.forceLarge)
      return e.writeUInt8(29), e.writeInt32BE(r);
    if ((r | 0) !== r) {
      e.writeUInt8(30);
      let i = "" + r;
      for (let a = 0; a < i.length; a += 2) {
        let o = i[a], l = za[o] || +o;
        if (a === i.length - 1) var s = pr;
        else {
          let f = i[a + 1];
          var s = za[f] || +f;
        }
        e.writeUInt8(l << 4 | s & 15);
      }
      if (s !== pr) return e.writeUInt8(pr << 4);
    } else return -107 <= r && r <= 107 ? e.writeUInt8(r + 139) : 108 <= r && r <= 1131 ? (r -= 108, e.writeUInt8((r >> 8) + 247), e.writeUInt8(r & 255)) : -1131 <= r && r <= -108 ? (r = -r - 108, e.writeUInt8((r >> 8) + 251), e.writeUInt8(r & 255)) : -32768 <= r && r <= 32767 ? (e.writeUInt8(28), e.writeInt16BE(r)) : (e.writeUInt8(29), e.writeInt32BE(r));
  }
}
class jn {
  decodeOperands(e, t, r, s) {
    if (Array.isArray(e)) return s.map((i, a) => this.decodeOperands(e[a], t, r, [
      i
    ]));
    if (e.decode != null) return e.decode(t, r, s);
    switch (e) {
      case "number":
      case "offset":
      case "sid":
        return s[0];
      case "boolean":
        return !!s[0];
      default:
        return s;
    }
  }
  encodeOperands(e, t, r, s) {
    return Array.isArray(e) ? s.map((i, a) => this.encodeOperands(e[a], t, r, i)[0]) : e.encode != null ? e.encode(t, s, r) : typeof s == "number" ? [
      s
    ] : typeof s == "boolean" ? [
      +s
    ] : Array.isArray(s) ? s : [
      s
    ];
  }
  decode(e, t) {
    let r = e.pos + t.length, s = {}, i = [];
    Object.defineProperties(s, {
      parent: {
        value: t
      },
      _startOffset: {
        value: e.pos
      }
    });
    for (let a in this.fields) {
      let o = this.fields[a];
      s[o[1]] = o[3];
    }
    for (; e.pos < r; ) {
      let a = e.readUInt8();
      if (a < 28) {
        a === 12 && (a = a << 8 | e.readUInt8());
        let o = this.fields[a];
        if (!o) throw new Error(`Unknown operator ${a}`);
        let l = this.decodeOperands(o[2], e, s, i);
        l != null && (l instanceof Pi ? Object.defineProperty(s, o[1], l) : s[o[1]] = l), i = [];
      } else i.push(Os.decode(e, a));
    }
    return s;
  }
  size(e, t, r = !0) {
    let s = {
      parent: t,
      val: e,
      pointerSize: 0,
      startOffset: t.startOffset || 0
    }, i = 0;
    for (let a in this.fields) {
      let o = this.fields[a], l = e[o[1]];
      if (l == null || ya(l, o[3])) continue;
      let f = this.encodeOperands(o[2], null, s, l);
      for (let c of f) i += Os.size(c);
      let u = Array.isArray(o[0]) ? o[0] : [
        o[0]
      ];
      i += u.length;
    }
    return r && (i += s.pointerSize), i;
  }
  encode(e, t, r) {
    let s = {
      pointers: [],
      startOffset: e.pos,
      parent: r,
      val: t,
      pointerSize: 0
    };
    s.pointerOffset = e.pos + this.size(t, s, !1);
    for (let a of this.ops) {
      let o = t[a[1]];
      if (o == null || ya(o, a[3])) continue;
      let l = this.encodeOperands(a[2], e, s, o);
      for (let u of l) Os.encode(e, u);
      let f = Array.isArray(a[0]) ? a[0] : [
        a[0]
      ];
      for (let u of f) e.writeUInt8(u);
    }
    let i = 0;
    for (; i < s.pointers.length; ) {
      let a = s.pointers[i++];
      a.type.encode(e, a.val, a.parent);
    }
  }
  constructor(e = []) {
    this.ops = e, this.fields = {};
    for (let t of e) {
      let r = Array.isArray(t[0]) ? t[0][0] << 8 | t[0][1] : t[0];
      this.fields[r] = t;
    }
  }
}
class b0 extends P {
  decode(e, t, r) {
    return this.offsetType = {
      decode: () => r[0]
    }, super.decode(e, t, r);
  }
  encode(e, t, r) {
    if (!e)
      return this.offsetType = {
        size: () => 0
      }, this.size(t, r), [
        new Ga(0)
      ];
    let s = null;
    return this.offsetType = {
      encode: (i, a) => s = a
    }, super.encode(e, t, r), [
      new Ga(s)
    ];
  }
  constructor(e, t = {}) {
    t.type == null && (t.type = "global"), super(null, e, t);
  }
}
class Ga {
  valueOf() {
    return this.val;
  }
  constructor(e) {
    this.val = e, this.forceLarge = !0;
  }
}
class Lf {
  static decode(e, t, r) {
    let s = r.pop();
    for (; r.length > s; ) r.pop();
  }
}
var ii = new jn([
  // key       name                    type                                          default
  [
    6,
    "BlueValues",
    "delta",
    null
  ],
  [
    7,
    "OtherBlues",
    "delta",
    null
  ],
  [
    8,
    "FamilyBlues",
    "delta",
    null
  ],
  [
    9,
    "FamilyOtherBlues",
    "delta",
    null
  ],
  [
    [
      12,
      9
    ],
    "BlueScale",
    "number",
    0.039625
  ],
  [
    [
      12,
      10
    ],
    "BlueShift",
    "number",
    7
  ],
  [
    [
      12,
      11
    ],
    "BlueFuzz",
    "number",
    1
  ],
  [
    10,
    "StdHW",
    "number",
    null
  ],
  [
    11,
    "StdVW",
    "number",
    null
  ],
  [
    [
      12,
      12
    ],
    "StemSnapH",
    "delta",
    null
  ],
  [
    [
      12,
      13
    ],
    "StemSnapV",
    "delta",
    null
  ],
  [
    [
      12,
      14
    ],
    "ForceBold",
    "boolean",
    !1
  ],
  [
    [
      12,
      17
    ],
    "LanguageGroup",
    "number",
    0
  ],
  [
    [
      12,
      18
    ],
    "ExpansionFactor",
    "number",
    0.06
  ],
  [
    [
      12,
      19
    ],
    "initialRandomSeed",
    "number",
    0
  ],
  [
    20,
    "defaultWidthX",
    "number",
    0
  ],
  [
    21,
    "nominalWidthX",
    "number",
    0
  ],
  [
    22,
    "vsindex",
    "number",
    0
  ],
  [
    23,
    "blend",
    Lf,
    null
  ],
  [
    19,
    "Subrs",
    new b0(new E0(), {
      type: "local"
    }),
    null
  ]
]), dn = [
  ".notdef",
  "space",
  "exclam",
  "quotedbl",
  "numbersign",
  "dollar",
  "percent",
  "ampersand",
  "quoteright",
  "parenleft",
  "parenright",
  "asterisk",
  "plus",
  "comma",
  "hyphen",
  "period",
  "slash",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "colon",
  "semicolon",
  "less",
  "equal",
  "greater",
  "question",
  "at",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "bracketleft",
  "backslash",
  "bracketright",
  "asciicircum",
  "underscore",
  "quoteleft",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "braceleft",
  "bar",
  "braceright",
  "asciitilde",
  "exclamdown",
  "cent",
  "sterling",
  "fraction",
  "yen",
  "florin",
  "section",
  "currency",
  "quotesingle",
  "quotedblleft",
  "guillemotleft",
  "guilsinglleft",
  "guilsinglright",
  "fi",
  "fl",
  "endash",
  "dagger",
  "daggerdbl",
  "periodcentered",
  "paragraph",
  "bullet",
  "quotesinglbase",
  "quotedblbase",
  "quotedblright",
  "guillemotright",
  "ellipsis",
  "perthousand",
  "questiondown",
  "grave",
  "acute",
  "circumflex",
  "tilde",
  "macron",
  "breve",
  "dotaccent",
  "dieresis",
  "ring",
  "cedilla",
  "hungarumlaut",
  "ogonek",
  "caron",
  "emdash",
  "AE",
  "ordfeminine",
  "Lslash",
  "Oslash",
  "OE",
  "ordmasculine",
  "ae",
  "dotlessi",
  "lslash",
  "oslash",
  "oe",
  "germandbls",
  "onesuperior",
  "logicalnot",
  "mu",
  "trademark",
  "Eth",
  "onehalf",
  "plusminus",
  "Thorn",
  "onequarter",
  "divide",
  "brokenbar",
  "degree",
  "thorn",
  "threequarters",
  "twosuperior",
  "registered",
  "minus",
  "eth",
  "multiply",
  "threesuperior",
  "copyright",
  "Aacute",
  "Acircumflex",
  "Adieresis",
  "Agrave",
  "Aring",
  "Atilde",
  "Ccedilla",
  "Eacute",
  "Ecircumflex",
  "Edieresis",
  "Egrave",
  "Iacute",
  "Icircumflex",
  "Idieresis",
  "Igrave",
  "Ntilde",
  "Oacute",
  "Ocircumflex",
  "Odieresis",
  "Ograve",
  "Otilde",
  "Scaron",
  "Uacute",
  "Ucircumflex",
  "Udieresis",
  "Ugrave",
  "Yacute",
  "Ydieresis",
  "Zcaron",
  "aacute",
  "acircumflex",
  "adieresis",
  "agrave",
  "aring",
  "atilde",
  "ccedilla",
  "eacute",
  "ecircumflex",
  "edieresis",
  "egrave",
  "iacute",
  "icircumflex",
  "idieresis",
  "igrave",
  "ntilde",
  "oacute",
  "ocircumflex",
  "odieresis",
  "ograve",
  "otilde",
  "scaron",
  "uacute",
  "ucircumflex",
  "udieresis",
  "ugrave",
  "yacute",
  "ydieresis",
  "zcaron",
  "exclamsmall",
  "Hungarumlautsmall",
  "dollaroldstyle",
  "dollarsuperior",
  "ampersandsmall",
  "Acutesmall",
  "parenleftsuperior",
  "parenrightsuperior",
  "twodotenleader",
  "onedotenleader",
  "zerooldstyle",
  "oneoldstyle",
  "twooldstyle",
  "threeoldstyle",
  "fouroldstyle",
  "fiveoldstyle",
  "sixoldstyle",
  "sevenoldstyle",
  "eightoldstyle",
  "nineoldstyle",
  "commasuperior",
  "threequartersemdash",
  "periodsuperior",
  "questionsmall",
  "asuperior",
  "bsuperior",
  "centsuperior",
  "dsuperior",
  "esuperior",
  "isuperior",
  "lsuperior",
  "msuperior",
  "nsuperior",
  "osuperior",
  "rsuperior",
  "ssuperior",
  "tsuperior",
  "ff",
  "ffi",
  "ffl",
  "parenleftinferior",
  "parenrightinferior",
  "Circumflexsmall",
  "hyphensuperior",
  "Gravesmall",
  "Asmall",
  "Bsmall",
  "Csmall",
  "Dsmall",
  "Esmall",
  "Fsmall",
  "Gsmall",
  "Hsmall",
  "Ismall",
  "Jsmall",
  "Ksmall",
  "Lsmall",
  "Msmall",
  "Nsmall",
  "Osmall",
  "Psmall",
  "Qsmall",
  "Rsmall",
  "Ssmall",
  "Tsmall",
  "Usmall",
  "Vsmall",
  "Wsmall",
  "Xsmall",
  "Ysmall",
  "Zsmall",
  "colonmonetary",
  "onefitted",
  "rupiah",
  "Tildesmall",
  "exclamdownsmall",
  "centoldstyle",
  "Lslashsmall",
  "Scaronsmall",
  "Zcaronsmall",
  "Dieresissmall",
  "Brevesmall",
  "Caronsmall",
  "Dotaccentsmall",
  "Macronsmall",
  "figuredash",
  "hypheninferior",
  "Ogoneksmall",
  "Ringsmall",
  "Cedillasmall",
  "questiondownsmall",
  "oneeighth",
  "threeeighths",
  "fiveeighths",
  "seveneighths",
  "onethird",
  "twothirds",
  "zerosuperior",
  "foursuperior",
  "fivesuperior",
  "sixsuperior",
  "sevensuperior",
  "eightsuperior",
  "ninesuperior",
  "zeroinferior",
  "oneinferior",
  "twoinferior",
  "threeinferior",
  "fourinferior",
  "fiveinferior",
  "sixinferior",
  "seveninferior",
  "eightinferior",
  "nineinferior",
  "centinferior",
  "dollarinferior",
  "periodinferior",
  "commainferior",
  "Agravesmall",
  "Aacutesmall",
  "Acircumflexsmall",
  "Atildesmall",
  "Adieresissmall",
  "Aringsmall",
  "AEsmall",
  "Ccedillasmall",
  "Egravesmall",
  "Eacutesmall",
  "Ecircumflexsmall",
  "Edieresissmall",
  "Igravesmall",
  "Iacutesmall",
  "Icircumflexsmall",
  "Idieresissmall",
  "Ethsmall",
  "Ntildesmall",
  "Ogravesmall",
  "Oacutesmall",
  "Ocircumflexsmall",
  "Otildesmall",
  "Odieresissmall",
  "OEsmall",
  "Oslashsmall",
  "Ugravesmall",
  "Uacutesmall",
  "Ucircumflexsmall",
  "Udieresissmall",
  "Yacutesmall",
  "Thornsmall",
  "Ydieresissmall",
  "001.000",
  "001.001",
  "001.002",
  "001.003",
  "Black",
  "Bold",
  "Book",
  "Light",
  "Medium",
  "Regular",
  "Roman",
  "Semibold"
];
let al = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "space",
  "exclam",
  "quotedbl",
  "numbersign",
  "dollar",
  "percent",
  "ampersand",
  "quoteright",
  "parenleft",
  "parenright",
  "asterisk",
  "plus",
  "comma",
  "hyphen",
  "period",
  "slash",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "colon",
  "semicolon",
  "less",
  "equal",
  "greater",
  "question",
  "at",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "bracketleft",
  "backslash",
  "bracketright",
  "asciicircum",
  "underscore",
  "quoteleft",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "braceleft",
  "bar",
  "braceright",
  "asciitilde",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "exclamdown",
  "cent",
  "sterling",
  "fraction",
  "yen",
  "florin",
  "section",
  "currency",
  "quotesingle",
  "quotedblleft",
  "guillemotleft",
  "guilsinglleft",
  "guilsinglright",
  "fi",
  "fl",
  "",
  "endash",
  "dagger",
  "daggerdbl",
  "periodcentered",
  "",
  "paragraph",
  "bullet",
  "quotesinglbase",
  "quotedblbase",
  "quotedblright",
  "guillemotright",
  "ellipsis",
  "perthousand",
  "",
  "questiondown",
  "",
  "grave",
  "acute",
  "circumflex",
  "tilde",
  "macron",
  "breve",
  "dotaccent",
  "dieresis",
  "",
  "ring",
  "cedilla",
  "",
  "hungarumlaut",
  "ogonek",
  "caron",
  "emdash",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "AE",
  "",
  "ordfeminine",
  "",
  "",
  "",
  "",
  "Lslash",
  "Oslash",
  "OE",
  "ordmasculine",
  "",
  "",
  "",
  "",
  "",
  "ae",
  "",
  "",
  "",
  "dotlessi",
  "",
  "",
  "lslash",
  "oslash",
  "oe",
  "germandbls"
], Rf = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "space",
  "exclamsmall",
  "Hungarumlautsmall",
  "",
  "dollaroldstyle",
  "dollarsuperior",
  "ampersandsmall",
  "Acutesmall",
  "parenleftsuperior",
  "parenrightsuperior",
  "twodotenleader",
  "onedotenleader",
  "comma",
  "hyphen",
  "period",
  "fraction",
  "zerooldstyle",
  "oneoldstyle",
  "twooldstyle",
  "threeoldstyle",
  "fouroldstyle",
  "fiveoldstyle",
  "sixoldstyle",
  "sevenoldstyle",
  "eightoldstyle",
  "nineoldstyle",
  "colon",
  "semicolon",
  "commasuperior",
  "threequartersemdash",
  "periodsuperior",
  "questionsmall",
  "",
  "asuperior",
  "bsuperior",
  "centsuperior",
  "dsuperior",
  "esuperior",
  "",
  "",
  "isuperior",
  "",
  "",
  "lsuperior",
  "msuperior",
  "nsuperior",
  "osuperior",
  "",
  "",
  "rsuperior",
  "ssuperior",
  "tsuperior",
  "",
  "ff",
  "fi",
  "fl",
  "ffi",
  "ffl",
  "parenleftinferior",
  "",
  "parenrightinferior",
  "Circumflexsmall",
  "hyphensuperior",
  "Gravesmall",
  "Asmall",
  "Bsmall",
  "Csmall",
  "Dsmall",
  "Esmall",
  "Fsmall",
  "Gsmall",
  "Hsmall",
  "Ismall",
  "Jsmall",
  "Ksmall",
  "Lsmall",
  "Msmall",
  "Nsmall",
  "Osmall",
  "Psmall",
  "Qsmall",
  "Rsmall",
  "Ssmall",
  "Tsmall",
  "Usmall",
  "Vsmall",
  "Wsmall",
  "Xsmall",
  "Ysmall",
  "Zsmall",
  "colonmonetary",
  "onefitted",
  "rupiah",
  "Tildesmall",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "exclamdownsmall",
  "centoldstyle",
  "Lslashsmall",
  "",
  "",
  "Scaronsmall",
  "Zcaronsmall",
  "Dieresissmall",
  "Brevesmall",
  "Caronsmall",
  "",
  "Dotaccentsmall",
  "",
  "",
  "Macronsmall",
  "",
  "",
  "figuredash",
  "hypheninferior",
  "",
  "",
  "Ogoneksmall",
  "Ringsmall",
  "Cedillasmall",
  "",
  "",
  "",
  "onequarter",
  "onehalf",
  "threequarters",
  "questiondownsmall",
  "oneeighth",
  "threeeighths",
  "fiveeighths",
  "seveneighths",
  "onethird",
  "twothirds",
  "",
  "",
  "zerosuperior",
  "onesuperior",
  "twosuperior",
  "threesuperior",
  "foursuperior",
  "fivesuperior",
  "sixsuperior",
  "sevensuperior",
  "eightsuperior",
  "ninesuperior",
  "zeroinferior",
  "oneinferior",
  "twoinferior",
  "threeinferior",
  "fourinferior",
  "fiveinferior",
  "sixinferior",
  "seveninferior",
  "eightinferior",
  "nineinferior",
  "centinferior",
  "dollarinferior",
  "periodinferior",
  "commainferior",
  "Agravesmall",
  "Aacutesmall",
  "Acircumflexsmall",
  "Atildesmall",
  "Adieresissmall",
  "Aringsmall",
  "AEsmall",
  "Ccedillasmall",
  "Egravesmall",
  "Eacutesmall",
  "Ecircumflexsmall",
  "Edieresissmall",
  "Igravesmall",
  "Iacutesmall",
  "Icircumflexsmall",
  "Idieresissmall",
  "Ethsmall",
  "Ntildesmall",
  "Ogravesmall",
  "Oacutesmall",
  "Ocircumflexsmall",
  "Otildesmall",
  "Odieresissmall",
  "OEsmall",
  "Oslashsmall",
  "Ugravesmall",
  "Uacutesmall",
  "Ucircumflexsmall",
  "Udieresissmall",
  "Yacutesmall",
  "Thornsmall",
  "Ydieresissmall"
], ol = [
  ".notdef",
  "space",
  "exclam",
  "quotedbl",
  "numbersign",
  "dollar",
  "percent",
  "ampersand",
  "quoteright",
  "parenleft",
  "parenright",
  "asterisk",
  "plus",
  "comma",
  "hyphen",
  "period",
  "slash",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "colon",
  "semicolon",
  "less",
  "equal",
  "greater",
  "question",
  "at",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "bracketleft",
  "backslash",
  "bracketright",
  "asciicircum",
  "underscore",
  "quoteleft",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "braceleft",
  "bar",
  "braceright",
  "asciitilde",
  "exclamdown",
  "cent",
  "sterling",
  "fraction",
  "yen",
  "florin",
  "section",
  "currency",
  "quotesingle",
  "quotedblleft",
  "guillemotleft",
  "guilsinglleft",
  "guilsinglright",
  "fi",
  "fl",
  "endash",
  "dagger",
  "daggerdbl",
  "periodcentered",
  "paragraph",
  "bullet",
  "quotesinglbase",
  "quotedblbase",
  "quotedblright",
  "guillemotright",
  "ellipsis",
  "perthousand",
  "questiondown",
  "grave",
  "acute",
  "circumflex",
  "tilde",
  "macron",
  "breve",
  "dotaccent",
  "dieresis",
  "ring",
  "cedilla",
  "hungarumlaut",
  "ogonek",
  "caron",
  "emdash",
  "AE",
  "ordfeminine",
  "Lslash",
  "Oslash",
  "OE",
  "ordmasculine",
  "ae",
  "dotlessi",
  "lslash",
  "oslash",
  "oe",
  "germandbls",
  "onesuperior",
  "logicalnot",
  "mu",
  "trademark",
  "Eth",
  "onehalf",
  "plusminus",
  "Thorn",
  "onequarter",
  "divide",
  "brokenbar",
  "degree",
  "thorn",
  "threequarters",
  "twosuperior",
  "registered",
  "minus",
  "eth",
  "multiply",
  "threesuperior",
  "copyright",
  "Aacute",
  "Acircumflex",
  "Adieresis",
  "Agrave",
  "Aring",
  "Atilde",
  "Ccedilla",
  "Eacute",
  "Ecircumflex",
  "Edieresis",
  "Egrave",
  "Iacute",
  "Icircumflex",
  "Idieresis",
  "Igrave",
  "Ntilde",
  "Oacute",
  "Ocircumflex",
  "Odieresis",
  "Ograve",
  "Otilde",
  "Scaron",
  "Uacute",
  "Ucircumflex",
  "Udieresis",
  "Ugrave",
  "Yacute",
  "Ydieresis",
  "Zcaron",
  "aacute",
  "acircumflex",
  "adieresis",
  "agrave",
  "aring",
  "atilde",
  "ccedilla",
  "eacute",
  "ecircumflex",
  "edieresis",
  "egrave",
  "iacute",
  "icircumflex",
  "idieresis",
  "igrave",
  "ntilde",
  "oacute",
  "ocircumflex",
  "odieresis",
  "ograve",
  "otilde",
  "scaron",
  "uacute",
  "ucircumflex",
  "udieresis",
  "ugrave",
  "yacute",
  "ydieresis",
  "zcaron"
], Uf = [
  ".notdef",
  "space",
  "exclamsmall",
  "Hungarumlautsmall",
  "dollaroldstyle",
  "dollarsuperior",
  "ampersandsmall",
  "Acutesmall",
  "parenleftsuperior",
  "parenrightsuperior",
  "twodotenleader",
  "onedotenleader",
  "comma",
  "hyphen",
  "period",
  "fraction",
  "zerooldstyle",
  "oneoldstyle",
  "twooldstyle",
  "threeoldstyle",
  "fouroldstyle",
  "fiveoldstyle",
  "sixoldstyle",
  "sevenoldstyle",
  "eightoldstyle",
  "nineoldstyle",
  "colon",
  "semicolon",
  "commasuperior",
  "threequartersemdash",
  "periodsuperior",
  "questionsmall",
  "asuperior",
  "bsuperior",
  "centsuperior",
  "dsuperior",
  "esuperior",
  "isuperior",
  "lsuperior",
  "msuperior",
  "nsuperior",
  "osuperior",
  "rsuperior",
  "ssuperior",
  "tsuperior",
  "ff",
  "fi",
  "fl",
  "ffi",
  "ffl",
  "parenleftinferior",
  "parenrightinferior",
  "Circumflexsmall",
  "hyphensuperior",
  "Gravesmall",
  "Asmall",
  "Bsmall",
  "Csmall",
  "Dsmall",
  "Esmall",
  "Fsmall",
  "Gsmall",
  "Hsmall",
  "Ismall",
  "Jsmall",
  "Ksmall",
  "Lsmall",
  "Msmall",
  "Nsmall",
  "Osmall",
  "Psmall",
  "Qsmall",
  "Rsmall",
  "Ssmall",
  "Tsmall",
  "Usmall",
  "Vsmall",
  "Wsmall",
  "Xsmall",
  "Ysmall",
  "Zsmall",
  "colonmonetary",
  "onefitted",
  "rupiah",
  "Tildesmall",
  "exclamdownsmall",
  "centoldstyle",
  "Lslashsmall",
  "Scaronsmall",
  "Zcaronsmall",
  "Dieresissmall",
  "Brevesmall",
  "Caronsmall",
  "Dotaccentsmall",
  "Macronsmall",
  "figuredash",
  "hypheninferior",
  "Ogoneksmall",
  "Ringsmall",
  "Cedillasmall",
  "onequarter",
  "onehalf",
  "threequarters",
  "questiondownsmall",
  "oneeighth",
  "threeeighths",
  "fiveeighths",
  "seveneighths",
  "onethird",
  "twothirds",
  "zerosuperior",
  "onesuperior",
  "twosuperior",
  "threesuperior",
  "foursuperior",
  "fivesuperior",
  "sixsuperior",
  "sevensuperior",
  "eightsuperior",
  "ninesuperior",
  "zeroinferior",
  "oneinferior",
  "twoinferior",
  "threeinferior",
  "fourinferior",
  "fiveinferior",
  "sixinferior",
  "seveninferior",
  "eightinferior",
  "nineinferior",
  "centinferior",
  "dollarinferior",
  "periodinferior",
  "commainferior",
  "Agravesmall",
  "Aacutesmall",
  "Acircumflexsmall",
  "Atildesmall",
  "Adieresissmall",
  "Aringsmall",
  "AEsmall",
  "Ccedillasmall",
  "Egravesmall",
  "Eacutesmall",
  "Ecircumflexsmall",
  "Edieresissmall",
  "Igravesmall",
  "Iacutesmall",
  "Icircumflexsmall",
  "Idieresissmall",
  "Ethsmall",
  "Ntildesmall",
  "Ogravesmall",
  "Oacutesmall",
  "Ocircumflexsmall",
  "Otildesmall",
  "Odieresissmall",
  "OEsmall",
  "Oslashsmall",
  "Ugravesmall",
  "Uacutesmall",
  "Ucircumflexsmall",
  "Udieresissmall",
  "Yacutesmall",
  "Thornsmall",
  "Ydieresissmall"
], Nf = [
  ".notdef",
  "space",
  "dollaroldstyle",
  "dollarsuperior",
  "parenleftsuperior",
  "parenrightsuperior",
  "twodotenleader",
  "onedotenleader",
  "comma",
  "hyphen",
  "period",
  "fraction",
  "zerooldstyle",
  "oneoldstyle",
  "twooldstyle",
  "threeoldstyle",
  "fouroldstyle",
  "fiveoldstyle",
  "sixoldstyle",
  "sevenoldstyle",
  "eightoldstyle",
  "nineoldstyle",
  "colon",
  "semicolon",
  "commasuperior",
  "threequartersemdash",
  "periodsuperior",
  "asuperior",
  "bsuperior",
  "centsuperior",
  "dsuperior",
  "esuperior",
  "isuperior",
  "lsuperior",
  "msuperior",
  "nsuperior",
  "osuperior",
  "rsuperior",
  "ssuperior",
  "tsuperior",
  "ff",
  "fi",
  "fl",
  "ffi",
  "ffl",
  "parenleftinferior",
  "parenrightinferior",
  "hyphensuperior",
  "colonmonetary",
  "onefitted",
  "rupiah",
  "centoldstyle",
  "figuredash",
  "hypheninferior",
  "onequarter",
  "onehalf",
  "threequarters",
  "oneeighth",
  "threeeighths",
  "fiveeighths",
  "seveneighths",
  "onethird",
  "twothirds",
  "zerosuperior",
  "onesuperior",
  "twosuperior",
  "threesuperior",
  "foursuperior",
  "fivesuperior",
  "sixsuperior",
  "sevensuperior",
  "eightsuperior",
  "ninesuperior",
  "zeroinferior",
  "oneinferior",
  "twoinferior",
  "threeinferior",
  "fourinferior",
  "fiveinferior",
  "sixinferior",
  "seveninferior",
  "eightinferior",
  "nineinferior",
  "centinferior",
  "dollarinferior",
  "periodinferior",
  "commainferior"
], ll = new F({
  reserved: new Ie(h),
  reqFeatureIndex: h,
  featureCount: h,
  featureIndexes: new S(h, "featureCount")
}), zf = new F({
  tag: new Se(4),
  langSys: new P(h, ll, {
    type: "parent"
  })
}), Gf = new F({
  defaultLangSys: new P(h, ll),
  count: h,
  langSysRecords: new S(zf, "count")
}), Hf = new F({
  tag: new Se(4),
  script: new P(h, Gf, {
    type: "parent"
  })
}), cl = new S(Hf, h), Wf = new F({
  version: h,
  nameID: h
}), fl = new F({
  featureParams: new P(h, Wf),
  lookupCount: h,
  lookupListIndexes: new S(h, "lookupCount")
}), Vf = new F({
  tag: new Se(4),
  feature: new P(h, fl, {
    type: "parent"
  })
}), ul = new S(Vf, h), _f = new F({
  markAttachmentType: H,
  flags: new m0(H, [
    "rightToLeft",
    "ignoreBaseGlyphs",
    "ignoreLigatures",
    "ignoreMarks",
    "useMarkFilteringSet"
  ])
});
function Fn(n) {
  let e = new F({
    lookupType: h,
    flags: _f,
    subTableCount: h,
    subTables: new S(new P(h, n), "subTableCount"),
    markFilteringSet: new kn(h, (t) => t.flags.flags.useMarkFilteringSet)
  });
  return new ke(new P(h, e), h);
}
let qf = new F({
  start: h,
  end: h,
  startCoverageIndex: h
}), Ce = new fe(h, {
  1: {
    glyphCount: h,
    glyphs: new S(h, "glyphCount")
  },
  2: {
    rangeCount: h,
    rangeRecords: new S(qf, "rangeCount")
  }
}), $f = new F({
  start: h,
  end: h,
  class: h
}), ht = new fe(h, {
  1: {
    startGlyph: h,
    glyphCount: h,
    classValueArray: new S(h, "glyphCount")
  },
  2: {
    classRangeCount: h,
    classRangeRecord: new S($f, "classRangeCount")
  }
}), lt = new F({
  a: h,
  b: h,
  deltaFormat: h
}), Gr = new F({
  sequenceIndex: h,
  lookupListIndex: h
}), Xf = new F({
  glyphCount: h,
  lookupCount: h,
  input: new S(h, (n) => n.glyphCount - 1),
  lookupRecords: new S(Gr, "lookupCount")
}), jf = new S(new P(h, Xf), h), Yf = new F({
  glyphCount: h,
  lookupCount: h,
  classes: new S(h, (n) => n.glyphCount - 1),
  lookupRecords: new S(Gr, "lookupCount")
}), Kf = new S(new P(h, Yf), h), hl = new fe(h, {
  1: {
    coverage: new P(h, Ce),
    ruleSetCount: h,
    ruleSets: new S(new P(h, jf), "ruleSetCount")
  },
  2: {
    coverage: new P(h, Ce),
    classDef: new P(h, ht),
    classSetCnt: h,
    classSet: new S(new P(h, Kf), "classSetCnt")
  },
  3: {
    glyphCount: h,
    lookupCount: h,
    coverages: new S(new P(h, Ce), "glyphCount"),
    lookupRecords: new S(Gr, "lookupCount")
  }
}), Zf = new F({
  backtrackGlyphCount: h,
  backtrack: new S(h, "backtrackGlyphCount"),
  inputGlyphCount: h,
  input: new S(h, (n) => n.inputGlyphCount - 1),
  lookaheadGlyphCount: h,
  lookahead: new S(h, "lookaheadGlyphCount"),
  lookupCount: h,
  lookupRecords: new S(Gr, "lookupCount")
}), Ha = new S(new P(h, Zf), h), dl = new fe(h, {
  1: {
    coverage: new P(h, Ce),
    chainCount: h,
    chainRuleSets: new S(new P(h, Ha), "chainCount")
  },
  2: {
    coverage: new P(h, Ce),
    backtrackClassDef: new P(h, ht),
    inputClassDef: new P(h, ht),
    lookaheadClassDef: new P(h, ht),
    chainCount: h,
    chainClassSet: new S(new P(h, Ha), "chainCount")
  },
  3: {
    backtrackGlyphCount: h,
    backtrackCoverage: new S(new P(h, Ce), "backtrackGlyphCount"),
    inputGlyphCount: h,
    inputCoverage: new S(new P(h, Ce), "inputGlyphCount"),
    lookaheadGlyphCount: h,
    lookaheadCoverage: new S(new P(h, Ce), "lookaheadGlyphCount"),
    lookupCount: h,
    lookupRecords: new S(Gr, "lookupCount")
  }
}), yr = new Ot(16, "BE", 14), Jf = new F({
  startCoord: yr,
  peakCoord: yr,
  endCoord: yr
}), Qf = new F({
  axisCount: h,
  regionCount: h,
  variationRegions: new S(new S(Jf, "axisCount"), "regionCount")
}), eu = new F({
  shortDeltas: new S(U, (n) => n.parent.shortDeltaCount),
  regionDeltas: new S(Ue, (n) => n.parent.regionIndexCount - n.parent.shortDeltaCount),
  deltas: (n) => n.shortDeltas.concat(n.regionDeltas)
}), tu = new F({
  itemCount: h,
  shortDeltaCount: h,
  regionIndexCount: h,
  regionIndexes: new S(h, "regionIndexCount"),
  deltaSets: new S(eu, "itemCount")
}), Yn = new F({
  format: h,
  variationRegionList: new P(T, Qf),
  variationDataCount: h,
  itemVariationData: new S(new P(T, tu), "variationDataCount")
}), ru = new fe(h, {
  1: {
    axisIndex: h,
    axisIndex: h,
    filterRangeMinValue: yr,
    filterRangeMaxValue: yr
  }
}), nu = new F({
  conditionCount: h,
  conditionTable: new S(new P(T, ru), "conditionCount")
}), su = new F({
  featureIndex: h,
  alternateFeatureTable: new P(T, fl, {
    type: "parent"
  })
}), iu = new F({
  version: De,
  substitutionCount: h,
  substitutions: new S(su, "substitutionCount")
}), au = new F({
  conditionSet: new P(T, nu, {
    type: "parent"
  }),
  featureTableSubstitution: new P(T, iu, {
    type: "parent"
  })
}), xl = new F({
  majorVersion: h,
  minorVersion: h,
  featureVariationRecordCount: T,
  featureVariationRecords: new S(au, "featureVariationRecordCount")
});
class bl {
  decode(e, t, r) {
    return this.predefinedOps[r[0]] ? this.predefinedOps[r[0]] : this.type.decode(e, t, r);
  }
  size(e, t) {
    return this.type.size(e, t);
  }
  encode(e, t, r) {
    let s = this.predefinedOps.indexOf(t);
    return s !== -1 ? s : this.type.encode(e, t, r);
  }
  constructor(e, t) {
    this.predefinedOps = e, this.type = t;
  }
}
class ou extends ye {
  decode(e) {
    return H.decode(e) & 127;
  }
  constructor() {
    super("UInt8");
  }
}
let pl = new F({
  first: h,
  nLeft: H
}), lu = new F({
  first: h,
  nLeft: h
}), cu = new fe(new ou(), {
  0: {
    nCodes: H,
    codes: new S(H, "nCodes")
  },
  1: {
    nRanges: H,
    ranges: new S(pl, "nRanges")
  }
}), fu = new bl([
  al,
  Rf
], new b0(cu, {
  lazy: !0
}));
class Wa extends S {
  decode(e, t) {
    let r = M0(this.length, e, t), s = 0, i = [];
    for (; s < r; ) {
      let a = this.type.decode(e, t);
      a.offset = s, s += a.nLeft + 1, i.push(a);
    }
    return i;
  }
}
let uu = new fe(H, {
  0: {
    glyphs: new S(h, (n) => n.parent.CharStrings.length - 1)
  },
  1: {
    ranges: new Wa(pl, (n) => n.parent.CharStrings.length - 1)
  },
  2: {
    ranges: new Wa(lu, (n) => n.parent.CharStrings.length - 1)
  }
}), hu = new bl([
  ol,
  Uf,
  Nf
], new b0(uu, {
  lazy: !0
})), du = new F({
  first: h,
  fd: H
}), xu = new F({
  first: T,
  fd: h
}), gl = new fe(H, {
  0: {
    fds: new S(H, (n) => n.parent.CharStrings.length)
  },
  3: {
    nRanges: h,
    ranges: new S(du, "nRanges"),
    sentinel: h
  },
  4: {
    nRanges: T,
    ranges: new S(xu, "nRanges"),
    sentinel: T
  }
}), Ds = new b0(ii);
class ml {
  decode(e, t, r) {
    return t.length = r[0], Ds.decode(e, t, [
      r[1]
    ]);
  }
  size(e, t) {
    return [
      ii.size(e, t, !1),
      Ds.size(e, t)[0]
    ];
  }
  encode(e, t, r) {
    return [
      ii.size(t, r, !1),
      Ds.encode(e, t, r)[0]
    ];
  }
}
let Al = new jn([
  // key       name                   type(s)                                 default
  [
    18,
    "Private",
    new ml(),
    null
  ],
  [
    [
      12,
      38
    ],
    "FontName",
    "sid",
    null
  ],
  [
    [
      12,
      7
    ],
    "FontMatrix",
    "array",
    [
      1e-3,
      0,
      0,
      1e-3,
      0,
      0
    ]
  ],
  [
    [
      12,
      5
    ],
    "PaintType",
    "number",
    0
  ]
]), bu = new jn([
  // key       name                   type(s)                                 default
  [
    [
      12,
      30
    ],
    "ROS",
    [
      "sid",
      "sid",
      "number"
    ],
    null
  ],
  [
    0,
    "version",
    "sid",
    null
  ],
  [
    1,
    "Notice",
    "sid",
    null
  ],
  [
    [
      12,
      0
    ],
    "Copyright",
    "sid",
    null
  ],
  [
    2,
    "FullName",
    "sid",
    null
  ],
  [
    3,
    "FamilyName",
    "sid",
    null
  ],
  [
    4,
    "Weight",
    "sid",
    null
  ],
  [
    [
      12,
      1
    ],
    "isFixedPitch",
    "boolean",
    !1
  ],
  [
    [
      12,
      2
    ],
    "ItalicAngle",
    "number",
    0
  ],
  [
    [
      12,
      3
    ],
    "UnderlinePosition",
    "number",
    -100
  ],
  [
    [
      12,
      4
    ],
    "UnderlineThickness",
    "number",
    50
  ],
  [
    [
      12,
      5
    ],
    "PaintType",
    "number",
    0
  ],
  [
    [
      12,
      6
    ],
    "CharstringType",
    "number",
    2
  ],
  [
    [
      12,
      7
    ],
    "FontMatrix",
    "array",
    [
      1e-3,
      0,
      0,
      1e-3,
      0,
      0
    ]
  ],
  [
    13,
    "UniqueID",
    "number",
    null
  ],
  [
    5,
    "FontBBox",
    "array",
    [
      0,
      0,
      0,
      0
    ]
  ],
  [
    [
      12,
      8
    ],
    "StrokeWidth",
    "number",
    0
  ],
  [
    14,
    "XUID",
    "array",
    null
  ],
  [
    15,
    "charset",
    hu,
    ol
  ],
  [
    16,
    "Encoding",
    fu,
    al
  ],
  [
    17,
    "CharStrings",
    new b0(new E0()),
    null
  ],
  [
    18,
    "Private",
    new ml(),
    null
  ],
  [
    [
      12,
      20
    ],
    "SyntheticBase",
    "number",
    null
  ],
  [
    [
      12,
      21
    ],
    "PostScript",
    "sid",
    null
  ],
  [
    [
      12,
      22
    ],
    "BaseFontName",
    "sid",
    null
  ],
  [
    [
      12,
      23
    ],
    "BaseFontBlend",
    "delta",
    null
  ],
  // CID font specific
  [
    [
      12,
      31
    ],
    "CIDFontVersion",
    "number",
    0
  ],
  [
    [
      12,
      32
    ],
    "CIDFontRevision",
    "number",
    0
  ],
  [
    [
      12,
      33
    ],
    "CIDFontType",
    "number",
    0
  ],
  [
    [
      12,
      34
    ],
    "CIDCount",
    "number",
    8720
  ],
  [
    [
      12,
      35
    ],
    "UIDBase",
    "number",
    null
  ],
  [
    [
      12,
      37
    ],
    "FDSelect",
    new b0(gl),
    null
  ],
  [
    [
      12,
      36
    ],
    "FDArray",
    new b0(new E0(Al)),
    null
  ],
  [
    [
      12,
      38
    ],
    "FontName",
    "sid",
    null
  ]
]), pu = new F({
  length: h,
  itemVariationStore: Yn
}), gu = new jn([
  [
    [
      12,
      7
    ],
    "FontMatrix",
    "array",
    [
      1e-3,
      0,
      0,
      1e-3,
      0,
      0
    ]
  ],
  [
    17,
    "CharStrings",
    new b0(new E0()),
    null
  ],
  [
    [
      12,
      37
    ],
    "FDSelect",
    new b0(gl),
    null
  ],
  [
    [
      12,
      36
    ],
    "FDArray",
    new b0(new E0(Al)),
    null
  ],
  [
    24,
    "vstore",
    new b0(pu),
    null
  ],
  [
    25,
    "maxstack",
    "number",
    193
  ]
]), mu = new fe(Qc, {
  1: {
    hdrSize: H,
    offSize: H,
    nameIndex: new E0(new Se("length")),
    topDictIndex: new E0(bu),
    stringIndex: new E0(new Se("length")),
    globalSubrIndex: new E0()
  },
  2: {
    hdrSize: H,
    length: h,
    topDict: gu,
    globalSubrIndex: new E0()
  }
});
var wl = mu;
class Ui {
  static decode(e) {
    return new Ui(e);
  }
  decode() {
    this.stream.pos;
    let e = wl.decode(this.stream);
    for (let t in e) {
      let r = e[t];
      this[t] = r;
    }
    if (this.version < 2) {
      if (this.topDictIndex.length !== 1) throw new Error("Only a single font is allowed in CFF");
      this.topDict = this.topDictIndex[0];
    }
    return this.isCIDFont = this.topDict.ROS != null, this;
  }
  string(e) {
    return this.version >= 2 ? null : e < dn.length ? dn[e] : this.stringIndex[e - dn.length];
  }
  get postscriptName() {
    return this.version < 2 ? this.nameIndex[0] : null;
  }
  get fullName() {
    return this.string(this.topDict.FullName);
  }
  get familyName() {
    return this.string(this.topDict.FamilyName);
  }
  getCharString(e) {
    return this.stream.pos = this.topDict.CharStrings[e].offset, this.stream.readBuffer(this.topDict.CharStrings[e].length);
  }
  getGlyphName(e) {
    if (this.version >= 2 || this.isCIDFont) return null;
    let { charset: t } = this.topDict;
    if (Array.isArray(t)) return t[e];
    if (e === 0) return ".notdef";
    switch (e -= 1, t.version) {
      case 0:
        return this.string(t.glyphs[e]);
      case 1:
      case 2:
        for (let r = 0; r < t.ranges.length; r++) {
          let s = t.ranges[r];
          if (s.offset <= e && e <= s.offset + s.nLeft) return this.string(s.first + (e - s.offset));
        }
        break;
    }
    return null;
  }
  fdForGlyph(e) {
    if (!this.topDict.FDSelect) return null;
    switch (this.topDict.FDSelect.version) {
      case 0:
        return this.topDict.FDSelect.fds[e];
      case 3:
      case 4:
        let { ranges: t } = this.topDict.FDSelect, r = 0, s = t.length - 1;
        for (; r <= s; ) {
          let i = r + s >> 1;
          if (e < t[i].first) s = i - 1;
          else if (i < s && e >= t[i + 1].first) r = i + 1;
          else return t[i].fd;
        }
      default:
        throw new Error(`Unknown FDSelect version: ${this.topDict.FDSelect.version}`);
    }
  }
  privateDictForGlyph(e) {
    if (this.topDict.FDSelect) {
      let t = this.fdForGlyph(e);
      return this.topDict.FDArray[t] ? this.topDict.FDArray[t].Private : null;
    }
    return this.version < 2 ? this.topDict.Private : this.topDict.FDArray[0].Private;
  }
  constructor(e) {
    this.stream = e, this.decode();
  }
}
var vl = Ui;
let Au = new F({
  glyphIndex: h,
  vertOriginY: U
});
var wu = new F({
  majorVersion: h,
  minorVersion: h,
  defaultVertOriginY: U,
  numVertOriginYMetrics: h,
  metrics: new S(Au, "numVertOriginYMetrics")
});
let Kt = new F({
  height: H,
  width: H,
  horiBearingX: Ue,
  horiBearingY: Ue,
  horiAdvance: H,
  vertBearingX: Ue,
  vertBearingY: Ue,
  vertAdvance: H
}), Yr = new F({
  height: H,
  width: H,
  bearingX: Ue,
  bearingY: Ue,
  advance: H
}), Va = new F({
  glyph: h,
  xOffset: Ue,
  yOffset: Ue
});
class _a {
}
class Ms {
}
new fe("version", {
  1: {
    metrics: Yr,
    data: _a
  },
  2: {
    metrics: Yr,
    data: Ms
  },
  // format 3 is deprecated
  // format 4 is not supported by Microsoft
  5: {
    data: Ms
  },
  6: {
    metrics: Kt,
    data: _a
  },
  7: {
    metrics: Kt,
    data: Ms
  },
  8: {
    metrics: Yr,
    pad: new Ie(H),
    numComponents: h,
    components: new S(Va, "numComponents")
  },
  9: {
    metrics: Kt,
    pad: new Ie(H),
    numComponents: h,
    components: new S(Va, "numComponents")
  },
  17: {
    metrics: Yr,
    dataLen: T,
    data: new D0("dataLen")
  },
  18: {
    metrics: Kt,
    dataLen: T,
    data: new D0("dataLen")
  },
  19: {
    dataLen: T,
    data: new D0("dataLen")
  }
});
let qa = new F({
  ascender: Ue,
  descender: Ue,
  widthMax: H,
  caretSlopeNumerator: Ue,
  caretSlopeDenominator: Ue,
  caretOffset: Ue,
  minOriginSB: Ue,
  minAdvanceSB: Ue,
  maxBeforeBL: Ue,
  minAfterBL: Ue,
  pad: new Ie(Ue, 2)
}), vu = new F({
  glyphCode: h,
  offset: h
}), yu = new fe(h, {
  header: {
    imageFormat: h,
    imageDataOffset: T
  },
  1: {
    offsetArray: new S(T, (n) => n.parent.lastGlyphIndex - n.parent.firstGlyphIndex + 1)
  },
  2: {
    imageSize: T,
    bigMetrics: Kt
  },
  3: {
    offsetArray: new S(h, (n) => n.parent.lastGlyphIndex - n.parent.firstGlyphIndex + 1)
  },
  4: {
    numGlyphs: T,
    glyphArray: new S(vu, (n) => n.numGlyphs + 1)
  },
  5: {
    imageSize: T,
    bigMetrics: Kt,
    numGlyphs: T,
    glyphCodeArray: new S(h, "numGlyphs")
  }
}), Cu = new F({
  firstGlyphIndex: h,
  lastGlyphIndex: h,
  subtable: new P(T, yu)
}), Su = new F({
  indexSubTableArray: new P(T, new S(Cu, 1), {
    type: "parent"
  }),
  indexTablesSize: T,
  numberOfIndexSubTables: T,
  colorRef: T,
  hori: qa,
  vert: qa,
  startGlyphIndex: h,
  endGlyphIndex: h,
  ppemX: H,
  ppemY: H,
  bitDepth: H,
  flags: new m0(H, [
    "horizontal",
    "vertical"
  ])
});
var ku = new F({
  version: T,
  numSizes: T,
  sizes: new S(Su, "numSizes")
});
let Pu = new F({
  ppem: h,
  resolution: h,
  imageOffsets: new S(new P(T, "void"), (n) => n.parent.parent.maxp.numGlyphs + 1)
});
var Tu = new F({
  version: h,
  flags: new m0(h, [
    "renderOutlines"
  ]),
  numImgTables: T,
  imageTables: new S(new P(T, Pu), "numImgTables")
});
let Iu = new F({
  gid: h,
  paletteIndex: h
  // Index value to use in the appropriate palette. This value must
}), Eu = new F({
  gid: h,
  // and is not rendered for color.
  firstLayerIndex: h,
  // There will be numLayers consecutive entries for this base glyph.
  numLayers: h
});
var Fu = new F({
  version: h,
  numBaseGlyphRecords: h,
  baseGlyphRecord: new P(T, new S(Eu, "numBaseGlyphRecords")),
  layerRecords: new P(T, new S(Iu, "numLayerRecords"), {
    lazy: !0
  }),
  numLayerRecords: h
});
let Bu = new F({
  blue: H,
  green: H,
  red: H,
  alpha: H
});
var Ou = new fe(h, {
  header: {
    numPaletteEntries: h,
    numPalettes: h,
    numColorRecords: h,
    colorRecords: new P(T, new S(Bu, "numColorRecords")),
    colorRecordIndices: new S(h, "numPalettes")
  },
  0: {},
  1: {
    offsetPaletteTypeArray: new P(T, new S(T, "numPalettes")),
    offsetPaletteLabelArray: new P(T, new S(h, "numPalettes")),
    offsetPaletteEntryLabelArray: new P(T, new S(h, "numPaletteEntries"))
  }
});
let Ir = new fe(h, {
  1: {
    coordinate: U
    // X or Y value, in design units
  },
  2: {
    coordinate: U,
    referenceGlyph: h,
    baseCoordPoint: h
    // Index of contour point on the referenceGlyph
  },
  3: {
    coordinate: U,
    deviceTable: new P(h, lt)
    // Device table for X or Y value
  }
}), Du = new F({
  defaultIndex: h,
  baseCoordCount: h,
  baseCoords: new S(new P(h, Ir), "baseCoordCount")
}), Mu = new F({
  tag: new Se(4),
  minCoord: new P(h, Ir, {
    type: "parent"
  }),
  maxCoord: new P(h, Ir, {
    type: "parent"
  })
  // May be NULL
}), yl = new F({
  minCoord: new P(h, Ir),
  maxCoord: new P(h, Ir),
  featMinMaxCount: h,
  featMinMaxRecords: new S(Mu, "featMinMaxCount")
  // In alphabetical order
}), Lu = new F({
  tag: new Se(4),
  minMax: new P(h, yl, {
    type: "parent"
  })
}), Ru = new F({
  baseValues: new P(h, Du),
  defaultMinMax: new P(h, yl),
  baseLangSysCount: h,
  baseLangSysRecords: new S(Lu, "baseLangSysCount")
  // in alphabetical order by BaseLangSysTag
}), Uu = new F({
  tag: new Se(4),
  script: new P(h, Ru, {
    type: "parent"
  })
}), Nu = new S(Uu, h), zu = new S(new Se(4), h), $a = new F({
  baseTagList: new P(h, zu),
  baseScriptList: new P(h, Nu)
});
var Gu = new fe(T, {
  header: {
    horizAxis: new P(h, $a),
    vertAxis: new P(h, $a)
    // May be NULL
  },
  65536: {},
  65537: {
    itemVariationStore: new P(T, Yn)
  }
});
let Hu = new S(h, h), Wu = new F({
  coverage: new P(h, Ce),
  glyphCount: h,
  attachPoints: new S(new P(h, Hu), "glyphCount")
}), Vu = new fe(h, {
  1: {
    coordinate: U
  },
  2: {
    caretValuePoint: h
  },
  3: {
    coordinate: U,
    deviceTable: new P(h, lt)
  }
}), _u = new S(new P(h, Vu), h), qu = new F({
  coverage: new P(h, Ce),
  ligGlyphCount: h,
  ligGlyphs: new S(new P(h, _u), "ligGlyphCount")
}), Xa = new F({
  markSetTableFormat: h,
  markSetCount: h,
  coverage: new S(new P(T, Ce), "markSetCount")
});
var $u = new fe(T, {
  header: {
    glyphClassDef: new P(h, ht),
    attachList: new P(h, Wu),
    ligCaretList: new P(h, qu),
    markAttachClassDef: new P(h, ht)
  },
  65536: {},
  65538: {
    markGlyphSetsDef: new P(h, Xa)
  },
  65539: {
    markGlyphSetsDef: new P(h, Xa),
    itemVariationStore: new P(T, Yn)
  }
});
let Gt = new m0(h, [
  "xPlacement",
  "yPlacement",
  "xAdvance",
  "yAdvance",
  "xPlaDevice",
  "yPlaDevice",
  "xAdvDevice",
  "yAdvDevice"
]), Xu = {
  xPlacement: U,
  yPlacement: U,
  xAdvance: U,
  yAdvance: U,
  xPlaDevice: new P(h, lt, {
    type: "global",
    relativeTo: (n) => n.rel
  }),
  yPlaDevice: new P(h, lt, {
    type: "global",
    relativeTo: (n) => n.rel
  }),
  xAdvDevice: new P(h, lt, {
    type: "global",
    relativeTo: (n) => n.rel
  }),
  yAdvDevice: new P(h, lt, {
    type: "global",
    relativeTo: (n) => n.rel
  })
};
class tr {
  buildStruct(e) {
    let t = e;
    for (; !t[this.key] && t.parent; ) t = t.parent;
    if (!t[this.key]) return;
    let r = {};
    r.rel = () => t._startOffset;
    let s = t[this.key];
    for (let i in s) s[i] && (r[i] = Xu[i]);
    return new F(r);
  }
  size(e, t) {
    return this.buildStruct(t).size(e, t);
  }
  decode(e, t) {
    let r = this.buildStruct(t).decode(e, t);
    return delete r.rel, r;
  }
  constructor(e = "valueFormat") {
    this.key = e;
  }
}
let ju = new F({
  secondGlyph: h,
  value1: new tr("valueFormat1"),
  value2: new tr("valueFormat2")
}), Yu = new S(ju, h), Ku = new F({
  value1: new tr("valueFormat1"),
  value2: new tr("valueFormat2")
}), Er = new fe(h, {
  1: {
    xCoordinate: U,
    yCoordinate: U
  },
  2: {
    xCoordinate: U,
    yCoordinate: U,
    anchorPoint: h
  },
  3: {
    xCoordinate: U,
    yCoordinate: U,
    xDeviceTable: new P(h, lt),
    yDeviceTable: new P(h, lt)
  }
}), Zu = new F({
  entryAnchor: new P(h, Er, {
    type: "parent"
  }),
  exitAnchor: new P(h, Er, {
    type: "parent"
  })
}), Ju = new F({
  class: h,
  markAnchor: new P(h, Er, {
    type: "parent"
  })
}), Ls = new S(Ju, h), Qu = new S(new P(h, Er), (n) => n.parent.classCount), ja = new S(Qu, h), eh = new S(new P(h, Er), (n) => n.parent.parent.classCount), th = new S(eh, h), rh = new S(new P(h, th), h), Fr = new fe("lookupType", {
  1: new fe(h, {
    1: {
      coverage: new P(h, Ce),
      valueFormat: Gt,
      value: new tr()
    },
    2: {
      coverage: new P(h, Ce),
      valueFormat: Gt,
      valueCount: h,
      values: new ke(new tr(), "valueCount")
    }
  }),
  2: new fe(h, {
    1: {
      coverage: new P(h, Ce),
      valueFormat1: Gt,
      valueFormat2: Gt,
      pairSetCount: h,
      pairSets: new ke(new P(h, Yu), "pairSetCount")
    },
    2: {
      coverage: new P(h, Ce),
      valueFormat1: Gt,
      valueFormat2: Gt,
      classDef1: new P(h, ht),
      classDef2: new P(h, ht),
      class1Count: h,
      class2Count: h,
      classRecords: new ke(new ke(Ku, "class2Count"), "class1Count")
    }
  }),
  3: {
    format: h,
    coverage: new P(h, Ce),
    entryExitCount: h,
    entryExitRecords: new S(Zu, "entryExitCount")
  },
  4: {
    format: h,
    markCoverage: new P(h, Ce),
    baseCoverage: new P(h, Ce),
    classCount: h,
    markArray: new P(h, Ls),
    baseArray: new P(h, ja)
  },
  5: {
    format: h,
    markCoverage: new P(h, Ce),
    ligatureCoverage: new P(h, Ce),
    classCount: h,
    markArray: new P(h, Ls),
    ligatureArray: new P(h, rh)
  },
  6: {
    format: h,
    mark1Coverage: new P(h, Ce),
    mark2Coverage: new P(h, Ce),
    classCount: h,
    mark1Array: new P(h, Ls),
    mark2Array: new P(h, ja)
  },
  7: hl,
  8: dl,
  9: {
    posFormat: h,
    lookupType: h,
    extension: new P(T, null)
  }
});
Fr.versions[9].extension.type = Fr;
var nh = new fe(T, {
  header: {
    scriptList: new P(h, cl),
    featureList: new P(h, ul),
    lookupList: new P(h, new Fn(Fr))
  },
  65536: {},
  65537: {
    featureVariations: new P(T, xl)
  }
});
let Cl = new S(h, h), sh = Cl, ih = new F({
  glyph: h,
  compCount: h,
  components: new S(h, (n) => n.compCount - 1)
}), ah = new S(new P(h, ih), h), ai = new fe("lookupType", {
  1: new fe(h, {
    1: {
      coverage: new P(h, Ce),
      deltaGlyphID: U
    },
    2: {
      coverage: new P(h, Ce),
      glyphCount: h,
      substitute: new ke(h, "glyphCount")
    }
  }),
  2: {
    substFormat: h,
    coverage: new P(h, Ce),
    count: h,
    sequences: new ke(new P(h, Cl), "count")
  },
  3: {
    substFormat: h,
    coverage: new P(h, Ce),
    count: h,
    alternateSet: new ke(new P(h, sh), "count")
  },
  4: {
    substFormat: h,
    coverage: new P(h, Ce),
    count: h,
    ligatureSets: new ke(new P(h, ah), "count")
  },
  5: hl,
  6: dl,
  7: {
    substFormat: h,
    lookupType: h,
    extension: new P(T, null)
  },
  8: {
    substFormat: h,
    coverage: new P(h, Ce),
    backtrackCoverage: new S(new P(h, Ce), "backtrackGlyphCount"),
    lookaheadGlyphCount: h,
    lookaheadCoverage: new S(new P(h, Ce), "lookaheadGlyphCount"),
    glyphCount: h,
    substitutes: new S(h, "glyphCount")
  }
});
ai.versions[7].extension.type = ai;
var oh = new fe(T, {
  header: {
    scriptList: new P(h, cl),
    featureList: new P(h, ul),
    lookupList: new P(h, new Fn(ai))
  },
  65536: {},
  65537: {
    featureVariations: new P(T, xl)
  }
});
let Z0 = new S(h, h), lh = new F({
  shrinkageEnableGSUB: new P(h, Z0),
  shrinkageDisableGSUB: new P(h, Z0),
  shrinkageEnableGPOS: new P(h, Z0),
  shrinkageDisableGPOS: new P(h, Z0),
  shrinkageJstfMax: new P(h, new Fn(Fr)),
  extensionEnableGSUB: new P(h, Z0),
  extensionDisableGSUB: new P(h, Z0),
  extensionEnableGPOS: new P(h, Z0),
  extensionDisableGPOS: new P(h, Z0),
  extensionJstfMax: new P(h, new Fn(Fr))
}), Sl = new S(new P(h, lh), h), ch = new F({
  tag: new Se(4),
  jstfLangSys: new P(h, Sl)
}), fh = new F({
  extenderGlyphs: new P(h, new S(h, h)),
  defaultLangSys: new P(h, Sl),
  langSysCount: h,
  langSysRecords: new S(ch, "langSysCount")
}), uh = new F({
  tag: new Se(4),
  script: new P(h, fh, {
    type: "parent"
  })
});
var hh = new F({
  version: T,
  scriptCount: h,
  scriptList: new S(uh, "scriptCount")
});
class dh {
  decode(e, t) {
    switch (this.size(0, t)) {
      case 1:
        return e.readUInt8();
      case 2:
        return e.readUInt16BE();
      case 3:
        return e.readUInt24BE();
      case 4:
        return e.readUInt32BE();
    }
  }
  size(e, t) {
    return M0(this._size, null, t);
  }
  constructor(e) {
    this._size = e;
  }
}
let xh = new F({
  entry: new dh((n) => ((n.parent.entryFormat & 48) >> 4) + 1),
  outerIndex: (n) => n.entry >> (n.parent.entryFormat & 15) + 1,
  innerIndex: (n) => n.entry & (1 << (n.parent.entryFormat & 15) + 1) - 1
}), Rs = new F({
  entryFormat: h,
  mapCount: h,
  mapData: new S(xh, "mapCount")
});
var bh = new F({
  majorVersion: h,
  minorVersion: h,
  itemVariationStore: new P(T, Yn),
  advanceWidthMapping: new P(T, Rs),
  LSBMapping: new P(T, Rs),
  RSBMapping: new P(T, Rs)
});
let ph = new F({
  format: T,
  length: T,
  offset: T
}), gh = new F({
  reserved: new Ie(h, 2),
  cbSignature: T,
  signature: new D0("cbSignature")
});
var mh = new F({
  ulVersion: T,
  usNumSigs: h,
  usFlag: h,
  signatures: new S(ph, "usNumSigs"),
  signatureBlocks: new S(gh, "usNumSigs")
});
let Ah = new F({
  rangeMaxPPEM: h,
  rangeGaspBehavior: new m0(h, [
    "grayscale",
    "gridfit",
    "symmetricSmoothing",
    "symmetricGridfit"
    // only in version 1, for ClearType
  ])
});
var wh = new F({
  version: h,
  numRanges: h,
  gaspRanges: new S(Ah, "numRanges")
  // Sorted by ppem
});
let vh = new F({
  pixelSize: H,
  maximumWidth: H,
  widths: new S(H, (n) => n.parent.parent.maxp.numGlyphs)
});
var yh = new F({
  version: h,
  numRecords: U,
  sizeDeviceRecord: Ct,
  records: new S(vh, "numRecords")
});
let Ch = new F({
  left: h,
  right: h,
  value: U
}), Ya = new F({
  firstGlyph: h,
  nGlyphs: h,
  offsets: new S(h, "nGlyphs"),
  max: (n) => n.offsets.length && Math.max.apply(Math, n.offsets)
}), Sh = new F({
  off: (n) => n._startOffset - n.parent.parent._startOffset,
  len: (n) => ((n.parent.leftTable.max - n.off) / n.parent.rowWidth + 1) * (n.parent.rowWidth / 2),
  values: new ke(U, "len")
}), Ka = new fe("format", {
  0: {
    nPairs: h,
    searchRange: h,
    entrySelector: h,
    rangeShift: h,
    pairs: new S(Ch, "nPairs")
  },
  2: {
    rowWidth: h,
    leftTable: new P(h, Ya, {
      type: "parent"
    }),
    rightTable: new P(h, Ya, {
      type: "parent"
    }),
    array: new P(h, Sh, {
      type: "parent"
    })
  },
  3: {
    glyphCount: h,
    kernValueCount: H,
    leftClassCount: H,
    rightClassCount: H,
    flags: H,
    kernValue: new S(U, "kernValueCount"),
    leftClass: new S(H, "glyphCount"),
    rightClass: new S(H, "glyphCount"),
    kernIndex: new S(H, (n) => n.leftClassCount * n.rightClassCount)
  }
}), Za = new fe("version", {
  0: {
    subVersion: h,
    length: h,
    format: H,
    coverage: new m0(H, [
      "horizontal",
      "minimum",
      "crossStream",
      "override"
      // If set to 1 the value in this table replaces the accumulated value
    ]),
    subtable: Ka,
    padding: new Ie(H, (n) => n.length - n._currentOffset)
  },
  1: {
    length: T,
    coverage: new m0(H, [
      null,
      null,
      null,
      null,
      null,
      "variation",
      "crossStream",
      "vertical"
      // Set if table has vertical kerning values
    ]),
    format: H,
    tupleIndex: h,
    subtable: Ka,
    padding: new Ie(H, (n) => n.length - n._currentOffset)
  }
});
var kh = new fe(h, {
  0: {
    nTables: h,
    tables: new S(Za, "nTables")
  },
  1: {
    reserved: new Ie(h),
    nTables: T,
    tables: new S(Za, "nTables")
  }
}), Ph = new F({
  version: h,
  numGlyphs: h,
  yPels: new S(H, "numGlyphs")
}), Th = new F({
  version: h,
  fontNumber: T,
  pitch: h,
  xHeight: h,
  style: h,
  typeFamily: h,
  capHeight: h,
  symbolSet: h,
  typeface: new Se(16),
  characterComplement: new Se(8),
  fileName: new Se(6),
  strokeWeight: new Se(1),
  widthType: new Se(1),
  serifStyle: H,
  reserved: new Ie(H)
});
let Ih = new F({
  bCharSet: H,
  xRatio: H,
  yStartRatio: H,
  yEndRatio: H
  // Ending y-Ratio value
}), Eh = new F({
  yPelHeight: h,
  yMax: U,
  yMin: U
  // Minimum value (in pels) for this yPelHeight
}), Fh = new F({
  recs: h,
  startsz: H,
  endsz: H,
  entries: new S(Eh, "recs")
  // The VDMX records
});
var Bh = new F({
  version: h,
  numRecs: h,
  numRatios: h,
  ratioRanges: new S(Ih, "numRatios"),
  offsets: new S(h, "numRatios"),
  groups: new S(Fh, "numRecs")
  // The actual VDMX groupings
}), Oh = new F({
  version: h,
  ascent: U,
  descent: U,
  lineGap: U,
  advanceHeightMax: U,
  minTopSideBearing: U,
  minBottomSideBearing: U,
  yMaxExtent: U,
  caretSlopeRise: U,
  caretSlopeRun: U,
  caretOffset: U,
  reserved: new Ie(U, 4),
  metricDataFormat: U,
  numberOfMetrics: h
  // Number of advance heights in the Vertical Metrics table
});
let Dh = new F({
  advance: h,
  bearing: U
  // The top sidebearing of the glyph
});
var Mh = new F({
  metrics: new ke(Dh, (n) => n.parent.vhea.numberOfMetrics),
  bearings: new ke(U, (n) => n.parent.maxp.numGlyphs - n.parent.vhea.numberOfMetrics)
});
let Ja = new Ot(16, "BE", 14), Lh = new F({
  fromCoord: Ja,
  toCoord: Ja
}), Rh = new F({
  pairCount: h,
  correspondence: new S(Lh, "pairCount")
});
var Uh = new F({
  version: De,
  axisCount: T,
  segment: new S(Rh, "axisCount")
});
class Nh {
  getItem(e) {
    if (this._items[e] == null) {
      let t = this.stream.pos;
      this.stream.pos = this.base + this.type.size(null, this.parent) * e, this._items[e] = this.type.decode(this.stream, this.parent), this.stream.pos = t;
    }
    return this._items[e];
  }
  inspect() {
    return `[UnboundedArray ${this.type.constructor.name}]`;
  }
  constructor(e, t, r) {
    this.type = e, this.stream = t, this.parent = r, this.base = this.stream.pos, this._items = [];
  }
}
class O0 extends S {
  decode(e, t) {
    return new Nh(this.type, e, t);
  }
  constructor(e) {
    super(e, 0);
  }
}
let xt = function(n = h) {
  class e {
    decode(o, l) {
      return l = l.parent.parent, this.type.decode(o, l);
    }
    size(o, l) {
      return l = l.parent.parent, this.type.size(o, l);
    }
    encode(o, l, f) {
      return f = f.parent.parent, this.type.encode(o, l, f);
    }
    constructor(o) {
      this.type = o;
    }
  }
  n = new e(n);
  let t = new F({
    unitSize: h,
    nUnits: h,
    searchRange: h,
    entrySelector: h,
    rangeShift: h
  }), r = new F({
    lastGlyph: h,
    firstGlyph: h,
    value: n
  }), s = new F({
    lastGlyph: h,
    firstGlyph: h,
    values: new P(h, new S(n, (a) => a.lastGlyph - a.firstGlyph + 1), {
      type: "parent"
    })
  }), i = new F({
    glyph: h,
    value: n
  });
  return new fe(h, {
    0: {
      values: new O0(n)
      // length == number of glyphs maybe?
    },
    2: {
      binarySearchHeader: t,
      segments: new S(r, (a) => a.binarySearchHeader.nUnits)
    },
    4: {
      binarySearchHeader: t,
      segments: new S(s, (a) => a.binarySearchHeader.nUnits)
    },
    6: {
      binarySearchHeader: t,
      segments: new S(i, (a) => a.binarySearchHeader.nUnits)
    },
    8: {
      firstGlyph: h,
      count: h,
      values: new S(n, "count")
    }
  });
};
function Kr(n = {}, e = h) {
  let t = Object.assign({
    newState: h,
    flags: h
  }, n), r = new F(t), s = new O0(new S(h, (a) => a.nClasses));
  return new F({
    nClasses: T,
    classTable: new P(T, new xt(e)),
    stateArray: new P(T, s),
    entryTable: new P(T, new O0(r))
  });
}
function zh(n = {}, e = h) {
  let t = new F({
    version() {
      return 8;
    },
    firstGlyph: h,
    values: new S(H, h)
  }), r = Object.assign({
    newStateOffset: h,
    // convert offset to stateArray index
    newState: (o) => (o.newStateOffset - (o.parent.stateArray.base - o.parent._startOffset)) / o.parent.nClasses,
    flags: h
  }, n), s = new F(r), i = new O0(new S(H, (o) => o.nClasses));
  return new F({
    nClasses: h,
    classTable: new P(h, t),
    stateArray: new P(h, i),
    entryTable: new P(h, new O0(s))
  });
}
let Gh = new fe("format", {
  0: {
    deltas: new S(U, 32)
  },
  1: {
    deltas: new S(U, 32),
    mappingData: new xt(h)
  },
  2: {
    standardGlyph: h,
    controlPoints: new S(h, 32)
  },
  3: {
    standardGlyph: h,
    controlPoints: new S(h, 32),
    mappingData: new xt(h)
  }
});
var Hh = new F({
  version: De,
  format: h,
  defaultBaseline: h,
  subtable: Gh
});
let Wh = new F({
  setting: h,
  nameIndex: U,
  name: (n) => n.parent.parent.parent.name.records.fontFeatures[n.nameIndex]
}), Vh = new F({
  feature: h,
  nSettings: h,
  settingTable: new P(T, new S(Wh, "nSettings"), {
    type: "parent"
  }),
  featureFlags: new m0(H, [
    null,
    null,
    null,
    null,
    null,
    null,
    "hasDefault",
    "exclusive"
  ]),
  defaultSetting: H,
  nameIndex: U,
  name: (n) => n.parent.parent.name.records.fontFeatures[n.nameIndex]
});
var _h = new F({
  version: De,
  featureNameCount: h,
  reserved1: new Ie(h),
  reserved2: new Ie(T),
  featureNames: new S(Vh, "featureNameCount")
});
let qh = new F({
  axisTag: new Se(4),
  minValue: De,
  defaultValue: De,
  maxValue: De,
  flags: h,
  nameID: h,
  name: (n) => n.parent.parent.name.records.fontFeatures[n.nameID]
}), $h = new F({
  nameID: h,
  name: (n) => n.parent.parent.name.records.fontFeatures[n.nameID],
  flags: h,
  coord: new S(De, (n) => n.parent.axisCount),
  postscriptNameID: new kn(h, (n) => n.parent.instanceSize - n._currentOffset > 0)
});
var Xh = new F({
  version: De,
  offsetToData: h,
  countSizePairs: h,
  axisCount: h,
  axisSize: h,
  instanceCount: h,
  instanceSize: h,
  axis: new S(qh, "axisCount"),
  instance: new S($h, "instanceCount")
});
let jh = new Ot(16, "BE", 14);
class Yh {
  static decode(e, t) {
    return t.flags ? e.readUInt32BE() : e.readUInt16BE() * 2;
  }
}
let Kh = new F({
  version: h,
  reserved: new Ie(h),
  axisCount: h,
  globalCoordCount: h,
  globalCoords: new P(T, new S(new S(jh, "axisCount"), "globalCoordCount")),
  glyphCount: h,
  flags: h,
  offsetToData: T,
  offsets: new S(new P(Yh, "void", {
    relativeTo: (n) => n.offsetToData,
    allowNull: !1
  }), (n) => n.glyphCount + 1)
});
var Zh = Kh;
let Jh = new F({
  length: h,
  coverage: h,
  subFeatureFlags: T,
  stateTable: new zh()
}), Qh = new F({
  justClass: T,
  beforeGrowLimit: De,
  beforeShrinkLimit: De,
  afterGrowLimit: De,
  afterShrinkLimit: De,
  growFlags: h,
  shrinkFlags: h
}), ed = new S(Qh, T), td = new fe("actionType", {
  0: {
    lowerLimit: De,
    upperLimit: De,
    order: h,
    glyphs: new S(h, h)
  },
  1: {
    addGlyph: h
  },
  2: {
    substThreshold: De,
    addGlyph: h,
    substGlyph: h
  },
  3: {},
  4: {
    variationAxis: T,
    minimumLimit: De,
    noStretchValue: De,
    maximumLimit: De
  },
  5: {
    flags: h,
    glyph: h
  }
}), rd = new F({
  actionClass: h,
  actionType: h,
  actionLength: T,
  actionData: td,
  padding: new Ie(H, (n) => n.actionLength - n._currentOffset)
}), nd = new S(rd, T), sd = new F({
  lookupTable: new xt(new P(h, nd))
}), Qa = new F({
  classTable: new P(h, Jh, {
    type: "parent"
  }),
  wdcOffset: h,
  postCompensationTable: new P(h, sd, {
    type: "parent"
  }),
  widthDeltaClusters: new xt(new P(h, ed, {
    type: "parent",
    relativeTo: (n) => n.wdcOffset
  }))
});
var id = new F({
  version: T,
  format: h,
  horizontal: new P(h, Qa),
  vertical: new P(h, Qa)
});
let ad = {
  action: h
}, od = {
  markIndex: h,
  currentIndex: h
}, ld = {
  currentInsertIndex: h,
  markedInsertIndex: h
}, cd = new F({
  items: new O0(new P(T, new xt()))
}), fd = new fe("type", {
  0: {
    stateTable: new Kr()
  },
  1: {
    stateTable: new Kr(od),
    substitutionTable: new P(T, cd)
  },
  2: {
    stateTable: new Kr(ad),
    ligatureActions: new P(T, new O0(T)),
    components: new P(T, new O0(h)),
    ligatureList: new P(T, new O0(h))
  },
  4: {
    lookupTable: new xt()
  },
  5: {
    stateTable: new Kr(ld),
    insertionActions: new P(T, new O0(h))
  }
}), ud = new F({
  length: T,
  coverage: ut,
  type: H,
  subFeatureFlags: T,
  table: fd,
  padding: new Ie(H, (n) => n.length - n._currentOffset)
}), hd = new F({
  featureType: h,
  featureSetting: h,
  enableFlags: T,
  disableFlags: T
}), dd = new F({
  defaultFlags: T,
  chainLength: T,
  nFeatureEntries: T,
  nSubtables: T,
  features: new S(hd, "nFeatureEntries"),
  subtables: new S(ud, "nSubtables")
});
var xd = new F({
  version: h,
  unused: new Ie(h),
  nChains: T,
  chains: new S(dd, "nChains")
});
let bd = new F({
  left: U,
  top: U,
  right: U,
  bottom: U
});
var pd = new F({
  version: De,
  format: h,
  lookupTable: new xt(bd)
});
let le = {};
var Bn = le;
le.cmap = bf;
le.head = pf;
le.hhea = gf;
le.hmtx = Af;
le.maxp = wf;
le.name = Tf;
le["OS/2"] = If;
le.post = Ef;
le.fpgm = Bf;
le.loca = Of;
le.prep = Df;
le["cvt "] = Ff;
le.glyf = Mf;
le["CFF "] = vl;
le.CFF2 = vl;
le.VORG = wu;
le.EBLC = ku;
le.CBLC = le.EBLC;
le.sbix = Tu;
le.COLR = Fu;
le.CPAL = Ou;
le.BASE = Gu;
le.GDEF = $u;
le.GPOS = nh;
le.GSUB = oh;
le.JSTF = hh;
le.HVAR = bh;
le.DSIG = mh;
le.gasp = wh;
le.hdmx = yh;
le.kern = kh;
le.LTSH = Ph;
le.PCLT = Th;
le.VDMX = Bh;
le.vhea = Oh;
le.vmtx = Mh;
le.avar = Uh;
le.bsln = Hh;
le.feat = _h;
le.fvar = Xh;
le.gvar = Zh;
le.just = id;
le.morx = xd;
le.opbd = pd;
let gd = new F({
  tag: new Se(4),
  checkSum: T,
  offset: new P(T, "void", {
    type: "global"
  }),
  length: T
}), Ni = new F({
  tag: new Se(4),
  numTables: h,
  searchRange: h,
  entrySelector: h,
  rangeShift: h,
  tables: new S(gd, "numTables")
});
Ni.process = function() {
  let n = {};
  for (let e of this.tables) n[e.tag] = e;
  this.tables = n;
};
Ni.preEncode = function() {
  if (!Array.isArray(this.tables)) {
    let t = [];
    for (let r in this.tables) {
      let s = this.tables[r];
      s && t.push({
        tag: r,
        checkSum: 0,
        offset: new ei(Bn[r], s),
        length: Bn[r].size(s)
      });
    }
    this.tables = t;
  }
  this.tag = "true", this.numTables = this.tables.length;
  let n = Math.floor(Math.log(this.numTables) / Math.LN2), e = Math.pow(2, n);
  this.searchRange = e * 16, this.entrySelector = Math.log(e) / Math.LN2, this.rangeShift = this.numTables * 16 - this.searchRange;
};
var kl = Ni;
function xn(n, e) {
  let t = 0, r = n.length - 1;
  for (; t <= r; ) {
    let s = t + r >> 1, i = e(n[s]);
    if (i < 0) r = s - 1;
    else if (i > 0) t = s + 1;
    else return s;
  }
  return -1;
}
function qt(n, e) {
  let t = [];
  for (; n < e; ) t.push(n++);
  return t;
}
const Kn = new TextDecoder("ascii"), e1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", wr = new Uint8Array(256);
for (let n = 0; n < e1.length; n++) wr[e1.charCodeAt(n)] = n;
function zi(n) {
  let e = n.length * 0.75;
  n[n.length - 1] === "=" && (e--, n[n.length - 2] === "=" && e--);
  let t = new Uint8Array(e), r = 0;
  for (let s = 0, i = n.length; s < i; s += 4) {
    let a = wr[n.charCodeAt(s)], o = wr[n.charCodeAt(s + 1)], l = wr[n.charCodeAt(s + 2)], f = wr[n.charCodeAt(s + 3)];
    t[r++] = a << 2 | o >> 4, t[r++] = (o & 15) << 4 | l >> 2, t[r++] = (l & 3) << 6 | f & 63;
  }
  return t;
}
class Gi {
  findSubtable(e, t) {
    for (let [r, s] of t) for (let i of e.tables)
      if (i.platformID === r && i.encodingID === s) return i.table;
    return null;
  }
  lookup(e, t) {
    if (this.encoding) e = this.encoding.get(e) || e;
    else if (t) {
      let s = this.getVariationSelector(e, t);
      if (s) return s;
    }
    let r = this.cmap;
    switch (r.version) {
      case 0:
        return r.codeMap.get(e) || 0;
      case 4: {
        let s = 0, i = r.segCount - 1;
        for (; s <= i; ) {
          let a = s + i >> 1;
          if (e < r.startCode.get(a)) i = a - 1;
          else if (e > r.endCode.get(a)) s = a + 1;
          else {
            let o = r.idRangeOffset.get(a), l;
            if (o === 0) l = e + r.idDelta.get(a);
            else {
              let f = o / 2 + (e - r.startCode.get(a)) - (r.segCount - a);
              l = r.glyphIndexArray.get(f) || 0, l !== 0 && (l += r.idDelta.get(a));
            }
            return l & 65535;
          }
        }
        return 0;
      }
      case 8:
        throw new Error("TODO: cmap format 8");
      case 6:
      case 10:
        return r.glyphIndices.get(e - r.firstCode) || 0;
      case 12:
      case 13: {
        let s = 0, i = r.nGroups - 1;
        for (; s <= i; ) {
          let a = s + i >> 1, o = r.groups.get(a);
          if (e < o.startCharCode) i = a - 1;
          else if (e > o.endCharCode) s = a + 1;
          else
            return r.version === 12 ? o.glyphID + (e - o.startCharCode) : o.glyphID;
        }
        return 0;
      }
      case 14:
        throw new Error("TODO: cmap format 14");
      default:
        throw new Error(`Unknown cmap format ${r.version}`);
    }
  }
  getVariationSelector(e, t) {
    if (!this.uvs) return 0;
    let r = this.uvs.varSelectors.toArray(), s = xn(r, (a) => t - a.varSelector), i = r[s];
    return s !== -1 && i.defaultUVS && (s = xn(i.defaultUVS, (a) => e < a.startUnicodeValue ? -1 : e > a.startUnicodeValue + a.additionalCount ? 1 : 0)), s !== -1 && i.nonDefaultUVS && (s = xn(i.nonDefaultUVS, (a) => e - a.unicodeValue), s !== -1) ? i.nonDefaultUVS[s].glyphID : 0;
  }
  getCharacterSet() {
    let e = this.cmap;
    switch (e.version) {
      case 0:
        return qt(0, e.codeMap.length);
      case 4: {
        let t = [], r = e.endCode.toArray();
        for (let s = 0; s < r.length; s++) {
          let i = r[s] + 1, a = e.startCode.get(s);
          t.push(...qt(a, i));
        }
        return t;
      }
      case 8:
        throw new Error("TODO: cmap format 8");
      case 6:
      case 10:
        return qt(e.firstCode, e.firstCode + e.glyphIndices.length);
      case 12:
      case 13: {
        let t = [];
        for (let r of e.groups.toArray()) t.push(...qt(r.startCharCode, r.endCharCode + 1));
        return t;
      }
      case 14:
        throw new Error("TODO: cmap format 14");
      default:
        throw new Error(`Unknown cmap format ${e.version}`);
    }
  }
  codePointsForGlyph(e) {
    let t = this.cmap;
    switch (t.version) {
      case 0: {
        let s = [];
        for (let i = 0; i < 256; i++) t.codeMap.get(i) === e && s.push(i);
        return s;
      }
      case 4: {
        let s = [];
        for (let i = 0; i < t.segCount; i++) {
          let a = t.endCode.get(i), o = t.startCode.get(i), l = t.idRangeOffset.get(i), f = t.idDelta.get(i);
          for (var r = o; r <= a; r++) {
            let u = 0;
            if (l === 0) u = r + f;
            else {
              let c = l / 2 + (r - o) - (t.segCount - i);
              u = t.glyphIndexArray.get(c) || 0, u !== 0 && (u += f);
            }
            u === e && s.push(r);
          }
        }
        return s;
      }
      case 12: {
        let s = [];
        for (let i of t.groups.toArray()) e >= i.glyphID && e <= i.glyphID + (i.endCharCode - i.startCharCode) && s.push(i.startCharCode + (e - i.glyphID));
        return s;
      }
      case 13: {
        let s = [];
        for (let i of t.groups.toArray()) e === i.glyphID && s.push(...qt(i.startCharCode, i.endCharCode + 1));
        return s;
      }
      default:
        throw new Error(`Unknown cmap format ${t.version}`);
    }
  }
  constructor(e) {
    if (this.encoding = null, this.cmap = this.findSubtable(e, [
      // 32-bit subtables
      [
        3,
        10
      ],
      [
        0,
        6
      ],
      [
        0,
        4
      ],
      // 16-bit subtables
      [
        3,
        1
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ]), !this.cmap) for (let t of e.tables) {
      let r = sl(t.platformID, t.encodingID, t.table.language - 1), s = Cf(r);
      s && (this.cmap = t.table, this.encoding = s);
    }
    if (!this.cmap) throw new Error("Could not find a supported cmap table");
    this.uvs = this.findSubtable(e, [
      [
        0,
        5
      ]
    ]), this.uvs && this.uvs.version !== 14 && (this.uvs = null);
  }
}
Ve([
  _e
], Gi.prototype, "getCharacterSet", null);
Ve([
  _e
], Gi.prototype, "codePointsForGlyph", null);
class md {
  process(e, t) {
    for (let r = 0; r < e.length - 1; r++) {
      let s = e[r].id, i = e[r + 1].id;
      t[r].xAdvance += this.getKerning(s, i);
    }
  }
  getKerning(e, t) {
    let r = 0;
    for (let s of this.kern.tables) {
      if (s.coverage.crossStream) continue;
      switch (s.version) {
        case 0:
          if (!s.coverage.horizontal) continue;
          break;
        case 1:
          if (s.coverage.vertical || s.coverage.variation) continue;
          break;
        default:
          throw new Error(`Unsupported kerning table version ${s.version}`);
      }
      let i = 0, a = s.subtable;
      switch (s.format) {
        case 0:
          let o = xn(a.pairs, function(c) {
            return e - c.left || t - c.right;
          });
          o >= 0 && (i = a.pairs[o].value);
          break;
        case 2:
          let l = 0, f = 0;
          e >= a.leftTable.firstGlyph && e < a.leftTable.firstGlyph + a.leftTable.nGlyphs ? l = a.leftTable.offsets[e - a.leftTable.firstGlyph] : l = a.array.off, t >= a.rightTable.firstGlyph && t < a.rightTable.firstGlyph + a.rightTable.nGlyphs && (f = a.rightTable.offsets[t - a.rightTable.firstGlyph]);
          let u = (l + f - a.array.off) / 2;
          i = a.array.values.get(u);
          break;
        case 3:
          if (e >= a.glyphCount || t >= a.glyphCount) return 0;
          i = a.kernValue[a.kernIndex[a.leftClass[e] * a.rightClassCount + a.rightClass[t]]];
          break;
        default:
          throw new Error(`Unsupported kerning sub-table format ${s.format}`);
      }
      s.coverage.override ? r = i : r += i;
    }
    return r;
  }
  constructor(e) {
    this.kern = e.kern;
  }
}
class Ad {
  positionGlyphs(e, t) {
    let r = 0, s = 0;
    for (let i = 0; i < e.length; i++)
      e[i].isMark ? s = i : (r !== s && this.positionCluster(e, t, r, s), r = s = i);
    return r !== s && this.positionCluster(e, t, r, s), t;
  }
  positionCluster(e, t, r, s) {
    let i = e[r], a = i.cbox.copy();
    i.codePoints.length > 1 && (a.minX += (i.codePoints.length - 1) * a.width / i.codePoints.length);
    let o = -t[r].xAdvance, l = 0, f = this.font.unitsPerEm / 16;
    for (let u = r + 1; u <= s; u++) {
      let c = e[u], x = c.cbox, g = t[u], m = this.getCombiningClass(c.codePoints[0]);
      if (m !== "Not_Reordered") {
        switch (g.xOffset = g.yOffset = 0, m) {
          case "Double_Above":
          case "Double_Below":
            g.xOffset += a.minX - x.width / 2 - x.minX;
            break;
          case "Attached_Below_Left":
          case "Below_Left":
          case "Above_Left":
            g.xOffset += a.minX - x.minX;
            break;
          case "Attached_Above_Right":
          case "Below_Right":
          case "Above_Right":
            g.xOffset += a.maxX - x.width - x.minX;
            break;
          default:
            g.xOffset += a.minX + (a.width - x.width) / 2 - x.minX;
        }
        switch (m) {
          case "Double_Below":
          case "Below_Left":
          case "Below":
          case "Below_Right":
          case "Attached_Below_Left":
          case "Attached_Below":
            (m === "Attached_Below_Left" || m === "Attached_Below") && (a.minY += f), g.yOffset = -a.minY - x.maxY, a.minY += x.height;
            break;
          case "Double_Above":
          case "Above_Left":
          case "Above":
          case "Above_Right":
          case "Attached_Above":
          case "Attached_Above_Right":
            (m === "Attached_Above" || m === "Attached_Above_Right") && (a.maxY += f), g.yOffset = a.maxY - x.minY, a.maxY += x.height;
            break;
        }
        g.xAdvance = g.yAdvance = 0, g.xOffset += o, g.yOffset += l;
      } else
        o -= g.xAdvance, l -= g.yAdvance;
    }
  }
  getCombiningClass(e) {
    let t = q2(e);
    if ((e & -256) === 3584) {
      if (t === "Not_Reordered") switch (e) {
        case 3633:
        case 3636:
        case 3637:
        case 3638:
        case 3639:
        case 3655:
        case 3660:
        case 3645:
        case 3662:
          return "Above_Right";
        case 3761:
        case 3764:
        case 3765:
        case 3766:
        case 3767:
        case 3771:
        case 3788:
        case 3789:
          return "Above";
        case 3772:
          return "Below";
      }
      else if (e === 3642) return "Below_Right";
    }
    switch (t) {
      case "CCC10":
      case "CCC11":
      case "CCC12":
      case "CCC13":
      case "CCC14":
      case "CCC15":
      case "CCC16":
      case "CCC17":
      case "CCC18":
      case "CCC20":
      case "CCC22":
        return "Below";
      case "CCC23":
        return "Attached_Above";
      case "CCC24":
        return "Above_Right";
      case "CCC25":
      case "CCC19":
        return "Above_Left";
      case "CCC26":
        return "Above";
      case "CCC21":
        break;
      case "CCC27":
      case "CCC28":
      case "CCC30":
      case "CCC31":
      case "CCC33":
      case "CCC34":
      case "CCC35":
      case "CCC36":
        return "Above";
      case "CCC29":
      case "CCC32":
        return "Below";
      case "CCC103":
        return "Below_Right";
      case "CCC107":
        return "Above_Right";
      case "CCC118":
        return "Below";
      case "CCC122":
        return "Above";
      case "CCC129":
      case "CCC132":
        return "Below";
      case "CCC130":
        return "Above";
    }
    return t;
  }
  constructor(e) {
    this.font = e;
  }
}
class bt {
  /**
  * The width of the bounding box
  * @type {number}
  */
  get width() {
    return this.maxX - this.minX;
  }
  /**
  * The height of the bounding box
  * @type {number}
  */
  get height() {
    return this.maxY - this.minY;
  }
  addPoint(e, t) {
    Math.abs(e) !== 1 / 0 && (e < this.minX && (this.minX = e), e > this.maxX && (this.maxX = e)), Math.abs(t) !== 1 / 0 && (t < this.minY && (this.minY = t), t > this.maxY && (this.maxY = t));
  }
  copy() {
    return new bt(this.minX, this.minY, this.maxX, this.maxY);
  }
  constructor(e = 1 / 0, t = 1 / 0, r = -1 / 0, s = -1 / 0) {
    this.minX = e, this.minY = t, this.maxX = r, this.maxY = s;
  }
}
const rr = {
  Caucasian_Albanian: "aghb",
  Arabic: "arab",
  Imperial_Aramaic: "armi",
  Armenian: "armn",
  Avestan: "avst",
  Balinese: "bali",
  Bamum: "bamu",
  Bassa_Vah: "bass",
  Batak: "batk",
  Bengali: [
    "bng2",
    "beng"
  ],
  Bopomofo: "bopo",
  Brahmi: "brah",
  Braille: "brai",
  Buginese: "bugi",
  Buhid: "buhd",
  Chakma: "cakm",
  Canadian_Aboriginal: "cans",
  Carian: "cari",
  Cham: "cham",
  Cherokee: "cher",
  Coptic: "copt",
  Cypriot: "cprt",
  Cyrillic: "cyrl",
  Devanagari: [
    "dev2",
    "deva"
  ],
  Deseret: "dsrt",
  Duployan: "dupl",
  Egyptian_Hieroglyphs: "egyp",
  Elbasan: "elba",
  Ethiopic: "ethi",
  Georgian: "geor",
  Glagolitic: "glag",
  Gothic: "goth",
  Grantha: "gran",
  Greek: "grek",
  Gujarati: [
    "gjr2",
    "gujr"
  ],
  Gurmukhi: [
    "gur2",
    "guru"
  ],
  Hangul: "hang",
  Han: "hani",
  Hanunoo: "hano",
  Hebrew: "hebr",
  Hiragana: "hira",
  Pahawh_Hmong: "hmng",
  Katakana_Or_Hiragana: "hrkt",
  Old_Italic: "ital",
  Javanese: "java",
  Kayah_Li: "kali",
  Katakana: "kana",
  Kharoshthi: "khar",
  Khmer: "khmr",
  Khojki: "khoj",
  Kannada: [
    "knd2",
    "knda"
  ],
  Kaithi: "kthi",
  Tai_Tham: "lana",
  Lao: "lao ",
  Latin: "latn",
  Lepcha: "lepc",
  Limbu: "limb",
  Linear_A: "lina",
  Linear_B: "linb",
  Lisu: "lisu",
  Lycian: "lyci",
  Lydian: "lydi",
  Mahajani: "mahj",
  Mandaic: "mand",
  Manichaean: "mani",
  Mende_Kikakui: "mend",
  Meroitic_Cursive: "merc",
  Meroitic_Hieroglyphs: "mero",
  Malayalam: [
    "mlm2",
    "mlym"
  ],
  Modi: "modi",
  Mongolian: "mong",
  Mro: "mroo",
  Meetei_Mayek: "mtei",
  Myanmar: [
    "mym2",
    "mymr"
  ],
  Old_North_Arabian: "narb",
  Nabataean: "nbat",
  Nko: "nko ",
  Ogham: "ogam",
  Ol_Chiki: "olck",
  Old_Turkic: "orkh",
  Oriya: [
    "ory2",
    "orya"
  ],
  Osmanya: "osma",
  Palmyrene: "palm",
  Pau_Cin_Hau: "pauc",
  Old_Permic: "perm",
  Phags_Pa: "phag",
  Inscriptional_Pahlavi: "phli",
  Psalter_Pahlavi: "phlp",
  Phoenician: "phnx",
  Miao: "plrd",
  Inscriptional_Parthian: "prti",
  Rejang: "rjng",
  Runic: "runr",
  Samaritan: "samr",
  Old_South_Arabian: "sarb",
  Saurashtra: "saur",
  Shavian: "shaw",
  Sharada: "shrd",
  Siddham: "sidd",
  Khudawadi: "sind",
  Sinhala: "sinh",
  Sora_Sompeng: "sora",
  Sundanese: "sund",
  Syloti_Nagri: "sylo",
  Syriac: "syrc",
  Tagbanwa: "tagb",
  Takri: "takr",
  Tai_Le: "tale",
  New_Tai_Lue: "talu",
  Tamil: [
    "tml2",
    "taml"
  ],
  Tai_Viet: "tavt",
  Telugu: [
    "tel2",
    "telu"
  ],
  Tifinagh: "tfng",
  Tagalog: "tglg",
  Thaana: "thaa",
  Thai: "thai",
  Tibetan: "tibt",
  Tirhuta: "tirh",
  Ugaritic: "ugar",
  Vai: "vai ",
  Warang_Citi: "wara",
  Old_Persian: "xpeo",
  Cuneiform: "xsux",
  Yi: "yi  ",
  Inherited: "zinh",
  Common: "zyyy",
  Unknown: "zzzz"
}, oi = {};
for (let n in rr) {
  let e = rr[n];
  if (Array.isArray(e)) for (let t of e) oi[t] = n;
  else oi[e] = n;
}
function wd(n) {
  return oi[n];
}
function vd(n) {
  let e = n.length, t = 0;
  for (; t < e; ) {
    let r = n.charCodeAt(t++);
    if (55296 <= r && r <= 56319 && t < e) {
      let i = n.charCodeAt(t);
      56320 <= i && i <= 57343 && (t++, r = ((r & 1023) << 10) + (i & 1023) + 65536);
    }
    let s = Yo(r);
    if (s !== "Common" && s !== "Inherited" && s !== "Unknown") return rr[s];
  }
  return rr.Unknown;
}
function yd(n) {
  for (let e = 0; e < n.length; e++) {
    let t = n[e], r = Yo(t);
    if (r !== "Common" && r !== "Inherited" && r !== "Unknown") return rr[r];
  }
  return rr.Unknown;
}
const Cd = {
  arab: !0,
  hebr: !0,
  syrc: !0,
  thaa: !0,
  cprt: !0,
  khar: !0,
  phnx: !0,
  "nko ": !0,
  lydi: !0,
  avst: !0,
  armi: !0,
  phli: !0,
  prti: !0,
  sarb: !0,
  orkh: !0,
  samr: !0,
  mand: !0,
  merc: !0,
  mero: !0,
  // Unicode 7.0 (not listed on http://www.microsoft.com/typography/otspec/scripttags.htm)
  mani: !0,
  mend: !0,
  nbat: !0,
  narb: !0,
  palm: !0,
  phlp: !0
  // Psalter Pahlavi
};
function Pl(n) {
  return Cd[n] ? "rtl" : "ltr";
}
class Sd {
  /**
  * The total advance width of the run.
  * @type {number}
  */
  get advanceWidth() {
    let e = 0;
    for (let t of this.positions) e += t.xAdvance;
    return e;
  }
  /**
  * The total advance height of the run.
  * @type {number}
  */
  get advanceHeight() {
    let e = 0;
    for (let t of this.positions) e += t.yAdvance;
    return e;
  }
  /**
  * The bounding box containing all glyphs in the run.
  * @type {BBox}
  */
  get bbox() {
    let e = new bt(), t = 0, r = 0;
    for (let s = 0; s < this.glyphs.length; s++) {
      let i = this.glyphs[s], a = this.positions[s], o = i.bbox;
      e.addPoint(o.minX + t + a.xOffset, o.minY + r + a.yOffset), e.addPoint(o.maxX + t + a.xOffset, o.maxY + r + a.yOffset), t += a.xAdvance, r += a.yAdvance;
    }
    return e;
  }
  constructor(e, t, r, s, i) {
    if (this.glyphs = e, this.positions = null, this.script = r, this.language = s || null, this.direction = i || Pl(r), this.features = {}, Array.isArray(t)) for (let a of t) this.features[a] = !0;
    else typeof t == "object" && (this.features = t);
  }
}
class kd {
  constructor(e = 0, t = 0, r = 0, s = 0) {
    this.xAdvance = e, this.yAdvance = t, this.xOffset = r, this.yOffset = s;
  }
}
const kt = {
  allTypographicFeatures: {
    code: 0,
    exclusive: !1,
    allTypeFeatures: 0
  },
  ligatures: {
    code: 1,
    exclusive: !1,
    requiredLigatures: 0,
    commonLigatures: 2,
    rareLigatures: 4,
    // logos: 6
    rebusPictures: 8,
    diphthongLigatures: 10,
    squaredLigatures: 12,
    abbrevSquaredLigatures: 14,
    symbolLigatures: 16,
    contextualLigatures: 18,
    historicalLigatures: 20
  },
  cursiveConnection: {
    code: 2,
    exclusive: !0,
    unconnected: 0,
    partiallyConnected: 1,
    cursive: 2
  },
  letterCase: {
    code: 3,
    exclusive: !0
  },
  // upperAndLowerCase: 0          # deprecated
  // allCaps: 1                    # deprecated
  // allLowerCase: 2               # deprecated
  // smallCaps: 3                  # deprecated
  // initialCaps: 4                # deprecated
  // initialCapsAndSmallCaps: 5    # deprecated
  verticalSubstitution: {
    code: 4,
    exclusive: !1,
    substituteVerticalForms: 0
  },
  linguisticRearrangement: {
    code: 5,
    exclusive: !1,
    linguisticRearrangement: 0
  },
  numberSpacing: {
    code: 6,
    exclusive: !0,
    monospacedNumbers: 0,
    proportionalNumbers: 1,
    thirdWidthNumbers: 2,
    quarterWidthNumbers: 3
  },
  smartSwash: {
    code: 8,
    exclusive: !1,
    wordInitialSwashes: 0,
    wordFinalSwashes: 2,
    // lineInitialSwashes: 4
    // lineFinalSwashes: 6
    nonFinalSwashes: 8
  },
  diacritics: {
    code: 9,
    exclusive: !0,
    showDiacritics: 0,
    hideDiacritics: 1,
    decomposeDiacritics: 2
  },
  verticalPosition: {
    code: 10,
    exclusive: !0,
    normalPosition: 0,
    superiors: 1,
    inferiors: 2,
    ordinals: 3,
    scientificInferiors: 4
  },
  fractions: {
    code: 11,
    exclusive: !0,
    noFractions: 0,
    verticalFractions: 1,
    diagonalFractions: 2
  },
  overlappingCharacters: {
    code: 13,
    exclusive: !1,
    preventOverlap: 0
  },
  typographicExtras: {
    code: 14,
    exclusive: !1,
    // hyphensToEmDash: 0
    // hyphenToEnDash: 2
    slashedZero: 4
  },
  // formInterrobang: 6
  // smartQuotes: 8
  // periodsToEllipsis: 10
  mathematicalExtras: {
    code: 15,
    exclusive: !1,
    // hyphenToMinus: 0
    // asteristoMultiply: 2
    // slashToDivide: 4
    // inequalityLigatures: 6
    // exponents: 8
    mathematicalGreek: 10
  },
  ornamentSets: {
    code: 16,
    exclusive: !0,
    noOrnaments: 0,
    dingbats: 1,
    piCharacters: 2,
    fleurons: 3,
    decorativeBorders: 4,
    internationalSymbols: 5,
    mathSymbols: 6
  },
  characterAlternatives: {
    code: 17,
    exclusive: !0,
    noAlternates: 0
  },
  // user defined options
  designComplexity: {
    code: 18,
    exclusive: !0,
    designLevel1: 0,
    designLevel2: 1,
    designLevel3: 2,
    designLevel4: 3,
    designLevel5: 4
  },
  styleOptions: {
    code: 19,
    exclusive: !0,
    noStyleOptions: 0,
    displayText: 1,
    engravedText: 2,
    illuminatedCaps: 3,
    titlingCaps: 4,
    tallCaps: 5
  },
  characterShape: {
    code: 20,
    exclusive: !0,
    traditionalCharacters: 0,
    simplifiedCharacters: 1,
    JIS1978Characters: 2,
    JIS1983Characters: 3,
    JIS1990Characters: 4,
    traditionalAltOne: 5,
    traditionalAltTwo: 6,
    traditionalAltThree: 7,
    traditionalAltFour: 8,
    traditionalAltFive: 9,
    expertCharacters: 10,
    JIS2004Characters: 11,
    hojoCharacters: 12,
    NLCCharacters: 13,
    traditionalNamesCharacters: 14
  },
  numberCase: {
    code: 21,
    exclusive: !0,
    lowerCaseNumbers: 0,
    upperCaseNumbers: 1
  },
  textSpacing: {
    code: 22,
    exclusive: !0,
    proportionalText: 0,
    monospacedText: 1,
    halfWidthText: 2,
    thirdWidthText: 3,
    quarterWidthText: 4,
    altProportionalText: 5,
    altHalfWidthText: 6
  },
  transliteration: {
    code: 23,
    exclusive: !0,
    noTransliteration: 0
  },
  // hanjaToHangul: 1
  // hiraganaToKatakana: 2
  // katakanaToHiragana: 3
  // kanaToRomanization: 4
  // romanizationToHiragana: 5
  // romanizationToKatakana: 6
  // hanjaToHangulAltOne: 7
  // hanjaToHangulAltTwo: 8
  // hanjaToHangulAltThree: 9
  annotation: {
    code: 24,
    exclusive: !0,
    noAnnotation: 0,
    boxAnnotation: 1,
    roundedBoxAnnotation: 2,
    circleAnnotation: 3,
    invertedCircleAnnotation: 4,
    parenthesisAnnotation: 5,
    periodAnnotation: 6,
    romanNumeralAnnotation: 7,
    diamondAnnotation: 8,
    invertedBoxAnnotation: 9,
    invertedRoundedBoxAnnotation: 10
  },
  kanaSpacing: {
    code: 25,
    exclusive: !0,
    fullWidthKana: 0,
    proportionalKana: 1
  },
  ideographicSpacing: {
    code: 26,
    exclusive: !0,
    fullWidthIdeographs: 0,
    proportionalIdeographs: 1,
    halfWidthIdeographs: 2
  },
  unicodeDecomposition: {
    code: 27,
    exclusive: !1,
    canonicalComposition: 0,
    compatibilityComposition: 2,
    transcodingComposition: 4
  },
  rubyKana: {
    code: 28,
    exclusive: !1,
    // noRubyKana: 0     # deprecated - use rubyKanaOff instead
    // rubyKana: 1     # deprecated - use rubyKanaOn instead
    rubyKana: 2
  },
  CJKSymbolAlternatives: {
    code: 29,
    exclusive: !0,
    noCJKSymbolAlternatives: 0,
    CJKSymbolAltOne: 1,
    CJKSymbolAltTwo: 2,
    CJKSymbolAltThree: 3,
    CJKSymbolAltFour: 4,
    CJKSymbolAltFive: 5
  },
  ideographicAlternatives: {
    code: 30,
    exclusive: !0,
    noIdeographicAlternatives: 0,
    ideographicAltOne: 1,
    ideographicAltTwo: 2,
    ideographicAltThree: 3,
    ideographicAltFour: 4,
    ideographicAltFive: 5
  },
  CJKVerticalRomanPlacement: {
    code: 31,
    exclusive: !0,
    CJKVerticalRomanCentered: 0,
    CJKVerticalRomanHBaseline: 1
  },
  italicCJKRoman: {
    code: 32,
    exclusive: !1,
    // noCJKItalicRoman: 0     # deprecated - use CJKItalicRomanOff instead
    // CJKItalicRoman: 1     # deprecated - use CJKItalicRomanOn instead
    CJKItalicRoman: 2
  },
  caseSensitiveLayout: {
    code: 33,
    exclusive: !1,
    caseSensitiveLayout: 0,
    caseSensitiveSpacing: 2
  },
  alternateKana: {
    code: 34,
    exclusive: !1,
    alternateHorizKana: 0,
    alternateVertKana: 2
  },
  stylisticAlternatives: {
    code: 35,
    exclusive: !1,
    noStylisticAlternates: 0,
    stylisticAltOne: 2,
    stylisticAltTwo: 4,
    stylisticAltThree: 6,
    stylisticAltFour: 8,
    stylisticAltFive: 10,
    stylisticAltSix: 12,
    stylisticAltSeven: 14,
    stylisticAltEight: 16,
    stylisticAltNine: 18,
    stylisticAltTen: 20,
    stylisticAltEleven: 22,
    stylisticAltTwelve: 24,
    stylisticAltThirteen: 26,
    stylisticAltFourteen: 28,
    stylisticAltFifteen: 30,
    stylisticAltSixteen: 32,
    stylisticAltSeventeen: 34,
    stylisticAltEighteen: 36,
    stylisticAltNineteen: 38,
    stylisticAltTwenty: 40
  },
  contextualAlternates: {
    code: 36,
    exclusive: !1,
    contextualAlternates: 0,
    swashAlternates: 2,
    contextualSwashAlternates: 4
  },
  lowerCase: {
    code: 37,
    exclusive: !0,
    defaultLowerCase: 0,
    lowerCaseSmallCaps: 1,
    lowerCasePetiteCaps: 2
  },
  upperCase: {
    code: 38,
    exclusive: !0,
    defaultUpperCase: 0,
    upperCaseSmallCaps: 1,
    upperCasePetiteCaps: 2
  },
  languageTag: {
    code: 39,
    exclusive: !0
  },
  CJKRomanSpacing: {
    code: 103,
    exclusive: !0,
    halfWidthCJKRoman: 0,
    proportionalCJKRoman: 1,
    defaultCJKRoman: 2,
    fullWidthCJKRoman: 3
  }
}, G = (n, e) => [
  kt[n].code,
  kt[n][e]
], On = {
  rlig: G("ligatures", "requiredLigatures"),
  clig: G("ligatures", "contextualLigatures"),
  dlig: G("ligatures", "rareLigatures"),
  hlig: G("ligatures", "historicalLigatures"),
  liga: G("ligatures", "commonLigatures"),
  hist: G("ligatures", "historicalLigatures"),
  smcp: G("lowerCase", "lowerCaseSmallCaps"),
  pcap: G("lowerCase", "lowerCasePetiteCaps"),
  frac: G("fractions", "diagonalFractions"),
  dnom: G("fractions", "diagonalFractions"),
  numr: G("fractions", "diagonalFractions"),
  afrc: G("fractions", "verticalFractions"),
  // aalt
  // abvf, abvm, abvs, akhn, blwf, blwm, blws, cfar, cjct, cpsp, falt, isol, jalt, ljmo, mset?
  // ltra, ltrm, nukt, pref, pres, pstf, psts, rand, rkrf, rphf, rtla, rtlm, size, tjmo, tnum?
  // unic, vatu, vhal, vjmo, vpal, vrt2
  // dist -> trak table?
  // kern, vkrn -> kern table
  // lfbd + opbd + rtbd -> opbd table?
  // mark, mkmk -> acnt table?
  // locl -> languageTag + ltag table
  case: G("caseSensitiveLayout", "caseSensitiveLayout"),
  ccmp: G("unicodeDecomposition", "canonicalComposition"),
  cpct: G("CJKVerticalRomanPlacement", "CJKVerticalRomanCentered"),
  valt: G("CJKVerticalRomanPlacement", "CJKVerticalRomanCentered"),
  swsh: G("contextualAlternates", "swashAlternates"),
  cswh: G("contextualAlternates", "contextualSwashAlternates"),
  curs: G("cursiveConnection", "cursive"),
  c2pc: G("upperCase", "upperCasePetiteCaps"),
  c2sc: G("upperCase", "upperCaseSmallCaps"),
  init: G("smartSwash", "wordInitialSwashes"),
  fin2: G("smartSwash", "wordFinalSwashes"),
  medi: G("smartSwash", "nonFinalSwashes"),
  med2: G("smartSwash", "nonFinalSwashes"),
  fin3: G("smartSwash", "wordFinalSwashes"),
  fina: G("smartSwash", "wordFinalSwashes"),
  pkna: G("kanaSpacing", "proportionalKana"),
  half: G("textSpacing", "halfWidthText"),
  halt: G("textSpacing", "altHalfWidthText"),
  hkna: G("alternateKana", "alternateHorizKana"),
  vkna: G("alternateKana", "alternateVertKana"),
  // hngl: feature 'transliteration', 'hanjaToHangulSelector' # deprecated
  ital: G("italicCJKRoman", "CJKItalicRoman"),
  lnum: G("numberCase", "upperCaseNumbers"),
  onum: G("numberCase", "lowerCaseNumbers"),
  mgrk: G("mathematicalExtras", "mathematicalGreek"),
  // nalt: not enough info. what type of annotation?
  // ornm: ditto, which ornament style?
  calt: G("contextualAlternates", "contextualAlternates"),
  vrt2: G("verticalSubstitution", "substituteVerticalForms"),
  vert: G("verticalSubstitution", "substituteVerticalForms"),
  tnum: G("numberSpacing", "monospacedNumbers"),
  pnum: G("numberSpacing", "proportionalNumbers"),
  sups: G("verticalPosition", "superiors"),
  subs: G("verticalPosition", "inferiors"),
  ordn: G("verticalPosition", "ordinals"),
  pwid: G("textSpacing", "proportionalText"),
  hwid: G("textSpacing", "halfWidthText"),
  qwid: G("textSpacing", "quarterWidthText"),
  twid: G("textSpacing", "thirdWidthText"),
  fwid: G("textSpacing", "proportionalText"),
  palt: G("textSpacing", "altProportionalText"),
  trad: G("characterShape", "traditionalCharacters"),
  smpl: G("characterShape", "simplifiedCharacters"),
  jp78: G("characterShape", "JIS1978Characters"),
  jp83: G("characterShape", "JIS1983Characters"),
  jp90: G("characterShape", "JIS1990Characters"),
  jp04: G("characterShape", "JIS2004Characters"),
  expt: G("characterShape", "expertCharacters"),
  hojo: G("characterShape", "hojoCharacters"),
  nlck: G("characterShape", "NLCCharacters"),
  tnam: G("characterShape", "traditionalNamesCharacters"),
  ruby: G("rubyKana", "rubyKana"),
  titl: G("styleOptions", "titlingCaps"),
  zero: G("typographicExtras", "slashedZero"),
  ss01: G("stylisticAlternatives", "stylisticAltOne"),
  ss02: G("stylisticAlternatives", "stylisticAltTwo"),
  ss03: G("stylisticAlternatives", "stylisticAltThree"),
  ss04: G("stylisticAlternatives", "stylisticAltFour"),
  ss05: G("stylisticAlternatives", "stylisticAltFive"),
  ss06: G("stylisticAlternatives", "stylisticAltSix"),
  ss07: G("stylisticAlternatives", "stylisticAltSeven"),
  ss08: G("stylisticAlternatives", "stylisticAltEight"),
  ss09: G("stylisticAlternatives", "stylisticAltNine"),
  ss10: G("stylisticAlternatives", "stylisticAltTen"),
  ss11: G("stylisticAlternatives", "stylisticAltEleven"),
  ss12: G("stylisticAlternatives", "stylisticAltTwelve"),
  ss13: G("stylisticAlternatives", "stylisticAltThirteen"),
  ss14: G("stylisticAlternatives", "stylisticAltFourteen"),
  ss15: G("stylisticAlternatives", "stylisticAltFifteen"),
  ss16: G("stylisticAlternatives", "stylisticAltSixteen"),
  ss17: G("stylisticAlternatives", "stylisticAltSeventeen"),
  ss18: G("stylisticAlternatives", "stylisticAltEighteen"),
  ss19: G("stylisticAlternatives", "stylisticAltNineteen"),
  ss20: G("stylisticAlternatives", "stylisticAltTwenty")
};
for (let n = 1; n <= 99; n++) On[`cv${`00${n}`.slice(-2)}`] = [
  kt.characterAlternatives.code,
  n
];
let Pt = {};
for (let n in On) {
  let e = On[n];
  Pt[e[0]] == null && (Pt[e[0]] = {}), Pt[e[0]][e[1]] = n;
}
function Pd(n) {
  let e = {};
  for (let t in n) {
    let r;
    (r = On[t]) && (e[r[0]] == null && (e[r[0]] = {}), e[r[0]][r[1]] = n[t]);
  }
  return e;
}
function t1(n) {
  let [e, t] = n;
  if (isNaN(e)) var r = kt[e] && kt[e].code;
  else var r = e;
  if (isNaN(t)) var s = kt[e] && kt[e][t];
  else var s = t;
  return [
    r,
    s
  ];
}
function Td(n) {
  let e = {};
  if (Array.isArray(n)) for (let t = 0; t < n.length; t++) {
    let r, s = t1(n[t]);
    (r = Pt[s[0]] && Pt[s[0]][s[1]]) && (e[r] = !0);
  }
  else if (typeof n == "object") for (let t in n) {
    let r = n[t];
    for (let s in r) {
      let i, a = t1([
        t,
        s
      ]);
      r[s] && (i = Pt[a[0]] && Pt[a[0]][a[1]]) && (e[i] = !0);
    }
  }
  return Object.keys(e);
}
class Cr {
  lookup(e) {
    switch (this.table.version) {
      case 0:
        return this.table.values.getItem(e);
      case 2:
      case 4: {
        let s = 0, i = this.table.binarySearchHeader.nUnits - 1;
        for (; s <= i; ) {
          var t = s + i >> 1, r = this.table.segments[t];
          if (r.firstGlyph === 65535) return null;
          if (e < r.firstGlyph) i = t - 1;
          else if (e > r.lastGlyph) s = t + 1;
          else
            return this.table.version === 2 ? r.value : r.values[e - r.firstGlyph];
        }
        return null;
      }
      case 6: {
        let s = 0, i = this.table.binarySearchHeader.nUnits - 1;
        for (; s <= i; ) {
          var t = s + i >> 1, r = this.table.segments[t];
          if (r.glyph === 65535) return null;
          if (e < r.glyph) i = t - 1;
          else if (e > r.glyph) s = t + 1;
          else return r.value;
        }
        return null;
      }
      case 8:
        return this.table.values[e - this.table.firstGlyph];
      default:
        throw new Error(`Unknown lookup table format: ${this.table.version}`);
    }
  }
  glyphsForValue(e) {
    let t = [];
    switch (this.table.version) {
      case 2:
      case 4:
        for (let r of this.table.segments) if (this.table.version === 2 && r.value === e) t.push(...qt(r.firstGlyph, r.lastGlyph + 1));
        else
          for (let s = 0; s < r.values.length; s++) r.values[s] === e && t.push(r.firstGlyph + s);
        break;
      case 6:
        for (let r of this.table.segments) r.value === e && t.push(r.glyph);
        break;
      case 8:
        for (let r = 0; r < this.table.values.length; r++) this.table.values[r] === e && t.push(this.table.firstGlyph + r);
        break;
      default:
        throw new Error(`Unknown lookup table format: ${this.table.version}`);
    }
    return t;
  }
  constructor(e) {
    this.table = e;
  }
}
Ve([
  _e
], Cr.prototype, "glyphsForValue", null);
const Id = 0, r1 = 0, n1 = 1, s1 = 2, Ed = 16384;
class Fd {
  process(e, t, r) {
    let s = Id, i = t ? e.length - 1 : 0, a = t ? -1 : 1;
    for (; a === 1 && i <= e.length || a === -1 && i >= -1; ) {
      let o = null, l = n1, f = !0;
      i === e.length || i === -1 ? l = r1 : (o = e[i], o.id === 65535 ? l = s1 : (l = this.lookupTable.lookup(o.id), l == null && (l = n1)));
      let c = this.stateTable.stateArray.getItem(s)[l], x = this.stateTable.entryTable.getItem(c);
      l !== r1 && l !== s1 && (r(o, x, i), f = !(x.flags & Ed)), s = x.newState, f && (i += a);
    }
    return e;
  }
  /**
  * Performs a depth-first traversal of the glyph strings
  * represented by the state machine.
  */
  traverse(e, t = 0, r = /* @__PURE__ */ new Set()) {
    if (r.has(t)) return;
    r.add(t);
    let { nClasses: s, stateArray: i, entryTable: a } = this.stateTable, o = i.getItem(t);
    for (let l = 4; l < s; l++) {
      let f = o[l], u = a.getItem(f);
      for (let c of this.lookupTable.glyphsForValue(l))
        e.enter && e.enter(c, u), u.newState !== 0 && this.traverse(e, u.newState, r), e.exit && e.exit(c, u);
    }
  }
  constructor(e) {
    this.stateTable = e, this.lookupTable = new Cr(e.classTable);
  }
}
const Bd = 32768, Od = 8192, Dd = 15, i1 = 32768, Md = 32768, Ld = 8192, Rd = 2147483648, Ud = 1073741824, Nd = 1073741823, a1 = 4194304, zd = 2048, Gd = 1024, Hd = 992, Wd = 31;
class Tl {
  // Processes an array of glyphs and applies the specified features
  // Features should be in the form of {featureType:{featureSetting:boolean}}
  process(e, t = {}) {
    for (let s of this.morx.chains) {
      let i = s.defaultFlags;
      for (let a of s.features) {
        let o;
        (o = t[a.featureType]) && (o[a.featureSetting] ? (i &= a.disableFlags, i |= a.enableFlags) : o[a.featureSetting] === !1 && (i |= ~a.disableFlags, i &= ~a.enableFlags));
      }
      for (let a of s.subtables) a.subFeatureFlags & i && this.processSubtable(a, e);
    }
    let r = e.length - 1;
    for (; r >= 0; )
      e[r].id === 65535 && e.splice(r, 1), r--;
    return e;
  }
  processSubtable(e, t) {
    if (this.subtable = e, this.glyphs = t, this.subtable.type === 4) {
      this.processNoncontextualSubstitutions(this.subtable, this.glyphs);
      return;
    }
    this.ligatureStack = [], this.markedGlyph = null, this.firstGlyph = null, this.lastGlyph = null, this.markedIndex = null;
    let r = this.getStateMachine(e), s = this.getProcessor(), i = !!(this.subtable.coverage & a1);
    return r.process(this.glyphs, i, s);
  }
  getStateMachine(e) {
    return new Fd(e.table.stateTable);
  }
  getProcessor() {
    switch (this.subtable.type) {
      case 0:
        return this.processIndicRearragement;
      case 1:
        return this.processContextualSubstitution;
      case 2:
        return this.processLigature;
      case 4:
        return this.processNoncontextualSubstitutions;
      case 5:
        return this.processGlyphInsertion;
      default:
        throw new Error(`Invalid morx subtable type: ${this.subtable.type}`);
    }
  }
  processIndicRearragement(e, t, r) {
    t.flags & Bd && (this.firstGlyph = r), t.flags & Od && (this.lastGlyph = r), Vd(this.glyphs, t.flags & Dd, this.firstGlyph, this.lastGlyph);
  }
  processContextualSubstitution(e, t, r) {
    let s = this.subtable.table.substitutionTable.items;
    if (t.markIndex !== 65535) {
      let a = s.getItem(t.markIndex), o = new Cr(a);
      e = this.glyphs[this.markedGlyph];
      var i = o.lookup(e.id);
      i && (this.glyphs[this.markedGlyph] = this.font.getGlyph(i, e.codePoints));
    }
    if (t.currentIndex !== 65535) {
      let a = s.getItem(t.currentIndex), o = new Cr(a);
      e = this.glyphs[r];
      var i = o.lookup(e.id);
      i && (this.glyphs[r] = this.font.getGlyph(i, e.codePoints));
    }
    t.flags & i1 && (this.markedGlyph = r);
  }
  processLigature(e, t, r) {
    if (t.flags & Md && this.ligatureStack.push(r), t.flags & Ld) {
      let s = this.subtable.table.ligatureActions, i = this.subtable.table.components, a = this.subtable.table.ligatureList, o = t.action, l = !1, f = 0, u = [], c = [];
      for (; !l; ) {
        let x = this.ligatureStack.pop();
        u.unshift(...this.glyphs[x].codePoints);
        let g = s.getItem(o++);
        l = !!(g & Rd);
        let m = !!(g & Ud), v = (g & Nd) << 2 >> 2;
        v += this.glyphs[x].id;
        let E = i.getItem(v);
        if (f += E, l || m) {
          let C = a.getItem(f);
          this.glyphs[x] = this.font.getGlyph(C, u), c.push(x), f = 0, u = [];
        } else this.glyphs[x] = this.font.getGlyph(65535);
      }
      this.ligatureStack.push(...c);
    }
  }
  processNoncontextualSubstitutions(e, t, r) {
    let s = new Cr(e.table.lookupTable);
    for (r = 0; r < t.length; r++) {
      let i = t[r];
      if (i.id !== 65535) {
        let a = s.lookup(i.id);
        a && (t[r] = this.font.getGlyph(a, i.codePoints));
      }
    }
  }
  _insertGlyphs(e, t, r, s) {
    let i = [];
    for (; r--; ) {
      let a = this.subtable.table.insertionActions.getItem(t++);
      i.push(this.font.getGlyph(a));
    }
    s || e++, this.glyphs.splice(e, 0, ...i);
  }
  processGlyphInsertion(e, t, r) {
    if (t.flags & i1 && (this.markedIndex = r), t.markedInsertIndex !== 65535) {
      let s = (t.flags & Wd) >>> 5, i = !!(t.flags & Gd);
      this._insertGlyphs(this.markedIndex, t.markedInsertIndex, s, i);
    }
    if (t.currentInsertIndex !== 65535) {
      let s = (t.flags & Hd) >>> 5, i = !!(t.flags & zd);
      this._insertGlyphs(r, t.currentInsertIndex, s, i);
    }
  }
  getSupportedFeatures() {
    let e = [];
    for (let t of this.morx.chains) for (let r of t.features) e.push([
      r.featureType,
      r.featureSetting
    ]);
    return e;
  }
  generateInputs(e) {
    return this.inputCache || this.generateInputCache(), this.inputCache[e] || [];
  }
  generateInputCache() {
    this.inputCache = {};
    for (let e of this.morx.chains) {
      let t = e.defaultFlags;
      for (let r of e.subtables) r.subFeatureFlags & t && this.generateInputsForSubtable(r);
    }
  }
  generateInputsForSubtable(e) {
    if (e.type !== 2) return;
    if (!!(e.coverage & a1)) throw new Error("Reverse subtable, not supported.");
    this.subtable = e, this.ligatureStack = [];
    let r = this.getStateMachine(e), s = this.getProcessor(), i = [], a = [];
    this.glyphs = [], r.traverse({
      enter: (o, l) => {
        let f = this.glyphs;
        a.push({
          glyphs: f.slice(),
          ligatureStack: this.ligatureStack.slice()
        });
        let u = this.font.getGlyph(o);
        i.push(u), f.push(i[i.length - 1]), s(f[f.length - 1], l, f.length - 1);
        let c = 0, x = 0;
        for (let g = 0; g < f.length && c <= 1; g++) f[g].id !== 65535 && (c++, x = f[g].id);
        if (c === 1) {
          let g = i.map((v) => v.id), m = this.inputCache[x];
          m ? m.push(g) : this.inputCache[x] = [
            g
          ];
        }
      },
      exit: () => {
        ({ glyphs: this.glyphs, ligatureStack: this.ligatureStack } = a.pop()), i.pop();
      }
    });
  }
  constructor(e) {
    this.processIndicRearragement = this.processIndicRearragement.bind(this), this.processContextualSubstitution = this.processContextualSubstitution.bind(this), this.processLigature = this.processLigature.bind(this), this.processNoncontextualSubstitutions = this.processNoncontextualSubstitutions.bind(this), this.processGlyphInsertion = this.processGlyphInsertion.bind(this), this.font = e, this.morx = e.morx, this.inputCache = null;
  }
}
Ve([
  _e
], Tl.prototype, "getStateMachine", null);
function Je(n, e, t, r = !1, s = !1) {
  let i = n.splice(t[0] - (t[1] - 1), t[1]);
  s && i.reverse();
  let a = n.splice(e[0], e[1], ...i);
  return r && a.reverse(), n.splice(t[0] - (e[1] - 1), 0, ...a), n;
}
function Vd(n, e, t, r) {
  switch (e) {
    case 0:
      return n;
    case 1:
      return Je(n, [
        t,
        1
      ], [
        r,
        0
      ]);
    case 2:
      return Je(n, [
        t,
        0
      ], [
        r,
        1
      ]);
    case 3:
      return Je(n, [
        t,
        1
      ], [
        r,
        1
      ]);
    case 4:
      return Je(n, [
        t,
        2
      ], [
        r,
        0
      ]);
    case 5:
      return Je(n, [
        t,
        2
      ], [
        r,
        0
      ], !0, !1);
    case 6:
      return Je(n, [
        t,
        0
      ], [
        r,
        2
      ]);
    case 7:
      return Je(n, [
        t,
        0
      ], [
        r,
        2
      ], !1, !0);
    case 8:
      return Je(n, [
        t,
        1
      ], [
        r,
        2
      ]);
    case 9:
      return Je(n, [
        t,
        1
      ], [
        r,
        2
      ], !1, !0);
    case 10:
      return Je(n, [
        t,
        2
      ], [
        r,
        1
      ]);
    case 11:
      return Je(n, [
        t,
        2
      ], [
        r,
        1
      ], !0, !1);
    case 12:
      return Je(n, [
        t,
        2
      ], [
        r,
        2
      ]);
    case 13:
      return Je(n, [
        t,
        2
      ], [
        r,
        2
      ], !0, !1);
    case 14:
      return Je(n, [
        t,
        2
      ], [
        r,
        2
      ], !1, !0);
    case 15:
      return Je(n, [
        t,
        2
      ], [
        r,
        2
      ], !0, !0);
    default:
      throw new Error(`Unknown verb: ${e}`);
  }
}
class _d {
  substitute(e) {
    e.direction === "rtl" && e.glyphs.reverse(), this.morxProcessor.process(e.glyphs, Pd(e.features));
  }
  getAvailableFeatures(e, t) {
    return Td(this.morxProcessor.getSupportedFeatures());
  }
  stringsForGlyph(e) {
    let t = this.morxProcessor.generateInputs(e), r = /* @__PURE__ */ new Set();
    for (let s of t) this._addStrings(s, 0, r, "");
    return r;
  }
  _addStrings(e, t, r, s) {
    let i = this.font._cmapProcessor.codePointsForGlyph(e[t]);
    for (let a of i) {
      let o = s + String.fromCodePoint(a);
      t < e.length - 1 ? this._addStrings(e, t + 1, r, o) : r.add(o);
    }
  }
  constructor(e) {
    this.font = e, this.morxProcessor = new Tl(e), this.fallbackPosition = !1;
  }
}
class qd {
  /**
  * Adds the given features to the last stage.
  * Ignores features that have already been applied.
  */
  _addFeatures(e, t) {
    let r = this.stages.length - 1, s = this.stages[r];
    for (let i of e) this.allFeatures[i] == null && (s.push(i), this.allFeatures[i] = r, t && (this.globalFeatures[i] = !0));
  }
  /**
  * Add features to the last stage
  */
  add(e, t = !0) {
    if (this.stages.length === 0 && this.stages.push([]), typeof e == "string" && (e = [
      e
    ]), Array.isArray(e)) this._addFeatures(e, t);
    else if (typeof e == "object")
      this._addFeatures(e.global || [], !0), this._addFeatures(e.local || [], !1);
    else throw new Error("Unsupported argument to ShapingPlan#add");
  }
  /**
  * Add a new stage
  */
  addStage(e, t) {
    typeof e == "function" ? this.stages.push(e, []) : (this.stages.push([]), this.add(e, t));
  }
  setFeatureOverrides(e) {
    if (Array.isArray(e)) this.add(e);
    else if (typeof e == "object") {
      for (let t in e)
        if (e[t]) this.add(t);
        else if (this.allFeatures[t] != null) {
          let r = this.stages[this.allFeatures[t]];
          r.splice(r.indexOf(t), 1), delete this.allFeatures[t], delete this.globalFeatures[t];
        }
    }
  }
  /**
  * Assigns the global features to the given glyphs
  */
  assignGlobalFeatures(e) {
    for (let t of e) for (let r in this.globalFeatures) t.features[r] = !0;
  }
  /**
  * Executes the planned stages using the given OTProcessor
  */
  process(e, t, r) {
    for (let s of this.stages)
      typeof s == "function" ? r || s(this.font, t, this) : s.length > 0 && e.applyFeatures(s, t, r);
  }
  constructor(e, t, r) {
    this.font = e, this.script = t, this.direction = r, this.stages = [], this.globalFeatures = {}, this.allFeatures = {};
  }
}
const $d = [
  "rvrn"
], Xd = [
  "ccmp",
  "locl",
  "rlig",
  "mark",
  "mkmk"
], jd = [
  "frac",
  "numr",
  "dnom"
], Yd = [
  "calt",
  "clig",
  "liga",
  "rclt",
  "curs",
  "kern"
], Kd = {
  ltr: [
    "ltra",
    "ltrm"
  ],
  rtl: [
    "rtla",
    "rtlm"
  ]
};
class pt {
  static plan(e, t, r) {
    this.planPreprocessing(e), this.planFeatures(e), this.planPostprocessing(e, r), e.assignGlobalFeatures(t), this.assignFeatures(e, t);
  }
  static planPreprocessing(e) {
    e.add({
      global: [
        ...$d,
        ...Kd[e.direction]
      ],
      local: jd
    });
  }
  static planFeatures(e) {
  }
  static planPostprocessing(e, t) {
    e.add([
      ...Xd,
      ...Yd
    ]), e.setFeatureOverrides(t);
  }
  static assignFeatures(e, t) {
    for (let r = 0; r < t.length; r++) {
      let s = t[r];
      if (s.codePoints[0] === 8260) {
        let i = r, a = r + 1;
        for (; i > 0 && Ia(t[i - 1].codePoints[0]); )
          t[i - 1].features.numr = !0, t[i - 1].features.frac = !0, i--;
        for (; a < t.length && Ia(t[a].codePoints[0]); )
          t[a].features.dnom = !0, t[a].features.frac = !0, a++;
        s.features.frac = !0, r = a - 1;
      }
    }
  }
}
n0(pt, "zeroMarkWidths", "AFTER_GPOS");
const Zd = new Ur(zi("APABAAAAAAAAOAAAAf0BAv7tmi1MxDAUx7vtvjhAgcDgkEgEAnmXEBIMCYaEcygEiqBQ4FAkCE4ikUgMiiBJSAgSiUQSDMn9L9eSl6bddddug9t7yS/trevre+3r27pcNxZiG+yCfdCVv/9LeQxOwRm4AJegD27ALbgD9+ABPJF+z+BN/h7yDj5k/VOWX6SdmU5+wLWknggxDxaS8u0qiiX4uiz9XamQ3wzDMAzDMAzDMAzDVI/h959V/v7BMAzDMAzDMLlyNTNiMSdewVxbiA44B4/guz1qW58VYlMI0WsJ0W+N6kXw0spvPtdwhtkwnGM6uLaV4Xyzg3v3PM9DPfQ/sOg4xPWjipy31P8LTqbU304c/cLCUmWJLNB2Uz2U1KTeRKNmKHVMfbJC+/0loTZRH/W5cvEvBJPMbREkWt3FD1NcqXZBSpuE2Ad0PBehPtNrPtIEdYP+hiRt/V1jIiE69X4NT/uVZI3PUHE9bm5M7ePGdZWy951v7Nn6j8v1WWKP3mt6ttnsigx6VN7Vc0VomSSGqW2mGNP1muZPl7LfjNUaKNFtDGVf2fvE9O7VlBS5j333c5p/eeoOqcs1R/hIqDWLJ7TTlksirVT1SI7l8k4Yp+g3jafGcrU1RM6l9th80XOpnlN97bDNY4i4s61B0Si/ipa0uHMl6zqEjlFfCZm/TM8KmzQDjmuTAQ==")), o1 = [
  "isol",
  "fina",
  "fin2",
  "fin3",
  "medi",
  "med2",
  "init"
], li = {
  Non_Joining: 0,
  Transparent: 6
}, Pe = "isol", J0 = "fina", Us = "fin2", Jd = "fin3", Zr = "medi", Jr = "med2", Qr = "init", pe = null, Qd = [
  //   Non_Joining,        Left_Joining,       Right_Joining,     Dual_Joining,           ALAPH,            DALATH RISH
  // State 0: prev was U,  not willing to join.
  [
    [
      pe,
      pe,
      0
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      pe,
      Pe,
      1
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      pe,
      Pe,
      1
    ],
    [
      pe,
      Pe,
      6
    ]
  ],
  // State 1: prev was R or ISOL/ALAPH,  not willing to join.
  [
    [
      pe,
      pe,
      0
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      pe,
      Pe,
      1
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      pe,
      Us,
      5
    ],
    [
      pe,
      Pe,
      6
    ]
  ],
  // State 2: prev was D/L in ISOL form,  willing to join.
  [
    [
      pe,
      pe,
      0
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      Qr,
      J0,
      1
    ],
    [
      Qr,
      J0,
      3
    ],
    [
      Qr,
      J0,
      4
    ],
    [
      Qr,
      J0,
      6
    ]
  ],
  // State 3: prev was D in FINA form,  willing to join.
  [
    [
      pe,
      pe,
      0
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      Zr,
      J0,
      1
    ],
    [
      Zr,
      J0,
      3
    ],
    [
      Zr,
      J0,
      4
    ],
    [
      Zr,
      J0,
      6
    ]
  ],
  // State 4: prev was FINA ALAPH,  not willing to join.
  [
    [
      pe,
      pe,
      0
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      Jr,
      Pe,
      1
    ],
    [
      Jr,
      Pe,
      2
    ],
    [
      Jr,
      Us,
      5
    ],
    [
      Jr,
      Pe,
      6
    ]
  ],
  // State 5: prev was FIN2/FIN3 ALAPH,  not willing to join.
  [
    [
      pe,
      pe,
      0
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      Pe,
      Pe,
      1
    ],
    [
      Pe,
      Pe,
      2
    ],
    [
      Pe,
      Us,
      5
    ],
    [
      Pe,
      Pe,
      6
    ]
  ],
  // State 6: prev was DALATH/RISH,  not willing to join.
  [
    [
      pe,
      pe,
      0
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      pe,
      Pe,
      1
    ],
    [
      pe,
      Pe,
      2
    ],
    [
      pe,
      Jd,
      5
    ],
    [
      pe,
      Pe,
      6
    ]
  ]
];
class Q0 extends pt {
  static planFeatures(e) {
    e.add([
      "ccmp",
      "locl"
    ]);
    for (let t = 0; t < o1.length; t++) {
      let r = o1[t];
      e.addStage(r, !1);
    }
    e.addStage("mset");
  }
  static assignFeatures(e, t) {
    super.assignFeatures(e, t);
    let r = -1, s = 0, i = [];
    for (let o = 0; o < t.length; o++) {
      let l, f;
      var a = t[o];
      let u = e3(a.codePoints[0]);
      if (u === li.Transparent) {
        i[o] = pe;
        continue;
      }
      [f, l, s] = Qd[s][u], f !== pe && r !== -1 && (i[r] = f), i[o] = l, r = o;
    }
    for (let o = 0; o < t.length; o++) {
      let l;
      var a = t[o];
      (l = i[o]) && (a.features[l] = !0);
    }
  }
}
function e3(n) {
  let e = Zd.get(n);
  if (e) return e - 1;
  let t = $n(n);
  return t === "Mn" || t === "Me" || t === "Cf" ? li.Transparent : li.Non_Joining;
}
class t3 {
  reset(e = {}, t = 0) {
    this.options = e, this.flags = e.flags || {}, this.markAttachmentType = e.markAttachmentType || 0, this.index = t;
  }
  get cur() {
    return this.glyphs[this.index] || null;
  }
  shouldIgnore(e) {
    return this.flags.ignoreMarks && e.isMark || this.flags.ignoreBaseGlyphs && e.isBase || this.flags.ignoreLigatures && e.isLigature || this.markAttachmentType && e.isMark && e.markAttachmentType !== this.markAttachmentType;
  }
  move(e) {
    for (this.index += e; 0 <= this.index && this.index < this.glyphs.length && this.shouldIgnore(this.glyphs[this.index]); ) this.index += e;
    return 0 > this.index || this.index >= this.glyphs.length ? null : this.glyphs[this.index];
  }
  next() {
    return this.move(1);
  }
  prev() {
    return this.move(-1);
  }
  peek(e = 1) {
    let t = this.index, r = this.increment(e);
    return this.index = t, r;
  }
  peekIndex(e = 1) {
    let t = this.index;
    this.increment(e);
    let r = this.index;
    return this.index = t, r;
  }
  increment(e = 1) {
    let t = e < 0 ? -1 : 1;
    for (e = Math.abs(e); e--; ) this.move(t);
    return this.glyphs[this.index];
  }
  constructor(e, t) {
    this.glyphs = e, this.reset(t);
  }
}
const r3 = [
  "DFLT",
  "dflt",
  "latn"
];
class Dn {
  findScript(e) {
    if (this.table.scriptList == null) return null;
    Array.isArray(e) || (e = [
      e
    ]);
    for (let t of e) for (let r of this.table.scriptList)
      if (r.tag === t) return r;
    return null;
  }
  selectScript(e, t, r) {
    let s = !1, i;
    if (!this.script || e !== this.scriptTag) {
      if (i = this.findScript(e), i || (i = this.findScript(r3)), !i) return this.scriptTag;
      this.scriptTag = i.tag, this.script = i.script, this.language = null, this.languageTag = null, s = !0;
    }
    if ((!r || r !== this.direction) && (this.direction = r || Pl(e)), t && t.length < 4 && (t += " ".repeat(4 - t.length)), !t || t !== this.languageTag) {
      this.language = null;
      for (let a of this.script.langSysRecords) if (a.tag === t) {
        this.language = a.langSys, this.languageTag = a.tag;
        break;
      }
      this.language || (this.language = this.script.defaultLangSys, this.languageTag = null), s = !0;
    }
    if (s && (this.features = {}, this.language))
      for (let a of this.language.featureIndexes) {
        let o = this.table.featureList[a], l = this.substituteFeatureForVariations(a);
        this.features[o.tag] = l || o.feature;
      }
    return this.scriptTag;
  }
  lookupsForFeatures(e = [], t) {
    let r = [];
    for (let s of e) {
      let i = this.features[s];
      if (i)
        for (let a of i.lookupListIndexes)
          t && t.indexOf(a) !== -1 || r.push({
            feature: s,
            index: a,
            lookup: this.table.lookupList.get(a)
          });
    }
    return r.sort((s, i) => s.index - i.index), r;
  }
  substituteFeatureForVariations(e) {
    if (this.variationsIndex === -1) return null;
    let r = this.table.featureVariations.featureVariationRecords[this.variationsIndex].featureTableSubstitution.substitutions;
    for (let s of r)
      if (s.featureIndex === e) return s.alternateFeatureTable;
    return null;
  }
  findVariationsIndex(e) {
    let t = this.table.featureVariations;
    if (!t) return -1;
    let r = t.featureVariationRecords;
    for (let s = 0; s < r.length; s++) {
      let i = r[s].conditionSet.conditionTable;
      if (this.variationConditionsMatch(i, e)) return s;
    }
    return -1;
  }
  variationConditionsMatch(e, t) {
    return e.every((r) => {
      let s = r.axisIndex < t.length ? t[r.axisIndex] : 0;
      return r.filterRangeMinValue <= s && s <= r.filterRangeMaxValue;
    });
  }
  applyFeatures(e, t, r) {
    let s = this.lookupsForFeatures(e);
    this.applyLookups(s, t, r);
  }
  applyLookups(e, t, r) {
    this.glyphs = t, this.positions = r, this.glyphIterator = new t3(t);
    for (let { feature: s, lookup: i } of e)
      for (this.currentFeature = s, this.glyphIterator.reset(i.flags); this.glyphIterator.index < t.length; ) {
        if (!(s in this.glyphIterator.cur.features)) {
          this.glyphIterator.next();
          continue;
        }
        for (let a of i.subTables)
          if (this.applyLookup(i.lookupType, a)) break;
        this.glyphIterator.next();
      }
  }
  applyLookup(e, t) {
    throw new Error("applyLookup must be implemented by subclasses");
  }
  applyLookupList(e) {
    let t = this.glyphIterator.options, r = this.glyphIterator.index;
    for (let s of e) {
      this.glyphIterator.reset(t, r), this.glyphIterator.increment(s.sequenceIndex);
      let i = this.table.lookupList.get(s.lookupListIndex);
      this.glyphIterator.reset(i.flags, this.glyphIterator.index);
      for (let a of i.subTables)
        if (this.applyLookup(i.lookupType, a)) break;
    }
    return this.glyphIterator.reset(t, r), !0;
  }
  coverageIndex(e, t) {
    switch (t == null && (t = this.glyphIterator.cur.id), e.version) {
      case 1:
        return e.glyphs.indexOf(t);
      case 2:
        for (let r of e.rangeRecords)
          if (r.start <= t && t <= r.end) return r.startCoverageIndex + t - r.start;
        break;
    }
    return -1;
  }
  match(e, t, r, s) {
    let i = this.glyphIterator.index, a = this.glyphIterator.increment(e), o = 0;
    for (; o < t.length && a && r(t[o], a); )
      s && s.push(this.glyphIterator.index), o++, a = this.glyphIterator.next();
    return this.glyphIterator.index = i, o < t.length ? !1 : s || !0;
  }
  sequenceMatches(e, t) {
    return this.match(e, t, (r, s) => r === s.id);
  }
  sequenceMatchIndices(e, t) {
    return this.match(e, t, (r, s) => this.currentFeature in s.features ? r === s.id : !1, []);
  }
  coverageSequenceMatches(e, t) {
    return this.match(e, t, (r, s) => this.coverageIndex(r, s.id) >= 0);
  }
  getClassID(e, t) {
    switch (t.version) {
      case 1:
        let r = e - t.startGlyph;
        if (r >= 0 && r < t.classValueArray.length) return t.classValueArray[r];
        break;
      case 2:
        for (let s of t.classRangeRecord)
          if (s.start <= e && e <= s.end) return s.class;
        break;
    }
    return 0;
  }
  classSequenceMatches(e, t, r) {
    return this.match(e, t, (s, i) => s === this.getClassID(i.id, r));
  }
  applyContext(e) {
    let t, r;
    switch (e.version) {
      case 1:
        if (t = this.coverageIndex(e.coverage), t === -1) return !1;
        r = e.ruleSets[t];
        for (let s of r)
          if (this.sequenceMatches(1, s.input)) return this.applyLookupList(s.lookupRecords);
        break;
      case 2:
        if (this.coverageIndex(e.coverage) === -1 || (t = this.getClassID(this.glyphIterator.cur.id, e.classDef), t === -1)) return !1;
        r = e.classSet[t];
        for (let s of r)
          if (this.classSequenceMatches(1, s.classes, e.classDef)) return this.applyLookupList(s.lookupRecords);
        break;
      case 3:
        if (this.coverageSequenceMatches(0, e.coverages)) return this.applyLookupList(e.lookupRecords);
        break;
    }
    return !1;
  }
  applyChainingContext(e) {
    let t;
    switch (e.version) {
      case 1:
        if (t = this.coverageIndex(e.coverage), t === -1) return !1;
        let r = e.chainRuleSets[t];
        for (let i of r)
          if (this.sequenceMatches(-i.backtrack.length, i.backtrack) && this.sequenceMatches(1, i.input) && this.sequenceMatches(1 + i.input.length, i.lookahead)) return this.applyLookupList(i.lookupRecords);
        break;
      case 2:
        if (this.coverageIndex(e.coverage) === -1) return !1;
        t = this.getClassID(this.glyphIterator.cur.id, e.inputClassDef);
        let s = e.chainClassSet[t];
        if (!s) return !1;
        for (let i of s)
          if (this.classSequenceMatches(-i.backtrack.length, i.backtrack, e.backtrackClassDef) && this.classSequenceMatches(1, i.input, e.inputClassDef) && this.classSequenceMatches(1 + i.input.length, i.lookahead, e.lookaheadClassDef)) return this.applyLookupList(i.lookupRecords);
        break;
      case 3:
        if (this.coverageSequenceMatches(-e.backtrackGlyphCount, e.backtrackCoverage) && this.coverageSequenceMatches(0, e.inputCoverage) && this.coverageSequenceMatches(e.inputGlyphCount, e.lookaheadCoverage)) return this.applyLookupList(e.lookupRecords);
        break;
    }
    return !1;
  }
  constructor(e, t) {
    this.font = e, this.table = t, this.script = null, this.scriptTag = null, this.language = null, this.languageTag = null, this.features = {}, this.lookups = {}, this.variationsIndex = e._variationProcessor ? this.findVariationsIndex(e._variationProcessor.normalizedCoords) : -1, this.selectScript(), this.glyphs = [], this.positions = [], this.ligatureID = 1, this.currentFeature = null;
  }
}
class A0 {
  get id() {
    return this._id;
  }
  set id(e) {
    this._id = e, this.substituted = !0;
    let t = this._font.GDEF;
    if (t && t.glyphClassDef) {
      let r = Dn.prototype.getClassID(e, t.glyphClassDef);
      this.isBase = r === 1, this.isLigature = r === 2, this.isMark = r === 3, this.markAttachmentType = t.markAttachClassDef ? Dn.prototype.getClassID(e, t.markAttachClassDef) : 0;
    } else
      this.isMark = this.codePoints.length > 0 && this.codePoints.every(Ko), this.isBase = !this.isMark, this.isLigature = this.codePoints.length > 1, this.markAttachmentType = 0;
  }
  copy() {
    return new A0(this._font, this.id, this.codePoints, this.features);
  }
  constructor(e, t, r = [], s) {
    if (this._font = e, this.codePoints = r, this.id = t, this.features = {}, Array.isArray(s)) for (let i = 0; i < s.length; i++) {
      let a = s[i];
      this.features[a] = !0;
    }
    else typeof s == "object" && Object.assign(this.features, s);
    this.ligatureID = null, this.ligatureComponent = null, this.isLigated = !1, this.cursiveAttachment = null, this.markAttachment = null, this.shaperInfo = null, this.substituted = !1, this.isMultiplied = !1;
  }
}
class Il extends pt {
  static planFeatures(e) {
    e.add([
      "ljmo",
      "vjmo",
      "tjmo"
    ], !1);
  }
  static assignFeatures(e, t) {
    let r = 0, s = 0;
    for (; s < t.length; ) {
      let i, o = t[s].codePoints[0], l = Un(o);
      switch ([i, r] = w3[r][l], i) {
        case H0:
          e.font.hasGlyphForCodePoint(o) || (s = Bl(t, s, e.font));
          break;
        case ci:
          s = v3(t, s, e.font);
          break;
        case fi:
          C3(t, s, e.font);
          break;
        case ui:
          s = S3(t, s, e.font);
          break;
      }
      s++;
    }
  }
}
n0(Il, "zeroMarkWidths", "NONE");
const nr = 44032, El = 55204, n3 = El - nr + 1, Zn = 4352, Jn = 4449, Et = 4519, s3 = 19, Mn = 21, Br = 28, i3 = Zn + s3 - 1, a3 = Jn + Mn - 1, o3 = Et + Br - 1, l1 = 9676, l3 = (n) => 4352 <= n && n <= 4447 || 43360 <= n && n <= 43388, c3 = (n) => 4448 <= n && n <= 4519 || 55216 <= n && n <= 55238, f3 = (n) => 4520 <= n && n <= 4607 || 55243 <= n && n <= 55291, u3 = (n) => 12334 <= n && n <= 12335, h3 = (n) => nr <= n && n <= El, d3 = (n) => n - nr < n3 && (n - nr) % Br === 0, x3 = (n) => Zn <= n && n <= i3, b3 = (n) => Jn <= n && n <= a3, p3 = (n) => 1 <= n && n <= o3, g3 = 0, m3 = 1, Ln = 2, Hi = 3, Rn = 4, Fl = 5, A3 = 6;
function Un(n) {
  return l3(n) ? m3 : c3(n) ? Ln : f3(n) ? Hi : d3(n) ? Rn : h3(n) ? Fl : u3(n) ? A3 : g3;
}
const t0 = 0, H0 = 1, ci = 2, fi = 4, ui = 5, w3 = [
  //       X                 L                 V                T                  LV                LVT               M
  // State 0: start state
  [
    [
      t0,
      0
    ],
    [
      t0,
      1
    ],
    [
      t0,
      0
    ],
    [
      t0,
      0
    ],
    [
      H0,
      2
    ],
    [
      H0,
      3
    ],
    [
      ui,
      0
    ]
  ],
  // State 1: <L>
  [
    [
      t0,
      0
    ],
    [
      t0,
      1
    ],
    [
      ci,
      2
    ],
    [
      t0,
      0
    ],
    [
      H0,
      2
    ],
    [
      H0,
      3
    ],
    [
      ui,
      0
    ]
  ],
  // State 2: <L,V> or <LV>
  [
    [
      t0,
      0
    ],
    [
      t0,
      1
    ],
    [
      t0,
      0
    ],
    [
      ci,
      3
    ],
    [
      H0,
      2
    ],
    [
      H0,
      3
    ],
    [
      fi,
      0
    ]
  ],
  // State 3: <L,V,T> or <LVT>
  [
    [
      t0,
      0
    ],
    [
      t0,
      1
    ],
    [
      t0,
      0
    ],
    [
      t0,
      0
    ],
    [
      H0,
      2
    ],
    [
      H0,
      3
    ],
    [
      fi,
      0
    ]
  ]
];
function Sr(n, e, t) {
  return new A0(n, n.glyphForCodePoint(e).id, [
    e
  ], t);
}
function Bl(n, e, t) {
  let r = n[e], i = r.codePoints[0] - nr, a = Et + i % Br;
  i = i / Br | 0;
  let o = Zn + i / Mn | 0, l = Jn + i % Mn;
  if (!t.hasGlyphForCodePoint(o) || !t.hasGlyphForCodePoint(l) || a !== Et && !t.hasGlyphForCodePoint(a)) return e;
  let f = Sr(t, o, r.features);
  f.features.ljmo = !0;
  let u = Sr(t, l, r.features);
  u.features.vjmo = !0;
  let c = [
    f,
    u
  ];
  if (a > Et) {
    let x = Sr(t, a, r.features);
    x.features.tjmo = !0, c.push(x);
  }
  return n.splice(e, 1, ...c), e + c.length - 1;
}
function v3(n, e, t) {
  let r = n[e], s = n[e].codePoints[0], i = Un(s), a = n[e - 1].codePoints[0], o = Un(a), l, f, u, c;
  if (o === Rn && i === Hi)
    l = a, c = r;
  else {
    i === Ln ? (f = n[e - 1], u = r) : (f = n[e - 2], u = n[e - 1], c = r);
    let g = f.codePoints[0], m = u.codePoints[0];
    x3(g) && b3(m) && (l = nr + ((g - Zn) * Mn + (m - Jn)) * Br);
  }
  let x = c && c.codePoints[0] || Et;
  if (l != null && (x === Et || p3(x))) {
    let g = l + (x - Et);
    if (t.hasGlyphForCodePoint(g)) {
      let m = o === Ln ? 3 : 2;
      return n.splice(e - m + 1, m, Sr(t, g, r.features)), e - m + 1;
    }
  }
  return f && (f.features.ljmo = !0), u && (u.features.vjmo = !0), c && (c.features.tjmo = !0), o === Rn ? (Bl(n, e - 1, t), e + 1) : e;
}
function y3(n) {
  switch (Un(n)) {
    case Rn:
    case Fl:
      return 1;
    case Ln:
      return 2;
    case Hi:
      return 3;
  }
}
function C3(n, e, t) {
  let r = n[e], s = n[e].codePoints[0];
  if (t.glyphForCodePoint(s).advanceWidth === 0) return;
  let i = n[e - 1].codePoints[0], a = y3(i);
  return n.splice(e, 1), n.splice(e - a, 0, r);
}
function S3(n, e, t) {
  let r = n[e], s = n[e].codePoints[0];
  if (t.hasGlyphForCodePoint(l1)) {
    let i = Sr(t, l1, r.features), a = t.glyphForCodePoint(s).advanceWidth === 0 ? e : e + 1;
    n.splice(a, 0, i), e++;
  }
  return e;
}
var Ol = {};
Ol = JSON.parse('{"stateTable":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,2,3,4,5,6,7,8,9,0,10,11,11,12,13,14,15,16,17],[0,0,0,18,19,20,21,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,28,29,30,31,32,33,0,34,0,0,35,36,0,0,37,0],[0,0,0,38,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,39,0,0,0,40,41,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,43,44,44,8,9,0,0,0,0,12,43,0,0,0,0],[0,0,0,0,43,44,44,8,9,0,0,0,0,0,43,0,0,0,0],[0,0,0,45,46,47,48,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,50,0,0,51,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,52,0,0,0,0,0,0,0,0],[0,0,0,53,54,55,56,57,58,0,59,0,0,60,61,0,0,62,0],[0,0,0,4,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,63,64,0,0,40,41,0,9,0,10,0,0,0,42,0,63,0,0],[0,2,3,4,5,6,7,8,9,0,10,11,11,12,13,0,2,16,0],[0,0,0,18,65,20,21,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,0,66,67,67,8,9,0,10,0,0,0,68,0,0,0,0],[0,0,0,69,0,70,70,0,71,0,72,0,0,0,0,0,0,0,0],[0,0,0,73,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,75,0,0,0,76,77,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,79,80,80,22,23,0,0,0,0,25,79,0,0,0,0],[0,0,0,18,19,20,74,22,23,0,24,0,0,25,26,0,0,27,0],[0,0,0,81,82,83,84,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,86,0,0,87,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,88,0,0,0,0,0,0,0,0],[0,0,0,18,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,89,90,0,0,76,77,0,23,0,24,0,0,0,78,0,89,0,0],[0,0,0,0,91,92,92,22,23,0,24,0,0,0,93,0,0,0,0],[0,0,0,94,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,96,0,0,0,97,98,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,35,100,0,0,0,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,0,100,0,0,0,0],[0,0,0,102,103,104,105,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,107,0,0,108,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,109,0,0,0,0,0,0,0,0],[0,0,0,28,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,110,111,0,0,97,98,0,33,0,34,0,0,0,99,0,110,0,0],[0,0,0,0,112,113,113,32,33,0,34,0,0,0,114,0,0,0,0],[0,0,0,0,5,7,7,8,9,0,10,0,0,0,13,0,0,16,0],[0,0,0,115,116,117,118,8,9,0,10,0,0,119,120,0,0,16,0],[0,0,0,0,0,121,121,0,9,0,10,0,0,0,42,0,0,0,0],[0,39,0,122,0,123,123,8,9,0,10,0,0,0,42,0,39,0,0],[0,124,64,0,0,0,0,0,0,0,0,0,0,0,0,0,124,0,0],[0,39,0,0,0,121,125,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,126,126,8,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,46,47,48,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,47,47,49,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,127,127,49,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,128,127,127,49,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,129,130,131,132,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,50,0,0,0,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,134,0,0,0,0,0,0,0,0],[0,0,0,135,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,136,0,0,0,137,138,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,140,141,141,57,58,0,0,0,0,60,140,0,0,0,0],[0,0,0,0,140,141,141,57,58,0,0,0,0,0,140,0,0,0,0],[0,0,0,142,143,144,145,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,147,0,0,148,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,149,0,0,0,0,0,0,0,0],[0,0,0,53,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,150,151,0,0,137,138,0,58,0,59,0,0,0,139,0,150,0,0],[0,0,0,0,152,153,153,57,58,0,59,0,0,0,154,0,0,0,0],[0,0,0,155,116,156,157,8,9,0,10,0,0,158,120,0,0,16,0],[0,0,0,0,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,75,3,4,5,159,160,8,161,0,162,0,11,12,163,0,75,16,0],[0,0,0,0,0,40,164,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,0,165,0,0,0,0],[0,124,64,0,0,40,164,0,9,0,10,0,0,0,42,0,124,0,0],[0,0,0,0,0,70,70,0,71,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,71,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,166,0,0,167,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,168,0,0,0,0,0,0,0,0],[0,0,0,0,19,74,74,22,23,0,24,0,0,0,26,0,0,27,0],[0,0,0,0,79,80,80,22,23,0,0,0,0,0,79,0,0,0,0],[0,0,0,169,170,171,172,22,23,0,24,0,0,173,174,0,0,27,0],[0,0,0,0,0,175,175,0,23,0,24,0,0,0,78,0,0,0,0],[0,75,0,176,0,177,177,22,23,0,24,0,0,0,78,0,75,0,0],[0,178,90,0,0,0,0,0,0,0,0,0,0,0,0,0,178,0,0],[0,75,0,0,0,175,179,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,180,180,22,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,82,83,84,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,83,83,85,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,181,181,85,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,182,181,181,85,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,183,184,185,186,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,86,0,0,0,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,188,0,0,0,0,0,0,0,0],[0,0,0,189,170,190,191,22,23,0,24,0,0,192,174,0,0,27,0],[0,0,0,0,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,76,193,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,0,194,0,0,0,0],[0,178,90,0,0,76,193,0,23,0,24,0,0,0,78,0,178,0,0],[0,0,0,0,29,95,31,32,33,0,34,0,0,0,36,0,0,37,0],[0,0,0,0,100,101,101,32,33,0,0,0,0,0,100,0,0,0,0],[0,0,0,195,196,197,198,32,33,0,34,0,0,199,200,0,0,37,0],[0,0,0,0,0,201,201,0,33,0,34,0,0,0,99,0,0,0,0],[0,96,0,202,0,203,203,32,33,0,34,0,0,0,99,0,96,0,0],[0,204,111,0,0,0,0,0,0,0,0,0,0,0,0,0,204,0,0],[0,96,0,0,0,201,205,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,206,206,32,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,103,104,105,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,104,104,106,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,207,207,106,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,208,207,207,106,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,209,210,211,212,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,107,0,0,0,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,214,0,0,0,0,0,0,0,0],[0,0,0,215,196,216,217,32,33,0,34,0,0,218,200,0,0,37,0],[0,0,0,0,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,97,219,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,0,220,0,0,0,0],[0,204,111,0,0,97,219,0,33,0,34,0,0,0,99,0,204,0,0],[0,0,0,221,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,223,0,0,0,40,224,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,119,225,0,0,0,0],[0,0,0,115,116,117,222,8,9,0,10,0,0,119,120,0,0,16,0],[0,0,0,115,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,226,64,0,0,40,224,0,9,0,10,0,0,0,42,0,226,0,0],[0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0],[0,39,0,0,0,121,121,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,44,44,8,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,227,0,228,229,0,9,0,10,0,0,230,0,0,0,0,0],[0,39,0,122,0,121,121,0,9,0,10,0,0,0,42,0,39,0,0],[0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,231,231,49,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,232,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,130,131,132,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,131,131,133,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,233,233,133,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,234,233,233,133,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,235,236,237,238,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,54,56,56,57,58,0,59,0,0,0,61,0,0,62,0],[0,0,0,240,241,242,243,57,58,0,59,0,0,244,245,0,0,62,0],[0,0,0,0,0,246,246,0,58,0,59,0,0,0,139,0,0,0,0],[0,136,0,247,0,248,248,57,58,0,59,0,0,0,139,0,136,0,0],[0,249,151,0,0,0,0,0,0,0,0,0,0,0,0,0,249,0,0],[0,136,0,0,0,246,250,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,251,251,57,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,143,144,145,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,144,144,146,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,252,252,146,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,253,252,252,146,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,254,255,256,257,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,147,0,0,0,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,259,0,0,0,0,0,0,0,0],[0,0,0,260,241,261,262,57,58,0,59,0,0,263,245,0,0,62,0],[0,0,0,0,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,137,264,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,0,265,0,0,0,0],[0,249,151,0,0,137,264,0,58,0,59,0,0,0,139,0,249,0,0],[0,0,0,221,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,158,225,0,0,0,0],[0,0,0,155,116,156,222,8,9,0,10,0,0,158,120,0,0,16,0],[0,0,0,155,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,43,266,266,8,161,0,24,0,0,12,267,0,0,0,0],[0,75,0,176,43,268,268,269,161,0,24,0,0,0,267,0,75,0,0],[0,0,0,0,0,270,0,0,271,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,272,0,0,0,0,0,0,0,0],[0,273,274,0,0,40,41,0,9,0,10,0,0,0,42,0,273,0,0],[0,0,0,40,0,123,123,8,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,121,275,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,166,0,0,0,0,72,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,276,0,0,0,0,0,0,0,0],[0,0,0,277,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,279,0,0,0,76,280,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,173,281,0,0,0,0],[0,0,0,169,170,171,278,22,23,0,24,0,0,173,174,0,0,27,0],[0,0,0,169,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,282,90,0,0,76,280,0,23,0,24,0,0,0,78,0,282,0,0],[0,0,0,0,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0],[0,75,0,0,0,175,175,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,80,80,22,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,283,0,284,285,0,23,0,24,0,0,286,0,0,0,0,0],[0,75,0,176,0,175,175,0,23,0,24,0,0,0,78,0,75,0,0],[0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,287,287,85,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,288,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,184,185,186,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,185,185,187,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,289,289,187,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,290,289,289,187,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,291,292,293,294,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,277,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,192,281,0,0,0,0],[0,0,0,189,170,190,278,22,23,0,24,0,0,192,174,0,0,27,0],[0,0,0,189,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,76,0,177,177,22,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,175,296,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,297,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,299,0,0,0,97,300,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,199,301,0,0,0,0],[0,0,0,195,196,197,298,32,33,0,34,0,0,199,200,0,0,37,0],[0,0,0,195,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,302,111,0,0,97,300,0,33,0,34,0,0,0,99,0,302,0,0],[0,0,0,0,0,0,0,0,33,0,0,0,0,0,0,0,0,0,0],[0,96,0,0,0,201,201,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,101,101,32,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,303,0,304,305,0,33,0,34,0,0,306,0,0,0,0,0],[0,96,0,202,0,201,201,0,33,0,34,0,0,0,99,0,96,0,0],[0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,307,307,106,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,308,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,210,211,212,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,211,211,213,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,309,309,213,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,310,309,309,213,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,311,312,313,314,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,297,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,218,301,0,0,0,0],[0,0,0,215,196,216,298,32,33,0,34,0,0,218,200,0,0,37,0],[0,0,0,215,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,97,0,203,203,32,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,201,316,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,116,222,222,8,9,0,10,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,9,0,0,0,0,0,225,0,0,0,0],[0,0,0,317,318,319,320,8,9,0,10,0,0,321,322,0,0,16,0],[0,223,0,323,0,123,123,8,9,0,10,0,0,0,42,0,223,0,0],[0,223,0,0,0,121,324,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,325,318,326,327,8,9,0,10,0,0,328,322,0,0,16,0],[0,0,0,64,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,9,0,0,0,0,230,0,0,0,0,0],[0,0,0,227,0,228,121,0,9,0,10,0,0,230,0,0,0,0,0],[0,0,0,227,0,121,121,0,9,0,10,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,49,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,0,0],[0,0,0,0,0,329,329,133,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,330,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,236,237,238,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,237,237,239,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,331,331,239,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,332,331,331,239,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,333,40,121,334,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,335,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,337,0,0,0,137,338,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,244,339,0,0,0,0],[0,0,0,240,241,242,336,57,58,0,59,0,0,244,245,0,0,62,0],[0,0,0,240,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,340,151,0,0,137,338,0,58,0,59,0,0,0,139,0,340,0,0],[0,0,0,0,0,0,0,0,58,0,0,0,0,0,0,0,0,0,0],[0,136,0,0,0,246,246,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,141,141,57,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,341,0,342,343,0,58,0,59,0,0,344,0,0,0,0,0],[0,136,0,247,0,246,246,0,58,0,59,0,0,0,139,0,136,0,0],[0,0,0,0,0,0,0,57,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,345,345,146,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,346,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,255,256,257,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,256,256,258,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,347,347,258,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,348,347,347,258,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,349,350,351,352,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,335,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,263,339,0,0,0,0],[0,0,0,260,241,261,336,57,58,0,59,0,0,263,245,0,0,62,0],[0,0,0,260,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,137,0,248,248,57,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,246,354,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,126,126,8,23,0,0,0,0,0,0,0,0,0,0],[0,355,90,0,0,121,125,0,9,0,10,0,0,0,42,0,355,0,0],[0,0,0,0,0,356,356,269,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,357,358,359,360,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,270,0,0,0,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,363,0,0,0,0,0,0,0,0],[0,0,0,364,116,365,366,8,161,0,162,0,0,367,120,0,0,16,0],[0,0,0,0,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,40,0,121,121,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,170,278,278,22,23,0,24,0,0,0,174,0,0,27,0],[0,0,0,0,281,80,80,22,23,0,0,0,0,0,281,0,0,0,0],[0,0,0,369,370,371,372,22,23,0,24,0,0,373,374,0,0,27,0],[0,279,0,375,0,177,177,22,23,0,24,0,0,0,78,0,279,0,0],[0,279,0,0,0,175,376,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,377,370,378,379,22,23,0,24,0,0,380,374,0,0,27,0],[0,0,0,90,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,23,0,0,0,0,286,0,0,0,0,0],[0,0,0,283,0,284,175,0,23,0,24,0,0,286,0,0,0,0,0],[0,0,0,283,0,175,175,0,23,0,24,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,85,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,82,0,0],[0,0,0,0,0,381,381,187,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,382,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,292,293,294,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,293,293,295,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,0,383,383,295,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,384,383,383,295,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,385,76,175,386,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,76,0,175,175,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,196,298,298,32,33,0,34,0,0,0,200,0,0,37,0],[0,0,0,0,301,101,101,32,33,0,0,0,0,0,301,0,0,0,0],[0,0,0,387,388,389,390,32,33,0,34,0,0,391,392,0,0,37,0],[0,299,0,393,0,203,203,32,33,0,34,0,0,0,99,0,299,0,0],[0,299,0,0,0,201,394,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,395,388,396,397,32,33,0,34,0,0,398,392,0,0,37,0],[0,0,0,111,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,33,0,0,0,0,306,0,0,0,0,0],[0,0,0,303,0,304,201,0,33,0,34,0,0,306,0,0,0,0,0],[0,0,0,303,0,201,201,0,33,0,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,106,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,103,0,0],[0,0,0,0,0,399,399,213,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,400,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,312,313,314,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,313,313,315,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,0,401,401,315,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,402,401,401,315,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,403,97,201,404,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,97,0,201,201,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,405,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,407,0,0,0,40,408,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,321,409,0,0,0,0],[0,0,0,317,318,319,406,8,9,0,10,0,0,321,322,0,0,16,0],[0,0,0,317,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,410,64,0,0,40,408,0,9,0,10,0,0,0,42,0,410,0,0],[0,223,0,0,0,121,121,0,9,0,10,0,0,0,42,0,223,0,0],[0,223,0,323,0,121,121,0,9,0,10,0,0,0,42,0,223,0,0],[0,0,0,405,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,328,409,0,0,0,0],[0,0,0,325,318,326,406,8,9,0,10,0,0,328,322,0,0,16,0],[0,0,0,325,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,0,0,0,133,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,130,0,0],[0,0,0,0,0,411,411,239,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,412,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,40,121,334,0,9,0,10,0,0,0,42,0,0,0,0],[0,0,0,0,413,0,0,0,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,241,336,336,57,58,0,59,0,0,0,245,0,0,62,0],[0,0,0,0,339,141,141,57,58,0,0,0,0,0,339,0,0,0,0],[0,0,0,414,415,416,417,57,58,0,59,0,0,418,419,0,0,62,0],[0,337,0,420,0,248,248,57,58,0,59,0,0,0,139,0,337,0,0],[0,337,0,0,0,246,421,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,422,415,423,424,57,58,0,59,0,0,425,419,0,0,62,0],[0,0,0,151,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,58,0,0,0,0,344,0,0,0,0,0],[0,0,0,341,0,342,246,0,58,0,59,0,0,344,0,0,0,0,0],[0,0,0,341,0,246,246,0,58,0,59,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,146,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,143,0,0],[0,0,0,0,0,426,426,258,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,427,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,350,351,352,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,351,351,353,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,0,428,428,353,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,429,428,428,353,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,430,137,246,431,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,137,0,246,246,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,432,116,433,434,8,161,0,162,0,0,435,120,0,0,16,0],[0,0,0,0,0,180,180,269,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,358,359,360,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,359,359,361,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,436,436,361,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,437,436,436,361,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,438,439,440,441,442,161,0,162,0,0,0,362,0,0,0,0],[0,443,274,0,0,0,0,0,0,0,0,0,0,0,0,0,443,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,444,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,367,225,0,0,0,0],[0,0,0,364,116,365,445,8,161,0,162,0,0,367,120,0,0,16,0],[0,0,0,364,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,0,0,0,0,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,446,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,448,0,0,0,76,449,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,373,450,0,0,0,0],[0,0,0,369,370,371,447,22,23,0,24,0,0,373,374,0,0,27,0],[0,0,0,369,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,451,90,0,0,76,449,0,23,0,24,0,0,0,78,0,451,0,0],[0,279,0,0,0,175,175,0,23,0,24,0,0,0,78,0,279,0,0],[0,279,0,375,0,175,175,0,23,0,24,0,0,0,78,0,279,0,0],[0,0,0,446,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,380,450,0,0,0,0],[0,0,0,377,370,378,447,22,23,0,24,0,0,380,374,0,0,27,0],[0,0,0,377,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,0,0,0,187,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,0,0],[0,0,0,0,0,452,452,295,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,453,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,76,175,386,0,23,0,24,0,0,0,78,0,0,0,0],[0,0,0,0,454,0,0,0,23,0,0,0,0,0,0,0,0,0,0],[0,0,0,455,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,457,0,0,0,97,458,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,391,459,0,0,0,0],[0,0,0,387,388,389,456,32,33,0,34,0,0,391,392,0,0,37,0],[0,0,0,387,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,460,111,0,0,97,458,0,33,0,34,0,0,0,99,0,460,0,0],[0,299,0,0,0,201,201,0,33,0,34,0,0,0,99,0,299,0,0],[0,299,0,393,0,201,201,0,33,0,34,0,0,0,99,0,299,0,0],[0,0,0,455,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,398,459,0,0,0,0],[0,0,0,395,388,396,456,32,33,0,34,0,0,398,392,0,0,37,0],[0,0,0,395,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,0,0,0,213,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,210,0,0],[0,0,0,0,0,461,461,315,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,462,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,97,201,404,0,33,0,34,0,0,0,99,0,0,0,0],[0,0,0,0,463,0,0,0,33,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,318,406,406,8,9,0,10,0,0,0,322,0,0,16,0],[0,0,0,0,409,44,44,8,9,0,0,0,0,0,409,0,0,0,0],[0,0,0,464,465,466,467,8,9,0,10,0,0,468,469,0,0,16,0],[0,407,0,470,0,123,123,8,9,0,10,0,0,0,42,0,407,0,0],[0,407,0,0,0,121,471,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,472,465,473,474,8,9,0,10,0,0,475,469,0,0,16,0],[0,0,0,0,0,0,0,239,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,236,0,0],[0,0,0,0,0,0,476,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,477,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,479,0,0,0,137,480,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,418,481,0,0,0,0],[0,0,0,414,415,416,478,57,58,0,59,0,0,418,419,0,0,62,0],[0,0,0,414,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,482,151,0,0,137,480,0,58,0,59,0,0,0,139,0,482,0,0],[0,337,0,0,0,246,246,0,58,0,59,0,0,0,139,0,337,0,0],[0,337,0,420,0,246,246,0,58,0,59,0,0,0,139,0,337,0,0],[0,0,0,477,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,425,481,0,0,0,0],[0,0,0,422,415,423,478,57,58,0,59,0,0,425,419,0,0,62,0],[0,0,0,422,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,0,0,0,258,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0],[0,0,0,0,0,483,483,353,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,484,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,137,246,431,0,58,0,59,0,0,0,139,0,0,0,0],[0,0,0,0,485,0,0,0,58,0,0,0,0,0,0,0,0,0,0],[0,0,0,444,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,435,225,0,0,0,0],[0,0,0,432,116,433,445,8,161,0,162,0,0,435,120,0,0,16,0],[0,0,0,432,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,0,486,486,361,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,487,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,439,440,441,442,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,440,440,442,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,488,488,442,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,489,488,488,442,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,490,491,492,493,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,495,0,496,497,0,161,0,162,0,0,498,0,0,0,0,0],[0,0,0,0,116,445,445,8,161,0,162,0,0,0,120,0,0,16,0],[0,0,0,0,225,44,44,8,161,0,0,0,0,0,225,0,0,0,0],[0,0,0,0,370,447,447,22,23,0,24,0,0,0,374,0,0,27,0],[0,0,0,0,450,80,80,22,23,0,0,0,0,0,450,0,0,0,0],[0,0,0,499,500,501,502,22,23,0,24,0,0,503,504,0,0,27,0],[0,448,0,505,0,177,177,22,23,0,24,0,0,0,78,0,448,0,0],[0,448,0,0,0,175,506,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,507,500,508,509,22,23,0,24,0,0,510,504,0,0,27,0],[0,0,0,0,0,0,0,295,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,292,0,0],[0,0,0,0,0,0,511,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,388,456,456,32,33,0,34,0,0,0,392,0,0,37,0],[0,0,0,0,459,101,101,32,33,0,0,0,0,0,459,0,0,0,0],[0,0,0,512,513,514,515,32,33,0,34,0,0,516,517,0,0,37,0],[0,457,0,518,0,203,203,32,33,0,34,0,0,0,99,0,457,0,0],[0,457,0,0,0,201,519,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,520,513,521,522,32,33,0,34,0,0,523,517,0,0,37,0],[0,0,0,0,0,0,0,315,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,312,0,0],[0,0,0,0,0,0,524,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,525,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,527,0,0,0,40,528,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,468,529,0,0,0,0],[0,0,0,464,465,466,526,8,9,0,10,0,0,468,469,0,0,16,0],[0,0,0,464,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,530,64,0,0,40,528,0,9,0,10,0,0,0,42,0,530,0,0],[0,407,0,0,0,121,121,0,9,0,10,0,0,0,42,0,407,0,0],[0,407,0,470,0,121,121,0,9,0,10,0,0,0,42,0,407,0,0],[0,0,0,525,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,475,529,0,0,0,0],[0,0,0,472,465,473,526,8,9,0,10,0,0,475,469,0,0,16,0],[0,0,0,472,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,0,0],[0,0,0,0,415,478,478,57,58,0,59,0,0,0,419,0,0,62,0],[0,0,0,0,481,141,141,57,58,0,0,0,0,0,481,0,0,0,0],[0,0,0,531,532,533,534,57,58,0,59,0,0,535,536,0,0,62,0],[0,479,0,537,0,248,248,57,58,0,59,0,0,0,139,0,479,0,0],[0,479,0,0,0,246,538,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,539,532,540,541,57,58,0,59,0,0,542,536,0,0,62,0],[0,0,0,0,0,0,0,353,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,350,0,0],[0,0,0,0,0,0,543,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,361,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,358,0,0],[0,0,0,0,0,544,544,442,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,545,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,491,492,493,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,492,492,494,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,546,546,494,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,547,546,546,494,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,548,549,368,550,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,274,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,161,0,0,0,0,498,0,0,0,0,0],[0,0,0,495,0,496,368,0,161,0,162,0,0,498,0,0,0,0,0],[0,0,0,495,0,368,368,0,161,0,162,0,0,0,0,0,0,0,0],[0,0,0,551,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,553,0,0,0,76,554,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,503,555,0,0,0,0],[0,0,0,499,500,501,552,22,23,0,24,0,0,503,504,0,0,27,0],[0,0,0,499,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,556,90,0,0,76,554,0,23,0,24,0,0,0,78,0,556,0,0],[0,448,0,0,0,175,175,0,23,0,24,0,0,0,78,0,448,0,0],[0,448,0,505,0,175,175,0,23,0,24,0,0,0,78,0,448,0,0],[0,0,0,551,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,510,555,0,0,0,0],[0,0,0,507,500,508,552,22,23,0,24,0,0,510,504,0,0,27,0],[0,0,0,507,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0],[0,0,0,557,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,559,0,0,0,97,560,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,516,561,0,0,0,0],[0,0,0,512,513,514,558,32,33,0,34,0,0,516,517,0,0,37,0],[0,0,0,512,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,562,111,0,0,97,560,0,33,0,34,0,0,0,99,0,562,0,0],[0,457,0,0,0,201,201,0,33,0,34,0,0,0,99,0,457,0,0],[0,457,0,518,0,201,201,0,33,0,34,0,0,0,99,0,457,0,0],[0,0,0,557,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,523,561,0,0,0,0],[0,0,0,520,513,521,558,32,33,0,34,0,0,523,517,0,0,37,0],[0,0,0,520,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,0,0],[0,0,0,0,465,526,526,8,9,0,10,0,0,0,469,0,0,16,0],[0,0,0,0,529,44,44,8,9,0,0,0,0,0,529,0,0,0,0],[0,0,0,563,66,564,565,8,9,0,10,0,0,566,68,0,0,16,0],[0,527,0,567,0,123,123,8,9,0,10,0,0,0,42,0,527,0,0],[0,527,0,0,0,121,568,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,569,66,570,571,8,9,0,10,0,0,572,68,0,0,16,0],[0,0,0,573,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,575,0,0,0,137,576,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,535,577,0,0,0,0],[0,0,0,531,532,533,574,57,58,0,59,0,0,535,536,0,0,62,0],[0,0,0,531,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,578,151,0,0,137,576,0,58,0,59,0,0,0,139,0,578,0,0],[0,479,0,0,0,246,246,0,58,0,59,0,0,0,139,0,479,0,0],[0,479,0,537,0,246,246,0,58,0,59,0,0,0,139,0,479,0,0],[0,0,0,573,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,542,577,0,0,0,0],[0,0,0,539,532,540,574,57,58,0,59,0,0,542,536,0,0,62,0],[0,0,0,539,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,137,0,0],[0,0,0,0,0,0,0,442,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,439,0,0],[0,0,0,0,0,579,579,494,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,580,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,549,368,550,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,0,368,368,0,161,0,162,0,0,0,362,0,0,0,0],[0,0,0,0,581,0,0,0,161,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,500,552,552,22,23,0,24,0,0,0,504,0,0,27,0],[0,0,0,0,555,80,80,22,23,0,0,0,0,0,555,0,0,0,0],[0,0,0,582,91,583,584,22,23,0,24,0,0,585,93,0,0,27,0],[0,553,0,586,0,177,177,22,23,0,24,0,0,0,78,0,553,0,0],[0,553,0,0,0,175,587,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,588,91,589,590,22,23,0,24,0,0,591,93,0,0,27,0],[0,0,0,0,513,558,558,32,33,0,34,0,0,0,517,0,0,37,0],[0,0,0,0,561,101,101,32,33,0,0,0,0,0,561,0,0,0,0],[0,0,0,592,112,593,594,32,33,0,34,0,0,595,114,0,0,37,0],[0,559,0,596,0,203,203,32,33,0,34,0,0,0,99,0,559,0,0],[0,559,0,0,0,201,597,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,598,112,599,600,32,33,0,34,0,0,601,114,0,0,37,0],[0,0,0,602,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,566,165,0,0,0,0],[0,0,0,563,66,564,67,8,9,0,10,0,0,566,68,0,0,16,0],[0,0,0,563,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,527,0,0,0,121,121,0,9,0,10,0,0,0,42,0,527,0,0],[0,527,0,567,0,121,121,0,9,0,10,0,0,0,42,0,527,0,0],[0,0,0,602,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,165,44,44,8,9,0,0,0,0,572,165,0,0,0,0],[0,0,0,569,66,570,67,8,9,0,10,0,0,572,68,0,0,16,0],[0,0,0,569,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,0,532,574,574,57,58,0,59,0,0,0,536,0,0,62,0],[0,0,0,0,577,141,141,57,58,0,0,0,0,0,577,0,0,0,0],[0,0,0,603,152,604,605,57,58,0,59,0,0,606,154,0,0,62,0],[0,575,0,607,0,248,248,57,58,0,59,0,0,0,139,0,575,0,0],[0,575,0,0,0,246,608,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,609,152,610,611,57,58,0,59,0,0,612,154,0,0,62,0],[0,0,0,0,0,0,0,494,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,491,0,0],[0,0,0,0,0,0,613,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,614,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,585,194,0,0,0,0],[0,0,0,582,91,583,92,22,23,0,24,0,0,585,93,0,0,27,0],[0,0,0,582,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,553,0,0,0,175,175,0,23,0,24,0,0,0,78,0,553,0,0],[0,553,0,586,0,175,175,0,23,0,24,0,0,0,78,0,553,0,0],[0,0,0,614,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,194,80,80,22,23,0,0,0,0,591,194,0,0,0,0],[0,0,0,588,91,589,92,22,23,0,24,0,0,591,93,0,0,27,0],[0,0,0,588,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,615,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,595,220,0,0,0,0],[0,0,0,592,112,593,113,32,33,0,34,0,0,595,114,0,0,37,0],[0,0,0,592,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,559,0,0,0,201,201,0,33,0,34,0,0,0,99,0,559,0,0],[0,559,0,596,0,201,201,0,33,0,34,0,0,0,99,0,559,0,0],[0,0,0,615,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,220,101,101,32,33,0,0,0,0,601,220,0,0,0,0],[0,0,0,598,112,599,113,32,33,0,34,0,0,601,114,0,0,37,0],[0,0,0,598,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,66,67,67,8,9,0,10,0,0,0,68,0,0,16,0],[0,0,0,616,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,606,265,0,0,0,0],[0,0,0,603,152,604,153,57,58,0,59,0,0,606,154,0,0,62,0],[0,0,0,603,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,575,0,0,0,246,246,0,58,0,59,0,0,0,139,0,575,0,0],[0,575,0,607,0,246,246,0,58,0,59,0,0,0,139,0,575,0,0],[0,0,0,616,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,265,141,141,57,58,0,0,0,0,612,265,0,0,0,0],[0,0,0,609,152,610,153,57,58,0,59,0,0,612,154,0,0,62,0],[0,0,0,609,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,549,0,0],[0,0,0,0,91,92,92,22,23,0,24,0,0,0,93,0,0,27,0],[0,0,0,0,112,113,113,32,33,0,34,0,0,0,114,0,0,37,0],[0,0,0,0,152,153,153,57,58,0,59,0,0,0,154,0,0,62,0]],"accepting":[false,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,false,true,true,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,false,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,true,false,true,false,true,true,false,false,true,true,true,true,true,true,true,false,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,true,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,false,true,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,false,true,true,true,false,true,true,false,false,true,false,true,true,false,true,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,false,true,false,true,true,false,false,true,true,false,false,true,true,true,false,true,false,true,true,true,true,false,false,false,true,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,true,true,false,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,true,true,false,true,true,true,true,true,true,false,true,true,false,true,false,true,true,true,true,true,true,false,true,true,true,true,true,true,false,true,true,false,false,false,false,false,true,true,false,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,true,true,true,false,true,true,true,false,true,true,true,true,false,false,false,true,false,true,true,true,true,true,false,true,true,true,false,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,true,false,true,true,false,true,true,true],"tags":[[],["broken_cluster"],["consonant_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["consonant_syllable"],["broken_cluster"],["symbol_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["broken_cluster"],["broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],[],["broken_cluster"],["symbol_cluster"],[],["symbol_cluster"],["symbol_cluster"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["symbol_cluster"],["symbol_cluster"],["symbol_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],[],["broken_cluster"],["broken_cluster"],[],[],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["broken_cluster"],["symbol_cluster"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],[],["consonant_syllable"],["consonant_syllable"],[],[],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],[],["vowel_syllable"],["vowel_syllable"],[],[],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],[],[],[],["broken_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],["standalone_cluster"],["standalone_cluster"],[],[],["standalone_cluster"],["standalone_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],[],[],[],["consonant_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],[],[],[],["vowel_syllable"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],[],[],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],["standalone_cluster"],[],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],[],[],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],[],[],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],[],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],[],[],[],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],[],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],[],[],[],[],["consonant_syllable","broken_cluster"],["consonant_syllable","broken_cluster"],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],[],[],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],["consonant_syllable"],[],["consonant_syllable"],["consonant_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],["vowel_syllable"],[],["vowel_syllable"],["vowel_syllable"],["broken_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],["standalone_cluster"],[],["standalone_cluster"],["standalone_cluster"],[],["consonant_syllable"],["vowel_syllable"],["standalone_cluster"]]}');
var Qn = {};
Qn = JSON.parse('{"categories":["O","IND","S","GB","B","FM","CGJ","VMAbv","VMPst","VAbv","VPst","CMBlw","VPre","VBlw","H","VMBlw","CMAbv","MBlw","CS","R","SUB","MPst","MPre","FAbv","FPst","FBlw","null","SMAbv","SMBlw","VMPre","ZWNJ","ZWJ","WJ","M","VS","N","HN","MAbv"],"decompositions":{"2507":[2503,2494],"2508":[2503,2519],"2888":[2887,2902],"2891":[2887,2878],"2892":[2887,2903],"3018":[3014,3006],"3019":[3015,3006],"3020":[3014,3031],"3144":[3142,3158],"3264":[3263,3285],"3271":[3270,3285],"3272":[3270,3286],"3274":[3270,3266],"3275":[3270,3266,3285],"3402":[3398,3390],"3403":[3399,3390],"3404":[3398,3415],"3546":[3545,3530],"3548":[3545,3535],"3549":[3545,3535,3530],"3550":[3545,3551],"3635":[3661,3634],"3763":[3789,3762],"3955":[3953,3954],"3957":[3953,3956],"3958":[4018,3968],"3959":[4018,3953,3968],"3960":[4019,3968],"3961":[4019,3953,3968],"3969":[3953,3968],"6971":[6970,6965],"6973":[6972,6965],"6976":[6974,6965],"6977":[6975,6965],"6979":[6978,6965],"69934":[69937,69927],"69935":[69938,69927],"70475":[70471,70462],"70476":[70471,70487],"70843":[70841,70842],"70844":[70841,70832],"70846":[70841,70845],"71098":[71096,71087],"71099":[71097,71087]},"stateTable":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[2,2,3,4,4,5,0,6,7,8,9,10,11,12,13,14,15,16,0,17,18,11,19,20,21,22,0,0,0,23,0,0,2,0,0,24,0,25],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,0,0,0,0,0,27,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,39,40,0,0,41,35,42,43,44,45,0,0,0,46,0,0,0,0,39,0,0,47],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,0,0,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,23,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,9,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,23,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,10,11,12,13,14,0,16,0,0,18,11,19,20,21,22,0,0,0,23,0,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,23,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,9,0,0,12,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,23,0,0,0,0,0,0,0,0],[0,0,0,0,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,10,11,12,13,14,15,16,0,0,18,11,19,20,21,22,0,0,0,23,0,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,0,0,0,0,11,0,20,21,22,0,0,0,23,0,0,0,0,0,0,0,0],[0,0,0,4,4,5,0,6,7,8,9,10,11,12,13,14,15,16,0,0,18,11,19,20,21,22,0,0,0,23,0,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,48,16,0,0,18,11,19,20,21,22,0,0,0,23,0,0,0,0,49,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,16,0,0,0,11,0,20,21,22,0,0,0,23,0,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,21,22,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,22,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,0,0,0,0,0,0,14,0,0,0,0,0,0,0,20,21,22,0,0,0,23,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,0,51,0],[0,0,0,0,0,5,0,6,7,8,9,0,11,12,0,14,0,16,0,0,0,11,0,20,21,22,0,0,0,23,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,0,0,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,46,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,33,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,46,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,0,40,0,0,41,35,42,43,44,45,0,0,0,46,0,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,46,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,33,0,0,36,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,46,0,0,0,0,0,0,0,0],[0,0,0,0,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,34,35,36,37,38,39,40,0,0,41,35,42,43,44,45,0,0,0,46,0,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,0,0,0,0,35,0,43,44,45,0,0,0,46,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,52,40,0,0,41,35,42,43,44,45,0,0,0,46,0,0,0,0,53,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,40,0,0,0,35,0,43,44,45,0,0,0,46,0,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,43,44,45,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,45,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,0,0,0,0,0,0,38,0,0,0,0,0,0,0,43,44,45,0,0,0,46,0,0,0,0,0,0,0,0],[0,0,0,0,0,29,0,30,31,32,33,0,35,36,0,38,0,40,0,0,0,35,0,43,44,45,0,0,0,46,0,0,0,0,0,0,0,0],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,0,16,0,0,18,11,19,20,21,22,0,0,0,23,0,0,0,0,0,0,0,25],[0,0,0,0,0,5,0,6,7,8,9,48,11,12,13,14,48,16,0,0,18,11,19,20,21,22,0,0,0,23,0,0,0,0,0,0,0,25],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,51,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,54,0,0],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,0,40,0,0,41,35,42,43,44,45,0,0,0,46,0,0,0,0,0,0,0,47],[0,0,0,0,0,29,0,30,31,32,33,52,35,36,37,38,52,40,0,0,41,35,42,43,44,45,0,0,0,46,0,0,0,0,0,0,0,47],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,0,51,0]],"accepting":[false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],"tags":[[],["broken_cluster"],["independent_cluster"],["symbol_cluster"],["standard_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],[],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["broken_cluster"],["numeral_cluster"],["broken_cluster"],["independent_cluster"],["symbol_cluster"],["symbol_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["virama_terminated_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["standard_cluster"],["broken_cluster"],["broken_cluster"],["numeral_cluster"],["number_joiner_terminated_cluster"],["standard_cluster"],["standard_cluster"],["numeral_cluster"]]}');
const ue = {
  X: 1,
  C: 2,
  V: 4,
  N: 8,
  H: 16,
  ZWNJ: 32,
  ZWJ: 64,
  M: 128,
  Placeholder: 2048,
  Dotted_Circle: 4096,
  RS: 8192,
  Coeng: 16384,
  Repha: 32768,
  Ra: 65536,
  CM: 131072
}, ie = {
  Start: 1,
  Ra_To_Become_Reph: 2,
  Pre_M: 4,
  Pre_C: 8,
  Base_C: 16,
  After_Main: 32,
  Before_Sub: 128,
  Below_C: 256,
  After_Sub: 512,
  Before_Post: 1024,
  Post_C: 2048,
  After_Post: 4096,
  Final_C: 8192,
  SMVD: 16384,
  End: 32768
}, k3 = ue.C | ue.Ra | ue.CM | ue.V | ue.Placeholder | ue.Dotted_Circle, Dl = ue.ZWJ | ue.ZWNJ, kr = ue.H | ue.Coeng, c1 = {
  Default: {
    hasOldSpec: !1,
    virama: 0,
    basePos: "Last",
    rephPos: ie.Before_Post,
    rephMode: "Implicit",
    blwfMode: "Pre_And_Post"
  },
  Devanagari: {
    hasOldSpec: !0,
    virama: 2381,
    basePos: "Last",
    rephPos: ie.Before_Post,
    rephMode: "Implicit",
    blwfMode: "Pre_And_Post"
  },
  Bengali: {
    hasOldSpec: !0,
    virama: 2509,
    basePos: "Last",
    rephPos: ie.After_Sub,
    rephMode: "Implicit",
    blwfMode: "Pre_And_Post"
  },
  Gurmukhi: {
    hasOldSpec: !0,
    virama: 2637,
    basePos: "Last",
    rephPos: ie.Before_Sub,
    rephMode: "Implicit",
    blwfMode: "Pre_And_Post"
  },
  Gujarati: {
    hasOldSpec: !0,
    virama: 2765,
    basePos: "Last",
    rephPos: ie.Before_Post,
    rephMode: "Implicit",
    blwfMode: "Pre_And_Post"
  },
  Oriya: {
    hasOldSpec: !0,
    virama: 2893,
    basePos: "Last",
    rephPos: ie.After_Main,
    rephMode: "Implicit",
    blwfMode: "Pre_And_Post"
  },
  Tamil: {
    hasOldSpec: !0,
    virama: 3021,
    basePos: "Last",
    rephPos: ie.After_Post,
    rephMode: "Implicit",
    blwfMode: "Pre_And_Post"
  },
  Telugu: {
    hasOldSpec: !0,
    virama: 3149,
    basePos: "Last",
    rephPos: ie.After_Post,
    rephMode: "Explicit",
    blwfMode: "Post_Only"
  },
  Kannada: {
    hasOldSpec: !0,
    virama: 3277,
    basePos: "Last",
    rephPos: ie.After_Post,
    rephMode: "Implicit",
    blwfMode: "Post_Only"
  },
  Malayalam: {
    hasOldSpec: !0,
    virama: 3405,
    basePos: "Last",
    rephPos: ie.After_Main,
    rephMode: "Log_Repha",
    blwfMode: "Pre_And_Post"
  },
  // Handled by UniversalShaper
  // Sinhala: {
  //   hasOldSpec: false,
  //   virama: 0x0DCA,
  //   basePos: 'Last_Sinhala',
  //   rephPos: POSITIONS.After_Main,
  //   rephMode: 'Explicit',
  //   blwfMode: 'Pre_And_Post'
  // },
  Khmer: {
    hasOldSpec: !1,
    virama: 6098,
    basePos: "First",
    rephPos: ie.Ra_To_Become_Reph,
    rephMode: "Vis_Repha",
    blwfMode: "Pre_And_Post"
  }
}, P3 = {
  // Khmer
  6078: [
    6081,
    6078
  ],
  6079: [
    6081,
    6079
  ],
  6080: [
    6081,
    6080
  ],
  6084: [
    6081,
    6084
  ],
  6085: [
    6081,
    6085
  ]
}, { decompositions: T3 } = /* @__PURE__ */ Xn(Qn), Ml = new Ur(zi("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")), I3 = new Zo(/* @__PURE__ */ Xn(Ol));
class Me extends pt {
  static planFeatures(e) {
    e.addStage(E3), e.addStage([
      "locl",
      "ccmp"
    ]), e.addStage(B3), e.addStage("nukt"), e.addStage("akhn"), e.addStage("rphf", !1), e.addStage("rkrf"), e.addStage("pref", !1), e.addStage("blwf", !1), e.addStage("abvf", !1), e.addStage("half", !1), e.addStage("pstf", !1), e.addStage("vatu"), e.addStage("cjct"), e.addStage("cfar", !1), e.addStage(O3), e.addStage({
      local: [
        "init"
      ],
      global: [
        "pres",
        "abvs",
        "blws",
        "psts",
        "haln",
        "dist",
        "abvm",
        "blwm",
        "calt",
        "clig"
      ]
    }), e.unicodeScript = wd(e.script), e.indicConfig = c1[e.unicodeScript] || c1.Default, e.isOldSpec = e.indicConfig.hasOldSpec && e.script[e.script.length - 1] !== "2";
  }
  static assignFeatures(e, t) {
    for (let r = t.length - 1; r >= 0; r--) {
      let s = t[r].codePoints[0], i = P3[s] || T3[s];
      if (i) {
        let a = i.map((o) => {
          let l = e.font.glyphForCodePoint(o);
          return new A0(e.font, l.id, [
            o
          ], t[r].features);
        });
        t.splice(r, 1, ...a);
      }
    }
  }
}
n0(Me, "zeroMarkWidths", "NONE");
function hi(n) {
  return Ml.get(n.codePoints[0]) >> 8;
}
function Ll(n) {
  return 1 << (Ml.get(n.codePoints[0]) & 255);
}
class bn {
  constructor(e, t, r, s) {
    this.category = e, this.position = t, this.syllableType = r, this.syllable = s;
  }
}
function E3(n, e) {
  let t = 0, r = 0;
  for (let [s, i, a] of I3.match(e.map(hi))) {
    if (s > r) {
      ++t;
      for (let o = r; o < s; o++) e[o].shaperInfo = new bn(ue.X, ie.End, "non_indic_cluster", t);
    }
    ++t;
    for (let o = s; o <= i; o++) e[o].shaperInfo = new bn(1 << hi(e[o]), Ll(e[o]), a[0], t);
    r = i + 1;
  }
  if (r < e.length) {
    ++t;
    for (let s = r; s < e.length; s++) e[s].shaperInfo = new bn(ue.X, ie.End, "non_indic_cluster", t);
  }
}
function yt(n) {
  return n.shaperInfo.category & k3;
}
function T0(n) {
  return n.shaperInfo.category & Dl;
}
function N0(n) {
  return n.shaperInfo.category & kr;
}
function W0(n, e) {
  for (let r of n) r.features = {
    [e]: !0
  };
  return n[0]._font._layoutEngine.engine.GSUBProcessor.applyFeatures([
    e
  ], n), n.length === 1;
}
function F3(n, e, t) {
  let r = [
    t,
    e,
    t
  ];
  return W0(r.slice(0, 2), "blwf") || W0(r.slice(1, 3), "blwf") ? ie.Below_C : W0(r.slice(0, 2), "pstf") || W0(r.slice(1, 3), "pstf") || W0(r.slice(0, 2), "pref") || W0(r.slice(1, 3), "pref") ? ie.Post_C : ie.Base_C;
}
function B3(n, e, t) {
  let r = t.indicConfig, s = n._layoutEngine.engine.GSUBProcessor.features, i = n.glyphForCodePoint(9676).id, a = n.glyphForCodePoint(r.virama).id;
  if (a) {
    let o = new A0(n, a, [
      r.virama
    ]);
    for (let l = 0; l < e.length; l++) e[l].shaperInfo.position === ie.Base_C && (e[l].shaperInfo.position = F3(n, e[l].copy(), o));
  }
  for (let o = 0, l = Nn(e, 0); o < e.length; o = l, l = Nn(e, o)) {
    let { category: f, syllableType: u } = e[o].shaperInfo;
    if (u === "symbol_cluster" || u === "non_indic_cluster") continue;
    if (u === "broken_cluster" && i) {
      let A = new A0(n, i, [
        9676
      ]);
      A.shaperInfo = new bn(1 << hi(A), Ll(A), e[o].shaperInfo.syllableType, e[o].shaperInfo.syllable);
      let k = o;
      for (; k < l && e[k].shaperInfo.category === ue.Repha; ) k++;
      e.splice(k++, 0, A), l++;
    }
    let c = l, x = o, g = !1;
    if (r.rephPos !== ie.Ra_To_Become_Reph && s.rphf && o + 3 <= l && (r.rephMode === "Implicit" && !T0(e[o + 2]) || r.rephMode === "Explicit" && e[o + 2].shaperInfo.category === ue.ZWJ)) {
      let A = [
        e[o].copy(),
        e[o + 1].copy(),
        e[o + 2].copy()
      ];
      if (W0(A.slice(0, 2), "rphf") || r.rephMode === "Explicit" && W0(A, "rphf")) {
        for (x += 2; x < l && T0(e[x]); ) x++;
        c = o, g = !0;
      }
    } else if (r.rephMode === "Log_Repha" && e[o].shaperInfo.category === ue.Repha) {
      for (x++; x < l && T0(e[x]); ) x++;
      c = o, g = !0;
    }
    switch (r.basePos) {
      case "Last": {
        let A = l, k = !1;
        do {
          let p = e[--A].shaperInfo;
          if (yt(e[A])) {
            if (p.position !== ie.Below_C && (p.position !== ie.Post_C || k)) {
              c = A;
              break;
            }
            p.position === ie.Below_C && (k = !0), c = A;
          } else if (o < A && p.category === ue.ZWJ && e[A - 1].shaperInfo.category === ue.H) break;
        } while (A > x);
        break;
      }
      case "First":
        c = o;
        for (let A = c + 1; A < l; A++) yt(e[A]) && (e[A].shaperInfo.position = ie.Below_C);
    }
    g && c === o && x - c <= 2 && (g = !1);
    for (let A = o; A < c; A++) {
      let k = e[A].shaperInfo;
      k.position = Math.min(ie.Pre_C, k.position);
    }
    c < l && (e[c].shaperInfo.position = ie.Base_C);
    for (let A = c + 1; A < l; A++) if (e[A].shaperInfo.category === ue.M) {
      for (let k = A + 1; k < l; k++) if (yt(e[k])) {
        e[k].shaperInfo.position = ie.Final_C;
        break;
      }
      break;
    }
    if (g && (e[o].shaperInfo.position = ie.Ra_To_Become_Reph), t.isOldSpec) {
      let A = t.unicodeScript !== "Malayalam";
      for (let k = c + 1; k < l; k++) if (e[k].shaperInfo.category === ue.H) {
        let p;
        for (p = l - 1; p > k && !(yt(e[p]) || A && e[p].shaperInfo.category === ue.H); p--)
          ;
        if (e[p].shaperInfo.category !== ue.H && p > k) {
          let D = e[k];
          e.splice(k, 0, ...e.splice(k + 1, p - k)), e[p] = D;
        }
        break;
      }
    }
    let m = ie.Start;
    for (let A = o; A < l; A++) {
      let k = e[A].shaperInfo;
      if (k.category & (Dl | ue.N | ue.RS | ue.CM | kr & k.category)) {
        if (k.position = m, k.category === ue.H && k.position === ie.Pre_M) {
          for (let p = A; p > o; p--) if (e[p - 1].shaperInfo.position !== ie.Pre_M) {
            k.position = e[p - 1].shaperInfo.position;
            break;
          }
        }
      } else k.position !== ie.SMVD && (m = k.position);
    }
    let v = c;
    for (let A = c + 1; A < l; A++)
      if (yt(e[A])) {
        for (let k = v + 1; k < A; k++) e[k].shaperInfo.position < ie.SMVD && (e[k].shaperInfo.position = e[A].shaperInfo.position);
        v = A;
      } else e[A].shaperInfo.category === ue.M && (v = A);
    let E = e.slice(o, l);
    E.sort((A, k) => A.shaperInfo.position - k.shaperInfo.position), e.splice(o, E.length, ...E);
    for (let A = o; A < l; A++) if (e[A].shaperInfo.position === ie.Base_C) {
      c = A;
      break;
    }
    for (let A = o; A < l && e[A].shaperInfo.position === ie.Ra_To_Become_Reph; A++) e[A].features.rphf = !0;
    let C = !t.isOldSpec && r.blwfMode === "Pre_And_Post";
    for (let A = o; A < c; A++)
      e[A].features.half = !0, C && (e[A].features.blwf = !0);
    for (let A = c + 1; A < l; A++)
      e[A].features.abvf = !0, e[A].features.pstf = !0, e[A].features.blwf = !0;
    if (t.isOldSpec && t.unicodeScript === "Devanagari")
      for (let A = o; A + 1 < c; A++) e[A].shaperInfo.category === ue.Ra && e[A + 1].shaperInfo.category === ue.H && (A + 1 === c || e[A + 2].shaperInfo.category === ue.ZWJ) && (e[A].features.blwf = !0, e[A + 1].features.blwf = !0);
    let y = 2;
    if (s.pref && c + y < l)
      for (let A = c + 1; A + y - 1 < l; A++) {
        let k = [
          e[A].copy(),
          e[A + 1].copy()
        ];
        if (W0(k, "pref")) {
          for (let p = 0; p < y; p++) e[A++].features.pref = !0;
          if (s.cfar) for (; A < l; A++) e[A].features.cfar = !0;
          break;
        }
      }
    for (let A = o + 1; A < l; A++) if (T0(e[A])) {
      let k = e[A].shaperInfo.category === ue.ZWNJ, p = A;
      do
        p--, k && delete e[p].features.half;
      while (p > o && !yt(e[p]));
    }
  }
}
function O3(n, e, t) {
  let r = t.indicConfig, s = n._layoutEngine.engine.GSUBProcessor.features;
  for (let i = 0, a = Nn(e, 0); i < e.length; i = a, a = Nn(e, i)) {
    let o = !!s.pref, l = i;
    for (; l < a; l++) if (e[l].shaperInfo.position >= ie.Base_C) {
      if (o && l + 1 < a) {
        for (let f = l + 1; f < a; f++) if (e[f].features.pref) {
          if (!(e[f].substituted && e[f].isLigated && !e[f].isMultiplied)) {
            for (l = f; l < a && N0(e[l]); ) l++;
            e[l].shaperInfo.position = ie.BASE_C, o = !1;
          }
          break;
        }
      }
      if (t.unicodeScript === "Malayalam") for (let f = l + 1; f < a; f++) {
        for (; f < a && T0(e[f]); ) f++;
        if (f === a || !N0(e[f])) break;
        for (f++; f < a && T0(e[f]); ) f++;
        f < a && yt(e[f]) && e[f].shaperInfo.position === ie.Below_C && (l = f, e[l].shaperInfo.position = ie.Base_C);
      }
      i < l && e[l].shaperInfo.position > ie.Base_C && l--;
      break;
    }
    if (l === a && i < l && e[l - 1].shaperInfo.category === ue.ZWJ && l--, l < a) for (; i < l && e[l].shaperInfo.category & (ue.N | kr); ) l--;
    if (i + 1 < a && i < l) {
      let f = l === a ? l - 2 : l - 1;
      if (t.unicodeScript !== "Malayalam" && t.unicodeScript !== "Tamil") {
        for (; f > i && !(e[f].shaperInfo.category & (ue.M | kr)); ) f--;
        N0(e[f]) && e[f].shaperInfo.position !== ie.Pre_M ? f + 1 < a && T0(e[f + 1]) && f++ : f = i;
      }
      if (i < f && e[f].shaperInfo.position !== ie.Pre_M) {
        for (let u = f; u > i; u--) if (e[u - 1].shaperInfo.position === ie.Pre_M) {
          let c = u - 1;
          c < l && l <= f && l--;
          let x = e[c];
          e.splice(c, 0, ...e.splice(c + 1, f - c)), e[f] = x, f--;
        }
      }
    }
    if (i + 1 < a && e[i].shaperInfo.position === ie.Ra_To_Become_Reph && e[i].shaperInfo.category === ue.Repha !== (e[i].isLigated && !e[i].isMultiplied)) {
      let f, u = r.rephPos, c = !1;
      if (u !== ie.After_Post) {
        for (f = i + 1; f < l && !N0(e[f]); ) f++;
        if (f < l && N0(e[f]) && (f + 1 < l && T0(e[f + 1]) && f++, c = !0), !c && u === ie.After_Main) {
          for (f = l; f + 1 < a && e[f + 1].shaperInfo.position <= ie.After_Main; ) f++;
          c = f < a;
        }
        if (!c && u === ie.After_Sub) {
          for (f = l; f + 1 < a && !(e[f + 1].shaperInfo.position & (ie.Post_C | ie.After_Post | ie.SMVD)); ) f++;
          c = f < a;
        }
      }
      if (!c) {
        for (f = i + 1; f < l && !N0(e[f]); ) f++;
        f < l && N0(e[f]) && (f + 1 < l && T0(e[f + 1]) && f++, c = !0);
      }
      if (!c) {
        for (f = a - 1; f > i && e[f].shaperInfo.position === ie.SMVD; ) f--;
        if (N0(e[f]))
          for (let g = l + 1; g < f; g++) e[g].shaperInfo.category === ue.M && f--;
      }
      let x = e[i];
      e.splice(i, 0, ...e.splice(i + 1, f - i)), e[f] = x, i < l && l <= f && l--;
    }
    if (o && l + 1 < a) {
      for (let f = l + 1; f < a; f++) if (e[f].features.pref) {
        if (e[f].isLigated && !e[f].isMultiplied) {
          let u = l;
          if (t.unicodeScript !== "Malayalam" && t.unicodeScript !== "Tamil") {
            for (; u > i && !(e[u - 1].shaperInfo.category & (ue.M | kr)); ) u--;
            if (u > i && e[u - 1].shaperInfo.category === ue.M) {
              let g = f;
              for (let m = l + 1; m < g; m++) if (e[m].shaperInfo.category === ue.M) {
                u--;
                break;
              }
            }
          }
          u > i && N0(e[u - 1]) && u < a && T0(e[u]) && u++;
          let c = f, x = e[c];
          e.splice(u + 1, 0, ...e.splice(u, c - u)), e[u] = x, u <= l && l < c && l++;
        }
        break;
      }
    }
    e[i].shaperInfo.position === ie.Pre_M && (!i || !/Cf|Mn/.test($n(e[i - 1].codePoints[0]))) && (e[i].features.init = !0);
  }
}
function Nn(n, e) {
  if (e >= n.length) return e;
  let t = n[e].shaperInfo.syllable;
  for (; ++e < n.length && n[e].shaperInfo.syllable === t; ) ;
  return e;
}
const { categories: D3, decompositions: f1 } = /* @__PURE__ */ Xn(Qn), M3 = new Ur(zi("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")), L3 = new Zo(/* @__PURE__ */ Xn(Qn));
class ce extends pt {
  static planFeatures(e) {
    e.addStage(U3), e.addStage([
      "locl",
      "ccmp",
      "nukt",
      "akhn"
    ]), e.addStage(h1), e.addStage([
      "rphf"
    ], !1), e.addStage(N3), e.addStage(h1), e.addStage([
      "pref"
    ]), e.addStage(z3), e.addStage([
      "rkrf",
      "abvf",
      "blwf",
      "half",
      "pstf",
      "vatu",
      "cjct"
    ]), e.addStage(G3), e.addStage([
      "abvs",
      "blws",
      "pres",
      "psts",
      "dist",
      "abvm",
      "blwm"
    ]);
  }
  static assignFeatures(e, t) {
    for (let r = t.length - 1; r >= 0; r--) {
      let s = t[r].codePoints[0];
      if (f1[s]) {
        let i = f1[s].map((a) => {
          let o = e.font.glyphForCodePoint(a);
          return new A0(e.font, o.id, [
            a
          ], t[r].features);
        });
        t.splice(r, 1, ...i);
      }
    }
  }
}
n0(ce, "zeroMarkWidths", "BEFORE_GPOS");
function u1(n) {
  return M3.get(n.codePoints[0]);
}
class R3 {
  constructor(e, t, r) {
    this.category = e, this.syllableType = t, this.syllable = r;
  }
}
function U3(n, e) {
  let t = 0;
  for (let [r, s, i] of L3.match(e.map(u1))) {
    ++t;
    for (let o = r; o <= s; o++) e[o].shaperInfo = new R3(D3[u1(e[o])], i[0], t);
    let a = e[r].shaperInfo.category === "R" ? 1 : Math.min(3, s - r);
    for (let o = r; o < r + a; o++) e[o].features.rphf = !0;
  }
}
function h1(n, e) {
  for (let t of e) t.substituted = !1;
}
function N3(n, e) {
  for (let t of e) t.substituted && t.features.rphf && (t.shaperInfo.category = "R");
}
function z3(n, e) {
  for (let t of e) t.substituted && (t.shaperInfo.category = "VPre");
}
function G3(n, e) {
  let t = n.glyphForCodePoint(9676).id;
  for (let r = 0, s = d1(e, 0); r < e.length; r = s, s = d1(e, r)) {
    let i, a, o = e[r].shaperInfo, l = o.syllableType;
    if (!(l !== "virama_terminated_cluster" && l !== "standard_cluster" && l !== "broken_cluster")) {
      if (l === "broken_cluster" && t) {
        let f = new A0(n, t, [
          9676
        ]);
        for (f.shaperInfo = o, i = r; i < s && e[i].shaperInfo.category === "R"; i++) ;
        e.splice(++i, 0, f), s++;
      }
      if (o.category === "R" && s - r > 1) {
        for (i = r + 1; i < s; i++)
          if (o = e[i].shaperInfo, x1(o) || en(e[i])) {
            en(e[i]) && i--, e.splice(r, 0, ...e.splice(r + 1, i - r), e[i]);
            break;
          }
      }
      for (i = r, a = s; i < s; i++)
        o = e[i].shaperInfo, x1(o) || en(e[i]) ? a = en(e[i]) ? i + 1 : i : (o.category === "VPre" || o.category === "VMPre") && a < i && e.splice(a, 1, e[i], ...e.splice(a, i - a));
    }
  }
}
function d1(n, e) {
  if (e >= n.length) return e;
  let t = n[e].shaperInfo.syllable;
  for (; ++e < n.length && n[e].shaperInfo.syllable === t; ) ;
  return e;
}
function en(n) {
  return n.shaperInfo.category === "H" && !n.isLigated;
}
function x1(n) {
  return n.category === "B" || n.category === "GB";
}
const H3 = {
  arab: Q0,
  mong: Q0,
  syrc: Q0,
  "nko ": Q0,
  phag: Q0,
  mand: Q0,
  mani: Q0,
  phlp: Q0,
  hang: Il,
  bng2: Me,
  beng: Me,
  dev2: Me,
  deva: Me,
  gjr2: Me,
  gujr: Me,
  guru: Me,
  gur2: Me,
  knda: Me,
  knd2: Me,
  mlm2: Me,
  mlym: Me,
  ory2: Me,
  orya: Me,
  taml: Me,
  tml2: Me,
  telu: Me,
  tel2: Me,
  khmr: Me,
  bali: ce,
  batk: ce,
  brah: ce,
  bugi: ce,
  buhd: ce,
  cakm: ce,
  cham: ce,
  dupl: ce,
  egyp: ce,
  gran: ce,
  hano: ce,
  java: ce,
  kthi: ce,
  kali: ce,
  khar: ce,
  khoj: ce,
  sind: ce,
  lepc: ce,
  limb: ce,
  mahj: ce,
  // mand: UniversalShaper, // Mandaic
  // mani: UniversalShaper, // Manichaean
  mtei: ce,
  modi: ce,
  // mong: UniversalShaper, // Mongolian
  // 'nko ': UniversalShaper, // N’Ko
  hmng: ce,
  // phag: UniversalShaper, // Phags-pa
  // phlp: UniversalShaper, // Psalter Pahlavi
  rjng: ce,
  saur: ce,
  shrd: ce,
  sidd: ce,
  sinh: Me,
  sund: ce,
  sylo: ce,
  tglg: ce,
  tagb: ce,
  tale: ce,
  lana: ce,
  tavt: ce,
  takr: ce,
  tibt: ce,
  tfng: ce,
  tirh: ce,
  latn: pt,
  DFLT: pt
};
function W3(n) {
  Array.isArray(n) || (n = [
    n
  ]);
  for (let e of n) {
    let t = H3[e];
    if (t) return t;
  }
  return pt;
}
class V3 extends Dn {
  applyLookup(e, t) {
    switch (e) {
      case 1: {
        let s = this.coverageIndex(t.coverage);
        if (s === -1) return !1;
        let i = this.glyphIterator.cur;
        switch (t.version) {
          case 1:
            i.id = i.id + t.deltaGlyphID & 65535;
            break;
          case 2:
            i.id = t.substitute.get(s);
            break;
        }
        return !0;
      }
      case 2: {
        let s = this.coverageIndex(t.coverage);
        if (s !== -1) {
          let i = t.sequences.get(s);
          if (i.length === 0)
            return this.glyphs.splice(this.glyphIterator.index, 1), !0;
          this.glyphIterator.cur.id = i[0], this.glyphIterator.cur.ligatureComponent = 0;
          let a = this.glyphIterator.cur.features, o = this.glyphIterator.cur, l = i.slice(1).map((f, u) => {
            let c = new A0(this.font, f, void 0, a);
            return c.shaperInfo = o.shaperInfo, c.isLigated = o.isLigated, c.ligatureComponent = u + 1, c.substituted = !0, c.isMultiplied = !0, c;
          });
          return this.glyphs.splice(this.glyphIterator.index + 1, 0, ...l), !0;
        }
        return !1;
      }
      case 3: {
        let s = this.coverageIndex(t.coverage);
        if (s !== -1) {
          let i = 0;
          return this.glyphIterator.cur.id = t.alternateSet.get(s)[i], !0;
        }
        return !1;
      }
      case 4: {
        let s = this.coverageIndex(t.coverage);
        if (s === -1) return !1;
        for (let i of t.ligatureSets.get(s)) {
          let a = this.sequenceMatchIndices(1, i.components);
          if (!a) continue;
          let o = this.glyphIterator.cur, l = o.codePoints.slice();
          for (let v of a) l.push(...this.glyphs[v].codePoints);
          let f = new A0(this.font, i.glyph, l, o.features);
          f.shaperInfo = o.shaperInfo, f.isLigated = !0, f.substituted = !0;
          let u = o.isMark;
          for (let v = 0; v < a.length && u; v++) u = this.glyphs[a[v]].isMark;
          f.ligatureID = u ? null : this.ligatureID++;
          let c = o.ligatureID, x = o.codePoints.length, g = x, m = this.glyphIterator.index + 1;
          for (let v of a) {
            if (u) m = v;
            else for (; m < v; ) {
              var r = g - x + Math.min(this.glyphs[m].ligatureComponent || 1, x);
              this.glyphs[m].ligatureID = f.ligatureID, this.glyphs[m].ligatureComponent = r, m++;
            }
            c = this.glyphs[m].ligatureID, x = this.glyphs[m].codePoints.length, g += x, m++;
          }
          if (c && !u) for (let v = m; v < this.glyphs.length && this.glyphs[v].ligatureID === c; v++) {
            var r = g - x + Math.min(this.glyphs[v].ligatureComponent || 1, x);
            this.glyphs[v].ligatureComponent = r;
          }
          for (let v = a.length - 1; v >= 0; v--) this.glyphs.splice(a[v], 1);
          return this.glyphs[this.glyphIterator.index] = f, !0;
        }
        return !1;
      }
      case 5:
        return this.applyContext(t);
      case 6:
        return this.applyChainingContext(t);
      case 7:
        return this.applyLookup(t.lookupType, t.extension);
      default:
        throw new Error(`GSUB lookupType ${e} is not supported`);
    }
  }
}
class _3 extends Dn {
  applyPositionValue(e, t) {
    let r = this.positions[this.glyphIterator.peekIndex(e)];
    t.xAdvance != null && (r.xAdvance += t.xAdvance), t.yAdvance != null && (r.yAdvance += t.yAdvance), t.xPlacement != null && (r.xOffset += t.xPlacement), t.yPlacement != null && (r.yOffset += t.yPlacement);
    let s = this.font._variationProcessor, i = this.font.GDEF && this.font.GDEF.itemVariationStore;
    s && i && (t.xPlaDevice && (r.xOffset += s.getDelta(i, t.xPlaDevice.a, t.xPlaDevice.b)), t.yPlaDevice && (r.yOffset += s.getDelta(i, t.yPlaDevice.a, t.yPlaDevice.b)), t.xAdvDevice && (r.xAdvance += s.getDelta(i, t.xAdvDevice.a, t.xAdvDevice.b)), t.yAdvDevice && (r.yAdvance += s.getDelta(i, t.yAdvDevice.a, t.yAdvDevice.b)));
  }
  applyLookup(e, t) {
    switch (e) {
      case 1: {
        let s = this.coverageIndex(t.coverage);
        if (s === -1) return !1;
        switch (t.version) {
          case 1:
            this.applyPositionValue(0, t.value);
            break;
          case 2:
            this.applyPositionValue(0, t.values.get(s));
            break;
        }
        return !0;
      }
      case 2: {
        let s = this.glyphIterator.peek();
        if (!s) return !1;
        let i = this.coverageIndex(t.coverage);
        if (i === -1) return !1;
        switch (t.version) {
          case 1:
            let a = t.pairSets.get(i);
            for (let f of a) if (f.secondGlyph === s.id)
              return this.applyPositionValue(0, f.value1), this.applyPositionValue(1, f.value2), !0;
            return !1;
          case 2:
            let o = this.getClassID(this.glyphIterator.cur.id, t.classDef1), l = this.getClassID(s.id, t.classDef2);
            if (o === -1 || l === -1) return !1;
            var r = t.classRecords.get(o).get(l);
            return this.applyPositionValue(0, r.value1), this.applyPositionValue(1, r.value2), !0;
        }
      }
      case 3: {
        let s = this.glyphIterator.peekIndex(), i = this.glyphs[s];
        if (!i) return !1;
        let a = t.entryExitRecords[this.coverageIndex(t.coverage)];
        if (!a || !a.exitAnchor) return !1;
        let o = t.entryExitRecords[this.coverageIndex(t.coverage, i.id)];
        if (!o || !o.entryAnchor) return !1;
        let l = this.getAnchor(o.entryAnchor), f = this.getAnchor(a.exitAnchor), u = this.positions[this.glyphIterator.index], c = this.positions[s], x;
        switch (this.direction) {
          case "ltr":
            u.xAdvance = f.x + u.xOffset, x = l.x + c.xOffset, c.xAdvance -= x, c.xOffset -= x;
            break;
          case "rtl":
            x = f.x + u.xOffset, u.xAdvance -= x, u.xOffset -= x, c.xAdvance = l.x + c.xOffset;
            break;
        }
        return this.glyphIterator.flags.rightToLeft ? (this.glyphIterator.cur.cursiveAttachment = s, u.yOffset = l.y - f.y) : (i.cursiveAttachment = this.glyphIterator.index, u.yOffset = f.y - l.y), !0;
      }
      case 4: {
        let s = this.coverageIndex(t.markCoverage);
        if (s === -1) return !1;
        let i = this.glyphIterator.index;
        for (; --i >= 0 && (this.glyphs[i].isMark || this.glyphs[i].ligatureComponent > 0); ) ;
        if (i < 0) return !1;
        let a = this.coverageIndex(t.baseCoverage, this.glyphs[i].id);
        if (a === -1) return !1;
        let o = t.markArray[s], l = t.baseArray[a][o.class];
        return this.applyAnchor(o, l, i), !0;
      }
      case 5: {
        let s = this.coverageIndex(t.markCoverage);
        if (s === -1) return !1;
        let i = this.glyphIterator.index;
        for (; --i >= 0 && this.glyphs[i].isMark; ) ;
        if (i < 0) return !1;
        let a = this.coverageIndex(t.ligatureCoverage, this.glyphs[i].id);
        if (a === -1) return !1;
        let o = t.ligatureArray[a], l = this.glyphIterator.cur, f = this.glyphs[i], u = f.ligatureID && f.ligatureID === l.ligatureID && l.ligatureComponent > 0 ? Math.min(l.ligatureComponent, f.codePoints.length) - 1 : f.codePoints.length - 1, c = t.markArray[s], x = o[u][c.class];
        return this.applyAnchor(c, x, i), !0;
      }
      case 6: {
        let s = this.coverageIndex(t.mark1Coverage);
        if (s === -1) return !1;
        let i = this.glyphIterator.peekIndex(-1), a = this.glyphs[i];
        if (!a || !a.isMark) return !1;
        let o = this.glyphIterator.cur, l = !1;
        if (o.ligatureID === a.ligatureID ? o.ligatureID ? o.ligatureComponent === a.ligatureComponent && (l = !0) : l = !0 : (o.ligatureID && !o.ligatureComponent || a.ligatureID && !a.ligatureComponent) && (l = !0), !l) return !1;
        let f = this.coverageIndex(t.mark2Coverage, a.id);
        if (f === -1) return !1;
        let u = t.mark1Array[s], c = t.mark2Array[f][u.class];
        return this.applyAnchor(u, c, i), !0;
      }
      case 7:
        return this.applyContext(t);
      case 8:
        return this.applyChainingContext(t);
      case 9:
        return this.applyLookup(t.lookupType, t.extension);
      default:
        throw new Error(`Unsupported GPOS table: ${e}`);
    }
  }
  applyAnchor(e, t, r) {
    let s = this.getAnchor(t), i = this.getAnchor(e.markAnchor);
    this.positions[r];
    let a = this.positions[this.glyphIterator.index];
    a.xOffset = s.x - i.x, a.yOffset = s.y - i.y, this.glyphIterator.cur.markAttachment = r;
  }
  getAnchor(e) {
    let t = e.xCoordinate, r = e.yCoordinate, s = this.font._variationProcessor, i = this.font.GDEF && this.font.GDEF.itemVariationStore;
    return s && i && (e.xDeviceTable && (t += s.getDelta(i, e.xDeviceTable.a, e.xDeviceTable.b)), e.yDeviceTable && (r += s.getDelta(i, e.yDeviceTable.a, e.yDeviceTable.b))), {
      x: t,
      y: r
    };
  }
  applyFeatures(e, t, r) {
    super.applyFeatures(e, t, r);
    for (var s = 0; s < this.glyphs.length; s++) this.fixCursiveAttachment(s);
    this.fixMarkAttachment();
  }
  fixCursiveAttachment(e) {
    let t = this.glyphs[e];
    if (t.cursiveAttachment != null) {
      let r = t.cursiveAttachment;
      t.cursiveAttachment = null, this.fixCursiveAttachment(r), this.positions[e].yOffset += this.positions[r].yOffset;
    }
  }
  fixMarkAttachment() {
    for (let e = 0; e < this.glyphs.length; e++) {
      let t = this.glyphs[e];
      if (t.markAttachment != null) {
        let r = t.markAttachment;
        if (this.positions[e].xOffset += this.positions[r].xOffset, this.positions[e].yOffset += this.positions[r].yOffset, this.direction === "ltr") for (let s = r; s < e; s++)
          this.positions[e].xOffset -= this.positions[s].xAdvance, this.positions[e].yOffset -= this.positions[s].yAdvance;
        else for (let s = r + 1; s < e + 1; s++)
          this.positions[e].xOffset += this.positions[s].xAdvance, this.positions[e].yOffset += this.positions[s].yAdvance;
      }
    }
  }
}
class q3 {
  setup(e) {
    this.glyphInfos = e.glyphs.map((r) => new A0(this.font, r.id, [
      ...r.codePoints
    ]));
    let t = null;
    this.GPOSProcessor && (t = this.GPOSProcessor.selectScript(e.script, e.language, e.direction)), this.GSUBProcessor && (t = this.GSUBProcessor.selectScript(e.script, e.language, e.direction)), this.shaper = W3(t), this.plan = new qd(this.font, t, e.direction), this.shaper.plan(this.plan, this.glyphInfos, e.features);
    for (let r in this.plan.allFeatures) e.features[r] = !0;
  }
  substitute(e) {
    this.GSUBProcessor && (this.plan.process(this.GSUBProcessor, this.glyphInfos), e.glyphs = this.glyphInfos.map((t) => this.font.getGlyph(t.id, t.codePoints)));
  }
  position(e) {
    return this.shaper.zeroMarkWidths === "BEFORE_GPOS" && this.zeroMarkAdvances(e.positions), this.GPOSProcessor && this.plan.process(this.GPOSProcessor, this.glyphInfos, e.positions), this.shaper.zeroMarkWidths === "AFTER_GPOS" && this.zeroMarkAdvances(e.positions), e.direction === "rtl" && (e.glyphs.reverse(), e.positions.reverse()), this.GPOSProcessor && this.GPOSProcessor.features;
  }
  zeroMarkAdvances(e) {
    for (let t = 0; t < this.glyphInfos.length; t++) this.glyphInfos[t].isMark && (e[t].xAdvance = 0, e[t].yAdvance = 0);
  }
  cleanup() {
    this.glyphInfos = null, this.plan = null, this.shaper = null;
  }
  getAvailableFeatures(e, t) {
    let r = [];
    return this.GSUBProcessor && (this.GSUBProcessor.selectScript(e, t), r.push(...Object.keys(this.GSUBProcessor.features))), this.GPOSProcessor && (this.GPOSProcessor.selectScript(e, t), r.push(...Object.keys(this.GPOSProcessor.features))), r;
  }
  constructor(e) {
    this.font = e, this.glyphInfos = null, this.plan = null, this.GSUBProcessor = null, this.GPOSProcessor = null, this.fallbackPosition = !0, e.GSUB && (this.GSUBProcessor = new V3(e, e.GSUB)), e.GPOS && (this.GPOSProcessor = new _3(e, e.GPOS));
  }
}
class $3 {
  layout(e, t, r, s, i) {
    if (typeof t == "string" && (i = s, s = r, r = t, t = []), typeof e == "string") {
      r == null && (r = vd(e));
      var a = this.font.glyphsForString(e);
    } else {
      if (r == null) {
        let f = [];
        for (let u of e) f.push(...u.codePoints);
        r = yd(f);
      }
      var a = e;
    }
    let o = new Sd(a, t, r, s, i);
    return a.length === 0 ? (o.positions = [], o) : (this.engine && this.engine.setup && this.engine.setup(o), this.substitute(o), this.position(o), this.hideDefaultIgnorables(o.glyphs, o.positions), this.engine && this.engine.cleanup && this.engine.cleanup(), o);
  }
  substitute(e) {
    this.engine && this.engine.substitute && this.engine.substitute(e);
  }
  position(e) {
    e.positions = e.glyphs.map((r) => new kd(r.advanceWidth));
    let t = null;
    this.engine && this.engine.position && (t = this.engine.position(e)), !t && (!this.engine || this.engine.fallbackPosition) && (this.unicodeLayoutEngine || (this.unicodeLayoutEngine = new Ad(this.font)), this.unicodeLayoutEngine.positionGlyphs(e.glyphs, e.positions)), (!t || !t.kern) && e.features.kern !== !1 && this.font.kern && (this.kernProcessor || (this.kernProcessor = new md(this.font)), this.kernProcessor.process(e.glyphs, e.positions), e.features.kern = !0);
  }
  hideDefaultIgnorables(e, t) {
    let r = this.font.glyphForCodePoint(32);
    for (let s = 0; s < e.length; s++) this.isDefaultIgnorable(e[s].codePoints[0]) && (e[s] = r, t[s].xAdvance = 0, t[s].yAdvance = 0);
  }
  isDefaultIgnorable(e) {
    let t = e >> 16;
    if (t === 0)
      switch (e >> 8) {
        case 0:
          return e === 173;
        case 3:
          return e === 847;
        case 6:
          return e === 1564;
        case 23:
          return 6068 <= e && e <= 6069;
        case 24:
          return 6155 <= e && e <= 6158;
        case 32:
          return 8203 <= e && e <= 8207 || 8234 <= e && e <= 8238 || 8288 <= e && e <= 8303;
        case 254:
          return 65024 <= e && e <= 65039 || e === 65279;
        case 255:
          return 65520 <= e && e <= 65528;
        default:
          return !1;
      }
    else
      switch (t) {
        case 1:
          return 113824 <= e && e <= 113827 || 119155 <= e && e <= 119162;
        case 14:
          return 917504 <= e && e <= 921599;
        default:
          return !1;
      }
  }
  getAvailableFeatures(e, t) {
    let r = [];
    return this.engine && r.push(...this.engine.getAvailableFeatures(e, t)), this.font.kern && r.indexOf("kern") === -1 && r.push("kern"), r;
  }
  stringsForGlyph(e) {
    let t = /* @__PURE__ */ new Set(), r = this.font._cmapProcessor.codePointsForGlyph(e);
    for (let s of r) t.add(String.fromCodePoint(s));
    if (this.engine && this.engine.stringsForGlyph) for (let s of this.engine.stringsForGlyph(e)) t.add(s);
    return Array.from(t);
  }
  constructor(e) {
    this.font = e, this.unicodeLayoutEngine = null, this.kernProcessor = null, this.font.morx ? this.engine = new _d(this.font) : (this.font.GSUB || this.font.GPOS) && (this.engine = new q3(this.font));
  }
}
const X3 = {
  moveTo: "M",
  lineTo: "L",
  quadraticCurveTo: "Q",
  bezierCurveTo: "C",
  closePath: "Z"
};
class ar {
  /**
  * Compiles the path to a JavaScript function that can be applied with
  * a graphics context in order to render the path.
  * @return {string}
  */
  toFunction() {
    return (e) => {
      this.commands.forEach((t) => e[t.command].apply(e, t.args));
    };
  }
  /**
  * Converts the path to an SVG path data string
  * @return {string}
  */
  toSVG() {
    return this.commands.map((t) => {
      let r = t.args.map((s) => Math.round(s * 100) / 100);
      return `${X3[t.command]}${r.join(" ")}`;
    }).join("");
  }
  /**
  * Gets the "control box" of a path.
  * This is like the bounding box, but it includes all points including
  * control points of bezier segments and is much faster to compute than
  * the real bounding box.
  * @type {BBox}
  */
  get cbox() {
    if (!this._cbox) {
      let e = new bt();
      for (let t of this.commands) for (let r = 0; r < t.args.length; r += 2) e.addPoint(t.args[r], t.args[r + 1]);
      this._cbox = Object.freeze(e);
    }
    return this._cbox;
  }
  /**
  * Gets the exact bounding box of the path by evaluating curve segments.
  * Slower to compute than the control box, but more accurate.
  * @type {BBox}
  */
  get bbox() {
    if (this._bbox) return this._bbox;
    let e = new bt(), t = 0, r = 0, s = (y) => Math.pow(1 - y, 3) * g[C] + 3 * Math.pow(1 - y, 2) * y * m[C] + 3 * (1 - y) * Math.pow(y, 2) * v[C] + Math.pow(y, 3) * E[C];
    for (let y of this.commands) switch (y.command) {
      case "moveTo":
      case "lineTo":
        let [A, k] = y.args;
        e.addPoint(A, k), t = A, r = k;
        break;
      case "quadraticCurveTo":
      case "bezierCurveTo":
        if (y.command === "quadraticCurveTo")
          var [i, a, c, x] = y.args, o = t + 2 / 3 * (i - t), l = r + 2 / 3 * (a - r), f = c + 2 / 3 * (i - c), u = x + 2 / 3 * (a - x);
        else var [o, l, f, u, c, x] = y.args;
        e.addPoint(c, x);
        for (var g = [
          t,
          r
        ], m = [
          o,
          l
        ], v = [
          f,
          u
        ], E = [
          c,
          x
        ], C = 0; C <= 1; C++) {
          let p = 6 * g[C] - 12 * m[C] + 6 * v[C], D = -3 * g[C] + 9 * m[C] - 9 * v[C] + 3 * E[C];
          if (y = 3 * m[C] - 3 * g[C], D === 0) {
            if (p === 0) continue;
            let N = -y / p;
            0 < N && N < 1 && (C === 0 ? e.addPoint(s(N), e.maxY) : C === 1 && e.addPoint(e.maxX, s(N)));
            continue;
          }
          let M = Math.pow(p, 2) - 4 * y * D;
          if (M < 0) continue;
          let I = (-p + Math.sqrt(M)) / (2 * D);
          0 < I && I < 1 && (C === 0 ? e.addPoint(s(I), e.maxY) : C === 1 && e.addPoint(e.maxX, s(I)));
          let B = (-p - Math.sqrt(M)) / (2 * D);
          0 < B && B < 1 && (C === 0 ? e.addPoint(s(B), e.maxY) : C === 1 && e.addPoint(e.maxX, s(B)));
        }
        t = c, r = x;
        break;
    }
    return this._bbox = Object.freeze(e);
  }
  /**
  * Applies a mapping function to each point in the path.
  * @param {function} fn
  * @return {Path}
  */
  mapPoints(e) {
    let t = new ar();
    for (let r of this.commands) {
      let s = [];
      for (let i = 0; i < r.args.length; i += 2) {
        let [a, o] = e(r.args[i], r.args[i + 1]);
        s.push(a, o);
      }
      t[r.command](...s);
    }
    return t;
  }
  /**
  * Transforms the path by the given matrix.
  */
  transform(e, t, r, s, i, a) {
    return this.mapPoints((o, l) => {
      const f = e * o + r * l + i, u = t * o + s * l + a;
      return [
        f,
        u
      ];
    });
  }
  /**
  * Translates the path by the given offset.
  */
  translate(e, t) {
    return this.transform(1, 0, 0, 1, e, t);
  }
  /**
  * Rotates the path by the given angle (in radians).
  */
  rotate(e) {
    let t = Math.cos(e), r = Math.sin(e);
    return this.transform(t, r, -r, t, 0, 0);
  }
  /**
  * Scales the path.
  */
  scale(e, t = e) {
    return this.transform(e, 0, 0, t, 0, 0);
  }
  constructor() {
    this.commands = [], this._bbox = null, this._cbox = null;
  }
}
for (let n of [
  "moveTo",
  "lineTo",
  "quadraticCurveTo",
  "bezierCurveTo",
  "closePath"
]) ar.prototype[n] = function(...e) {
  return this._bbox = this._cbox = null, this.commands.push({
    command: n,
    args: e
  }), this;
};
var gr = [
  ".notdef",
  ".null",
  "nonmarkingreturn",
  "space",
  "exclam",
  "quotedbl",
  "numbersign",
  "dollar",
  "percent",
  "ampersand",
  "quotesingle",
  "parenleft",
  "parenright",
  "asterisk",
  "plus",
  "comma",
  "hyphen",
  "period",
  "slash",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "colon",
  "semicolon",
  "less",
  "equal",
  "greater",
  "question",
  "at",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "bracketleft",
  "backslash",
  "bracketright",
  "asciicircum",
  "underscore",
  "grave",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "braceleft",
  "bar",
  "braceright",
  "asciitilde",
  "Adieresis",
  "Aring",
  "Ccedilla",
  "Eacute",
  "Ntilde",
  "Odieresis",
  "Udieresis",
  "aacute",
  "agrave",
  "acircumflex",
  "adieresis",
  "atilde",
  "aring",
  "ccedilla",
  "eacute",
  "egrave",
  "ecircumflex",
  "edieresis",
  "iacute",
  "igrave",
  "icircumflex",
  "idieresis",
  "ntilde",
  "oacute",
  "ograve",
  "ocircumflex",
  "odieresis",
  "otilde",
  "uacute",
  "ugrave",
  "ucircumflex",
  "udieresis",
  "dagger",
  "degree",
  "cent",
  "sterling",
  "section",
  "bullet",
  "paragraph",
  "germandbls",
  "registered",
  "copyright",
  "trademark",
  "acute",
  "dieresis",
  "notequal",
  "AE",
  "Oslash",
  "infinity",
  "plusminus",
  "lessequal",
  "greaterequal",
  "yen",
  "mu",
  "partialdiff",
  "summation",
  "product",
  "pi",
  "integral",
  "ordfeminine",
  "ordmasculine",
  "Omega",
  "ae",
  "oslash",
  "questiondown",
  "exclamdown",
  "logicalnot",
  "radical",
  "florin",
  "approxequal",
  "Delta",
  "guillemotleft",
  "guillemotright",
  "ellipsis",
  "nonbreakingspace",
  "Agrave",
  "Atilde",
  "Otilde",
  "OE",
  "oe",
  "endash",
  "emdash",
  "quotedblleft",
  "quotedblright",
  "quoteleft",
  "quoteright",
  "divide",
  "lozenge",
  "ydieresis",
  "Ydieresis",
  "fraction",
  "currency",
  "guilsinglleft",
  "guilsinglright",
  "fi",
  "fl",
  "daggerdbl",
  "periodcentered",
  "quotesinglbase",
  "quotedblbase",
  "perthousand",
  "Acircumflex",
  "Ecircumflex",
  "Aacute",
  "Edieresis",
  "Egrave",
  "Iacute",
  "Icircumflex",
  "Idieresis",
  "Igrave",
  "Oacute",
  "Ocircumflex",
  "apple",
  "Ograve",
  "Uacute",
  "Ucircumflex",
  "Ugrave",
  "dotlessi",
  "circumflex",
  "tilde",
  "macron",
  "breve",
  "dotaccent",
  "ring",
  "cedilla",
  "hungarumlaut",
  "ogonek",
  "caron",
  "Lslash",
  "lslash",
  "Scaron",
  "scaron",
  "Zcaron",
  "zcaron",
  "brokenbar",
  "Eth",
  "eth",
  "Yacute",
  "yacute",
  "Thorn",
  "thorn",
  "minus",
  "multiply",
  "onesuperior",
  "twosuperior",
  "threesuperior",
  "onehalf",
  "onequarter",
  "threequarters",
  "franc",
  "Gbreve",
  "gbreve",
  "Idotaccent",
  "Scedilla",
  "scedilla",
  "Cacute",
  "cacute",
  "Ccaron",
  "ccaron",
  "dcroat"
];
class L0 {
  _getPath() {
    return new ar();
  }
  _getCBox() {
    return this.path.cbox;
  }
  _getBBox() {
    return this.path.bbox;
  }
  _getTableMetrics(e) {
    if (this.id < e.metrics.length) return e.metrics.get(this.id);
    let t = e.metrics.get(e.metrics.length - 1);
    return {
      advance: t ? t.advance : 0,
      bearing: e.bearings.get(this.id - e.metrics.length) || 0
    };
  }
  _getMetrics(e) {
    if (this._metrics) return this._metrics;
    let { advance: t, bearing: r } = this._getTableMetrics(this._font.hmtx);
    if (this._font.vmtx) var { advance: s, bearing: i } = this._getTableMetrics(this._font.vmtx);
    else {
      let a;
      if ((typeof e > "u" || e === null) && ({ cbox: e } = this), (a = this._font["OS/2"]) && a.version > 0)
        var s = Math.abs(a.typoAscender - a.typoDescender), i = a.typoAscender - e.maxY;
      else {
        let { hhea: o } = this._font;
        var s = Math.abs(o.ascent - o.descent), i = o.ascent - e.maxY;
      }
    }
    return this._font._variationProcessor && this._font.HVAR && (t += this._font._variationProcessor.getAdvanceAdjustment(this.id, this._font.HVAR)), this._metrics = {
      advanceWidth: t,
      advanceHeight: s,
      leftBearing: r,
      topBearing: i
    };
  }
  /**
  * The glyph’s control box.
  * This is often the same as the bounding box, but is faster to compute.
  * Because of the way bezier curves are defined, some of the control points
  * can be outside of the bounding box. Where `bbox` takes this into account,
  * `cbox` does not. Thus, cbox is less accurate, but faster to compute.
  * See [here](http://www.freetype.org/freetype2/docs/glyphs/glyphs-6.html#section-2)
  * for a more detailed description.
  *
  * @type {BBox}
  */
  get cbox() {
    return this._getCBox();
  }
  /**
  * The glyph’s bounding box, i.e. the rectangle that encloses the
  * glyph outline as tightly as possible.
  * @type {BBox}
  */
  get bbox() {
    return this._getBBox();
  }
  /**
  * A vector Path object representing the glyph outline.
  * @type {Path}
  */
  get path() {
    return this._getPath();
  }
  /**
  * Returns a path scaled to the given font size.
  * @param {number} size
  * @return {Path}
  */
  getScaledPath(e) {
    let t = 1 / this._font.unitsPerEm * e;
    return this.path.scale(t);
  }
  /**
  * The glyph's advance width.
  * @type {number}
  */
  get advanceWidth() {
    return this._getMetrics().advanceWidth;
  }
  /**
  * The glyph's advance height.
  * @type {number}
  */
  get advanceHeight() {
    return this._getMetrics().advanceHeight;
  }
  get ligatureCaretPositions() {
  }
  _getName() {
    let { post: e } = this._font;
    if (!e) return null;
    switch (e.version) {
      case 1:
        return gr[this.id];
      case 2:
        let t = e.glyphNameIndex[this.id];
        return t < gr.length ? gr[t] : e.names[t - gr.length];
      case 2.5:
        return gr[this.id + e.offsets[this.id]];
      case 4:
        return String.fromCharCode(e.map[this.id]);
    }
  }
  /**
  * The glyph's name
  * @type {string}
  */
  get name() {
    return this._getName();
  }
  /**
  * Renders the glyph to the given graphics context, at the specified font size.
  * @param {CanvasRenderingContext2d} ctx
  * @param {number} size
  */
  render(e, t) {
    e.save();
    let r = 1 / this._font.head.unitsPerEm * t;
    e.scale(r, r), this.path.toFunction()(e), e.fill(), e.restore();
  }
  constructor(e, t, r) {
    this.id = e, this.codePoints = t, this._font = r, this.isMark = this.codePoints.length > 0 && this.codePoints.every(Ko), this.isLigature = this.codePoints.length > 1;
  }
}
Ve([
  _e
], L0.prototype, "cbox", null);
Ve([
  _e
], L0.prototype, "bbox", null);
Ve([
  _e
], L0.prototype, "path", null);
Ve([
  _e
], L0.prototype, "advanceWidth", null);
Ve([
  _e
], L0.prototype, "advanceHeight", null);
Ve([
  _e
], L0.prototype, "name", null);
let b1 = new F({
  numberOfContours: U,
  xMin: U,
  yMin: U,
  xMax: U,
  yMax: U
});
const j3 = 1, Y3 = 2, K3 = 4, Z3 = 8, J3 = 16, Q3 = 32, e4 = 1, t4 = 8, p1 = 32, r4 = 64, n4 = 128, s4 = 256;
class x0 {
  copy() {
    return new x0(this.onCurve, this.endContour, this.x, this.y);
  }
  constructor(e, t, r = 0, s = 0) {
    this.onCurve = e, this.endContour = t, this.x = r, this.y = s;
  }
}
class i4 {
  constructor(e, t, r) {
    this.glyphID = e, this.dx = t, this.dy = r, this.pos = 0, this.scaleX = this.scaleY = 1, this.scale01 = this.scale10 = 0;
  }
}
class es extends L0 {
  // Parses just the glyph header and returns the bounding box
  _getCBox(e) {
    if (this._font._variationProcessor && !e) return this.path.cbox;
    let t = this._font._getTableStream("glyf");
    t.pos += this._font.loca.offsets[this.id];
    let r = b1.decode(t), s = new bt(r.xMin, r.yMin, r.xMax, r.yMax);
    return Object.freeze(s);
  }
  // Parses a single glyph coordinate
  _parseGlyphCoord(e, t, r, s) {
    if (r) {
      var i = e.readUInt8();
      s || (i = -i), i += t;
    } else if (s) var i = t;
    else var i = t + e.readInt16BE();
    return i;
  }
  // Decodes the glyph data into points for simple glyphs,
  // or components for composite glyphs
  _decode() {
    let e = this._font.loca.offsets[this.id], t = this._font.loca.offsets[this.id + 1];
    if (e === t) return null;
    let r = this._font._getTableStream("glyf");
    r.pos += e;
    let s = r.pos, i = b1.decode(r);
    return i.numberOfContours > 0 ? this._decodeSimple(i, r) : i.numberOfContours < 0 && this._decodeComposite(i, r, s), i;
  }
  _decodeSimple(e, t) {
    e.points = [];
    let r = new S(h, e.numberOfContours).decode(t);
    e.instructions = new S(H, h).decode(t);
    let s = [], i = r[r.length - 1] + 1;
    for (; s.length < i; ) {
      var a = t.readUInt8();
      if (s.push(a), a & Z3) {
        let u = t.readUInt8();
        for (let c = 0; c < u; c++) s.push(a);
      }
    }
    for (var o = 0; o < s.length; o++) {
      var a = s[o];
      let c = new x0(!!(a & j3), r.indexOf(o) >= 0, 0, 0);
      e.points.push(c);
    }
    let l = 0;
    for (var o = 0; o < s.length; o++) {
      var a = s[o];
      e.points[o].x = l = this._parseGlyphCoord(t, l, a & Y3, a & J3);
    }
    let f = 0;
    for (var o = 0; o < s.length; o++) {
      var a = s[o];
      e.points[o].y = f = this._parseGlyphCoord(t, f, a & K3, a & Q3);
    }
    if (this._font._variationProcessor) {
      let u = e.points.slice();
      u.push(...this._getPhantomPoints(e)), this._font._variationProcessor.transformPoints(this.id, u), e.phantomPoints = u.slice(-4);
    }
  }
  _decodeComposite(e, t, r = 0) {
    e.components = [];
    let s = !1, i = p1;
    for (; i & p1; ) {
      i = t.readUInt16BE();
      let f = t.pos - r, u = t.readUInt16BE();
      if (s || (s = (i & s4) !== 0), i & e4)
        var a = t.readInt16BE(), o = t.readInt16BE();
      else
        var a = t.readInt8(), o = t.readInt8();
      var l = new i4(u, a, o);
      l.pos = f, i & t4 ? l.scaleX = l.scaleY = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824 : i & r4 ? (l.scaleX = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824, l.scaleY = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824) : i & n4 && (l.scaleX = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824, l.scale01 = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824, l.scale10 = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824, l.scaleY = (t.readUInt8() << 24 | t.readUInt8() << 16) / 1073741824), e.components.push(l);
    }
    if (this._font._variationProcessor) {
      let f = [];
      for (let u = 0; u < e.components.length; u++) {
        var l = e.components[u];
        f.push(new x0(!0, !0, l.dx, l.dy));
      }
      f.push(...this._getPhantomPoints(e)), this._font._variationProcessor.transformPoints(this.id, f), e.phantomPoints = f.splice(-4, 4);
      for (let u = 0; u < f.length; u++) {
        let c = f[u];
        e.components[u].dx = c.x, e.components[u].dy = c.y;
      }
    }
    return s;
  }
  _getPhantomPoints(e) {
    let t = this._getCBox(!0);
    this._metrics == null && (this._metrics = L0.prototype._getMetrics.call(this, t));
    let { advanceWidth: r, advanceHeight: s, leftBearing: i, topBearing: a } = this._metrics;
    return [
      new x0(!1, !0, e.xMin - i, 0),
      new x0(!1, !0, e.xMin - i + r, 0),
      new x0(!1, !0, 0, e.yMax + a),
      new x0(!1, !0, 0, e.yMax + a + s)
    ];
  }
  // Decodes font data, resolves composite glyphs, and returns an array of contours
  _getContours() {
    let e = this._decode();
    if (!e) return [];
    let t = [];
    if (e.numberOfContours < 0)
      for (let a of e.components) {
        let o = this._font.getGlyph(a.glyphID)._getContours();
        for (let l = 0; l < o.length; l++) {
          let f = o[l];
          for (let u = 0; u < f.length; u++) {
            let c = f[u], x = c.x * a.scaleX + c.y * a.scale01 + a.dx, g = c.y * a.scaleY + c.x * a.scale10 + a.dy;
            t.push(new x0(c.onCurve, c.endContour, x, g));
          }
        }
      }
    else t = e.points || [];
    e.phantomPoints && !this._font.directory.tables.HVAR && (this._metrics.advanceWidth = e.phantomPoints[1].x - e.phantomPoints[0].x, this._metrics.advanceHeight = e.phantomPoints[3].y - e.phantomPoints[2].y, this._metrics.leftBearing = e.xMin - e.phantomPoints[0].x, this._metrics.topBearing = e.phantomPoints[2].y - e.yMax);
    let r = [], s = [];
    for (let a = 0; a < t.length; a++) {
      var i = t[a];
      s.push(i), i.endContour && (r.push(s), s = []);
    }
    return r;
  }
  _getMetrics() {
    if (this._metrics) return this._metrics;
    let e = this._getCBox(!0);
    return super._getMetrics(e), this._font._variationProcessor && !this._font.HVAR && this.path, this._metrics;
  }
  // Converts contours to a Path object that can be rendered
  _getPath() {
    let e = this._getContours(), t = new ar();
    for (let s = 0; s < e.length; s++) {
      let i = e[s], a = i[0], o = i[i.length - 1], l = 0;
      if (a.onCurve) {
        var r = null;
        l = 1;
      } else {
        o.onCurve ? a = o : a = new x0(!1, !1, (a.x + o.x) / 2, (a.y + o.y) / 2);
        var r = a;
      }
      t.moveTo(a.x, a.y);
      for (let f = l; f < i.length; f++) {
        let u = i[f], c = f === 0 ? a : i[f - 1];
        if (c.onCurve && u.onCurve) t.lineTo(u.x, u.y);
        else if (c.onCurve && !u.onCurve) var r = u;
        else if (!c.onCurve && !u.onCurve) {
          let g = (c.x + u.x) / 2, m = (c.y + u.y) / 2;
          t.quadraticCurveTo(c.x, c.y, g, m);
          var r = u;
        } else if (!c.onCurve && u.onCurve) {
          t.quadraticCurveTo(r.x, r.y, u.x, u.y);
          var r = null;
        } else throw new Error("Unknown TTF path state");
      }
      r && t.quadraticCurveTo(r.x, r.y, a.x, a.y), t.closePath();
    }
    return t;
  }
  constructor(...e) {
    super(...e), n0(this, "type", "TTF");
  }
}
class a4 extends L0 {
  _getName() {
    return this._font.CFF2 ? super._getName() : this._font["CFF "].getGlyphName(this.id);
  }
  bias(e) {
    return e.length < 1240 ? 107 : e.length < 33900 ? 1131 : 32768;
  }
  _getPath() {
    let e = this._font.CFF2 || this._font["CFF "], { stream: t } = e, r = e.topDict.CharStrings[this.id], s = r.offset + r.length;
    t.pos = r.offset;
    let i = new ar(), a = [], o = [], l = null, f = 0, u = 0, c = 0, x, g, m = !1;
    this._usedGsubrs = x = {}, this._usedSubrs = g = {};
    let v = e.globalSubrIndex || [], E = this.bias(v), C = e.privateDictForGlyph(this.id) || {}, y = C.Subrs || [], A = this.bias(y), k = e.topDict.vstore && e.topDict.vstore.itemVariationStore, p = C.vsindex, D = this._font._variationProcessor;
    function M() {
      l == null && (l = a.shift() + C.nominalWidthX);
    }
    function I() {
      return a.length % 2 !== 0 && M(), f += a.length >> 1, a.length = 0;
    }
    function B(V, j) {
      m && i.closePath(), i.moveTo(V, j), m = !0;
    }
    let N = function() {
      for (; t.pos < s; ) {
        let J = t.readUInt8();
        if (J < 32) {
          let q, $, K, W, ee, Z, ae, be, ge, Be, Oe, Ae, Le, qe, z, R;
          switch (J) {
            case 1:
            case 3:
            case 18:
            case 23:
              I();
              break;
            case 4:
              a.length > 1 && M(), c += a.shift(), B(u, c);
              break;
            case 5:
              for (; a.length >= 2; )
                u += a.shift(), c += a.shift(), i.lineTo(u, c);
              break;
            case 6:
            case 7:
              for (K = J === 6; a.length >= 1; )
                K ? u += a.shift() : c += a.shift(), i.lineTo(u, c), K = !K;
              break;
            case 8:
              for (; a.length > 0; )
                W = u + a.shift(), ee = c + a.shift(), Z = W + a.shift(), ae = ee + a.shift(), u = Z + a.shift(), c = ae + a.shift(), i.bezierCurveTo(W, ee, Z, ae, u, c);
              break;
            case 10:
              if (q = a.pop() + A, $ = y[q], $) {
                g[q] = !0;
                let L = t.pos, O = s;
                t.pos = $.offset, s = $.offset + $.length, N(), t.pos = L, s = O;
              }
              break;
            case 11:
              if (e.version >= 2) break;
              return;
            case 14:
              if (e.version >= 2) break;
              a.length > 0 && M(), m && (i.closePath(), m = !1);
              break;
            case 15:
              if (e.version < 2) throw new Error("vsindex operator not supported in CFF v1");
              p = a.pop();
              break;
            case 16: {
              if (e.version < 2) throw new Error("blend operator not supported in CFF v1");
              if (!D) throw new Error("blend operator in non-variation font");
              let L = D.getBlendVector(k, p), O = a.pop(), Y = O * L.length, Q = a.length - Y, te = Q - O;
              for (let se = 0; se < O; se++) {
                let he = a[te + se];
                for (let oe = 0; oe < L.length; oe++) he += L[oe] * a[Q++];
                a[te + se] = he;
              }
              for (; Y--; ) a.pop();
              break;
            }
            case 19:
            case 20:
              I(), t.pos += f + 7 >> 3;
              break;
            case 21:
              a.length > 2 && M(), u += a.shift(), c += a.shift(), B(u, c);
              break;
            case 22:
              a.length > 1 && M(), u += a.shift(), B(u, c);
              break;
            case 24:
              for (; a.length >= 8; )
                W = u + a.shift(), ee = c + a.shift(), Z = W + a.shift(), ae = ee + a.shift(), u = Z + a.shift(), c = ae + a.shift(), i.bezierCurveTo(W, ee, Z, ae, u, c);
              u += a.shift(), c += a.shift(), i.lineTo(u, c);
              break;
            case 25:
              for (; a.length >= 8; )
                u += a.shift(), c += a.shift(), i.lineTo(u, c);
              W = u + a.shift(), ee = c + a.shift(), Z = W + a.shift(), ae = ee + a.shift(), u = Z + a.shift(), c = ae + a.shift(), i.bezierCurveTo(W, ee, Z, ae, u, c);
              break;
            case 26:
              for (a.length % 2 && (u += a.shift()); a.length >= 4; )
                W = u, ee = c + a.shift(), Z = W + a.shift(), ae = ee + a.shift(), u = Z, c = ae + a.shift(), i.bezierCurveTo(W, ee, Z, ae, u, c);
              break;
            case 27:
              for (a.length % 2 && (c += a.shift()); a.length >= 4; )
                W = u + a.shift(), ee = c, Z = W + a.shift(), ae = ee + a.shift(), u = Z + a.shift(), c = ae, i.bezierCurveTo(W, ee, Z, ae, u, c);
              break;
            case 28:
              a.push(t.readInt16BE());
              break;
            case 29:
              if (q = a.pop() + E, $ = v[q], $) {
                x[q] = !0;
                let L = t.pos, O = s;
                t.pos = $.offset, s = $.offset + $.length, N(), t.pos = L, s = O;
              }
              break;
            case 30:
            case 31:
              for (K = J === 31; a.length >= 4; )
                K ? (W = u + a.shift(), ee = c, Z = W + a.shift(), ae = ee + a.shift(), c = ae + a.shift(), u = Z + (a.length === 1 ? a.shift() : 0)) : (W = u, ee = c + a.shift(), Z = W + a.shift(), ae = ee + a.shift(), u = Z + a.shift(), c = ae + (a.length === 1 ? a.shift() : 0)), i.bezierCurveTo(W, ee, Z, ae, u, c), K = !K;
              break;
            case 12:
              switch (J = t.readUInt8(), J) {
                case 3:
                  let L = a.pop(), O = a.pop();
                  a.push(L && O ? 1 : 0);
                  break;
                case 4:
                  L = a.pop(), O = a.pop(), a.push(L || O ? 1 : 0);
                  break;
                case 5:
                  L = a.pop(), a.push(L ? 0 : 1);
                  break;
                case 9:
                  L = a.pop(), a.push(Math.abs(L));
                  break;
                case 10:
                  L = a.pop(), O = a.pop(), a.push(L + O);
                  break;
                case 11:
                  L = a.pop(), O = a.pop(), a.push(L - O);
                  break;
                case 12:
                  L = a.pop(), O = a.pop(), a.push(L / O);
                  break;
                case 14:
                  L = a.pop(), a.push(-L);
                  break;
                case 15:
                  L = a.pop(), O = a.pop(), a.push(L === O ? 1 : 0);
                  break;
                case 18:
                  a.pop();
                  break;
                case 20:
                  let Y = a.pop(), Q = a.pop();
                  o[Q] = Y;
                  break;
                case 21:
                  Q = a.pop(), a.push(o[Q] || 0);
                  break;
                case 22:
                  let te = a.pop(), se = a.pop(), he = a.pop(), oe = a.pop();
                  a.push(he <= oe ? te : se);
                  break;
                case 23:
                  a.push(Math.random());
                  break;
                case 24:
                  L = a.pop(), O = a.pop(), a.push(L * O);
                  break;
                case 26:
                  L = a.pop(), a.push(Math.sqrt(L));
                  break;
                case 27:
                  L = a.pop(), a.push(L, L);
                  break;
                case 28:
                  L = a.pop(), O = a.pop(), a.push(O, L);
                  break;
                case 29:
                  Q = a.pop(), Q < 0 ? Q = 0 : Q > a.length - 1 && (Q = a.length - 1), a.push(a[Q]);
                  break;
                case 30:
                  let X = a.pop(), we = a.pop();
                  if (we >= 0) for (; we > 0; ) {
                    var V = a[X - 1];
                    for (let Ee = X - 2; Ee >= 0; Ee--) a[Ee + 1] = a[Ee];
                    a[0] = V, we--;
                  }
                  else for (; we < 0; ) {
                    var V = a[0];
                    for (let Ne = 0; Ne <= X; Ne++) a[Ne] = a[Ne + 1];
                    a[X - 1] = V, we++;
                  }
                  break;
                case 34:
                  W = u + a.shift(), ee = c, Z = W + a.shift(), ae = ee + a.shift(), be = Z + a.shift(), ge = ae, Be = be + a.shift(), Oe = ge, Ae = Be + a.shift(), Le = Oe, qe = Ae + a.shift(), z = Le, u = qe, c = z, i.bezierCurveTo(W, ee, Z, ae, be, ge), i.bezierCurveTo(Be, Oe, Ae, Le, qe, z);
                  break;
                case 35:
                  R = [];
                  for (let Ee = 0; Ee <= 5; Ee++)
                    u += a.shift(), c += a.shift(), R.push(u, c);
                  i.bezierCurveTo(...R.slice(0, 6)), i.bezierCurveTo(...R.slice(6)), a.shift();
                  break;
                case 36:
                  W = u + a.shift(), ee = c + a.shift(), Z = W + a.shift(), ae = ee + a.shift(), be = Z + a.shift(), ge = ae, Be = be + a.shift(), Oe = ge, Ae = Be + a.shift(), Le = Oe + a.shift(), qe = Ae + a.shift(), z = Le, u = qe, c = z, i.bezierCurveTo(W, ee, Z, ae, be, ge), i.bezierCurveTo(Be, Oe, Ae, Le, qe, z);
                  break;
                case 37:
                  let Ge = u, s0 = c;
                  R = [];
                  for (let Ee = 0; Ee <= 4; Ee++)
                    u += a.shift(), c += a.shift(), R.push(u, c);
                  Math.abs(u - Ge) > Math.abs(c - s0) ? (u += a.shift(), c = s0) : (u = Ge, c += a.shift()), R.push(u, c), i.bezierCurveTo(...R.slice(0, 6)), i.bezierCurveTo(...R.slice(6));
                  break;
                default:
                  throw new Error(`Unknown op: 12 ${J}`);
              }
              break;
            default:
              throw new Error(`Unknown op: ${J}`);
          }
        } else if (J < 247) a.push(J - 139);
        else if (J < 251) {
          var j = t.readUInt8();
          a.push((J - 247) * 256 + j + 108);
        } else if (J < 255) {
          var j = t.readUInt8();
          a.push(-(J - 251) * 256 - j - 108);
        } else a.push(t.readInt32BE() / 65536);
      }
    };
    return N(), m && i.closePath(), i;
  }
  constructor(...e) {
    super(...e), n0(this, "type", "CFF");
  }
}
let o4 = new F({
  originX: h,
  originY: h,
  type: new Se(4),
  data: new D0((n) => n.parent.buflen - n._currentOffset)
});
class l4 extends es {
  /**
  * Returns an object representing a glyph image at the given point size.
  * The object has a data property with a Buffer containing the actual image data,
  * along with the image type, and origin.
  *
  * @param {number} size
  * @return {object}
  */
  getImageForSize(e) {
    for (let a = 0; a < this._font.sbix.imageTables.length; a++) {
      var t = this._font.sbix.imageTables[a];
      if (t.ppem >= e) break;
    }
    let r = t.imageOffsets, s = r[this.id], i = r[this.id + 1];
    return s === i ? null : (this._font.stream.pos = s, o4.decode(this._font.stream, {
      buflen: i - s
    }));
  }
  render(e, t) {
    let r = this.getImageForSize(t);
    if (r != null) {
      let s = t / this._font.unitsPerEm;
      e.image(r.data, {
        height: t,
        x: r.originX,
        y: (this.bbox.minY - r.originY) * s
      });
    }
    this._font.sbix.flags.renderOutlines && super.render(e, t);
  }
  constructor(...e) {
    super(...e), n0(this, "type", "SBIX");
  }
}
class g1 {
  constructor(e, t) {
    this.glyph = e, this.color = t;
  }
}
class c4 extends L0 {
  _getBBox() {
    let e = new bt();
    for (let t = 0; t < this.layers.length; t++) {
      let s = this.layers[t].glyph.bbox;
      e.addPoint(s.minX, s.minY), e.addPoint(s.maxX, s.maxY);
    }
    return e;
  }
  /**
  * Returns an array of objects containing the glyph and color for
  * each layer in the composite color glyph.
  * @type {object[]}
  */
  get layers() {
    let e = this._font.CPAL, t = this._font.COLR, r = 0, s = t.baseGlyphRecord.length - 1;
    for (; r <= s; ) {
      let u = r + s >> 1;
      var i = t.baseGlyphRecord[u];
      if (this.id < i.gid) s = u - 1;
      else if (this.id > i.gid) r = u + 1;
      else {
        var a = i;
        break;
      }
    }
    if (a == null) {
      var o = this._font._getBaseGlyph(this.id), l = {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 255
      };
      return [
        new g1(o, l)
      ];
    }
    let f = [];
    for (let u = a.firstLayerIndex; u < a.firstLayerIndex + a.numLayers; u++) {
      var i = t.layerRecords[u], l = e.colorRecords[i.paletteIndex], o = this._font._getBaseGlyph(i.gid);
      f.push(new g1(o, l));
    }
    return f;
  }
  render(e, t) {
    for (let { glyph: r, color: s } of this.layers)
      e.fillColor([
        s.red,
        s.green,
        s.blue
      ], s.alpha / 255 * 100), r.render(e, t);
  }
  constructor(...e) {
    super(...e), n0(this, "type", "COLR");
  }
}
const f4 = 32768, u4 = 4095, h4 = 32768, m1 = 16384, d4 = 8192, A1 = 4095, w1 = 128, v1 = 127, x4 = 128, b4 = 64, p4 = 63;
class g4 {
  normalizeCoords(e) {
    let t = [];
    for (var r = 0; r < this.font.fvar.axis.length; r++) {
      let s = this.font.fvar.axis[r];
      e[r] < s.defaultValue ? t.push((e[r] - s.defaultValue + Number.EPSILON) / (s.defaultValue - s.minValue + Number.EPSILON)) : t.push((e[r] - s.defaultValue + Number.EPSILON) / (s.maxValue - s.defaultValue + Number.EPSILON));
    }
    if (this.font.avar) for (var r = 0; r < this.font.avar.segment.length; r++) {
      let i = this.font.avar.segment[r];
      for (let a = 0; a < i.correspondence.length; a++) {
        let o = i.correspondence[a];
        if (a >= 1 && t[r] < o.fromCoord) {
          let l = i.correspondence[a - 1];
          t[r] = ((t[r] - l.fromCoord) * (o.toCoord - l.toCoord) + Number.EPSILON) / (o.fromCoord - l.fromCoord + Number.EPSILON) + l.toCoord;
          break;
        }
      }
    }
    return t;
  }
  transformPoints(e, t) {
    if (!this.font.fvar || !this.font.gvar) return;
    let { gvar: r } = this.font;
    if (e >= r.glyphCount) return;
    let s = r.offsets[e];
    if (s === r.offsets[e + 1]) return;
    let { stream: i } = this.font;
    if (i.pos = s, i.pos >= i.length) return;
    let a = i.readUInt16BE(), o = s + i.readUInt16BE();
    if (a & f4) {
      var l = i.pos;
      i.pos = o;
      var f = this.decodePoints();
      o = i.pos, i.pos = l;
    }
    let u = t.map((E) => E.copy());
    a &= u4;
    for (let E = 0; E < a; E++) {
      let C = i.readUInt16BE(), y = i.readUInt16BE();
      if (y & h4) {
        var c = [];
        for (let I = 0; I < r.axisCount; I++) c.push(i.readInt16BE() / 16384);
      } else {
        if ((y & A1) >= r.globalCoordCount) throw new Error("Invalid gvar table");
        var c = r.globalCoords[y & A1];
      }
      if (y & m1) {
        var x = [];
        for (let I = 0; I < r.axisCount; I++) x.push(i.readInt16BE() / 16384);
        var g = [];
        for (let I = 0; I < r.axisCount; I++) g.push(i.readInt16BE() / 16384);
      }
      let A = this.tupleFactor(y, c, x, g);
      if (A === 0) {
        o += C;
        continue;
      }
      var l = i.pos;
      if (i.pos = o, y & d4) var m = this.decodePoints();
      else var m = f;
      let p = m.length === 0 ? t.length : m.length, D = this.decodeDeltas(p), M = this.decodeDeltas(p);
      if (m.length === 0) for (let I = 0; I < t.length; I++) {
        var v = t[I];
        v.x += Math.round(D[I] * A), v.y += Math.round(M[I] * A);
      }
      else {
        let I = u.map((N) => N.copy()), B = t.map(() => !1);
        for (let N = 0; N < m.length; N++) {
          let V = m[N];
          if (V < t.length) {
            let j = I[V];
            B[V] = !0, j.x += D[N] * A, j.y += M[N] * A;
          }
        }
        this.interpolateMissingDeltas(I, u, B);
        for (let N = 0; N < t.length; N++) {
          let V = I[N].x - u[N].x, j = I[N].y - u[N].y;
          t[N].x = Math.round(t[N].x + V), t[N].y = Math.round(t[N].y + j);
        }
      }
      o += C, i.pos = l;
    }
  }
  decodePoints() {
    let e = this.font.stream, t = e.readUInt8();
    t & w1 && (t = (t & v1) << 8 | e.readUInt8());
    let r = new Uint16Array(t), s = 0, i = 0;
    for (; s < t; ) {
      let a = e.readUInt8(), o = (a & v1) + 1, l = a & w1 ? e.readUInt16 : e.readUInt8;
      for (let f = 0; f < o && s < t; f++)
        i += l.call(e), r[s++] = i;
    }
    return r;
  }
  decodeDeltas(e) {
    let t = this.font.stream, r = 0, s = new Int16Array(e);
    for (; r < e; ) {
      let i = t.readUInt8(), a = (i & p4) + 1;
      if (i & x4) r += a;
      else {
        let o = i & b4 ? t.readInt16BE : t.readInt8;
        for (let l = 0; l < a && r < e; l++) s[r++] = o.call(t);
      }
    }
    return s;
  }
  tupleFactor(e, t, r, s) {
    let i = this.normalizedCoords, { gvar: a } = this.font, o = 1;
    for (let l = 0; l < a.axisCount; l++)
      if (t[l] !== 0) {
        if (i[l] === 0) return 0;
        if (e & m1) {
          if (i[l] < r[l] || i[l] > s[l]) return 0;
          i[l] < t[l] ? o = o * (i[l] - r[l] + Number.EPSILON) / (t[l] - r[l] + Number.EPSILON) : o = o * (s[l] - i[l] + Number.EPSILON) / (s[l] - t[l] + Number.EPSILON);
        } else {
          if (i[l] < Math.min(0, t[l]) || i[l] > Math.max(0, t[l])) return 0;
          o = (o * i[l] + Number.EPSILON) / (t[l] + Number.EPSILON);
        }
      }
    return o;
  }
  // Interpolates points without delta values.
  // Needed for the Ø and Q glyphs in Skia.
  // Algorithm from Freetype.
  interpolateMissingDeltas(e, t, r) {
    if (e.length === 0) return;
    let s = 0;
    for (; s < e.length; ) {
      let i = s, a = s, o = e[a];
      for (; !o.endContour; ) o = e[++a];
      for (; s <= a && !r[s]; ) s++;
      if (s > a) continue;
      let l = s, f = s;
      for (s++; s <= a; )
        r[s] && (this.deltaInterpolate(f + 1, s - 1, f, s, t, e), f = s), s++;
      f === l ? this.deltaShift(i, a, f, t, e) : (this.deltaInterpolate(f + 1, a, f, l, t, e), l > 0 && this.deltaInterpolate(i, l - 1, f, l, t, e)), s = a + 1;
    }
  }
  deltaInterpolate(e, t, r, s, i, a) {
    if (e > t) return;
    let o = [
      "x",
      "y"
    ];
    for (let f = 0; f < o.length; f++) {
      let u = o[f];
      if (i[r][u] > i[s][u]) {
        var l = r;
        r = s, s = l;
      }
      let c = i[r][u], x = i[s][u], g = a[r][u], m = a[s][u];
      if (c !== x || g === m) {
        let v = c === x ? 0 : (m - g) / (x - c);
        for (let E = e; E <= t; E++) {
          let C = i[E][u];
          C <= c ? C += g - c : C >= x ? C += m - x : C = g + (C - c) * v, a[E][u] = C;
        }
      }
    }
  }
  deltaShift(e, t, r, s, i) {
    let a = i[r].x - s[r].x, o = i[r].y - s[r].y;
    if (!(a === 0 && o === 0))
      for (let l = e; l <= t; l++) l !== r && (i[l].x += a, i[l].y += o);
  }
  getAdvanceAdjustment(e, t) {
    let r, s;
    if (t.advanceWidthMapping) {
      let i = e;
      i >= t.advanceWidthMapping.mapCount && (i = t.advanceWidthMapping.mapCount - 1), t.advanceWidthMapping.entryFormat, { outerIndex: r, innerIndex: s } = t.advanceWidthMapping.mapData[i];
    } else
      r = 0, s = e;
    return this.getDelta(t.itemVariationStore, r, s);
  }
  // See pseudo code from `Font Variations Overview'
  // in the OpenType specification.
  getDelta(e, t, r) {
    if (t >= e.itemVariationData.length) return 0;
    let s = e.itemVariationData[t];
    if (r >= s.deltaSets.length) return 0;
    let i = s.deltaSets[r], a = this.getBlendVector(e, t), o = 0;
    for (let l = 0; l < s.regionIndexCount; l++) o += i.deltas[l] * a[l];
    return o;
  }
  getBlendVector(e, t) {
    let r = e.itemVariationData[t];
    if (this.blendVectors.has(r)) return this.blendVectors.get(r);
    let s = this.normalizedCoords, i = [];
    for (let a = 0; a < r.regionIndexCount; a++) {
      let o = 1, l = r.regionIndexes[a], f = e.variationRegionList.variationRegions[l];
      for (let u = 0; u < f.length; u++) {
        let c = f[u], x;
        c.startCoord > c.peakCoord || c.peakCoord > c.endCoord || c.startCoord < 0 && c.endCoord > 0 && c.peakCoord !== 0 || c.peakCoord === 0 ? x = 1 : s[u] < c.startCoord || s[u] > c.endCoord ? x = 0 : s[u] === c.peakCoord ? x = 1 : s[u] < c.peakCoord ? x = (s[u] - c.startCoord + Number.EPSILON) / (c.peakCoord - c.startCoord + Number.EPSILON) : x = (c.endCoord - s[u] + Number.EPSILON) / (c.endCoord - c.peakCoord + Number.EPSILON), o *= x;
      }
      i[a] = o;
    }
    return this.blendVectors.set(r, i), i;
  }
  constructor(e, t) {
    this.font = e, this.normalizedCoords = this.normalizeCoords(t), this.blendVectors = /* @__PURE__ */ new Map();
  }
}
Promise.resolve();
class Rl {
  includeGlyph(e) {
    return typeof e == "object" && (e = e.id), this.mapping[e] == null && (this.glyphs.push(e), this.mapping[e] = this.glyphs.length - 1), this.mapping[e];
  }
  constructor(e) {
    this.font = e, this.glyphs = [], this.mapping = {}, this.includeGlyph(0);
  }
}
const m4 = 1, A4 = 2, w4 = 4, v4 = 8, y4 = 16, C4 = 32;
class y1 {
  static size(e) {
    return e >= 0 && e <= 255 ? 1 : 2;
  }
  static encode(e, t) {
    t >= 0 && t <= 255 ? e.writeUInt8(t) : e.writeInt16BE(t);
  }
}
let C1 = new F({
  numberOfContours: U,
  xMin: U,
  yMin: U,
  xMax: U,
  yMax: U,
  endPtsOfContours: new S(h, "numberOfContours"),
  instructions: new S(H, h),
  flags: new S(H, 0),
  xPoints: new S(y1, 0),
  yPoints: new S(y1, 0)
});
class S4 {
  encodeSimple(e, t = []) {
    let r = [], s = [], i = [], a = [], o = 0, l = 0, f = 0, u = 0, c = 0;
    for (let C = 0; C < e.commands.length; C++) {
      let y = e.commands[C];
      for (let A = 0; A < y.args.length; A += 2) {
        let k = y.args[A], p = y.args[A + 1], D = 0;
        if (y.command === "quadraticCurveTo" && A === 2) {
          let M = e.commands[C + 1];
          if (M && M.command === "quadraticCurveTo") {
            let I = (l + M.args[0]) / 2, B = (f + M.args[1]) / 2;
            if (k === I && p === B) continue;
          }
        }
        y.command === "quadraticCurveTo" && A === 0 || (D |= m4), D = this._encodePoint(k, l, s, D, A4, y4), D = this._encodePoint(p, f, i, D, w4, C4), D === u && o < 255 ? (a[a.length - 1] |= v4, o++) : (o > 0 && (a.push(o), o = 0), a.push(D), u = D), l = k, f = p, c++;
      }
      y.command === "closePath" && r.push(c - 1);
    }
    e.commands.length > 1 && e.commands[e.commands.length - 1].command !== "closePath" && r.push(c - 1);
    let x = e.bbox, g = {
      numberOfContours: r.length,
      xMin: x.minX,
      yMin: x.minY,
      xMax: x.maxX,
      yMax: x.maxY,
      endPtsOfContours: r,
      instructions: t,
      flags: a,
      xPoints: s,
      yPoints: i
    }, m = C1.size(g), v = 4 - m % 4, E = new Sn(m + v);
    return C1.encode(E, g), v !== 0 && E.fill(0, v), E.buffer;
  }
  _encodePoint(e, t, r, s, i, a) {
    let o = e - t;
    return e === t ? s |= a : (-255 <= o && o <= 255 && (s |= i, o < 0 ? o = -o : s |= a), r.push(o)), s;
  }
}
class k4 extends Rl {
  _addGlyph(e) {
    let t = this.font.getGlyph(e), r = t._decode(), s = this.font.loca.offsets[e], i = this.font.loca.offsets[e + 1], a = this.font._getTableStream("glyf");
    a.pos += s;
    let o = a.readBuffer(i - s);
    if (r && r.numberOfContours < 0) {
      o = new Uint8Array(o);
      let l = new DataView(o.buffer);
      for (let f of r.components)
        e = this.includeGlyph(f.glyphID), l.setUint16(f.pos, e);
    } else r && this.font._variationProcessor && (o = this.glyphEncoder.encodeSimple(t.path, r.instructions));
    return this.glyf.push(o), this.loca.offsets.push(this.offset), this.hmtx.metrics.push({
      advance: t.advanceWidth,
      bearing: t._getMetrics().leftBearing
    }), this.offset += o.length, this.glyf.length - 1;
  }
  encode() {
    this.glyf = [], this.offset = 0, this.loca = {
      offsets: [],
      version: this.font.loca.version
    }, this.hmtx = {
      metrics: [],
      bearings: []
    };
    let e = 0;
    for (; e < this.glyphs.length; ) this._addGlyph(this.glyphs[e++]);
    let t = Ps(this.font.maxp);
    t.numGlyphs = this.glyf.length, this.loca.offsets.push(this.offset);
    let r = Ps(this.font.head);
    r.indexToLocFormat = this.loca.version;
    let s = Ps(this.font.hhea);
    return s.numberOfMetrics = this.hmtx.metrics.length, kl.toBuffer({
      tables: {
        head: r,
        hhea: s,
        loca: this.loca,
        maxp: t,
        "cvt ": this.font["cvt "],
        prep: this.font.prep,
        glyf: this.glyf,
        hmtx: this.hmtx,
        fpgm: this.font.fpgm
      }
    });
  }
  constructor(e) {
    super(e), this.glyphEncoder = new S4();
  }
}
class P4 extends Rl {
  subsetCharstrings() {
    this.charstrings = [];
    let e = {};
    for (let t of this.glyphs) {
      this.charstrings.push(this.cff.getCharString(t));
      let r = this.font.getGlyph(t);
      r.path;
      for (let s in r._usedGsubrs) e[s] = !0;
    }
    this.gsubrs = this.subsetSubrs(this.cff.globalSubrIndex, e);
  }
  subsetSubrs(e, t) {
    let r = [];
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      t[s] ? (this.cff.stream.pos = i.offset, r.push(this.cff.stream.readBuffer(i.length))) : r.push(new Uint8Array([
        11
      ]));
    }
    return r;
  }
  subsetFontdict(e) {
    e.FDArray = [], e.FDSelect = {
      version: 0,
      fds: []
    };
    let t = {}, r = [], s = {};
    for (let i of this.glyphs) {
      let a = this.cff.fdForGlyph(i);
      if (a == null) continue;
      t[a] || (e.FDArray.push(Object.assign({}, this.cff.topDict.FDArray[a])), r.push({}), s[a] = e.FDArray.length - 1), t[a] = !0, e.FDSelect.fds.push(s[a]);
      let o = this.font.getGlyph(i);
      o.path;
      for (let l in o._usedSubrs) r[s[a]][l] = !0;
    }
    for (let i = 0; i < e.FDArray.length; i++) {
      let a = e.FDArray[i];
      delete a.FontName, a.Private && a.Private.Subrs && (a.Private = Object.assign({}, a.Private), a.Private.Subrs = this.subsetSubrs(a.Private.Subrs, r[i]));
    }
  }
  createCIDFontdict(e) {
    let t = {};
    for (let s of this.glyphs) {
      let i = this.font.getGlyph(s);
      i.path;
      for (let a in i._usedSubrs) t[a] = !0;
    }
    let r = Object.assign({}, this.cff.topDict.Private);
    return this.cff.topDict.Private && this.cff.topDict.Private.Subrs && (r.Subrs = this.subsetSubrs(this.cff.topDict.Private.Subrs, t)), e.FDArray = [
      {
        Private: r
      }
    ], e.FDSelect = {
      version: 3,
      nRanges: 1,
      ranges: [
        {
          first: 0,
          fd: 0
        }
      ],
      sentinel: this.charstrings.length
    };
  }
  addString(e) {
    return e ? (this.strings || (this.strings = []), this.strings.push(e), dn.length + this.strings.length - 1) : null;
  }
  encode() {
    this.subsetCharstrings();
    let e = {
      version: this.charstrings.length > 255 ? 2 : 1,
      ranges: [
        {
          first: 1,
          nLeft: this.charstrings.length - 2
        }
      ]
    }, t = Object.assign({}, this.cff.topDict);
    t.Private = null, t.charset = e, t.Encoding = null, t.CharStrings = this.charstrings;
    for (let s of [
      "version",
      "Notice",
      "Copyright",
      "FullName",
      "FamilyName",
      "Weight",
      "PostScript",
      "BaseFontName",
      "FontName"
    ]) t[s] = this.addString(this.cff.string(t[s]));
    t.ROS = [
      this.addString("Adobe"),
      this.addString("Identity"),
      0
    ], t.CIDCount = this.charstrings.length, this.cff.isCIDFont ? this.subsetFontdict(t) : this.createCIDFontdict(t);
    let r = {
      version: 1,
      hdrSize: this.cff.hdrSize,
      offSize: 4,
      header: this.cff.header,
      nameIndex: [
        this.cff.postscriptName
      ],
      topDictIndex: [
        t
      ],
      stringIndex: this.strings,
      globalSubrIndex: this.gsubrs
    };
    return wl.toBuffer(r);
  }
  constructor(e) {
    if (super(e), this.cff = this.font["CFF "], !this.cff) throw new Error("Not a CFF Font");
  }
}
class Ze {
  static probe(e) {
    let t = Kn.decode(e.slice(0, 4));
    return t === "true" || t === "OTTO" || t === "\0\0\0";
  }
  setDefaultLanguage(e = null) {
    this.defaultLanguage = e;
  }
  _getTable(e) {
    if (!(e.tag in this._tables)) try {
      this._tables[e.tag] = this._decodeTable(e);
    } catch {
    }
    return this._tables[e.tag];
  }
  _getTableStream(e) {
    let t = this.directory.tables[e];
    return t ? (this.stream.pos = t.offset, this.stream) : null;
  }
  _decodeDirectory() {
    return this.directory = kl.decode(this.stream, {
      _startOffset: 0
    });
  }
  _decodeTable(e) {
    let t = this.stream.pos, r = this._getTableStream(e.tag), s = Bn[e.tag].decode(r, this, e.length);
    return this.stream.pos = t, s;
  }
  /**
  * Gets a string from the font's `name` table
  * `lang` is a BCP-47 language code.
  * @return {string}
  */
  getName(e, t = this.defaultLanguage || In) {
    let r = this.name && this.name.records[e];
    return r && (r[t] || r[this.defaultLanguage] || r[In] || r.en || r[Object.keys(r)[0]]) || null;
  }
  /**
  * The unique PostScript name for this font, e.g. "Helvetica-Bold"
  * @type {string}
  */
  get postscriptName() {
    return this.getName("postscriptName");
  }
  /**
  * The font's full name, e.g. "Helvetica Bold"
  * @type {string}
  */
  get fullName() {
    return this.getName("fullName");
  }
  /**
  * The font's family name, e.g. "Helvetica"
  * @type {string}
  */
  get familyName() {
    return this.getName("fontFamily");
  }
  /**
  * The font's sub-family, e.g. "Bold".
  * @type {string}
  */
  get subfamilyName() {
    return this.getName("fontSubfamily");
  }
  /**
  * The font's copyright information
  * @type {string}
  */
  get copyright() {
    return this.getName("copyright");
  }
  /**
  * The font's version number
  * @type {string}
  */
  get version() {
    return this.getName("version");
  }
  /**
  * The font’s [ascender](https://en.wikipedia.org/wiki/Ascender_(typography))
  * @type {number}
  */
  get ascent() {
    return this.hhea.ascent;
  }
  /**
  * The font’s [descender](https://en.wikipedia.org/wiki/Descender)
  * @type {number}
  */
  get descent() {
    return this.hhea.descent;
  }
  /**
  * The amount of space that should be included between lines
  * @type {number}
  */
  get lineGap() {
    return this.hhea.lineGap;
  }
  /**
  * The offset from the normal underline position that should be used
  * @type {number}
  */
  get underlinePosition() {
    return this.post.underlinePosition;
  }
  /**
  * The weight of the underline that should be used
  * @type {number}
  */
  get underlineThickness() {
    return this.post.underlineThickness;
  }
  /**
  * If this is an italic font, the angle the cursor should be drawn at to match the font design
  * @type {number}
  */
  get italicAngle() {
    return this.post.italicAngle;
  }
  /**
  * The height of capital letters above the baseline.
  * See [here](https://en.wikipedia.org/wiki/Cap_height) for more details.
  * @type {number}
  */
  get capHeight() {
    let e = this["OS/2"];
    return e ? e.capHeight : this.ascent;
  }
  /**
  * The height of lower case letters in the font.
  * See [here](https://en.wikipedia.org/wiki/X-height) for more details.
  * @type {number}
  */
  get xHeight() {
    let e = this["OS/2"];
    return e ? e.xHeight : 0;
  }
  /**
  * The number of glyphs in the font.
  * @type {number}
  */
  get numGlyphs() {
    return this.maxp.numGlyphs;
  }
  /**
  * The size of the font’s internal coordinate grid
  * @type {number}
  */
  get unitsPerEm() {
    return this.head.unitsPerEm;
  }
  /**
  * The font’s bounding box, i.e. the box that encloses all glyphs in the font.
  * @type {BBox}
  */
  get bbox() {
    return Object.freeze(new bt(this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax));
  }
  get _cmapProcessor() {
    return new Gi(this.cmap);
  }
  /**
  * An array of all of the unicode code points supported by the font.
  * @type {number[]}
  */
  get characterSet() {
    return this._cmapProcessor.getCharacterSet();
  }
  /**
  * Returns whether there is glyph in the font for the given unicode code point.
  *
  * @param {number} codePoint
  * @return {boolean}
  */
  hasGlyphForCodePoint(e) {
    return !!this._cmapProcessor.lookup(e);
  }
  /**
  * Maps a single unicode code point to a Glyph object.
  * Does not perform any advanced substitutions (there is no context to do so).
  *
  * @param {number} codePoint
  * @return {Glyph}
  */
  glyphForCodePoint(e) {
    return this.getGlyph(this._cmapProcessor.lookup(e), [
      e
    ]);
  }
  /**
  * Returns an array of Glyph objects for the given string.
  * This is only a one-to-one mapping from characters to glyphs.
  * For most uses, you should use font.layout (described below), which
  * provides a much more advanced mapping supporting AAT and OpenType shaping.
  *
  * @param {string} string
  * @return {Glyph[]}
  */
  glyphsForString(e) {
    let t = [], r = e.length, s = 0, i = -1, a = -1;
    for (; s <= r; ) {
      let o = 0, l = 0;
      if (s < r) {
        if (o = e.charCodeAt(s++), 55296 <= o && o <= 56319 && s < r) {
          let f = e.charCodeAt(s);
          56320 <= f && f <= 57343 && (s++, o = ((o & 1023) << 10) + (f & 1023) + 65536);
        }
        l = 65024 <= o && o <= 65039 || 917760 <= o && o <= 917999 ? 1 : 0;
      } else s++;
      a === 0 && l === 1 ? t.push(this.getGlyph(this._cmapProcessor.lookup(i, o), [
        i,
        o
      ])) : a === 0 && l === 0 && t.push(this.glyphForCodePoint(i)), i = o, a = l;
    }
    return t;
  }
  get _layoutEngine() {
    return new $3(this);
  }
  /**
  * Returns a GlyphRun object, which includes an array of Glyphs and GlyphPositions for the given string.
  *
  * @param {string} string
  * @param {string[]} [userFeatures]
  * @param {string} [script]
  * @param {string} [language]
  * @param {string} [direction]
  * @return {GlyphRun}
  */
  layout(e, t, r, s, i) {
    return this._layoutEngine.layout(e, t, r, s, i);
  }
  /**
  * Returns an array of strings that map to the given glyph id.
  * @param {number} gid - glyph id
  */
  stringsForGlyph(e) {
    return this._layoutEngine.stringsForGlyph(e);
  }
  /**
  * An array of all [OpenType feature tags](https://www.microsoft.com/typography/otspec/featuretags.htm)
  * (or mapped AAT tags) supported by the font.
  * The features parameter is an array of OpenType feature tags to be applied in addition to the default set.
  * If this is an AAT font, the OpenType feature tags are mapped to AAT features.
  *
  * @type {string[]}
  */
  get availableFeatures() {
    return this._layoutEngine.getAvailableFeatures();
  }
  getAvailableFeatures(e, t) {
    return this._layoutEngine.getAvailableFeatures(e, t);
  }
  _getBaseGlyph(e, t = []) {
    return this._glyphs[e] || (this.directory.tables.glyf ? this._glyphs[e] = new es(e, t, this) : (this.directory.tables["CFF "] || this.directory.tables.CFF2) && (this._glyphs[e] = new a4(e, t, this))), this._glyphs[e] || null;
  }
  /**
  * Returns a glyph object for the given glyph id.
  * You can pass the array of code points this glyph represents for
  * your use later, and it will be stored in the glyph object.
  *
  * @param {number} glyph
  * @param {number[]} characters
  * @return {Glyph}
  */
  getGlyph(e, t = []) {
    return this._glyphs[e] || (this.directory.tables.sbix ? this._glyphs[e] = new l4(e, t, this) : this.directory.tables.COLR && this.directory.tables.CPAL ? this._glyphs[e] = new c4(e, t, this) : this._getBaseGlyph(e, t)), this._glyphs[e] || null;
  }
  /**
  * Returns a Subset for this font.
  * @return {Subset}
  */
  createSubset() {
    return this.directory.tables["CFF "] ? new P4(this) : new k4(this);
  }
  /**
  * Returns an object describing the available variation axes
  * that this font supports. Keys are setting tags, and values
  * contain the axis name, range, and default value.
  *
  * @type {object}
  */
  get variationAxes() {
    let e = {};
    if (!this.fvar) return e;
    for (let t of this.fvar.axis) e[t.axisTag.trim()] = {
      name: t.name.en,
      min: t.minValue,
      default: t.defaultValue,
      max: t.maxValue
    };
    return e;
  }
  /**
  * Returns an object describing the named variation instances
  * that the font designer has specified. Keys are variation names
  * and values are the variation settings for this instance.
  *
  * @type {object}
  */
  get namedVariations() {
    let e = {};
    if (!this.fvar) return e;
    for (let t of this.fvar.instance) {
      let r = {};
      for (let s = 0; s < this.fvar.axis.length; s++) {
        let i = this.fvar.axis[s];
        r[i.axisTag.trim()] = t.coord[s];
      }
      e[t.name.en] = r;
    }
    return e;
  }
  /**
  * Returns a new font with the given variation settings applied.
  * Settings can either be an instance name, or an object containing
  * variation tags as specified by the `variationAxes` property.
  *
  * @param {object} settings
  * @return {TTFFont}
  */
  getVariation(e) {
    if (!(this.directory.tables.fvar && (this.directory.tables.gvar && this.directory.tables.glyf || this.directory.tables.CFF2))) throw new Error("Variations require a font with the fvar, gvar and glyf, or CFF2 tables.");
    if (typeof e == "string" && (e = this.namedVariations[e]), typeof e != "object") throw new Error("Variation settings must be either a variation name or settings object.");
    let t = this.fvar.axis.map((i, a) => {
      let o = i.axisTag.trim();
      return o in e ? Math.max(i.minValue, Math.min(i.maxValue, e[o])) : i.defaultValue;
    }), r = new We(this.stream.buffer);
    r.pos = this._directoryPos;
    let s = new Ze(r, t);
    return s._tables = this._tables, s;
  }
  get _variationProcessor() {
    if (!this.fvar) return null;
    let e = this.variationCoords;
    return !e && !this.CFF2 ? null : (e || (e = this.fvar.axis.map((t) => t.defaultValue)), new g4(this, e));
  }
  // Standardized format plugin API
  getFont(e) {
    return this.getVariation(e);
  }
  constructor(e, t = null) {
    n0(this, "type", "TTF"), this.defaultLanguage = null, this.stream = e, this.variationCoords = t, this._directoryPos = this.stream.pos, this._tables = {}, this._glyphs = {}, this._decodeDirectory();
    for (let r in this.directory.tables) {
      let s = this.directory.tables[r];
      Bn[r] && s.length > 0 && Object.defineProperty(this, r, {
        get: this._getTable.bind(this, s)
      });
    }
  }
}
Ve([
  _e
], Ze.prototype, "bbox", null);
Ve([
  _e
], Ze.prototype, "_cmapProcessor", null);
Ve([
  _e
], Ze.prototype, "characterSet", null);
Ve([
  _e
], Ze.prototype, "_layoutEngine", null);
Ve([
  _e
], Ze.prototype, "variationAxes", null);
Ve([
  _e
], Ze.prototype, "namedVariations", null);
Ve([
  _e
], Ze.prototype, "_variationProcessor", null);
let T4 = new F({
  tag: new Se(4),
  offset: new P(T, "void", {
    type: "global"
  }),
  compLength: T,
  length: T,
  origChecksum: T
}), Ul = new F({
  tag: new Se(4),
  flavor: T,
  length: T,
  numTables: h,
  reserved: new Ie(h),
  totalSfntSize: T,
  majorVersion: h,
  minorVersion: h,
  metaOffset: T,
  metaLength: T,
  metaOrigLength: T,
  privOffset: T,
  privLength: T,
  tables: new S(T4, "numTables")
});
Ul.process = function() {
  let n = {};
  for (let e of this.tables) n[e.tag] = e;
  this.tables = n;
};
var I4 = Ul;
class E4 extends Ze {
  static probe(e) {
    return Kn.decode(e.slice(0, 4)) === "wOFF";
  }
  _decodeDirectory() {
    this.directory = I4.decode(this.stream, {
      _startOffset: 0
    });
  }
  _getTableStream(e) {
    let t = this.directory.tables[e];
    if (t)
      if (this.stream.pos = t.offset, t.compLength < t.length) {
        this.stream.pos += 2;
        let r = new Uint8Array(t.length), s = m2(this.stream.readBuffer(t.compLength - 2), r);
        return new We(s);
      } else return this.stream;
    return null;
  }
  constructor(...e) {
    super(...e), n0(this, "type", "WOFF");
  }
}
class F4 extends es {
  _decode() {
    return this._font._transformedGlyphs[this.id];
  }
  _getCBox() {
    return this.path.bbox;
  }
  constructor(...e) {
    super(...e), n0(this, "type", "WOFF2");
  }
}
const S1 = {
  decode(n) {
    let e = 0, t = [
      0,
      1,
      2,
      3,
      4
    ];
    for (let r = 0; r < t.length; r++) {
      let s = n.readUInt8();
      if (e & 3758096384) throw new Error("Overflow");
      if (e = e << 7 | s & 127, !(s & 128)) return e;
    }
    throw new Error("Bad base 128 number");
  }
};
let B4 = [
  "cmap",
  "head",
  "hhea",
  "hmtx",
  "maxp",
  "name",
  "OS/2",
  "post",
  "cvt ",
  "fpgm",
  "glyf",
  "loca",
  "prep",
  "CFF ",
  "VORG",
  "EBDT",
  "EBLC",
  "gasp",
  "hdmx",
  "kern",
  "LTSH",
  "PCLT",
  "VDMX",
  "vhea",
  "vmtx",
  "BASE",
  "GDEF",
  "GPOS",
  "GSUB",
  "EBSC",
  "JSTF",
  "MATH",
  "CBDT",
  "CBLC",
  "COLR",
  "CPAL",
  "SVG ",
  "sbix",
  "acnt",
  "avar",
  "bdat",
  "bloc",
  "bsln",
  "cvar",
  "fdsc",
  "feat",
  "fmtx",
  "fvar",
  "gvar",
  "hsty",
  "just",
  "lcar",
  "mort",
  "morx",
  "opbd",
  "prop",
  "trak",
  "Zapf",
  "Silf",
  "Glat",
  "Gloc",
  "Feat",
  "Sill"
], O4 = new F({
  flags: H,
  customTag: new kn(new Se(4), (n) => (n.flags & 63) === 63),
  tag: (n) => n.customTag || B4[n.flags & 63],
  length: S1,
  transformVersion: (n) => n.flags >>> 6 & 3,
  transformed: (n) => n.tag === "glyf" || n.tag === "loca" ? n.transformVersion === 0 : n.transformVersion !== 0,
  transformLength: new kn(S1, (n) => n.transformed)
}), Nl = new F({
  tag: new Se(4),
  flavor: T,
  length: T,
  numTables: h,
  reserved: new Ie(h),
  totalSfntSize: T,
  totalCompressedSize: T,
  majorVersion: h,
  minorVersion: h,
  metaOffset: T,
  metaLength: T,
  metaOrigLength: T,
  privOffset: T,
  privLength: T,
  tables: new S(O4, "numTables")
});
Nl.process = function() {
  let n = {};
  for (let e = 0; e < this.tables.length; e++) {
    let t = this.tables[e];
    n[t.tag] = t;
  }
  return this.tables = n;
};
var D4 = Nl;
class M4 extends Ze {
  static probe(e) {
    return Kn.decode(e.slice(0, 4)) === "wOF2";
  }
  _decodeDirectory() {
    this.directory = D4.decode(this.stream), this._dataPos = this.stream.pos;
  }
  _decompress() {
    if (!this._decompressed) {
      this.stream.pos = this._dataPos;
      let e = this.stream.readBuffer(this.directory.totalCompressedSize), t = 0;
      for (let s in this.directory.tables) {
        let i = this.directory.tables[s];
        i.offset = t, t += i.transformLength != null ? i.transformLength : i.length;
      }
      let r = nf(e, t);
      if (!r) throw new Error("Error decoding compressed data in WOFF2");
      this.stream = new We(r), this._decompressed = !0;
    }
  }
  _decodeTable(e) {
    return this._decompress(), super._decodeTable(e);
  }
  // Override this method to get a glyph and return our
  // custom subclass if there is a glyf table.
  _getBaseGlyph(e, t = []) {
    if (!this._glyphs[e])
      return this.directory.tables.glyf && this.directory.tables.glyf.transformed ? (this._transformedGlyphs || this._transformGlyfTable(), this._glyphs[e] = new F4(e, t, this)) : super._getBaseGlyph(e, t);
  }
  _transformGlyfTable() {
    this._decompress(), this.stream.pos = this.directory.tables.glyf.offset;
    let e = L4.decode(this.stream), t = [];
    for (let s = 0; s < e.numGlyphs; s++) {
      let i = {}, a = e.nContours.readInt16BE();
      if (i.numberOfContours = a, a > 0) {
        let o = [], l = 0;
        for (let f = 0; f < a; f++) {
          let u = Ns(e.nPoints);
          l += u, o.push(l);
        }
        i.points = z4(e.flags, e.glyphs, l);
        for (let f = 0; f < a; f++) i.points[o[f] - 1].endContour = !0;
        var r = Ns(e.glyphs);
      } else if (a < 0 && es.prototype._decodeComposite.call({
        _font: this
      }, i, e.composites))
        var r = Ns(e.glyphs);
      t.push(i);
    }
    this._transformedGlyphs = t;
  }
  constructor(...e) {
    super(...e), n0(this, "type", "WOFF2");
  }
}
class mt {
  decode(e, t) {
    return new We(this._buf.decode(e, t));
  }
  constructor(e) {
    this.length = e, this._buf = new D0(e);
  }
}
let L4 = new F({
  version: T,
  numGlyphs: h,
  indexFormat: h,
  nContourStreamSize: T,
  nPointsStreamSize: T,
  flagStreamSize: T,
  glyphStreamSize: T,
  compositeStreamSize: T,
  bboxStreamSize: T,
  instructionStreamSize: T,
  nContours: new mt("nContourStreamSize"),
  nPoints: new mt("nPointsStreamSize"),
  flags: new mt("flagStreamSize"),
  glyphs: new mt("glyphStreamSize"),
  composites: new mt("compositeStreamSize"),
  bboxes: new mt("bboxStreamSize"),
  instructions: new mt("instructionStreamSize")
});
const R4 = 253, U4 = 254, N4 = 255, k1 = 253;
function Ns(n) {
  let e = n.readUInt8();
  return e === R4 ? n.readUInt16BE() : e === N4 ? n.readUInt8() + k1 : e === U4 ? n.readUInt8() + k1 * 2 : e;
}
function C0(n, e) {
  return n & 1 ? e : -e;
}
function z4(n, e, t) {
  let r, s = r = 0, i = [];
  for (let l = 0; l < t; l++) {
    let f = 0, u = 0, c = n.readUInt8(), x = !(c >> 7);
    if (c &= 127, c < 10)
      f = 0, u = C0(c, ((c & 14) << 7) + e.readUInt8());
    else if (c < 20)
      f = C0(c, ((c - 10 & 14) << 7) + e.readUInt8()), u = 0;
    else if (c < 84) {
      var a = c - 20, o = e.readUInt8();
      f = C0(c, 1 + (a & 48) + (o >> 4)), u = C0(c >> 1, 1 + ((a & 12) << 2) + (o & 15));
    } else if (c < 120) {
      var a = c - 84;
      f = C0(c, 1 + (a / 12 << 8) + e.readUInt8()), u = C0(c >> 1, 1 + (a % 12 >> 2 << 8) + e.readUInt8());
    } else if (c < 124) {
      var o = e.readUInt8();
      let m = e.readUInt8();
      f = C0(c, (o << 4) + (m >> 4)), u = C0(c >> 1, ((m & 15) << 8) + e.readUInt8());
    } else
      f = C0(c, e.readUInt16BE()), u = C0(c >> 1, e.readUInt16BE());
    s += f, r += u, i.push(new x0(x, !1, s, r));
  }
  return i;
}
let G4 = new fe(T, {
  65536: {
    numFonts: T,
    offsets: new S(T, "numFonts")
  },
  131072: {
    numFonts: T,
    offsets: new S(T, "numFonts"),
    dsigTag: T,
    dsigLength: T,
    dsigOffset: T
  }
});
class H4 {
  static probe(e) {
    return Kn.decode(e.slice(0, 4)) === "ttcf";
  }
  getFont(e) {
    for (let t of this.header.offsets) {
      let r = new We(this.stream.buffer);
      r.pos = t;
      let s = new Ze(r);
      if (s.postscriptName === e || s.postscriptName instanceof Uint8Array && e instanceof Uint8Array && s.postscriptName.every((i, a) => e[a] === i)) return s;
    }
    return null;
  }
  get fonts() {
    let e = [];
    for (let t of this.header.offsets) {
      let r = new We(this.stream.buffer);
      r.pos = t, e.push(new Ze(r));
    }
    return e;
  }
  constructor(e) {
    if (n0(this, "type", "TTC"), this.stream = e, e.readString(4) !== "ttcf") throw new Error("Not a TrueType collection");
    this.header = G4.decode(e);
  }
}
let W4 = new Se(H);
new F({
  len: T,
  buf: new D0("len")
});
let V4 = new F({
  id: h,
  nameOffset: U,
  attr: H,
  dataOffset: ut,
  handle: T
}), _4 = new F({
  name: new Se(4),
  maxTypeIndex: h,
  refList: new P(h, new S(V4, (n) => n.maxTypeIndex + 1), {
    type: "parent"
  })
}), q4 = new F({
  length: h,
  types: new S(_4, (n) => n.length + 1)
}), $4 = new F({
  reserved: new Ie(H, 24),
  typeList: new P(h, q4),
  nameListOffset: new P(h, "void")
}), P1 = new F({
  dataOffset: T,
  map: new P(T, $4),
  dataLength: T,
  mapLength: T
});
class X4 {
  static probe(e) {
    let t = new We(e);
    try {
      var r = P1.decode(t);
    } catch {
      return !1;
    }
    for (let s of r.map.typeList.types)
      if (s.name === "sfnt") return !0;
    return !1;
  }
  getFont(e) {
    if (!this.sfnt) return null;
    for (let t of this.sfnt.refList) {
      let r = this.header.dataOffset + t.dataOffset + 4, s = new We(this.stream.buffer.slice(r)), i = new Ze(s);
      if (i.postscriptName === e || i.postscriptName instanceof Uint8Array && e instanceof Uint8Array && i.postscriptName.every((a, o) => e[o] === a)) return i;
    }
    return null;
  }
  get fonts() {
    let e = [];
    for (let t of this.sfnt.refList) {
      let r = this.header.dataOffset + t.dataOffset + 4, s = new We(this.stream.buffer.slice(r));
      e.push(new Ze(s));
    }
    return e;
  }
  constructor(e) {
    n0(this, "type", "DFont"), this.stream = e, this.header = P1.decode(this.stream);
    for (let t of this.header.map.typeList.types) {
      for (let r of t.refList) r.nameOffset >= 0 ? (this.stream.pos = r.nameOffset + this.header.map.nameListOffset, r.name = W4.decode(this.stream)) : r.name = null;
      t.name === "sfnt" && (this.sfnt = t);
    }
  }
}
ir(Ze);
ir(E4);
ir(M4);
ir(H4);
ir(X4);
var zl = {};
(function(n) {
  var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  (function(t) {
    var r = typeof Uint8Array < "u" ? Uint8Array : Array, s = 43, i = 47, a = 48, o = 97, l = 65, f = 45, u = 95;
    function c(m) {
      var v = m.charCodeAt(0);
      if (v === s || v === f)
        return 62;
      if (v === i || v === u)
        return 63;
      if (v < a)
        return -1;
      if (v < a + 10)
        return v - a + 26 + 26;
      if (v < l + 26)
        return v - l;
      if (v < o + 26)
        return v - o + 26;
    }
    function x(m) {
      var v, E, C, y, A, k;
      if (m.length % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var p = m.length;
      A = m.charAt(p - 2) === "=" ? 2 : m.charAt(p - 1) === "=" ? 1 : 0, k = new r(m.length * 3 / 4 - A), C = A > 0 ? m.length - 4 : m.length;
      var D = 0;
      function M(I) {
        k[D++] = I;
      }
      for (v = 0, E = 0; v < C; v += 4, E += 3)
        y = c(m.charAt(v)) << 18 | c(m.charAt(v + 1)) << 12 | c(m.charAt(v + 2)) << 6 | c(m.charAt(v + 3)), M((y & 16711680) >> 16), M((y & 65280) >> 8), M(y & 255);
      return A === 2 ? (y = c(m.charAt(v)) << 2 | c(m.charAt(v + 1)) >> 4, M(y & 255)) : A === 1 && (y = c(m.charAt(v)) << 10 | c(m.charAt(v + 1)) << 4 | c(m.charAt(v + 2)) >> 2, M(y >> 8 & 255), M(y & 255)), k;
    }
    function g(m) {
      var v, E = m.length % 3, C = "", y, A;
      function k(D) {
        return e.charAt(D);
      }
      function p(D) {
        return k(D >> 18 & 63) + k(D >> 12 & 63) + k(D >> 6 & 63) + k(D & 63);
      }
      for (v = 0, A = m.length - E; v < A; v += 3)
        y = (m[v] << 16) + (m[v + 1] << 8) + m[v + 2], C += p(y);
      switch (E) {
        case 1:
          y = m[m.length - 1], C += k(y >> 2), C += k(y << 4 & 63), C += "==";
          break;
        case 2:
          y = (m[m.length - 2] << 8) + m[m.length - 1], C += k(y >> 10), C += k(y >> 4 & 63), C += k(y << 2 & 63), C += "=";
          break;
      }
      return C;
    }
    t.toByteArray = x, t.fromByteArray = g;
  })(n);
})(zl);
const j4 = /* @__PURE__ */ Dt(zl);
var Gl = {};
const Y4 = 5, T1 = 12, K4 = 13, Z4 = 16, J4 = 17, Q4 = 22, I1 = 28, E1 = 31, e5 = 33, pn = 34, t5 = 35, zs = 36, di = 37, Hl = 38, r5 = 39, n5 = 40, vr = 41, s5 = 42, d = 0, b = 1, ve = 2, Wl = 3, w = 4, i5 = [
  //OP   , CL    , CP    , QU    , GL    , NS    , EX    , SY    , IS    , PR    , PO    , NU    , AL    , HL    , ID    , IN    , HY    , BA    , BB    , B2    , ZW    , CM    , WJ    , H2    , H3    , JL    , JV    , JT    , RI    , EB    , EM    , ZWJ   , CB
  [
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    Wl,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w,
    w
  ],
  [
    d,
    w,
    w,
    b,
    b,
    w,
    w,
    w,
    w,
    b,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    w,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    w,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    w,
    ve,
    w,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    w,
    ve,
    w,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    b,
    d,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    b,
    b,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    d,
    b,
    w,
    w,
    w,
    d,
    d,
    b,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    d,
    b,
    w,
    w,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    w,
    ve,
    w,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    w,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    w,
    ve,
    w,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    b,
    b,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    b,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    b,
    b,
    b,
    b,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    b,
    b,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    b,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    b,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    d,
    b,
    d,
    d,
    d,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    b,
    w,
    w,
    b,
    b,
    b,
    w,
    w,
    w,
    b,
    b,
    b,
    b,
    b,
    d,
    b,
    b,
    b,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ],
  [
    d,
    w,
    w,
    b,
    b,
    d,
    w,
    w,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    w,
    ve,
    w,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    b,
    d
  ]
  // CB
], a5 = j4.toByteArray("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"), o5 = new Ur(a5), F1 = function(n) {
  switch (n) {
    case e5:
      return T1;
    case r5:
    case n5:
    case s5:
      return T1;
    case t5:
      return Y4;
    default:
      return n;
  }
}, B1 = function(n) {
  switch (n) {
    case di:
    case Hl:
      return pn;
    case vr:
      return Q4;
    default:
      return n;
  }
};
class Gs {
  constructor(e, t = !1) {
    this.position = e, this.required = t;
  }
}
class l5 {
  nextCodePoint() {
    const e = this.string.charCodeAt(this.pos++), t = this.string.charCodeAt(this.pos);
    return 55296 <= e && e <= 56319 && 56320 <= t && t <= 57343 ? (this.pos++, (e - 55296) * 1024 + (t - 56320) + 65536) : e;
  }
  nextCharClass() {
    return F1(o5.get(this.nextCodePoint()));
  }
  getSimpleBreak() {
    switch (this.nextClass) {
      case vr:
        return !1;
      case pn:
      case di:
      case Hl:
        return this.curClass = pn, !1;
      case zs:
        return this.curClass = zs, !1;
    }
    return null;
  }
  getPairTableBreak(e) {
    let t = !1;
    switch (i5[this.curClass][this.nextClass]) {
      case d:
        t = !0;
        break;
      case b:
        t = e === vr;
        break;
      case ve:
        if (t = e === vr, !t)
          return t = !1, t;
        break;
      case Wl:
        if (e !== vr) return t;
        break;
    }
    return this.LB8a && (t = !1), this.LB21a && (this.curClass === Z4 || this.curClass === J4) ? (t = !1, this.LB21a = !1) : this.LB21a = this.curClass === K4, this.curClass === I1 ? (this.LB30a++, this.LB30a == 2 && this.nextClass === I1 && (t = !0, this.LB30a = 0)) : this.LB30a = 0, this.curClass = this.nextClass, t;
  }
  nextBreak() {
    if (this.curClass == null) {
      let e = this.nextCharClass();
      this.curClass = B1(e), this.nextClass = e, this.LB8a = e === E1, this.LB30a = 0;
    }
    for (; this.pos < this.string.length; ) {
      this.lastPos = this.pos;
      const e = this.nextClass;
      if (this.nextClass = this.nextCharClass(), this.curClass === pn || this.curClass === zs && this.nextClass !== di)
        return this.curClass = B1(F1(this.nextClass)), new Gs(this.lastPos, !0);
      let t = this.getSimpleBreak();
      if (t === null && (t = this.getPairTableBreak(e)), this.LB8a = this.nextClass === E1, t) return new Gs(this.lastPos);
    }
    return this.lastPos < this.string.length ? (this.lastPos = this.string.length, new Gs(this.string.length)) : null;
  }
  constructor(e) {
    this.string = e, this.pos = 0, this.lastPos = 0, this.curClass = null, this.nextClass = null, this.LB8a = !1, this.LB21a = !1, this.LB30a = 0;
  }
}
Gl = l5;
const c5 = Oc;
class f5 {
  static decode(e, t) {
    throw new Error("PNG.decode not available in browser build");
  }
  static load(e) {
    throw new Error("PNG.load not available in browser build");
  }
  constructor(e) {
    let t;
    for (this.data = e, this.pos = 8, this.palette = [], this.imgData = [], this.transparency = {}, this.text = {}; ; ) {
      const l = this.readUInt32();
      let f = "";
      for (t = 0; t < 4; t++)
        f += String.fromCharCode(this.data[this.pos++]);
      switch (f) {
        case "IHDR":
          this.width = this.readUInt32(), this.height = this.readUInt32(), this.bits = this.data[this.pos++], this.colorType = this.data[this.pos++], this.compressionMethod = this.data[this.pos++], this.filterMethod = this.data[this.pos++], this.interlaceMethod = this.data[this.pos++];
          break;
        case "PLTE":
          this.palette = this.read(l);
          break;
        case "IDAT":
          for (t = 0; t < l; t++)
            this.imgData.push(this.data[this.pos++]);
          break;
        case "tRNS":
          switch (this.transparency = {}, this.colorType) {
            case 3:
              this.transparency.indexed = this.read(l);
              var r = 255 - this.transparency.indexed.length;
              if (r > 0)
                for (t = 0; t < r; t++)
                  this.transparency.indexed.push(255);
              break;
            case 0:
              this.transparency.grayscale = this.read(l)[0];
              break;
            case 2:
              this.transparency.rgb = this.read(l);
              break;
          }
          break;
        case "tEXt":
          var s = this.read(l), i = s.indexOf(0), a = String.fromCharCode.apply(String, s.slice(0, i));
          this.text[a] = String.fromCharCode.apply(
            String,
            s.slice(i + 1)
          );
          break;
        case "IEND":
          switch (this.colorType) {
            case 0:
            case 3:
            case 4:
              this.colors = 1;
              break;
            case 2:
            case 6:
              this.colors = 3;
              break;
          }
          this.hasAlphaChannel = [4, 6].includes(this.colorType);
          var o = this.colors + (this.hasAlphaChannel ? 1 : 0);
          switch (this.pixelBitlength = this.bits * o, this.colors) {
            case 1:
              this.colorSpace = "DeviceGray";
              break;
            case 3:
              this.colorSpace = "DeviceRGB";
              break;
          }
          this.imgData = new Uint8Array(this.imgData);
          return;
        default:
          this.pos += l;
      }
      if (this.pos += 4, this.pos > this.data.length)
        throw new Error("Incomplete or corrupt PNG file");
    }
  }
  read(e) {
    const t = new Array(e);
    for (let r = 0; r < e; r++)
      t[r] = this.data[this.pos++];
    return t;
  }
  readUInt32() {
    const e = this.data[this.pos++] << 24, t = this.data[this.pos++] << 16, r = this.data[this.pos++] << 8, s = this.data[this.pos++];
    return e | t | r | s;
  }
  readUInt16() {
    const e = this.data[this.pos++] << 8, t = this.data[this.pos++];
    return e | t;
  }
  decodePixels(e) {
    return c5(new Uint8Array(this.imgData), (t, r) => {
      if (t)
        throw t;
      const { width: s, height: i } = this, a = this.pixelBitlength / 8, o = new Uint8Array(s * i * a), { length: l } = r;
      let f = 0;
      function u(c, x, g, m, v = !1) {
        const E = Math.ceil((s - c) / g), C = Math.ceil((i - x) / m), y = a * E, A = v ? o : new Uint8Array(y * C);
        let k = 0, p = 0;
        for (; k < C && f < l; ) {
          var D, M, I, B, N;
          switch (r[f++]) {
            case 0:
              for (I = 0; I < y; I++)
                A[p++] = r[f++];
              break;
            case 1:
              for (I = 0; I < y; I++)
                D = r[f++], B = I < a ? 0 : A[p - a], A[p++] = (D + B) % 256;
              break;
            case 2:
              for (I = 0; I < y; I++)
                D = r[f++], M = (I - I % a) / a, N = k && A[(k - 1) * y + M * a + I % a], A[p++] = (N + D) % 256;
              break;
            case 3:
              for (I = 0; I < y; I++)
                D = r[f++], M = (I - I % a) / a, B = I < a ? 0 : A[p - a], N = k && A[(k - 1) * y + M * a + I % a], A[p++] = (D + Math.floor((B + N) / 2)) % 256;
              break;
            case 4:
              for (I = 0; I < y; I++) {
                var V, j;
                D = r[f++], M = (I - I % a) / a, B = I < a ? 0 : A[p - a], k === 0 ? N = j = 0 : (N = A[(k - 1) * y + M * a + I % a], j = M && A[(k - 1) * y + (M - 1) * a + I % a]);
                const J = B + N - j, q = Math.abs(J - B), $ = Math.abs(J - N), K = Math.abs(J - j);
                q <= $ && q <= K ? V = B : $ <= K ? V = N : V = j, A[p++] = (D + V) % 256;
              }
              break;
            default:
              throw new Error(`Invalid filter algorithm: ${r[f - 1]}`);
          }
          if (!v) {
            let J = ((x + k * m) * s + c) * a, q = k * y;
            for (I = 0; I < E; I++) {
              for (let $ = 0; $ < a; $++)
                o[J++] = A[q++];
              J += (g - 1) * a;
            }
          }
          k++;
        }
      }
      return this.interlaceMethod === 1 ? (u(0, 0, 8, 8), u(4, 0, 8, 8), u(0, 4, 4, 8), u(2, 0, 4, 4), u(0, 2, 2, 4), u(1, 0, 2, 2), u(0, 1, 1, 2)) : u(0, 0, 1, 1, !0), e(o);
    });
  }
  decodePalette() {
    const { palette: e } = this, { length: t } = e, r = this.transparency.indexed || [], s = new Uint8Array(r.length + t);
    let i = 0, a = 0;
    for (let l = 0; l < t; l += 3) {
      var o;
      s[i++] = e[l], s[i++] = e[l + 1], s[i++] = e[l + 2], s[i++] = (o = r[a++]) != null ? o : 255;
    }
    return s;
  }
  copyToImageData(e, t) {
    let r, s, { colors: i } = this, a = null, o = this.hasAlphaChannel;
    this.palette.length && (a = this._decodedPalette || (this._decodedPalette = this.decodePalette()), i = 4, o = !0);
    const l = e.data || e, { length: f } = l, u = a || t;
    let c = r = 0;
    if (i === 1)
      for (; c < f; ) {
        s = a ? t[c / 4] * 4 : r;
        const x = u[s++];
        l[c++] = x, l[c++] = x, l[c++] = x, l[c++] = o ? u[s++] : 255, r = s;
      }
    else
      for (; c < f; )
        s = a ? t[c / 4] * 4 : r, l[c++] = u[s++], l[c++] = u[s++], l[c++] = u[s++], l[c++] = o ? u[s++] : 255, r = s;
  }
  decode(e) {
    const t = new Uint8Array(this.width * this.height * 4);
    return this.decodePixels((r) => (this.copyToImageData(t, r), e(t)));
  }
}
class Vl {
  constructor() {
    this._listeners = /* @__PURE__ */ Object.create(null);
  }
  on(e, t) {
    return (this._listeners[e] || (this._listeners[e] = [])).push(t), this;
  }
  once(e, t) {
    const r = (...s) => {
      this.off(e, r), t(...s);
    };
    return this.on(e, r);
  }
  off(e, t) {
    const r = this._listeners[e];
    if (r) {
      const s = r.indexOf(t);
      s !== -1 && r.splice(s, 1);
    }
    return this;
  }
  emit(e, ...t) {
    const r = this._listeners[e];
    if (!r) return !1;
    for (const s of r.slice()) s(...t);
    return r.length > 0;
  }
}
class u5 extends Vl {
  constructor() {
    super(), this._buffer = [], this._flowing = !1, this._scheduled = !1, this._finished = !1, this._endEmitted = !1;
  }
  on(e, t) {
    return super.on(e, t), e === "data" && this.resume(), this;
  }
  push(e) {
    return e === null ? this._finished = !0 : this._buffer.push(e), this._schedule(), !0;
  }
  resume() {
    return this._flowing = !0, this._schedule(), this;
  }
  pause() {
    return this._flowing = !1, this;
  }
  pipe(e) {
    return this.on("data", (t) => {
      e.write(t) === !1 && (this.pause(), e.once("drain", () => this.resume()));
    }), this.on("end", () => e.end()), e;
  }
  _schedule() {
    this._scheduled || !this._flowing || (this._scheduled = !0, queueMicrotask(() => {
      this._scheduled = !1, this._drain();
    }));
  }
  _drain() {
    for (; this._flowing && this._buffer.length > 0; )
      this.emit("data", this._buffer.shift());
    this._flowing && this._finished && !this._endEmitted && (this._endEmitted = !0, this.emit("end"));
  }
  async *[Symbol.asyncIterator]() {
    const e = [];
    let t = !1, r = null;
    const s = () => {
      const i = r;
      r = null, i && i();
    };
    for (this.on("data", (i) => {
      e.push(i), s();
    }), this.on("end", () => {
      t = !0, s();
    }); ; ) {
      for (; e.length > 0; ) yield e.shift();
      if (t) return;
      await new Promise((i) => {
        r = i;
      });
    }
  }
}
class _l {
  toString() {
    throw new Error("Must be implemented by subclasses");
  }
}
class Wi {
  constructor(e = {}) {
    this._items = {}, this.limits = typeof e.limits == "boolean" ? e.limits : !0;
  }
  add(e, t) {
    return this._items[e] = t;
  }
  get(e) {
    return this._items[e];
  }
  toString(e = null) {
    const t = Object.keys(this._items).sort((s, i) => this._compareKeys(s, i)), r = ["<<"];
    if (this.limits && t.length > 1) {
      const s = t[0], i = t[t.length - 1];
      r.push(`  /Limits ${o0.convert([this._dataForKey(s), this._dataForKey(i)], e)}`);
    }
    r.push(`  /${this._keysName()} [`);
    for (let s of t)
      r.push(`    ${o0.convert(this._dataForKey(s), e)} ${o0.convert(this._items[s], e)}`);
    return r.push("]"), r.push(">>"), r.join(`
`);
  }
  _compareKeys() {
    throw new Error("Must be implemented by subclasses");
  }
  _keysName() {
    throw new Error("Must be implemented by subclasses");
  }
  _dataForKey() {
    throw new Error("Must be implemented by subclasses");
  }
}
class gn {
  constructor(e, t, r, s, i, a) {
    this.id = "CS" + Object.keys(e.spotColors).length, this.name = t, this.values = [r, s, i, a], this.ref = e.ref(["Separation", xi(this.name), "DeviceCMYK", {
      Range: [0, 1, 0, 1, 0, 1, 0, 1],
      C0: [0, 0, 0, 0],
      C1: this.values.map((o) => o / 100),
      FunctionType: 2,
      Domain: [0, 1],
      N: 1
    }]), this.ref.end();
  }
  toString() {
    return `${this.ref.id} 0 R`;
  }
}
const zn = (n) => {
  let t = "";
  for (let r = 0; r < n.length; r += 32768) {
    const s = Math.min(r + 32768, n.length);
    t += String.fromCharCode.apply(null, n.subarray(r, s));
  }
  return t;
}, Gn = (n) => {
  const e = new Uint8Array(n.length);
  for (let t = 0; t < n.length; t++)
    e[t] = n.charCodeAt(t) & 255;
  return e;
}, Vi = (n) => {
  const e = atob(n), t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++)
    t[r] = e.charCodeAt(r);
  return t;
}, h5 = (n) => {
  let e = 0;
  for (const s of n) e += s.length;
  const t = new Uint8Array(e);
  let r = 0;
  for (const s of n)
    t.set(s, r), r += s.length;
  return t;
}, d5 = (n) => {
  const e = new Uint8Array((n.length + 1) * 2);
  e[0] = 254, e[1] = 255;
  for (let t = 0; t < n.length; t++) {
    const r = n.charCodeAt(t);
    e[t * 2 + 2] = r >> 8, e[t * 2 + 3] = r & 255;
  }
  return e;
}, at = (n, e = 0) => (n[e] << 8 | n[e + 1]) >>> 0, x5 = (n, e = 0) => (n[e + 1] << 8 | n[e]) >>> 0, b5 = (n, e = 0) => n[e] * 16777216 + (n[e + 1] << 16 | n[e + 2] << 8 | n[e + 3]) >>> 0, p5 = (n, e = 0) => (n[e] | n[e + 1] << 8 | n[e + 2] << 16) + n[e + 3] * 16777216 >>> 0, Ht = (n, e) => (Array(e + 1).join("0") + n).slice(-e), g5 = (n) => n > 127 ? !0 : n > 32 && n !== 127 && n !== 35 && n !== 37 && n !== 40 && n !== 41 && n !== 47 && n !== 60 && n !== 62 && n !== 91 && n !== 93 && n !== 123 && n !== 125, O1 = /[\n\r\t\b\f()\\]/g, D1 = {
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\b": "\\b",
  "\f": "\\f",
  "\\": "\\\\",
  "(": "\\(",
  ")": "\\)"
}, xi = function(n) {
  let e = "";
  for (const t of n) {
    const r = t.charCodeAt(0);
    g5(r) ? e += t : e += `#${r.toString(16).toUpperCase().padStart(2, "0")}`;
  }
  return e;
};
class o0 {
  static convert(e, t = null) {
    if (typeof e == "string")
      return `/${e}`;
    if (e instanceof String) {
      let r = e, s = !1;
      for (let a = 0, o = r.length; a < o; a++)
        if (r.charCodeAt(a) > 127) {
          s = !0;
          break;
        }
      let i;
      return s ? i = d5(r.valueOf()) : i = Gn(r.valueOf()), t && (i = t(i)), r = zn(i), r = r.replace(O1, (a) => D1[a]), `(${r})`;
    } else {
      if (e instanceof Uint8Array)
        return `<${bo(e)}>`;
      if (e instanceof Wi)
        return e.toString(t);
      if (e instanceof _l || e instanceof gn)
        return e.toString();
      if (e instanceof Date) {
        let r = `D:${Ht(e.getUTCFullYear(), 4)}` + Ht(e.getUTCMonth() + 1, 2) + Ht(e.getUTCDate(), 2) + Ht(e.getUTCHours(), 2) + Ht(e.getUTCMinutes(), 2) + Ht(e.getUTCSeconds(), 2) + "Z";
        return t && (r = zn(t(Gn(r))), r = r.replace(O1, (s) => D1[s])), `(${r})`;
      } else if (Array.isArray(e)) {
        const r = [];
        for (let s = 0; s < e.length; s++) {
          const i = e[s];
          r.push(o0.convert(i === void 0 ? null : i, t));
        }
        return `[${r.join(" ")}]`;
      } else if ({}.toString.call(e) === "[object Object]") {
        const r = ["<<"];
        for (let s in e) {
          const i = e[s];
          i !== void 0 && r.push(`/${s} ${o0.convert(i, t)}`);
        }
        return r.push(">>"), r.join(`
`);
      } else return typeof e == "number" ? o0.number(e) : `${e}`;
    }
  }
  static number(e) {
    if (e > -1e21 && e < 1e21)
      return Math.round(e * 1e6) / 1e6;
    throw new Error(`unsupported number: ${e}`);
  }
}
var $t = {
  deflateSync: (n) => Bc(n)
};
class m5 extends _l {
  constructor(e, t, r = {}) {
    super(), this.document = e, this.id = t, this.data = r, this.gen = 0, this.compress = this.document.compress && !this.data.Filter, this.uncompressedLength = 0, this.buffer = [];
  }
  write(e) {
    e instanceof Uint8Array || (e = Gn(e + `
`)), this.uncompressedLength += e.length, this.data.Length == null && (this.data.Length = 0), this.buffer.push(e), this.data.Length += e.length, this.compress && (this.data.Filter = "FlateDecode");
  }
  end(e) {
    e && this.write(e), this.finalize();
  }
  finalize() {
    this.offset = this.document._offset;
    const e = this.document._security ? this.document._security.getEncryptFn(this.id, this.gen) : null;
    this.buffer.length && (this.buffer = h5(this.buffer), this.compress && (this.buffer = $t.deflateSync(this.buffer)), e && (this.buffer = e(this.buffer)), this.data.Length = this.buffer.length), this.document._write(`${this.id} ${this.gen} obj`), this.document._write(o0.convert(this.data, e)), this.buffer.length && (this.document._write("stream"), this.document._write(this.buffer), this.buffer = [], this.document._write(`
endstream`)), this.document._write("endobj"), this.document._refEnd(this);
  }
  toString() {
    return `${this.id} ${this.gen} R`;
  }
}
const bi = new Float32Array(1), M1 = new Uint32Array(bi.buffer);
function mr(n) {
  const e = Math.fround(n);
  return e <= n ? e : (bi[0] = n, n <= 0 ? M1[0] += 1 : M1[0] -= 1, bi[0]);
}
function Ke(n, e = void 0, t = (r) => r) {
  return (n == null || typeof n == "object" && Object.keys(n).length === 0) && (n = e), n == null || typeof n != "object" ? n = {
    top: n,
    right: n,
    bottom: n,
    left: n
  } : Array.isArray(n) && (n.length === 2 ? n = {
    vertical: n[0],
    horizontal: n[1]
  } : n = {
    top: n[0],
    right: n[1],
    bottom: n[2],
    left: n[3]
  }), ("vertical" in n || "horizontal" in n) && (n = {
    top: n.vertical,
    right: n.horizontal,
    bottom: n.vertical,
    left: n.horizontal
  }), {
    top: t(n.top),
    right: t(n.right),
    bottom: t(n.bottom),
    left: t(n.left)
  };
}
const A5 = 1 / 10, L1 = 1 / 2.54, w5 = 1 / 96, tn = 72, v5 = 12;
function ql(n) {
  return n === 0 ? 1 : n === 90 ? 0 : n === 180 ? -1 : n === 270 ? 0 : Math.cos(n * Math.PI / 180);
}
function $l(n) {
  return n === 0 ? 0 : n === 90 ? 1 : n === 180 ? 0 : n === 270 ? -1 : Math.sin(n * Math.PI / 180);
}
const y5 = {
  top: 72,
  left: 72,
  bottom: 72,
  right: 72
}, C5 = {
  "4A0": [4767.87, 6740.79],
  "2A0": [3370.39, 4767.87],
  A0: [2383.94, 3370.39],
  A1: [1683.78, 2383.94],
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  A6: [297.64, 419.53],
  A7: [209.76, 297.64],
  A8: [147.4, 209.76],
  A9: [104.88, 147.4],
  A10: [73.7, 104.88],
  B0: [2834.65, 4008.19],
  B1: [2004.09, 2834.65],
  B2: [1417.32, 2004.09],
  B3: [1000.63, 1417.32],
  B4: [708.66, 1000.63],
  B5: [498.9, 708.66],
  B6: [354.33, 498.9],
  B7: [249.45, 354.33],
  B8: [175.75, 249.45],
  B9: [124.72, 175.75],
  B10: [87.87, 124.72],
  C0: [2599.37, 3676.54],
  C1: [1836.85, 2599.37],
  C2: [1298.27, 1836.85],
  C3: [918.43, 1298.27],
  C4: [649.13, 918.43],
  C5: [459.21, 649.13],
  C6: [323.15, 459.21],
  C7: [229.61, 323.15],
  C8: [161.57, 229.61],
  C9: [113.39, 161.57],
  C10: [79.37, 113.39],
  RA0: [2437.8, 3458.27],
  RA1: [1729.13, 2437.8],
  RA2: [1218.9, 1729.13],
  RA3: [864.57, 1218.9],
  RA4: [609.45, 864.57],
  SRA0: [2551.18, 3628.35],
  SRA1: [1814.17, 2551.18],
  SRA2: [1275.59, 1814.17],
  SRA3: [907.09, 1275.59],
  SRA4: [637.8, 907.09],
  EXECUTIVE: [521.86, 756],
  FOLIO: [612, 936],
  LEGAL: [612, 1008],
  LETTER: [612, 792],
  TABLOID: [792, 1224]
};
class S5 {
  constructor(e, t) {
    this.document = e, this._options = t, this.size = t.size || "letter", this.layout = t.layout || "portrait", this.userUnit = t.userUnit || 1;
    const r = Array.isArray(this.size) ? this.size : C5[this.size.toUpperCase()];
    this.width = r[this.layout === "portrait" ? 0 : 1], this.height = r[this.layout === "portrait" ? 1 : 0], this.content = this.document.ref(), this.margins = Ke(t.margin ?? t.margins, y5, (s) => e.sizeToPoint(s, 0, this)), this.resources = this.document.ref({
      ProcSet: ["PDF", "Text", "ImageB", "ImageC", "ImageI"]
    }), this.dictionary = this.document.ref({
      Type: "Page",
      Parent: this.document._root.data.Pages,
      MediaBox: [0, 0, this.width, this.height],
      Contents: this.content,
      Resources: this.resources,
      UserUnit: this.userUnit
    }), this.markings = [];
  }
  get fonts() {
    const e = this.resources.data;
    return e.Font != null ? e.Font : e.Font = {};
  }
  get xobjects() {
    const e = this.resources.data;
    return e.XObject != null ? e.XObject : e.XObject = {};
  }
  get ext_gstates() {
    const e = this.resources.data;
    return e.ExtGState != null ? e.ExtGState : e.ExtGState = {};
  }
  get patterns() {
    const e = this.resources.data;
    return e.Pattern != null ? e.Pattern : e.Pattern = {};
  }
  get colorSpaces() {
    const e = this.resources.data;
    return e.ColorSpace || (e.ColorSpace = {});
  }
  get annotations() {
    const e = this.dictionary.data;
    return e.Annots != null ? e.Annots : e.Annots = [];
  }
  get structParentTreeKey() {
    const e = this.dictionary.data;
    return e.StructParents != null ? e.StructParents : e.StructParents = this.document.createStructParentTreeNextKey();
  }
  get contentWidth() {
    return this.width - this.margins.left - this.margins.right;
  }
  get contentHeight() {
    return this.height - this.margins.top - this.margins.bottom;
  }
  maxY() {
    return this.height - this.margins.bottom;
  }
  write(e) {
    return this.content.write(e);
  }
  _setTabOrder() {
    !this.dictionary.Tabs && this.document.hasMarkInfoDictionary() && (this.dictionary.data.Tabs = "S");
  }
  end() {
    this._setTabOrder(), this.dictionary.end(), this.resources.data.ColorSpace = this.resources.data.ColorSpace || {};
    for (let e of Object.values(this.document.spotColors))
      this.resources.data.ColorSpace[e.id] = e;
    return this.resources.end(), this.content.end();
  }
}
class Hs extends Wi {
  _compareKeys(e, t) {
    return e.localeCompare(t);
  }
  _keysName() {
    return "Names";
  }
  _dataForKey(e) {
    return new String(e);
  }
}
function k5(n) {
  return n instanceof Uint8Array || ArrayBuffer.isView(n) && n.constructor.name === "Uint8Array";
}
function _i(n, ...e) {
  if (!k5(n)) throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + n.length);
}
function R1(n, e = !0) {
  if (n.destroyed) throw new Error("Hash instance has been destroyed");
  if (e && n.finished) throw new Error("Hash#digest() has already been called");
}
function P5(n, e) {
  _i(n);
  const t = e.outputLen;
  if (n.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
function w0(...n) {
  for (let e = 0; e < n.length; e++)
    n[e].fill(0);
}
function Ws(n) {
  return new DataView(n.buffer, n.byteOffset, n.byteLength);
}
function S0(n, e) {
  return n << 32 - e | n >>> e;
}
function ct(n, e) {
  return n << e | n >>> 32 - e >>> 0;
}
new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function";
Array.from({
  length: 256
}, (n, e) => e.toString(16).padStart(2, "0"));
function T5(n) {
  if (typeof n != "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(n));
}
function Xl(n) {
  return typeof n == "string" && (n = T5(n)), _i(n), n;
}
class I5 {
}
function X0(n) {
  const e = (r) => n().update(Xl(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function E5(n, e, t, r) {
  if (typeof n.setBigUint64 == "function") return n.setBigUint64(e, t, r);
  const s = BigInt(32), i = BigInt(4294967295), a = Number(t >> s & i), o = Number(t & i), l = r ? 4 : 0, f = r ? 0 : 4;
  n.setUint32(e + l, a, r), n.setUint32(e + f, o, r);
}
function Hn(n, e, t) {
  return n & e ^ ~n & t;
}
function jl(n, e, t) {
  return n & e ^ n & t ^ e & t;
}
class Hr extends I5 {
  constructor(e, t, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Ws(this.buffer);
  }
  update(e) {
    R1(this), e = Xl(e), _i(e);
    const {
      view: t,
      buffer: r,
      blockLen: s
    } = this, i = e.length;
    for (let a = 0; a < i; ) {
      const o = Math.min(s - this.pos, i - a);
      if (o === s) {
        const l = Ws(e);
        for (; s <= i - a; a += s) this.process(l, a);
        continue;
      }
      r.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === s && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    R1(this), P5(e, this), this.finished = !0;
    const {
      buffer: t,
      view: r,
      blockLen: s,
      isLE: i
    } = this;
    let {
      pos: a
    } = this;
    t[a++] = 128, w0(this.buffer.subarray(a)), this.padOffset > s - a && (this.process(r, 0), a = 0);
    for (let c = a; c < s; c++) t[c] = 0;
    E5(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const o = Ws(e), l = this.outputLen;
    if (l % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = l / 4, u = this.get();
    if (f > u.length) throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < f; c++) o.setUint32(4 * c, u[c], i);
  }
  digest() {
    const {
      buffer: e,
      outputLen: t
    } = this;
    this.digestInto(e);
    const r = e.slice(0, t);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const {
      blockLen: t,
      buffer: r,
      length: s,
      finished: i,
      destroyed: a,
      pos: o
    } = this;
    return e.destroyed = a, e.finished = i, e.length = s, e.pos = o, s % t && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const et = Uint32Array.from([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), tt = Uint32Array.from([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]), $e = Uint32Array.from([3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428]), Xe = Uint32Array.from([1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209]), Xt = Uint32Array.from([1732584193, 4023233417, 2562383102, 271733878, 3285377520]), rt = new Uint32Array(80);
class F5 extends Hr {
  constructor() {
    super(64, 20, 8, !1), this.A = Xt[0] | 0, this.B = Xt[1] | 0, this.C = Xt[2] | 0, this.D = Xt[3] | 0, this.E = Xt[4] | 0;
  }
  get() {
    const {
      A: e,
      B: t,
      C: r,
      D: s,
      E: i
    } = this;
    return [e, t, r, s, i];
  }
  set(e, t, r, s, i) {
    this.A = e | 0, this.B = t | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0;
  }
  process(e, t) {
    for (let l = 0; l < 16; l++, t += 4) rt[l] = e.getUint32(t, !1);
    for (let l = 16; l < 80; l++) rt[l] = ct(rt[l - 3] ^ rt[l - 8] ^ rt[l - 14] ^ rt[l - 16], 1);
    let {
      A: r,
      B: s,
      C: i,
      D: a,
      E: o
    } = this;
    for (let l = 0; l < 80; l++) {
      let f, u;
      l < 20 ? (f = Hn(s, i, a), u = 1518500249) : l < 40 ? (f = s ^ i ^ a, u = 1859775393) : l < 60 ? (f = jl(s, i, a), u = 2400959708) : (f = s ^ i ^ a, u = 3395469782);
      const c = ct(r, 5) + f + o + u + rt[l] | 0;
      o = a, a = i, i = ct(s, 30), s = r, r = c;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, this.set(r, s, i, a, o);
  }
  roundClean() {
    w0(rt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0), w0(this.buffer);
  }
}
X0(() => new F5());
const B5 = Math.pow(2, 32), O5 = Array.from({
  length: 64
}, (n, e) => Math.floor(B5 * Math.abs(Math.sin(e + 1)))), rn = Xt.slice(0, 4), Vs = new Uint32Array(16);
class D5 extends Hr {
  constructor() {
    super(64, 16, 8, !0), this.A = rn[0] | 0, this.B = rn[1] | 0, this.C = rn[2] | 0, this.D = rn[3] | 0;
  }
  get() {
    const {
      A: e,
      B: t,
      C: r,
      D: s
    } = this;
    return [e, t, r, s];
  }
  set(e, t, r, s) {
    this.A = e | 0, this.B = t | 0, this.C = r | 0, this.D = s | 0;
  }
  process(e, t) {
    for (let o = 0; o < 16; o++, t += 4) Vs[o] = e.getUint32(t, !0);
    let {
      A: r,
      B: s,
      C: i,
      D: a
    } = this;
    for (let o = 0; o < 64; o++) {
      let l, f, u;
      o < 16 ? (l = Hn(s, i, a), f = o, u = [7, 12, 17, 22]) : o < 32 ? (l = Hn(a, s, i), f = (5 * o + 1) % 16, u = [5, 9, 14, 20]) : o < 48 ? (l = s ^ i ^ a, f = (3 * o + 5) % 16, u = [4, 11, 16, 23]) : (l = i ^ (s | ~a), f = 7 * o % 16, u = [6, 10, 15, 21]), l = l + r + O5[o] + Vs[f], r = a, a = i, i = s, s = s + ct(l, u[o % 4]);
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, this.set(r, s, i, a);
  }
  roundClean() {
    w0(Vs);
  }
  destroy() {
    this.set(0, 0, 0, 0), w0(this.buffer);
  }
}
const M5 = X0(() => new D5()), L5 = Uint8Array.from([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yl = Uint8Array.from(new Array(16).fill(0).map((n, e) => e)), R5 = Yl.map((n) => (9 * n + 5) % 16), Kl = (() => {
  const t = [[Yl], [R5]];
  for (let r = 0; r < 4; r++) for (let s of t) s.push(s[r].map((i) => L5[i]));
  return t;
})(), Zl = Kl[0], Jl = Kl[1], Ql = [[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map((n) => Uint8Array.from(n)), U5 = Zl.map((n, e) => n.map((t) => Ql[e][t])), N5 = Jl.map((n, e) => n.map((t) => Ql[e][t])), z5 = Uint32Array.from([0, 1518500249, 1859775393, 2400959708, 2840853838]), G5 = Uint32Array.from([1352829926, 1548603684, 1836072691, 2053994217, 0]);
function U1(n, e, t, r) {
  return n === 0 ? e ^ t ^ r : n === 1 ? e & t | ~e & r : n === 2 ? (e | ~t) ^ r : n === 3 ? e & r | t & ~r : e ^ (t | ~r);
}
const nn = new Uint32Array(16);
class H5 extends Hr {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const {
      h0: e,
      h1: t,
      h2: r,
      h3: s,
      h4: i
    } = this;
    return [e, t, r, s, i];
  }
  set(e, t, r, s, i) {
    this.h0 = e | 0, this.h1 = t | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, t) {
    for (let g = 0; g < 16; g++, t += 4) nn[g] = e.getUint32(t, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, a = i, o = this.h2 | 0, l = o, f = this.h3 | 0, u = f, c = this.h4 | 0, x = c;
    for (let g = 0; g < 5; g++) {
      const m = 4 - g, v = z5[g], E = G5[g], C = Zl[g], y = Jl[g], A = U5[g], k = N5[g];
      for (let p = 0; p < 16; p++) {
        const D = ct(r + U1(g, i, o, f) + nn[C[p]] + v, A[p]) + c | 0;
        r = c, c = f, f = ct(o, 10) | 0, o = i, i = D;
      }
      for (let p = 0; p < 16; p++) {
        const D = ct(s + U1(m, a, l, u) + nn[y[p]] + E, k[p]) + x | 0;
        s = x, x = u, u = ct(l, 10) | 0, l = a, a = D;
      }
    }
    this.set(this.h1 + o + u | 0, this.h2 + f + x | 0, this.h3 + c + s | 0, this.h4 + r + a | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    w0(nn);
  }
  destroy() {
    this.destroyed = !0, w0(this.buffer), this.set(0, 0, 0, 0, 0);
  }
}
X0(() => new H5());
function Ft(n) {
  return M5.create().update(n).digest();
}
function W5(n) {
  return bo(Ft(n));
}
const sn = BigInt(2 ** 32 - 1), N1 = BigInt(32);
function V5(n, e = !1) {
  return e ? {
    h: Number(n & sn),
    l: Number(n >> N1 & sn)
  } : {
    h: Number(n >> N1 & sn) | 0,
    l: Number(n & sn) | 0
  };
}
function _5(n, e = !1) {
  const t = n.length;
  let r = new Uint32Array(t), s = new Uint32Array(t);
  for (let i = 0; i < t; i++) {
    const {
      h: a,
      l: o
    } = V5(n[i], e);
    [r[i], s[i]] = [a, o];
  }
  return [r, s];
}
const z1 = (n, e, t) => n >>> t, G1 = (n, e, t) => n << 32 - t | e >>> t, Wt = (n, e, t) => n >>> t | e << 32 - t, Vt = (n, e, t) => n << 32 - t | e >>> t, an = (n, e, t) => n << 64 - t | e >>> t - 32, on = (n, e, t) => n >>> t - 32 | e << 64 - t;
function z0(n, e, t, r) {
  const s = (e >>> 0) + (r >>> 0);
  return {
    h: n + t + (s / 2 ** 32 | 0) | 0,
    l: s | 0
  };
}
const q5 = (n, e, t) => (n >>> 0) + (e >>> 0) + (t >>> 0), $5 = (n, e, t, r) => e + t + r + (n / 2 ** 32 | 0) | 0, X5 = (n, e, t, r) => (n >>> 0) + (e >>> 0) + (t >>> 0) + (r >>> 0), j5 = (n, e, t, r, s) => e + t + r + s + (n / 2 ** 32 | 0) | 0, Y5 = (n, e, t, r, s) => (n >>> 0) + (e >>> 0) + (t >>> 0) + (r >>> 0) + (s >>> 0), K5 = (n, e, t, r, s, i) => e + t + r + s + i + (n / 2 ** 32 | 0) | 0, Z5 = Uint32Array.from([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), nt = new Uint32Array(64);
class ec extends Hr {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = et[0] | 0, this.B = et[1] | 0, this.C = et[2] | 0, this.D = et[3] | 0, this.E = et[4] | 0, this.F = et[5] | 0, this.G = et[6] | 0, this.H = et[7] | 0;
  }
  get() {
    const {
      A: e,
      B: t,
      C: r,
      D: s,
      E: i,
      F: a,
      G: o,
      H: l
    } = this;
    return [e, t, r, s, i, a, o, l];
  }
  set(e, t, r, s, i, a, o, l) {
    this.A = e | 0, this.B = t | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = a | 0, this.G = o | 0, this.H = l | 0;
  }
  process(e, t) {
    for (let c = 0; c < 16; c++, t += 4) nt[c] = e.getUint32(t, !1);
    for (let c = 16; c < 64; c++) {
      const x = nt[c - 15], g = nt[c - 2], m = S0(x, 7) ^ S0(x, 18) ^ x >>> 3, v = S0(g, 17) ^ S0(g, 19) ^ g >>> 10;
      nt[c] = v + nt[c - 7] + m + nt[c - 16] | 0;
    }
    let {
      A: r,
      B: s,
      C: i,
      D: a,
      E: o,
      F: l,
      G: f,
      H: u
    } = this;
    for (let c = 0; c < 64; c++) {
      const x = S0(o, 6) ^ S0(o, 11) ^ S0(o, 25), g = u + x + Hn(o, l, f) + Z5[c] + nt[c] | 0, v = (S0(r, 2) ^ S0(r, 13) ^ S0(r, 22)) + jl(r, s, i) | 0;
      u = f, f = l, l = o, o = a + g | 0, a = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, l = l + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, a, o, l, f, u);
  }
  roundClean() {
    w0(nt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), w0(this.buffer);
  }
}
class J5 extends ec {
  constructor() {
    super(28), this.A = tt[0] | 0, this.B = tt[1] | 0, this.C = tt[2] | 0, this.D = tt[3] | 0, this.E = tt[4] | 0, this.F = tt[5] | 0, this.G = tt[6] | 0, this.H = tt[7] | 0;
  }
}
const tc = _5(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((n) => BigInt(n))), Q5 = tc[0], e6 = tc[1], st = new Uint32Array(80), it = new Uint32Array(80);
class ts extends Hr {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = Xe[0] | 0, this.Al = Xe[1] | 0, this.Bh = Xe[2] | 0, this.Bl = Xe[3] | 0, this.Ch = Xe[4] | 0, this.Cl = Xe[5] | 0, this.Dh = Xe[6] | 0, this.Dl = Xe[7] | 0, this.Eh = Xe[8] | 0, this.El = Xe[9] | 0, this.Fh = Xe[10] | 0, this.Fl = Xe[11] | 0, this.Gh = Xe[12] | 0, this.Gl = Xe[13] | 0, this.Hh = Xe[14] | 0, this.Hl = Xe[15] | 0;
  }
  get() {
    const {
      Ah: e,
      Al: t,
      Bh: r,
      Bl: s,
      Ch: i,
      Cl: a,
      Dh: o,
      Dl: l,
      Eh: f,
      El: u,
      Fh: c,
      Fl: x,
      Gh: g,
      Gl: m,
      Hh: v,
      Hl: E
    } = this;
    return [e, t, r, s, i, a, o, l, f, u, c, x, g, m, v, E];
  }
  set(e, t, r, s, i, a, o, l, f, u, c, x, g, m, v, E) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = a | 0, this.Dh = o | 0, this.Dl = l | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = c | 0, this.Fl = x | 0, this.Gh = g | 0, this.Gl = m | 0, this.Hh = v | 0, this.Hl = E | 0;
  }
  process(e, t) {
    for (let A = 0; A < 16; A++, t += 4)
      st[A] = e.getUint32(t), it[A] = e.getUint32(t += 4);
    for (let A = 16; A < 80; A++) {
      const k = st[A - 15] | 0, p = it[A - 15] | 0, D = Wt(k, p, 1) ^ Wt(k, p, 8) ^ z1(k, p, 7), M = Vt(k, p, 1) ^ Vt(k, p, 8) ^ G1(k, p, 7), I = st[A - 2] | 0, B = it[A - 2] | 0, N = Wt(I, B, 19) ^ an(I, B, 61) ^ z1(I, B, 6), V = Vt(I, B, 19) ^ on(I, B, 61) ^ G1(I, B, 6), j = X5(M, V, it[A - 7], it[A - 16]), J = j5(j, D, N, st[A - 7], st[A - 16]);
      st[A] = J | 0, it[A] = j | 0;
    }
    let {
      Ah: r,
      Al: s,
      Bh: i,
      Bl: a,
      Ch: o,
      Cl: l,
      Dh: f,
      Dl: u,
      Eh: c,
      El: x,
      Fh: g,
      Fl: m,
      Gh: v,
      Gl: E,
      Hh: C,
      Hl: y
    } = this;
    for (let A = 0; A < 80; A++) {
      const k = Wt(c, x, 14) ^ Wt(c, x, 18) ^ an(c, x, 41), p = Vt(c, x, 14) ^ Vt(c, x, 18) ^ on(c, x, 41), D = c & g ^ ~c & v, M = x & m ^ ~x & E, I = Y5(y, p, M, e6[A], it[A]), B = K5(I, C, k, D, Q5[A], st[A]), N = I | 0, V = Wt(r, s, 28) ^ an(r, s, 34) ^ an(r, s, 39), j = Vt(r, s, 28) ^ on(r, s, 34) ^ on(r, s, 39), J = r & i ^ r & o ^ i & o, q = s & a ^ s & l ^ a & l;
      C = v | 0, y = E | 0, v = g | 0, E = m | 0, g = c | 0, m = x | 0, {
        h: c,
        l: x
      } = z0(f | 0, u | 0, B | 0, N | 0), f = o | 0, u = l | 0, o = i | 0, l = a | 0, i = r | 0, a = s | 0;
      const $ = q5(N, j, q);
      r = $5($, B, V, J), s = $ | 0;
    }
    ({
      h: r,
      l: s
    } = z0(this.Ah | 0, this.Al | 0, r | 0, s | 0)), {
      h: i,
      l: a
    } = z0(this.Bh | 0, this.Bl | 0, i | 0, a | 0), {
      h: o,
      l
    } = z0(this.Ch | 0, this.Cl | 0, o | 0, l | 0), {
      h: f,
      l: u
    } = z0(this.Dh | 0, this.Dl | 0, f | 0, u | 0), {
      h: c,
      l: x
    } = z0(this.Eh | 0, this.El | 0, c | 0, x | 0), {
      h: g,
      l: m
    } = z0(this.Fh | 0, this.Fl | 0, g | 0, m | 0), {
      h: v,
      l: E
    } = z0(this.Gh | 0, this.Gl | 0, v | 0, E | 0), {
      h: C,
      l: y
    } = z0(this.Hh | 0, this.Hl | 0, C | 0, y | 0), this.set(r, s, i, a, o, l, f, u, c, x, g, m, v, E, C, y);
  }
  roundClean() {
    w0(st, it);
  }
  destroy() {
    w0(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class t6 extends ts {
  constructor() {
    super(48), this.Ah = $e[0] | 0, this.Al = $e[1] | 0, this.Bh = $e[2] | 0, this.Bl = $e[3] | 0, this.Ch = $e[4] | 0, this.Cl = $e[5] | 0, this.Dh = $e[6] | 0, this.Dl = $e[7] | 0, this.Eh = $e[8] | 0, this.El = $e[9] | 0, this.Fh = $e[10] | 0, this.Fl = $e[11] | 0, this.Gh = $e[12] | 0, this.Gl = $e[13] | 0, this.Hh = $e[14] | 0, this.Hl = $e[15] | 0;
  }
}
const je = Uint32Array.from([2352822216, 424955298, 1944164710, 2312950998, 502970286, 855612546, 1738396948, 1479516111, 258812777, 2077511080, 2011393907, 79989058, 1067287976, 1780299464, 286451373, 2446758561]), Ye = Uint32Array.from([573645204, 4230739756, 2673172387, 3360449730, 596883563, 1867755857, 2520282905, 1497426621, 2519219938, 2827943907, 3193839141, 1401305490, 721525244, 746961066, 246885852, 2177182882]);
class r6 extends ts {
  constructor() {
    super(28), this.Ah = je[0] | 0, this.Al = je[1] | 0, this.Bh = je[2] | 0, this.Bl = je[3] | 0, this.Ch = je[4] | 0, this.Cl = je[5] | 0, this.Dh = je[6] | 0, this.Dl = je[7] | 0, this.Eh = je[8] | 0, this.El = je[9] | 0, this.Fh = je[10] | 0, this.Fl = je[11] | 0, this.Gh = je[12] | 0, this.Gl = je[13] | 0, this.Hh = je[14] | 0, this.Hl = je[15] | 0;
  }
}
class n6 extends ts {
  constructor() {
    super(32), this.Ah = Ye[0] | 0, this.Al = Ye[1] | 0, this.Bh = Ye[2] | 0, this.Bl = Ye[3] | 0, this.Ch = Ye[4] | 0, this.Cl = Ye[5] | 0, this.Dh = Ye[6] | 0, this.Dl = Ye[7] | 0, this.Eh = Ye[8] | 0, this.El = Ye[9] | 0, this.Fh = Ye[10] | 0, this.Fl = Ye[11] | 0, this.Gh = Ye[12] | 0, this.Gl = Ye[13] | 0, this.Hh = Ye[14] | 0, this.Hl = Ye[15] | 0;
  }
}
const s6 = X0(() => new ec());
X0(() => new J5());
X0(() => new ts());
X0(() => new t6());
X0(() => new n6());
X0(() => new r6());
function rs(n) {
  return s6(n);
}
function qi(n, e, t, r = !0) {
  return Vc(e, t, {
    disablePadding: !r
  }).encrypt(n);
}
function i6(n, e) {
  return Wc(e, {
    disablePadding: !0
  }).encrypt(n);
}
function ns(n, e) {
  const t = new Uint8Array(256);
  for (let i = 0; i < 256; i++)
    t[i] = i;
  let r = 0;
  for (let i = 0; i < 256; i++)
    r = r + t[i] + e[i % e.length] & 255, [t[i], t[r]] = [t[r], t[i]];
  const s = new Uint8Array(n.length);
  for (let i = 0, a = 0, o = 0; o < n.length; o++)
    i = i + 1 & 255, a = a + t[i] & 255, [t[i], t[a]] = [t[a], t[i]], s[o] = n[o] ^ t[t[i] + t[a] & 255];
  return s;
}
function a6(n) {
  const e = new Uint8Array(n);
  return globalThis.crypto.getRandomValues(e), e;
}
function q0(n, e) {
  if (n < e[0]) return !1;
  let t = 0, r = e.length / 2;
  for (; t <= r; ) {
    const s = Math.floor((t + r) / 2), i = s * 2;
    if (n >= e[i] && n <= e[i + 1])
      return !0;
    n > e[i + 1] ? t = s + 1 : r = s - 1;
  }
  return !1;
}
const o6 = [545, 545, 564, 591, 686, 687, 751, 767, 848, 863, 880, 883, 886, 889, 891, 893, 895, 899, 907, 907, 909, 909, 930, 930, 975, 975, 1015, 1023, 1159, 1159, 1231, 1231, 1270, 1271, 1274, 1279, 1296, 1328, 1367, 1368, 1376, 1376, 1416, 1416, 1419, 1424, 1442, 1442, 1466, 1466, 1477, 1487, 1515, 1519, 1525, 1547, 1549, 1562, 1564, 1566, 1568, 1568, 1595, 1599, 1622, 1631, 1774, 1775, 1791, 1791, 1806, 1806, 1837, 1839, 1867, 1919, 1970, 2304, 2308, 2308, 2362, 2363, 2382, 2383, 2389, 2391, 2417, 2432, 2436, 2436, 2445, 2446, 2449, 2450, 2473, 2473, 2481, 2481, 2483, 2485, 2490, 2491, 2493, 2493, 2501, 2502, 2505, 2506, 2510, 2518, 2520, 2523, 2526, 2526, 2532, 2533, 2555, 2561, 2563, 2564, 2571, 2574, 2577, 2578, 2601, 2601, 2609, 2609, 2612, 2612, 2615, 2615, 2618, 2619, 2621, 2621, 2627, 2630, 2633, 2634, 2638, 2648, 2653, 2653, 2655, 2661, 2677, 2688, 2692, 2692, 2700, 2700, 2702, 2702, 2706, 2706, 2729, 2729, 2737, 2737, 2740, 2740, 2746, 2747, 2758, 2758, 2762, 2762, 2766, 2767, 2769, 2783, 2785, 2789, 2800, 2816, 2820, 2820, 2829, 2830, 2833, 2834, 2857, 2857, 2865, 2865, 2868, 2869, 2874, 2875, 2884, 2886, 2889, 2890, 2894, 2901, 2904, 2907, 2910, 2910, 2914, 2917, 2929, 2945, 2948, 2948, 2955, 2957, 2961, 2961, 2966, 2968, 2971, 2971, 2973, 2973, 2976, 2978, 2981, 2983, 2987, 2989, 2998, 2998, 3002, 3005, 3011, 3013, 3017, 3017, 3022, 3030, 3032, 3046, 3059, 3072, 3076, 3076, 3085, 3085, 3089, 3089, 3113, 3113, 3124, 3124, 3130, 3133, 3141, 3141, 3145, 3145, 3150, 3156, 3159, 3167, 3170, 3173, 3184, 3201, 3204, 3204, 3213, 3213, 3217, 3217, 3241, 3241, 3252, 3252, 3258, 3261, 3269, 3269, 3273, 3273, 3278, 3284, 3287, 3293, 3295, 3295, 3298, 3301, 3312, 3329, 3332, 3332, 3341, 3341, 3345, 3345, 3369, 3369, 3386, 3389, 3396, 3397, 3401, 3401, 3406, 3414, 3416, 3423, 3426, 3429, 3440, 3457, 3460, 3460, 3479, 3481, 3506, 3506, 3516, 3516, 3518, 3519, 3527, 3529, 3531, 3534, 3541, 3541, 3543, 3543, 3552, 3569, 3573, 3584, 3643, 3646, 3676, 3712, 3715, 3715, 3717, 3718, 3721, 3721, 3723, 3724, 3726, 3731, 3736, 3736, 3744, 3744, 3748, 3748, 3750, 3750, 3752, 3753, 3756, 3756, 3770, 3770, 3774, 3775, 3781, 3781, 3783, 3783, 3790, 3791, 3802, 3803, 3806, 3839, 3912, 3912, 3947, 3952, 3980, 3983, 3992, 3992, 4029, 4029, 4045, 4046, 4048, 4095, 4130, 4130, 4136, 4136, 4139, 4139, 4147, 4149, 4154, 4159, 4186, 4255, 4294, 4303, 4345, 4346, 4348, 4351, 4442, 4446, 4515, 4519, 4602, 4607, 4615, 4615, 4679, 4679, 4681, 4681, 4686, 4687, 4695, 4695, 4697, 4697, 4702, 4703, 4743, 4743, 4745, 4745, 4750, 4751, 4783, 4783, 4785, 4785, 4790, 4791, 4799, 4799, 4801, 4801, 4806, 4807, 4815, 4815, 4823, 4823, 4847, 4847, 4879, 4879, 4881, 4881, 4886, 4887, 4895, 4895, 4935, 4935, 4955, 4960, 4989, 5023, 5109, 5120, 5751, 5759, 5789, 5791, 5873, 5887, 5901, 5901, 5909, 5919, 5943, 5951, 5972, 5983, 5997, 5997, 6001, 6001, 6004, 6015, 6109, 6111, 6122, 6143, 6159, 6159, 6170, 6175, 6264, 6271, 6314, 7679, 7836, 7839, 7930, 7935, 7958, 7959, 7966, 7967, 8006, 8007, 8014, 8015, 8024, 8024, 8026, 8026, 8028, 8028, 8030, 8030, 8062, 8063, 8117, 8117, 8133, 8133, 8148, 8149, 8156, 8156, 8176, 8177, 8181, 8181, 8191, 8191, 8275, 8278, 8280, 8286, 8292, 8297, 8306, 8307, 8335, 8351, 8370, 8399, 8427, 8447, 8507, 8508, 8524, 8530, 8580, 8591, 9167, 9215, 9255, 9279, 9291, 9311, 9471, 9471, 9748, 9749, 9752, 9752, 9854, 9855, 9866, 9984, 9989, 9989, 9994, 9995, 10024, 10024, 10060, 10060, 10062, 10062, 10067, 10069, 10071, 10071, 10079, 10080, 10133, 10135, 10160, 10160, 10175, 10191, 10220, 10223, 11008, 11903, 11930, 11930, 12020, 12031, 12246, 12271, 12284, 12287, 12352, 12352, 12439, 12440, 12544, 12548, 12589, 12592, 12687, 12687, 12728, 12783, 12829, 12831, 12868, 12880, 12924, 12926, 13004, 13007, 13055, 13055, 13175, 13178, 13278, 13279, 13311, 13311, 19894, 19967, 40870, 40959, 42125, 42127, 42183, 44031, 55204, 55295, 64046, 64047, 64107, 64255, 64263, 64274, 64280, 64284, 64311, 64311, 64317, 64317, 64319, 64319, 64322, 64322, 64325, 64325, 64434, 64466, 64832, 64847, 64912, 64913, 64968, 64975, 65021, 65023, 65040, 65055, 65060, 65071, 65095, 65096, 65107, 65107, 65127, 65127, 65132, 65135, 65141, 65141, 65277, 65278, 65280, 65280, 65471, 65473, 65480, 65481, 65488, 65489, 65496, 65497, 65501, 65503, 65511, 65511, 65519, 65528, 65536, 66303, 66335, 66335, 66340, 66351, 66379, 66559, 66598, 66599, 66638, 118783, 119030, 119039, 119079, 119081, 119262, 119807, 119893, 119893, 119965, 119965, 119968, 119969, 119971, 119972, 119975, 119976, 119981, 119981, 119994, 119994, 119996, 119996, 120001, 120001, 120004, 120004, 120070, 120070, 120075, 120076, 120085, 120085, 120093, 120093, 120122, 120122, 120127, 120127, 120133, 120133, 120135, 120137, 120145, 120145, 120484, 120487, 120778, 120781, 120832, 131069, 173783, 194559, 195102, 196605, 196608, 262141, 262144, 327677, 327680, 393213, 393216, 458749, 458752, 524285, 524288, 589821, 589824, 655357, 655360, 720893, 720896, 786429, 786432, 851965, 851968, 917501, 917504, 917504, 917506, 917535, 917632, 983037], l6 = (n) => q0(n, o6), c6 = [173, 173, 847, 847, 6150, 6150, 6155, 6155, 6156, 6156, 6157, 6157, 8203, 8203, 8204, 8204, 8205, 8205, 8288, 8288, 65024, 65024, 65025, 65025, 65026, 65026, 65027, 65027, 65028, 65028, 65029, 65029, 65030, 65030, 65031, 65031, 65032, 65032, 65033, 65033, 65034, 65034, 65035, 65035, 65036, 65036, 65037, 65037, 65038, 65038, 65039, 65039, 65279, 65279], f6 = (n) => q0(n, c6), rc = [160, 160, 5760, 5760, 8192, 8192, 8193, 8193, 8194, 8194, 8195, 8195, 8196, 8196, 8197, 8197, 8198, 8198, 8199, 8199, 8200, 8200, 8201, 8201, 8202, 8202, 8203, 8203, 8239, 8239, 8287, 8287, 12288, 12288], u6 = (n) => q0(n, rc), h6 = [128, 159, 1757, 1757, 1807, 1807, 6158, 6158, 8204, 8204, 8205, 8205, 8232, 8232, 8233, 8233, 8288, 8288, 8289, 8289, 8290, 8290, 8291, 8291, 8298, 8303, 65279, 65279, 65529, 65532, 119155, 119162], d6 = [64976, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1114110, 1114111], x6 = [0, 31, 127, 127, 832, 832, 833, 833, 8206, 8206, 8207, 8207, 8234, 8234, 8235, 8235, 8236, 8236, 8237, 8237, 8238, 8238, 8298, 8298, 8299, 8299, 8300, 8300, 8301, 8301, 8302, 8302, 8303, 8303, 12272, 12283, 55296, 57343, 57344, 63743, 65529, 65529, 65530, 65530, 65531, 65531, 65532, 65532, 65533, 65533, 917505, 917505, 917536, 917631, 983040, 1048573, 1048576, 1114109], b6 = (n) => q0(n, rc) || q0(n, x6) || q0(n, h6) || q0(n, d6), p6 = [1470, 1470, 1472, 1472, 1475, 1475, 1488, 1514, 1520, 1524, 1563, 1563, 1567, 1567, 1569, 1594, 1600, 1610, 1645, 1647, 1649, 1749, 1757, 1757, 1765, 1766, 1786, 1790, 1792, 1805, 1808, 1808, 1810, 1836, 1920, 1957, 1969, 1969, 8207, 8207, 64285, 64285, 64287, 64296, 64298, 64310, 64312, 64316, 64318, 64318, 64320, 64321, 64323, 64324, 64326, 64433, 64467, 64829, 64848, 64911, 64914, 64967, 65008, 65020, 65136, 65140, 65142, 65276], _s = (n) => q0(n, p6), g6 = [65, 90, 97, 122, 170, 170, 181, 181, 186, 186, 192, 214, 216, 246, 248, 544, 546, 563, 592, 685, 688, 696, 699, 705, 720, 721, 736, 740, 750, 750, 890, 890, 902, 902, 904, 906, 908, 908, 910, 929, 931, 974, 976, 1013, 1024, 1154, 1162, 1230, 1232, 1269, 1272, 1273, 1280, 1295, 1329, 1366, 1369, 1375, 1377, 1415, 1417, 1417, 2307, 2307, 2309, 2361, 2365, 2368, 2377, 2380, 2384, 2384, 2392, 2401, 2404, 2416, 2434, 2435, 2437, 2444, 2447, 2448, 2451, 2472, 2474, 2480, 2482, 2482, 2486, 2489, 2494, 2496, 2503, 2504, 2507, 2508, 2519, 2519, 2524, 2525, 2527, 2529, 2534, 2545, 2548, 2554, 2565, 2570, 2575, 2576, 2579, 2600, 2602, 2608, 2610, 2611, 2613, 2614, 2616, 2617, 2622, 2624, 2649, 2652, 2654, 2654, 2662, 2671, 2674, 2676, 2691, 2691, 2693, 2699, 2701, 2701, 2703, 2705, 2707, 2728, 2730, 2736, 2738, 2739, 2741, 2745, 2749, 2752, 2761, 2761, 2763, 2764, 2768, 2768, 2784, 2784, 2790, 2799, 2818, 2819, 2821, 2828, 2831, 2832, 2835, 2856, 2858, 2864, 2866, 2867, 2870, 2873, 2877, 2878, 2880, 2880, 2887, 2888, 2891, 2892, 2903, 2903, 2908, 2909, 2911, 2913, 2918, 2928, 2947, 2947, 2949, 2954, 2958, 2960, 2962, 2965, 2969, 2970, 2972, 2972, 2974, 2975, 2979, 2980, 2984, 2986, 2990, 2997, 2999, 3001, 3006, 3007, 3009, 3010, 3014, 3016, 3018, 3020, 3031, 3031, 3047, 3058, 3073, 3075, 3077, 3084, 3086, 3088, 3090, 3112, 3114, 3123, 3125, 3129, 3137, 3140, 3168, 3169, 3174, 3183, 3202, 3203, 3205, 3212, 3214, 3216, 3218, 3240, 3242, 3251, 3253, 3257, 3262, 3262, 3264, 3268, 3271, 3272, 3274, 3275, 3285, 3286, 3294, 3294, 3296, 3297, 3302, 3311, 3330, 3331, 3333, 3340, 3342, 3344, 3346, 3368, 3370, 3385, 3390, 3392, 3398, 3400, 3402, 3404, 3415, 3415, 3424, 3425, 3430, 3439, 3458, 3459, 3461, 3478, 3482, 3505, 3507, 3515, 3517, 3517, 3520, 3526, 3535, 3537, 3544, 3551, 3570, 3572, 3585, 3632, 3634, 3635, 3648, 3654, 3663, 3675, 3713, 3714, 3716, 3716, 3719, 3720, 3722, 3722, 3725, 3725, 3732, 3735, 3737, 3743, 3745, 3747, 3749, 3749, 3751, 3751, 3754, 3755, 3757, 3760, 3762, 3763, 3773, 3773, 3776, 3780, 3782, 3782, 3792, 3801, 3804, 3805, 3840, 3863, 3866, 3892, 3894, 3894, 3896, 3896, 3902, 3911, 3913, 3946, 3967, 3967, 3973, 3973, 3976, 3979, 4030, 4037, 4039, 4044, 4047, 4047, 4096, 4129, 4131, 4135, 4137, 4138, 4140, 4140, 4145, 4145, 4152, 4152, 4160, 4183, 4256, 4293, 4304, 4344, 4347, 4347, 4352, 4441, 4447, 4514, 4520, 4601, 4608, 4614, 4616, 4678, 4680, 4680, 4682, 4685, 4688, 4694, 4696, 4696, 4698, 4701, 4704, 4742, 4744, 4744, 4746, 4749, 4752, 4782, 4784, 4784, 4786, 4789, 4792, 4798, 4800, 4800, 4802, 4805, 4808, 4814, 4816, 4822, 4824, 4846, 4848, 4878, 4880, 4880, 4882, 4885, 4888, 4894, 4896, 4934, 4936, 4954, 4961, 4988, 5024, 5108, 5121, 5750, 5761, 5786, 5792, 5872, 5888, 5900, 5902, 5905, 5920, 5937, 5941, 5942, 5952, 5969, 5984, 5996, 5998, 6e3, 6016, 6070, 6078, 6085, 6087, 6088, 6100, 6106, 6108, 6108, 6112, 6121, 6160, 6169, 6176, 6263, 6272, 6312, 7680, 7835, 7840, 7929, 7936, 7957, 7960, 7965, 7968, 8005, 8008, 8013, 8016, 8023, 8025, 8025, 8027, 8027, 8029, 8029, 8031, 8061, 8064, 8116, 8118, 8124, 8126, 8126, 8130, 8132, 8134, 8140, 8144, 8147, 8150, 8155, 8160, 8172, 8178, 8180, 8182, 8188, 8206, 8206, 8305, 8305, 8319, 8319, 8450, 8450, 8455, 8455, 8458, 8467, 8469, 8469, 8473, 8477, 8484, 8484, 8486, 8486, 8488, 8488, 8490, 8493, 8495, 8497, 8499, 8505, 8509, 8511, 8517, 8521, 8544, 8579, 9014, 9082, 9109, 9109, 9372, 9449, 12293, 12295, 12321, 12329, 12337, 12341, 12344, 12348, 12353, 12438, 12445, 12447, 12449, 12538, 12540, 12543, 12549, 12588, 12593, 12686, 12688, 12727, 12784, 12828, 12832, 12867, 12896, 12923, 12927, 12976, 12992, 13003, 13008, 13054, 13056, 13174, 13179, 13277, 13280, 13310, 13312, 19893, 19968, 40869, 40960, 42124, 44032, 55203, 55296, 64045, 64048, 64106, 64256, 64262, 64275, 64279, 65313, 65338, 65345, 65370, 65382, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500, 66304, 66334, 66336, 66339, 66352, 66378, 66560, 66597, 66600, 66637, 118784, 119029, 119040, 119078, 119082, 119142, 119146, 119154, 119171, 119172, 119180, 119209, 119214, 119261, 119808, 119892, 119894, 119964, 119966, 119967, 119970, 119970, 119973, 119974, 119977, 119980, 119982, 119993, 119995, 119995, 119997, 12e4, 120002, 120003, 120005, 120069, 120071, 120074, 120077, 120084, 120086, 120092, 120094, 120121, 120123, 120126, 120128, 120132, 120134, 120134, 120138, 120144, 120146, 120483, 120488, 120777, 131072, 173782, 194560, 195101, 983040, 1048573, 1048576, 1114109], m6 = (n) => q0(n, g6), A6 = u6, w6 = f6, H1 = (n) => n.codePointAt(0), v6 = (n) => n[0], y6 = (n) => n[n.length - 1];
function W1(n) {
  const e = [], t = n.length;
  for (let r = 0; r < t; r += 1) {
    const s = n.charCodeAt(r);
    if (s >= 55296 && s <= 56319 && t > r + 1) {
      const i = n.charCodeAt(r + 1);
      if (i >= 56320 && i <= 57343) {
        e.push((s - 55296) * 1024 + i - 56320 + 65536), r += 1;
        continue;
      }
    }
    e.push(s);
  }
  return e;
}
function C6(n, e = {}) {
  if (typeof n != "string")
    throw new TypeError("Expected string.");
  if (n.length === 0)
    return "";
  const t = W1(n).map((u) => A6(u) ? 32 : u).filter((u) => !w6(u)), r = String.fromCodePoint.apply(null, t).normalize("NFKC"), s = W1(r);
  if (s.some(b6))
    throw new Error("Prohibited character, see https://tools.ietf.org/html/rfc4013#section-2.3");
  if (e.allowUnassigned !== !0 && s.some(l6))
    throw new Error("Unassigned code point, see https://tools.ietf.org/html/rfc4013#section-2.5");
  const a = s.some(_s), o = s.some(m6);
  if (a && o)
    throw new Error("String must not contain RandALCat and LCat at the same time, see https://tools.ietf.org/html/rfc3454#section-6");
  const l = _s(H1(v6(r))), f = _s(H1(y6(r)));
  if (a && !(l && f))
    throw new Error("Bidirectional RandALCat character must be the first and the last character of the string, see https://tools.ietf.org/html/rfc3454#section-6");
  return r;
}
class V0 {
  static generateFileID(e = {}) {
    let t = `${e.CreationDate.getTime()}
`;
    for (let r in e)
      e.hasOwnProperty(r) && (t += `${r}: ${e[r].valueOf()}
`);
    return Ft(t);
  }
  static generateRandomWordArray(e) {
    return a6(e);
  }
  static create(e, t = {}) {
    return !t.ownerPassword && !t.userPassword ? null : new V0(e, t);
  }
  constructor(e, t = {}) {
    if (!t.ownerPassword && !t.userPassword)
      throw new Error("None of owner password and user password is defined.");
    this.document = e, this._setupEncryption(t);
  }
  _setupEncryption(e) {
    switch (e.pdfVersion) {
      case "1.4":
      case "1.5":
        this.version = 2;
        break;
      case "1.6":
      case "1.7":
        this.version = 4;
        break;
      case "1.7ext3":
        this.version = 5;
        break;
      default:
        this.version = 1;
        break;
    }
    const t = {
      Filter: "Standard"
    };
    switch (this.version) {
      case 1:
      case 2:
      case 4:
        this._setupEncryptionV1V2V4(this.version, t, e);
        break;
      case 5:
        this._setupEncryptionV5(t, e);
        break;
    }
    this.dictionary = this.document.ref(t);
  }
  _setupEncryptionV1V2V4(e, t, r) {
    let s, i;
    switch (e) {
      case 1:
        s = 2, this.keyBits = 40, i = S6(r.permissions);
        break;
      case 2:
        s = 3, this.keyBits = 128, i = qs(r.permissions);
        break;
      case 4:
        s = 4, this.keyBits = 128, i = qs(r.permissions);
        break;
    }
    const a = Wn(r.userPassword), o = r.ownerPassword ? Wn(r.ownerPassword) : a, l = T6(s, this.keyBits, a, o);
    this.encryptionKey = I6(s, this.keyBits, this.document._id, a, l, i);
    let f;
    s === 2 ? f = k6(this.encryptionKey) : f = P6(this.document._id, this.encryptionKey), t.V = e, e >= 2 && (t.Length = this.keyBits), e === 4 && (t.CF = {
      StdCF: {
        AuthEvent: "DocOpen",
        CFM: "AESV2",
        Length: this.keyBits / 8
      }
    }, t.StmF = "StdCF", t.StrF = "StdCF"), t.R = s, t.O = l, t.U = f, t.P = i;
  }
  _setupEncryptionV5(e, t) {
    this.keyBits = 256;
    const r = qs(t.permissions), s = V1(t.userPassword), i = t.ownerPassword ? V1(t.ownerPassword) : s;
    this.encryptionKey = D6(V0.generateRandomWordArray);
    const a = E6(s, V0.generateRandomWordArray), o = a.slice(40, 48), l = F6(s, o, this.encryptionKey), f = B6(i, a, V0.generateRandomWordArray), u = f.slice(40, 48), c = O6(i, u, a, this.encryptionKey), x = M6(r, this.encryptionKey, V0.generateRandomWordArray);
    e.V = 5, e.Length = this.keyBits, e.CF = {
      StdCF: {
        AuthEvent: "DocOpen",
        CFM: "AESV3",
        Length: this.keyBits / 8
      }
    }, e.StmF = "StdCF", e.StrF = "StdCF", e.R = 5, e.O = f, e.OE = c, e.U = a, e.UE = l, e.P = r, e.Perms = x;
  }
  getEncryptFn(e, t) {
    let r;
    if (this.version < 5) {
      const a = new Uint8Array([e & 255, e >> 8 & 255, e >> 16 & 255, t & 255, t >> 8 & 255]);
      r = p0(this.encryptionKey, a);
    }
    if (this.version === 1 || this.version === 2) {
      let a = Ft(r);
      const o = Math.min(16, this.keyBits / 8 + 5);
      return a = a.slice(0, o), (l) => ns(l, a);
    }
    let s;
    if (this.version === 4) {
      const a = new Uint8Array([115, 65, 108, 84]);
      s = Ft(p0(r, a));
    } else
      s = this.encryptionKey;
    const i = V0.generateRandomWordArray(16);
    return (a) => {
      const o = qi(a, s, i, !0);
      return p0(i, o);
    };
  }
  end() {
    this.dictionary.end();
  }
}
function S6(n = {}) {
  let e = -64;
  return n.printing && (e |= 4), n.modifying && (e |= 8), n.copying && (e |= 16), n.annotating && (e |= 32), e;
}
function qs(n = {}) {
  let e = -3904;
  return n.printing === "lowResolution" && (e |= 4), n.printing === "highResolution" && (e |= 2052), n.modifying && (e |= 8), n.copying && (e |= 16), n.annotating && (e |= 32), n.fillingForms && (e |= 256), n.contentAccessibility && (e |= 512), n.documentAssembly && (e |= 1024), e;
}
function k6(n) {
  return ns(Wn(), n);
}
function P6(n, e) {
  const t = e.slice();
  let r = Ft(p0(Wn(), new Uint8Array(n)));
  for (let i = 0; i < 20; i++) {
    const a = new Uint8Array(t.length);
    for (let o = 0; o < t.length; o++)
      a[o] = e[o] ^ i;
    r = ns(r, a);
  }
  const s = new Uint8Array(32);
  return s.set(r), s;
}
function T6(n, e, t, r) {
  let s = r, i = n >= 3 ? 51 : 1;
  for (let f = 0; f < i; f++)
    s = Ft(s);
  const a = e / 8;
  let o = s.slice(0, a), l = t;
  i = n >= 3 ? 20 : 1;
  for (let f = 0; f < i; f++) {
    const u = new Uint8Array(a);
    for (let c = 0; c < a; c++)
      u[c] = o[c] ^ f;
    l = ns(l, u);
  }
  return l;
}
function I6(n, e, t, r, s, i) {
  const a = new Uint8Array([i & 255, i >> 8 & 255, i >> 16 & 255, i >> 24 & 255]);
  let o = p0(r, s, a, new Uint8Array(t));
  const l = n >= 3 ? 51 : 1, f = e / 8;
  for (let u = 0; u < l; u++)
    o = Ft(o), o = o.slice(0, f);
  return o;
}
function E6(n, e) {
  const t = e(8), r = e(8), s = rs(p0(n, t));
  return p0(s, t, r);
}
function F6(n, e, t) {
  const r = rs(p0(n, e)), s = new Uint8Array(16);
  return qi(t, r, s, !1);
}
function B6(n, e, t) {
  const r = t(8), s = t(8), i = rs(p0(n, r, e));
  return p0(i, r, s);
}
function O6(n, e, t, r) {
  const s = rs(p0(n, e, t)), i = new Uint8Array(16);
  return qi(r, s, i, !1);
}
function D6(n) {
  return n(32);
}
function M6(n, e, t) {
  const r = new Uint8Array(16);
  r[0] = n & 255, r[1] = n >> 8 & 255, r[2] = n >> 16 & 255, r[3] = n >> 24 & 255, r[4] = 255, r[5] = 255, r[6] = 255, r[7] = 255, r[8] = 84, r[9] = 97, r[10] = 100, r[11] = 98;
  const s = t(4);
  return r.set(s, 12), i6(r, e);
}
function Wn(n = "") {
  const e = new Uint8Array(32), t = n.length;
  let r = 0;
  for (; r < t && r < 32; ) {
    const s = n.charCodeAt(r);
    if (s > 255)
      throw new Error("Password contains one or more invalid characters.");
    e[r] = s, r++;
  }
  for (; r < 32; )
    e[r] = L6[r - t], r++;
  return e;
}
function V1(n = "") {
  n = unescape(encodeURIComponent(C6(n)));
  const e = Math.min(127, n.length), t = new Uint8Array(e);
  for (let r = 0; r < e; r++)
    t[r] = n.charCodeAt(r);
  return t;
}
const L6 = [40, 191, 78, 94, 78, 117, 138, 65, 100, 0, 78, 86, 255, 250, 1, 8, 46, 46, 0, 182, 208, 104, 62, 128, 47, 12, 169, 254, 100, 83, 105, 122], {
  number: R6
} = o0;
let $i = class {
  constructor(e) {
    this.doc = e, this.stops = [], this.embedded = !1, this.transform = [1, 0, 0, 1, 0, 0];
  }
  stop(e, t, r) {
    if (r == null && (r = 1), t = this.doc._normalizeColor(t), this.stops.length === 0)
      if (t.length === 3)
        this._colorSpace = "DeviceRGB";
      else if (t.length === 4)
        this._colorSpace = "DeviceCMYK";
      else if (t.length === 1)
        this._colorSpace = "DeviceGray";
      else
        throw new Error("Unknown color space");
    else if (this._colorSpace === "DeviceRGB" && t.length !== 3 || this._colorSpace === "DeviceCMYK" && t.length !== 4 || this._colorSpace === "DeviceGray" && t.length !== 1)
      throw new Error("All gradient stops must use the same color space");
    return r = Math.max(0, Math.min(1, r)), this.stops.push([e, t, r]), this;
  }
  setTransform(e, t, r, s, i, a) {
    return this.transform = [e, t, r, s, i, a], this;
  }
  embed(e) {
    let t;
    const r = this.stops.length;
    if (r === 0)
      return;
    this.embedded = !0, this.matrix = e;
    const s = this.stops[r - 1];
    s[0] < 1 && this.stops.push([1, s[1], s[2]]);
    const i = [], a = [], o = [];
    for (let u = 0; u < r - 1; u++)
      a.push(0, 1), u + 2 !== r && i.push(this.stops[u + 1][0]), t = this.doc.ref({
        FunctionType: 2,
        Domain: [0, 1],
        C0: this.stops[u + 0][1],
        C1: this.stops[u + 1][1],
        N: 1
      }), o.push(t), t.end();
    r === 1 ? t = o[0] : (t = this.doc.ref({
      FunctionType: 3,
      Domain: [0, 1],
      Functions: o,
      Bounds: i,
      Encode: a
    }), t.end()), this.id = `Sh${++this.doc._gradCount}`;
    const l = this.shader(t);
    l.end();
    const f = this.doc.ref({
      Type: "Pattern",
      PatternType: 2,
      Shading: l,
      Matrix: this.matrix.map(R6)
    });
    if (f.end(), this.stops.some((u) => u[2] < 1)) {
      let u = this.opacityGradient();
      u._colorSpace = "DeviceGray";
      for (let v of this.stops)
        u.stop(v[0], [v[2]]);
      u = u.embed(this.matrix);
      const c = [0, 0, this.doc.page.width, this.doc.page.height], x = this.doc.ref({
        Type: "XObject",
        Subtype: "Form",
        FormType: 1,
        BBox: c,
        Group: {
          Type: "Group",
          S: "Transparency",
          CS: "DeviceGray"
        },
        Resources: {
          ProcSet: ["PDF", "Text", "ImageB", "ImageC", "ImageI"],
          Pattern: {
            Sh1: u
          }
        }
      });
      x.write("/Pattern cs /Sh1 scn"), x.end(`${c.join(" ")} re f`);
      const g = this.doc.ref({
        Type: "ExtGState",
        SMask: {
          Type: "Mask",
          S: "Luminosity",
          G: x
        }
      });
      g.end();
      const m = this.doc.ref({
        Type: "Pattern",
        PatternType: 1,
        PaintType: 1,
        TilingType: 2,
        BBox: c,
        XStep: c[2],
        YStep: c[3],
        Resources: {
          ProcSet: ["PDF", "Text", "ImageB", "ImageC", "ImageI"],
          Pattern: {
            Sh1: f
          },
          ExtGState: {
            Gs1: g
          }
        }
      });
      m.write("/Gs1 gs /Pattern cs /Sh1 scn"), m.end(`${c.join(" ")} re f`), this.doc.page.patterns[this.id] = m;
    } else
      this.doc.page.patterns[this.id] = f;
    return f;
  }
  apply(e) {
    const [t, r, s, i, a, o] = this.doc._ctm, [l, f, u, c, x, g] = this.transform, m = [t * l + s * f, r * l + i * f, t * u + s * c, r * u + i * c, t * x + s * g + a, r * x + i * g + o];
    (!this.embedded || m.join(" ") !== this.matrix.join(" ")) && this.embed(m), this.doc._setColorSpace("Pattern", e);
    const v = e ? "SCN" : "scn";
    return this.doc.addContent(`/${this.id} ${v}`);
  }
}, U6 = class nc extends $i {
  constructor(e, t, r, s, i) {
    super(e), this.x1 = t, this.y1 = r, this.x2 = s, this.y2 = i;
  }
  shader(e) {
    return this.doc.ref({
      ShadingType: 2,
      ColorSpace: this._colorSpace,
      Coords: [this.x1, this.y1, this.x2, this.y2],
      Function: e,
      Extend: [!0, !0]
    });
  }
  opacityGradient() {
    return new nc(this.doc, this.x1, this.y1, this.x2, this.y2);
  }
}, N6 = class sc extends $i {
  constructor(e, t, r, s, i, a, o) {
    super(e), this.doc = e, this.x1 = t, this.y1 = r, this.r1 = s, this.x2 = i, this.y2 = a, this.r2 = o;
  }
  shader(e) {
    return this.doc.ref({
      ShadingType: 3,
      ColorSpace: this._colorSpace,
      Coords: [this.x1, this.y1, this.r1, this.x2, this.y2, this.r2],
      Function: e,
      Extend: [!0, !0]
    });
  }
  opacityGradient() {
    return new sc(this.doc, this.x1, this.y1, this.r1, this.x2, this.y2, this.r2);
  }
};
var z6 = {
  PDFGradient: $i,
  PDFLinearGradient: U6,
  PDFRadialGradient: N6
};
const G6 = ["DeviceCMYK", "DeviceRGB"];
let H6 = class {
  constructor(e, t, r, s, i) {
    this.doc = e, this.bBox = t, this.xStep = r, this.yStep = s, this.stream = i;
  }
  createPattern() {
    const e = this.doc.ref();
    e.end();
    const [t, r, s, i, a, o] = this.doc._ctm, [l, f, u, c, x, g] = [1, 0, 0, 1, 0, 0], m = [t * l + s * f, r * l + i * f, t * u + s * c, r * u + i * c, t * x + s * g + a, r * x + i * g + o], v = this.doc.ref({
      Type: "Pattern",
      PatternType: 1,
      PaintType: 2,
      TilingType: 2,
      BBox: this.bBox,
      XStep: this.xStep,
      YStep: this.yStep,
      Matrix: m.map((E) => +E.toFixed(5)),
      Resources: e
    });
    return v.end(this.stream), v;
  }
  embedPatternColorSpaces() {
    G6.forEach((e) => {
      const t = this.getPatternColorSpaceId(e);
      if (this.doc.page.colorSpaces[t]) return;
      const r = this.doc.ref(["Pattern", e]);
      r.end(), this.doc.page.colorSpaces[t] = r;
    });
  }
  getPatternColorSpaceId(e) {
    return `CsP${e}`;
  }
  embed() {
    this.id || (this.doc._patternCount = this.doc._patternCount + 1, this.id = "P" + this.doc._patternCount, this.pattern = this.createPattern()), this.doc.page.patterns[this.id] || (this.doc.page.patterns[this.id] = this.pattern);
  }
  apply(e, t) {
    this.embedPatternColorSpaces(), this.embed();
    const r = this.doc._normalizeColor(t);
    if (!r) throw Error(`invalid pattern color. (value: ${t})`);
    const s = this.getPatternColorSpaceId(this.doc._getColorSpace(r));
    this.doc._setColorSpace(s, e);
    const i = e ? "SCN" : "scn";
    return this.doc.addContent(`${r.join(" ")} /${this.id} ${i}`);
  }
};
var W6 = {
  PDFTilingPattern: H6
};
const {
  PDFGradient: V6,
  PDFLinearGradient: _6,
  PDFRadialGradient: q6
} = z6, {
  PDFTilingPattern: _1
} = W6;
var $6 = {
  initColor() {
    this.spotColors = {}, this._opacityRegistry = {}, this._opacityCount = 0, this._patternCount = 0, this._gradCount = 0;
  },
  _normalizeColor(n) {
    if (typeof n == "string") {
      if (n.charAt(0) === "#") {
        n.length === 4 && (n = n.replace(/#([0-9A-F])([0-9A-F])([0-9A-F])/i, "#$1$1$2$2$3$3"));
        const e = parseInt(n.slice(1), 16);
        n = [e >> 16, e >> 8 & 255, e & 255];
      } else if (q1[n.toLowerCase()])
        n = q1[n.toLowerCase()];
      else if (this.spotColors[n])
        return this.spotColors[n];
    }
    return Array.isArray(n) ? (n.length === 3 ? n = n.map((e) => e / 255) : n.length === 4 && (n = n.map((e) => e / 100)), n) : null;
  },
  _setColor(n, e) {
    return n instanceof V6 ? (n.apply(e), !0) : Array.isArray(n) && n[0] instanceof _1 ? (n[0].apply(e, n[1]), !0) : this._setColorCore(n, e);
  },
  _setColorCore(n, e) {
    if (n = this._normalizeColor(n), !n)
      return !1;
    const t = e ? "SCN" : "scn", r = this._getColorSpace(n);
    return this._setColorSpace(r, e), n instanceof gn ? (this.page.colorSpaces[n.id] = n.ref, this.addContent(`1 ${t}`)) : this.addContent(`${n.join(" ")} ${t}`), !0;
  },
  _setColorSpace(n, e) {
    const t = e ? "CS" : "cs";
    return this.addContent(`/${n} ${t}`);
  },
  _getColorSpace(n) {
    return n instanceof gn ? n.id : n.length === 4 ? "DeviceCMYK" : "DeviceRGB";
  },
  fillColor(n, e) {
    return this._setColor(n, !1) && this.fillOpacity(e), this._fillColor = [n, e], this;
  },
  strokeColor(n, e) {
    return this._setColor(n, !0) && this.strokeOpacity(e), this;
  },
  opacity(n) {
    return this._doOpacity(n, n), this;
  },
  fillOpacity(n) {
    return this._doOpacity(n, null), this;
  },
  strokeOpacity(n) {
    return this._doOpacity(null, n), this;
  },
  _doOpacity(n, e) {
    let t, r;
    if (n == null && e == null)
      return;
    n != null && (n = Math.max(0, Math.min(1, n))), e != null && (e = Math.max(0, Math.min(1, e)));
    const s = `${n}_${e}`;
    return this._opacityRegistry[s] ? [t, r] = this._opacityRegistry[s] : (t = {
      Type: "ExtGState"
    }, n != null && (t.ca = n), e != null && (t.CA = e), t = this.ref(t), t.end(), r = `Gs${++this._opacityCount}`, this._opacityRegistry[s] = [t, r]), this.page.ext_gstates[r] = t, this.addContent(`/${r} gs`);
  },
  linearGradient(n, e, t, r) {
    return new _6(this, n, e, t, r);
  },
  radialGradient(n, e, t, r, s, i) {
    return new q6(this, n, e, t, r, s, i);
  },
  pattern(n, e, t, r) {
    return new _1(this, n, e, t, r);
  },
  addSpotColor(n, e, t, r, s) {
    const i = new gn(this, n, e, t, r, s);
    return this.spotColors[n] = i, this;
  }
}, q1 = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
let re, ne, xe, me, Zt, Jt;
re = ne = xe = me = Zt = Jt = 0;
const ic = {
  A: 7,
  a: 7,
  C: 6,
  c: 6,
  H: 1,
  h: 1,
  L: 2,
  l: 2,
  M: 2,
  m: 2,
  Q: 4,
  q: 4,
  S: 4,
  s: 4,
  T: 2,
  t: 2,
  V: 1,
  v: 1,
  Z: 0,
  z: 0
}, X6 = function(n) {
  return n in ic;
}, j6 = function(n) {
  const e = n.codePointAt(0);
  return e === 32 || e === 9 || e === 13 || e === 10;
}, Y6 = function(n) {
  const e = n.codePointAt(0);
  return e == null ? !1 : 48 <= e && e <= 57;
}, $s = function(n, e) {
  let t = e, r = "", s = "none";
  for (; t < n.length; t += 1) {
    const a = n[t];
    if (a === "+" || a === "-") {
      if (s === "none") {
        s = "sign", r += a;
        continue;
      }
      if (s === "e") {
        s = "exponent_sign", r += a;
        continue;
      }
    }
    if (Y6(a)) {
      if (s === "none" || s === "sign" || s === "whole") {
        s = "whole", r += a;
        continue;
      }
      if (s === "decimal_point" || s === "decimal") {
        s = "decimal", r += a;
        continue;
      }
      if (s === "e" || s === "exponent_sign" || s === "exponent") {
        s = "exponent", r += a;
        continue;
      }
    }
    if (a === "." && (s === "none" || s === "sign" || s === "whole")) {
      s = "decimal_point", r += a;
      continue;
    }
    if ((a === "E" || a === "e") && (s === "whole" || s === "decimal_point" || s === "decimal")) {
      s = "e", r += a;
      continue;
    }
    break;
  }
  const i = Number.parseFloat(r);
  return Number.isNaN(i) ? [e, null] : [t - 1, i];
}, K6 = function(n) {
  const e = [];
  let t = null, r = [], s = 0, i = !1, a = !1;
  for (let o = 0; o < n.length; o += 1) {
    const l = n.charAt(o);
    if (j6(l))
      continue;
    if (i && l === ",") {
      if (a)
        break;
      a = !0;
      continue;
    }
    if (X6(l)) {
      if (a)
        return e;
      if (t == null) {
        if (l !== "M" && l !== "m")
          return e;
      } else if (r.length !== 0)
        return e;
      t = l, r = [], s = ic[t], i = !1, s === 0 && e.push({
        command: t,
        args: r
      });
      continue;
    }
    if (t == null)
      return e;
    let f = o, u = null;
    if (t === "A" || t === "a") {
      const c = r.length;
      (c === 0 || c === 1) && l !== "+" && l !== "-" && ([f, u] = $s(n, o)), (c === 2 || c === 5 || c === 6) && ([f, u] = $s(n, o)), (c === 3 || c === 4) && (l === "0" && (u = 0), l === "1" && (u = 1));
    } else
      [f, u] = $s(n, o);
    if (u == null)
      return e;
    r.push(u), i = !0, a = !1, o = f, r.length === s && (e.push({
      command: t,
      args: r
    }), t === "M" && (t = "L"), t === "m" && (t = "l"), r = []);
  }
  return e;
}, Z6 = function(n, e) {
  re = ne = xe = me = Zt = Jt = 0;
  for (let t = 0; t < n.length; t++) {
    const r = n[t];
    typeof $1[r.command] == "function" && $1[r.command](e, r.args);
  }
}, $1 = {
  M(n, e) {
    return re = e[0], ne = e[1], xe = me = null, Zt = re, Jt = ne, n.moveTo(re, ne);
  },
  m(n, e) {
    return re += e[0], ne += e[1], xe = me = null, Zt = re, Jt = ne, n.moveTo(re, ne);
  },
  C(n, e) {
    return re = e[4], ne = e[5], xe = e[2], me = e[3], n.bezierCurveTo(...e);
  },
  c(n, e) {
    return n.bezierCurveTo(e[0] + re, e[1] + ne, e[2] + re, e[3] + ne, e[4] + re, e[5] + ne), xe = re + e[2], me = ne + e[3], re += e[4], ne += e[5];
  },
  S(n, e) {
    return xe === null && (xe = re, me = ne), n.bezierCurveTo(re - (xe - re), ne - (me - ne), e[0], e[1], e[2], e[3]), xe = e[0], me = e[1], re = e[2], ne = e[3];
  },
  s(n, e) {
    return xe === null && (xe = re, me = ne), n.bezierCurveTo(re - (xe - re), ne - (me - ne), re + e[0], ne + e[1], re + e[2], ne + e[3]), xe = re + e[0], me = ne + e[1], re += e[2], ne += e[3];
  },
  Q(n, e) {
    return xe = e[0], me = e[1], re = e[2], ne = e[3], n.quadraticCurveTo(e[0], e[1], re, ne);
  },
  q(n, e) {
    return n.quadraticCurveTo(e[0] + re, e[1] + ne, e[2] + re, e[3] + ne), xe = re + e[0], me = ne + e[1], re += e[2], ne += e[3];
  },
  T(n, e) {
    return xe === null ? (xe = re, me = ne) : (xe = re - (xe - re), me = ne - (me - ne)), n.quadraticCurveTo(xe, me, e[0], e[1]), xe = re - (xe - re), me = ne - (me - ne), re = e[0], ne = e[1];
  },
  t(n, e) {
    return xe === null ? (xe = re, me = ne) : (xe = re - (xe - re), me = ne - (me - ne)), n.quadraticCurveTo(xe, me, re + e[0], ne + e[1]), re += e[0], ne += e[1];
  },
  A(n, e) {
    return X1(n, re, ne, e), re = e[5], ne = e[6];
  },
  a(n, e) {
    return e[5] += re, e[6] += ne, X1(n, re, ne, e), re = e[5], ne = e[6];
  },
  L(n, e) {
    return re = e[0], ne = e[1], xe = me = null, n.lineTo(re, ne);
  },
  l(n, e) {
    return re += e[0], ne += e[1], xe = me = null, n.lineTo(re, ne);
  },
  H(n, e) {
    return re = e[0], xe = me = null, n.lineTo(re, ne);
  },
  h(n, e) {
    return re += e[0], xe = me = null, n.lineTo(re, ne);
  },
  V(n, e) {
    return ne = e[0], xe = me = null, n.lineTo(re, ne);
  },
  v(n, e) {
    return ne += e[0], xe = me = null, n.lineTo(re, ne);
  },
  Z(n) {
    return n.closePath(), re = Zt, ne = Jt;
  },
  z(n) {
    return n.closePath(), re = Zt, ne = Jt;
  }
}, X1 = function(n, e, t, r) {
  const [s, i, a, o, l, f, u] = r, c = J6(f, u, s, i, o, l, a, e, t);
  for (let x of c) {
    const g = Q6(...x);
    n.bezierCurveTo(...g);
  }
}, J6 = function(n, e, t, r, s, i, a, o, l) {
  const f = a * (Math.PI / 180), u = Math.sin(f), c = Math.cos(f);
  t = Math.abs(t), r = Math.abs(r), xe = c * (o - n) * 0.5 + u * (l - e) * 0.5, me = c * (l - e) * 0.5 - u * (o - n) * 0.5;
  let x = xe * xe / (t * t) + me * me / (r * r);
  x > 1 && (x = Math.sqrt(x), t *= x, r *= x);
  const g = c / t, m = u / t, v = -u / r, E = c / r, C = g * o + m * l, y = v * o + E * l, A = g * n + m * e, k = v * n + E * e;
  let D = 1 / ((A - C) * (A - C) + (k - y) * (k - y)) - 0.25;
  D < 0 && (D = 0);
  let M = Math.sqrt(D);
  i === s && (M = -M);
  const I = 0.5 * (C + A) - M * (k - y), B = 0.5 * (y + k) + M * (A - C), N = Math.atan2(y - B, C - I);
  let j = Math.atan2(k - B, A - I) - N;
  j < 0 && i === 1 ? j += 2 * Math.PI : j > 0 && i === 0 && (j -= 2 * Math.PI);
  const J = Math.ceil(Math.abs(j / (Math.PI * 0.5 + 1e-3))), q = [];
  for (let $ = 0; $ < J; $++) {
    const K = N + $ * j / J, W = N + ($ + 1) * j / J;
    q[$] = [I, B, K, W, t, r, u, c];
  }
  return q;
}, Q6 = function(n, e, t, r, s, i, a, o) {
  const l = o * s, f = -a * i, u = a * s, c = o * i, x = 0.5 * (r - t), g = 8 / 3 * Math.sin(x * 0.5) * Math.sin(x * 0.5) / Math.sin(x), m = n + Math.cos(t) - g * Math.sin(t), v = e + Math.sin(t) + g * Math.cos(t), E = n + Math.cos(r), C = e + Math.sin(r), y = E + g * Math.sin(r), A = C - g * Math.cos(r);
  return [l * m + f * v, u * m + c * v, l * y + f * A, u * y + c * A, l * E + f * C, u * E + c * C];
};
class ex {
  static apply(e, t) {
    const r = K6(t);
    Z6(r, e);
  }
}
const {
  number: Fe
} = o0, At = 4 * ((Math.sqrt(2) - 1) / 3);
var tx = {
  initVector() {
    this._ctm = [1, 0, 0, 1, 0, 0], this._ctmStack = [];
  },
  save() {
    return this._ctmStack.push(this._ctm.slice()), this.addContent("q");
  },
  restore() {
    return this._ctm = this._ctmStack.pop() || [1, 0, 0, 1, 0, 0], this.addContent("Q");
  },
  closePath() {
    return this.addContent("h");
  },
  lineWidth(n) {
    return this.addContent(`${Fe(n)} w`);
  },
  _CAP_STYLES: {
    BUTT: 0,
    ROUND: 1,
    SQUARE: 2
  },
  lineCap(n) {
    return typeof n == "string" && (n = this._CAP_STYLES[n.toUpperCase()]), this.addContent(`${n} J`);
  },
  _JOIN_STYLES: {
    MITER: 0,
    ROUND: 1,
    BEVEL: 2
  },
  lineJoin(n) {
    return typeof n == "string" && (n = this._JOIN_STYLES[n.toUpperCase()]), this.addContent(`${n} j`);
  },
  miterLimit(n) {
    return this.addContent(`${Fe(n)} M`);
  },
  dash(n, e = {}) {
    const t = n;
    if (Array.isArray(n) || (n = [n, e.space || n]), !n.every((s) => Number.isFinite(s) && s > 0))
      throw new Error(`dash(${JSON.stringify(t)}, ${JSON.stringify(e)}) invalid, lengths must be numeric and greater than zero`);
    return n = n.map(Fe).join(" "), this.addContent(`[${n}] ${Fe(e.phase || 0)} d`);
  },
  undash() {
    return this.addContent("[] 0 d");
  },
  moveTo(n, e) {
    return this.addContent(`${Fe(n)} ${Fe(e)} m`);
  },
  lineTo(n, e) {
    return this.addContent(`${Fe(n)} ${Fe(e)} l`);
  },
  bezierCurveTo(n, e, t, r, s, i) {
    return this.addContent(`${Fe(n)} ${Fe(e)} ${Fe(t)} ${Fe(r)} ${Fe(s)} ${Fe(i)} c`);
  },
  quadraticCurveTo(n, e, t, r) {
    return this.addContent(`${Fe(n)} ${Fe(e)} ${Fe(t)} ${Fe(r)} v`);
  },
  rect(n, e, t, r) {
    return this.addContent(`${Fe(n)} ${Fe(e)} ${Fe(t)} ${Fe(r)} re`);
  },
  roundedRect(n, e, t, r, s) {
    s == null && (s = 0);
    let i;
    Array.isArray(s) ? i = s.slice(0, 4) : i = [s, s, s, s];
    const a = Math.min(0.5 * t, 0.5 * r), o = Math.max(0, Math.min(i[0] || 0, a)), l = Math.max(0, Math.min(i[1] || 0, a)), f = Math.max(0, Math.min(i[2] || 0, a)), u = Math.max(0, Math.min(i[3] || 0, a)), c = l * (1 - At), x = f * (1 - At), g = u * (1 - At), m = o * (1 - At);
    return this.moveTo(n + o, e), this.lineTo(n + t - l, e), l > 0 && this.bezierCurveTo(n + t - c, e, n + t, e + c, n + t, e + l), this.lineTo(n + t, e + r - f), f > 0 && this.bezierCurveTo(n + t, e + r - x, n + t - x, e + r, n + t - f, e + r), this.lineTo(n + u, e + r), u > 0 && this.bezierCurveTo(n + g, e + r, n, e + r - g, n, e + r - u), this.lineTo(n, e + o), o > 0 && this.bezierCurveTo(n, e + m, n + m, e, n + o, e), this.closePath();
  },
  ellipse(n, e, t, r) {
    r == null && (r = t), n -= t, e -= r;
    const s = t * At, i = r * At, a = n + t * 2, o = e + r * 2, l = n + t, f = e + r;
    return this.moveTo(n, f), this.bezierCurveTo(n, f - i, l - s, e, l, e), this.bezierCurveTo(l + s, e, a, f - i, a, f), this.bezierCurveTo(a, f + i, l + s, o, l, o), this.bezierCurveTo(l - s, o, n, f + i, n, f), this.closePath();
  },
  circle(n, e, t) {
    return this.ellipse(n, e, t);
  },
  arc(n, e, t, r, s, i) {
    i == null && (i = !1);
    const a = 2 * Math.PI, o = 0.5 * Math.PI;
    let l = s - r;
    Math.abs(l) > a ? l = a : l !== 0 && i !== l < 0 && (l = (i ? -1 : 1) * a + l);
    const f = Math.ceil(Math.abs(l) / o), u = l / f, c = u / o * At * t;
    let x = r, g = -Math.sin(x) * c, m = Math.cos(x) * c, v = n + Math.cos(x) * t, E = e + Math.sin(x) * t;
    this.moveTo(v, E);
    for (let C = 0; C < f; C++) {
      const y = v + g, A = E + m;
      x += u, v = n + Math.cos(x) * t, E = e + Math.sin(x) * t, g = -Math.sin(x) * c, m = Math.cos(x) * c;
      const k = v - g, p = E - m;
      this.bezierCurveTo(y, A, k, p, v, E);
    }
    return this;
  },
  polygon(...n) {
    this.moveTo(...n.shift() || []);
    for (let e of n)
      this.lineTo(...e || []);
    return this.closePath();
  },
  path(n) {
    return ex.apply(this, n), this;
  },
  _windingRule(n) {
    return /even-?odd/.test(n) ? "*" : "";
  },
  fill(n, e) {
    return /(even-?odd)|(non-?zero)/.test(n) && (e = n, n = null), n && this.fillColor(n), this.addContent(`f${this._windingRule(e)}`);
  },
  stroke(n) {
    return n && this.strokeColor(n), this.addContent("S");
  },
  fillAndStroke(n, e, t) {
    e == null && (e = n);
    const r = /(even-?odd)|(non-?zero)/;
    return r.test(n) && (t = n, n = null), r.test(e) && (t = e, e = n), n && (this.fillColor(n), this.strokeColor(e)), this.addContent(`B${this._windingRule(t)}`);
  },
  clip(n) {
    return this.addContent(`W${this._windingRule(n)} n`);
  },
  transform(n, e, t, r, s, i) {
    if (n === 1 && e === 0 && t === 0 && r === 1 && s === 0 && i === 0)
      return this;
    const a = this._ctm, [o, l, f, u, c, x] = a;
    a[0] = o * n + f * e, a[1] = l * n + u * e, a[2] = o * t + f * r, a[3] = l * t + u * r, a[4] = o * s + f * i + c, a[5] = l * s + u * i + x;
    const g = [n, e, t, r, s, i].map((m) => Fe(m)).join(" ");
    return this.addContent(`${g} cm`);
  },
  translate(n, e) {
    return this.transform(1, 0, 0, 1, n, e);
  },
  rotate(n, e = {}) {
    let t;
    const r = n * Math.PI / 180, s = Math.cos(r), i = Math.sin(r);
    let a = t = 0;
    if (e.origin != null) {
      [a, t] = e.origin;
      const o = a * s - t * i, l = a * i + t * s;
      a -= o, t -= l;
    }
    return this.transform(s, i, -i, s, a, t);
  },
  scale(n, e, t = {}) {
    let r;
    e == null && (e = n), typeof e == "object" && (t = e, e = n);
    let s = r = 0;
    return t.origin != null && ([s, r] = t.origin, s -= n * s, r -= e * r), this.transform(n, 0, 0, e, s, r);
  }
};
const j1 = (n) => {
  throw new Error(`Cannot read '${n}': file paths are not supported outside of Node. Pass a Uint8Array, ArrayBuffer or a data URL instead.`);
}, Qt = /* @__PURE__ */ new Map(), Y1 = (n, e, t) => {
  if (n === void 0)
    return t;
  if (!(n instanceof Date) || Number.isNaN(n.getTime()))
    throw new TypeError(`Expected options.${e} to be a valid Date`);
  return n.getTime();
};
function ac(n, e, t = {}) {
  if (typeof n != "string")
    throw new TypeError(`Expected a string for path, got ${typeof n}`);
  if (e === void 0) {
    Qt.delete(n);
    return;
  }
  if (!(e instanceof Uint8Array))
    throw new TypeError(`Expected a Uint8Array or undefined for data, got ${typeof e}`);
  if (t === null || typeof t != "object")
    throw new TypeError("Expected options to be an object");
  const r = Date.now();
  Qt.set(n, {
    data: e,
    birthtime: Y1(t.birthtime, "birthtime", r),
    ctime: Y1(t.ctime, "ctime", r)
  });
}
var Or = {
  readFileSync(n) {
    return Qt.has(n) ? Qt.get(n).data : j1(n);
  },
  statSync(n) {
    if (Qt.has(n)) {
      const {
        birthtime: e,
        ctime: t
      } = Qt.get(n);
      return {
        birthtime: new Date(e),
        ctime: new Date(t)
      };
    }
    return j1(n);
  }
};
const K1 = {
  402: 131,
  8211: 150,
  8212: 151,
  8216: 145,
  8217: 146,
  8218: 130,
  8220: 147,
  8221: 148,
  8222: 132,
  8224: 134,
  8225: 135,
  8226: 149,
  8230: 133,
  8364: 128,
  8240: 137,
  8249: 139,
  8250: 155,
  710: 136,
  8482: 153,
  338: 140,
  339: 156,
  732: 152,
  352: 138,
  353: 154,
  376: 159,
  381: 142,
  382: 158
}, rx = `.notdef       .notdef        .notdef        .notdef
.notdef       .notdef        .notdef        .notdef
.notdef       .notdef        .notdef        .notdef
.notdef       .notdef        .notdef        .notdef
.notdef       .notdef        .notdef        .notdef
.notdef       .notdef        .notdef        .notdef
.notdef       .notdef        .notdef        .notdef
.notdef       .notdef        .notdef        .notdef
  
space         exclam         quotedbl       numbersign
dollar        percent        ampersand      quotesingle
parenleft     parenright     asterisk       plus
comma         hyphen         period         slash
zero          one            two            three
four          five           six            seven
eight         nine           colon          semicolon
less          equal          greater        question
  
at            A              B              C
D             E              F              G
H             I              J              K
L             M              N              O
P             Q              R              S
T             U              V              W
X             Y              Z              bracketleft
backslash     bracketright   asciicircum    underscore
  
grave         a              b              c
d             e              f              g
h             i              j              k
l             m              n              o
p             q              r              s
t             u              v              w
x             y              z              braceleft
bar           braceright     asciitilde     .notdef
  
Euro          .notdef        quotesinglbase florin
quotedblbase  ellipsis       dagger         daggerdbl
circumflex    perthousand    Scaron         guilsinglleft
OE            .notdef        Zcaron         .notdef
.notdef       quoteleft      quoteright     quotedblleft
quotedblright bullet         endash         emdash
tilde         trademark      scaron         guilsinglright
oe            .notdef        zcaron         ydieresis
  
space         exclamdown     cent           sterling
currency      yen            brokenbar      section
dieresis      copyright      ordfeminine    guillemotleft
logicalnot    hyphen         registered     macron
degree        plusminus      twosuperior    threesuperior
acute         mu             paragraph      periodcentered
cedilla       onesuperior    ordmasculine   guillemotright
onequarter    onehalf        threequarters  questiondown
  
Agrave        Aacute         Acircumflex    Atilde
Adieresis     Aring          AE             Ccedilla
Egrave        Eacute         Ecircumflex    Edieresis
Igrave        Iacute         Icircumflex    Idieresis
Eth           Ntilde         Ograve         Oacute
Ocircumflex   Otilde         Odieresis      multiply
Oslash        Ugrave         Uacute         Ucircumflex
Udieresis     Yacute         Thorn          germandbls
  
agrave        aacute         acircumflex    atilde
adieresis     aring          ae             ccedilla
egrave        eacute         ecircumflex    edieresis
igrave        iacute         icircumflex    idieresis
eth           ntilde         ograve         oacute
ocircumflex   otilde         odieresis      divide
oslash        ugrave         uacute         ucircumflex
udieresis     yacute         thorn          ydieresis`.split(/\s+/);
class nx {
  constructor(e) {
    this.name = e.name, this.bbox = e.bbox.slice(), this.ascender = e.ascender, this.descender = e.descender, this.xHeight = e.xHeight, this.capHeight = e.capHeight, this.lineGap = this.bbox[3] - this.bbox[1] - (this.ascender - this.descender);
    const t = e.glyphNames.split(" ");
    this.glyphWidths = Object.fromEntries(t.map((r, s) => [r, e.glyphWidths[s]])), this.kernPairs = {};
    for (let r = 0; r < e.kernPairs.length; r += 2) {
      const s = e.kernPairs[r];
      let i = 0;
      for (const a of e.kernPairs[r + 1]) {
        i += a;
        const o = Math.floor(i / t.length), l = i % t.length;
        this.kernPairs[`${t[o]}\0${t[l]}`] = s;
      }
    }
  }
  encodeText(e) {
    const t = [];
    for (let r = 0, s = e.length; r < s; r++) {
      let i = e.charCodeAt(r);
      i = K1[i] || i, t.push(i.toString(16));
    }
    return t;
  }
  glyphsForString(e) {
    const t = [];
    for (let r = 0, s = e.length; r < s; r++) {
      const i = e.charCodeAt(r);
      t.push(this.characterToGlyph(i));
    }
    return t;
  }
  characterToGlyph(e) {
    return rx[K1[e] || e] || ".notdef";
  }
  widthOfGlyph(e) {
    return this.glyphWidths[e] || 0;
  }
  getKernPair(e, t) {
    return this.kernPairs[e + "\0" + t] || 0;
  }
  advancesForGlyphs(e) {
    const t = [];
    for (let r = 0; r < e.length; r++) {
      const s = e[r], i = e[r + 1];
      t.push(this.widthOfGlyph(s) + this.getKernPair(s, i));
    }
    return t;
  }
}
class oc {
  constructor() {
  }
  encode() {
    throw new Error("Must be implemented by subclasses");
  }
  widthOfString() {
    throw new Error("Must be implemented by subclasses");
  }
  ref() {
    return this.dictionary != null ? this.dictionary : this.dictionary = this.document.ref();
  }
  finalize() {
    this.embedded || this.dictionary == null || (this.embed(), this.embedded = !0);
  }
  embed() {
    throw new Error("Must be implemented by subclasses");
  }
  lineHeight(e, t = !1) {
    const r = t ? this.lineGap : 0;
    return (this.ascender + r - this.descender) / 1e3 * e;
  }
}
class sx extends oc {
  constructor(e, t, r) {
    super(), this.document = e, this.name = t.name, this.id = r, this.font = new nx(t), {
      ascender: this.ascender,
      descender: this.descender,
      bbox: this.bbox,
      lineGap: this.lineGap,
      xHeight: this.xHeight,
      capHeight: this.capHeight
    } = this.font;
  }
  embed() {
    return this.dictionary.data = {
      Type: "Font",
      BaseFont: this.name,
      Subtype: "Type1",
      Encoding: "WinAnsiEncoding"
    }, this.dictionary.end();
  }
  encode(e) {
    const t = this.font.encodeText(e), r = this.font.glyphsForString(`${e}`), s = this.font.advancesForGlyphs(r), i = [];
    for (let a = 0; a < r.length; a++) {
      const o = r[a];
      i.push({
        xAdvance: s[a],
        yAdvance: 0,
        xOffset: 0,
        yOffset: 0,
        advanceWidth: this.font.widthOfGlyph(o)
      });
    }
    return [t, i];
  }
  widthOfString(e, t) {
    const r = this.font.glyphsForString(`${e}`), s = this.font.advancesForGlyphs(r);
    let i = 0;
    for (let o of s)
      i += o;
    const a = t / 1e3;
    return i * a;
  }
}
const ln = function(n) {
  return `0000${n.toString(16)}`.slice(-4);
};
class ix extends oc {
  constructor(e, t, r) {
    super(), this.document = e, this.font = t, this.id = r, this.subset = this.font.createSubset(), this.unicode = [[0]], this.widths = [this.font.getGlyph(0).advanceWidth], this.name = this.font.postscriptName, this.scale = 1e3 / this.font.unitsPerEm, this.ascender = this.font.ascent * this.scale, this.descender = this.font.descent * this.scale, this.xHeight = this.font.xHeight * this.scale, this.capHeight = this.font.capHeight * this.scale, this.lineGap = this.font.lineGap * this.scale, this.bbox = this.font.bbox, e.options.fontLayoutCache !== !1 && (this.layoutCache = /* @__PURE__ */ Object.create(null));
  }
  layoutRun(e, t) {
    const r = this.font.layout(e, t);
    for (let s = 0; s < r.positions.length; s++) {
      const i = r.positions[s];
      for (let a in i)
        i[a] *= this.scale;
      i.advanceWidth = r.glyphs[s].advanceWidth * this.scale;
    }
    return r;
  }
  layoutCached(e) {
    if (!this.layoutCache)
      return this.layoutRun(e);
    let t;
    if (t = this.layoutCache[e])
      return t;
    const r = this.layoutRun(e);
    return this.layoutCache[e] = r, r;
  }
  layout(e, t, r) {
    if (t)
      return this.layoutRun(e, t);
    let s = r ? null : [], i = r ? null : [], a = 0, o = 0, l = 0;
    for (; l <= e.length; ) {
      var f;
      if (l === e.length && o < l || (f = e.charAt(l), [" ", "	"].includes(f))) {
        const u = this.layoutCached(e.slice(o, ++l));
        r || (s = s.concat(u.glyphs), i = i.concat(u.positions)), a += u.advanceWidth, o = l;
      } else
        l++;
    }
    return {
      glyphs: s,
      positions: i,
      advanceWidth: a
    };
  }
  encode(e, t) {
    const {
      glyphs: r,
      positions: s
    } = this.layout(e, t), i = [];
    for (let a = 0; a < r.length; a++) {
      const o = r[a], l = this.subset.includeGlyph(o.id);
      i.push(`0000${l.toString(16)}`.slice(-4)), this.widths[l] == null && (this.widths[l] = o.advanceWidth * this.scale), this.unicode[l] == null && (this.unicode[l] = o.codePoints);
    }
    return [i, s];
  }
  widthOfString(e, t, r) {
    const s = this.layout(e, r, !0).advanceWidth, i = t / 1e3;
    return s * i;
  }
  embed() {
    var c;
    const e = this.subset.cff != null, t = this.document.ref();
    e && (t.data.Subtype = "CIDFontType0C"), t.end(this.subset.encode());
    const r = ((this.font["OS/2"] != null ? this.font["OS/2"].sFamilyClass : void 0) || 0) >> 8;
    let s = 0;
    this.font.post.isFixedPitch && (s |= 1), 1 <= r && r <= 7 && (s |= 2), s |= 4, r === 10 && (s |= 8), this.font.head.macStyle.italic && (s |= 64);
    const a = [1, 2, 3, 4, 5, 6].map((x) => String.fromCharCode((this.id.charCodeAt(x) || 73) + 17)).join("") + "+" + ((c = this.font.postscriptName) == null ? void 0 : c.replaceAll(" ", "_")), {
      bbox: o
    } = this.font, l = this.document.ref({
      Type: "FontDescriptor",
      FontName: a,
      Flags: s,
      FontBBox: [o.minX * this.scale, o.minY * this.scale, o.maxX * this.scale, o.maxY * this.scale],
      ItalicAngle: this.font.italicAngle,
      Ascent: this.ascender,
      Descent: this.descender,
      CapHeight: (this.font.capHeight || this.font.ascent) * this.scale,
      XHeight: (this.font.xHeight || 0) * this.scale,
      StemV: 0
    });
    if (e ? l.data.FontFile3 = t : l.data.FontFile2 = t, this.document.subset && this.document.subset === 1) {
      const x = this.widths.length - 1, g = new Uint8Array(Math.ceil((x + 1) / 8));
      for (let v = 0; v <= x; v++)
        this.widths[v] != null && (g[Math.floor(v / 8)] |= 128 >> v % 8);
      const m = this.document.ref();
      m.write(g), m.end(), l.data.CIDSet = m;
    }
    l.end();
    const f = {
      Type: "Font",
      Subtype: "CIDFontType0",
      BaseFont: a,
      CIDSystemInfo: {
        Registry: new String("Adobe"),
        Ordering: new String("Identity"),
        Supplement: 0
      },
      FontDescriptor: l,
      W: [0, this.widths]
    };
    e || (f.Subtype = "CIDFontType2", f.CIDToGIDMap = "Identity");
    const u = this.document.ref(f);
    return u.end(), this.dictionary.data = {
      Type: "Font",
      Subtype: "Type0",
      BaseFont: a,
      Encoding: "Identity-H",
      DescendantFonts: [u],
      ToUnicode: this.toUnicodeCmap()
    }, this.dictionary.end();
  }
  toUnicodeCmap() {
    const e = this.document.ref(), t = [];
    for (let a of this.unicode) {
      const o = [];
      for (let l of a)
        l > 65535 && (l -= 65536, o.push(ln(l >>> 10 & 1023 | 55296)), l = 56320 | l & 1023), o.push(ln(l));
      t.push(`<${o.join(" ")}>`);
    }
    const r = 256, s = Math.ceil(t.length / r), i = [];
    for (let a = 0; a < s; a++) {
      const o = a * r, l = Math.min((a + 1) * r, t.length);
      i.push(`<${ln(o)}> <${ln(l - 1)}> [${t.slice(o, l).join(" ")}]`);
    }
    return e.end(`/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo <<
  /Registry (Adobe)
  /Ordering (UCS)
  /Supplement 0
>> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000><ffff>
endcodespacerange
${i.length} beginbfrange
${i.join(`
`)}
endbfrange
endcmap
CMapName currentdict /CMap defineresource pop
end
end`), e;
  }
}
const ax = ["Courier", "Courier-Bold", "Courier-BoldOblique", "Courier-Oblique", "Helvetica", "Helvetica-Bold", "Helvetica-BoldOblique", "Helvetica-Oblique", "Symbol", "Times-Bold", "Times-BoldItalic", "Times-Italic", "Times-Roman", "ZapfDingbats"], Xi = new Set(ax), lc = (n, e) => {
  if (n == null || typeof n != "object" || !Xi.has(n.name) || e != null && n.name !== e)
    throw new TypeError("Invalid standard font data.");
}, pi = /* @__PURE__ */ new Map(), ox = (n) => Xi.has(n), lx = (...n) => {
  for (const e of n)
    lc(e), pi.set(e.name, e);
}, cx = (n) => {
  if (!Xi.has(n))
    return null;
  const e = pi.get(n);
  if (e == null)
    throw new Error(`Standard font "${n}" is not registered. Call registerStdFonts() before using it.`);
  if (typeof e != "function")
    return e;
  const t = e();
  return lc(t, n), pi.set(n, t), t;
};
class fx {
  static open(e, t, r, s) {
    let i;
    if (typeof t == "string") {
      if (ox(t))
        return new sx(e, cx(t), s);
      t = Or.readFileSync(t);
    }
    if (t instanceof Uint8Array ? i = ni(t, r) : t instanceof ArrayBuffer ? i = ni(new Uint8Array(t), r) : typeof (t == null ? void 0 : t.layout) == "function" && (i = t), i == null)
      throw new Error("Not a supported font format or standard PDF font.");
    return new ix(e, i, s);
  }
}
const ux = (n, e) => {
  var t, r, s, i, a, o, l, f;
  return !(((r = (t = n.font._tables) == null ? void 0 : t.head) == null ? void 0 : r.checkSumAdjustment) !== ((i = (s = e.font._tables) == null ? void 0 : s.head) == null ? void 0 : i.checkSumAdjustment) || JSON.stringify((o = (a = n.font._tables) == null ? void 0 : a.name) == null ? void 0 : o.records) !== JSON.stringify((f = (l = e.font._tables) == null ? void 0 : l.name) == null ? void 0 : f.records));
};
var hx = {
  initFonts(n = "Helvetica", e = null, t = 12) {
    this._fontFamilies = {}, this._fontCount = 0, this._fontSource = n, this._fontFamily = e, this._fontSize = t, this._font = null, this._remSize = t, this._registeredFonts = {}, n && this.font(n, e);
  },
  font(n, e, t) {
    let r, s;
    if (typeof e == "number" && (t = e, e = null), typeof n == "string" && this._registeredFonts[n] ? (r = n, {
      src: n,
      family: e
    } = this._registeredFonts[n]) : (r = e || n, typeof r != "string" && (r = null)), this._fontSource = n, this._fontFamily = e, t != null && this.fontSize(t), s = this._fontFamilies[r])
      return this._font = s, this;
    const i = `F${++this._fontCount}`;
    return this._font = fx.open(this, n, e, i), (s = this._fontFamilies[this._font.name]) && ux(this._font, s) ? (this._font = s, this) : (r && (this._fontFamilies[r] = this._font), this._font.name && !this._fontFamilies[this._font.name] && (this._fontFamilies[this._font.name] = this._font), !r && (!this._font.name || this._fontFamilies[this._font.name] !== this._font) && (this._fontFamilies[this._font.id] = this._font), this);
  },
  fontSize(n) {
    return this._fontSize = this.sizeToPoint(n), this;
  },
  currentLineHeight(n) {
    return this._font.lineHeight(this._fontSize, n);
  },
  registerFont(n, e, t) {
    return this._registeredFonts[n] = {
      src: e,
      family: t
    }, this;
  },
  sizeToPoint(n, e = 0, t = this.page, r = void 0) {
    if (r || (r = this._fontSize), typeof e != "number" && (e = this.sizeToPoint(e)), n === void 0) return e;
    if (typeof n == "number") return n;
    if (typeof n == "boolean") return Number(n);
    const s = String(n).match(/((\d+)?(\.\d+)?)(em|in|px|cm|mm|pc|ex|ch|rem|vw|vh|vmin|vmax|%|pt)?/);
    if (!s) throw new Error(`Unsupported size '${n}'`);
    let i;
    switch (s[4]) {
      case "em":
        i = this._fontSize;
        break;
      case "in":
        i = tn;
        break;
      case "px":
        i = w5 * tn;
        break;
      case "cm":
        i = L1 * tn;
        break;
      case "mm":
        i = A5 * L1 * tn;
        break;
      case "pc":
        i = v5;
        break;
      case "ex":
        i = this.currentLineHeight();
        break;
      case "ch":
        i = this.widthOfString("0");
        break;
      case "rem":
        i = this._remSize;
        break;
      case "vw":
        i = t.width / 100;
        break;
      case "vh":
        i = t.height / 100;
        break;
      case "vmin":
        i = Math.min(t.width, t.height) / 100;
        break;
      case "vmax":
        i = Math.max(t.width, t.height) / 100;
        break;
      case "%":
        i = r / 100;
        break;
      case "pt":
      default:
        i = 1;
    }
    return i * Number(s[1]);
  }
};
const Z1 = "­", Xs = "-";
class mn extends Vl {
  constructor(e, t) {
    super(), this.document = e, this.horizontalScaling = t.horizontalScaling || 100, this.indent = (t.indent || 0) * this.horizontalScaling / 100, this.indentAllLines = t.indentAllLines || !1, this.characterSpacing = (t.characterSpacing || 0) * this.horizontalScaling / 100, this.wordSpacing = (t.wordSpacing === 0) * this.horizontalScaling / 100, this.columns = t.columns || 1, this.columnGap = (t.columnGap != null ? t.columnGap : 18) * this.horizontalScaling / 100, this.lineWidth = (t.width * this.horizontalScaling / 100 - this.columnGap * (this.columns - 1)) / this.columns, this.spaceLeft = this.lineWidth, this.startX = this.document.x, this.startY = this.document.y, this.column = 1, this.ellipsis = t.ellipsis, this.continuedX = 0, this.indentApplied = !1, this.features = t.features, t.height != null ? (this.height = t.height, this.maxY = mr(this.startY + t.height)) : this.maxY = mr(this.document.page.maxY()), this.on("firstLine", (r) => {
      const s = this.continuedX, i = s || this.indent;
      if ((s || !this.indentApplied) && (this.document.x += i, this.lineWidth -= i, this.indentApplied = !0), r.indentAllLines) {
        s && this.once("line", () => {
          this.document.x -= s, this.lineWidth += s;
        });
        return;
      }
      this.once("line", () => {
        this.document.x -= i, this.lineWidth += i, this.indentApplied = !1, r.continued && !this.continuedX && (this.continuedX = this.indent), r.continued || (this.continuedX = 0);
      });
    }), this.on("lastLine", (r) => {
      const {
        align: s
      } = r;
      s === "justify" && (r.align = "left"), this.lastLine = !0, this.once("line", () => (this.document.y += r.paragraphGap || 0, r.align = s, this.lastLine = !1));
    });
  }
  wordWidth(e) {
    return mr(this.document.widthOfString(e, this) + this.characterSpacing + this.wordSpacing);
  }
  canFit(e, t) {
    return e[e.length - 1] != Z1 ? t <= this.spaceLeft : t + this.wordWidth(Xs) <= this.spaceLeft;
  }
  eachWord(e, t) {
    let r;
    const s = new Gl(e);
    let i = null;
    const a = /* @__PURE__ */ Object.create(null);
    for (; r = s.nextBreak(); ) {
      var o;
      let u = e.slice((i != null ? i.position : void 0) || 0, r.position), c = a[u] != null ? a[u] : a[u] = this.wordWidth(u);
      if (c > this.lineWidth + this.continuedX) {
        let x = i;
        const g = {};
        for (; u.length; ) {
          var l, f;
          c > this.spaceLeft ? (l = Math.ceil(this.spaceLeft / (c / u.length)), c = this.wordWidth(u.slice(0, l)), f = c <= this.spaceLeft && l < u.length) : l = u.length;
          let m = c > this.spaceLeft && l > 0;
          for (; m || f; )
            m ? (c = this.wordWidth(u.slice(0, --l)), m = c > this.spaceLeft && l > 0) : (c = this.wordWidth(u.slice(0, ++l)), m = c > this.spaceLeft && l > 0, f = c <= this.spaceLeft && l < u.length);
          if (l === 0 && this.spaceLeft === this.lineWidth && (l = 1), g.required = r.required || l < u.length, o = t(u.slice(0, l), c, g, x), x = {
            required: !1
          }, u = u.slice(l), c = this.wordWidth(u), o === !1)
            break;
        }
      } else
        o = t(u, c, r, i);
      if (o === !1)
        break;
      i = r;
    }
  }
  wrap(e, t) {
    const {
      document: r
    } = this;
    this.horizontalScaling = t.horizontalScaling || 100, t.indent != null && (this.indent = t.indent * this.horizontalScaling / 100), t.characterSpacing != null && (this.characterSpacing = t.characterSpacing * this.horizontalScaling / 100), t.wordSpacing != null && (this.wordSpacing = t.wordSpacing * this.horizontalScaling / 100), t.ellipsis != null && (this.ellipsis = t.ellipsis);
    const s = r.y + r.currentLineHeight(!0);
    (r.y > this.maxY || s > this.maxY) && this.nextSection();
    let i = "", a = 0, o = 0, l = 0, f = r.y;
    const u = () => (t.textWidth = a + this.wordSpacing * (o - 1), t.wordCount = o, t.lineWidth = this.lineWidth, f = r.y, this.emit("line", i, t, this), l++);
    this.emit("sectionStart", t, this), this.eachWord(e, (c, x, g, m) => {
      if ((m == null || m.required) && (this.emit("firstLine", t, this), this.spaceLeft = this.lineWidth), this.canFit(c, x) && (i += c, a += x, o++), g.required || !this.canFit(c, x)) {
        const v = r.currentLineHeight(!0);
        if (this.height != null && this.ellipsis && mr(r.y + v * 2) > this.maxY && this.column >= this.columns) {
          for (this.ellipsis === !0 && (this.ellipsis = "…"), i = i.replace(/\s+$/, ""), a = this.wordWidth(i + this.ellipsis); i && a > this.lineWidth; )
            i = i.slice(0, -1).replace(/\s+$/, ""), a = this.wordWidth(i + this.ellipsis);
          a <= this.lineWidth && (i = i + this.ellipsis), a = this.wordWidth(i);
        }
        if (g.required && (x > this.spaceLeft && (u(), i = c, a = x, o = 1), this.emit("lastLine", t, this)), i[i.length - 1] == Z1 && (i = i.slice(0, -1) + Xs, this.spaceLeft -= this.wordWidth(Xs)), u(), mr(r.y + v) > this.maxY) {
          if (this.emit("sectionEnd", t, this), !this.nextSection())
            return o = 0, i = "", !1;
          this.emit("sectionStart", t, this);
        }
        return g.required ? (this.spaceLeft = this.lineWidth, i = "", a = 0, o = 0) : (this.spaceLeft = this.lineWidth - x, i = c, a = x, o = 1);
      } else
        return this.spaceLeft -= x;
    }), o > 0 && (this.emit("lastLine", t, this), u()), this.emit("sectionEnd", t, this), t.continued === !0 ? (l > 1 && (this.continuedX = 0), this.continuedX += t.textWidth || 0, r.y = f) : r.x = this.startX;
  }
  nextSection(e) {
    if (++this.column > this.columns) {
      if (this.height != null)
        return !1;
      this.document.continueOnNewPage(), this.column = 1, this.startY = this.document.page.margins.top, this.maxY = this.document.page.maxY(), this.indentAllLines ? this.indentApplied && (this.document.x += this.continuedX || this.indent) : this.document.x = this.startX, this.document._fillColor && this.document.fillColor(...this.document._fillColor), this.emit("pageBreak", e, this);
    } else
      this.document.x += this.lineWidth + this.columnGap, this.document.y = this.startY, this.emit("columnBreak", e, this);
    return !0;
  }
}
const {
  number: G0
} = o0;
function dx(n, e) {
  if (e === "numbered")
    return `${n}.`;
  var t = String.fromCharCode((n - 1) % 26 + 65), r = Math.floor((n - 1) / 26 + 1), s = Array(r + 1).join(t);
  return `${s}.`;
}
var xx = {
  initText() {
    this._line = this._line.bind(this), this.x = 0, this.y = 0, this._lineGap = 0;
  },
  lineGap(n) {
    return this._lineGap = n, this;
  },
  moveDown(n) {
    return n == null && (n = 1), this.y += this.currentLineHeight(!0) * n + this._lineGap, this;
  },
  moveUp(n) {
    return n == null && (n = 1), this.y -= this.currentLineHeight(!0) * n + this._lineGap, this;
  },
  _text(n, e, t, r, s) {
    r = this._initOptions(e, t, r), n = n == null ? "" : `${n}`, r.wordSpacing && (n = n.replace(/\s{2,}/g, " "));
    const i = () => {
      r.structParent && r.structParent.add(this.struct(r.structType || "P", [this.markStructureContent(r.structType || "P")]));
    };
    if (r.rotation !== 0 && (this.save(), this.rotate(-r.rotation, {
      origin: [this.x, this.y]
    })), r.width) {
      let a = this._wrapper;
      a || (a = new mn(this, r), a.on("line", s), a.on("firstLine", i)), this._wrapper = r.continued ? a : null, this._textOptions = r.continued ? r : null, a.wrap(n, r);
    } else
      for (let a of n.split(`
`))
        i(), s(a, r);
    return r.rotation !== 0 && this.restore(), this;
  },
  text(n, e, t, r) {
    return this._text(n, e, t, r, this._line);
  },
  widthOfString(n, e = {}) {
    const t = e.horizontalScaling || 100;
    return (this._font.widthOfString(n, this._fontSize, e.features) + (e.characterSpacing || 0) * (n.length - 1)) * t / 100;
  },
  boundsOfString(n, e, t, r) {
    r = this._initOptions(e, t, r), {
      x: e,
      y: t
    } = this;
    const s = r.lineGap ?? this._lineGap ?? 0, i = this.currentLineHeight(!0) + s;
    let a = 0;
    if (n = String(n ?? ""), r.wordSpacing && (n = n.replace(/\s{2,}/g, " ")), r.width) {
      let D = new mn(this, r);
      D.on("line", (M, I) => {
        if (this.y += i, M = M.replace(/\n/g, ""), M.length) {
          let B = I.wordSpacing ?? 0;
          const N = I.characterSpacing ?? 0;
          if (I.width && I.align === "justify") {
            const V = M.trim().split(/\s+/), j = this.widthOfString(M.replace(/\s+/g, ""), I), J = this.widthOfString(" ") + N;
            B = Math.max(0, (I.lineWidth - j) / Math.max(1, V.length - 1) - J);
          }
          a = Math.max(a, I.textWidth + B * (I.wordCount - 1) + N * (M.length - 1));
        }
      }), D.wrap(n, r);
    } else
      for (let D of n.split(`
`)) {
        const M = this.widthOfString(D, r);
        this.y += i, a = Math.max(a, M);
      }
    let o = this.y - t;
    if (r.height && (o = Math.min(o, r.height)), this.x = e, this.y = t, r.rotation === 0)
      return {
        x: e,
        y: t,
        width: a,
        height: o
      };
    if (r.rotation === 90)
      return {
        x: e,
        y: t - a,
        width: o,
        height: a
      };
    if (r.rotation === 180)
      return {
        x: e - a,
        y: t - o,
        width: a,
        height: o
      };
    if (r.rotation === 270)
      return {
        x: e - o,
        y: t,
        width: o,
        height: a
      };
    const l = ql(r.rotation), f = $l(r.rotation), u = e, c = t, x = e + a * l, g = t - a * f, m = e + a * l + o * f, v = t - a * f + o * l, E = e + o * f, C = t + o * l, y = Math.min(u, x, m, E), A = Math.max(u, x, m, E), k = Math.min(c, g, v, C), p = Math.max(c, g, v, C);
    return {
      x: y,
      y: k,
      width: A - y,
      height: p - k
    };
  },
  heightOfString(n, e) {
    const {
      x: t,
      y: r
    } = this;
    e = this._initOptions(e), e.height = 1 / 0;
    const s = e.lineGap || this._lineGap || 0;
    this._text(n, this.x, this.y, e, () => {
      this.y += this.currentLineHeight(!0) + s;
    });
    const i = this.y - r;
    return this.x = t, this.y = r, i;
  },
  list(n, e, t, r) {
    r = this._initOptions(e, t, r);
    const s = r.listType || "bullet", i = Math.round(this._font.ascender / 1e3 * this._fontSize), a = i / 2, o = r.bulletRadius || i / 3, l = r.textIndent || (s === "bullet" ? o * 5 : i * 2), f = r.bulletIndent || (s === "bullet" ? o * 8 : i * 2);
    let u = 1;
    const c = [], x = [], g = [];
    var m = function(E) {
      let C = 1;
      for (let y = 0; y < E.length; y++) {
        const A = E[y];
        Array.isArray(A) ? (u++, m(A), u--) : (c.push(A), x.push(u), s !== "bullet" && g.push(C++));
      }
    };
    m(n);
    const v = function(E, C) {
      const y = new mn(this, r);
      y.on("line", this._line), u = 1, y.once("firstLine", () => {
        let A, k, p, D;
        r.structParent && (r.structTypes ? [k, p, D] = r.structTypes : [k, p, D] = ["LI", "Lbl", "LBody"]), k ? (A = this.struct(k), r.structParent.add(A)) : r.structParent && (A = r.structParent);
        let M;
        if ((M = x[C++]) !== u) {
          const B = f * (M - u);
          this.x += B, y.lineWidth -= B, u = M;
        }
        switch (A && (p || D) && A.add(this.struct(p || D, [this.markStructureContent(p || D)])), s) {
          case "bullet":
            this.circle(this.x - l + o, this.y + a, o), this.fill();
            break;
          case "numbered":
          case "lettered":
            var I = dx(g[C - 1], s);
            this._fragment(I, this.x - l, this.y, r);
            break;
        }
        A && p && D && A.add(this.struct(D, [this.markStructureContent(D)])), A && A !== r.structParent && A.end();
      }), y.on("sectionStart", () => {
        const A = l + f * (u - 1);
        this.x += A, y.lineWidth -= A;
      }), y.on("sectionEnd", () => {
        const A = l + f * (u - 1);
        this.x -= A, y.lineWidth += A;
      }), y.wrap(E, r);
    };
    for (let E = 0; E < c.length; E++)
      v.call(this, c[E], E);
    return this;
  },
  _initOptions(n = {}, e, t = {}) {
    n && typeof n == "object" && (t = n, n = null);
    const r = Object.assign({}, t);
    if (this._textOptions)
      for (let s in this._textOptions) {
        const i = this._textOptions[s];
        s !== "continued" && r[s] === void 0 && (r[s] = i);
      }
    return n != null && (this.x = n), e != null && (this.y = e), r.lineBreak !== !1 && (r.width == null && (r.width = this.page.width - this.x - this.page.margins.right), r.width = Math.max(r.width, 0)), r.columns || (r.columns = 0), r.columnGap == null && (r.columnGap = 18), r.rotation = Number(r.rotation ?? 0) % 360, r.rotation < 0 && (r.rotation += 360), r;
  },
  _line(n, e = {}, t) {
    if (this._fragment(n, this.x, this.y, e), t) {
      const r = e.lineGap || this._lineGap || 0;
      this.y += this.currentLineHeight(!0) + r;
    } else
      this.x += this.widthOfString(n, e);
  },
  _fragment(n, e, t, r) {
    let s, i, a, o, l, f;
    if (n = `${n}`.replace(/\n/g, ""), n.length === 0)
      return;
    const u = r.align || "left";
    let c = r.wordSpacing || 0;
    const x = r.characterSpacing || 0, g = r.horizontalScaling || 100;
    if (r.width)
      switch (u) {
        case "right":
          l = this.widthOfString(n.replace(/\s+$/, ""), r), e += r.lineWidth - l;
          break;
        case "center":
          e += r.lineWidth / 2 - r.textWidth / 2;
          break;
        case "justify":
          f = n.trim().split(/\s+/), l = this.widthOfString(n.replace(/\s+/g, ""), r);
          var m = this.widthOfString(" ") + x;
          c = Math.max(0, (r.lineWidth - l) / Math.max(1, f.length - 1) - m);
          break;
      }
    if (typeof r.baseline == "number")
      s = -r.baseline;
    else {
      switch (r.baseline) {
        case "svg-middle":
          s = 0.5 * this._font.xHeight;
          break;
        case "middle":
        case "svg-central":
          s = 0.5 * (this._font.descender + this._font.ascender);
          break;
        case "bottom":
        case "ideographic":
          s = this._font.descender;
          break;
        case "alphabetic":
          s = 0;
          break;
        case "mathematical":
          s = 0.5 * this._font.ascender;
          break;
        case "hanging":
          s = 0.8 * this._font.ascender;
          break;
        case "top":
          s = this._font.ascender;
          break;
        default:
          s = this._font.ascender;
      }
      s = s / 1e3 * this._fontSize;
    }
    const v = r.textWidth ?? this.widthOfString(n, r) - x * (n.length - 1), E = r.wordCount ?? (n.trim() ? n.trim().split(/\s+/).length : 0), C = v + c * (E - 1) + x * (n.length - 1);
    if (r.link != null) {
      const B = {};
      this._currentStructureElement && this._currentStructureElement.dictionary.data.S === "Link" && (B.structParent = this._currentStructureElement), this.link(e, t, C, this.currentLineHeight(), r.link, B);
    }
    if (r.goTo != null && this.goTo(e, t, C, this.currentLineHeight(), r.goTo), r.destination != null && this.addNamedDestination(r.destination, "XYZ", e, t, null), r.underline) {
      this.save(), r.stroke || this.strokeColor(...this._fillColor || []);
      const B = this._fontSize < 10 ? 0.5 : Math.floor(this._fontSize / 10);
      this.lineWidth(B);
      let N = t + this.currentLineHeight() - B;
      this.moveTo(e, N), this.lineTo(e + C, N), this.stroke(), this.restore();
    }
    if (r.strike) {
      this.save(), r.stroke || this.strokeColor(...this._fillColor || []);
      const B = this._fontSize < 10 ? 0.5 : Math.floor(this._fontSize / 10);
      this.lineWidth(B);
      let N = t + this.currentLineHeight() / 2;
      this.moveTo(e, N), this.lineTo(e + C, N), this.stroke(), this.restore();
    }
    if (this.save(), r.oblique) {
      let B;
      typeof r.oblique == "number" ? B = -Math.tan(r.oblique * Math.PI / 180) : B = -0.25, this.transform(1, 0, 0, 1, e, t), this.transform(1, 0, B, 1, -B * s, 0), this.transform(1, 0, 0, 1, -e, -t);
    }
    this.transform(1, 0, 0, -1, 0, this.page.height), t = this.page.height - t - s, this.page.fonts[this._font.id] == null && (this.page.fonts[this._font.id] = this._font.ref()), this.addContent("BT"), this.addContent(`1 0 0 1 ${G0(e)} ${G0(t)} Tm`), this.addContent(`/${this._font.id} ${G0(this._fontSize)} Tf`);
    const y = r.fill && r.stroke ? 2 : r.stroke ? 1 : 0;
    if (y && this.addContent(`${y} Tr`), x && this.addContent(`${G0(x)} Tc`), g !== 100 && this.addContent(`${g} Tz`), c) {
      f = n.trim().split(/\s+/), c += this.widthOfString(" ") + x, c *= 1e3 / this._fontSize, i = [], o = [];
      for (let B of f) {
        const [N, V] = this._font.encode(B, r.features);
        i = i.concat(N), o = o.concat(V);
        const j = {}, J = o[o.length - 1];
        for (let q in J) {
          const $ = J[q];
          j[q] = $;
        }
        j.xAdvance += c, o[o.length - 1] = j;
      }
    } else
      [i, o] = this._font.encode(n, r.features);
    const A = this._fontSize / 1e3, k = [];
    let p = 0, D = !1;
    const M = (B) => {
      if (p < B) {
        const N = i.slice(p, B).join(""), V = o[B - 1].xAdvance - o[B - 1].advanceWidth;
        k.push(`<${N}> ${G0(-V)}`);
      }
      p = B;
    }, I = (B) => {
      M(B), k.length > 0 && (this.addContent(`[${k.join(" ")}] TJ`), k.length = 0);
    };
    for (a = 0; a < o.length; a++) {
      const B = o[a];
      B.xOffset || B.yOffset ? (I(a), this.addContent(`1 0 0 1 ${G0(e + B.xOffset * A)} ${G0(t + B.yOffset * A)} Tm`), I(a + 1), D = !0) : (D && (this.addContent(`1 0 0 1 ${G0(e)} ${G0(t)} Tm`), D = !1), B.xAdvance - B.advanceWidth !== 0 && M(a + 1)), e += B.xAdvance * A;
    }
    I(a), this.addContent("ET"), this.restore();
  }
};
const bx = (n) => {
  if (!n || n.length < 20) return null;
  let e = 2;
  for (; e < n.length - 4; ) {
    for (; e < n.length && n[e] !== 255; ) e++;
    if (e >= n.length - 4) return null;
    const t = at(n, e);
    if (e += 2, t === 65498) return null;
    if (t >= 65488 && t <= 65497 || t === 65281) continue;
    if (e + 2 > n.length) return null;
    const r = at(n, e);
    if (t === 65505 && e + 8 <= n.length && zn(n.subarray(e + 2, e + 8)) === "Exif\0\0") {
      const i = e + 8;
      if (i + 8 > n.length) return null;
      const a = zn(n.subarray(i, i + 2)), o = a === "II";
      if (!o && a !== "MM") return null;
      const l = o ? (x) => x5(n, x) : (x) => at(n, x), f = o ? (x) => p5(n, x) : (x) => b5(n, x);
      if (l(i + 2) !== 42) return null;
      const u = i + f(i + 4);
      if (u + 2 > n.length) return null;
      const c = l(u);
      for (let x = 0; x < c; x++) {
        const g = u + 2 + x * 12;
        if (g + 12 > n.length) return null;
        if (l(g) === 274) {
          const m = l(g + 8);
          return m >= 1 && m <= 8 ? m : null;
        }
      }
      return null;
    }
    e += r;
  }
  return null;
}, J1 = [65472, 65473, 65474, 65475, 65477, 65478, 65479, 65480, 65481, 65482, 65483, 65484, 65485, 65486, 65487], px = {
  1: "DeviceGray",
  3: "DeviceRGB",
  4: "DeviceCMYK"
};
class gx {
  constructor(e, t) {
    let r;
    if (this.data = e, this.label = t, at(this.data, 0) !== 65496)
      throw "SOI not found in JPEG";
    this.orientation = bx(this.data) || 1;
    let s = 2;
    for (; s < this.data.length; ) {
      for (; s < this.data.length && this.data[s] !== 255; ) s++;
      if (s >= this.data.length || (r = at(this.data, s), s += 2, J1.includes(r)))
        break;
      s += at(this.data, s);
    }
    if (!J1.includes(r))
      throw "Invalid JPEG.";
    s += 2, this.bits = this.data[s++], this.height = at(this.data, s), s += 2, this.width = at(this.data, s), s += 2;
    const i = this.data[s];
    this.colorSpace = px[i], this.obj = null;
  }
  embed(e) {
    if (!this.obj)
      return this.obj = e.ref({
        Type: "XObject",
        Subtype: "Image",
        BitsPerComponent: this.bits,
        Width: this.width,
        Height: this.height,
        ColorSpace: this.colorSpace,
        Filter: "DCTDecode"
      }), this.colorSpace === "DeviceCMYK" && (this.obj.data.Decode = [1, 0, 1, 0, 1, 0, 1, 0]), this.obj.end(this.data), this.data = null;
  }
}
class mx {
  constructor(e, t) {
    this.label = t, this.image = new f5(e), this.width = this.image.width, this.height = this.image.height, this.imgData = this.image.imgData, this.obj = null;
  }
  embed(e) {
    if (this.document = e, this.obj)
      return;
    const {
      image: t,
      height: r,
      width: s
    } = this, i = t.hasAlphaChannel, a = t.interlaceMethod === 1, o = this.obj = e.ref({
      Type: "XObject",
      Subtype: "Image",
      BitsPerComponent: i ? 8 : t.bits,
      Width: s,
      Height: r,
      Filter: "FlateDecode"
    });
    if (!i) {
      const l = e.ref({
        Predictor: a ? 1 : 15,
        Colors: t.colors,
        BitsPerComponent: t.bits,
        Columns: s
      });
      o.data.DecodeParms = l, l.end();
    }
    if (t.palette.length === 0)
      o.data.ColorSpace = t.colorSpace;
    else {
      const l = e.ref();
      l.end(new Uint8Array(t.palette)), o.data.ColorSpace = ["Indexed", "DeviceRGB", t.palette.length / 3 - 1, l];
    }
    if (t.transparency.grayscale != null) {
      const l = t.transparency.grayscale;
      o.data.Mask = [l, l];
    } else if (t.transparency.rgb) {
      const {
        rgb: l
      } = t.transparency, f = [];
      for (let u of l)
        f.push(u, u);
      o.data.Mask = f;
    } else {
      if (t.transparency.indexed)
        return this.loadIndexedAlphaChannel();
      if (i)
        return this.splitAlphaChannel();
    }
    if (a)
      return this.decodeData();
    this.finalize();
  }
  finalize() {
    if (this.alphaChannel) {
      const e = this.document.ref({
        Type: "XObject",
        Subtype: "Image",
        Height: this.height,
        Width: this.width,
        BitsPerComponent: 8,
        Filter: "FlateDecode",
        ColorSpace: "DeviceGray",
        Decode: [0, 1]
      });
      e.end(this.alphaChannel), this.obj.data.SMask = e;
    }
    return this.obj.end(this.imgData), this.image = null, this.imgData = null;
  }
  splitAlphaChannel() {
    return this.image.decodePixels((e) => {
      let t, r;
      const s = this.image.colors, i = this.width * this.height, a = new Uint8Array(i * s), o = new Uint8Array(i);
      let l = r = t = 0;
      const f = e.length, u = this.image.bits === 16 ? 1 : 0;
      for (; l < f; ) {
        for (let c = 0; c < s; c++)
          a[r++] = e[l++], l += u;
        o[t++] = e[l++], l += u;
      }
      return this.imgData = $t.deflateSync(a), this.alphaChannel = $t.deflateSync(o), this.finalize();
    });
  }
  loadIndexedAlphaChannel() {
    const e = this.image.transparency.indexed, t = this.image.interlaceMethod === 1;
    return this.image.decodePixels((r) => {
      const s = new Uint8Array(this.width * this.height);
      let i = 0;
      for (let a = 0, o = r.length; a < o; a++)
        s[i++] = e[r[a]];
      return t && (this.imgData = $t.deflateSync(r)), this.alphaChannel = $t.deflateSync(s), this.finalize();
    });
  }
  decodeData() {
    this.image.decodePixels((e) => {
      this.imgData = $t.deflateSync(e), this.finalize();
    });
  }
}
class Ax {
  static open(e, t) {
    let r;
    if (e instanceof Uint8Array)
      r = e;
    else if (e instanceof ArrayBuffer)
      r = new Uint8Array(e);
    else {
      const s = /^data:.+?;base64,(.*)$/.exec(e);
      if (s)
        r = Vi(s[1]);
      else if (r = Or.readFileSync(e), !r)
        return;
    }
    if (r[0] === 255 && r[1] === 216)
      return new gx(r, t);
    if (r[0] === 137 && r[1] === 80 && r[2] === 78 && r[3] === 71)
      return new mx(r, t);
    throw new Error("Unknown image format.");
  }
}
var wx = {
  initImages() {
    this._imageRegistry = {}, this._imageCount = 0;
  },
  image(n, e, t, r = {}) {
    let s, i, a, o, l, f, u, c, x;
    typeof e == "object" && (r = e, e = null);
    const g = r.ignoreOrientation || r.ignoreOrientation !== !1 && this.options.ignoreOrientation, m = typeof t != "number";
    e = (f = e ?? r.x) != null ? f : this.x, t = (u = t ?? r.y) != null ? u : this.y, typeof n == "string" && (o = this._imageRegistry[n]), o || (n.width && n.height ? o = n : o = this.openImage(n)), o.obj || o.embed(this), this.page.xobjects[o.label] == null && (this.page.xobjects[o.label] = o.obj);
    let {
      width: v,
      height: E
    } = o;
    !g && o.orientation > 4 && ([v, E] = [E, v]);
    let C = r.width || v, y = r.height || E;
    if (r.width && !r.height) {
      const I = C / v;
      C = v * I, y = E * I;
    } else if (r.height && !r.width) {
      const I = y / E;
      C = v * I, y = E * I;
    } else r.scale ? (C = v * r.scale, y = E * r.scale) : r.fit ? ([a, s] = r.fit, i = a / s, l = v / E, l > i ? (C = a, y = a / l) : (y = s, C = s * l)) : r.cover && ([a, s] = r.cover, i = a / s, l = v / E, l > i ? (y = s, C = s * l) : (C = a, y = a / l));
    (r.fit || r.cover) && (r.align === "center" ? e = e + a / 2 - C / 2 : r.align === "right" && (e = e + a - C), r.valign === "center" ? t = t + s / 2 - y / 2 : r.valign === "bottom" && (t = t + s - y));
    let A = 0, k = e, p = t, D = y, M = C;
    if (g)
      D = -y, p += y;
    else
      switch (o.orientation) {
        default:
        case 1:
          D = -y, p += y;
          break;
        case 2:
          M = -C, D = -y, k += C, p += y;
          break;
        case 3:
          c = e, x = t, D = -y, k -= C, A = 180;
          break;
        case 4:
          break;
        case 5:
          c = e, x = t, M = y, D = C, p -= D, A = 90;
          break;
        case 6:
          c = e, x = t, M = y, D = -C, A = 90;
          break;
        case 7:
          c = e, x = t, D = -C, M = -y, k += y, A = 90;
          break;
        case 8:
          c = e, x = t, M = y, D = -C, k -= y, p += C, A = -90;
          break;
      }
    return r.link != null && this.link(e, t, C, y, r.link), r.goTo != null && this.goTo(e, t, C, y, r.goTo), r.destination != null && this.addNamedDestination(r.destination, "XYZ", e, t, null), m && (this.y += y), this.save(), r.opacity != null && this._doOpacity(r.opacity, null), A && this.rotate(A, {
      origin: [c, x]
    }), this.transform(M, 0, 0, D, k, p), this.addContent(`/${o.label} Do`), this.restore(), this;
  },
  openImage(n) {
    let e;
    return typeof n == "string" && (e = this._imageRegistry[n]), e || (e = Ax.open(n, `I${++this._imageCount}`), typeof n == "string" && (this._imageRegistry[n] = e)), e;
  }
};
class An {
  constructor(e) {
    this.annotationRef = e;
  }
}
var vx = {
  annotate(n, e, t, r, s) {
    const {
      structParent: i,
      color: a,
      ...o
    } = s;
    o.Type = "Annot", o.Rect = this._convertRect(n, e, t, r), o.Border = [0, 0, 0], o.Subtype === "Link" && typeof o.F > "u" && (o.F = 4), o.Subtype !== "Link" && o.C == null && (o.C = this._normalizeColor(a || [0, 0, 0])), typeof o.Dest == "string" && (o.Dest = new String(o.Dest));
    const l = this.ref(o);
    if (this.page.annotations.push(l), typeof (i == null ? void 0 : i.add) == "function") {
      const f = new An(l);
      i.add(f);
    }
    return l.end(), this;
  },
  note(n, e, t, r, s, i) {
    const a = {
      ...i,
      Subtype: "Text",
      Contents: new String(s)
    };
    return a.Name == null && (a.Name = "Comment"), a.color == null && (a.color = [243, 223, 92]), this.annotate(n, e, t, r, a);
  },
  goTo(n, e, t, r, s, i) {
    const a = {
      ...i,
      Subtype: "Link",
      A: this.ref({
        S: "GoTo",
        D: new String(s)
      })
    };
    return a.A.end(), this.annotate(n, e, t, r, a);
  },
  link(n, e, t, r, s, i) {
    const a = {
      ...i,
      Subtype: "Link"
    };
    if (typeof s == "number") {
      const o = this._root.data.Pages.data;
      if (s >= 0 && s < o.Kids.length)
        a.A = this.ref({
          S: "GoTo",
          D: [o.Kids[s], "XYZ", null, null, null]
        }), a.A.end();
      else
        throw new Error(`The document has no page ${s}`);
    } else
      a.A = this.ref({
        S: "URI",
        URI: new String(s)
      }), a.A.end();
    return a.structParent && !a.Contents && (a.Contents = new String("")), this.annotate(n, e, t, r, a);
  },
  _markup(n, e, t, r, s) {
    const [i, a, o, l] = this._convertRect(n, e, t, r);
    return this.annotate(n, e, t, r, {
      ...s,
      QuadPoints: [i, l, o, l, i, a, o, a],
      Contents: new String()
    });
  },
  highlight(n, e, t, r, s) {
    const i = {
      ...s,
      Subtype: "Highlight"
    };
    return i.color == null && (i.color = [241, 238, 148]), this._markup(n, e, t, r, i);
  },
  underline(n, e, t, r, s) {
    const i = {
      ...s,
      Subtype: "Underline"
    };
    return this._markup(n, e, t, r, i);
  },
  strike(n, e, t, r, s) {
    const i = {
      ...s,
      Subtype: "StrikeOut"
    };
    return this._markup(n, e, t, r, i);
  },
  lineAnnotation(n, e, t, r, s) {
    const i = {
      ...s,
      Subtype: "Line",
      Contents: new String(),
      L: [n, this.page.height - e, t, this.page.height - r]
    };
    return this.annotate(n, e, t, r, i);
  },
  rectAnnotation(n, e, t, r, s) {
    const i = {
      ...s,
      Subtype: "Square",
      Contents: new String()
    };
    return this.annotate(n, e, t, r, i);
  },
  ellipseAnnotation(n, e, t, r, s) {
    const i = {
      ...s,
      Subtype: "Circle",
      Contents: new String()
    };
    return this.annotate(n, e, t, r, i);
  },
  textAnnotation(n, e, t, r, s, i) {
    const a = {
      ...i,
      Subtype: "FreeText",
      Contents: new String(s),
      DA: new String()
    };
    return this.annotate(n, e, t, r, a);
  },
  fileAnnotation(n, e, t, r, s = {}, i) {
    const a = this.file(s.src, Object.assign({
      hidden: !0
    }, s)), o = {
      ...i,
      Subtype: "FileAttachment",
      FS: a
    };
    return o.Contents ? o.Contents = new String(o.Contents) : a.data.Desc && (o.Contents = new String(a.data.Desc)), this.annotate(n, e, t, r, o);
  },
  _convertRect(n, e, t, r) {
    let s = e;
    e += r;
    let i = n + t;
    const [a, o, l, f, u, c] = this._ctm;
    return n = a * n + l * e + u, e = o * n + f * e + c, i = a * i + l * s + u, s = o * i + f * s + c, [n, e, i, s];
  }
};
const Q1 = {
  top: 0,
  left: 0,
  zoom: 0,
  fit: !0,
  pageNumber: null,
  expanded: !1
};
class ji {
  constructor(e, t, r, s, i = Q1) {
    if (this.document = e, this.options = i, this.outlineData = {}, s !== null) {
      const a = s.data.MediaBox[2], l = s.data.MediaBox[3] - (i.top || 0), f = a - (i.left || 0), u = i.zoom || 0;
      this.outlineData.Dest = i.fit ? [s, "Fit"] : [s, "XYZ", f, l, u];
    }
    t !== null && (this.outlineData.Parent = t), r !== null && (this.outlineData.Title = new String(r)), this.dictionary = this.document.ref(this.outlineData), this.children = [];
  }
  addItem(e, t = Q1) {
    const r = this.document._root.data.Pages.data.Kids, s = t.pageNumber != null ? r[t.pageNumber] : this.document.page.dictionary, i = new ji(this.document, this.dictionary, e, s, t);
    return this.children.push(i), i;
  }
  endOutline() {
    if (this.children.length > 0) {
      this.options.expanded && (this.outlineData.Count = this.children.length);
      const e = this.children[0], t = this.children[this.children.length - 1];
      this.outlineData.First = e.dictionary, this.outlineData.Last = t.dictionary;
      for (let r = 0, s = this.children.length; r < s; r++) {
        const i = this.children[r];
        r > 0 && (i.outlineData.Prev = this.children[r - 1].dictionary), r < this.children.length - 1 && (i.outlineData.Next = this.children[r + 1].dictionary), i.endOutline();
      }
    }
    return this.dictionary.end();
  }
}
var yx = {
  initOutline() {
    this.outline = new ji(this, null, null, null);
  },
  endOutline() {
    if (this.outline.endOutline(), this.outline.children.length > 0)
      return this._root.data.Outlines = this.outline.dictionary, this._root.data.PageMode = this._root.data.PageMode || "UseOutlines";
  }
};
class wn {
  constructor(e, t) {
    this.refs = [{
      pageRef: e,
      mcid: t
    }];
  }
  push(e) {
    e.refs.forEach((t) => this.refs.push(t));
  }
}
class _0 {
  constructor(e, t, r = {}, s = null) {
    this.document = e, this._attached = !1, this._ended = !1, this._flushed = !1, this.dictionary = e.ref({
      S: t
    });
    const i = this.dictionary.data;
    (Array.isArray(r) || this._isValidChild(r)) && (s = r, r = {}), r.title && (i.T = new String(r.title)), r.lang && (i.Lang = new String(r.lang)), r.alt && (i.Alt = new String(r.alt)), r.expanded && (i.E = new String(r.expanded)), r.actual && (i.ActualText = new String(r.actual));
    const a = Array.isArray(r.bbox) && r.bbox.length === 4, o = typeof r.placement == "string";
    if (a || o) {
      const l = {
        O: "Layout"
      };
      if (l.Placement = o ? r.placement : "Block", a) {
        const f = e.page.height;
        l.BBox = [r.bbox[0], f - r.bbox[3], r.bbox[2], f - r.bbox[1]];
      }
      i.A = l;
    }
    r.scope && (i.A = {
      ...i.A || {},
      O: "Table",
      Scope: r.scope
    }), this._children = [], s && (Array.isArray(s) || (s = [s]), s.forEach((l) => this.add(l)), this.end());
  }
  add(e) {
    if (this._ended)
      throw new Error("Cannot add child to already-ended structure element");
    if (!this._isValidChild(e))
      throw new Error("Invalid structure element child");
    return e instanceof _0 && (e.setParent(this.dictionary), this._attached && e.setAttached()), e instanceof wn && this._addContentToParentTree(e), e instanceof An && this._addAnnotationToParentTree(e.annotationRef), typeof e == "function" && this._attached && (e = this._contentForClosure(e)), this._children.push(e), this;
  }
  _addContentToParentTree(e) {
    e.refs.forEach(({
      pageRef: t,
      mcid: r
    }) => {
      const s = this.document.getStructParentTree().get(t.data.StructParents);
      s[r] = this.dictionary;
    });
  }
  _addAnnotationToParentTree(e) {
    const t = this.document.createStructParentTreeNextKey();
    e.data.StructParent = t, this.document.getStructParentTree().add(t, this.dictionary);
  }
  setParent(e) {
    if (this.dictionary.data.P)
      throw new Error("Structure element added to more than one parent");
    this.dictionary.data.P = e, this._flush();
  }
  setAttached() {
    this._attached || (this._children.forEach((e, t) => {
      e instanceof _0 && e.setAttached(), typeof e == "function" && (this._children[t] = this._contentForClosure(e));
    }), this._attached = !0, this._flush());
  }
  end() {
    this._ended || (this._children.filter((e) => e instanceof _0).forEach((e) => e.end()), this._ended = !0, this._flush());
  }
  _isValidChild(e) {
    return e instanceof _0 || e instanceof wn || e instanceof An || typeof e == "function";
  }
  _contentForClosure(e) {
    const t = this.document.markStructureContent(this.dictionary.data.S), r = this.document._currentStructureElement;
    this.document._currentStructureElement = this;
    const s = this._ended;
    return this._ended = !1, e(), this._ended = s, this.document._currentStructureElement = r, this.document.endMarkedContent(), this._addContentToParentTree(t), t;
  }
  _isFlushable() {
    return !this.dictionary.data.P || !this._ended ? !1 : this._children.every((e) => typeof e == "function" ? !1 : e instanceof _0 ? e._isFlushable() : !0);
  }
  _flush() {
    this._flushed || !this._isFlushable() || (this.dictionary.data.K = [], this._children.forEach((e) => this._flushChild(e)), this.dictionary.end(), this._children = [], this.dictionary.data.K = null, this._flushed = !0);
  }
  _flushChild(e) {
    if (e instanceof _0 && this.dictionary.data.K.push(e.dictionary), e instanceof wn && e.refs.forEach(({
      pageRef: t,
      mcid: r
    }) => {
      this.dictionary.data.Pg || (this.dictionary.data.Pg = t), this.dictionary.data.Pg === t ? this.dictionary.data.K.push(r) : this.dictionary.data.K.push({
        Type: "MCR",
        Pg: t,
        MCID: r
      });
    }), e instanceof An) {
      const t = this.document.page.dictionary, r = {
        Type: "OBJR",
        Obj: e.annotationRef,
        Pg: t
      };
      this.dictionary.data.K.push(r);
    }
  }
}
class Cx extends Wi {
  _compareKeys(e, t) {
    return parseInt(e) - parseInt(t);
  }
  _keysName() {
    return "Nums";
  }
  _dataForKey(e) {
    return parseInt(e);
  }
}
var Sx = {
  initMarkings(n) {
    this.structChildren = [], n.tagged && (this.getMarkInfoDictionary().data.Marked = !0, this.getStructTreeRoot());
  },
  markContent(n, e = null) {
    if (n === "Artifact" || e && e.mcid) {
      let r = 0;
      for (this.page.markings.forEach((s) => {
        (r || s.structContent || s.tag === "Artifact") && r++;
      }); r--; )
        this.endMarkedContent();
    }
    if (!e)
      return this.page.markings.push({
        tag: n
      }), this.addContent(`/${n} BMC`), this;
    this.page.markings.push({
      tag: n,
      options: e
    });
    const t = {};
    return typeof e.mcid < "u" && (t.MCID = e.mcid), n === "Artifact" && (typeof e.type == "string" && (t.Type = e.type), Array.isArray(e.bbox) && (t.BBox = [e.bbox[0], this.page.height - e.bbox[3], e.bbox[2], this.page.height - e.bbox[1]]), Array.isArray(e.attached) && e.attached.every((r) => typeof r == "string") && (t.Attached = e.attached)), n === "Span" && (e.lang && (t.Lang = new String(e.lang)), e.alt && (t.Alt = new String(e.alt)), e.expanded && (t.E = new String(e.expanded)), e.actual && (t.ActualText = new String(e.actual))), this.addContent(`/${n} ${o0.convert(t)} BDC`), this;
  },
  markStructureContent(n, e = {}) {
    const t = this.getStructParentTree().get(this.page.structParentTreeKey), r = t.length;
    t.push(null), this.markContent(n, {
      ...e,
      mcid: r
    });
    const s = new wn(this.page.dictionary, r);
    return this.page.markings.slice(-1)[0].structContent = s, s;
  },
  endMarkedContent() {
    return this.page.markings.pop(), this.addContent("EMC"), this._textOptions && (delete this._textOptions.link, delete this._textOptions.goTo, delete this._textOptions.destination, delete this._textOptions.underline, delete this._textOptions.strike), this;
  },
  struct(n, e = {}, t = null) {
    return new _0(this, n, e, t);
  },
  addStructure(n) {
    const e = this.getStructTreeRoot();
    return n.setParent(e), n.setAttached(), this.structChildren.push(n), e.data.K || (e.data.K = []), e.data.K.push(n.dictionary), this;
  },
  initPageMarkings(n) {
    n.forEach((e) => {
      if (e.structContent) {
        const t = e.structContent, r = this.markStructureContent(e.tag, e.options);
        t.push(r), this.page.markings.slice(-1)[0].structContent = t;
      } else
        this.markContent(e.tag, e.options);
    });
  },
  endPageMarkings(n) {
    const e = n.markings;
    return e.forEach(() => n.write("EMC")), n.markings = [], e;
  },
  getMarkInfoDictionary() {
    return this._root.data.MarkInfo || (this._root.data.MarkInfo = this.ref({})), this._root.data.MarkInfo;
  },
  hasMarkInfoDictionary() {
    return !!this._root.data.MarkInfo;
  },
  getStructTreeRoot() {
    return this._root.data.StructTreeRoot || (this._root.data.StructTreeRoot = this.ref({
      Type: "StructTreeRoot",
      ParentTree: new Cx(),
      ParentTreeNextKey: 0
    })), this._root.data.StructTreeRoot;
  },
  getStructParentTree() {
    return this.getStructTreeRoot().data.ParentTree;
  },
  createStructParentTreeNextKey() {
    this.getMarkInfoDictionary();
    const n = this.getStructTreeRoot(), e = n.data.ParentTreeNextKey++;
    return n.data.ParentTree.add(e, []), e;
  },
  endMarkings() {
    const n = this._root.data.StructTreeRoot;
    n && (n.end(), this.structChildren.forEach((e) => e.end())), this._root.data.MarkInfo && this._root.data.MarkInfo.end();
  }
};
const Ar = {
  readOnly: 1,
  required: 2,
  noExport: 4,
  multiline: 4096,
  password: 8192,
  toggleToOffButton: 16384,
  radioButton: 32768,
  pushButton: 65536,
  combo: 131072,
  edit: 262144,
  sort: 524288,
  multiSelect: 2097152,
  noSpell: 4194304
}, kx = {
  left: 0,
  center: 1,
  right: 2
}, eo = {
  value: "V",
  defaultValue: "DV"
}, to = {
  zip: "0",
  zipPlus4: "1",
  zip4: "1",
  phone: "2",
  ssn: "3"
}, ro = {
  number: {
    nDec: 0,
    sepComma: !1,
    negStyle: "MinusBlack",
    currency: "",
    currencyPrepend: !0
  },
  percent: {
    nDec: 0,
    sepComma: !1
  }
};
function Px(n, e, t) {
  let r = e.Ff ?? 0;
  if (n === "text")
    t.FT = "Tx";
  else if (n === "pushButton")
    t.FT = "Btn", r |= Ar.pushButton;
  else if (n === "radioButton")
    t.FT = "Btn", r |= Ar.radioButton;
  else if (n === "checkbox")
    t.FT = "Btn";
  else if (n === "combo")
    t.FT = "Ch", r |= Ar.combo;
  else if (n === "list")
    t.FT = "Ch";
  else if (n)
    throw new Error(`Invalid form annotation type '${n}'`);
  Object.keys(e).forEach((s) => {
    Ar[s] && e[s] && (r |= Ar[s]);
  }), r !== 0 && (t.Ff = r);
}
function Tx(n, e) {
  const t = kx[n.align];
  typeof t == "number" && t !== 0 && (e.Q = t);
}
function Ix(n, e) {
  var t;
  Array.isArray(n.select) && n.select.length && (e.Opt = n.select.map((r) => typeof r == "string" ? new String(r) : r)), Object.keys(eo).forEach((r) => {
    if (r in n) {
      const s = n[r] ?? "";
      e[eo[r]] = typeof s == "string" ? new String(s) : s;
    }
  }), (t = n.MK) != null && t.CA && (e.MK = {
    CA: new String(n.MK.CA)
  }), n.label && (e.MK = n.MK ?? {}, e.MK.CA = new String(n.label));
}
function Ex(n, e) {
  const t = n.format;
  if (t != null && t.type) {
    let r, s, i = "";
    if (to[t.type] !== void 0)
      r = "AFSpecial_Keystroke", s = "AFSpecial_Format", i = to[t.type];
    else {
      let a = t.type.charAt(0).toUpperCase() + t.type.slice(1);
      if (r = `AF${a}_Keystroke`, s = `AF${a}_Format`, t.type === "date")
        r += "Ex", s += "Ex", i = '"' + String(t.param) + '"';
      else if (t.type === "time")
        i = String(t.param);
      else if (t.type === "number") {
        let o = Object.assign({}, ro.number, t);
        i = String([String(o.nDec), o.sepComma ? "0" : "1", '"' + o.negStyle + '"', "null", '"' + o.currency + '"', String(o.currencyPrepend)].join(","));
      } else if (t.type === "percent") {
        let o = Object.assign({}, ro.percent, t);
        i = String([String(o.nDec), o.sepComma ? "0" : "1"].join(","));
      }
    }
    e.AA = n.AA ?? {}, e.AA.K = {
      S: "JavaScript",
      JS: new String(`${r}(${i});`)
    }, e.AA.F = {
      S: "JavaScript",
      JS: new String(`${s}(${i});`)
    };
  }
}
var Fx = {
  initForm() {
    if (!this._font)
      throw new Error("Must set a font before calling initForm method");
    this._acroform = {
      fonts: {},
      defaultFont: this._font.name
    }, this._acroform.fonts[this._font.id] = this._font.ref();
    let n = {
      Fields: [],
      NeedAppearances: !0,
      DA: new String(`/${this._font.id} 0 Tf 0 g`),
      DR: {
        Font: {}
      }
    };
    n.DR.Font[this._font.id] = this._font.ref();
    const e = this.ref(n);
    return this._root.data.AcroForm = e, this;
  },
  endAcroForm() {
    if (this._root.data.AcroForm) {
      if (!Object.keys(this._acroform.fonts).length && !this._acroform.defaultFont)
        throw new Error("No fonts specified for PDF form");
      let n = this._root.data.AcroForm.data.DR.Font;
      Object.keys(this._acroform.fonts).forEach((e) => {
        n[e] = this._acroform.fonts[e];
      }), this._root.data.AcroForm.data.Fields.forEach((e) => {
        this._endChild(e);
      }), this._root.data.AcroForm.end();
    }
    return this;
  },
  _endChild(n) {
    return Array.isArray(n.data.Kids) && (n.data.Kids.forEach((e) => {
      this._endChild(e);
    }), n.end()), this;
  },
  formField(n, e = {}) {
    let t = this._fieldDict(n, null, e), r = this.ref(t);
    return this._addToParent(r), r;
  },
  formAnnotation(n, e, t, r, s, i, a = {}) {
    let o = this._fieldDict(n, e, a);
    o.Subtype = "Widget", o.F === void 0 && (o.F = 4), this.annotate(t, r, s, i, o);
    let l = this.page.annotations[this.page.annotations.length - 1];
    return this._addToParent(l);
  },
  formText(n, e, t, r, s, i = {}) {
    return this.formAnnotation(n, "text", e, t, r, s, i);
  },
  formPushButton(n, e, t, r, s, i = {}) {
    return this.formAnnotation(n, "pushButton", e, t, r, s, i);
  },
  formCombo(n, e, t, r, s, i = {}) {
    return this.formAnnotation(n, "combo", e, t, r, s, i);
  },
  formList(n, e, t, r, s, i = {}) {
    return this.formAnnotation(n, "list", e, t, r, s, i);
  },
  formRadioButton(n, e, t, r, s, i = {}) {
    return this.formAnnotation(n, "radioButton", e, t, r, s, i);
  },
  formCheckbox(n, e, t, r, s, i = {}) {
    return this.formAnnotation(n, "checkbox", e, t, r, s, i);
  },
  _addToParent(n) {
    let e = n.data.Parent;
    return e ? (e.data.Kids || (e.data.Kids = []), e.data.Kids.push(n)) : this._root.data.AcroForm.data.Fields.push(n), this;
  },
  _fieldDict(n, e, t = {}) {
    if (!this._acroform)
      throw new Error("Call document.initForm() method before adding form elements to document");
    const r = {};
    return Px(e, t, r), Tx(t, r), this._mapFont(t, r), Ix(t, r), this._mapColors(t, r), Ex(t, r), r.T = new String(n), t.parent && (r.Parent = t.parent), r;
  },
  _mapColors(n, e) {
    let t = this._normalizeColor(n.backgroundColor);
    t && (e.MK = e.MK ? e.MK : {}, e.MK.BG = t), t = this._normalizeColor(n.borderColor), t && (e.MK || (e.MK = {}), e.MK.BC = t);
  },
  _mapFont(n, e) {
    const {
      _acroform: t,
      _font: r
    } = this;
    if (t.fonts[r.id] == null && (t.fonts[r.id] = r.ref()), t.defaultFont !== r.name) {
      e.DR = {
        Font: {}
      };
      const s = n.fontSize || 0;
      e.DR.Font[r.id] = r.ref(), e.DA = new String(`/${r.id} ${s} Tf 0 g`);
    }
  }
}, Bx = {
  file(n, e = {}) {
    e.name = e.name || n, e.relationship = e.relationship || "Unspecified";
    const t = {
      Type: "EmbeddedFile",
      Params: {}
    };
    let r;
    if (!n)
      throw new Error("No src specified");
    if (n instanceof Uint8Array)
      r = n;
    else if (n instanceof ArrayBuffer)
      r = new Uint8Array(n);
    else {
      const f = /^data:(.*?);base64,(.*)$/.exec(n);
      if (f)
        f[1] && (t.Subtype = xi(f[1])), r = Vi(f[2]);
      else {
        if (r = Or.readFileSync(n), !r)
          throw new Error(`Could not read contents of file at filepath ${n}`);
        const {
          birthtime: u,
          ctime: c
        } = Or.statSync(n);
        t.Params.CreationDate = u, t.Params.ModDate = c;
      }
    }
    e.creationDate instanceof Date && (t.Params.CreationDate = e.creationDate), e.modifiedDate instanceof Date && (t.Params.ModDate = e.modifiedDate), e.type && (t.Subtype = xi(e.type));
    const s = W5(new Uint8Array(r));
    t.Params.CheckSum = new String(s), t.Params.Size = r.byteLength;
    let i;
    this._fileRegistry || (this._fileRegistry = {});
    let a = this._fileRegistry[e.name];
    a && Ox(t, a) ? i = a.ref : (i = this.ref(t), i.end(r), this._fileRegistry[e.name] = {
      ...t,
      ref: i
    });
    const o = {
      Type: "Filespec",
      AFRelationship: e.relationship,
      F: new String(e.name),
      EF: {
        F: i
      },
      UF: new String(e.name)
    };
    e.description && (o.Desc = new String(e.description));
    const l = this.ref(o);
    return l.end(), e.hidden || this.addNamedEmbeddedFile(e.name, l), this._root.data.AF ? this._root.data.AF.push(l) : this._root.data.AF = [l], l;
  }
};
function Ox(n, e) {
  return n.Subtype === e.Subtype && n.Params.CheckSum.toString() === e.Params.CheckSum.toString() && n.Params.Size === e.Params.Size && no(n.Params.CreationDate, e.Params.CreationDate) && no(n.Params.ModDate, e.Params.ModDate);
}
function no(n, e) {
  return n === void 0 || e === void 0 ? n === e : n.getTime() === e.getTime();
}
const cc = new URL("data:application/octet-stream;base64,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", import.meta.url).href;
let cn;
var Dx = {
  initPDFA(n) {
    n.charAt(n.length - 3) === "-" ? (this.subset_conformance = n.charAt(n.length - 1).toUpperCase(), this.subset = parseInt(n.charAt(n.length - 2))) : (this.subset_conformance = "B", this.subset = parseInt(n.charAt(n.length - 1)));
  },
  endSubset() {
    this._addPdfaMetadata(), this._addColorOutputIntent();
  },
  _addColorOutputIntent() {
    cn || (cn = Or.readFileSync(cc));
    const n = this.ref({
      Length: cn.length,
      N: 3
    });
    n.write(cn), n.end();
    const e = this.ref({
      Type: "OutputIntent",
      S: "GTS_PDFA1",
      Info: new String("sRGB IEC61966-2.1"),
      OutputConditionIdentifier: new String("sRGB IEC61966-2.1"),
      DestOutputProfile: n
    });
    e.end(), this._root.data.OutputIntents = [e];
  },
  _getPdfaid() {
    return `
        <rdf:Description xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/" rdf:about="">
            <pdfaid:part>${this.subset}</pdfaid:part>
            <pdfaid:conformance>${this.subset_conformance}</pdfaid:conformance>
        </rdf:Description>
        `;
  },
  _addPdfaMetadata() {
    this.appendXML(this._getPdfaid());
  }
}, Mx = {
  initPDFUA() {
    this.subset = 1;
  },
  endSubset() {
    this._addPdfuaMetadata();
  },
  _addPdfuaMetadata() {
    this.appendXML(this._getPdfuaid());
  },
  _getPdfuaid() {
    return `
        <rdf:Description xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/" rdf:about="">
            <pdfuaid:part>${this.subset}</pdfuaid:part>
        </rdf:Description>
        `;
  }
}, Lx = {
  _importSubset(n) {
    Object.assign(this, n);
  },
  initSubset(n) {
    switch (n.subset) {
      case "PDF/A-1":
      case "PDF/A-1a":
      case "PDF/A-1b":
      case "PDF/A-2":
      case "PDF/A-2a":
      case "PDF/A-2b":
      case "PDF/A-3":
      case "PDF/A-3a":
      case "PDF/A-3b":
        this._importSubset(Dx), this.initPDFA(n.subset);
        break;
      case "PDF/UA":
        this._importSubset(Mx), this.initPDFUA();
        break;
    }
  }
};
const Rx = ["height", "minHeight", "maxHeight"], Ux = ["width", "minWidth", "maxWidth"];
function so(n, e) {
  const t = /* @__PURE__ */ new Map();
  return function(...r) {
    const s = r[0];
    return t.has(s) || (t.set(s, n(...r)), t.size > e && t.delete(t.keys().next())), t.get(s);
  };
}
function js(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
function ss(n, ...e) {
  if (!js(n)) return n;
  n = gi(n);
  for (const t of e)
    if (js(t))
      for (const r in t)
        js(t[r]) ? (r in n || (n[r] = {}), n[r] = ss(n[r], t[r])) : t[r] !== void 0 && (n[r] = gi(t[r]));
  return n;
}
function gi(n) {
  let e = n;
  if (n && typeof n == "object") {
    e = Array.isArray(n) ? [] : {};
    for (const t in n) e[t] = gi(n[t]);
  }
  return e;
}
function Nx(n) {
  let e = n;
  typeof e != "object" && (e = {
    text: e
  });
  const t = Object.fromEntries(Object.entries(e).filter(([s]) => Rx.includes(s))), r = Object.fromEntries(Object.entries(e).filter(([s]) => Ux.includes(s)));
  return e.padding = Ke(e.padding), e.border = Ke(e.border), e.borderColor = Ke(e.borderColor), e.align = is(e.align), {
    defaultStyle: e,
    defaultRowStyle: t,
    defaultColStyle: r
  };
}
function zx(n, e, t) {
  let r = e(t);
  (r == null || typeof r != "object") && (r = {
    height: r
  }), r.padding = Ke(r.padding), r.border = Ke(r.border), r.borderColor = Ke(r.borderColor), r.align = is(r.align), r = ss(n, r);
  const s = this.document, i = s.page, a = i.contentHeight;
  return r.height == null || r.height === "auto" ? r.height = "auto" : r.height = s.sizeToPoint(r.height, 0, i, a), r.minHeight = s.sizeToPoint(r.minHeight, 0, i, a), r.maxHeight = s.sizeToPoint(r.maxHeight, 0, i, a), r;
}
function Gx(n, e, t) {
  let r = e(t);
  return (r == null || typeof r != "object") && (r = {
    width: r
  }), r.padding = Ke(r.padding), r.border = Ke(r.border), r.borderColor = Ke(r.borderColor), r.align = is(r.align), r = ss(n, r), r.width == null || r.width === "*" ? r.width = "*" : r.width = this.document.sizeToPoint(r.width, 0, this.document.page, this._maxWidth), r.minWidth = this.document.sizeToPoint(r.minWidth, 0, this.document.page, this._maxWidth), r.maxWidth = this.document.sizeToPoint(r.maxWidth, 0, this.document.page, this._maxWidth), r;
}
function is(n) {
  return n == null || typeof n == "string" ? {
    x: n,
    y: n
  } : n;
}
function Hx() {
  var l, f;
  const n = this.document, e = this.opts;
  let t = n._tableIndex++;
  this._id = new String(e.id ?? `table-${t}`), this._position = {
    x: n.sizeToPoint((l = e.position) == null ? void 0 : l.x, n.x),
    y: n.sizeToPoint((f = e.position) == null ? void 0 : f.y, n.y)
  }, this._maxWidth = n.sizeToPoint(e.maxWidth, n.page.width - n.page.margins.right - this._position.x);
  const {
    defaultStyle: r,
    defaultColStyle: s,
    defaultRowStyle: i
  } = Nx(e.defaultStyle);
  this._defaultStyle = r;
  let a;
  e.columnStyles && (Array.isArray(e.columnStyles) ? a = (u) => e.columnStyles[u] : typeof e.columnStyles == "function" ? a = so((u) => e.columnStyles(u), 1 / 0) : typeof e.columnStyles == "object" && (a = () => e.columnStyles)), a || (a = () => ({})), this._colStyle = Gx.bind(this, s, a);
  let o;
  e.rowStyles && (Array.isArray(e.rowStyles) ? o = (u) => e.rowStyles[u] : typeof e.rowStyles == "function" ? o = so((u) => e.rowStyles(u), 10) : typeof e.rowStyles == "object" && (o = () => e.rowStyles)), o || (o = () => ({})), this._rowStyle = zx.bind(this, i, o);
}
function Wx(n) {
  return n != null && (n = `${n}`), n;
}
function Vx(n, e, t) {
  var x;
  const r = this._colStyle(t);
  let s = this._rowStyle(e);
  const i = {};
  for (const g of [r.font, s.font, n.font])
    g != null && (g.src != null ? (i.src = g.src, i.family = g.family) : g.family != null && (i.family = g.family), g.size != null && (i.size = g.size));
  const a = Object.values(i).filter((g) => g != null).length > 0, o = this.document, l = o._fontSource, f = o._fontSize, u = o._fontFamily;
  a && (i.src && o.font(i.src, i.family), i.size && o.fontSize(i.size), s = this._rowStyle(e)), n.padding = Ke(n.padding), n.border = Ke(n.border), n.borderColor = Ke(n.borderColor);
  const c = ss(this._defaultStyle, r, s, n);
  return c.rowIndex = e, c.colIndex = t, c.font = i ?? {}, c.customFont = a, c.text = Wx(c.text), c.rowSpan = c.rowSpan ?? 1, c.colSpan = c.colSpan ?? 1, c.padding = Ke(c.padding, "0.25em", (g) => o.sizeToPoint(g, "0.25em")), c.border = Ke(c.border, 1, (g) => o.sizeToPoint(g, 1)), c.borderColor = Ke(c.borderColor, "black", (g) => g ?? "black"), c.align = is(c.align), c.align.x = c.align.x ?? "left", c.align.y = c.align.y ?? "top", c.textStroke = o.sizeToPoint(c.textStroke, 0), c.textStrokeColor = c.textStrokeColor ?? "black", c.textColor = c.textColor ?? "black", c.textOptions = c.textOptions ?? {}, c.id = new String(c.id ?? `${this._id}-${e}-${t}`), c.type = ((x = c.type) == null ? void 0 : x.toUpperCase()) === "TH" ? "TH" : "TD", c.scope && (c.scope = c.scope.toLowerCase(), c.scope === "row" ? c.scope = "Row" : c.scope === "both" ? c.scope = "Both" : c.scope === "column" && (c.scope = "Column")), typeof this.opts.debug == "boolean" && (c.debug = this.opts.debug), a && o.font(l, u, f), c;
}
function _x(n, e) {
  this._cellClaim || (this._cellClaim = /* @__PURE__ */ new Set());
  let t = 0;
  return n.map((r) => {
    for ((r == null || typeof r != "object") && (r = {
      text: r
    }); this._cellClaim.has(`${e},${t}`); )
      t++;
    r = Vx.call(this, r, e, t);
    for (let s = 0; s < r.rowSpan; s++)
      for (let i = 0; i < r.colSpan; i++)
        this._cellClaim.add(`${e + s},${t + i}`);
    return t += r.colSpan, r;
  });
}
function qx(n) {
  this._columnWidths = [], $x.call(this, n.reduce((e, t) => e + t.colSpan, 0)), this._rowHeights = [], this._rowYPos = [this._position.y], this._rowBuffer = /* @__PURE__ */ new Set();
}
function $x(n) {
  let e = [], t = 0, r = this._maxWidth;
  for (let a = 0; a < n; a++) {
    let o = this._colStyle(a);
    o.width === "*" ? (e[a] = o, t += o.minWidth) : (r -= o.width, this._columnWidths[a] = o.width);
  }
  let s = e.reduce((a) => a + 1, 0);
  t >= r ? e.forEach((a, o) => {
    this._columnWidths[o] = a.minWidth;
  }) : s > 0 && e.forEach((a, o) => {
    let l = r / s;
    this._columnWidths[o] = Math.max(l, a.minWidth), a.maxWidth > 0 && (this._columnWidths[o] = Math.min(this._columnWidths[o], a.maxWidth)), r -= this._columnWidths[o], s--;
  });
  let i = this._position.x;
  this._columnXPos = Array.from(this._columnWidths, (a) => {
    const o = i;
    return i += a, o;
  });
}
function Xx(n, e) {
  n.forEach((a) => this._rowBuffer.add(a)), e > 0 && (this._rowYPos[e] = this._rowYPos[e - 1] + this._rowHeights[e - 1]);
  const t = this._rowStyle(e);
  let r = [];
  this._rowBuffer.forEach((a) => {
    a.rowIndex + a.rowSpan - 1 === e && (r.push(io.call(this, a, t.height)), this._rowBuffer.delete(a));
  });
  let s = t.height;
  s === "auto" && (s = r.reduce((a, o) => {
    let l = o.textBounds.height + o.padding.top + o.padding.bottom;
    for (let f = 0; f < o.rowSpan - 1; f++)
      l -= this._rowHeights[o.rowIndex + f];
    return Math.max(a, l);
  }, 0)), s = Math.max(s, t.minHeight), t.maxHeight > 0 && (s = Math.min(s, t.maxHeight)), this._rowHeights[e] = s;
  let i = !1;
  return s > this.document.page.contentHeight ? (console.warn(new Error(`Row ${e} requested more than the safe page height, row has been clamped`).stack.slice(7)), this._rowHeights[e] = this.document.page.maxY() - this._rowYPos[e]) : this._rowYPos[e] + s >= this.document.page.maxY() && (this._rowYPos[e] = this.document.page.margins.top, i = !0), {
    newPage: i,
    toRender: r.map((a) => io.call(this, a, s))
  };
}
function io(n, e) {
  var c, x, g;
  let t = 0;
  for (let m = 0; m < n.colSpan; m++)
    t += this._columnWidths[n.colIndex + m];
  let r = e;
  if (r === "auto")
    r = this.document.page.contentHeight;
  else
    for (let m = 0; m < n.rowSpan - 1; m++)
      r += this._rowHeights[n.rowIndex + m];
  const s = t - n.padding.left - n.padding.right, i = r - n.padding.top - n.padding.bottom, a = n.textOptions.rotation ?? 0, {
    width: o,
    height: l
  } = jx(a, s, i), f = {
    align: n.align.x,
    ellipsis: !0,
    stroke: n.textStroke > 0,
    fill: !0,
    width: o,
    height: l,
    rotation: a,
    ...n.textOptions
  };
  let u = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  if (n.text) {
    const m = this.document._fontSource, v = this.document._fontSize, E = this.document._fontFamily;
    (c = n.font) != null && c.src && this.document.font(n.font.src, (x = n.font) == null ? void 0 : x.family), (g = n.font) != null && g.size && this.document.fontSize(n.font.size);
    const C = this.document.boundsOfString(n.text, 0, 0, {
      ...f,
      rotation: 0
    });
    f.width = C.width, f.height = C.height, u = this.document.boundsOfString(n.text, 0, 0, f), this.document.font(m, E, v);
  }
  return {
    ...n,
    textOptions: f,
    x: this._columnXPos[n.colIndex],
    y: this._rowYPos[n.rowIndex],
    textX: this._columnXPos[n.colIndex] + n.padding.left,
    textY: this._rowYPos[n.rowIndex] + n.padding.top,
    width: t,
    height: r,
    textAllocatedHeight: i,
    textAllocatedWidth: s,
    textBounds: u
  };
}
function jx(n, e, t) {
  let r, s;
  const i = ql(n), a = $l(n);
  n === 0 || n === 180 ? (r = e, s = t) : n === 90 || n === 270 ? (r = t, s = e) : n < 90 || n > 180 && n < 270 ? (r = e / (2 * i), s = e / (2 * a)) : (s = e / (2 * i), r = e / (2 * a));
  const o = a * r, l = i * s;
  if (o + l > t) {
    const f = i * i - a * a;
    n === 0 || n === 180 ? (r = e, s = t) : n === 90 || n === 270 ? (r = t, s = e) : n < 90 || n > 180 && n < 270 ? (r = (e * i - t * a) / f, s = (t * i - e * a) / f) : (s = (e * i - t * a) / f, r = (t * i - e * a) / f);
  }
  return {
    width: Math.abs(r),
    height: Math.abs(s)
  };
}
function Yx() {
  const n = this.opts.structParent;
  n && (this._tableStruct = this.document.struct("Table"), this._tableStruct.dictionary.data.ID = this._id, n instanceof _0 ? n.add(this._tableStruct) : n instanceof Dr && n.addStructure(this._tableStruct), this._headerRowLookup = {}, this._headerColumnLookup = {});
}
function Kx() {
  this._tableStruct && this._tableStruct.end();
}
function Zx(n, e, t) {
  const r = this.document.struct("TR");
  r.dictionary.data.ID = new String(`${this._id}-${e}`), this._tableStruct.add(r), n.forEach((s) => t(s, r)), r.end();
}
function Jx(n, e, t) {
  const r = this.document, s = r.struct(n.type, {
    title: n.title
  });
  s.dictionary.data.ID = n.id, e.add(s);
  const i = n.padding, a = n.border, o = {
    O: "Table",
    Width: n.width,
    Height: n.height,
    Padding: [i.top, i.bottom, i.left, i.right],
    RowSpan: n.rowSpan > 1 ? n.rowSpan : void 0,
    ColSpan: n.colSpan > 1 ? n.colSpan : void 0,
    BorderThickness: [a.top, a.bottom, a.left, a.right]
  };
  if (n.type === "TH") {
    if (n.scope === "Row" || n.scope === "Both") {
      for (let c = 0; c < n.rowSpan; c++)
        this._headerRowLookup[n.rowIndex + c] || (this._headerRowLookup[n.rowIndex + c] = []), this._headerRowLookup[n.rowIndex + c].push(n.id);
      o.Scope = n.scope;
    }
    if (n.scope === "Column" || n.scope === "Both") {
      for (let c = 0; c < n.colSpan; c++)
        this._headerColumnLookup[n.colIndex + c] || (this._headerColumnLookup[n.colIndex + c] = []), this._headerColumnLookup[n.colIndex + c].push(n.id);
      o.Scope = n.scope;
    }
  }
  const l = new Set([...Array.from({
    length: n.colSpan
  }, (c, x) => this._headerColumnLookup[n.colIndex + x]).flat(), ...Array.from({
    length: n.rowSpan
  }, (c, x) => this._headerRowLookup[n.rowIndex + x]).flat()].filter(Boolean));
  l.size && (o.Headers = Array.from(l));
  const f = r._normalizeColor;
  n.backgroundColor != null && (o.BackgroundColor = f(n.backgroundColor));
  const u = [a.top, a.bottom, a.left, a.right];
  if (u.some((c) => c)) {
    const c = n.borderColor;
    o.BorderColor = [u[0] ? f(c.top) : null, u[1] ? f(c.bottom) : null, u[2] ? f(c.left) : null, u[3] ? f(c.right) : null];
  }
  Object.keys(o).forEach((c) => o[c] === void 0 && delete o[c]), s.dictionary.data.A = r.ref(o), s.add(t), s.end(), s.dictionary.data.A.end();
}
function Qx(n, e) {
  return this._tableStruct ? Zx.call(this, n, e, ao.bind(this)) : n.forEach((t) => ao.call(this, t)), this._rowYPos[e] + this._rowHeights[e];
}
function ao(n, e) {
  const t = () => {
    n.backgroundColor != null && this.document.save().fillColor(n.backgroundColor).rect(n.x, n.y, n.width, n.height).fill().restore(), t8.call(this, n.border, n.borderColor, n.x, n.y, n.width, n.height), n.debug && (this.document.save(), this.document.dash(1, {
      space: 1
    }).lineWidth(1).strokeOpacity(0.3), this.document.rect(n.x, n.y, n.width, n.height).stroke("green"), this.document.restore()), n.text && e8.call(this, n);
  };
  e ? Jx.call(this, n, e, t) : t();
}
function e8(n) {
  const e = this.document, t = e._fontSource, r = e._fontSize, s = e._fontFamily;
  n.customFont && (n.font.src && e.font(n.font.src, n.font.family), n.font.size && e.fontSize(n.font.size));
  const i = n.textX, a = n.textY, o = n.textAllocatedHeight, l = n.textAllocatedWidth, f = n.textBounds.width, u = n.textBounds.height, c = -n.textBounds.x, x = -n.textBounds.y, g = n.align.x === "right" ? 1 : n.align.x === "center" ? 0.5 : 0, m = (l - f) * g, v = n.align.y === "bottom" ? 1 : n.align.y === "center" ? 0.5 : 0, E = (o - u) * v, C = m + c, y = E + x;
  n.debug && (e.save(), e.dash(1, {
    space: 1
  }).lineWidth(1).strokeOpacity(0.3), n.text && e.moveTo(i + m, a).lineTo(i + m, a + o).moveTo(i + m + f, a).lineTo(i + m + f, a + o).stroke("blue").moveTo(i, a + E).lineTo(i + l, a + E).moveTo(i, a + E + u).lineTo(i + l, a + E + u).stroke("green"), e.rect(i, a, l, o).stroke("orange"), e.restore()), e.save().rect(i, a, l, o).clip(), e.fillColor(n.textColor).strokeColor(n.textStrokeColor), n.textStroke > 0 && e.lineWidth(n.textStroke), e.text(n.text, i + C, a + y, n.textOptions), e.restore(), n.font && e.font(t, s, r);
}
function t8(n, e, t, r, s, i, a) {
  n = Object.fromEntries(Object.entries(n).map(([l, f]) => [l, a && !a[l] ? 0 : f]));
  const o = this.document;
  [n.right, n.bottom, n.left].every((l) => l === n.top) ? n.top > 0 && o.save().lineWidth(n.top).strokeColor(e.top).rect(t, r, s, i).stroke().restore() : (n.top > 0 && o.save().lineWidth(n.top).moveTo(t, r).strokeColor(e.top).lineTo(t + s, r).stroke().restore(), n.right > 0 && o.save().lineWidth(n.right).moveTo(t + s, r).strokeColor(e.right).lineTo(t + s, r + i).stroke().restore(), n.bottom > 0 && o.save().lineWidth(n.bottom).moveTo(t + s, r + i).strokeColor(e.bottom).lineTo(t, r + i).stroke().restore(), n.left > 0 && o.save().lineWidth(n.left).moveTo(t, r + i).strokeColor(e.left).lineTo(t, r).stroke().restore());
}
class r8 {
  constructor(e, t = {}) {
    if (this.document = e, this.opts = Object.freeze(t), Hx.call(this), Yx.call(this), this._currRowIndex = 0, this._ended = !1, t.data) {
      for (const r of t.data) this.row(r);
      return this.end();
    }
  }
  row(e, t = !1) {
    if (this._ended)
      throw new Error(`Table was marked as ended on row ${this._currRowIndex}`);
    e = Array.from(e), e = _x.call(this, e, this._currRowIndex), this._currRowIndex === 0 && qx.call(this, e);
    const {
      newPage: r,
      toRender: s
    } = Xx.call(this, e, this._currRowIndex);
    r && this.document.continueOnNewPage();
    const i = Qx.call(this, s, this._currRowIndex);
    return this.document.x = this._position.x, this.document.y = i, t ? this.end() : (this._currRowIndex++, this);
  }
  end() {
    var e;
    for (; (e = this._rowBuffer) != null && e.size; ) this.row([]);
    return this._ended = !0, Kx.call(this), this.document;
  }
}
var n8 = {
  initTables() {
    this._tableIndex = 0;
  },
  table(n) {
    return new r8(this, n);
  }
};
class s8 {
  constructor() {
    this._metadata = `
        <?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
            <x:xmpmeta xmlns:x="adobe:ns:meta/">
                <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        `;
  }
  _closeTags() {
    this._metadata = this._metadata.concat(`
                </rdf:RDF>
            </x:xmpmeta>
        <?xpacket end="w"?>
        `);
  }
  append(e, t = !0) {
    this._metadata = this._metadata.concat(e), t && (this._metadata = this._metadata.concat(`
`));
  }
  getXML() {
    return this._metadata;
  }
  getLength() {
    return this._metadata.length;
  }
  end() {
    this._closeTags(), this._metadata = this._metadata.trim();
  }
}
var i8 = {
  initMetadata() {
    this.metadata = new s8();
  },
  appendXML(n, e = !0) {
    this.metadata.append(n, e);
  },
  _addInfo() {
    this.appendXML(`
        <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
            <xmp:CreateDate>${this.info.CreationDate.toISOString().split(".")[0] + "Z"}</xmp:CreateDate>
            <xmp:CreatorTool>${this.info.Creator}</xmp:CreatorTool>
        </rdf:Description>
        `), (this.info.Title || this.info.Author || this.info.Subject) && (this.appendXML(`
            <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
            `), this.info.Title && this.appendXML(`
                <dc:title>
                    <rdf:Alt>
                        <rdf:li xml:lang="x-default">${this.info.Title}</rdf:li>
                    </rdf:Alt>
                </dc:title>
                `), this.info.Author && this.appendXML(`
                <dc:creator>
                    <rdf:Seq>
                        <rdf:li>${this.info.Author}</rdf:li>
                    </rdf:Seq>
                </dc:creator>
                `), this.info.Subject && this.appendXML(`
                <dc:description>
                    <rdf:Alt>
                        <rdf:li xml:lang="x-default">${this.info.Subject}</rdf:li>
                    </rdf:Alt>
                </dc:description>
                `), this.appendXML(`
            </rdf:Description>
            `)), this.appendXML(`
        <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
            <pdf:Producer>${this.info.Producer}</pdf:Producer>`, !1), this.info.Keywords && this.appendXML(`
            <pdf:Keywords>${this.info.Keywords}</pdf:Keywords>`, !1), this.appendXML(`
        </rdf:Description>
        `);
  },
  endMetadata() {
    this._addInfo(), this.metadata.end(), this.version != 1.3 && (this.metadataRef = this.ref({
      length: this.metadata.getLength(),
      Type: "Metadata",
      Subtype: "XML"
    }), this.metadataRef.compress = !1, this.metadataRef.write(new TextEncoder().encode(this.metadata.getXML())), this.metadataRef.end(), this._root.data.Metadata = this.metadataRef);
  }
};
class Dr extends u5 {
  constructor(e = {}) {
    switch (super(e), this.options = e, e.pdfVersion) {
      case "1.4":
        this.version = 1.4;
        break;
      case "1.5":
        this.version = 1.5;
        break;
      case "1.6":
        this.version = 1.6;
        break;
      case "1.7":
      case "1.7ext3":
        this.version = 1.7;
        break;
      default:
        this.version = 1.3;
        break;
    }
    this.compress = this.options.compress != null ? this.options.compress : !0, this._pageBuffer = [], this._pageBufferStart = 0, this._offsets = [], this._waiting = 0, this._ended = !1, this._offset = 0;
    const t = this.ref({
      Type: "Pages",
      Count: 0,
      Kids: []
    }), r = this.ref({
      Dests: new Hs()
    });
    if (this._root = this.ref({
      Type: "Catalog",
      Pages: t,
      Names: r
    }), this.options.lang && (this._root.data.Lang = new String(this.options.lang)), this.options.pageLayout) {
      const s = this.options.pageLayout;
      this._root.data.PageLayout = s.charAt(0).toUpperCase() + s.slice(1);
    }
    if (this.page = null, this.initMetadata(), this.initColor(), this.initVector(), this.initFonts(e.font), this.initText(), this.initImages(), this.initOutline(), this.initMarkings(e), this.initTables(), this.initSubset(e), this.info = {
      Producer: "PDFKit",
      Creator: "PDFKit",
      CreationDate: /* @__PURE__ */ new Date()
    }, this.options.info)
      for (let s in this.options.info) {
        const i = this.options.info[s];
        this.info[s] = i;
      }
    this.options.displayTitle && (this._root.data.ViewerPreferences = this.ref({
      DisplayDocTitle: !0
    })), this._id = V0.generateFileID(this.info), this._security = V0.create(this, e), this._write(`%PDF-${this.version}`), this._write("%ÿÿÿÿ"), this.options.autoFirstPage !== !1 && this.addPage();
  }
  addPage(e) {
    const t = this.options;
    t.bufferPages || this.flushPages();
    const r = e == null ? void 0 : e.font;
    r && this.font(r, e.fontFamily);
    const s = e == null ? void 0 : e.fontSize;
    s && this.fontSize(s), this.page = new S5(this, e || t), this._pageBuffer.push(this.page);
    const i = this._root.data.Pages.data;
    return i.Kids.push(this.page.dictionary), i.Count++, this.x = this.page.margins.left, this.y = this.page.margins.top, this._ctm = [1, 0, 0, 1, 0, 0], this.transform(1, 0, 0, -1, 0, this.page.height), this.emit("pageAdded"), this;
  }
  continueOnNewPage(e) {
    const t = this.endPageMarkings(this.page);
    return this.addPage(e ?? this.page._options), this.initPageMarkings(t), this;
  }
  bufferedPageRange() {
    return {
      start: this._pageBufferStart,
      count: this._pageBuffer.length
    };
  }
  switchToPage(e) {
    let t;
    if (!(t = this._pageBuffer[e - this._pageBufferStart]))
      throw new Error(`switchToPage(${e}) out of bounds, current buffer covers pages ${this._pageBufferStart} to ${this._pageBufferStart + this._pageBuffer.length - 1}`);
    return this.page = t;
  }
  flushPages() {
    const e = this._pageBuffer;
    this._pageBuffer = [], this._pageBufferStart += e.length;
    for (let t of e)
      this.endPageMarkings(t), t.end();
  }
  addNamedDestination(e, ...t) {
    t.length === 0 && (t = ["XYZ", null, null, null]), t[0] === "XYZ" && t[2] !== null && (t[2] = this.page.height - t[2]), t.unshift(this.page.dictionary), this._root.data.Names.data.Dests.add(e, t);
  }
  addNamedEmbeddedFile(e, t) {
    if (!t)
      throw new Error(`No ref specified for embedded file ${e}`);
    this._root.data.Names.data.EmbeddedFiles || (this._root.data.Names.data.EmbeddedFiles = new Hs({
      limits: !1
    })), this._root.data.Names.data.EmbeddedFiles.add(e, t);
  }
  addNamedJavaScript(e, t) {
    this._root.data.Names.data.JavaScript || (this._root.data.Names.data.JavaScript = new Hs());
    let r = {
      JS: new String(t),
      S: "JavaScript"
    };
    this._root.data.Names.data.JavaScript.add(e, r);
  }
  ref(e) {
    const t = new m5(this, this._offsets.length + 1, e);
    return this._offsets.push(null), this._waiting++, t;
  }
  _read() {
  }
  _write(e) {
    e instanceof Uint8Array || (e = Gn(e + `
`)), this.push(e), this._offset += e.length;
  }
  addContent(e) {
    return this.page.write(e), this;
  }
  _refEnd(e) {
    this._offsets[e.id - 1] = e.offset, --this._waiting === 0 && this._ended && (this._finalize(), this._ended = !1);
  }
  end() {
    this.flushPages(), this._info = this.ref();
    for (let e in this.info) {
      let t = this.info[e];
      typeof t == "string" && (t = new String(t));
      let r = this.ref(t);
      r.end(), this._info.data[e] = r;
    }
    this._info.end();
    for (let e in this._fontFamilies)
      this._fontFamilies[e].finalize();
    this.endOutline(), this.endMarkings(), this.subset && this.endSubset(), this.endMetadata(), this._root.end(), this._root.data.Pages.end(), this._root.data.Names.end(), this.endAcroForm(), this._root.data.ViewerPreferences && this._root.data.ViewerPreferences.end(), this._security && this._security.end(), this._waiting === 0 ? this._finalize() : this._ended = !0;
  }
  _finalize() {
    const e = this._offset;
    this._write("xref"), this._write(`0 ${this._offsets.length + 1}`), this._write("0000000000 65535 f ");
    for (let r of this._offsets)
      r = `0000000000${r}`.slice(-10), this._write(r + " 00000 n ");
    const t = {
      Size: this._offsets.length + 1,
      Root: this._root,
      Info: this._info,
      ID: [this._id, this._id]
    };
    this._security && (t.Encrypt = this._security.dictionary), this._write("trailer"), this._write(o0.convert(t)), this._write("startxref"), this._write(`${e}`), this._write("%%EOF"), this.push(null);
  }
  toString() {
    return "[object PDFDocument]";
  }
}
const l0 = (n) => {
  Object.assign(Dr.prototype, n);
};
l0(i8);
l0($6);
l0(tx);
l0(hx);
l0(xx);
l0(wx);
l0(vx);
l0(yx);
l0(Sx);
l0(Fx);
l0(Bx);
l0(Lx);
l0(n8);
var a8 = "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";
ac(cc, Vi(a8));
const o8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LineWrapper: mn,
  PDFDocument: Dr,
  default: Dr,
  registerFile: ac,
  registerStdFonts: lx
}, Symbol.toStringTag, { value: "Module" }));
var h0 = "space exclam quotedbl numbersign dollar percent ampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash zero one two three four five six seven eight nine colon semicolon less equal greater question at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z bracketleft backslash bracketright asciicircum underscore grave a b c d e f g h i j k l m n o p q r s t u v w x y z braceleft bar braceright asciitilde Euro quotesinglbase florin quotedblbase ellipsis dagger daggerdbl circumflex perthousand Scaron guilsinglleft OE Zcaron quoteleft quoteright quotedblleft quotedblright bullet endash emdash tilde trademark scaron guilsinglright oe zcaron ydieresis exclamdown cent sterling currency yen brokenbar section dieresis copyright ordfeminine guillemotleft logicalnot registered macron degree plusminus twosuperior threesuperior acute mu paragraph periodcentered cedilla onesuperior ordmasculine guillemotright onequarter onehalf threequarters questiondown Agrave Aacute Acircumflex Atilde Adieresis Aring AE Ccedilla Egrave Eacute Ecircumflex Edieresis Igrave Iacute Icircumflex Idieresis Eth Ntilde Ograve Oacute Ocircumflex Otilde Odieresis multiply Oslash Ugrave Uacute Ucircumflex Udieresis Yacute Thorn germandbls agrave aacute acircumflex atilde adieresis aring ae ccedilla egrave eacute ecircumflex edieresis igrave iacute icircumflex idieresis eth ntilde ograve oacute ocircumflex otilde odieresis divide oslash ugrave uacute ucircumflex udieresis yacute thorn", l8 = {
  name: "Courier",
  bbox: [-23, -250, 715, 805],
  ascender: 629,
  descender: -157,
  xHeight: 426,
  capHeight: 562,
  glyphNames: h0,
  glyphWidths: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
  kernPairs: []
}, c8 = {
  name: "Courier-Bold",
  bbox: [-113, -250, 749, 801],
  ascender: 629,
  descender: -157,
  xHeight: 439,
  capHeight: 562,
  glyphNames: h0,
  glyphWidths: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
  kernPairs: []
}, f8 = {
  name: "Courier-BoldOblique",
  bbox: [-57, -250, 869, 801],
  ascender: 629,
  descender: -157,
  xHeight: 439,
  capHeight: 562,
  glyphNames: h0,
  glyphWidths: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
  kernPairs: []
}, u8 = {
  name: "Courier-Oblique",
  bbox: [-27, -250, 849, 805],
  ascender: 629,
  descender: -157,
  xHeight: 426,
  capHeight: 562,
  glyphNames: h0,
  glyphWidths: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
  kernPairs: []
}, h8 = {
  name: "Helvetica",
  bbox: [-166, -225, 1e3, 931],
  ascender: 718,
  descender: -207,
  xHeight: 523,
  capHeight: 718,
  glyphNames: h0,
  glyphWidths: [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 556, 222, 556, 333, 1e3, 556, 556, 333, 1e3, 667, 333, 1e3, 611, 222, 222, 333, 333, 350, 556, 1e3, 333, 1e3, 500, 333, 944, 500, 500, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667, 667, 667, 667, 1e3, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556],
  kernPairs: [-180, [10332, 2], -160, [9569], -150, [8182, 2], -140, [9517, 54, 70, 1552, 1074, 1, 1, 51, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 26464, 1, 1, 51, 4, 10, 105, 1, 1, 2, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2], -125, [11622, 2], -120, [7147, 3206, 119, 1, 1, 1, 1, 1, 715, 2, 19, 32, 4, 10, 3, 3, 2, 2, 63, 1, 1, 1, 1, 1, 27, 1, 1, 2, 1, 4, 1, 1, 7, 1, 1, 2, 2, 1, 1, 1, 1, 1, 21339, 215, 215, 215, 215, 215], -110, [9512, 2, 2774, 52, 67, 1, 1, 1, 1, 1, 52, 1, 1, 1, 26481, 52, 67, 1, 1, 1, 1, 1, 52, 1, 1, 1], -100, [2689, 2, 428, 2, 4031, 124, 11871, 2, 6878, 2, 6708, 124, 91, 124, 91, 124, 91, 124, 91, 124, 91, 124, 11871, 2], -95, [44732, 2], -90, [57, 124, 7616, 124], -85, [12302, 123, 1, 1, 1, 1, 2, 26531, 123, 1, 1, 1, 1, 2, 5717], -80, [8203, 119, 1, 1, 1, 1, 1, 3296, 20, 36, 10, 73, 1, 1, 1, 1, 1, 35, 1, 1, 1, 7, 1, 1, 1, 1, 2, 19, 2, 6663, 2], -70, [7149, 603, 2, 40, 1721, 647, 124, 1389, 20, 99, 1, 1, 1, 1, 1, 20, 1, 1, 1, 11613, 9299, 215, 215, 215, 215, 215, 2798, 124, 91, 124, 91, 124, 91, 124, 91, 124, 306, 124, 1081, 5704, 1, 2, 32, 92], -60, [108, 2902, 7151, 1140, 66, 5, 13, 896, 1, 6435, 2, 17887, 215, 215, 215, 215, 430, 1045, 1], -57, [23328, 216], -55, [44785, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 27, 3, 64, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1], -50, [52, 2, 5536, 215, 1343, 2, 122, 1, 1, 1, 960, 119, 1, 1, 1, 1, 1, 933, 42, 32, 49, 1, 1, 1, 1, 2, 37, 701, 230, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 276, 3, 124, 927, 119, 1, 1, 1, 1, 1, 5660, 2, 5859, 14, 1, 34, 9181, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 2669, 215, 215, 215, 215, 430], -45, [8252], -40, [55, 7126, 1, 2, 32, 92, 465, 22, 97, 1, 1, 1, 1, 1, 1417, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 664, 2, 38, 228, 119, 1, 1, 1, 1, 1, 294, 124, 1, 1, 1, 297, 123, 1, 1, 1, 1, 2, 51, 2, 19, 119, 1, 1, 1, 1, 1, 84, 1, 12, 8, 123, 1, 1, 1, 1, 2, 52, 52, 119, 1, 1, 1, 1, 1, 2188, 2, 2793, 2, 6866, 8901, 1, 2, 32, 92, 88, 1, 2, 32, 92, 88, 1, 2, 32, 92, 88, 1, 2, 32, 92, 88, 1, 2, 32, 92, 88, 1, 2, 32, 92, 2594, 2, 38, 175, 2, 38, 175, 2, 38, 175, 2, 38, 175, 2, 38, 390, 2, 38, 175, 2, 19, 119, 1, 1, 1, 1, 1, 70, 2, 19, 119, 1, 1, 1, 1, 1, 70, 2, 19, 119, 1, 1, 1, 1, 1, 70, 2, 19, 119, 1, 1, 1, 1, 1, 4585, 2, 213, 2, 213, 2, 213, 2, 213, 2], -35, [17212, 2], -30, [110, 7020, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 230, 2, 700, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 664, 2, 286, 124, 1, 1, 1, 92, 32, 92, 487, 642, 3, 1089, 10, 6, 107, 1, 1, 1, 7, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2027, 32, 92, 733, 2, 139, 2, 51, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 311, 32, 92, 1380, 1, 32, 92, 91, 32, 92, 519, 1057, 123, 1, 1, 1, 6127, 7473, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 230, 2, 2406, 215, 215, 215, 215, 430, 1754, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 518, 2, 213, 2, 213, 2, 213, 2, 1505, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92], -25, [18555, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2], -20, [7322, 2, 1739, 32, 20, 67, 1, 1, 1, 1, 1, 27, 1, 1, 1, 1, 1, 20, 1, 1, 1, 896, 119, 1, 1, 1, 1, 1, 535, 123, 1, 1, 1, 1, 2, 51, 2, 227, 1, 665, 42, 32, 49, 1, 1, 1, 1, 2, 37, 290, 124, 1609, 1, 204, 9, 1, 3, 32, 88, 1, 1, 1, 1, 77, 442, 2, 32, 92, 1146, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 523, 2344, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 3029, 2, 3706, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 10360, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 306, 119, 1, 1, 1, 1, 1, 991, 124, 534, 1, 214, 1, 214, 1, 214, 1, 214, 1, 214, 1, 418, 227, 2, 32, 92, 89, 2, 32, 92, 89, 2, 32, 92, 89, 2, 32, 92, 1163, 2559, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2], -15, [14417, 430, 2, 1795, 32, 92, 91, 32, 92, 88, 1, 785, 2, 911, 119, 1, 1, 1, 1, 1, 525, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 5609, 2, 700, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 15069, 215, 2, 213, 2, 213, 2, 213, 2, 1365, 32, 92, 88, 1, 214, 1, 214, 1, 214, 1, 214, 1], -10, [7363, 124, 1, 1, 1, 3098, 124, 1, 1, 1, 3541, 1091, 1293, 124, 1, 1, 1, 88, 124, 1, 1, 1, 713, 119, 1, 1, 1, 1, 1, 955, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 24387, 124, 1, 1, 1], 15, [17703, 2, 1, 9, 111, 1, 1, 1, 10, 1, 1, 1], 25, [17707, 1, 123], 30, [17656, 1, 53, 6, 3, 32, 92], 40, [17714], 50, [15159], 60, [15161]]
}, d8 = {
  name: "Helvetica-Bold",
  bbox: [-170, -228, 1003, 962],
  ascender: 718,
  descender: -207,
  xHeight: 532,
  capHeight: 718,
  glyphNames: h0,
  glyphWidths: [278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 556, 278, 556, 500, 1e3, 556, 556, 333, 1e3, 667, 333, 1e3, 611, 278, 278, 500, 500, 350, 556, 1e3, 333, 1e3, 556, 333, 944, 500, 556, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 737, 333, 400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611, 722, 722, 722, 722, 722, 722, 1e3, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611],
  kernPairs: [-140, [9569, 2], -120, [57, 124, 2508, 2, 428, 2, 6396, 124, 691, 2, 859, 429, 2], -110, [7152, 124, 2238, 2774, 119, 1, 1, 1, 1, 1, 20325, 124, 91, 124, 91, 124, 91, 124, 91, 124, 91, 124, 5012, 119, 1, 1, 1, 1, 1], -100, [52, 8130, 2, 2169, 119, 1, 1, 1, 1, 1, 1790, 2, 65, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 26460, 2, 65, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1], -90, [7147, 2365, 1701, 52, 67, 1, 1, 1, 1, 1, 52, 1, 1, 1, 297, 123, 1, 1, 1, 1, 2, 502, 119, 1, 1, 1, 1, 1, 20288, 215, 215, 215, 215, 215, 5173, 119, 1, 1, 1, 1, 1], -80, [54, 1, 55, 7039, 1054, 119, 1, 1, 1, 1, 1, 1188, 1677, 2, 51, 14, 3, 102, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 2, 235, 20, 119, 1, 1, 1, 1, 1, 70, 2, 485, 123, 1, 1, 1, 6052, 2, 643, 2, 4286, 68, 362, 2162, 2, 6705, 215, 215, 215, 215, 215, 5175, 123, 1, 1, 1, 6697, 2], -70, [7797, 124, 2241, 124, 2016, 123, 1, 1, 1, 1, 2, 24176, 124, 91, 124, 91, 124, 91, 124, 91, 124, 306, 124, 941, 123, 1, 1, 1, 1, 2], -60, [108, 7042, 4099, 18, 2, 32, 71, 1, 1, 1, 18, 282, 20, 99, 1, 1, 1, 1, 1, 20, 1, 1, 1, 36, 46, 73, 1, 1, 1, 1, 1, 45, 1, 1, 1, 1, 2, 5609, 2, 5874, 34, 9183, 215, 215, 215, 215, 215], -50, [7134, 14, 124, 1, 1, 1, 2863, 21, 1, 1, 96, 1, 1, 1, 1, 1, 542, 3, 124, 497, 119, 1, 1, 1, 1, 1, 97, 8, 22, 101, 1, 1, 1, 1, 2, 16, 1, 1, 1, 476, 1, 20437, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 2648, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 21, 1, 1, 96, 1, 1, 1, 1, 1, 306, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 84, 1], -46, [23328, 216], -45, [11910, 124, 1, 1, 1], -40, [2580, 430, 2580, 215, 1325, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 502, 21, 1, 97, 1, 1, 1, 1, 1, 1437, 32, 92, 659, 2, 38, 242, 123, 1, 1, 1, 1, 2, 277, 401, 1, 20, 123, 1, 1, 1, 1, 2, 280, 1, 201, 52, 119, 1, 1, 1, 1, 1, 4842, 1861, 2, 4798, 9198, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 2631, 2, 38, 175, 2, 38, 175, 2, 38, 175, 2, 38, 175, 2, 38, 390, 2, 38, 5409], -35, [9324, 123, 1, 1, 1, 1, 2, 2441, 123, 1, 1, 1], -30, [7180, 2, 2, 32, 88, 1, 1, 1, 1, 35, 119, 1, 1, 1, 1, 1, 285, 2, 1538, 38, 85, 1, 1, 1, 1, 2, 33, 1, 1, 1, 92, 32, 92, 712, 4, 115, 1, 1, 1, 1, 1, 3, 1, 1, 1, 892, 2, 5235, 32, 92, 305, 1496, 123, 1, 1, 1, 1, 2, 502, 119, 1, 1, 1, 1, 1, 6756, 119, 1, 1, 1, 1, 1, 6561, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 4099, 2, 213, 2, 213, 2, 213, 2, 4804, 215, 215, 215, 215, 430, 1052, 119, 1, 1, 1, 1, 1], -25, [19214, 123, 1, 1, 1, 1, 2, 6751, 123, 1, 1, 1, 1, 2, 19651, 123, 1, 1, 1, 1, 2], -20, [8235, 119, 1, 1, 1, 1, 1, 683, 2, 19, 52, 67, 1, 1, 1, 1, 1, 52, 1, 1, 1, 1555, 5, 1, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 942, 42, 32, 49, 1, 1, 1, 1, 2, 37, 2026, 32, 92, 87, 1, 3, 32, 88, 1, 1, 1, 1, 77, 1, 648, 123, 1, 1, 1, 1, 2, 311, 32, 92, 947, 124, 1, 1, 1, 92, 32, 92, 88, 3, 32, 92, 445, 54, 1, 11, 2, 110, 11, 1, 1, 1, 1, 2, 717, 119, 1, 1, 1, 1, 1, 105, 123, 1, 1, 1, 1, 2, 4598, 10, 16128, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 292, 1, 2163, 32, 92, 88, 3, 32, 92, 88, 3, 32, 92, 88, 3, 32, 92, 88, 3, 32, 92, 88, 3, 32, 92, 303, 3, 32, 92], -15, [9314, 123, 1, 1, 1, 4621, 1, 644, 1, 2, 32, 92, 88, 1, 1, 1, 32, 92, 1156, 123, 1, 1, 1, 1, 2, 94, 2, 32, 92, 519, 217, 32, 92, 288, 12, 34, 185, 7310, 14404, 1, 214, 1, 214, 1, 214, 1, 214, 1, 214, 1, 644, 1, 1, 1, 32, 92, 88, 1, 1, 1, 32, 92, 88, 1, 1, 1, 32, 92, 88, 1, 1, 1, 32, 92, 1379, 215, 215, 215, 215, 430], -10, [7363, 124, 1, 1, 1, 3098, 124, 1, 1, 1, 1136, 1, 2194, 220, 211, 17, 32, 92, 70, 374, 2, 55, 123, 1, 1, 1, 91, 1519, 124, 1, 1, 1, 2007, 123, 1, 1, 1, 89, 123, 1, 1, 1, 6754, 123, 1, 1, 1, 13421, 215, 215, 215, 215, 215, 431, 17, 32, 92, 2022, 124, 1, 1, 1, 2437, 123, 1, 1, 1], 10, [14847, 487, 123, 1, 1, 1, 2256, 3, 32, 92, 1576, 123, 1, 1, 1, 6324, 123, 1, 1, 1, 15297, 215, 215, 215], 20, [10547, 2, 4300, 2865, 23580, 215, 215, 215], 30, [15159, 2]]
}, x8 = {
  name: "Helvetica-BoldOblique",
  bbox: [-174, -228, 1114, 962],
  ascender: 718,
  descender: -207,
  xHeight: 532,
  capHeight: 718,
  glyphNames: h0,
  glyphWidths: [278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 556, 278, 556, 500, 1e3, 556, 556, 333, 1e3, 667, 333, 1e3, 611, 278, 278, 500, 500, 350, 556, 1e3, 333, 1e3, 556, 333, 944, 500, 556, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 737, 333, 400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611, 722, 722, 722, 722, 722, 722, 1e3, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611],
  kernPairs: [-140, [9569, 2], -120, [57, 124, 2508, 2, 428, 2, 6396, 124, 691, 2, 859, 429, 2], -110, [7152, 124, 2238, 2774, 119, 1, 1, 1, 1, 1, 20325, 124, 91, 124, 91, 124, 91, 124, 91, 124, 91, 124, 5012, 119, 1, 1, 1, 1, 1], -100, [52, 8130, 2, 2169, 119, 1, 1, 1, 1, 1, 1790, 2, 65, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 26460, 2, 65, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1], -90, [7147, 2365, 1701, 52, 67, 1, 1, 1, 1, 1, 52, 1, 1, 1, 297, 123, 1, 1, 1, 1, 2, 502, 119, 1, 1, 1, 1, 1, 20288, 215, 215, 215, 215, 215, 5173, 119, 1, 1, 1, 1, 1], -80, [54, 1, 55, 7039, 1054, 119, 1, 1, 1, 1, 1, 1188, 1677, 2, 51, 14, 3, 102, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 2, 235, 20, 119, 1, 1, 1, 1, 1, 70, 2, 485, 123, 1, 1, 1, 6052, 2, 643, 2, 4286, 68, 362, 2162, 2, 6705, 215, 215, 215, 215, 215, 5175, 123, 1, 1, 1, 6697, 2], -70, [7797, 124, 2241, 124, 2016, 123, 1, 1, 1, 1, 2, 24176, 124, 91, 124, 91, 124, 91, 124, 91, 124, 306, 124, 941, 123, 1, 1, 1, 1, 2], -60, [108, 7042, 4099, 18, 2, 32, 71, 1, 1, 1, 18, 282, 20, 99, 1, 1, 1, 1, 1, 20, 1, 1, 1, 36, 46, 73, 1, 1, 1, 1, 1, 45, 1, 1, 1, 1, 2, 5609, 2, 5874, 34, 9183, 215, 215, 215, 215, 215], -50, [7134, 14, 124, 1, 1, 1, 2863, 21, 1, 1, 96, 1, 1, 1, 1, 1, 542, 3, 124, 497, 119, 1, 1, 1, 1, 1, 97, 8, 22, 101, 1, 1, 1, 1, 2, 16, 1, 1, 1, 476, 1, 20437, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 74, 14, 124, 1, 1, 1, 2648, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 21, 1, 1, 96, 1, 1, 1, 1, 1, 306, 21, 1, 1, 96, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 84, 1], -46, [23328, 216], -45, [11910, 124, 1, 1, 1], -40, [2580, 430, 2580, 215, 1325, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 502, 21, 1, 97, 1, 1, 1, 1, 1, 1437, 32, 92, 659, 2, 38, 242, 123, 1, 1, 1, 1, 2, 277, 401, 1, 20, 123, 1, 1, 1, 1, 2, 280, 1, 201, 52, 119, 1, 1, 1, 1, 1, 4842, 1861, 2, 4798, 9198, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 74, 12, 2, 37, 73, 11, 1, 1, 1, 1, 2, 2631, 2, 38, 175, 2, 38, 175, 2, 38, 175, 2, 38, 175, 2, 38, 390, 2, 38, 5409], -35, [9324, 123, 1, 1, 1, 1, 2, 2441, 123, 1, 1, 1], -30, [7180, 2, 2, 32, 88, 1, 1, 1, 1, 35, 119, 1, 1, 1, 1, 1, 285, 2, 1538, 38, 85, 1, 1, 1, 1, 2, 33, 1, 1, 1, 92, 32, 92, 712, 4, 115, 1, 1, 1, 1, 1, 3, 1, 1, 1, 892, 2, 5235, 32, 92, 305, 1496, 123, 1, 1, 1, 1, 2, 502, 119, 1, 1, 1, 1, 1, 6756, 119, 1, 1, 1, 1, 1, 6561, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 87, 2, 2, 32, 88, 1, 1, 1, 1, 4099, 2, 213, 2, 213, 2, 213, 2, 4804, 215, 215, 215, 215, 430, 1052, 119, 1, 1, 1, 1, 1], -25, [19214, 123, 1, 1, 1, 1, 2, 6751, 123, 1, 1, 1, 1, 2, 19651, 123, 1, 1, 1, 1, 2], -20, [8235, 119, 1, 1, 1, 1, 1, 683, 2, 19, 52, 67, 1, 1, 1, 1, 1, 52, 1, 1, 1, 1555, 5, 1, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 942, 42, 32, 49, 1, 1, 1, 1, 2, 37, 2026, 32, 92, 87, 1, 3, 32, 88, 1, 1, 1, 1, 77, 1, 648, 123, 1, 1, 1, 1, 2, 311, 32, 92, 947, 124, 1, 1, 1, 92, 32, 92, 88, 3, 32, 92, 445, 54, 1, 11, 2, 110, 11, 1, 1, 1, 1, 2, 717, 119, 1, 1, 1, 1, 1, 105, 123, 1, 1, 1, 1, 2, 4598, 10, 16128, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 292, 1, 2163, 32, 92, 88, 3, 32, 92, 88, 3, 32, 92, 88, 3, 32, 92, 88, 3, 32, 92, 88, 3, 32, 92, 303, 3, 32, 92], -15, [9314, 123, 1, 1, 1, 4621, 1, 644, 1, 2, 32, 92, 88, 1, 1, 1, 32, 92, 1156, 123, 1, 1, 1, 1, 2, 94, 2, 32, 92, 519, 217, 32, 92, 288, 12, 34, 185, 7310, 14404, 1, 214, 1, 214, 1, 214, 1, 214, 1, 214, 1, 644, 1, 1, 1, 32, 92, 88, 1, 1, 1, 32, 92, 88, 1, 1, 1, 32, 92, 88, 1, 1, 1, 32, 92, 1379, 215, 215, 215, 215, 430], -10, [7363, 124, 1, 1, 1, 3098, 124, 1, 1, 1, 1136, 1, 2194, 220, 211, 17, 32, 92, 70, 374, 2, 55, 123, 1, 1, 1, 91, 1519, 124, 1, 1, 1, 2007, 123, 1, 1, 1, 89, 123, 1, 1, 1, 6754, 123, 1, 1, 1, 13421, 215, 215, 215, 215, 215, 431, 17, 32, 92, 2022, 124, 1, 1, 1, 2437, 123, 1, 1, 1], 10, [14847, 487, 123, 1, 1, 1, 2256, 3, 32, 92, 1576, 123, 1, 1, 1, 6324, 123, 1, 1, 1, 15297, 215, 215, 215], 20, [10547, 2, 4300, 2865, 23580, 215, 215, 215], 30, [15159, 2]]
}, b8 = {
  name: "Helvetica-Oblique",
  bbox: [-170, -225, 1116, 931],
  ascender: 718,
  descender: -207,
  xHeight: 523,
  capHeight: 718,
  glyphNames: h0,
  glyphWidths: [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 556, 222, 556, 333, 1e3, 556, 556, 333, 1e3, 667, 333, 1e3, 611, 222, 222, 333, 333, 350, 556, 1e3, 333, 1e3, 500, 333, 944, 500, 500, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667, 667, 667, 667, 1e3, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556],
  kernPairs: [-180, [10332, 2], -160, [9569], -150, [8182, 2], -140, [9517, 54, 70, 1552, 1074, 1, 1, 51, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 26464, 1, 1, 51, 4, 10, 105, 1, 1, 2, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2], -125, [11622, 2], -120, [7147, 3206, 119, 1, 1, 1, 1, 1, 715, 2, 19, 32, 4, 10, 3, 3, 2, 2, 63, 1, 1, 1, 1, 1, 27, 1, 1, 2, 1, 4, 1, 1, 7, 1, 1, 2, 2, 1, 1, 1, 1, 1, 21339, 215, 215, 215, 215, 215], -110, [9512, 2, 2774, 52, 67, 1, 1, 1, 1, 1, 52, 1, 1, 1, 26481, 52, 67, 1, 1, 1, 1, 1, 52, 1, 1, 1], -100, [2689, 2, 428, 2, 4031, 124, 11871, 2, 6878, 2, 6708, 124, 91, 124, 91, 124, 91, 124, 91, 124, 91, 124, 11871, 2], -95, [44732, 2], -90, [57, 124, 7616, 124], -85, [12302, 123, 1, 1, 1, 1, 2, 26531, 123, 1, 1, 1, 1, 2, 5717], -80, [8203, 119, 1, 1, 1, 1, 1, 3296, 20, 36, 10, 73, 1, 1, 1, 1, 1, 35, 1, 1, 1, 7, 1, 1, 1, 1, 2, 19, 2, 6663, 2], -70, [7149, 603, 2, 40, 1721, 647, 124, 1389, 20, 99, 1, 1, 1, 1, 1, 20, 1, 1, 1, 11613, 9299, 215, 215, 215, 215, 215, 2798, 124, 91, 124, 91, 124, 91, 124, 91, 124, 306, 124, 1081, 5704, 1, 2, 32, 92], -60, [108, 2902, 7151, 1140, 66, 5, 13, 896, 1, 6435, 2, 17887, 215, 215, 215, 215, 430, 1045, 1], -57, [23328, 216], -55, [44785, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 27, 3, 64, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1], -50, [52, 2, 5536, 215, 1343, 2, 122, 1, 1, 1, 960, 119, 1, 1, 1, 1, 1, 933, 42, 32, 49, 1, 1, 1, 1, 2, 37, 701, 230, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 276, 3, 124, 927, 119, 1, 1, 1, 1, 1, 5660, 2, 5859, 14, 1, 34, 9181, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 88, 2, 122, 1, 1, 1, 2669, 215, 215, 215, 215, 430], -45, [8252], -40, [55, 7126, 1, 2, 32, 92, 465, 22, 97, 1, 1, 1, 1, 1, 1417, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 664, 2, 38, 228, 119, 1, 1, 1, 1, 1, 294, 124, 1, 1, 1, 297, 123, 1, 1, 1, 1, 2, 51, 2, 19, 119, 1, 1, 1, 1, 1, 84, 1, 12, 8, 123, 1, 1, 1, 1, 2, 52, 52, 119, 1, 1, 1, 1, 1, 2188, 2, 2793, 2, 6866, 8901, 1, 2, 32, 92, 88, 1, 2, 32, 92, 88, 1, 2, 32, 92, 88, 1, 2, 32, 92, 88, 1, 2, 32, 92, 88, 1, 2, 32, 92, 2594, 2, 38, 175, 2, 38, 175, 2, 38, 175, 2, 38, 175, 2, 38, 390, 2, 38, 175, 2, 19, 119, 1, 1, 1, 1, 1, 70, 2, 19, 119, 1, 1, 1, 1, 1, 70, 2, 19, 119, 1, 1, 1, 1, 1, 70, 2, 19, 119, 1, 1, 1, 1, 1, 4585, 2, 213, 2, 213, 2, 213, 2, 213, 2], -35, [17212, 2], -30, [110, 7020, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 230, 2, 700, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 664, 2, 286, 124, 1, 1, 1, 92, 32, 92, 487, 642, 3, 1089, 10, 6, 107, 1, 1, 1, 7, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2027, 32, 92, 733, 2, 139, 2, 51, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 311, 32, 92, 1380, 1, 32, 92, 91, 32, 92, 519, 1057, 123, 1, 1, 1, 6127, 7473, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 38, 4, 8, 2, 36, 74, 11, 1, 1, 1, 1, 2, 33, 1, 1, 1, 230, 2, 2406, 215, 215, 215, 215, 430, 1754, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 518, 2, 213, 2, 213, 2, 213, 2, 1505, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92], -25, [18555, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2], -20, [7322, 2, 1739, 32, 20, 67, 1, 1, 1, 1, 1, 27, 1, 1, 1, 1, 1, 20, 1, 1, 1, 896, 119, 1, 1, 1, 1, 1, 535, 123, 1, 1, 1, 1, 2, 51, 2, 227, 1, 665, 42, 32, 49, 1, 1, 1, 1, 2, 37, 290, 124, 1609, 1, 204, 9, 1, 3, 32, 88, 1, 1, 1, 1, 77, 442, 2, 32, 92, 1146, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 523, 2344, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 3029, 2, 3706, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 10360, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 306, 119, 1, 1, 1, 1, 1, 991, 124, 534, 1, 214, 1, 214, 1, 214, 1, 214, 1, 214, 1, 418, 227, 2, 32, 92, 89, 2, 32, 92, 89, 2, 32, 92, 89, 2, 32, 92, 1163, 2559, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2], -15, [14417, 430, 2, 1795, 32, 92, 91, 32, 92, 88, 1, 785, 2, 911, 119, 1, 1, 1, 1, 1, 525, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 5609, 2, 700, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 15069, 215, 2, 213, 2, 213, 2, 213, 2, 1365, 32, 92, 88, 1, 214, 1, 214, 1, 214, 1, 214, 1], -10, [7363, 124, 1, 1, 1, 3098, 124, 1, 1, 1, 3541, 1091, 1293, 124, 1, 1, 1, 88, 124, 1, 1, 1, 713, 119, 1, 1, 1, 1, 1, 955, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 24387, 124, 1, 1, 1], 15, [17703, 2, 1, 9, 111, 1, 1, 1, 10, 1, 1, 1], 25, [17707, 1, 123], 30, [17656, 1, 53, 6, 3, 32, 92], 40, [17714], 50, [15159], 60, [15161]]
}, p8 = {
  name: "Symbol",
  bbox: [-180, -293, 1090, 1010],
  ascender: 0,
  descender: 0,
  xHeight: 0,
  capHeight: 0,
  glyphNames: "space exclam numbersign percent ampersand parenleft parenright plus comma period slash zero one two three four five six seven eight nine colon semicolon less equal greater question bracketleft bracketright underscore braceleft bar braceright Euro florin ellipsis bullet logicalnot degree plusminus mu multiply divide",
  glyphWidths: [250, 333, 500, 833, 778, 333, 333, 549, 250, 250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 278, 278, 549, 549, 549, 444, 333, 333, 500, 480, 200, 480, 750, 500, 1e3, 460, 713, 400, 549, 576, 549, 549],
  kernPairs: []
}, g8 = {
  name: "Times-Bold",
  bbox: [-168, -218, 1e3, 935],
  ascender: 683,
  descender: -217,
  xHeight: 461,
  capHeight: 676,
  glyphNames: h0,
  glyphWidths: [250, 333, 555, 500, 500, 1e3, 833, 278, 333, 333, 500, 570, 250, 333, 250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 333, 333, 570, 570, 570, 500, 930, 722, 667, 722, 722, 667, 611, 778, 778, 389, 500, 778, 667, 944, 722, 778, 611, 778, 722, 556, 667, 722, 722, 1e3, 722, 722, 667, 333, 278, 333, 581, 500, 333, 500, 556, 444, 556, 444, 333, 500, 556, 278, 333, 556, 278, 833, 556, 500, 556, 556, 444, 389, 333, 556, 500, 722, 500, 500, 444, 394, 220, 394, 520, 500, 333, 500, 500, 1e3, 500, 500, 333, 1e3, 556, 333, 1e3, 667, 333, 333, 500, 500, 350, 500, 1e3, 333, 1e3, 389, 333, 722, 444, 500, 333, 500, 500, 500, 500, 220, 500, 333, 747, 300, 500, 570, 747, 333, 400, 570, 300, 300, 333, 556, 540, 250, 333, 300, 330, 500, 750, 750, 750, 500, 722, 722, 722, 722, 722, 722, 1e3, 722, 667, 667, 667, 667, 389, 389, 389, 389, 722, 722, 778, 778, 778, 778, 778, 570, 778, 722, 722, 722, 722, 722, 611, 556, 500, 500, 500, 500, 500, 500, 722, 444, 444, 444, 444, 444, 278, 278, 278, 278, 500, 556, 500, 500, 500, 500, 500, 570, 500, 556, 556, 556, 556, 500, 556],
  kernPairs: [-145, [7149, 4475, 21110, 215, 215, 215, 215, 215], -135, [11643, 119, 1, 1, 1, 1, 1], -130, [7150, 25585, 215, 215, 215, 215, 215], -129, [11622], -120, [11858, 119, 1, 1, 1, 1, 1], -111, [12324, 10, 114, 1, 8, 1, 1, 1, 1, 2, 26521, 10, 114, 1, 8, 1, 1, 1, 1, 2], -110, [8184, 1385, 765, 1954, 119, 1, 1, 1, 1, 1, 26536, 119, 1, 1, 1, 1, 1], -100, [7152, 29, 95, 4403, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 5826, 15093, 29, 95, 91, 29, 95, 91, 29, 95, 91, 29, 95, 91, 29, 95, 91, 29, 95], -95, [7147, 25585, 215, 215, 215, 215, 215], -92, [8182, 1330, 2, 1, 2, 124, 691, 861, 52, 4, 10, 6, 100, 4, 4, 1, 8, 1, 1, 1, 1, 2, 1, 1, 1, 1, 244, 1, 38, 20, 99, 1, 1, 1, 1, 1, 20, 1, 1, 1, 15, 2, 428, 1, 1, 12, 1, 58, 124, 1, 1, 1, 5175, 21285, 1, 1, 12, 1, 58, 124, 1, 1, 1], -90, [7182, 1021, 119, 1, 1, 1, 1, 1, 2867, 19, 119, 1, 1, 1, 1, 1, 21430, 215, 215, 215, 215, 215], -85, [12320, 119, 1, 1, 1, 1, 1, 26536, 119, 1, 1, 1, 1, 1], -75, [11904, 123, 1, 1, 1, 1, 2], -74, [7184, 20, 12, 92, 3045, 119, 1, 1, 1, 1, 1, 715, 14, 1, 55, 5, 356, 11812, 9334, 20, 12, 92, 91, 20, 12, 92, 91, 20, 12, 92, 91, 20, 12, 92, 91, 20, 12, 92, 91, 20, 12, 92], -71, [12447, 3, 26657, 3], -70, [18504, 215, 430, 6880, 19780], -65, [11890, 4, 115, 1, 1, 1, 1, 1, 3, 1, 1, 1], -63, [23328, 216], -60, [11428, 119, 1, 1, 1, 1, 1, 362, 32, 92, 26050, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1], -55, [33, 24, 95, 1, 1, 1, 1, 1, 24, 2508, 430, 2, 4009, 4, 120, 2295, 32, 92, 1131, 1047, 1, 6650, 215, 430, 6880, 6688, 4, 120, 91, 4, 120, 91, 4, 120, 91, 4, 120, 91, 4, 120, 91, 4, 120, 11893], -52, [11364, 2, 1, 1, 4, 3], -50, [7148, 32, 92, 1, 1, 1, 29, 1, 1, 1, 2852, 1, 2, 124, 1121, 2, 501, 124, 1, 1, 1, 20696, 32, 92, 1, 1, 1, 29, 1, 1, 1, 56, 32, 92, 1, 1, 1, 29, 1, 1, 1, 56, 32, 92, 1, 1, 1, 29, 1, 1, 1, 56, 32, 92, 1, 1, 1, 29, 1, 1, 1, 56, 32, 92, 1, 1, 1, 29, 1, 1, 1, 56, 32, 92, 1, 1, 1, 29, 1, 1, 1, 2637, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 303, 1, 2, 124, 46, 2, 213, 2, 213, 2, 213, 2], -45, [54, 2637, 4451, 2, 121, 1, 1, 1, 1, 2, 2063, 32, 92, 2199, 123, 1, 1, 1, 1, 2, 20941, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2], -40, [7794, 1, 2, 124, 2217, 19, 4, 96, 1, 1, 1, 1, 1, 540, 3402, 2652, 19727, 19, 4, 96, 1, 1, 1, 1, 1, 91, 19, 4, 96, 1, 1, 1, 1, 1, 91, 19, 4, 96, 1, 1, 1, 1, 1, 91, 19, 4, 96, 1, 1, 1, 1, 1, 91, 19, 4, 96, 1, 1, 1, 1, 1, 306, 19, 4, 96, 1, 1, 1, 1, 1, 5304], -37, [11683, 123, 1, 1, 1, 29, 490, 124, 5191, 5875, 34, 15436, 124], -35, [7773, 119, 1, 1, 1, 1, 1, 2908, 2, 124, 1371, 123, 1, 1, 1, 1, 2, 26531, 123, 1, 1, 1, 1, 2], -34, [11269, 32, 92], -30, [52, 3, 7288, 119, 1, 1, 1, 1, 1, 1596, 119, 1, 1, 1, 1, 1, 105, 123, 1, 1, 1, 1, 2, 1376, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 719], -25, [7175, 1060, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 936, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 4608, 1062, 6, 123, 1, 1, 1, 1, 2, 3956, 123, 1, 1, 1, 1, 2, 6751, 123, 1, 1, 1, 1, 2, 6537, 215, 215, 215, 215, 215, 5811, 215, 215, 215, 215, 215, 5153, 123, 1, 1, 1, 1, 2], -20, [7754, 1290, 527, 352, 119, 1, 1, 1, 1, 1, 342, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 21, 3726, 124, 1, 1, 1, 9101, 14, 4, 12847, 119, 1, 1, 1, 1, 1], -18, [11227, 26, 97, 1, 1, 1, 1, 2, 21, 521, 124, 5675, 2, 10, 2, 110, 1, 1, 1, 1, 7, 1, 1, 1, 1, 2], -15, [9095, 4, 10, 6, 99, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 1, 1, 1, 1, 88, 124, 1, 1, 1, 4819, 431, 214, 141, 2, 215, 290, 32, 92, 511, 10, 32, 81, 1, 1, 1, 1, 2, 5, 1370, 123, 23535, 215, 215, 215], -10, [7363, 124, 1, 1, 1, 2895, 119, 1, 1, 1, 1, 1, 79, 124, 1, 1, 1, 1157, 123, 1, 1, 1, 1, 2, 2255, 1525, 413, 123, 1, 1, 1, 751, 1, 629, 9, 6, 839, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 86, 123, 1, 1, 1, 1, 2, 291, 123, 1, 1, 1, 3923, 119, 1, 1, 1, 1, 1, 306, 119, 1, 1, 1, 1, 1, 2277, 123, 1, 1, 1, 16016, 215, 215, 215, 645, 1, 214, 1, 214, 1, 214, 1, 214, 1, 429, 1, 1057, 123, 1, 1, 1], 50, [15161], 55, [15159]]
}, m8 = {
  name: "Times-BoldItalic",
  bbox: [-200, -218, 996, 921],
  ascender: 683,
  descender: -217,
  xHeight: 462,
  capHeight: 669,
  glyphNames: h0,
  glyphWidths: [250, 389, 555, 500, 500, 833, 778, 278, 333, 333, 500, 570, 250, 333, 250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 333, 333, 570, 570, 570, 500, 832, 667, 667, 667, 722, 667, 667, 722, 778, 389, 500, 667, 611, 889, 722, 722, 611, 722, 667, 556, 611, 722, 667, 889, 667, 611, 611, 333, 278, 333, 570, 500, 333, 500, 500, 444, 500, 444, 333, 500, 556, 278, 278, 500, 278, 778, 556, 500, 500, 500, 389, 389, 278, 556, 444, 667, 500, 444, 389, 348, 220, 348, 570, 500, 333, 500, 500, 1e3, 500, 500, 333, 1e3, 556, 333, 944, 611, 333, 333, 500, 500, 350, 500, 1e3, 333, 1e3, 389, 333, 722, 389, 444, 389, 500, 500, 500, 500, 220, 500, 333, 747, 266, 500, 606, 747, 333, 400, 570, 300, 300, 333, 576, 500, 250, 333, 300, 300, 500, 750, 750, 750, 500, 667, 667, 667, 667, 667, 667, 944, 667, 667, 667, 667, 667, 389, 389, 389, 389, 722, 722, 722, 722, 722, 722, 722, 570, 722, 722, 722, 722, 722, 611, 611, 500, 500, 500, 500, 500, 500, 500, 722, 444, 444, 444, 444, 444, 278, 278, 278, 278, 500, 556, 500, 500, 500, 500, 500, 570, 500, 556, 556, 556, 556, 444, 500],
  kernPairs: [-129, [8182, 2, 2148, 2, 1288, 2], -111, [11675, 4, 10, 105, 1, 1, 1, 1, 1, 4, 1, 8, 1, 1, 1, 1, 2, 506, 10, 114, 9, 1, 1, 1, 1, 2, 26521, 10, 114, 9, 1, 1, 1, 1, 2], -100, [7150, 1053, 36, 83, 1, 1, 1, 1, 1, 35, 1, 1, 1, 24370, 215, 215, 215, 215, 215], -95, [2689, 2, 428, 2, 4028, 1086, 119, 1, 1, 1, 1, 1, 2900, 123, 1, 1, 1, 1, 2, 21346, 215, 215, 215, 215, 215], -92, [11192, 1, 1, 51, 4, 115, 1, 1, 1, 1, 1, 4, 1, 893, 1, 13, 1, 38, 20, 99, 1, 1, 1, 1, 1, 20, 1, 1, 1, 26460, 1, 13, 1, 38, 20, 99, 1, 1, 1, 1, 1, 20, 1, 1, 1], -90, [11894, 124, 1], -85, [10353, 119, 1, 1, 1, 1, 1, 1166, 119, 1, 1, 1, 1, 1, 123, 119, 1, 1, 1, 1, 1], -80, [11904, 123, 1, 1, 1, 1, 2], -74, [7181, 1, 2, 20, 12, 92, 3898, 1, 429, 1, 200, 2, 19, 119, 1, 1, 1, 1, 1, 287, 19, 119, 1, 1, 1, 1, 1, 10916, 107, 83, 26, 8, 9214, 1, 2, 20, 12, 92, 88, 1, 2, 20, 12, 92, 88, 1, 2, 20, 12, 92, 88, 1, 2, 20, 12, 92, 88, 1, 2, 20, 12, 92, 88, 1, 2, 20, 12, 92, 4961, 19, 119, 1, 1, 1, 1, 1], -71, [11802, 3, 642, 2, 1, 26657, 2, 1], -70, [54, 1, 2, 124, 6971, 124, 973, 123, 1, 1, 1, 1, 2, 3245, 21114, 124, 91, 124, 91, 124, 91, 124, 91, 124, 91, 124], -65, [7130, 124, 10388, 2, 15071, 124, 91, 124, 91, 124, 91, 124, 91, 124, 91, 124], -60, [7134, 25585, 215, 215, 215, 215, 215], -55, [7144, 3, 2422, 830, 123, 1, 1, 1, 1, 2, 685, 119, 1, 1, 1, 1, 1, 346, 12, 112, 12, 1, 1, 1, 29, 1, 58, 4, 32, 88, 1, 1, 1, 1, 290, 124, 20277, 3, 212, 3, 212, 3, 212, 3, 212, 3, 212, 3, 5181, 124], -52, [11372, 3], -50, [7142, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 519, 3, 124, 331, 1907, 1, 2, 124, 103, 123, 1, 1, 1, 1323, 179, 3, 20707, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2669, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 303, 1, 2, 124], -45, [11428, 119, 1, 1, 1, 1, 1, 26536, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1], -40, [7795, 448, 123, 1, 1, 1, 726, 4, 10, 6, 99, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2, 1, 1, 1, 1, 896, 19, 4, 96, 1, 1, 1, 1, 1, 123, 119, 1, 1, 1, 1, 1, 288, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3274, 2652, 19727, 19, 4, 96, 1, 1, 1, 1, 1, 91, 19, 4, 96, 1, 1, 1, 1, 1, 91, 19, 4, 96, 1, 1, 1, 1, 1, 91, 19, 4, 96, 1, 1, 1, 1, 1, 91, 19, 4, 96, 1, 1, 1, 1, 1, 306, 19, 4, 96, 1, 1, 1, 1, 1, 5304], -37, [33, 119, 1, 1, 1, 1, 1, 9357, 1, 2, 32, 32, 60, 32, 1580, 9, 3, 2, 2, 32, 76, 12, 1, 1, 1, 1, 505, 124, 6480, 2, 213, 2, 428, 2, 4370, 2508, 2, 19778, 2], -30, [7180, 124, 1, 1, 1, 1985, 123, 1, 1, 1, 1, 2, 502, 119, 1, 1, 1, 1, 1, 755, 855, 123, 1, 1, 1, 1, 2, 4408, 123, 1, 1, 1, 16445, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 2401, 119, 1, 1, 1, 1, 1], -25, [7343, 119, 1, 1, 1, 1, 1, 306, 119, 1, 1, 1, 1, 1, 1166, 119, 1, 1, 1, 1, 1, 127, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 2849, 123, 1, 1, 1, 1, 2, 4641, 21890, 123, 1, 1, 1, 1, 2, 4426, 215, 215, 215, 215, 430], -20, [9330, 4, 32, 88, 1, 1, 1, 1, 4817, 124, 1, 1, 1], -18, [9512, 1292, 1, 2, 124, 296, 123, 1, 1, 1, 1, 2, 3764], -15, [11872, 123, 1, 1, 1, 1, 2, 5070, 1488, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 86, 123, 1, 1, 1, 1, 2, 4590, 14, 4, 19995, 215, 215, 215, 215, 430], -10, [7363, 124, 1, 1, 1, 1552, 2, 1544, 124, 1, 1, 1, 934, 2607, 221, 3, 421, 161, 2, 55, 10, 114, 9, 1, 1, 1, 3, 946, 123, 1, 1, 1, 1, 2, 740, 1, 32, 92, 1572, 4, 115, 1, 1, 1, 1, 1, 3, 1, 1, 1, 89, 123, 1, 1, 1, 22022, 3, 206, 215, 215, 215, 1527, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92, 90, 1, 32, 92, 305, 1, 32, 92], 55, [15159]]
}, A8 = {
  name: "Times-Italic",
  bbox: [-169, -217, 1010, 883],
  ascender: 683,
  descender: -217,
  xHeight: 441,
  capHeight: 653,
  glyphNames: h0,
  glyphWidths: [250, 333, 420, 500, 500, 833, 778, 214, 333, 333, 500, 675, 250, 333, 250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 333, 333, 675, 675, 675, 500, 920, 611, 611, 667, 722, 611, 611, 722, 722, 333, 444, 667, 556, 833, 667, 722, 611, 722, 611, 500, 556, 722, 611, 833, 611, 556, 556, 389, 278, 389, 422, 500, 333, 500, 500, 444, 500, 444, 278, 500, 500, 278, 278, 444, 278, 722, 500, 500, 500, 500, 389, 389, 278, 500, 444, 667, 444, 444, 389, 400, 275, 400, 541, 500, 333, 500, 556, 889, 500, 500, 333, 1e3, 500, 333, 944, 556, 333, 333, 556, 556, 350, 500, 889, 333, 980, 389, 333, 667, 389, 444, 389, 500, 500, 500, 500, 275, 500, 333, 760, 276, 500, 675, 760, 333, 400, 675, 300, 300, 333, 500, 523, 250, 333, 300, 310, 500, 750, 750, 750, 500, 611, 611, 611, 611, 611, 611, 889, 667, 611, 611, 611, 611, 333, 333, 333, 333, 722, 667, 722, 722, 722, 722, 722, 675, 722, 722, 722, 722, 722, 556, 611, 500, 500, 500, 500, 500, 500, 500, 667, 444, 444, 444, 444, 444, 278, 278, 278, 278, 500, 500, 500, 500, 500, 500, 500, 675, 500, 500, 500, 500, 500, 444, 500],
  kernPairs: [-140, [2689, 2, 428, 2], -135, [8182, 2, 2148, 2], -129, [11622, 2], -115, [8203, 119, 1, 1, 1, 1, 1], -111, [11675, 4, 10, 105, 1, 1, 1, 1, 1, 4, 1, 8, 1, 1, 1, 1, 2, 5824, 2, 5684, 107, 109], -105, [7149, 1100, 123, 1, 1, 1, 1, 2, 24356, 215, 215, 215, 215, 215], -95, [7150, 25585, 215, 215, 215, 215, 215], -92, [11245, 4, 10, 105, 1, 1, 1, 1, 1, 4, 9, 1, 1, 1, 1, 2, 449, 2, 51, 4, 10, 105, 1, 1, 1, 1, 1, 4, 1, 8, 1, 1, 1, 1, 2, 234, 2, 51, 4, 10, 6, 99, 1, 1, 1, 1, 1, 4, 1, 8, 1, 1, 1, 1, 2, 1, 1, 1, 1, 26460, 2, 51, 4, 10, 6, 99, 1, 1, 1, 1, 1, 4, 1, 8, 1, 1, 1, 1, 2, 1, 1, 1, 1], -90, [10353, 119, 1, 1, 1, 1, 1], -80, [10385, 4, 10, 105, 1, 1, 1, 1, 1, 3, 1, 1, 1, 7, 1, 1, 1, 1, 2], -75, [57, 124, 8054, 4, 115, 1, 1, 1, 1, 1, 3, 1, 1, 1], -74, [11192, 1, 1, 73, 2, 124, 244, 46, 12, 112, 12, 1, 1, 1, 446, 60, 124, 6050, 2, 213, 2, 20209, 60, 124], -71, [11802, 3], -70, [11914, 32, 92], -65, [11207, 429, 215, 1, 429, 1, 26659, 1], -60, [11643, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1], -55, [7152, 29, 1, 2, 32, 60, 32, 944, 1262, 1, 623, 119, 1, 1, 1, 1, 1, 944, 47, 9, 3, 112, 12, 1, 1, 1, 231, 275, 12, 112, 12, 1, 1, 1, 7110, 2, 6878, 2, 6708, 29, 1, 2, 32, 60, 32, 59, 29, 1, 2, 32, 60, 32, 59, 29, 1, 2, 32, 60, 32, 59, 29, 1, 2, 32, 60, 32, 59, 29, 1, 2, 32, 60, 32, 59, 29, 1, 2, 32, 60, 32, 2615, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 306, 119, 1, 1, 1, 1, 1, 7810, 2], -52, [11372, 2, 1, 642, 3, 427, 3, 26657, 3], -50, [7148, 124, 1, 1, 1, 2017, 123, 1, 1, 1, 1, 2, 738, 1, 2, 124, 927, 119, 1, 1, 1, 1, 1, 951, 119, 1, 1, 1, 1, 1, 20321, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 2669, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 88, 1, 2, 124, 303, 1, 2, 124, 927, 119, 1, 1, 1, 1, 1], -45, [8243, 123, 1, 1, 1, 9340, 123, 1, 1, 1, 1, 2], -40, [55, 7087, 2, 121, 1, 1, 1, 1, 2, 523, 1, 2, 124, 1142, 119, 1, 1, 1, 1, 1, 137, 6, 4, 32, 81, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 699, 4, 636, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 498, 119, 1, 1, 1, 1, 1, 2652, 702, 1950, 6662, 34, 9175, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 86, 2, 121, 1, 1, 1, 1, 2, 2671, 4, 211, 4, 211, 4, 211, 4, 211, 4, 426, 4, 192, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 2494, 215, 215, 215, 1305], -37, [7147, 57, 2365, 2269, 5859, 1, 1, 2, 10, 110, 1, 1, 1, 1, 14907, 57, 158, 57, 158, 57, 158, 57, 158, 57, 158, 57], -35, [54, 7080, 639, 119, 1, 1, 1, 1, 1, 1198, 20, 99, 1, 1, 1, 1, 1, 20, 1, 1, 1, 72, 123, 1, 1, 1, 23279, 215, 215, 215, 215, 215], -34, [11301, 505, 2, 1, 642, 2, 1, 26657, 2, 1], -30, [7130, 124, 2295, 32, 92, 1984, 123, 1, 1, 1, 1, 2, 3138, 32, 92, 8471, 9196, 124, 91, 124, 91, 124, 91, 124, 91, 124, 91, 124, 7455, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92], -27, [9923, 119, 1, 1, 1, 1, 1, 26321, 119, 1, 1, 1, 1, 1], -25, [7343, 119, 1, 1, 1, 1, 1, 1575, 2, 55, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 2169, 2, 463, 123, 1, 1, 1, 1, 2, 11502, 14, 14550, 2, 213, 2, 213, 2, 213, 2], -20, [7180, 124, 1, 1, 1, 2205, 5, 124, 4634, 124, 1, 1, 1, 78, 443, 200, 2520, 15122, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 88, 124, 1, 1, 1, 7173, 228, 215, 215, 215], -18, [33, 19, 100, 1, 1, 1, 1, 1, 10647, 1, 2, 124, 296, 123, 1, 1, 1, 1, 2, 3764], -15, [12302, 123, 1, 1, 1, 1, 2, 2046, 372, 72, 1, 142, 215, 2416, 119, 1, 1, 1, 1, 1, 21143, 123, 1, 1, 1, 1, 2, 2046, 157, 72, 1, 142, 72, 1, 142, 72, 1, 142, 72, 1], -10, [7363, 124, 1, 1, 1, 3098, 124, 1, 1, 1, 3331, 801, 215, 215, 57, 2, 121, 1, 1, 1, 734, 10, 10, 32, 71, 1, 1, 1, 7, 1, 1, 1, 1, 2, 5, 718, 15, 642, 34, 5774, 16110, 215, 215, 215, 215, 215, 586, 215, 215, 215, 1564, 15, 200, 15, 200, 15, 200, 15, 200, 15, 415, 15], 92, [15159]]
}, w8 = {
  name: "Times-Roman",
  bbox: [-168, -218, 1e3, 898],
  ascender: 683,
  descender: -217,
  xHeight: 450,
  capHeight: 662,
  glyphNames: h0,
  glyphWidths: [250, 333, 408, 500, 500, 833, 778, 180, 333, 333, 500, 564, 250, 333, 250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 278, 278, 564, 564, 564, 444, 921, 722, 667, 667, 722, 611, 556, 722, 722, 333, 389, 722, 611, 889, 722, 722, 556, 722, 667, 556, 611, 722, 722, 944, 722, 722, 611, 333, 278, 333, 469, 500, 333, 444, 500, 444, 500, 444, 333, 500, 500, 278, 278, 500, 278, 778, 500, 500, 500, 500, 333, 389, 278, 500, 500, 722, 500, 500, 444, 480, 200, 480, 541, 500, 333, 500, 444, 1e3, 500, 500, 333, 1e3, 556, 333, 889, 611, 333, 333, 444, 444, 350, 500, 1e3, 333, 980, 389, 333, 722, 444, 500, 333, 500, 500, 500, 500, 200, 500, 333, 760, 276, 500, 564, 760, 333, 400, 564, 300, 300, 333, 500, 453, 250, 333, 300, 310, 500, 750, 750, 750, 444, 722, 722, 722, 722, 722, 722, 889, 667, 611, 611, 611, 611, 333, 333, 333, 333, 722, 722, 722, 722, 722, 722, 722, 564, 722, 722, 722, 722, 722, 722, 556, 500, 444, 444, 444, 444, 444, 444, 667, 444, 444, 444, 444, 444, 278, 278, 278, 278, 500, 500, 500, 500, 500, 500, 500, 564, 500, 500, 500, 500, 500, 500, 500],
  kernPairs: [-135, [7149, 4494, 119, 1, 1, 1, 1, 1, 20967, 215, 215, 215, 215, 215], -129, [11622, 2, 65, 124, 1, 4, 449, 2, 26658, 2], -120, [11858, 119, 1, 1, 1, 1, 1, 306, 119, 1, 1, 1, 1, 1, 26536, 119, 1, 1, 1, 1, 1], -111, [7147, 57, 3128, 2, 1341, 4, 116, 4, 4, 465, 72, 125, 1, 20266, 57, 158, 57, 158, 57, 158, 57, 158, 57, 158, 57, 5064, 72, 125, 1], -110, [12334, 124, 1, 4, 26531, 124, 1, 4], -105, [7152, 124, 25461, 124, 91, 124, 91, 124, 91, 124, 91, 124, 91, 124], -100, [9514, 3, 124, 1982, 697, 4, 116, 1, 3, 4, 1, 26531, 4, 116, 1, 3, 4, 1], -93, [11213, 119, 1, 1, 1, 1, 1], -92, [7182, 2, 32, 92, 2204, 57, 784, 119, 1, 1, 1, 1, 1, 716, 644, 2, 442, 1, 20485, 2, 32, 92, 89, 2, 32, 92, 89, 2, 32, 92, 89, 2, 32, 92, 89, 2, 32, 92, 89, 2, 32, 92, 4973, 1], -90, [57, 124, 6969, 25585, 215, 215, 215, 215, 215], -89, [11812, 3, 1], -80, [8182, 2, 2620, 441, 14, 8, 2, 32, 64, 1, 3, 13, 1, 1, 1, 1, 2, 5, 497, 4, 10, 105, 1, 1, 1, 1, 1, 4, 1, 8, 1, 1, 1, 1, 2, 11220, 119, 1, 1, 1, 1, 1, 306, 119, 1, 1, 1, 1, 1], -75, [11695, 124, 1, 1, 1], -74, [7181, 1022, 119, 1, 1, 1, 1, 1, 1188, 1677, 2, 442, 1, 11691, 107, 109, 9222, 215, 215, 215, 215, 215], -73, [11914, 32, 92], -71, [11794, 2, 1, 1, 4, 2, 1, 659, 3, 26657, 3], -70, [2689, 2, 428, 2, 8128, 123, 1, 1, 1083, 3, 1, 26656, 3, 1], -65, [10807, 124, 907, 6664, 2, 213, 2, 428, 2, 6878, 2, 19778, 2], -60, [9063, 119, 1, 1, 1, 1, 1, 1615, 881, 124, 632, 3, 1, 4, 3, 26649, 3, 1, 4, 3], -55, [33, 119, 1, 1, 1, 1, 1, 6985, 2, 4, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 522, 124, 1628, 32, 92, 1132, 402, 1121, 124, 5192, 5874, 34, 9175, 2, 4, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 2, 4, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 2, 4, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 2, 4, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 2, 4, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 82, 2, 4, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 5053, 124], -50, [54, 10105, 3, 124, 920, 704, 124, 1, 1, 1, 11466, 14, 4, 13083, 3, 124, 88, 3, 124, 88, 3, 124, 88, 3, 124, 88, 3, 124, 303, 3, 124], -45, [11265, 124, 1, 1, 1], -40, [7130, 4, 120, 519, 21, 98, 1, 1, 1, 1, 1, 2260, 4, 636, 6, 117, 1, 1, 1, 1, 2, 1, 1, 1, 1, 434, 3, 1, 60, 119, 1, 1, 1, 1, 1, 105, 123, 1, 1, 1, 1, 2, 112, 119, 3, 2, 2182, 2652, 786, 15073, 4, 120, 91, 4, 120, 91, 4, 120, 91, 4, 120, 91, 4, 120, 91, 4, 120, 2688, 4, 211, 4, 211, 4, 211, 4, 211, 4, 426, 4, 192, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 91, 119, 1, 1, 1, 1, 1, 4444], -37, [11851, 1], -35, [7343, 119, 1, 1, 1, 1, 1, 1857, 123, 1, 1, 1, 1, 2, 470, 119, 1, 1, 1, 1, 1, 91, 22, 97, 1, 1, 1, 1, 1, 991, 9, 115, 24991, 119, 1, 1, 1, 1, 1, 91, 22, 97, 1, 1, 1, 1, 1, 91, 22, 97, 1, 1, 1, 1, 1, 91, 22, 97, 1, 1, 1, 1, 1, 91, 22, 97, 1, 1, 1, 1, 1, 91, 22, 97, 1, 1, 1, 1, 1, 306, 22, 97, 1, 1, 1, 1, 1], -30, [55, 7740, 1497, 123, 1, 1, 1, 1, 2, 1954, 927, 123, 1, 1, 1, 1, 2, 26531, 123, 1, 1, 1, 1, 2], -25, [9314, 20, 32, 71, 1, 1, 1, 18, 5463, 1, 198, 661, 1291, 1483, 119, 1, 1, 1, 1, 1, 22687, 1, 214, 1, 214, 1, 214, 1, 214, 215, 215, 215, 646, 215, 215, 215, 215, 430], -20, [11806, 2, 1, 2252, 214, 124, 1, 1, 1, 721, 124, 2396, 926, 123, 1, 1, 1, 1, 2, 20948, 215, 215, 215, 215, 215], -18, [52, 11175, 123, 1, 1, 1, 1, 2, 6345, 5818], -15, [8235, 14, 105, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 2, 952, 124, 1, 1, 1, 928, 119, 1, 1, 1, 1, 1, 1140, 2413, 214, 218, 32, 92, 288, 17, 1, 32, 92, 1166, 32, 92, 521, 32, 92, 88, 1488, 123, 1, 1, 1, 304, 123, 1, 1, 1, 20532, 215, 215, 215, 215, 215, 432, 32, 92, 73, 17, 1, 32, 92, 73, 17, 1, 32, 92, 73, 17, 1, 32, 92, 73, 17, 1, 32, 92, 1166, 32, 92, 88, 215, 215, 215, 215, 430], -10, [7363, 124, 1, 1, 1, 3098, 124, 1, 1, 1, 1157, 123, 1, 1, 1, 1, 2, 3114, 119, 1, 1, 1, 1, 1, 955, 10, 113, 1, 1, 1, 7, 1, 1, 1, 1, 2, 94, 647, 32, 92, 91, 32, 92, 1357, 14, 105, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 2, 4598, 20008, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 91, 32, 92, 306, 32, 92], -5, [15330, 119, 1, 1, 1, 1, 1, 115, 32, 92], 55, [15159]]
}, v8 = {
  name: "ZapfDingbats",
  bbox: [-1, -143, 981, 820],
  ascender: 0,
  descender: 0,
  xHeight: 0,
  capHeight: 0,
  glyphNames: "space",
  glyphWidths: [278],
  kernPairs: []
};
const oo = "./assets/NotoSansKR-Regular.ttf";
var ho;
const lo = typeof document > "u" ? void 0 : ((ho = document.currentScript) == null ? void 0 : ho.getAttribute("src")) ?? void 0;
function y8() {
  return lo ? new URL(oo, new URL(lo, document.baseURI)).href : new URL(oo, import.meta.url).href;
}
function I8(n) {
  return n == null ? "" : n instanceof Date ? n.toISOString() : typeof n == "object" ? JSON.stringify(n) : String(n);
}
const co = "grid-export.pdf", fo = "NotoSansKR", C8 = 9, wt = 5, Ys = 22, S8 = [
  l8,
  c8,
  f8,
  u8,
  h8,
  d8,
  x8,
  b8,
  p8,
  g8,
  m8,
  A8,
  w8,
  v8
], uo = Reflect.get(o8, "registerStdFonts");
typeof uo == "function" && uo(...S8);
let Ks;
function k8() {
  return Ks ?? (Ks = fetch(y8()).then((n) => {
    if (!n.ok)
      throw new Error(`Unable to load the bundled Korean PDF font: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }).catch((n) => {
    throw Ks = void 0, n;
  })), Ks;
}
class E8 {
  async convert(e, t = {}) {
    var l, f;
    if (e.columns.length === 0)
      throw new Error("PDF export requires at least one visible column");
    const r = ((l = t.customFont) == null ? void 0 : l.name) ?? t.fontName ?? fo, s = t.fontSize ?? C8, i = t.margin ?? 36;
    if (!Number.isFinite(s) || s <= 0)
      throw new RangeError("PDF fontSize must be a positive number");
    if (!Number.isFinite(i) || i < 0)
      throw new RangeError("PDF margin must be a non-negative number");
    const a = ((f = t.customFont) == null ? void 0 : f.data) ?? (!t.fontName || t.fontName === fo ? await k8() : void 0), o = new Dr({
      size: t.pageSize ?? "A4",
      layout: t.orientation ?? "landscape",
      margin: i,
      info: {
        Title: t.title ?? "Grid export",
        Author: t.author ?? ""
      }
    });
    return a && o.registerFont(r, a), o.font(r).fontSize(s), new Promise((u, c) => {
      var N, V, j, J;
      const x = [];
      o.on("data", (q) => x.push(q)), o.on("end", () => u(new Blob(x, { type: "application/pdf" }))), o.on("error", c);
      const g = o.page.width - i * 2;
      if (g <= 0 || o.page.height - i * 2 <= 0) {
        c(new RangeError("PDF margins exceed the page dimensions"));
        return;
      }
      const m = this.getColumnWidths(o, e, g, s), v = e.columns.map((q) => q.label), E = this.getRowHeight(o, v, m, s), C = e.firstPageHeader, y = (C == null ? void 0 : C.map(() => Ys)) ?? [];
      C == null || C.forEach((q, $) => q.forEach((K) => {
        const W = m.slice(K.column, K.column + K.colSpan).reduce((be, ge) => be + ge, 0), ee = this.getRowHeight(o, [K.label], [W], s), Z = $ + K.rowSpan, ae = y.slice($, Z).reduce((be, ge) => be + ge, 0);
        ee > ae && (y[Z - 1] += ee - ae);
      }));
      const A = C ? y.reduce((q, $) => q + $, 0) : E;
      if (Math.max(E, A) > o.page.height - i * 2) {
        c(new RangeError("PDF header exceeds the available page height")), o.end();
        return;
      }
      let k = i, p = k;
      const D = [], M = [], I = () => {
        for (const q of M) this.drawCellBorders(o, q.x, q.y, q.width, q.height, q.borders);
        M.length = 0;
        for (const q of D) {
          let $ = i;
          m.forEach((K, W) => {
            var ee;
            this.drawCellBorders(o, $, q.y, K, q.height, (ee = q.borders) == null ? void 0 : ee[W]), $ += K;
          });
        }
        e.tableBorders && this.drawCellBorders(o, i, p, g, k - p, e.tableBorders), D.length = 0;
      };
      t.title && (o.fontSize(s + 4).text(t.title, i, k, { width: g }), k = o.y + 10, o.fontSize(s)), k + A > o.page.height - i && (o.addPage(), k = i);
      const B = () => {
        p = k, D.push({ y: k, height: E, borders: e.headerCellBorders }), k = this.drawRow(
          o,
          v,
          m,
          i,
          k,
          s,
          !0,
          E,
          e.headerBackgrounds,
          void 0,
          void 0,
          e.headerTextColors,
          e.headerGradients
        );
      };
      if (C) {
        p = k;
        let q = k;
        C.forEach(($, K) => {
          for (const W of $) {
            const ee = i + m.slice(0, W.column).reduce((be, ge) => be + ge, 0), Z = m.slice(W.column, W.column + W.colSpan).reduce((be, ge) => be + ge, 0), ae = y.slice(K, K + W.rowSpan).reduce((be, ge) => be + ge, 0);
            this.drawRow(
              o,
              [W.label],
              [Z],
              ee,
              q,
              s,
              !0,
              ae,
              [W.background],
              void 0,
              void 0,
              [W.textColor],
              [W.gradient]
            ), M.push({ x: ee, y: q, width: Z, height: ae, borders: W.borders });
          }
          q += y[K];
        }), k = q;
      } else B();
      for (const [q, $] of e.rows.entries()) {
        const K = this.getRowHeight(o, $, m, s);
        k + K > o.page.height - i && (I(), o.addPage(), k = i, B()), D.push({ y: k, height: K, borders: (N = e.cellBorders) == null ? void 0 : N[q] }), k = this.drawRow(
          o,
          $,
          m,
          i,
          k,
          s,
          !1,
          K,
          (V = e.cellBackgrounds) == null ? void 0 : V[q],
          (j = e.cellCharts) == null ? void 0 : j[q],
          e.columns.map((W) => W.align),
          (J = e.cellTextColors) == null ? void 0 : J[q]
        );
      }
      I(), o.end();
    });
  }
  download(e, t = co) {
    dc(e, t, co, "pdf");
  }
  getColumnWidths(e, t, r, s) {
    e.fontSize(s);
    const i = t.columns.map((l, f) => {
      const u = (m) => m.split(/\r\n|\r|\n/).reduce((v, E) => Math.max(v, e.widthOfString(E)), 0), c = t.rows.reduce(
        (m, v) => Math.max(m, u(v[f] ?? "")),
        u(l.label)
      ), x = l.width, g = x !== void 0 && Number.isFinite(x) && x > 0 ? x : 40;
      return x !== void 0 && Number.isFinite(x) && x > 0 ? x : Math.max(g, c + wt * 2);
    }), a = i.reduce((l, f) => l + f, 0), o = r / a;
    return i.map((l) => l * o);
  }
  getRowHeight(e, t, r, s) {
    e.fontSize(s);
    const i = r.reduce((a, o, l) => {
      const f = e.heightOfString(t[l] ?? "", {
        width: Math.max(o - wt * 2, 1)
      });
      return Math.max(a, f);
    }, 0);
    return Math.max(Ys, i + wt * 2);
  }
  drawRow(e, t, r, s, i, a, o, l = Ys, f, u, c, x, g) {
    let m = s;
    e.fontSize(a);
    for (let v = 0; v < r.length; v++) {
      const E = r[v];
      if (o) {
        const y = g == null ? void 0 : g[v], A = y ? e.linearGradient(m, i, m, i + l).stop(0, vt(y.startColor)).stop(1, vt(y.endColor)) : vt((f == null ? void 0 : f[v]) || "#e9edf2");
        e.save().rect(m, i, E, l).fill(A).restore();
      } else {
        const y = f == null ? void 0 : f[v];
        y && e.save().fillColor(vt(y)).rect(m, i, E, l).fill().restore();
      }
      const C = u == null ? void 0 : u[v];
      C ? this.drawCellChart(e, C, m, i, E, l, a) : e.fillColor(vt((x == null ? void 0 : x[v]) || "#222222")).text(t[v] ?? "", m + wt, i + wt, {
        width: Math.max(E - wt * 2, 1),
        height: l - wt * 2,
        lineBreak: !0,
        align: o ? "center" : (c == null ? void 0 : c[v]) ?? "left"
      }), m += E;
    }
    return i + l;
  }
  drawCellChart(e, t, r, s, i, a, o) {
    const f = r + 4, u = s + 4, c = Math.max(1, i - 4 * 2), x = Math.max(1, a - 4 * 2);
    if (t.type === "bar") {
      const y = Math.min(t.minimum, t.maximum), A = Math.max(t.minimum, t.maximum), k = A - y || 1, p = Math.max(y, Math.min(A, t.value)), D = y < 0 && A > 0 ? -y / k * c : y >= 0 ? 0 : c, M = y < 0 && A > 0 ? Math.abs(p) / k * c : y >= 0 ? (p - y) / k * c : Math.abs(p - A) / k * c, I = y < 0 && A > 0 && p < 0 || A <= 0 ? f + D - M : f + D;
      e.save().fillColor(vt(t.color)).rect(I, u, M, x).fill().restore(), e.save().fillColor("#222222").fontSize(Math.min(o, 12)).text(t.label, f, u + Math.max(0, (x - o) / 2), {
        width: c,
        height: x,
        align: "center",
        lineBreak: !1
      }).restore();
      return;
    }
    const g = t.values;
    if (g.length === 0)
      return;
    const m = Math.min(...g), v = Math.max(...g), E = v - m || 1;
    if (t.type === "sparklineBar") {
      const y = c / g.length;
      g.forEach((A, k) => {
        const p = (A - m) / E * x, D = A === v ? "#28a745" : A === m ? "#dc3545" : k === 0 || k === g.length - 1 ? "#0000ff" : "#ff9900";
        e.save().fillColor(D).rect(
          f + k * y + Math.min(1, y / 4),
          u + x - p,
          Math.max(0.5, y - 2),
          p
        ).fill().restore();
      });
      return;
    }
    const C = g.map((y, A) => ({
      x: f + (g.length > 1 ? A / (g.length - 1) * c : c / 2),
      y: u + (1 - (y - m) / E) * x
    }));
    e.save().strokeColor("#007acc").lineWidth(0.75).moveTo(C[0].x, C[0].y), C.slice(1).forEach((y) => e.lineTo(y.x, y.y)), e.stroke().restore(), C.forEach((y, A) => {
      const k = g[A], p = k === v ? "#28a745" : k === m ? "#dc3545" : A === 0 || A === g.length - 1 ? "#0000ff" : "#ff9900";
      e.save().fillColor(p).circle(y.x, y.y, 1.875).fill().restore();
    });
  }
  drawCellBorders(e, t, r, s, i, a) {
    const o = a ?? { right: { color: "#cdcdcd", width: 1 }, bottom: { color: "#cdcdcd", width: 1 } };
    for (const [l, f] of Object.entries(o)) {
      if (!f || !Number.isFinite(f.width) || f.width <= 0)
        continue;
      const u = l === "top" || l === "bottom" ? [t, l === "top" ? r : r + i] : [l === "left" ? t : t + s, r], c = l === "top" || l === "bottom" ? [t + s, l === "top" ? r : r + i] : [l === "left" ? t : t + s, r + i], x = f.width * 72 / 96;
      if (e.save().strokeColor(vt(f.color)).lineWidth(x), f.style === "dashed" ? e.dash(x * 3, { space: x * 3 }) : f.style === "dotted" ? e.lineCap("round").dash(0.01, { space: x * 2 }) : e.undash(), f.style === "double") {
        const g = l === "top" || l === "bottom";
        e.lineWidth(x / 3);
        for (const m of [-x / 3, x / 3])
          e.moveTo(u[0] + (g ? 0 : m), u[1] + (g ? m : 0)).lineTo(c[0] + (g ? 0 : m), c[1] + (g ? m : 0)).stroke();
      } else
        e.moveTo(u[0], u[1]).lineTo(c[0], c[1]).stroke();
      e.restore();
    }
  }
}
function vt(n) {
  const e = n.match(/^rgba?\((.*)\)$/i);
  if (!e)
    return n;
  const t = e[1].split(/[,\s/]+/).filter(Boolean);
  if (t.length < 3 || t.length > 4)
    return n;
  const r = t.slice(0, 3).map((o) => {
    const l = Number.parseFloat(o), f = o.endsWith("%") ? l * 255 / 100 : l;
    return Math.max(0, Math.min(255, f));
  }), s = t[3], i = s === void 0 ? 1 : Math.max(0, Math.min(1, s.endsWith("%") ? Number.parseFloat(s) / 100 : Number.parseFloat(s)));
  return `#${r.map((o) => Math.round(o * i + 255 * (1 - i))).map((o) => o.toString(16).padStart(2, "0")).join("")}`;
}
export {
  E8 as PdfConverter,
  I8 as normalizePdfCellValue,
  vt as normalizePdfColor
};
