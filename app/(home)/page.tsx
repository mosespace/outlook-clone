import Iframe from "react-iframe";
import PlainFeatures from "@/components/frontend/features";
import TabbedFeatures from "@/components/frontend/tabbed-features";
import TechStackGrid from "@/components/frontend/Techstack";
import { GridBackground } from "@/components/reusable-ui/grid-background";
import ProjectComparison from "@/components/reusable-ui/project-comparison";
import RadialFeature from "@/components/reusable-ui/radial-features";
import ReUsableHero from "@/components/reusable-ui/reusable-hero";
import {
  Award,
  Github,
  Code,
  Code2,
  History,
  Sprout,
  Folder,
} from "lucide-react";
import React from "react";
import Showcase from "@/components/frontend/showcase";
import PricingCard from "@/components/frontend/single-tier-pricing";
import FAQ from "@/components/frontend/FAQ";
import CustomizationCard from "@/components/frontend/customisation-card";
import Image from "next/image";
import { BorderBeam } from "@/components/magicui/border-beam";

export default async function page() {
  return (
    <section>
      <ReUsableHero
        theme="dark"
        title={
          <>
            Your Complete Fullstack
            <br />
            Starter Kit
          </>
        }
        mobileTitle="Your Complete Fullstack Starter Kit"
        subtitle="Save endless hours of development time and focus on what's important for your customers. Get everything you need to launch your SaaS like auth, payments, i18n, mails and more."
        buttons={[
          {
            label: "Our Story",
            href: "#story",
            primary: true,
          },
          {
            label: "Meet Our Team",
            href: "#team",
          },
        ]}
        icons={[
          { icon: Code2, position: "left" },
          { icon: Github, position: "right" },
          { icon: Folder, position: "center" },
        ]}
        backgroundStyle="neutral"
        className="min-h-[70vh]"
      />
      <GridBackground>
        <div className="px-8 py-16 ">
          <TechStackGrid />
        </div>
      </GridBackground>
      <div className="py-16 max-w-6xl mx-auto px-8">
        <div className="relative rounded-lg overflow-hidden">
          <BorderBeam />
          <Image
            src="/images/dash-2.webp"
            alt="This is the dashbaord Image"
            width={1775}
            height={1109}
            className="w-full h-full rounded-lg object-cover  border shadow-2xl"
          />
        </div>
      </div>
      <div className="py-16 px-8 ">
        <ProjectComparison className="max-w-6xl mx-auto" />
      </div>
      <div className="max-w-7xl p-8 mx-auto">
        <TabbedFeatures />
      </div>
      <div className="py-8">
        <PlainFeatures />
      </div>
      <div className="py-16 max-w-6xl mx-auto relative">
        <Iframe
          url="https://www.youtube.com/embed/_s50xGEADXY?si=woZtHl_qneJHxWD6"
          width="100%"
          id=""
          className="h-[30rem] rounded-sm"
          display="block"
          position="relative"
        />
        <div className="pb-16">
          <Showcase />
        </div>
        <div className="py-8">
          <PricingCard />
        </div>
        <div className="py">
          <CustomizationCard theme="light" />
        </div>
      </div>
      <FAQ />
    </section>
  );
}
