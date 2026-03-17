import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ValidationFlowDiagram from "./ValidationFlowDiagram";

export default function ValidationHeader() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative h-screen flex flex-col justify-center px-8 bg-card overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="fbm-badge-primary mb-4 block w-fit">The Synthesis</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
            8 validation layers.
            <br />
            <span className="text-primary">Hybrid intelligence.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-roboto max-w-2xl">
            Deterministic rules for binary checks. AI only where human judgment is needed.
            Every AI decision includes written justification.
          </p>
        </motion.div>

        <ValidationFlowDiagram
          activeStage={null}
          activeLayerId={null}
          onStageClick={() => {}}
          onLayerClick={() => {}}
        />
      </div>
    </section>
  );
}
