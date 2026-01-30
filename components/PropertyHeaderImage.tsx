import Image from 'next/image';

interface PropertyHeaderImageProps {
  image: string;
  alt: string;
}

const PropertyHeaderImage = ({ image, alt }: PropertyHeaderImageProps) => {
  return (
    <section>
      <div className="container-xl m-auto">
        <div className="grid grid-cols-1">
          <Image
            src={image}
            alt={alt}
            className="object-cover h-100 w-full"
            width={0}
            height={0}
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
};

export default PropertyHeaderImage;
