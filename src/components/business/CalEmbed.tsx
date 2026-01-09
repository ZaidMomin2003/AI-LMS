'use client';

import React, { useEffect } from 'react';
import { Card } from '../ui/card';

export function CalEmbed() {
  useEffect(() => {
    (function (C, A, L) {
      let p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      let d = C.document;
      // @ts-ignore
      C.Cal = C.Cal || function () {
        // @ts-ignore
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          (d.head.appendChild(d.createElement("script")) as any).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () {
            // @ts-ignore
            p(api, arguments);
          };
          const namespace = ar[1];
          // @ts-ignore
          api.q = api.q || [];
          if (typeof namespace === "string") {
            // @ts-ignore
            cal.ns[namespace] = cal.ns[namespace] || api;
            // @ts-ignore
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    // @ts-ignore
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // @ts-ignore
    Cal("init", "wisdom-is-fun-collab", { origin: "https://app.cal.com" });

    // @ts-ignore
    Cal.ns["wisdom-is-fun-collab"]("inline", {
      elementOrSelector: "#my-cal-inline-wisdom-is-fun-collab",
      config: { layout: "month_view" },
      calLink: "zaid-momin-st0o8z/wisdom-is-fun-collab",
    });

    // @ts-ignore
    Cal.ns["wisdom-is-fun-collab"]("ui", {
      "styles": { "branding": { "brandColor": "#000000" } },
      "hideEventTypeDetails": false,
      "layout": "month_view"
    });
  }, []);

  return (
    <Card className="p-2 shadow-xl">
        <div style={{ width: '100%', height: '100%', overflow: 'scroll' }} id="my-cal-inline-wisdom-is-fun-collab"></div>
    </Card>
  );
}
