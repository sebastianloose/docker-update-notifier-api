import axios from "axios";

const baseUrl = "https://hub.docker.com/v2";

const getLatestTag = async (
  organization: string,
  repository: string
): Promise<{ [key: string]: any }> => {
  try {
    const res = await axios.get(
      `${baseUrl}/repositories/${organization}/${repository}/tags/latest`
    );
    return res.data;
  } catch (error) {
    return {};
  }
};

export { getLatestTag };
