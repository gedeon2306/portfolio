import { useState } from "react";
import type { FormEvent } from "react";
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { useScrollReveal } from "./useScrollReveal";
import { useToast } from "../context/ToastContext";
import { useQuery } from "@tanstack/react-query";
import { getContact } from "../api/Actions";
import Spinner from "./Spinner";
import logoJdBlanc from "../assets/logo_jd_blanc_sbg.png";
import "../css/Contact.css";

export default function Contact() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const toast = useToast();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { data: contactData, isLoading, error } = useQuery({
    queryKey: ['contact'],
    queryFn: getContact,
  });

  if (error) {
    console.error("Erreur lors du chargement des informations de contact:", error);
  }

  const handleChange =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (status === "error" || status === "sent") {
        setStatus("idle");
      }
    };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast.success("Copié !", `${label} a été copié dans le presse-papier.`);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.email || !values.message) {
      toast.error("Formulaire incomplet", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStatus("sending");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("sent");
      toast.success(
        "Message envoyé avec succès !",
        `Merci ${values.name}, je vous répondrai dans les plus brefs délais.`
      );
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      toast.error(
        "Erreur d'envoi",
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      );
    }
  };

  const contactInfo = [
    { 
      icon: FiMail, 
      label: "Email Professionnel", 
      value: contactData?.email || "", 
      canCopy: true
    },
    { 
      icon: FiMapPin, 
      label: "Localisation", 
      value: contactData?.localisation || "", 
      canCopy: false
    },
    { 
      icon: FiPhone, 
      label: "Téléphone", 
      value: contactData?.telephone || "", 
      canCopy: true
    },
  ];

  const socials = [
    { icon: FiGithub, href: contactData?.github || null, label: "GitHub" },
    { icon: FiLinkedin, href: contactData?.linkedin || null, label: "LinkedIn" },
    { icon: FaXTwitter, href: contactData?.twitter_x || null, label: "Twitter / X" },
    { icon: FaInstagram, href: contactData?.instagram || null, label: "Instagram" },
    { icon: FaTiktok, href: contactData?.tik_tok || null, label: "Instagram" },
  ];

  return (
    <section id="contact" className="pf-contact">
      <div className="pf-container">
        <div className="pf-section-header">
          <span className="pf-eyebrow">Contact & Collaboration</span>
          <h2 className="pf-section-title">Discutons de votre projet</h2>
          <p className="pf-section-subtitle">
            Vous avez une idée, une opportunité ou un défi technique à relever ? Écrivez-moi et donnons vie à vos ambitions.
          </p>
        </div>

        <div ref={revealRef} className="pf-contact-grid pf-reveal">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p>Chargement des informations de contact...</p>
            </div>
          ) : (
            <>
              <div className="pf-contact-info">
                <div className="pf-contact-info-header">
                  <img
                    src={logoJdBlanc}
                    alt="JihrelDev logo"
                    className="pf-logo-mark pf-logo-mark-image"
                  />
                  <div>
                    <h3>
                      Jihrel <span className="pf-contact-name-highlight">Dev</span>
                    </h3>
                    <p>{contactData?.profession || "Développeur Full-Stack"}</p>
                  </div>
                </div>

                <p className="pf-contact-lead">
                  Disponible immédiatement pour des missions freelance, contrats ou collaborations techniques exigeantes.
                </p>

                <ul className="pf-contact-list">
                  {contactInfo.map((item) => {
                    const isCopied = copiedItem === item.label;

                    return (
                      <li
                        key={item.label}
                        className={`pf-contact-item ${item.canCopy ? "clickable" : ""}`}
                        onClick={() => item.canCopy && handleCopy(item.value, item.label)}
                        title={item.canCopy ? "Cliquer pour copier" : undefined}
                      >
                        <div className="pf-contact-icon">
                          <item.icon size={17} />
                        </div>
                        <div className="pf-contact-details">
                          <span className="pf-contact-label font-mono">{item.label}</span>
                          <span className="pf-contact-value">{item.value}</span>
                        </div>
                        {item.canCopy && (
                          <span className="pf-item-copy-indicator" aria-hidden="true">
                            {isCopied ? <FiCheck size={14} className="copied-icon" /> : <FiCopy size={13} />}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="pf-contact-socials-wrap">
                  <span className="pf-socials-title font-mono">Retrouvez-moi sur les réseaux</span>
                  <div className="pf-contact-socials">
                    {socials.map((social) => (
                      social.href && (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="pf-icon-btn"
                          aria-label={social.label}
                          title={social.label}
                        >
                          <social.icon size={16} />
                        </a>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div className="pf-contact-form-wrap">
                <form className="pf-contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="pf-form-row">
                    <div className="field">
                      <label htmlFor="contact-name">Nom complet *</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Jean Dupont"
                        value={values.name}
                        onChange={handleChange("name")}
                        required
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="contact-email">Adresse email *</label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="jean@exemple.com"
                        value={values.email}
                        onChange={handleChange("email")}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="contact-subject">Sujet du projet</label>
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="Création d'une application web, refonte UI..."
                      value={values.subject}
                      onChange={handleChange("subject")}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="contact-message">Votre message *</label>
                    <textarea
                      id="contact-message"
                      placeholder="Décrivez brièvement vos besoins, délais et attentes techniques..."
                      value={values.message}
                      onChange={handleChange("message")}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="pf-form-footer">
                    <button
                      type="submit"
                      className="btn btn-primary pf-contact-submit"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? (
                        <>
                          <Spinner size={16} color="#ffffff" />
                          <span>Transmission en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>Envoyer le message</span>
                          <FiSend size={15} />
                        </>
                      )}
                    </button>

                    {status === "sent" && (
                      <div className="pf-form-alert pf-alert-success">
                        <FiCheck size={16} />
                        <span>Votre message a été transmis avec succès !</span>
                      </div>
                    )}

                    {status === "error" && (
                      <div className="pf-form-alert pf-alert-error">
                        <span>Une erreur est survenue, veuillez réessayer.</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}