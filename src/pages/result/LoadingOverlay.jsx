const LoadingOverlay = () => {
  return (
    <div className="absolute z-[9999] flex h-screen w-screen flex-col items-center justify-center">
      <img src="./image_asset/brand/brand_logo.png" className="mb-2 h-12 w-12" />
      <small>loading..</small>
    </div>
  );
};

export default LoadingOverlay;
