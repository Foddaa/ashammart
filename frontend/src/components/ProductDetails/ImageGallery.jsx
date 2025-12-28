export default function ImageGallery({ images, mainImage, setMainImage, title }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-2">
      {/* Main image */}
      <div className="flex-1 flex items-center justify-center border rounded-md border-gray-300 max-h-[600px] ">
        <img
          src={mainImage}
          className="object-contain w-full h-full max-h-[500px] transition-all duration-300"
          alt={title}
          loading="lazy"
        />
      </div>

      {/* Thumbnails - vertical on desktop, horizontal on mobile */}
      <div className="flex lg:flex-col gap-3 items-center justify-center lg:justify-start overflow-x-auto">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.url}
            onClick={() => setMainImage(img.url)}
            className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer transition-all duration-200
              ${mainImage === img.url
                ? "border-blue-700 ring-2 ring-blue-300"
                : "border-gray-200 hover:border-blue-400"
              }`}
            alt={`Thumbnail ${i + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
