const BREVO_API_URL =
  "https://api.brevo.com/v3/smtp/email";

const BREVO_ACCOUNT_URL =
  "https://api.brevo.com/v3/account";

const getSenderEmail = () => {
  return (
    process.env.EMAIL_USER ||
    ""
  ).trim();
};

const getSenderName = () => {
  return (
    process.env.BREVO_SENDER_NAME ||
    "Kalley CodeLabs"
  ).trim();
};

const normalizeRecipients = (to) => {
  if (!to) {
    return [];
  }

  if (typeof to === "string") {
    return [
      {
        email: to.trim(),
      },
    ];
  }

  if (Array.isArray(to)) {
    return to
      .map((recipient) => {
        if (
          typeof recipient ===
          "string"
        ) {
          return {
            email:
              recipient.trim(),
          };
        }

        if (
          recipient &&
          typeof recipient ===
            "object"
        ) {
          return {
            email:
              String(
                recipient.email ||
                  ""
              ).trim(),

            ...(recipient.name
              ? {
                  name:
                    recipient.name,
                }
              : {}),
          };
        }

        return null;
      })
      .filter(
        (recipient) =>
          recipient &&
          recipient.email
      );
  }

  if (
    typeof to === "object" &&
    to.email
  ) {
    return [
      {
        email:
          String(
            to.email
          ).trim(),

        ...(to.name
          ? {
              name: to.name,
            }
          : {}),
      },
    ];
  }

  return [];
};

const createTimeoutSignal = (
  milliseconds
) => {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, milliseconds);

  return {
    signal: controller.signal,
    clear: () =>
      clearTimeout(timeout),
  };
};

const sendMail = async (options) => {
  const apiKey =
    process.env.BREVO_API_KEY;

  const senderEmail =
    getSenderEmail();

  const senderName =
    getSenderName();

  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY is not configured."
    );
  }

  if (!senderEmail) {
    throw new Error(
      "EMAIL_USER is not configured."
    );
  }

  if (
    !options ||
    !options.to
  ) {
    throw new Error(
      "Email recipient is missing."
    );
  }

  if (
    !options.subject
  ) {
    throw new Error(
      "Email subject is missing."
    );
  }

  const recipients =
    normalizeRecipients(
      options.to
    );

  if (
    recipients.length === 0
  ) {
    throw new Error(
      "Valid email recipient is required."
    );
  }

  /*
   * Brevo supports static HTML or text
   * content through the transactional
   * email endpoint.
   *
   * We prefer the existing HTML body
   * used by the current OTP system.
   */

  const emailBody =
    options.html ||
    options.text ||
    "";

  if (!emailBody) {
    throw new Error(
      "Email content is missing."
    );
  }

  const requestBody = {
    sender: {
      name: senderName,
      email: senderEmail,
    },

    to: recipients,

    subject:
      options.subject,

    ...(options.html
      ? {
          htmlContent:
            options.html,
        }
      : {
          textContent:
            options.text,
        }),

    ...(options.replyTo
      ? {
          replyTo: {
            email:
              typeof options.replyTo ===
              "string"
                ? options.replyTo
                : options.replyTo
                    .email,
          },
        }
      : {}),
  };

  const timeout =
    createTimeoutSignal(
      30000
    );

  try {
    const response =
      await fetch(
        BREVO_API_URL,
        {
          method: "POST",

          headers: {
            accept:
              "application/json",

            "api-key":
              apiKey,

            "content-type":
              "application/json",
          },

          body: JSON.stringify(
            requestBody
          ),

          signal:
            timeout.signal,
        }
      );

    const responseText =
      await response.text();

    let responseData =
      {};

    try {
      responseData =
        responseText
          ? JSON.parse(
              responseText
            )
          : {};
    } catch {
      responseData = {
        raw: responseText,
      };
    }

    if (!response.ok) {
      const apiMessage =
        responseData?.message ||
        responseData?.code ||
        "Brevo email sending failed.";

      const error =
        new Error(
          apiMessage
        );

      error.status =
        response.status;

      error.details =
        responseData;

      throw error;
    }

    console.log(
      "Brevo email sent successfully"
    );

    /*
     * This keeps the return structure
     * reasonably compatible with the
     * previous Nodemailer usage.
     */

    return {
      accepted:
        recipients.map(
          (recipient) =>
            recipient.email
        ),

      rejected: [],

      messageId:
        responseData?.messageId ||
        null,

      response:
        responseData,
    };
  } catch (error) {
    if (
      error.name ===
      "AbortError"
    ) {
      throw new Error(
        "Brevo email request timed out."
      );
    }

    console.error(
      "Brevo email error:",
      error.message
    );

    throw error;
  } finally {
    timeout.clear();
  }
};

/*
 * Keep a verify() method so the existing
 * OTP/email code can continue using the
 * same transporter-style object.
 */

const verify = async (
  callback
) => {
  const apiKey =
    process.env.BREVO_API_KEY;

  const senderEmail =
    getSenderEmail();

  try {
    if (!apiKey) {
      throw new Error(
        "BREVO_API_KEY is not configured."
      );
    }

    if (!senderEmail) {
      throw new Error(
        "EMAIL_USER is not configured."
      );
    }

    const timeout =
      createTimeoutSignal(
        15000
      );

    try {
      const response =
        await fetch(
          BREVO_ACCOUNT_URL,
          {
            method: "GET",

            headers: {
              accept:
                "application/json",

              "api-key":
                apiKey,
            },

            signal:
              timeout.signal,
          }
        );

      const responseText =
        await response.text();

      let responseData =
        {};

      try {
        responseData =
          responseText
            ? JSON.parse(
                responseText
              )
            : {};
      } catch {
        responseData = {};
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            "Unable to verify Brevo API credentials."
        );
      }
    } finally {
      timeout.clear();
    }

    console.log(
      "Brevo email API is ready"
    );

    if (callback) {
      callback(
        null,
        true
      );
    }

    return true;
  } catch (error) {
    console.error(
      "Brevo email verification error:",
      error.message
    );

    if (callback) {
      callback(
        error
      );
    }

    return false;
  }
};

const transporter = {
  sendMail,
  verify,
};

verify();

module.exports =
  transporter;