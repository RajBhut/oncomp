import Docker from "dockerode";

const docker = new Docker();

const checkAndPullImage = async (imageName) => {
  try {
    const images = await docker.listImages({
      filters: { reference: [imageName] },
    });

    if (images.length === 0) {
      await new Promise((resolve, reject) => {
        docker.pull(imageName, (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (err, res) =>
            err ? reject(err) : resolve(res)
          );
        });
      });

      console.log("done with pulling");
    } else {
      console.log("done without pulling");
    }
  } catch (error) {
    console.error(`Error checking/pulling image ${imageName}:`, error);
    throw error;
  }
};
export { checkAndPullImage };
