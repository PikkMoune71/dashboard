"use client";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { TaskItem } from "@/components/TaskItem";
import { Task } from "@/types/Task";
import { Project } from "@/types/Project";
import { DraggableProvided } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const exampleTask: Task = {
    id: "1",
    title: "Créer la maquette du site",
    description:
      "Préparer la maquette du site avec Figma pour la prochaine réunion",
    status: "inProgress",
    projectId: "proj-123",
    startDate: "2025-02-26",
    endDate: "2025-03-01",
    timeSpent: [3600, 7200],
  };

  const exampleProject: Project = {
    id: "proj-123",
    title: "Refonte du site web",
    slug: "refonte-site-web",
  };

  const exampleProvided = {
    draggableProps: {},
    dragHandleProps: {},
    innerRef: () => {},
  } as DraggableProvided;

  const exampleTimeSpent = [3600, 7200];

  return (
    <div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-400 opacity-30 blur-3xl rounded-full"></div>
        <div className="absolute top-10 left-10 w-full h-full bg-indigo-300 opacity-30 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 opacity-30 blur-3xl rounded-full"></div>
      </div>
      <div className="grid grid-rows-[10px_1fr_10px] items-center min-h-screen md:p-10 p-5 pb-20 gap-10 font-[family-name:var(--font-geist-sans)]">
        <header className="row-start-1 flex justify-between items-center gap-4">
          <Logo width={150} />
          <div className="sm:hidden">
            <button onClick={toggleMenu} className="text-xl">
              <Menu />
            </button>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 w-full bg-white p-10 flex flex-col gap-4 items-center sm:hidden"
              >
                <button onClick={toggleMenu} className="absolute top-4 right-4">
                  <X />
                </button>
                <li>
                  <a href="#">Features</a>
                </li>
                <li>
                  <a href="#">Solutions</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li className="flex gap-4">
                  <Button>
                    <Link href="/login">Connexion</Link>
                  </Button>

                  <Button variant="outline">
                    <Link href="/register">Inscription</Link>
                  </Button>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
          <div className="hidden sm:flex gap-4">
            <ul className="flex gap-4">
              <li>
                <Link href="#">Features</Link>
              </li>
              <li>
                <Link href="#">Solutions</Link>
              </li>
              <li>
                <Link href="#">Pricing</Link>
              </li>
            </ul>
          </div>
          <div className="hidden sm:flex gap-4">
            <Button>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button variant="outline">
              <Link href="/register">Inscription</Link>
            </Button>
          </div>
        </header>

        <main className="flex flex-col gap-8 row-start-2 items-center">
          <motion.div
            initial={{ rotate: -180, opacity: 0, y: -300 }}
            animate={{ rotate: 0, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo isIcon width={150} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-semibold text-center"
          >
            Simplifiez la gestion de vos projets,
            <br />
            <span className="text-primary">boostez </span>votre productivité
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-lg text-center"
          >
            Gérez vos tâches, votre planning, atteignez vos objectifs
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="text-lg text-center"
          >
            <Button className="p-6">
              <Link href="/register" className="text-xl">
                Commencer
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: -20, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="md:absolute md:left-10 md:top-40 z-[-1]"
          >
            <TaskItem
              task={exampleTask}
              project={exampleProject}
              provided={exampleProvided}
              timeSpent={exampleTimeSpent}
              icon="🚧"
            />
          </motion.div>
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 20, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="md:absolute md:right-10 md:top-40 mt-10 z-[-1]"
          >
            <Image
              src="/timer.svg"
              width={300}
              height={500}
              alt="Timer illustration"
            />
          </motion.div>

          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: -15, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="md:absolute md:right-10 md:bottom-20 z-[-1]"
          >
            <Image
              src="/done_list.png"
              width={400}
              height={400}
              alt="Timer illustration"
            />
          </motion.div>
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 15, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="md:absolute md:left-10 md:bottom-20 z-[-1]"
          >
            <Image
              src="/todo_list.png"
              width={400}
              height={400}
              alt="Timer illustration"
            />
          </motion.div>
        </main>

        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
      </div>
    </div>
  );
}
