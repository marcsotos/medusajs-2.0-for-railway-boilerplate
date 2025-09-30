import React from "react"
import { Container, Heading, Text } from "@medusajs/ui"

type Feature = {
  icon: string
  title: string
  description: string
}

type PromoBannerProps = {
  title?: string
  features?: Feature[]
  className?: string
}

const defaultFeatures: Feature[] = [
  {
    icon: "🌱",
    title: "100% Natural",
    description: "Productos orgánicos sin químicos ni aditivos artificiales",
  },
  {
    icon: "🚚",
    title: "Envío Gratis",
    description: "En pedidos superiores a 50€ a toda España",
  },
  {
    icon: "⭐",
    title: "Calidad Garantizada",
    description: "Miles de clientes satisfechos nos respaldan",
  },
]

const PromoBanner: React.FC<PromoBannerProps> = ({
  title = "¿Por qué elegir Mono Banano?",
  features = defaultFeatures,
  className = "",
}) => {
  return (
    <div
      className={`bg-ui-bg-subtle py-12 ${className}`}
      data-testid="promo-banner"
    >
      <Container className="content-container">
        <div className="text-center">
          <Heading
            level="h2"
            className="text-ui-fg-base mb-4"
            data-testid="promo-banner-title"
          >
            {title}
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                data-testid={`promo-feature-${index}`}
              >
                <Container className="w-16 h-16 bg-ui-bg-base rounded-full flex items-center justify-center shadow-elevation-card-rest mb-4">
                  <Text
                    size="xlarge"
                    className="text-3xl"
                    aria-label={feature.title}
                  >
                    {feature.icon}
                  </Text>
                </Container>

                <Text
                  weight="plus"
                  size="large"
                  className="text-ui-fg-base mb-2"
                >
                  {feature.title}
                </Text>

                <Text size="small" className="text-ui-fg-subtle text-center">
                  {feature.description}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default PromoBanner